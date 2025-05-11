/**
 * API Routes Registration
 */

import { Express, Request, Response, Router } from 'express';
import { createServer, Server } from 'http';
import { performanceRoutes } from './api/performance-routes';
import securityLoggerRoutes from './api/security-logger-routes';
import healthRoutes from './api/health-routes';
import incidentRoutes from './api/incident-routes';
import paymentRoutes from './api/payment-routes';
import vaultVerificationRoutes, { initializeVaultVerification } from './api/vault-verification-routes';
import chainAgnosticVerificationRoutes, { initializeChainAgnosticVerification } from './api/chain-agnostic-verification-routes';
import multiChainStateSyncRoutes, { initializeMultiChainSync } from './api/multi-chain-state-sync-routes';
import { intentInheritanceRouter } from './api/intent-inheritance-routes';
import progressiveQuantumVaultRoutes from './api/progressive-quantum-vault-routes';
import vaultsRoutes from './api/vaults-routes';
import biometricRoutes from './routes/biometric-routes';
import zeroKnowledgeRoutes from './api/zero-knowledge-routes';
import geoVaultRoutes from './api/geo-vault-routes';
import bridgeRoutes from './api/bridge-routes';
import { systemHealthMonitor } from './monitoring/system-health-monitor';
import { incidentResponseSystem } from './monitoring/incident-response';
import { ConnectorFactory } from './blockchain/connector-factory';
import { securityLogger, SecurityEventType } from './monitoring/security-logger';
import { geolocationService } from './services/geolocation-service';
import { VerificationStatus } from './blockchain/cross-chain-vault-verification';
import { WebSocketServer, WebSocket } from 'ws';

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server instance
  const httpServer = createServer(app);
  
  // Create API router to handle all API routes
  const apiRouter = Router();
  
  // Register API sub-routes
  apiRouter.use('/performance', performanceRoutes);
  apiRouter.use('/security', securityLoggerRoutes);
  apiRouter.use('/health', healthRoutes);
  apiRouter.use('/incidents', incidentRoutes);
  apiRouter.use('/payments', paymentRoutes);
  
  // Initialize the blockchain connector factory
  // This would be done in your app initialization
  const connectorFactory = new ConnectorFactory();
  
  // Initialize and register vault verification routes
  const crossChainVerification = initializeVaultVerification(connectorFactory);
  apiRouter.use('/vault-verification', vaultVerificationRoutes);
  
  // Register intent-based inheritance routes
  apiRouter.use('/intent-inheritance', intentInheritanceRouter);
  
  // Register progressive quantum vault routes
  apiRouter.use('/security/progressive-quantum', progressiveQuantumVaultRoutes);
  
  // Register vault management routes
  apiRouter.use('/vaults', vaultsRoutes);
  
  // Register biometric authentication routes
  apiRouter.use('/biometric', biometricRoutes);
  
  // Register zero-knowledge proof routes
  apiRouter.use('/zk', zeroKnowledgeRoutes);
  
  // Register geolocation vault routes
  apiRouter.use('/geo-vaults', geoVaultRoutes);
  
  // Register cross-chain bridge routes
  apiRouter.use('/bridge', bridgeRoutes);
  
  // Initialize and register chain-agnostic verification routes
  const chainAgnosticVerifier = initializeChainAgnosticVerification(connectorFactory);
  apiRouter.use('/chain-agnostic-verification', chainAgnosticVerificationRoutes);
  
  // Initialize and register multi-chain state synchronization routes
  const multiChainSyncService = initializeMultiChainSync(connectorFactory);
  apiRouter.use('/multi-chain-sync', multiChainStateSyncRoutes);
  
  // Initialize WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial data to the client
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      data: {
        timestamp: new Date().toISOString(),
        message: 'Connected to Chronos Vault real-time server'
      }
    }));
    
    // Handle client messages
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log('Received message:', parsedMessage);
        
        // Handle different message types
        switch (parsedMessage.type) {
          case 'PING':
            ws.send(JSON.stringify({
              type: 'PONG',
              data: {
                timestamp: new Date().toISOString()
              }
            }));
            break;
          
          case 'SUBSCRIBE_BRIDGE_UPDATES':
            // Subscribe the client to bridge status updates
            ws.bridgeSubscription = true;
            break;
          
          default:
            console.log('Unknown message type:', parsedMessage.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  // Broadcast bridge status updates to subscribed clients
  setInterval(() => {
    const clients = wss.clients;
    if (clients.size > 0) {
      const bridgeStatuses = {
        'ethereum-ton': {
          status: 'operational',
          latency: Math.floor(Math.random() * 200 + 50),
          pendingTransactions: Math.floor(Math.random() * 5),
          successRate: 99.8
        },
        'ethereum-solana': {
          status: 'operational',
          latency: Math.floor(Math.random() * 150 + 30),
          pendingTransactions: Math.floor(Math.random() * 3),
          successRate: 99.9
        },
        'solana-ton': {
          status: Math.random() > 0.9 ? 'degraded' : 'operational',
          latency: Math.floor(Math.random() * 300 + 100),
          pendingTransactions: Math.floor(Math.random() * 10),
          successRate: 98.5
        }
      };
      
      clients.forEach(client => {
        // Check if client is open and has bridgeSubscription property
        if (client.readyState === 1 && (client as any).bridgeSubscription) {
          client.send(JSON.stringify({
            type: 'BRIDGE_STATUS_UPDATE',
            data: {
              timestamp: new Date().toISOString(),
              bridges: bridgeStatuses
            }
          }));
        }
      });
    }
  }, 5000);
  
  // Add event listeners for verification status updates
  crossChainVerification.on('verification:completed', (result) => {
    securityLogger.info(`Vault verification completed for ${result.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION, {
      vaultId: result.vaultId,
      primaryChain: result.primaryChain,
      isValid: result.isValid,
      status: result.status
    });
    
    // Broadcast verification completion to WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'VERIFICATION_COMPLETED',
          data: {
            timestamp: new Date().toISOString(),
            vaultId: result.vaultId,
            isValid: result.isValid,
            primaryChain: result.primaryChain
          }
        }));
      }
    });
  });
  
  crossChainVerification.on('verification:transaction:confirmed', (data) => {
    securityLogger.info(`Verification transaction confirmed: ${data.transactionId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION, {
      transactionId: data.transactionId,
      vaultId: data.vaultId,
      chainId: data.chainId
    });
    
    // Broadcast transaction confirmation to WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'TRANSACTION_CONFIRMED',
          data: {
            timestamp: new Date().toISOString(),
            transactionId: data.transactionId,
            vaultId: data.vaultId,
            chainId: data.chainId
          }
        }));
      }
    });
  });
  
  crossChainVerification.on('verification:transaction:failed', (data) => {
    securityLogger.warn(`Verification transaction failed: ${data.transactionId}`, SecurityEventType.SYSTEM_ERROR, {
      transactionId: data.transactionId,
      vaultId: data.vaultId,
      chainId: data.chainId,
      error: data.error
    });
    
    // Broadcast transaction failure to WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'TRANSACTION_FAILED',
          data: {
            timestamp: new Date().toISOString(),
            transactionId: data.transactionId,
            vaultId: data.vaultId,
            chainId: data.chainId,
            error: data.error
          }
        }));
      }
    });
  });
  
  // Simple health check route - lightweight version for quick status checks
  apiRouter.get('/health-check', (_req: Request, res: Response) => {
    const health = systemHealthMonitor.getSystemHealth();
    res.json({
      status: health.status,
      timestamp: Date.now(),
      version: '1.0.0'
    });
  });
  
  // Register the API router
  app.use('/api', apiRouter);
  
  // Set up Vite for development or serve static files for production
  // We set this up last so API routes take precedence
  if (process.env.NODE_ENV === 'development') {
    const { setupVite } = await import('./vite');
    await setupVite(app, httpServer);
  } else {
    const { serveStatic } = await import('./vite');
    serveStatic(app);
  }
  
  // Handle server shutdown to clean up resources
  process.on('SIGTERM', () => {
    console.log('Server shutting down...');
    systemHealthMonitor.shutdown();
    incidentResponseSystem.shutdown();
    httpServer.close(() => {
      console.log('Server shutdown complete');
      process.exit(0);
    });
  });
  
  return httpServer;
}