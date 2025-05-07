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
import { systemHealthMonitor } from './monitoring/system-health-monitor';
import { incidentResponseSystem } from './monitoring/incident-response';

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