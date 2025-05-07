/**
 * API Routes Registration
 */

import { Express, Request, Response } from 'express';
import { createServer, Server } from 'http';
import { performanceRoutes } from './api/performance-routes';
import securityLoggerRoutes from './api/security-logger-routes';
import healthRoutes from './api/health-routes';
import incidentRoutes from './api/incident-routes';
import { systemHealthMonitor } from './monitoring/system-health-monitor';
import { incidentResponseSystem } from './monitoring/incident-response';

export async function registerRoutes(app: Express): Promise<Server> {
  // Register performance optimization routes
  app.use('/api/performance', performanceRoutes);
  
  // Register security logger routes
  app.use('/api/security', securityLoggerRoutes);
  
  // Register system health monitoring routes
  app.use('/api/health', healthRoutes);
  
  // Register incident response routes
  app.use('/api/incidents', incidentRoutes);
  
  // Simple health check route - lightweight version for quick status checks
  app.get('/api/health-check', (_req: Request, res: Response) => {
    const health = systemHealthMonitor.getSystemHealth();
    res.json({
      status: health.status,
      timestamp: Date.now(),
      version: '1.0.0'
    });
  });
  
  // Create HTTP server instance
  const httpServer = createServer(app);
  
  // Set up Vite for development or serve static files for production
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