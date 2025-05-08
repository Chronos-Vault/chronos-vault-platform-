/**
 * Server Entry Point
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { registerRoutes } from './routes';
import { performanceOptimizer } from './performance/optimization-service';
import { systemHealthMonitor } from './monitoring/system-health-monitor';
import { securityLogger, SecurityEventType } from './monitoring/security-logger';
import { setupVite, serveStatic } from './vite';
import { getSecurityAuditService } from './security/security-audit-service';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize services
(async () => {
  try {
    // Initialize performance optimization service
    await performanceOptimizer.initialize();
    console.log('Performance optimization service initialized successfully');
    
    // Initialize security audit service
    try {
      const securityAuditService = getSecurityAuditService();
      securityAuditService.initialize();
      console.log('Security Audit Service initialized successfully');
    } catch (securityError: any) {
      console.warn('Security Audit Service initialization delayed (blockchain connectors not ready):', securityError.message);
      // We'll initialize later after blockchain connectors are ready
    }
    
    // Log server startup
    securityLogger.info(
      'Server starting up',
      SecurityEventType.SYSTEM_ERROR,
      { 
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
      }
    );
    
    // Force an initial health check
    await systemHealthMonitor.forceHealthCheck();
    
  } catch (error: any) {
    console.error('Failed to initialize services:', error);
    securityLogger.critical(
      `Failed to initialize services: ${error.message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error: error.stack }
    );
  }
})();

// Register API routes and start server
(async () => {
  try {
    const httpServer = await registerRoutes(app);
    
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      securityLogger.info(
        `Server started on port ${PORT}`,
        SecurityEventType.SYSTEM_ERROR,
        { 
          port: PORT,
          timestamp: new Date(),
          environment: process.env.NODE_ENV || 'development'
        }
      );
    });
  } catch (error: any) {
    console.error('Failed to start server:', error);
    securityLogger.critical(
      `Failed to start server: ${error.message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error: error.stack }
    );
    process.exit(1);
  }
})();