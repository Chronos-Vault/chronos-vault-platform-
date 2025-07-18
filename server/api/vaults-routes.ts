/**
 * Vaults API Routes
 * 
 * Endpoints for creating and managing vaults of various types
 */
import { Request, Response, Router } from 'express';
import { z } from 'zod';

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

const router = Router();

// In-memory storage for vaults during development
let vaults: any[] = [
  // Sample quantum vaults for testing
  {
    id: "quantum-vault-1",
    name: "High-Value Quantum Vault",
    description: "Quantum-resistant vault with progressive security for high-value assets",
    type: VaultType.QUANTUM_PROGRESSIVE,
    value: 125000,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    securityLevel: "advanced",
    securityInfo: {
      vaultId: "quantum-vault-1",
      securityStrength: 90,
      currentTier: "advanced",
      lastUpgrade: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      hasZeroKnowledgeProofs: true,
      requiredSignatures: 2,
      signatures: {
        algorithm: "CRYSTALS-Dilithium",
        strength: "High"
      },
      encryption: {
        algorithm: "Kyber-1024",
        latticeParameters: {
          dimension: 1024,
          errorDistribution: "Gaussian",
          ringType: "Ring-LWE"
        }
      }
    }
  },
  {
    id: "quantum-vault-2",
    name: "Medium Security Quantum Vault",
    description: "Medium-value assets with enhanced quantum protection",
    type: VaultType.QUANTUM_PROGRESSIVE,
    value: 25000,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    securityLevel: "enhanced",
    securityInfo: {
      vaultId: "quantum-vault-2",
      securityStrength: 80,
      currentTier: "enhanced",
      lastUpgrade: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      hasZeroKnowledgeProofs: false,
      requiredSignatures: 2,
      signatures: {
        algorithm: "Falcon-1024",
        strength: "Medium"
      },
      encryption: {
        algorithm: "Kyber-768",
        latticeParameters: {
          dimension: 768,
          errorDistribution: "Gaussian",
          ringType: "Ring-LWE"
        }
      }
    }
  }
];

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
    let vault = {
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
            vaultValue: validatedData.value,
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
    // Check for standard vaults
    const standardVaults = [
      {
        id: "1",
        name: "Savings Vault",
        description: "Long-term savings for future planning with advanced security measures applied. This vault uses triple-chain validation.",
        blockchain: "ton", // Use string instead of enum for serialization
        unlockTime: Date.now() + 180 * 24 * 60 * 60 * 1000,
        amount: "15.75",
        recipient: "EQAbc123...",
        isLocked: true,
        securityLevel: "enhanced",
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        contractAddress: "EQD5xS7dQNM5mZu5hn_qDsHjUeJRVGbQYSCsB6MsJMP2zKqL",
        txHash: "97c17cd1afd8a5663c04fc93192b351dab6a88afd7c7ac847e9e457fc5fd034c"
      },
      {
        id: "2",
        name: "Education Fund",
        description: "College savings for my children that will unlock in 3 years. This vault is protected by enhanced security measures.",
        blockchain: "ton",
        unlockTime: Date.now() + 365 * 3 * 24 * 60 * 60 * 1000,
        amount: "50.0",
        recipient: "EQAbc123...",
        isLocked: true,
        securityLevel: "maximum",
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        contractAddress: "EQCT239WSjM_w4pcwSZmp9VvZ-fDnLNMnYpKwZIYhQHVBvuR",
        txHash: "ae8c5e37e9bf2c28e19f8f9adeabd1e01f3d7d49322bd9d5a6128e081622845c"
      },
      {
        id: "3",
        name: "Retirement Test",
        description: "Small test vault for retirement planning. This vault has already been unlocked and funds can be withdrawn.",
        blockchain: "ethereum",
        unlockTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
        amount: "0.05",
        recipient: "0x1234...",
        isLocked: false,
        securityLevel: "standard",
        createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
        contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        txHash: "0xe6c5378a4e1a0c7fd5219fa70a0903db8ed1d4a67be5f6d83fb2fb11a5214943"
      }
    ];
    
    const standardVault = standardVaults.find(v => v.id === req.params.id);
    
    if (!standardVault) {
      return res.status(404).json({ success: false, error: 'Vault not found' });
    }
    
    return res.json({ success: true, vault: standardVault });
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
    let updatedVault = {
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
            vaultValue: req.body.value
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