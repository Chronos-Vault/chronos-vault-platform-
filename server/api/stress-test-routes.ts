/**
 * Stress Test Routes
 * 
 * API routes for running cross-chain operation stress tests
 * to evaluate system performance, reliability, and security.
 */

import { Router, Request, Response } from "express";
import { crossChainStressTester } from "../tests/cross-chain-stress-tests";
import { securityLogger } from "../monitoring/security-logger";
import { BlockchainType } from "../../shared/types";

const router = Router();

/**
 * Generate stress test configuration from request
 */
function getStressTestConfig(req: Request) {
  return {
    iterations: parseInt(req.query.iterations as string) || 20,
    concurrency: parseInt(req.query.concurrency as string) || 5,
    delay: parseInt(req.query.delay as string) || 0,
    timeoutMs: parseInt(req.query.timeoutMs as string) || 30000,
    chains: req.query.chains
      ? (req.query.chains as string).split(",") as BlockchainType[]
      : ['ETH', 'SOL', 'TON'],
    isDevelopmentMode: req.query.debug === 'true'
  };
}

/**
 * Run a bridge stress test
 */
router.get("/bridge-stress-test", async (req: Request, res: Response) => {
  try {
    securityLogger.info("Starting bridge stress test via API", req.query);
    
    const config = getStressTestConfig(req);
    const results = await crossChainStressTester.runBridgeStressTest(config);
    
    res.json(results);
  } catch (error) {
    securityLogger.error("Error running bridge stress test", error);
    res.status(500).json({
      error: "Failed to run bridge stress test",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Run a verification stress test
 */
router.get("/verification-stress-test", async (req: Request, res: Response) => {
  try {
    securityLogger.info("Starting verification stress test via API", req.query);
    
    const config = getStressTestConfig(req);
    const results = await crossChainStressTester.runVerificationStressTest(config);
    
    res.json(results);
  } catch (error) {
    securityLogger.error("Error running verification stress test", error);
    res.status(500).json({
      error: "Failed to run verification stress test",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Run a mixed operations stress test
 */
router.get("/mixed-operations-stress-test", async (req: Request, res: Response) => {
  try {
    securityLogger.info("Starting mixed operations stress test via API", req.query);
    
    const config = getStressTestConfig(req);
    const results = await crossChainStressTester.runMixedOperationsStressTest(config);
    
    res.json(results);
  } catch (error) {
    securityLogger.error("Error running mixed operations stress test", error);
    res.status(500).json({
      error: "Failed to run mixed operations stress test",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Run a security stress test with malformed inputs
 */
router.get("/security-stress-test", async (req: Request, res: Response) => {
  try {
    securityLogger.info("Starting security stress test via API", req.query);
    
    const config = getStressTestConfig(req);
    const results = await crossChainStressTester.runSecurityStressTest(config);
    
    res.json(results);
  } catch (error) {
    securityLogger.error("Error running security stress test", error);
    res.status(500).json({
      error: "Failed to run security stress test",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Run all stress tests in sequence
 */
router.get("/run-all-tests", async (req: Request, res: Response) => {
  try {
    securityLogger.info("Starting all stress tests via API", req.query);
    
    const config = getStressTestConfig(req);
    
    // Reduce iterations for full suite to avoid timeouts
    const reducedConfig = {
      ...config,
      iterations: Math.max(5, Math.floor(config.iterations / 4))
    };
    
    // Run all tests in sequence
    const bridgeResults = await crossChainStressTester.runBridgeStressTest(reducedConfig);
    const verificationResults = await crossChainStressTester.runVerificationStressTest(reducedConfig);
    const mixedResults = await crossChainStressTester.runMixedOperationsStressTest(reducedConfig);
    const securityResults = await crossChainStressTester.runSecurityStressTest(reducedConfig);
    
    // Aggregate the results
    const aggregateResults = {
      timestamp: Date.now(),
      totalDurationMs: bridgeResults.durationMs + verificationResults.durationMs + 
                        mixedResults.durationMs + securityResults.durationMs,
      averageOperationsPerSecond: (
        bridgeResults.operationsPerSecond + 
        verificationResults.operationsPerSecond + 
        mixedResults.operationsPerSecond + 
        securityResults.operationsPerSecond
      ) / 4,
      averageErrorRate: (
        bridgeResults.errorRate + 
        verificationResults.errorRate + 
        mixedResults.errorRate + 
        securityResults.errorRate
      ) / 4,
      testResults: {
        bridge: bridgeResults,
        verification: verificationResults,
        mixedOperations: mixedResults,
        security: securityResults
      },
      summary: {
        passedTests: [
          bridgeResults.success ? "Bridge Test" : null,
          verificationResults.success ? "Verification Test" : null,
          mixedResults.success ? "Mixed Operations Test" : null,
          securityResults.success ? "Security Test" : null
        ].filter(Boolean),
        failedTests: [
          !bridgeResults.success ? "Bridge Test" : null,
          !verificationResults.success ? "Verification Test" : null,
          !mixedResults.success ? "Mixed Operations Test" : null,
          !securityResults.success ? "Security Test" : null
        ].filter(Boolean),
        totalErrors: bridgeResults.errors.length + verificationResults.errors.length + 
                    mixedResults.errors.length + securityResults.errors.length,
        potentialSecurityIssues: securityResults.details.securityIssuesDetected || 0
      }
    };
    
    res.json(aggregateResults);
  } catch (error) {
    securityLogger.error("Error running all stress tests", error);
    res.status(500).json({
      error: "Failed to run all stress tests",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Get stress test configuration options
 */
router.get("/config-options", (_req: Request, res: Response) => {
  res.json({
    defaultConfig: {
      iterations: 20,
      concurrency: 5,
      delay: 0,
      timeoutMs: 30000,
      chains: ['ETH', 'SOL', 'TON']
    },
    parameterRanges: {
      iterations: {
        min: 5,
        max: 100,
        recommended: 20
      },
      concurrency: {
        min: 1,
        max: 20,
        recommended: 5
      },
      delay: {
        min: 0,
        max: 1000,
        recommended: 0
      },
      timeoutMs: {
        min: 5000,
        max: 60000,
        recommended: 30000
      }
    },
    supportedChains: ['ETH', 'SOL', 'TON'],
    testTypes: [
      {
        name: "Bridge Stress Test",
        endpoint: "/api/stress-test/bridge-stress-test",
        description: "Tests cross-chain bridge operations under load"
      },
      {
        name: "Verification Stress Test",
        endpoint: "/api/stress-test/verification-stress-test",
        description: "Tests cross-chain verification operations under load"
      },
      {
        name: "Mixed Operations Test",
        endpoint: "/api/stress-test/mixed-operations-stress-test",
        description: "Tests a mix of cross-chain operations under load"
      },
      {
        name: "Security Test",
        endpoint: "/api/stress-test/security-stress-test",
        description: "Tests system resilience against malformed inputs"
      },
      {
        name: "All Tests",
        endpoint: "/api/stress-test/run-all-tests",
        description: "Runs all stress tests in sequence"
      }
    ]
  });
});

export const stressTestRoutes = router;