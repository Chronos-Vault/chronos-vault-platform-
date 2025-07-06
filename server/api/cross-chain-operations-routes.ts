import { Router } from 'express';
import {
  getAllOperations,
  getUserOperations,
  getOperationById,
  createOperation,
  updateOperationStatus,
  cancelOperation,
  getSupportedChains,
  getFeeEstimate,
  getBlockchainMetrics
} from './cross-chain-operations';

export function registerCrossChainOperationsRoutes(router: Router): void {
  // Get all operations (admin only in a real app)
  router.get('/cross-chain-operations', getAllOperations);
  
  // Get operations for the current user
  router.get('/cross-chain-operations/user', getUserOperations);
  
  // Get operation by ID
  router.get('/cross-chain-operations/:id', getOperationById);
  
  // Create a new operation
  router.post('/cross-chain-operations', createOperation);
  
  // Update operation status (admin/operator only in a real app)
  router.put('/cross-chain-operations/status', updateOperationStatus);
  
  // Cancel an operation
  router.post('/cross-chain-operations/:id/cancel', cancelOperation);
  
  // Get supported chains
  router.get('/cross-chain-operations/chains', getSupportedChains);
  
  // Get fee estimate
  router.get('/cross-chain-operations/fee-estimate', getFeeEstimate);
  
  // Get blockchain metrics
  router.get('/cross-chain-operations/metrics', getBlockchainMetrics);
}