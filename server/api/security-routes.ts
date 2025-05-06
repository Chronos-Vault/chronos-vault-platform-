/**
 * Security API Routes
 * 
 * Exposes advanced security features through REST API endpoints.
 */

import { Express, Request, Response } from 'express';
import { securityServiceManager, SecurityFeature } from '../security/security-service-manager';
import { zeroKnowledgeShield, ZkProofType } from '../security/zero-knowledge-shield';
import { quantumResistantEncryption, QuantumResistantAlgorithm } from '../security/quantum-resistant-encryption';
import { behavioralAnalysisSystem, RiskLevel } from '../security/behavioral-analysis-system';
import { multiSignatureGateway, ApprovalType, ApprovalStatus } from '../security/multi-signature-gateway';
import { dataPersistenceService } from '../security/data-persistence-service';

// Middleware to ensure admin access
const requireAdmin = (req: Request, res: Response, next: Function) => {
  // In a real implementation, check if the user has admin privileges
  const isAdmin = req.session?.userRole === 'admin' || req.headers['x-admin-key'] === process.env.ADMIN_API_KEY;
  
  if (!isAdmin) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required for this operation'
    });
  }
  
  next();
};

/**
 * Register security-related API routes
 */
export function registerSecurityRoutes(app: Express): void {
  // Apply security middleware to all routes
  app.use(securityServiceManager.createSecurityMiddleware());
  
  // Security health check endpoint
  app.get('/api/security/health', (req: Request, res: Response) => {
    const metrics = securityServiceManager.getSecurityMetrics();
    
    res.json({
      status: 'operational',
      features: {
        zeroKnowledgePrivacy: securityServiceManager.isFeatureEnabled(SecurityFeature.ZERO_KNOWLEDGE_PRIVACY),
        quantumResistantEncryption: securityServiceManager.isFeatureEnabled(SecurityFeature.QUANTUM_RESISTANT_ENCRYPTION),
        behavioralAnalysis: securityServiceManager.isFeatureEnabled(SecurityFeature.BEHAVIORAL_ANALYSIS),
        multiSignature: securityServiceManager.isFeatureEnabled(SecurityFeature.MULTI_SIGNATURE),
        dataPersistence: securityServiceManager.isFeatureEnabled(SecurityFeature.DATA_PERSISTENCE),
        crossChainVerification: securityServiceManager.isFeatureEnabled(SecurityFeature.CROSS_CHAIN_VERIFICATION)
      },
      metrics: {
        totalIncidents: metrics.totalIncidents,
        blockedAttacks: metrics.blockedAttackCount,
        challengedTransactions: metrics.challengedTransactionCount,
        healthScore: metrics.overallHealthScore,
        lastUpdated: new Date(metrics.lastUpdated).toISOString()
      }
    });
  });
  
  // Get available security levels
  app.get('/api/security/levels', (req: Request, res: Response) => {
    res.json({
      levels: [
        securityServiceManager.getSecurityLevel('standard'),
        securityServiceManager.getSecurityLevel('enhanced'),
        securityServiceManager.getSecurityLevel('maximum')
      ]
    });
  });
  
  // Apply security level to vault
  app.post('/api/security/vaults/:vaultId/level', async (req: Request, res: Response) => {
    try {
      const { vaultId } = req.params;
      const { level } = req.body;
      
      if (!level || !['standard', 'enhanced', 'maximum'].includes(level)) {
        return res.status(400).json({
          error: 'Invalid security level',
          message: 'Security level must be one of: standard, enhanced, maximum'
        });
      }
      
      await securityServiceManager.applySecurityLevel(vaultId, level);
      
      res.json({
        success: true,
        message: `Security level ${level} applied to vault ${vaultId}`,
        securityLevel: securityServiceManager.getSecurityLevel(level)
      });
    } catch (error) {
      console.error('Error applying security level:', error);
      res.status(500).json({
        error: 'Failed to apply security level',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Multi-Signature Endpoints
  
  // Get vault signers
  app.get('/api/security/vaults/:vaultId/signers', async (req: Request, res: Response) => {
    try {
      const { vaultId } = req.params;
      const signers = await multiSignatureGateway.getVaultSigners(vaultId);
      
      res.json({
        vaultId,
        signers,
        count: signers.length
      });
    } catch (error) {
      console.error('Error getting vault signers:', error);
      res.status(500).json({
        error: 'Failed to get vault signers',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Add signer to vault
  app.post('/api/security/vaults/:vaultId/signers', async (req: Request, res: Response) => {
    try {
      const { vaultId } = req.params;
      const { address, weight, name, role, requireHardwareKey, biometricVerification, geolocationRequired, secondFactorRequired, notificationPreferences } = req.body;
      
      if (!address) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Signer address is required'
        });
      }
      
      const signer = await multiSignatureGateway.addSigner(vaultId, {
        address,
        weight: weight || 1,
        name,
        role,
        requireHardwareKey,
        biometricVerification,
        geolocationRequired,
        secondFactorRequired,
        notificationPreferences: notificationPreferences || { email: true }
      });
      
      res.status(201).json({
        success: true,
        message: `Signer added to vault ${vaultId}`,
        signer
      });
    } catch (error) {
      console.error('Error adding signer:', error);
      res.status(500).json({
        error: 'Failed to add signer',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Remove signer from vault
  app.delete('/api/security/vaults/:vaultId/signers/:signerId', async (req: Request, res: Response) => {
    try {
      const { vaultId, signerId } = req.params;
      const success = await multiSignatureGateway.removeSigner(vaultId, signerId);
      
      if (success) {
        res.json({
          success: true,
          message: `Signer ${signerId} removed from vault ${vaultId}`
        });
      } else {
        res.status(404).json({
          error: 'Signer not found',
          message: `Signer ${signerId} not found for vault ${vaultId}`
        });
      }
    } catch (error) {
      console.error('Error removing signer:', error);
      res.status(500).json({
        error: 'Failed to remove signer',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Create approval request
  app.post('/api/security/approval-requests', async (req: Request, res: Response) => {
    try {
      const { vaultId, type, blockchainType, data, customThresholdWeight, expiration, metadata, zeroKnowledgeProof } = req.body;
      
      if (!vaultId || !type || !blockchainType) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'vaultId, type, and blockchainType are required'
        });
      }
      
      // Use authenticated user ID or from body
      const creatorId = req.session?.userId || req.body.creatorId;
      
      if (!creatorId) {
        return res.status(400).json({
          error: 'Missing creator ID',
          message: 'Creator ID is required for approval requests'
        });
      }
      
      // Validate approval type
      if (!Object.values(ApprovalType).includes(type)) {
        return res.status(400).json({
          error: 'Invalid approval type',
          message: `Type must be one of: ${Object.values(ApprovalType).join(', ')}`
        });
      }
      
      const request = await multiSignatureGateway.createApprovalRequest(
        vaultId,
        creatorId,
        type,
        {
          blockchainType,
          data: data || {}
        },
        {
          customThresholdWeight,
          expiration,
          metadata,
          zeroKnowledgeProof
        }
      );
      
      res.status(201).json({
        success: true,
        message: 'Approval request created successfully',
        request
      });
    } catch (error) {
      console.error('Error creating approval request:', error);
      res.status(500).json({
        error: 'Failed to create approval request',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get approval requests for vault
  app.get('/api/security/vaults/:vaultId/approval-requests', async (req: Request, res: Response) => {
    try {
      const { vaultId } = req.params;
      const status = req.query.status as ApprovalStatus | undefined;
      
      let requests;
      if (status) {
        // Filter by status for the vault
        requests = multiSignatureGateway.getApprovalRequestsByStatus(status)
          .filter(request => request.vaultId === vaultId);
      } else {
        // Get all for the vault
        requests = multiSignatureGateway.getApprovalRequestsForVault(vaultId);
      }
      
      res.json({
        vaultId,
        requests,
        count: requests.length
      });
    } catch (error) {
      console.error('Error getting approval requests:', error);
      res.status(500).json({
        error: 'Failed to get approval requests',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Submit signature for approval request
  app.post('/api/security/approval-requests/:requestId/signatures', async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      const { signerAddress, signature, verificationMethod, metadata } = req.body;
      
      if (!signerAddress || !signature || !verificationMethod) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'signerAddress, signature, and verificationMethod are required'
        });
      }
      
      const signatureRecord = await multiSignatureGateway.submitSignature(
        requestId,
        signerAddress,
        signature,
        verificationMethod,
        metadata
      );
      
      if (!signatureRecord) {
        return res.status(400).json({
          error: 'Signature submission failed',
          message: 'The signature could not be submitted'
        });
      }
      
      // Get the updated request
      const request = multiSignatureGateway.getApprovalRequest(requestId);
      
      res.json({
        success: true,
        message: 'Signature submitted successfully',
        signature: signatureRecord,
        request,
        isApproved: request?.status === ApprovalStatus.APPROVED
      });
    } catch (error) {
      console.error('Error submitting signature:', error);
      res.status(500).json({
        error: 'Failed to submit signature',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Cancel approval request
  app.post('/api/security/approval-requests/:requestId/cancel', async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      const success = multiSignatureGateway.cancelApprovalRequest(requestId);
      
      if (success) {
        res.json({
          success: true,
          message: `Approval request ${requestId} cancelled successfully`
        });
      } else {
        res.status(400).json({
          error: 'Cancel failed',
          message: 'The approval request could not be cancelled, it may already be completed or expired'
        });
      }
    } catch (error) {
      console.error('Error cancelling approval request:', error);
      res.status(500).json({
        error: 'Failed to cancel approval request',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Zero-Knowledge Privacy Endpoints
  
  // Create zero-knowledge proof of vault ownership
  app.post('/api/security/zk-proofs/ownership', async (req: Request, res: Response) => {
    try {
      const { vaultId, ownerAddress, blockchainType } = req.body;
      
      if (!vaultId || !ownerAddress || !blockchainType) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'vaultId, ownerAddress, and blockchainType are required'
        });
      }
      
      const proof = await zeroKnowledgeShield.proveVaultOwnership(vaultId, ownerAddress, blockchainType);
      
      res.json({
        success: true,
        proof,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error creating ZK proof:', error);
      res.status(500).json({
        error: 'Failed to create zero-knowledge proof',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Verify zero-knowledge proof
  app.post('/api/security/zk-proofs/verify', async (req: Request, res: Response) => {
    try {
      const { proof, proofType, blockchainType } = req.body;
      
      if (!proof || !proofType || !blockchainType) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'proof, proofType, and blockchainType are required'
        });
      }
      
      const result = await zeroKnowledgeShield.verifyProof(proof, proofType, blockchainType);
      
      res.json({
        success: result.success,
        result,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error verifying ZK proof:', error);
      res.status(500).json({
        error: 'Failed to verify zero-knowledge proof',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Quantum-Resistant Encryption Endpoints
  
  // Generate quantum-resistant key pair
  app.post('/api/security/quantum/keypair', async (req: Request, res: Response) => {
    try {
      const { algorithm } = req.body;
      
      const keyPair = await quantumResistantEncryption.generateKeyPair(
        algorithm || QuantumResistantAlgorithm.DILITHIUM
      );
      
      res.json({
        success: true,
        algorithm: algorithm || QuantumResistantAlgorithm.DILITHIUM,
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error generating quantum-resistant keypair:', error);
      res.status(500).json({
        error: 'Failed to generate quantum-resistant keypair',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Encrypt data with quantum-resistant encryption
  app.post('/api/security/quantum/encrypt', async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'data is required'
        });
      }
      
      const encrypted = await quantumResistantEncryption.encryptData(typeof data === 'string' ? data : JSON.stringify(data));
      
      res.json({
        success: true,
        encrypted,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error encrypting data:', error);
      res.status(500).json({
        error: 'Failed to encrypt data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Create quantum-resistant signature
  app.post('/api/security/quantum/sign', async (req: Request, res: Response) => {
    try {
      const { data, privateKey } = req.body;
      
      if (!data || !privateKey) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'data and privateKey are required'
        });
      }
      
      const signatureData = await quantumResistantEncryption.signData(
        typeof data === 'string' ? data : JSON.stringify(data),
        privateKey
      );
      
      res.json({
        success: true,
        signatureData,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error creating quantum-resistant signature:', error);
      res.status(500).json({
        error: 'Failed to create quantum-resistant signature',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Verify quantum-resistant signature
  app.post('/api/security/quantum/verify-signature', async (req: Request, res: Response) => {
    try {
      const { signatureData } = req.body;
      
      if (!signatureData) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'signatureData is required'
        });
      }
      
      const isValid = await quantumResistantEncryption.verifySignature(signatureData);
      
      res.json({
        success: true,
        isValid,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error verifying quantum-resistant signature:', error);
      res.status(500).json({
        error: 'Failed to verify quantum-resistant signature',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Behavioral Analysis Endpoints
  
  // Get security alerts for a vault
  app.get('/api/security/vaults/:vaultId/alerts', (req: Request, res: Response) => {
    try {
      const { vaultId } = req.params;
      const alerts = behavioralAnalysisSystem.getAlertsForVault(vaultId);
      
      res.json({
        vaultId,
        alerts,
        count: alerts.length
      });
    } catch (error) {
      console.error('Error getting security alerts:', error);
      res.status(500).json({
        error: 'Failed to get security alerts',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Admin Routes (Protected)
  
  // Get all security metrics
  app.get('/api/admin/security/metrics', requireAdmin, (req: Request, res: Response) => {
    const metrics = securityServiceManager.getSecurityMetrics();
    
    res.json({
      metrics,
      timestamp: Date.now()
    });
  });
  
  // Toggle security feature
  app.post('/api/admin/security/features/:feature', requireAdmin, (req: Request, res: Response) => {
    try {
      const { feature } = req.params;
      const { enabled } = req.body;
      
      if (enabled === undefined) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'enabled status is required'
        });
      }
      
      if (!Object.values(SecurityFeature).includes(feature as SecurityFeature)) {
        return res.status(400).json({
          error: 'Invalid security feature',
          message: `Feature must be one of: ${Object.values(SecurityFeature).join(', ')}`
        });
      }
      
      securityServiceManager.setFeatureStatus(feature as SecurityFeature, enabled);
      
      res.json({
        success: true,
        message: `Security feature ${feature} ${enabled ? 'enabled' : 'disabled'}`,
        feature,
        enabled
      });
    } catch (error) {
      console.error('Error toggling security feature:', error);
      res.status(500).json({
        error: 'Failed to toggle security feature',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Create system backup (admin only)
  app.post('/api/admin/security/backup', requireAdmin, async (req: Request, res: Response) => {
    try {
      const backup = await dataPersistenceService.createSystemBackup();
      
      res.json({
        success: true,
        message: 'System backup created successfully',
        backup,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error creating system backup:', error);
      res.status(500).json({
        error: 'Failed to create system backup',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Verify system integrity (admin only)
  app.get('/api/admin/security/integrity', requireAdmin, async (req: Request, res: Response) => {
    try {
      const verification = await dataPersistenceService.verifySystemIntegrity();
      
      res.json({
        success: verification.successful,
        verification,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error verifying system integrity:', error);
      res.status(500).json({
        error: 'Failed to verify system integrity',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get all security alerts by risk level (admin only)
  app.get('/api/admin/security/alerts/:riskLevel', requireAdmin, (req: Request, res: Response) => {
    try {
      const { riskLevel } = req.params;
      
      if (!Object.values(RiskLevel).includes(riskLevel as RiskLevel)) {
        return res.status(400).json({
          error: 'Invalid risk level',
          message: `Risk level must be one of: ${Object.values(RiskLevel).join(', ')}`
        });
      }
      
      const alerts = behavioralAnalysisSystem.getAlertsByRiskLevel(riskLevel as RiskLevel);
      
      res.json({
        riskLevel,
        alerts,
        count: alerts.length
      });
    } catch (error) {
      console.error('Error getting security alerts by risk level:', error);
      res.status(500).json({
        error: 'Failed to get security alerts',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
