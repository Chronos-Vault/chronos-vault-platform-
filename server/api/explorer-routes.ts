/**
 * Vault Explorer API Routes
 */
import { Request, Response, Router } from 'express';
import { VaultInfo, ExplorerStats, BlockchainType, VaultStatus, SecurityLevel } from '@shared/schema';

// Create router
const router = Router();

// Sample vault data for demo purposes
const mockVaults: VaultInfo[] = [
  // Ethereum vaults
  {
    id: "vault-eth-001",
    name: "ETH Retirement Fund",
    owner: "0x1234...5678",
    blockchain: "ETH",
    status: "locked",
    unlockDate: new Date("2025-06-01"),
    value: "12.5 ETH",
    txHash: "0xabcd1234efgh5678ijkl9012mnop3456qrst7890uvwx",
    securityLevel: "maximum",
    createdAt: new Date("2023-05-15")
  },
  {
    id: "vault-eth-002",
    name: "College Fund",
    owner: "0x5678...9012",
    blockchain: "ETH",
    status: "active",
    unlockDate: new Date("2026-08-15"),
    value: "8.3 ETH",
    txHash: "0x1234abcdef5678ghijkl9012mnopq3456rstuv7890wxyz",
    securityLevel: "enhanced",
    createdAt: new Date("2023-07-22")
  },
  {
    id: "vault-eth-003",
    name: "Wedding Gift",
    owner: "0x9012...3456",
    blockchain: "ETH",
    status: "unlocked",
    unlockDate: new Date("2023-12-31"),
    value: "3.2 ETH",
    txHash: "0xabcd5678efgh1234ijkl5678mnop1234qrst5678uvwx",
    securityLevel: "standard",
    createdAt: new Date("2023-01-10")
  },
  
  // Solana vaults
  {
    id: "vault-sol-001",
    name: "SOL Emergency Fund",
    owner: "Sol12345...6789",
    blockchain: "SOL",
    status: "active",
    unlockDate: new Date("2024-12-31"),
    value: "250 SOL",
    txHash: "5ZWj9EULVtx1qfvdVRjZp2Xez6nUzNrKCzZTu7HDwvqHMUX7",
    securityLevel: "enhanced",
    createdAt: new Date("2023-08-20")
  },
  {
    id: "vault-sol-002",
    name: "Art Investment",
    owner: "Sol98765...4321",
    blockchain: "SOL",
    status: "pending",
    unlockDate: new Date("2024-11-15"),
    value: "180 SOL",
    txHash: "7YU9iWmPqRsSt3x8vBhF5pLGdKnZoJrMTzYvU6CDvwqPLMY2",
    securityLevel: "maximum",
    createdAt: new Date("2023-09-01")
  },
  {
    id: "vault-sol-003",
    name: "NFT Reserve",
    owner: "Sol54321...9876",
    blockchain: "SOL",
    status: "locked",
    unlockDate: new Date("2025-03-15"),
    value: "500 SOL",
    txHash: "9XZw8TByPnVq7KrMuE5dHsLcA2fJoBpRvS4tG6HDzwqFNMY3",
    securityLevel: "enhanced",
    createdAt: new Date("2023-10-05")
  },
  
  // TON vaults
  {
    id: "vault-ton-001",
    name: "TON Family Trust",
    owner: "UQA1234...5678",
    blockchain: "TON",
    status: "pending",
    unlockDate: new Date("2024-05-10"),
    value: "1000 TON",
    txHash: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    securityLevel: "standard",
    createdAt: new Date("2023-11-10")
  },
  {
    id: "vault-ton-002",
    name: "Business Reserve",
    owner: "UQB5678...9012",
    blockchain: "TON",
    status: "active",
    unlockDate: new Date("2025-09-22"),
    value: "2500 TON",
    txHash: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    securityLevel: "maximum",
    createdAt: new Date("2023-12-01")
  },
  {
    id: "vault-ton-003",
    name: "Child Education Fund",
    owner: "UQC9012...3456",
    blockchain: "TON",
    status: "locked",
    unlockDate: new Date("2027-01-15"),
    value: "750 TON",
    txHash: "EQFD29VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    securityLevel: "enhanced",
    createdAt: new Date("2024-01-05")
  }
];

// Get explorer stats
router.get('/stats', (req: Request, res: Response) => {
  // Calculate stats from mock data
  const stats: ExplorerStats = {
    totalVaults: mockVaults.length,
    byChain: {
      ETH: mockVaults.filter(v => v.blockchain === 'ETH').length,
      SOL: mockVaults.filter(v => v.blockchain === 'SOL').length,
      TON: mockVaults.filter(v => v.blockchain === 'TON').length
    },
    byStatus: {
      active: mockVaults.filter(v => v.status === 'active').length,
      locked: mockVaults.filter(v => v.status === 'locked').length,
      unlocked: mockVaults.filter(v => v.status === 'unlocked').length,
      pending: mockVaults.filter(v => v.status === 'pending').length
    },
    totalValue: {
      ETH: `${mockVaults
        .filter(v => v.blockchain === 'ETH')
        .reduce((sum, v) => sum + parseFloat(v.value.split(' ')[0]), 0)} ETH`,
      SOL: `${mockVaults
        .filter(v => v.blockchain === 'SOL')
        .reduce((sum, v) => sum + parseFloat(v.value.split(' ')[0]), 0)} SOL`,
      TON: `${mockVaults
        .filter(v => v.blockchain === 'TON')
        .reduce((sum, v) => sum + parseFloat(v.value.split(' ')[0]), 0)} TON`
    }
  };
  
  res.json({
    success: true,
    stats
  });
});

// Get recent vaults (most recently created)
router.get('/recent', (req: Request, res: Response) => {
  const recentVaults = [...mockVaults]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  
  res.json({
    success: true,
    vaults: recentVaults
  });
});

// Get vaults by blockchain
router.get('/blockchain/:chain', (req: Request, res: Response) => {
  const chain = req.params.chain;
  
  if (!['ETH', 'SOL', 'TON', 'ALL'].includes(chain)) {
    return res.status(400).json({
      success: false,
      message: "Invalid blockchain specified. Must be one of ETH, SOL, TON, or ALL."
    });
  }
  
  let vaults = mockVaults;
  
  if (chain !== 'ALL') {
    vaults = mockVaults.filter(v => v.blockchain === chain);
  }
  
  res.json({
    success: true,
    vaults
  });
});

// Search for vaults by ID, address, or transaction hash
router.get('/search', (req: Request, res: Response) => {
  const query = req.query.q as string;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Search query is required"
    });
  }
  
  const queryLower = query.toLowerCase();
  
  const results = mockVaults.filter(v => 
    v.id.toLowerCase().includes(queryLower) ||
    v.owner.toLowerCase().includes(queryLower) ||
    v.txHash.toLowerCase().includes(queryLower)
  );
  
  res.json({
    success: true,
    vaults: results
  });
});

// Get a specific vault by ID
router.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const vault = mockVaults.find(v => v.id === id);
  
  if (!vault) {
    return res.status(404).json({
      success: false,
      message: "Vault not found"
    });
  }
  
  res.json({
    success: true,
    vault
  });
});

export { router as explorerRouter };