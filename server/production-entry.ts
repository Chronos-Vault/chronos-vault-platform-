/**
 * Minimal Production Entry Point
 * 
 * This file has ZERO heavy imports. The health check responds
 * before any blockchain/routes code is even parsed.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

const app = express();
const PORT = 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check - responds IMMEDIATELY
app.get('/_health', (_, res) => res.json({ status: 'ok' }));
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Serve static files
const distPath = path.resolve(process.cwd(), 'dist', 'public');
app.use(express.static(distPath));

// SPA fallback for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  
  // Load full app 5 seconds AFTER health check passes
  setTimeout(async () => {
    try {
      const { registerRoutes } = await import('./routes');
      await registerRoutes(app);
      console.log('Full application loaded');
    } catch (e) {
      console.error('Failed to load routes:', e);
    }
  }, 5000);
});
