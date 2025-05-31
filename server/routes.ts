/**
 * API Routes Registration
 */

import { Express, Request, Response, Router } from 'express';
import { createServer, Server } from 'http';
import { performanceRoutes } from './api/performance-routes';
import securityLoggerRoutes from './api/security-logger-routes';
import securityRoutes from './routes/security-routes';
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
import { explorerRouter } from './api/explorer-routes';
import walletApiRouter from './wallet-api';
import { testnetWalletRoutes } from './api/testnet-wallet-routes';
import { multiSigRoutes } from './api/multisig-routes';
import { hardwareWalletRoutes } from './api/hardware-wallet-routes';
import walletAuthRoutes from './routes/wallet-auth';
import vaultWalletRoutes from './routes/vault-wallet';
import { defiRoutes } from './api/defi-routes';
import { systemHealthMonitor } from './monitoring/system-health-monitor';
import { incidentResponseSystem } from './monitoring/incident-response';
import { ConnectorFactory } from './blockchain/connector-factory';
import { securityLogger, SecurityEventType } from './monitoring/security-logger';
import { geolocationService } from './services/geolocation-service';
import { VerificationStatus } from './blockchain/cross-chain-vault-verification';
import { testnetWalletService } from './services/testnet-wallet-service';
import { WebSocket } from 'ws';
import { initializeWebSocketManager, getWebSocketManager } from './websocket/websocket-manager';
import { resetOnboarding } from './api/emergency-reset';
import { registerCrossChainOperationsRoutes } from './api/cross-chain-operations-routes';
import apiRoutes from './routes/index';

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server instance
  const httpServer = createServer(app);
  
  // Initialize WebSocket manager with enhanced reliability
  initializeWebSocketManager(httpServer);
  
  // Create API router to handle all API routes
  const apiRouter = Router();
  
  // Register API sub-routes
  apiRouter.use('/performance', performanceRoutes);
  apiRouter.use('/security/logs', securityLoggerRoutes);
  apiRouter.use('/security', securityRoutes);
  apiRouter.use('/health', healthRoutes);
  apiRouter.use('/incidents', incidentRoutes);
  apiRouter.use('/payments', paymentRoutes);
  
  // Register our new device verification and TON smart contract integration routes
  apiRouter.use('/', apiRoutes);
  
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
  
  // Register cross-chain operations routes
  registerCrossChainOperationsRoutes(apiRouter);
  
  // Register vault explorer routes
  apiRouter.use('/explorer', explorerRouter);
  
  // Register wallet integration API routes
  apiRouter.use('/v1', walletApiRouter);
  
  // Initialize testnet wallet service with real private keys
  await testnetWalletService.initialize();
  
  // Register real testnet wallet routes
  apiRouter.use('/testnet-wallet', testnetWalletRoutes);
  
  // Register multi-signature wallet routes
  apiRouter.use('/multisig', multiSigRoutes);
  
  // Register hardware wallet routes
  apiRouter.use('/hardware-wallet', hardwareWalletRoutes);
  
  // Register DeFi routes
  apiRouter.use('/defi', defiRoutes);
  
  // Register wallet authorization routes
  apiRouter.use('/api', walletAuthRoutes);
  
  // Register vault-wallet integration routes
  apiRouter.use('/vault', vaultWalletRoutes);
  
  // Initialize and register chain-agnostic verification routes
  const chainAgnosticVerifier = initializeChainAgnosticVerification(connectorFactory);
  apiRouter.use('/chain-agnostic-verification', chainAgnosticVerificationRoutes);
  
  // Initialize and register multi-chain state synchronization routes
  const multiChainSyncService = initializeMultiChainSync(connectorFactory);
  apiRouter.use('/multi-chain-sync', multiChainStateSyncRoutes);
  
  // Get WebSocket manager instance
  const wsManager = getWebSocketManager();
  
  // Broadcast bridge status updates to subscribed clients
  setInterval(() => {
    // Create bridge status data
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
    
    // Broadcast to subscribed clients using the WebSocket manager
    wsManager.broadcast('BRIDGE_STATUS_UPDATE', {
      bridges: bridgeStatuses
    }, 'bridge_updates');
  }, 5000);
  
  // Add event listeners for verification status updates
  crossChainVerification.on('verification:completed', (result) => {
    securityLogger.info(`Vault verification completed for ${result.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION, {
      vaultId: result.vaultId,
      primaryChain: result.primaryChain,
      isValid: result.isValid,
      status: result.status
    });
    
    // Broadcast verification completion to WebSocket clients using the WebSocket manager
    wsManager.broadcast('VERIFICATION_COMPLETED', {
      vaultId: result.vaultId,
      isValid: result.isValid,
      primaryChain: result.primaryChain
    }, 'transaction_updates');
  });
  
  crossChainVerification.on('verification:transaction:confirmed', (data) => {
    securityLogger.info(`Verification transaction confirmed: ${data.transactionId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION, {
      transactionId: data.transactionId,
      vaultId: data.vaultId,
      chainId: data.chainId
    });
    
    // Broadcast transaction confirmation to WebSocket clients using the WebSocket manager
    wsManager.broadcast('TRANSACTION_CONFIRMED', {
      transactionId: data.transactionId,
      vaultId: data.vaultId,
      chainId: data.chainId
    }, 'transaction_updates');
  });
  
  crossChainVerification.on('verification:transaction:failed', (data) => {
    securityLogger.warn(`Verification transaction failed: ${data.transactionId}`, SecurityEventType.SYSTEM_ERROR, {
      transactionId: data.transactionId,
      vaultId: data.vaultId,
      chainId: data.chainId,
      error: data.error
    });
    
    // Broadcast transaction failure to WebSocket clients using the WebSocket manager
    wsManager.broadcast('TRANSACTION_FAILED', {
      transactionId: data.transactionId,
      vaultId: data.vaultId,
      chainId: data.chainId,
      error: data.error
    }, 'transaction_updates');
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
  
  // Register the API router with higher priority - mount before any middleware
  app.use('/api', apiRouter);
  
  // Add explicit API route handlers to ensure they bypass frontend routing
  app.use('/api/*', (req, res, next) => {
    // If we reach here, the API route wasn't found
    res.status(404).json({ 
      error: { 
        code: 'API_ENDPOINT_NOT_FOUND', 
        message: 'API endpoint not found' 
      } 
    });
  });
  
  // Direct emergency reset endpoint for mobile issues
  app.get('/mobile-reset', resetOnboarding);
  app.get('/emergency-reset', resetOnboarding);
  app.get('/m-reset', resetOnboarding);
  
  // Set up Vite for development or serve static files for production
  // API routes are already handled above
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
    
    // Shutdown the WebSocket manager
    wsManager.shutdown();
    
    httpServer.close(() => {
      console.log('Server shutdown complete');
      process.exit(0);
    });
  });
  
  return httpServer;
}