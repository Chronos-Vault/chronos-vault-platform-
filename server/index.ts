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
import { transactionMonitor } from './blockchain/transaction-monitor';

// Set development mode environment variables
if (process.env.NODE_ENV === 'development') {
  process.env.BYPASS_AUTH = 'true';
  console.log('Running in development mode with authentication bypass enabled');
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mobile wallet connection endpoints
app.post('/api/wallet/status', (req, res) => {
  const { walletType, timestamp } = req.body;
  
  // Simulate successful connection after user authorization delay
  if (Date.now() - timestamp > 5000) {
    const addresses = {
      phantom: 'BfYXwvd4jMYoFnphtf9vkAe8ZiU7roYZSEFGsi2oXhjz',
      tonkeeper: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
      metamask: '0x742d35Cc6635C0532925a3b8D92C5A6Cdc3B'
    };
    
    res.json({
      connected: true,
      address: addresses[walletType as keyof typeof addresses]
    });
  } else {
    res.json({ connected: false });
  }
});

// Phantom wallet connection endpoint
app.post('/api/wallet/phantom-connect', async (req, res) => {
  const { connectionData } = req.body;
  
  try {
    // Parse connection data and establish Phantom connection
    const connectionInfo = JSON.parse(connectionData);
    
    // Simulate Phantom wallet authorization
    setTimeout(() => {
      res.json({
        publicKey: 'BfYXwvd4jMYoFnphtf9vkAe8ZiU7roYZSEFGsi2oXhjz',
        connected: true
      });
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: 'Invalid connection data' });
  }
});

// TON Keeper connection endpoint
app.post('/api/wallet/ton-connect', async (req, res) => {
  const { connectionUri } = req.body;
  
  try {
    // Parse TON Connect URI and establish connection
    const tonConnectInfo = new URL(connectionUri);
    
    // Simulate TON Keeper authorization
    setTimeout(() => {
      res.json({
        address: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
        connected: true
      });
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: 'Invalid TON Connect URI' });
  }
});

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
    
    // Initialize transaction monitor
    transactionMonitor.initialize();
    console.log('Transaction Monitor initialized successfully');
    
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