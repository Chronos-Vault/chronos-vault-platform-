import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { insertValidatorSchema, insertValidatorAttestationSchema } from '@shared/schema';
import { z } from 'zod';
import { ethers } from 'ethers';
import config from '../config';

const router = Router();

const registrationSchema = insertValidatorSchema.extend({
  walletAddress: z.string().refine((addr) => {
    try {
      return ethers.isAddress(addr);
    } catch {
      return false;
    }
  }, 'Invalid Ethereum wallet address')
});

const attestationSubmitSchema = insertValidatorAttestationSchema.extend({
  quote: z.string().min(1, 'Attestation quote is required'),
  reportData: z.string().min(1, 'Report data is required')
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, role } = req.query;
    
    let validators;
    if (status && typeof status === 'string') {
      validators = await storage.getValidatorsByStatus(status);
    } else if (role && typeof role === 'string') {
      validators = await storage.getValidatorsByRole(role);
    } else {
      validators = await storage.getAllValidators();
    }
    
    res.json({
      success: true,
      validators,
      count: validators.length
    });
  } catch (error: any) {
    console.error('Failed to fetch validators:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    const attestations = await storage.getAttestationsByValidator(id);
    const statusEvents = await storage.getValidatorStatusEvents(id);
    
    res.json({
      success: true,
      validator,
      attestations,
      statusHistory: statusEvents
    });
  } catch (error: any) {
    console.error('Failed to fetch validator:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/wallet/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ success: false, error: 'Invalid wallet address' });
    }
    
    const validator = await storage.getValidatorByWallet(address.toLowerCase());
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    const attestations = await storage.getAttestationsByValidator(validator.id);
    const latestAttestation = attestations[0];
    
    res.json({
      success: true,
      validator,
      latestAttestation,
      attestationCount: attestations.length
    });
  } catch (error: any) {
    console.error('Failed to fetch validator by wallet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: parsed.error.errors 
      });
    }
    
    const data = parsed.data;
    const normalizedAddress = data.walletAddress.toLowerCase();
    
    const existing = await storage.getValidatorByWallet(normalizedAddress);
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        error: 'A validator with this wallet address already exists',
        existingId: existing.id
      });
    }
    
    const validator = await storage.createValidator({
      ...data,
      walletAddress: normalizedAddress
    });
    
    res.status(201).json({
      success: true,
      message: 'Validator registered successfully',
      validator,
      nextSteps: {
        step1: 'Configure your TEE hardware following the Hardware Setup Guide',
        step2: 'Generate an attestation report using Trinity Shield CLI',
        step3: 'Submit attestation via POST /api/validators/:id/attestation',
        step4: 'Wait for on-chain verification (typically 5-10 minutes)'
      }
    });
  } catch (error: any) {
    console.error('Failed to register validator:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    const allowedFields = ['organizationName', 'operatorEmail', 'hardwareModel', 
                          'hardwareVendor', 'region', 'consensusRole',
                          'mrenclave', 'measurement'];
    
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }
    
    const updated = await storage.updateValidator(id, updates);
    
    res.json({
      success: true,
      message: 'Validator updated successfully',
      validator: updated
    });
  } catch (error: any) {
    console.error('Failed to update validator:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    if (validator.status !== 'draft') {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot submit from status '${validator.status}'. Only draft validators can be submitted.`
      });
    }
    
    if (!validator.hardwareModel || !validator.teeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required hardware information. Please update hardwareModel and ensure teeType is set.'
      });
    }
    
    const updated = await storage.updateValidatorStatus(id, 'submitted', 'Validator submitted for attestation review');
    
    res.json({
      success: true,
      message: 'Validator submitted for review',
      validator: updated,
      nextStep: 'Submit attestation proof via POST /api/validators/:id/attestation'
    });
  } catch (error: any) {
    console.error('Failed to submit validator:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/attestation', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    if (validator.status !== 'submitted' && validator.status !== 'attesting') {
      return res.status(400).json({
        success: false,
        error: `Cannot submit attestation in status '${validator.status}'. Submit the validator first.`
      });
    }
    
    const parsed = attestationSubmitSchema.safeParse({
      validatorId: id,
      ...req.body
    });
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.errors
      });
    }
    
    const reportData = parsed.data.reportData;
    if (reportData.length >= 64) {
      const extractedAddress = '0x' + reportData.substring(24, 64);
      if (extractedAddress.toLowerCase() !== validator.walletAddress.toLowerCase()) {
        return res.status(400).json({
          success: false,
          error: 'Report data address mismatch. reportData[12:32] must match validator wallet address.'
        });
      }
    }
    
    const attestation = await storage.createValidatorAttestation(parsed.data);
    
    await storage.updateValidatorStatus(id, 'attesting', 'Attestation submitted, pending verification');
    
    res.status(201).json({
      success: true,
      message: 'Attestation submitted successfully',
      attestation,
      nextStep: 'Attestation will be verified on-chain via TrinityShieldVerifierV2. Check status for updates.'
    });
  } catch (error: any) {
    console.error('Failed to submit attestation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/attestations', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    const attestations = await storage.getAttestationsByValidator(id);
    
    res.json({
      success: true,
      validatorId: id,
      attestations,
      count: attestations.length
    });
  } catch (error: any) {
    console.error('Failed to fetch attestations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/approve', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { actorAddress, reason } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    if (validator.status !== 'attesting') {
      return res.status(400).json({
        success: false,
        error: `Cannot approve from status '${validator.status}'. Validator must be in 'attesting' status.`
      });
    }
    
    const latestAttestation = await storage.getLatestAttestation(id);
    if (!latestAttestation || latestAttestation.verificationStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        error: 'Cannot approve without a verified attestation. Verify on-chain first.'
      });
    }
    
    const updated = await storage.updateValidatorStatus(
      id, 
      'approved', 
      reason || 'Validator approved by admin after attestation verification',
      actorAddress
    );
    
    res.json({
      success: true,
      message: 'Validator approved',
      validator: updated
    });
  } catch (error: any) {
    console.error('Failed to approve validator:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/reject', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { actorAddress, reason } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    if (!reason) {
      return res.status(400).json({ success: false, error: 'Rejection reason is required' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    const updated = await storage.updateValidatorStatus(
      id,
      'rejected',
      reason,
      actorAddress
    );
    
    res.json({
      success: true,
      message: 'Validator rejected',
      validator: updated
    });
  } catch (error: any) {
    console.error('Failed to reject validator:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid validator ID' });
    }
    
    const validator = await storage.getValidator(id);
    if (!validator) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    const statusEvents = await storage.getValidatorStatusEvents(id);
    
    res.json({
      success: true,
      validatorId: id,
      statusHistory: statusEvents,
      currentStatus: validator.status
    });
  } catch (error: any) {
    console.error('Failed to fetch status history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/summary', async (req: Request, res: Response) => {
  try {
    const allValidators = await storage.getAllValidators();
    
    const stats = {
      total: allValidators.length,
      byStatus: {
        draft: 0,
        submitted: 0,
        attesting: 0,
        approved: 0,
        rejected: 0,
        suspended: 0
      },
      byTeeType: {
        sgx: 0,
        sev: 0,
        quantum: 0
      },
      byConsensusRole: {
        arbitrum: 0,
        solana: 0,
        ton: 0
      }
    };
    
    for (const v of allValidators) {
      if (v.status in stats.byStatus) {
        stats.byStatus[v.status as keyof typeof stats.byStatus]++;
      }
      if (v.teeType && v.teeType in stats.byTeeType) {
        stats.byTeeType[v.teeType as keyof typeof stats.byTeeType]++;
      }
      if (v.consensusRole && v.consensusRole in stats.byConsensusRole) {
        stats.byConsensusRole[v.consensusRole as keyof typeof stats.byConsensusRole]++;
      }
    }
    
    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('Failed to fetch validator stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
