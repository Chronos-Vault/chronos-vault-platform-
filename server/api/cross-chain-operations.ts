import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { BlockchainType } from '@/contexts/multi-chain-context';
import { v4 as uuidv4 } from 'uuid';
import { OperationType, TransactionStatus } from '@/components/cross-chain/CrossChainControlPanel';

// Schema for creating a cross-chain operation
const createOperationSchema = z.object({
  type: z.enum([OperationType.TRANSFER, OperationType.SWAP, OperationType.BRIDGE]),
  sourceChain: z.enum([BlockchainType.ETHEREUM, BlockchainType.SOLANA, BlockchainType.TON, BlockchainType.BITCOIN]),
  destinationChain: z.enum([BlockchainType.ETHEREUM, BlockchainType.SOLANA, BlockchainType.TON, BlockchainType.BITCOIN]),
  amount: z.number().positive(),
  asset: z.string().min(1),
  prioritizeSpeed: z.boolean().optional().default(false),
  prioritizeSecurity: z.boolean().optional().default(false),
  slippageTolerance: z.number().min(0).max(10).optional().default(0.5),
});

// Schema for updating operation status
const updateOperationStatusSchema = z.object({
  operationId: z.string().uuid(),
  status: z.enum([
    TransactionStatus.PENDING,
    TransactionStatus.PROCESSING,
    TransactionStatus.COMPLETED,
    TransactionStatus.FAILED
  ]),
  targetTxHash: z.string().optional(),
});

// Get all operations
export const getAllOperations = async (req: Request, res: Response) => {
  try {
    // In a real app, we would filter by user ID from authentication
    // For demo, we'll return all operations
    const operations = await db.execute({
      sql: `SELECT * FROM cross_chain_operations ORDER BY timestamp DESC LIMIT 100`,
      args: []
    });
    
    return res.status(200).json({ operations });
  } catch (error) {
    console.error('Error fetching operations:', error);
    return res.status(500).json({ error: 'Failed to fetch operations' });
  }
};

// Get operations for current user
export const getUserOperations = async (req: Request, res: Response) => {
  try {
    // In a real app, we would get the user ID from authentication
    // For demo purposes, we'll use a query parameter
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const operations = await db.execute({
      sql: `SELECT * FROM cross_chain_operations WHERE user_id = ? ORDER BY timestamp DESC`,
      args: [userId]
    });
    
    return res.status(200).json({ operations });
  } catch (error) {
    console.error('Error fetching user operations:', error);
    return res.status(500).json({ error: 'Failed to fetch user operations' });
  }
};

// Get operation by ID
export const getOperationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const operation = await db.execute({
      sql: `SELECT * FROM cross_chain_operations WHERE id = ?`,
      args: [id]
    });
    
    if (!operation || operation.length === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    return res.status(200).json({ operation: operation[0] });
  } catch (error) {
    console.error('Error fetching operation:', error);
    return res.status(500).json({ error: 'Failed to fetch operation' });
  }
};

