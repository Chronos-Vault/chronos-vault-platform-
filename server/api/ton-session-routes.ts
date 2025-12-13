import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

// In-memory session storage for TON Connect data
// In production, this should use Redis or database
const tonSessions = new Map<string, { data: Record<string, string>; createdAt: number; userAgent: string }>();

// Session expiry time: 5 minutes
const SESSION_EXPIRY_MS = 5 * 60 * 1000;

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of tonSessions.entries()) {
    if (now - session.createdAt > SESSION_EXPIRY_MS) {
      tonSessions.delete(sessionId);
    }
  }
}, 60 * 1000); // Check every minute

// Create a new session
router.post('/create', (req: Request, res: Response) => {
  try {
    const sessionId = randomUUID();
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    tonSessions.set(sessionId, {
      data: {},
      createdAt: Date.now(),
      userAgent
    });
    
    console.log('[TON Session] Created session:', sessionId);
    res.json({ success: true, sessionId });
  } catch (error) {
    console.error('[TON Session] Error creating session:', error);
    res.status(500).json({ success: false, error: 'Failed to create session' });
  }
});

// Set item in session storage
router.post('/:sessionId/set', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, error: 'Missing key or value' });
    }
    
    const session = tonSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    // Check session expiry
    if (Date.now() - session.createdAt > SESSION_EXPIRY_MS) {
      tonSessions.delete(sessionId);
      return res.status(410).json({ success: false, error: 'Session expired' });
    }
    
    session.data[key] = value;
    console.log('[TON Session] Set item:', sessionId, key);
    res.json({ success: true });
  } catch (error) {
    console.error('[TON Session] Error setting item:', error);
    res.status(500).json({ success: false, error: 'Failed to set item' });
  }
});

// Get item from session storage
router.get('/:sessionId/get/:key', (req: Request, res: Response) => {
  try {
    const { sessionId, key } = req.params;
    
    const session = tonSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found', value: null });
    }
    
    // Check session expiry
    if (Date.now() - session.createdAt > SESSION_EXPIRY_MS) {
      tonSessions.delete(sessionId);
      return res.status(410).json({ success: false, error: 'Session expired', value: null });
    }
    
    const value = session.data[key] || null;
    res.json({ success: true, value });
  } catch (error) {
    console.error('[TON Session] Error getting item:', error);
    res.status(500).json({ success: false, error: 'Failed to get item', value: null });
  }
});

// Get all items from session storage
router.get('/:sessionId/all', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = tonSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found', data: {} });
    }
    
    // Check session expiry
    if (Date.now() - session.createdAt > SESSION_EXPIRY_MS) {
      tonSessions.delete(sessionId);
      return res.status(410).json({ success: false, error: 'Session expired', data: {} });
    }
    
    res.json({ success: true, data: session.data });
  } catch (error) {
    console.error('[TON Session] Error getting all items:', error);
    res.status(500).json({ success: false, error: 'Failed to get items', data: {} });
  }
});

// Remove item from session storage
router.delete('/:sessionId/remove/:key', (req: Request, res: Response) => {
  try {
    const { sessionId, key } = req.params;
    
    const session = tonSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    delete session.data[key];
    console.log('[TON Session] Removed item:', sessionId, key);
    res.json({ success: true });
  } catch (error) {
    console.error('[TON Session] Error removing item:', error);
    res.status(500).json({ success: false, error: 'Failed to remove item' });
  }
});

// Delete session
router.delete('/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    tonSessions.delete(sessionId);
    console.log('[TON Session] Deleted session:', sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error('[TON Session] Error deleting session:', error);
    res.status(500).json({ success: false, error: 'Failed to delete session' });
  }
});

export default router;
