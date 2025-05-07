/**
 * Cross-Chain Test API Routes
 * 
 * This file contains API routes for testing cross-chain verification and
 * multi-signature functionality of the Chronos Vault platform.
 */

import { Request, Response } from 'express';
import { crossChainVerificationProtocol, VerificationMethod } from '../security/cross-chain-verification-protocol';
import { crossChainMultiSignatureService } from '../security/cross-chain-multi-signature';
import { BlockchainType } from '../../shared/types';

export async function registerCrossChainTestRoutes(app: any) {
  // Test cross-chain verification
  app.post('/api/security/test-cross-chain-verification', async (req: Request, res: Response) => {
    try {
      const { 
        transactionId, 
        sourceChain, 
        targetChains,
        requiredConfirmations,
        method = 'standard' 
      } = req.body;
      
      if (!transactionId || !sourceChain || !targetChains || !Array.isArray(targetChains)) {
        return res.status(400).json({ 
          error: 'Invalid parameters. Required: transactionId, sourceChain, and targetChains (array)' 
        });
      }
      
      // Convert method string to enum value
      let verificationMethod: VerificationMethod;
      switch (method.toLowerCase()) {
        case 'deep':
          verificationMethod = VerificationMethod.DEEP;
          break;
        case 'zero_knowledge':
          verificationMethod = VerificationMethod.ZERO_KNOWLEDGE;
          break;
        case 'quantum_resistant':
          verificationMethod = VerificationMethod.QUANTUM_RESISTANT;
          break;
        default:
          verificationMethod = VerificationMethod.STANDARD;
      }
      
      // Execute the cross-chain verification
      const result = await crossChainVerificationProtocol.verifyTransaction(
        transactionId,
        sourceChain as BlockchainType,
        targetChains as BlockchainType[],
        verificationMethod,
        requiredConfirmations || undefined
      );
      
      // Return the verification result
      res.status(200).json(result);
    } catch (error: any) {
      console.error('[API] Cross-chain verification test error:', error);
      res.status(500).json({ 
        error: 'Failed to perform cross-chain verification',
        message: error.message || 'Unknown error'
      });
    }
  });
  
  // Get verification status
  app.get('/api/security/verification-status/:requestId', async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      
      if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
      }
      
      // Get the verification result from cache
      const result = await crossChainVerificationProtocol.getVerificationResult(requestId);
      
      if (!result) {
        return res.status(404).json({ error: 'Verification result not found' });
      }
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('[API] Error fetching verification status:', error);
      res.status(500).json({ 
        error: 'Failed to fetch verification status',
        message: error.message || 'Unknown error'
      });
    }
  });
  
  // Test creating a cross-chain multi-signature request
  app.post('/api/security/test-cross-chain-multi-sig', async (req: Request, res: Response) => {
    try {
      const { 
        vaultId, 
        creatorId, 
        sourceChain, 
        secondaryChains,
        type,
        transactionData,
        requiredConfirmations
      } = req.body;
      
      if (!vaultId || !creatorId || !sourceChain || !secondaryChains || !Array.isArray(secondaryChains) || !type) {
        return res.status(400).json({ 
          error: 'Invalid parameters. Required: vaultId, creatorId, sourceChain, secondaryChains (array), and type' 
        });
      }
      
      // Create a cross-chain approval request
      const result = await crossChainMultiSignatureService.createCrossChainApprovalRequest(
        vaultId,
        creatorId,
        sourceChain as BlockchainType,
        secondaryChains as BlockchainType[],
        type,
        transactionData || {},
        requiredConfirmations
      );
      
      // Get the full status with chain details
      const status = await crossChainMultiSignatureService.getCrossChainRequestStatus(result.crossChainRequestId);
      
      // Return combined result
      res.status(200).json({
        ...result,
        ...status
      });
    } catch (error: any) {
      console.error('[API] Cross-chain multi-signature test error:', error);
      res.status(500).json({ 
        error: 'Failed to create cross-chain multi-signature request',
        message: error.message || 'Unknown error'
      });
    }
  });
  
  // Test signing a multi-signature request
  app.post('/api/security/test-sign-multi-sig', async (req: Request, res: Response) => {
    try {
      const { 
        crossChainRequestId, 
        signerAddress, 
        signatures,
        method = 'standard'
      } = req.body;
      
      if (!crossChainRequestId || !signerAddress || !signatures) {
        return res.status(400).json({ 
          error: 'Invalid parameters. Required: crossChainRequestId, signerAddress, and signatures' 
        });
      }
      
      // Verify the signatures
      const result = await crossChainMultiSignatureService.verifyCrossChainSignature(
        crossChainRequestId,
        signerAddress,
        signatures
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('[API] Cross-chain signature verification error:', error);
      res.status(500).json({ 
        error: 'Failed to verify cross-chain signatures',
        message: error.message || 'Unknown error'
      });
    }
  });
  
  // Get multi-signature request status
  app.get('/api/security/multi-sig-status/:requestId', async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      
      if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
      }
      
      // Get the status of the cross-chain request
      const status = await crossChainMultiSignatureService.getCrossChainRequestStatus(requestId);
      
      res.status(200).json(status);
    } catch (error: any) {
      console.error('[API] Error fetching multi-signature status:', error);
      res.status(500).json({ 
        error: 'Failed to fetch multi-signature status',
        message: error.message || 'Unknown error'
      });
    }
  });
}