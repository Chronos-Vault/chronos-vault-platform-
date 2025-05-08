/**
 * Vaults API Routes
 * 
 * Endpoints for creating and managing vaults of various types
 */
import { Request, Response, Router } from 'express';
import { z } from 'zod';

const router = Router();

// In-memory storage for vaults during development
let vaults: any[] = [];

// Vault creation schema
const createVaultSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  value: z.number(),
  metadata: z.record(z.any()).optional()
});

/**
 * Get all vaults
 * GET /api/vaults
 */
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, vaults });
});

/**
 * Create new vault
 * POST /api/vaults
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createVaultSchema.parse(req.body);
    
    // Check if vault ID already exists
    const existingVault = vaults.find(v => v.id === validatedData.id);
    if (existingVault) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vault ID already exists' 
      });
    }
    
    // Add creation timestamp
    const vault = {
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    vaults.push(vault);
    
    // If this is a quantum-resistant vault, initialize it with the progressive-quantum service
    if (validatedData.type === 'quantum-progressive') {
      // Note: In a production environment, this would be a call to your quantum security service
      console.log(`Initializing quantum security for vault ${validatedData.id}`);
    }
    
    res.status(201).json({ success: true, vault });
  } catch (error) {
    console.error('Error creating vault:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid vault data', 
        details: error.errors 
      });
    }
    res.status(500).json({ success: false, error: 'Failed to create vault' });
  }
});

/**
 * Get vault by ID
 * GET /api/vaults/:id
 */
router.get('/:id', (req: Request, res: Response) => {
  const vault = vaults.find(v => v.id === req.params.id);
  
  if (!vault) {
    return res.status(404).json({ success: false, error: 'Vault not found' });
  }
  
  res.json({ success: true, vault });
});

/**
 * Update vault
 * PATCH /api/vaults/:id
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const vaultIndex = vaults.findIndex(v => v.id === req.params.id);
    
    if (vaultIndex === -1) {
      return res.status(404).json({ success: false, error: 'Vault not found' });
    }
    
    const currentVault = vaults[vaultIndex];
    const updatedVault = {
      ...currentVault,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    vaults[vaultIndex] = updatedVault;
    
    res.json({ success: true, vault: updatedVault });
  } catch (error) {
    console.error('Error updating vault:', error);
    res.status(500).json({ success: false, error: 'Failed to update vault' });
  }
});

/**
 * Delete vault
 * DELETE /api/vaults/:id
 */
router.delete('/:id', (req: Request, res: Response) => {
  const vaultIndex = vaults.findIndex(v => v.id === req.params.id);
  
  if (vaultIndex === -1) {
    return res.status(404).json({ success: false, error: 'Vault not found' });
  }
  
  vaults.splice(vaultIndex, 1);
  
  res.json({ success: true, message: 'Vault deleted successfully' });
});

export default router;