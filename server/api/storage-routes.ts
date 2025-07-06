/**
 * Storage API Routes for Chronos Vault
 * 
 * These routes handle file storage operations using Arweave/Bundlr
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { arweaveStorageService } from '../storage/arweave-storage-service';
import { STORAGE_CONFIG } from '../../shared/config/storage';
import { StorageError } from '../../shared/types/storage';

// Create router
const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: STORAGE_CONFIG.FILE_SIZE_LIMITS.MAXIMUM // Set to maximum allowed size
  }
});

// Error handler helper
const handleError = (res: Response, error: any) => {
  console.error('Storage API error:', error);
  
  if (error.code && error.message) {
    // It's a StorageError
    return res.status(400).json({
      error: error.code,
      message: error.message,
      details: error.details,
      recoverable: error.recoverable,
      suggestedAction: error.suggestedAction
    });
  }
  
  return res.status(500).json({
    error: 'STORAGE_ERROR',
    message: error.message || 'An unknown error occurred'
  });
};

/**
 * @route GET /api/storage/status
 * @description Get the status of the storage service
 * @access Public
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await arweaveStorageService.getStatus();
    res.json(status);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route POST /api/storage/upload
 * @description Upload a file to permanent storage
 * @access Private
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    // Check authentication
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'You must be logged in to upload files' });
    }
    
    // Get the uploaded file
    if (!req.file) {
      return res.status(400).json({ error: 'NO_FILE', message: 'No file was uploaded' });
    }
    
    // Get parameters
    const userId = req.user.id;
    const vaultId = parseInt(req.body.vaultId, 10);
    const { fileName, fileType } = req.body;
    
    // Optional parameters
    const encrypt = req.body.encrypt === 'true';
    const securityLevel = req.body.securityLevel || 'standard';
    const crossChainVerify = req.body.crossChainVerify === 'true';
    
    // Custom tags
    const tags: Record<string, string> = {};
    if (req.body.tags) {
      try {
        const parsedTags = JSON.parse(req.body.tags);
        Object.assign(tags, parsedTags);
      } catch (e) {
        console.warn('Invalid tags format:', e);
      }
    }
    
    // Upload the file
    const result = await arweaveStorageService.uploadFile(
      req.file.buffer,
      fileName || req.file.originalname,
      fileType || req.file.mimetype,
      userId,
      vaultId,
      {
        encrypt,
        securityLevel: securityLevel as 'standard' | 'enhanced' | 'maximum',
        crossChainVerify,
        tags
      }
    );
    
    res.status(201).json(result);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route GET /api/storage/file/:transactionId
 * @description Get a file by its transaction ID
 * @access Private
 */
router.get('/file/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    
    // Get file metadata (this would usually come from the database)
    // For now, we'll just fetch the file directly
    const fileData = await arweaveStorageService.getFile(transactionId);
    
    // Set content type header (ideally this would come from the database)
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', 'attachment');
    
    res.send(fileData);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route GET /api/storage/verify/:transactionId
 * @description Verify a file exists on Arweave
 * @access Private
 */
router.get('/verify/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const exists = await arweaveStorageService.verifyFile(transactionId);
    
    res.json({ verified: exists });
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route GET /api/storage/transaction/:transactionId
 * @description Get transaction information
 * @access Private
 */
router.get('/transaction/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const info = await arweaveStorageService.getTransactionInfo(transactionId);
    
    res.json(info);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route POST /api/storage/cost
 * @description Calculate the cost to upload a file
 * @access Public
 */
router.post('/cost', async (req: Request, res: Response) => {
  try {
    const { sizeInBytes } = req.body;
    
    if (!sizeInBytes || isNaN(parseInt(sizeInBytes, 10))) {
      return res.status(400).json({ error: 'INVALID_SIZE', message: 'Invalid file size' });
    }
    
    const cost = await arweaveStorageService.calculateUploadCost(parseInt(sizeInBytes, 10));
    
    res.json({ cost });
  } catch (error) {
    handleError(res, error);
  }
});

// Export the router
export default router;
