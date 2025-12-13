import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '5000', 10);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/_health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

const httpServer = createServer(app);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${PORT}`);
  
  setTimeout(async () => {
    try {
      console.log('📦 Loading full application...');
      const { registerRoutes } = await import('./routes');
      await registerRoutes(app);
      
      if (!isProduction) {
        const { setupVite } = await import('./vite');
        await setupVite(app, httpServer);
      } else {
        const { serveStatic } = await import('./vite');
        serveStatic(app);
      }
      
      console.log('✅ Full application loaded');
    } catch (error) {
      console.error('❌ Failed to load full application:', error);
    }
  }, 100);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
