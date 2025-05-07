/**
 * System Health API Routes
 * 
 * Routes for accessing and managing system health monitoring.
 */

import express, { Request, Response, Router } from 'express';
import { systemHealthMonitor, SystemComponent } from '../monitoring/system-health-monitor';

const router: Router = express.Router();

/**
 * Get system health overview
 * 
 * Returns a comprehensive health status of the entire system
 */
router.get('/system-health', (req: Request, res: Response) => {
  try {
    const healthStatus = systemHealthMonitor.getSystemHealth();
    
    res.status(200).json({
      status: 'success',
      data: healthStatus
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve system health status: ' + error.message
    });
  }
});

/**
 * Get system health status (alias for system-health)
 */
router.get('/status', (req: Request, res: Response) => {
  try {
    const healthStatus = systemHealthMonitor.getSystemHealth();
    
    res.status(200).json({
      status: 'success',
      data: healthStatus
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve system health status: ' + error.message
    });
  }
});

/**
 * Force immediate health check
 * 
 * Triggers an immediate health check and returns the results
 */
router.post('/check', async (req: Request, res: Response) => {
  try {
    const healthStatus = await systemHealthMonitor.forceHealthCheck();
    
    res.status(200).json({
      status: 'success',
      message: 'Health check completed successfully',
      data: healthStatus
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to perform health check: ' + error.message
    });
  }
});

/**
 * Check specific component health
 * 
 * Returns the health status of a specific system component
 */
router.get('/component/:component', (req: Request, res: Response) => {
  try {
    const { component } = req.params;
    
    // Validate component
    if (!Object.values(SystemComponent).includes(component as SystemComponent)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid component specified'
      });
    }
    
    const healthStatus = systemHealthMonitor.getSystemHealth();
    const componentHealth = healthStatus.components[component];
    
    if (!componentHealth) {
      return res.status(404).json({
        status: 'error',
        message: 'Component health data not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        component,
        health: componentHealth,
        isHealthy: systemHealthMonitor.isComponentHealthy(component as SystemComponent)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve component health: ' + error.message
    });
  }
});

/**
 * Get performance-only health metrics
 * 
 * Returns performance-related health metrics
 */
router.get('/performance', (req: Request, res: Response) => {
  try {
    const healthStatus = systemHealthMonitor.getSystemHealth();
    
    res.status(200).json({
      status: 'success',
      data: {
        systemStatus: healthStatus.status,
        performanceMetrics: healthStatus.metrics.performanceMetrics,
        vaultOperations: healthStatus.metrics.vaultOperations,
        crossChainOperations: healthStatus.metrics.crossChainOperations,
        components: {
          apiGateway: healthStatus.components[SystemComponent.API_GATEWAY],
          cache: healthStatus.components[SystemComponent.CACHE],
          database: healthStatus.components[SystemComponent.DATABASE],
          crossChainBridge: healthStatus.components[SystemComponent.CROSS_CHAIN_BRIDGE]
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve performance health metrics: ' + error.message
    });
  }
});

/**
 * Get security-only health metrics
 * 
 * Returns security-related health metrics
 */
router.get('/security', (req: Request, res: Response) => {
  try {
    const healthStatus = systemHealthMonitor.getSystemHealth();
    
    res.status(200).json({
      status: 'success',
      data: {
        systemStatus: healthStatus.status,
        securityMetrics: healthStatus.metrics.securityMetrics,
        logIntegrity: healthStatus.logIntegrity,
        components: {
          authentication: healthStatus.components[SystemComponent.AUTHENTICATION],
          ethereumNode: healthStatus.components[SystemComponent.ETHEREUM_NODE],
          tonNode: healthStatus.components[SystemComponent.TON_NODE],
          solanaNode: healthStatus.components[SystemComponent.SOLANA_NODE],
          bitcoinNode: healthStatus.components[SystemComponent.BITCOIN_NODE]
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve security health metrics: ' + error.message
    });
  }
});

/**
 * Update component health
 * 
 * Manually updates the health status of a specific component
 * (primarily for testing and development)
 */
router.post('/component/:component', (req: Request, res: Response) => {
  try {
    const { component } = req.params;
    const { latencyMs, errorRate, details } = req.body;
    
    // Validate component
    if (!Object.values(SystemComponent).includes(component as SystemComponent)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid component specified'
      });
    }
    
    // Update component health
    systemHealthMonitor.updateComponentHealth(component as SystemComponent, {
      latencyMs,
      errorRate,
      details
    });
    
    // Get updated health
    const healthStatus = systemHealthMonitor.getSystemHealth();
    const componentHealth = healthStatus.components[component];
    
    res.status(200).json({
      status: 'success',
      message: `Component ${component} health updated successfully`,
      data: {
        component,
        health: componentHealth,
        isHealthy: systemHealthMonitor.isComponentHealthy(component as SystemComponent)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update component health: ' + error.message
    });
  }
});

export default router;