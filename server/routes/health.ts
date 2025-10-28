/**
 * Health Check Endpoints for Atomic Swap Service
 * 
 * Provides monitoring and health status for Trinity Protocol HTLC swaps
 * 
 * @author Chronos Vault Team
 * @version v1.5-PRODUCTION
 */

import { Router } from 'express';
import { atomicSwapService } from '../defi/atomic-swap-service';
import { atomicSwapMetrics } from '../monitoring/atomic-swap-metrics';

const router = Router();

/**
 * GET /api/health/atomic-swap
 * 
 * Health check for atomic swap service
 */
router.get('/atomic-swap', async (req, res) => {
  try {
    const healthCheck = await atomicSwapService.healthCheck();
    
    const statusCode = healthCheck.status === 'healthy' ? 200 :
                       healthCheck.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json({
      status: healthCheck.status,
      timestamp: new Date().toISOString(),
      checks: healthCheck.checks,
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/atomic-swap/metrics
 * 
 * Get comprehensive metrics for atomic swaps
 */
router.get('/atomic-swap/metrics', (req, res) => {
  try {
    const metrics = atomicSwapMetrics.getMetricsReport();
    
    res.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * GET /api/health/atomic-swap/prometheus
 * 
 * Prometheus-format metrics export
 */
router.get('/atomic-swap/prometheus', (req, res) => {
  try {
    const prometheusMetrics = atomicSwapMetrics.exportPrometheusMetrics();
    
    res.set('Content-Type', 'text/plain');
    res.send(prometheusMetrics);
  } catch (error) {
    res.status(500).send(`# ERROR: ${(error as Error).message}`);
  }
});

/**
 * GET /api/health/atomic-swap/detailed
 * 
 * Detailed health and performance metrics
 */
router.get('/atomic-swap/detailed', async (req, res) => {
  try {
    const healthCheck = await atomicSwapService.healthCheck();
    const metrics = atomicSwapMetrics.getMetricsReport();
    
    res.json({
      success: true,
      health: healthCheck,
      metrics,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

export default router;
