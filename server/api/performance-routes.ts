/**
 * Performance Optimization API Routes
 * 
 * Routes for managing application performance, including cache management,
 * rate limiting, and performance metrics.
 */

import express, { Request, Response } from 'express';
import { performanceOptimizer } from '../performance/optimization-service';

const router = express.Router();

/**
 * Get performance metrics
 * 
 * Returns current performance statistics for all tracked operations
 */
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const metrics = performanceOptimizer.getPerformanceMetrics();
    const metricsObj: any = {};
    
    // Convert Map to object for JSON response
    for (const [key, value] of metrics) {
      metricsObj[key] = value;
    }
    
    res.json({
      status: 'success',
      data: metricsObj
    });
  } catch (error) {
    console.error('Failed to get performance metrics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve performance metrics'
    });
  }
});

/**
 * Get cache statistics
 * 
 * Returns statistics about the current state of all application caches
 */
router.get('/cache/stats', (req: Request, res: Response) => {
  try {
    const cacheStats = performanceOptimizer.getCacheStatistics();
    
    res.json({
      status: 'success',
      data: cacheStats
    });
  } catch (error) {
    console.error('Failed to get cache statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve cache statistics'
    });
  }
});

/**
 * Clear all caches
 * 
 * Removes all data from all application caches
 */
router.post('/cache/clear-all', (req: Request, res: Response) => {
  try {
    performanceOptimizer.clearAllCaches();
    
    res.json({
      status: 'success',
      message: 'All caches cleared successfully'
    });
  } catch (error) {
    console.error('Failed to clear caches:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear caches'
    });
  }
});

/**
 * Reset rate limit for a client
 * 
 * Removes rate limiting restrictions for a specific client
 */
router.post('/rate-limit/reset', (req: Request, res: Response) => {
  const { clientId } = req.body;
  
  if (!clientId) {
    return res.status(400).json({
      status: 'error',
      message: 'Client ID is required'
    });
  }
  
  try {
    performanceOptimizer.resetRateLimit(clientId);
    
    res.json({
      status: 'success',
      message: `Rate limit reset for client ${clientId}`
    });
  } catch (error) {
    console.error(`Failed to reset rate limit for client ${clientId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset rate limit'
    });
  }
});

/**
 * Test rate limiting
 * 
 * Endpoint for testing rate limiting functionality
 */
router.get('/rate-limit/test', (req: Request, res: Response) => {
  const clientId = req.query.clientId as string || 'test-client';
  const endpoint = '/api/performance/rate-limit/test';
  
  const allowed = performanceOptimizer.checkRateLimit(endpoint, clientId);
  
  if (allowed) {
    res.json({
      status: 'success',
      message: 'Request allowed',
      clientId,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(429).json({
      status: 'error',
      message: 'Rate limit exceeded',
      clientId,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update batch processing size
 * 
 * Adjusts the batch size threshold for a specific operation type
 */
router.post('/batch/update-size', (req: Request, res: Response) => {
  const { operationType, batchSize } = req.body;
  
  if (!operationType || !batchSize) {
    return res.status(400).json({
      status: 'error',
      message: 'Operation type and batch size are required'
    });
  }
  
  try {
    performanceOptimizer.updateBatchSize(operationType, batchSize);
    
    res.json({
      status: 'success',
      message: `Batch size updated for ${operationType} to ${batchSize}`
    });
  } catch (error) {
    console.error(`Failed to update batch size for ${operationType}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update batch size'
    });
  }
});

/**
 * Health check
 * 
 * Returns the status and health of the performance optimization service
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    service: 'Performance Optimization',
    initialized: true,
    timestamp: new Date().toISOString()
  });
});

export { router as performanceRoutes };