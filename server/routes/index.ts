import { Router } from 'express';
import deviceVerificationRoutes from './device-verification';

const router = Router();

// Root API health check
router.get('/health-check', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount device verification routes
router.use('/device-verification', deviceVerificationRoutes);

export default router;