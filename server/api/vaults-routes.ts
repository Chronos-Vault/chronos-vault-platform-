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

// Vault types enum
export enum VaultType {
  STANDARD = 'standard',
  TIME_LOCK = 'time-lock',
  MEMORY = 'memory',
  QUANTUM_PROGRESSIVE = 'quantum-progressive',
  MULTI_SIG = 'multi-signature',
  INHERITANCE = 'inheritance',
  BITCOIN_HALVING = 'bitcoin-halving',
  GEOLOCATION = 'geolocation'
}

// Vault creation schema
const createVaultSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum([
    VaultType.STANDARD,
    VaultType.TIME_LOCK,
    VaultType.MEMORY,
    VaultType.QUANTUM_PROGRESSIVE,
    VaultType.MULTI_SIG,
    VaultType.INHERITANCE,
    VaultType.BITCOIN_HALVING,
    VaultType.GEOLOCATION
  ]),
  value: z.number(),
  metadata: z.record(z.any()).optional(),
  securityLevel: z.number().optional(), // For quantum vaults
  unlockDate: z.string().optional(), // For time-locked vaults
  beneficiaries: z.array(z.string()).optional(), // For inheritance vaults
  requiredSignatures: z.number().optional() // For multi-sig vaults
});

/**
 * Get all vaults
 * GET /api/vaults
 */
router.get('/', (req: Request, res: Response) => {
  // Filter vaults if type query parameter is provided
  const { type } = req.query;
  
  if (type) {
    const filteredVaults = vaults.filter(vault => vault.type === type);
    return res.json({ success: true, vaults: filteredVaults });
  }
  
  res.json({ success: true, vaults });
});

/**
 * Get all quantum-progressive vaults
 * GET /api/vaults/quantum-progressive
 */
router.get('/quantum-progressive', (req: Request, res: Response) => {
  const quantumVaults = vaults.filter(vault => vault.type === VaultType.QUANTUM_PROGRESSIVE);
  res.json({ success: true, vaults: quantumVaults });
});

/**
 * Manually upgrade security level for a quantum-progressive vault
 * POST /api/vaults/:id/upgrade-security
 */
router.post('/:id/upgrade-security', async (req: Request, res: Response) => {
  try {
    const vaultIndex = vaults.findIndex(v => v.id === req.params.id);
    
    if (vaultIndex === -1) {
      return res.status(404).json({ success: false, error: 'Vault not found' });
    }
    
    const vault = vaults[vaultIndex];
    
    if (vault.type !== VaultType.QUANTUM_PROGRESSIVE) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vault is not a quantum-progressive type' 
      });
    }
    
    const { targetLevel } = req.body;
    
    if (!targetLevel || typeof targetLevel !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid target security level' 
      });
    }
    
    // Call the security service to upgrade
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/security/progressive-quantum/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vaultId: req.params.id,
        targetLevel: targetLevel
      })
    });
    
    const upgradeData = await response.json();
    
    if (upgradeData.success) {
      // Update the vault with new security information
      vaults[vaultIndex] = {
        ...vaults[vaultIndex],
        securityInfo: upgradeData.securityInfo,
        securityLevel: upgradeData.newSecurityLevel
      };
      
      res.status(200).json({
        success: true,
        message: `Security level upgraded to ${upgradeData.newSecurityLevel}`,
        vault: vaults[vaultIndex]
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: upgradeData.error || 'Failed to upgrade security level' 
      });
    }
  } catch (error) {
    console.error('Error upgrading vault security:', error);
    res.status(500).json({ success: false, error: 'Failed to upgrade vault security' });
  }
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
    
    // Handle special vault types
    if (validatedData.type === VaultType.QUANTUM_PROGRESSIVE) {
      // Initialize quantum security for the vault
      try {
        // In a production environment, this would make a direct call to the quantum security service
        // For now, we'll make a fetch request to our own API endpoint
        const securityLevel = validatedData.securityLevel || 1; // Default to level 1 if not specified
        
        // Initialize quantum security via API call
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/security/progressive-quantum/initialize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vaultId: validatedData.id,
            value: validatedData.value,
            securityLevel: securityLevel
          })
        });
        
        const securityData = await response.json();
        
        if (securityData.success) {
          console.log(`Quantum security initialized for vault ${validatedData.id} at level ${securityData.securityLevel}`);
          
          // Update the vault with security information
          const vaultIndex = vaults.findIndex(v => v.id === validatedData.id);
          if (vaultIndex !== -1) {
            vaults[vaultIndex] = {
              ...vaults[vaultIndex],
              securityInfo: securityData.securityInfo
            };
            vault = vaults[vaultIndex]; // Update the response object
          }
        } else {
          console.error(`Failed to initialize quantum security: ${securityData.error}`);
        }
      } catch (error) {
        console.error('Error initializing quantum security:', error);
        // Continue with vault creation despite security initialization error
      }
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
    
    // Handle quantum-progressive vault value updates
    if (
      currentVault.type === VaultType.QUANTUM_PROGRESSIVE &&
      req.body.value !== undefined &&
      req.body.value !== currentVault.value
    ) {
      try {
        // Call the security service to update based on new value
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/security/progressive-quantum/update-value`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vaultId: req.params.id,
            value: req.body.value
          })
        });
        
        const securityUpdateData = await response.json();
        
        if (securityUpdateData.success) {
          console.log(`Quantum security updated for vault ${req.params.id} to level ${securityUpdateData.newSecurityLevel}`);
          
          // Update the vault with new security information
          vaults[vaultIndex] = {
            ...vaults[vaultIndex],
            securityInfo: securityUpdateData.securityInfo,
            securityLevel: securityUpdateData.newSecurityLevel
          };
          
          // Update the response object
          updatedVault = vaults[vaultIndex];
        } else {
          console.error(`Failed to update quantum security: ${securityUpdateData.error}`);
        }
      } catch (error) {
        console.error('Error updating quantum security:', error);
        // Continue with vault update despite security update error
      }
    }
    
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