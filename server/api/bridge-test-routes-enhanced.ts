/**
 * Enhanced Bridge Test Routes
 * 
 * API routes for testing and validating cross-chain bridge functionality
 * between Ethereum, Solana, TON, and Bitcoin networks.
 */

import { Router, Request, Response } from "express";
import { crossChainBridge } from "../blockchain/cross-chain-bridge";
import { securityLogger } from "../monitoring/security-logger";
import { BlockchainType } from "../../shared/types";
import { ethersClient } from "../blockchain/ethereum-client";
import { solanaClient } from "../blockchain/solana-client";
import { tonClient } from "../blockchain/ton-client";
import { bitcoinService } from "../blockchain/bitcoin-service";
import { crossChainVerification } from "../security/cross-chain-verification-protocol";
import config from "../config";

const router = Router();

// Bridge monitoring and control API routes

/**
 * Get the current status of all cross-chain bridges
 */
router.get("/bridge-status", async (_req: Request, res: Response) => {
  try {
    const bridgeStatuses = await crossChainBridge.getBridgeStatuses();
    res.json(bridgeStatuses);
  } catch (error) {
    securityLogger.error("Error retrieving bridge statuses", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get the detailed status of a specific cross-chain bridge
 */
router.get("/bridge-status/:sourceChain/:targetChain", async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain } = req.params;
    
    if (!sourceChain || !targetChain) {
      return res.status(400).json({
        success: false,
        error: "Source chain and target chain are required"
      });
    }
    
    if (!['ETH', 'SOL', 'TON', 'BTC'].includes(sourceChain) || 
        !['ETH', 'SOL', 'TON', 'BTC'].includes(targetChain)) {
      return res.status(400).json({
        success: false,
        error: "Invalid chain specified. Supported chains: ETH, SOL, TON, BTC"
      });
    }
    
    if (sourceChain === targetChain) {
      return res.status(400).json({
        success: false,
        error: "Source chain and target chain must be different"
      });
    }
    
    const bridgeStatus = await crossChainBridge.getBridgeStatus(
      sourceChain as BlockchainType, 
      targetChain as BlockchainType
    );
    
    res.json(bridgeStatus);
  } catch (error) {
    securityLogger.error("Error retrieving bridge status", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Initialize a bridge between two chains
 */
router.post("/initialize-bridge", async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain } = req.body;
    
    if (!sourceChain || !targetChain) {
      return res.status(400).json({
        success: false,
        error: "Source chain and target chain are required"
      });
    }
    
    if (!['ETH', 'SOL', 'TON', 'BTC'].includes(sourceChain) || 
        !['ETH', 'SOL', 'TON', 'BTC'].includes(targetChain)) {
      return res.status(400).json({
        success: false,
        error: "Invalid chain specified. Supported chains: ETH, SOL, TON, BTC"
      });
    }
    
    if (sourceChain === targetChain) {
      return res.status(400).json({
        success: false,
        error: "Source chain and target chain must be different"
      });
    }
    
    const result = await crossChainBridge.initializeBridge(
      sourceChain as BlockchainType,
      targetChain as BlockchainType
    );
    
    res.json(result);
  } catch (error) {
    securityLogger.error("Error initializing bridge", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Bridge testing API routes

/**
 * Test bridge by transferring an asset between chains
 */
router.post("/test-transfer", async (req: Request, res: Response) => {
  try {
    const { 
      sourceChain, 
      targetChain, 
      amount, 
      assetType,
      senderAddress,
      recipientAddress
    } = req.body;
    
    if (!sourceChain || !targetChain || !amount || !assetType) {
      return res.status(400).json({
        success: false,
        error: "Source chain, target chain, amount, and asset type are required"
      });
    }
    
    // Generate test addresses if not provided
    const sender = senderAddress || `test-sender-${Date.now()}`;
    const recipient = recipientAddress || `test-recipient-${Date.now()}`;
    
    const result = await crossChainBridge.transferAsset(
      sourceChain as BlockchainType,
      targetChain as BlockchainType,
      amount,
      assetType,
      sender,
      recipient
    );
    
    res.json(result);
  } catch (error) {
    securityLogger.error("Error testing bridge transfer", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Test the full bridge cycle with a vault action
 */
router.post("/test-vault-bridge", async (req: Request, res: Response) => {
  try {
    const { 
      vaultId, 
      primaryChain, 
      secondaryChains, 
      action 
    } = req.body;
    
    if (!vaultId || !primaryChain || !secondaryChains || !action) {
      return res.status(400).json({
        success: false,
        error: "Vault ID, primary chain, secondary chains, and action are required"
      });
    }
    
    if (!Array.isArray(secondaryChains) || secondaryChains.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Secondary chains must be a non-empty array"
      });
    }
    
    if (!['create', 'update', 'unlock'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: "Invalid action. Supported actions: create, update, unlock"
      });
    }
    
    const result = await crossChainBridge.broadcastVaultAction(
      vaultId,
      action,
      primaryChain as BlockchainType,
      secondaryChains as BlockchainType[],
      { timestamp: Date.now(), owner: `test-owner-${Date.now()}` }
    );
    
    res.json(result);
  } catch (error) {
    securityLogger.error("Error testing vault bridge", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Test message relay between chains
 */
router.post("/test-message-relay", async (req: Request, res: Response) => {
  try {
    const { 
      sourceChain, 
      targetChain, 
      message 
    } = req.body;
    
    if (!sourceChain || !targetChain || !message) {
      return res.status(400).json({
        success: false,
        error: "Source chain, target chain, and message are required"
      });
    }
    
    const result = await crossChainBridge.relayMessage(
      sourceChain as BlockchainType,
      targetChain as BlockchainType,
      message
    );
    
    res.json(result);
  } catch (error) {
    securityLogger.error("Error testing message relay", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Verify that a transaction was properly bridged
 */
router.post("/verify-bridge-transaction", async (req: Request, res: Response) => {
  try {
    const { 
      transactionId, 
      sourceChain, 
      targetChain 
    } = req.body;
    
    if (!transactionId || !sourceChain || !targetChain) {
      return res.status(400).json({
        success: false,
        error: "Transaction ID, source chain, and target chain are required"
      });
    }
    
    const result = await crossChainBridge.verifyTransaction(
      transactionId,
      sourceChain as BlockchainType,
      targetChain as BlockchainType
    );
    
    res.json(result);
  } catch (error) {
    securityLogger.error("Error verifying bridge transaction", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Run a comprehensive bridge test suite for all supported chains
 */
router.post("/comprehensive-test", async (req: Request, res: Response) => {
  try {
    const {
      testSize = 'small', // small, medium, large
      includeErrors = false
    } = req.body;
    
    const chains: BlockchainType[] = ['ETH', 'SOL', 'TON', 'BTC'];
    
    // Define test parameters based on test size
    let iterations;
    switch (testSize) {
      case 'large':
        iterations = 20;
        break;
      case 'medium':
        iterations = 10;
        break;
      default:
        iterations = 5;
    }
    
    const testResults: any = {
      timestamp: Date.now(),
      testSize,
      iterations,
      bridgeTests: [],
      vaultTests: [],
      messageTests: [],
      errorTests: [],
      summary: {
        total: 0,
        successful: 0,
        failed: 0
      }
    };
    
    securityLogger.info(`Starting comprehensive bridge test (size: ${testSize})`);
    
    // Test each pair of chains
    for (let i = 0; i < chains.length; i++) {
      for (let j = 0; j < chains.length; j++) {
        if (i === j) continue; // Skip same chain
        
        const sourceChain = chains[i];
        const targetChain = chains[j];
        
        try {
          // Test bridge initialization
          const initResult = await crossChainBridge.initializeBridge(
            sourceChain,
            targetChain
          );
          
          testResults.bridgeTests.push({
            type: 'initialization',
            sourceChain,
            targetChain,
            success: initResult.success,
            details: initResult
          });
          
          testResults.summary.total++;
          if (initResult.success) testResults.summary.successful++;
          else testResults.summary.failed++;
          
          // Test asset transfer
          const transferResult = await crossChainBridge.transferAsset(
            sourceChain,
            targetChain,
            '10.0',
            'TEST_TOKEN',
            `test-sender-${sourceChain}-${Date.now()}`,
            `test-recipient-${targetChain}-${Date.now()}`
          );
          
          testResults.bridgeTests.push({
            type: 'transfer',
            sourceChain,
            targetChain,
            success: transferResult.success,
            details: transferResult
          });
          
          testResults.summary.total++;
          if (transferResult.success) testResults.summary.successful++;
          else testResults.summary.failed++;
        
          // Test message relay
          const messageResult = await crossChainBridge.relayMessage(
            sourceChain,
            targetChain,
            `Test message from ${sourceChain} to ${targetChain} at ${Date.now()}`
          );
          
          testResults.messageTests.push({
            sourceChain,
            targetChain,
            success: messageResult.success,
            details: messageResult
          });
          
          testResults.summary.total++;
          if (messageResult.success) testResults.summary.successful++;
          else testResults.summary.failed++;
          
          // Introduced errors if requested (for testing error handling)
          if (includeErrors) {
            try {
              // Try an invalid operation to test error handling
              await crossChainBridge.verifyTransaction(
                'invalid-tx-id',
                sourceChain,
                targetChain
              );
            } catch (error) {
              testResults.errorTests.push({
                type: 'invalid_transaction',
                sourceChain,
                targetChain,
                errorHandled: true,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
              });
              
              testResults.summary.total++;
              testResults.summary.successful++; // Error was expected and caught
            }
          }
        } catch (error) {
          securityLogger.error(`Error in comprehensive test for ${sourceChain}->${targetChain}`, error);
          
          testResults.errorTests.push({
            sourceChain,
            targetChain,
            errorHandled: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          });
          
          testResults.summary.total++;
          testResults.summary.failed++;
        }
      }
    }
    
    // Test vault actions across chains
    for (let i = 0; i < chains.length; i++) {
      try {
        const primaryChain = chains[i];
        const secondaryChains = chains.filter((c, idx) => idx !== i);
        const vaultId = `test-vault-${primaryChain}-${Date.now()}`;
        
        // Test vault creation
        const vaultResult = await crossChainBridge.broadcastVaultAction(
          vaultId,
          'create',
          primaryChain,
          secondaryChains,
          { timestamp: Date.now(), owner: `test-owner-${Date.now()}` }
        );
        
        testResults.vaultTests.push({
          action: 'create',
          primaryChain,
          secondaryChains,
          success: vaultResult.success,
          details: vaultResult
        });
        
        testResults.summary.total++;
        if (vaultResult.success) testResults.summary.successful++;
        else testResults.summary.failed++;
        
        // Test vault verification
        if (vaultResult.success) {
          const verifyResult = await crossChainVerification.verifyVaultAcrossChains(
            vaultId,
            primaryChain,
            secondaryChains
          );
          
          testResults.vaultTests.push({
            action: 'verify',
            primaryChain,
            secondaryChains,
            success: verifyResult.success,
            details: verifyResult
          });
          
          testResults.summary.total++;
          if (verifyResult.success) testResults.summary.successful++;
          else testResults.summary.failed++;
        }
      } catch (error) {
        securityLogger.error(`Error in vault test for ${chains[i]}`, error);
        
        testResults.errorTests.push({
          primaryChain: chains[i],
          errorHandled: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        
        testResults.summary.total++;
        testResults.summary.failed++;
      }
    }
    
    securityLogger.info(`Completed comprehensive bridge test: ${testResults.summary.successful}/${testResults.summary.total} tests passed`);
    
    res.json({
      success: testResults.summary.failed === 0,
      testResults
    });
  } catch (error) {
    securityLogger.error("Error running comprehensive bridge test", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get the configuration options for the bridge
 */
router.get("/config", async (_req: Request, res: Response) => {
  const bridgeConfig = {
    supportedChains: ['ETH', 'SOL', 'TON', 'BTC'],
    defaultFees: {
      ETH: config.bridge?.fees?.ethereum || "0.001",
      SOL: config.bridge?.fees?.solana || "0.01",
      TON: config.bridge?.fees?.ton || "0.1",
      BTC: config.bridge?.fees?.bitcoin || "0.0001"
    },
    confirmationRequirements: {
      ETH: config.security?.minConfirmations?.ethereum || 12,
      SOL: config.security?.minConfirmations?.solana || 32,
      TON: config.security?.minConfirmations?.ton || 24,
      BTC: config.security?.minConfirmations?.bitcoin || 6
    },
    gasSettings: {
      ETH: {
        low: "20",
        medium: "50",
        high: "100"
      },
      SOL: {
        priorityFee: "10000"
      }
    },
    testingModes: [
      {
        name: "Single Bridge Test",
        endpoint: "/enhanced-bridge/test-transfer",
        description: "Test a single bridge transfer between two chains"
      },
      {
        name: "Vault Bridge Test",
        endpoint: "/enhanced-bridge/test-vault-bridge",
        description: "Test a complete vault operation across multiple chains"
      },
      {
        name: "Message Relay Test",
        endpoint: "/enhanced-bridge/test-message-relay",
        description: "Test cross-chain message relay"
      },
      {
        name: "Comprehensive Test",
        endpoint: "/enhanced-bridge/comprehensive-test",
        description: "Run a full test suite across all supported chains"
      }
    ],
    developerDocs: {
      overview: "https://docs.chronosvault.io/bridge/overview",
      api: "https://docs.chronosvault.io/bridge/api",
      examples: "https://docs.chronosvault.io/bridge/examples"
    }
  };
  
  res.json(bridgeConfig);
});

/**
 * Get the current performance metrics for the bridge
 */
router.get("/metrics", async (_req: Request, res: Response) => {
  try {
    // In a real implementation, these would be gathered from monitoring services
    const metrics = {
      timestamp: Date.now(),
      latency: {
        average: {
          "ETH->SOL": 12500, // ms
          "ETH->TON": 15000,
          "ETH->BTC": 30000,
          "SOL->ETH": 13000,
          "SOL->TON": 11000,
          "SOL->BTC": 32000,
          "TON->ETH": 14500,
          "TON->SOL": 10500,
          "TON->BTC": 33000,
          "BTC->ETH": 31000,
          "BTC->SOL": 32500,
          "BTC->TON": 31500
        },
        p95: {
          "ETH->SOL": 18000,
          "ETH->TON": 22000,
          "ETH->BTC": 45000,
          "SOL->ETH": 19000,
          "SOL->TON": 16000,
          "SOL->BTC": 48000,
          "TON->ETH": 21000,
          "TON->SOL": 15000,
          "TON->BTC": 49000,
          "BTC->ETH": 46000,
          "BTC->SOL": 47000,
          "BTC->TON": 46000
        }
      },
      throughput: {
        "ETH->SOL": 120, // transactions per minute
        "ETH->TON": 100,
        "ETH->BTC": 30,
        "SOL->ETH": 110,
        "SOL->TON": 130,
        "SOL->BTC": 35,
        "TON->ETH": 105,
        "TON->SOL": 135,
        "TON->BTC": 32,
        "BTC->ETH": 30,
        "BTC->SOL": 35,
        "BTC->TON": 33
      },
      reliability: {
        successRate: {
          "ETH->SOL": 0.998,
          "ETH->TON": 0.992,
          "ETH->BTC": 0.985,
          "SOL->ETH": 0.996,
          "SOL->TON": 0.994,
          "SOL->BTC": 0.982,
          "TON->ETH": 0.991,
          "TON->SOL": 0.995,
          "TON->BTC": 0.980,
          "BTC->ETH": 0.984,
          "BTC->SOL": 0.981,
          "BTC->TON": 0.979
        },
        averageRetries: {
          "ETH->SOL": 0.1,
          "ETH->TON": 0.15,
          "ETH->BTC": 0.25,
          "SOL->ETH": 0.12,
          "SOL->TON": 0.08,
          "SOL->BTC": 0.28,
          "TON->ETH": 0.18,
          "TON->SOL": 0.09,
          "TON->BTC": 0.3,
          "BTC->ETH": 0.26,
          "BTC->SOL": 0.29,
          "BTC->TON": 0.31
        }
      },
      cost: {
        averageFee: {
          "ETH->SOL": "0.002 ETH",
          "ETH->TON": "0.0025 ETH",
          "ETH->BTC": "0.003 ETH",
          "SOL->ETH": "0.02 SOL",
          "SOL->TON": "0.015 SOL",
          "SOL->BTC": "0.025 SOL",
          "TON->ETH": "0.15 TON",
          "TON->SOL": "0.12 TON",
          "TON->BTC": "0.18 TON",
          "BTC->ETH": "0.00015 BTC",
          "BTC->SOL": "0.00012 BTC",
          "BTC->TON": "0.0001 BTC"
        }
      },
      securityIndex: {
        "ETH->SOL": 98,
        "ETH->TON": 97,
        "ETH->BTC": 99,
        "SOL->ETH": 97,
        "SOL->TON": 96,
        "SOL->BTC": 98,
        "TON->ETH": 96,
        "TON->SOL": 95,
        "TON->BTC": 97,
        "BTC->ETH": 99,
        "BTC->SOL": 98,
        "BTC->TON": 97
      }
    };
    
    res.json(metrics);
  } catch (error) {
    securityLogger.error("Error retrieving bridge metrics", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Reset bridge state for testing purposes
 */
router.post("/reset-for-testing", async (_req: Request, res: Response) => {
  try {
    if (!config.isDevelopmentMode) {
      return res.status(403).json({
        success: false,
        error: "Reset operation is only available in development mode"
      });
    }
    
    // Reset bridge state in each client
    await Promise.all([
      ethersClient.isInitialized() ? ethersClient.resetState() : Promise.resolve(),
      solanaClient.isInitialized() ? solanaClient.resetState() : Promise.resolve(),
      tonClient.isInitialized() ? tonClient.resetState() : Promise.resolve(),
      bitcoinService.isInitialized() ? bitcoinService.resetState() : Promise.resolve()
    ]);
    
    // Reinitialize cross-chain bridge
    await crossChainBridge.initialize();
    
    res.json({
      success: true,
      message: "Bridge state reset successfully for testing"
    });
  } catch (error) {
    securityLogger.error("Error resetting bridge state", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export const enhancedBridgeTestRoutes = router;