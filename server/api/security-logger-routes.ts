/**
 * Security Logger API Routes
 * 
 * Routes for accessing and managing the security logging system.
 */

import express, { Request, Response, Router } from 'express';
import { securityLogger, SecurityEventType, SecurityLogLevel } from '../monitoring/security-logger';

const router: Router = express.Router();

/**
 * Get security logs with optional filtering
 * 
 * Retrieves security logs filtered by specified criteria
 */
router.get('/logs', (req: Request, res: Response) => {
  try {
    const { 
      startTime, 
      endTime, 
      level, 
      eventType, 
      userId, 
      limit = 100 
    } = req.query;
    
    // Parse and validate query parameters
    const options: any = { limit: parseInt(limit as string) };
    
    if (startTime) {
      options.startTime = new Date(startTime as string);
    }
    
    if (endTime) {
      options.endTime = new Date(endTime as string);
    }
    
    if (level && Object.values(SecurityLogLevel).includes(level as SecurityLogLevel)) {
      options.level = level;
    }
    
    if (eventType && Object.values(SecurityEventType).includes(eventType as SecurityEventType)) {
      options.eventType = eventType;
    }
    
    if (userId) {
      options.userId = userId;
    }
    
    const logs = securityLogger.getLogs(options);
    
    res.status(200).json({
      status: 'success',
      data: logs
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve security logs: ' + error.message
    });
  }
});

/**
 * Get security metrics
 * 
 * Returns aggregated security metrics and statistics
 */
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const metrics = securityLogger.getSecurityMetrics();
    
    res.status(200).json({
      status: 'success',
      data: metrics
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve security metrics: ' + error.message
    });
  }
});

/**
 * Verify log integrity
 * 
 * Checks if the security log chain is intact or if tampering is detected
 */
router.get('/verify-integrity', (req: Request, res: Response) => {
  try {
    const isIntact = securityLogger.verifyLogIntegrity();
    
    res.status(200).json({
      status: 'success',
      data: {
        isIntact,
        message: isIntact 
          ? 'Log integrity verified: No tampering detected' 
          : 'WARNING: Log integrity compromised! Tampering detected'
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify log integrity: ' + error.message
    });
  }
});

/**
 * Create a test log entry
 * 
 * Creates a test security log entry (only available in development mode)
 */
router.post('/test-log', (req: Request, res: Response) => {
  try {
    const { level = 'INFO', eventType = 'SYSTEM_ERROR', message, metadata } = req.body;
    
    // Validate level
    if (!Object.values(SecurityLogLevel).includes(level)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid log level'
      });
    }
    
    // Validate event type
    if (!Object.values(SecurityEventType).includes(eventType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid event type'
      });
    }
    
    // Create log based on level
    switch (level) {
      case SecurityLogLevel.INFO:
        securityLogger.info(message || 'Test info log', eventType, metadata);
        break;
      case SecurityLogLevel.WARNING:
        securityLogger.warn(message || 'Test warning log', eventType, metadata);
        break;
      case SecurityLogLevel.ERROR:
        securityLogger.error(message || 'Test error log', eventType, metadata);
        break;
      case SecurityLogLevel.CRITICAL:
        securityLogger.critical(message || 'Test critical log', eventType, metadata);
        break;
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Test log created successfully',
      data: {
        level,
        eventType,
        message: message || `Test ${level.toLowerCase()} log`,
        metadata: metadata || {}
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create test log: ' + error.message
    });
  }
});

export default router;