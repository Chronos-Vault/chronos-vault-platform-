import { Router, Request, Response } from "express";
import { crossChainTestRunner } from "../tests/cross-chain-operations";
import { securityLogger } from "../monitoring/security-logger";

const router = Router();

// Run all cross-chain tests
router.get("/run-tests", async (_req: Request, res: Response) => {
  try {
    securityLogger.info("Starting cross-chain test suite");
    const testResults = await crossChainTestRunner.runAllTests();
    res.json(testResults);
  } catch (error) {
    securityLogger.error("Error running cross-chain tests", error);
    res.status(500).json({
      error: "Failed to run cross-chain tests",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Run specific test category
router.get("/run-tests/:category", async (req: Request, res: Response) => {
  const { category } = req.params;
  
  try {
    securityLogger.info(`Starting cross-chain test category: ${category}`);
    
    // In a more complete implementation, we'd have category-specific test runners
    // For now, we'll just run all tests
    const testResults = await crossChainTestRunner.runAllTests();
    
    res.json({
      category,
      results: testResults
    });
  } catch (error) {
    securityLogger.error(`Error running cross-chain tests for category: ${category}`, error);
    res.status(500).json({
      error: "Failed to run cross-chain tests",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export const crossChainTestingRoutes = router;