// Create a new operation
export const createOperation = async (req: Request, res: Response) => {
  try {
    const validatedData = createOperationSchema.parse(req.body);
    
    // Check that source and destination chains are different
    if (validatedData.sourceChain === validatedData.destinationChain) {
      return res.status(400).json({ error: 'Source and destination chains must be different' });
    }
    
    // Generate a unique ID for the operation
    const operationId = uuidv4();
    
    // Generate timestamp
    const timestamp = new Date();
    
    // Calculate estimated completion time based on operation type and blockchain
    const estimatedMinutes = calculateEstimatedCompletionTime(
      validatedData.type,
      validatedData.sourceChain,
      validatedData.destinationChain,
      validatedData.prioritizeSpeed
    );
    
    const estimatedCompletionTime = new Date(timestamp.getTime() + estimatedMinutes * 60 * 1000);
    
    // Calculate fee
    const fee = calculateOperationFee(
      validatedData.type,
      validatedData.amount,
      validatedData.sourceChain,
      validatedData.destinationChain,
      validatedData.prioritizeSpeed,
      validatedData.prioritizeSecurity
    );
    
    // In a real app, we would use the user ID from authentication
    // For demo purposes, we'll use a placeholder userId
    const userId = req.body.userId || 'demo-user-123';
    
    // Create the operation record
    await db.execute({
      sql: `
        INSERT INTO cross_chain_operations (
          id, user_id, type, source_chain, destination_chain, 
          amount, asset, timestamp, status, fee, 
          estimated_completion_time, prioritize_speed, prioritize_security, 
          slippage_tolerance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        operationId,
        userId,
        validatedData.type,
        validatedData.sourceChain,
        validatedData.destinationChain,
        validatedData.amount,
        validatedData.asset,
        timestamp,
        TransactionStatus.PENDING,
        fee,
        estimatedCompletionTime,
        validatedData.prioritizeSpeed,
        validatedData.prioritizeSecurity,
        validatedData.slippageTolerance
      ]
    });
    
    // In a real application, we would now trigger the blockchain transactions
    // through our cross-chain bridge contracts
    
    return res.status(201).json({
      operation: {
        id: operationId,
        userId,
        type: validatedData.type,
        sourceChain: validatedData.sourceChain,
        destinationChain: validatedData.destinationChain,
        amount: validatedData.amount,
        asset: validatedData.asset,
        timestamp,
        status: TransactionStatus.PENDING,
        fee,
        estimatedCompletionTime,
        prioritizeSpeed: validatedData.prioritizeSpeed,
        prioritizeSecurity: validatedData.prioritizeSecurity,
        slippageTolerance: validatedData.slippageTolerance
      }
    });
  } catch (error) {
    console.error('Error creating operation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create operation' });
  }
};

// Update operation status
export const updateOperationStatus = async (req: Request, res: Response) => {
  try {
    // In a real app, we would verify that the caller has permission to update the status
    // For demo purposes, we'll skip that check
    
    const validatedData = updateOperationStatusSchema.parse(req.body);
    
    // Update the operation status
    await db.execute({
      sql: `
        UPDATE cross_chain_operations 
        SET status = ?, target_tx_hash = ?
        WHERE id = ?
      `,
      args: [
        validatedData.status,
        validatedData.targetTxHash || null,
        validatedData.operationId
      ]
    });
    
    // Get the updated operation
    const updatedOperation = await db.execute({
      sql: `SELECT * FROM cross_chain_operations WHERE id = ?`,
      args: [validatedData.operationId]
    });
    
    if (!updatedOperation || updatedOperation.length === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    return res.status(200).json({ operation: updatedOperation[0] });
  } catch (error) {
    console.error('Error updating operation status:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to update operation status' });
  }
};

// Cancel an operation
export const cancelOperation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if operation exists and is in a cancellable state
    const operation = await db.execute({
      sql: `SELECT * FROM cross_chain_operations WHERE id = ?`,
      args: [id]
    });
    
    if (!operation || operation.length === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    const currentOperation = operation[0];
    
    // Only pending operations can be cancelled
    if (currentOperation.status !== TransactionStatus.PENDING) {
      return res.status(400).json({ error: 'Only pending operations can be cancelled' });
    }
    
    // In a real app, we would verify that the caller is authorized to cancel this operation
    // For demo purposes, we'll skip that check
    
    // Update the operation status to FAILED
    await db.execute({
      sql: `UPDATE cross_chain_operations SET status = ? WHERE id = ?`,
      args: [TransactionStatus.FAILED, id]
    });
    
    // In a real application, we would initiate the refund process on the blockchain
    
    return res.status(200).json({ message: 'Operation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling operation:', error);
    return res.status(500).json({ error: 'Failed to cancel operation' });
  }
};

// Get supported chains
export const getSupportedChains = async (_req: Request, res: Response) => {
  try {
    // In a real app, we would fetch this from the database or config
    const supportedChains = [
      {
        id: BlockchainType.ETHEREUM,
        name: 'Ethereum',
        isActive: true,
        feeRange: { min: 0.001, max: 0.05 }
      },
      {
        id: BlockchainType.SOLANA,
        name: 'Solana',
        isActive: true,
        feeRange: { min: 0.0001, max: 0.01 }
      },
      {
        id: BlockchainType.TON,
        name: 'TON',
        isActive: true,
        feeRange: { min: 0.0005, max: 0.03 }
      },
      {
        id: BlockchainType.BITCOIN,
        name: 'Bitcoin',
        isActive: true,
        feeRange: { min: 0.0002, max: 0.02 }
      }
    ];
    
    return res.status(200).json({ supportedChains });
  } catch (error) {
    console.error('Error fetching supported chains:', error);
    return res.status(500).json({ error: 'Failed to fetch supported chains' });
  }
};

// Get fee estimate for an operation
export const getFeeEstimate = async (req: Request, res: Response) => {
  try {
    const { type, sourceChain, destinationChain, amount, prioritizeSpeed, prioritizeSecurity } = req.query;
    
    if (!type || !sourceChain || !destinationChain || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const fee = calculateOperationFee(
      type as OperationType,
      parseFloat(amount as string),
      sourceChain as BlockchainType,
      destinationChain as BlockchainType,
      prioritizeSpeed === 'true',
      prioritizeSecurity === 'true'
    );
    
    return res.status(200).json({ fee });
  } catch (error) {
    console.error('Error calculating fee estimate:', error);
    return res.status(500).json({ error: 'Failed to calculate fee estimate' });
  }
};

// Get blockchain metrics
export const getBlockchainMetrics = async (_req: Request, res: Response) => {
  try {
    // In a real app, we would fetch this from an external API or our own monitoring service
    // For demo purposes, we'll return mock data
    const metrics = {
      [BlockchainType.ETHEREUM]: {
        blockTime: 12, // seconds
        transactionFee: 0.002, // ETH
        congestionLevel: 65, // percentage
        securityScore: 92, // out of 100
      },
      [BlockchainType.SOLANA]: {
        blockTime: 0.4, // seconds
        transactionFee: 0.0002, // SOL
        congestionLevel: 30, // percentage
        securityScore: 87, // out of 100
      },
      [BlockchainType.TON]: {
        blockTime: 5, // seconds
        transactionFee: 0.0008, // TON
        congestionLevel: 25, // percentage
        securityScore: 85, // out of 100
      },
      [BlockchainType.BITCOIN]: {
        blockTime: 600, // seconds
        transactionFee: 0.0004, // BTC
        congestionLevel: 40, // percentage
        securityScore: 95, // out of 100
      }
    };
    
    return res.status(200).json({ metrics });
  } catch (error) {
    console.error('Error fetching blockchain metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch blockchain metrics' });
  }
};

// Helper functions

// Calculate estimated completion time in minutes
function calculateEstimatedCompletionTime(
  type: OperationType,
  sourceChain: BlockchainType,
  destinationChain: BlockchainType,
  prioritizeSpeed: boolean
): number {
  // Base times in minutes for different chains
  const chainTimes = {
    [BlockchainType.ETHEREUM]: 10,
    [BlockchainType.SOLANA]: 2,
    [BlockchainType.TON]: 5,
    [BlockchainType.BITCOIN]: 60
  };
  
  // Base time from source chain
  let estimatedTime = chainTimes[sourceChain];
  
  // Add time for destination chain if it's a bridge or swap
  if (type === OperationType.BRIDGE || type === OperationType.SWAP) {
    estimatedTime += chainTimes[destinationChain] * 0.7; // Only add a portion of the destination time
  }
  
  // Additional time based on operation type
  if (type === OperationType.BRIDGE) {
    estimatedTime *= 1.5; // Bridges take longer
  } else if (type === OperationType.SWAP) {
    estimatedTime *= 1.3; // Swaps are a bit longer than transfers
  }
  
  // Speed priority reduces time
  if (prioritizeSpeed) {
    estimatedTime *= 0.7; // 30% faster
  }
  
  // Round up to nearest minute
  return Math.ceil(estimatedTime);
}

// Calculate operation fee
function calculateOperationFee(
  type: OperationType,
  amount: number,
  sourceChain: BlockchainType,
  destinationChain: BlockchainType,
  prioritizeSpeed: boolean,
  prioritizeSecurity: boolean
): number {
  // Base fee rates for different chains (as percentage of amount)
  const chainFeeRates = {
    [BlockchainType.ETHEREUM]: 0.005, // 0.5%
    [BlockchainType.SOLANA]: 0.003, // 0.3%
    [BlockchainType.TON]: 0.004, // 0.4%
    [BlockchainType.BITCOIN]: 0.006 // 0.6%
  };
  
  // Base fee from source chain
  let fee = amount * chainFeeRates[sourceChain];
  
  // Add fee component from destination chain if it's a bridge or swap
  if (type === OperationType.BRIDGE || type === OperationType.SWAP) {
    fee += amount * chainFeeRates[destinationChain] * 0.5; // Add half of the destination chain fee
  }
  
  // Additional fee based on operation type
  if (type === OperationType.BRIDGE) {
    fee *= 1.5; // Bridges cost more
  } else if (type === OperationType.SWAP) {
    fee *= 1.3; // Swaps cost more than transfers
  }
  
  // Speed priority increases fee
  if (prioritizeSpeed) {
    fee *= 1.25; // 25% more expensive
  }
  
  // Security priority increases fee
  if (prioritizeSecurity) {
    fee *= 1.2; // 20% more expensive
  }
  
  // Ensure minimum fee based on chain
  const minFee = 0.0005;
  fee = Math.max(fee, minFee);
  
  // Round to 6 decimal places
  return parseFloat(fee.toFixed(6));
}