import { Request, Response } from 'express';
import { BlockchainType, VaultStatus } from '../../client/src/lib/cross-chain/types';

/**
 * Register explorer routes
 * @param app Express app
 */
export const registerExplorerRoutes = (app: any) => {
  // Search vaults by various criteria
  app.get("/api/vaults/search", async (req: Request, res: Response) => {
    try {
      const { vaultId, blockchain, address, txHash } = req.query;
      
      // Mock data for demonstration
      const vaults = mockVaults.filter(vault => {
        if (vaultId && vault.id !== vaultId) return false;
        if (blockchain && vault.blockchain !== blockchain) return false;
        if (address && vault.owner !== address) return false;
        if (txHash && vault.txHash !== txHash) return false;
        return true;
      });
      
      res.status(200).json({ 
        success: true, 
        vaults,
        count: vaults.length
      });
    } catch (error) {
      console.error('[Explorer] Error searching vaults:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search vaults' 
      });
    }
  });

  // Get vaults by blockchain
  app.get("/api/vaults/blockchain/:blockchain", async (req: Request, res: Response) => {
    try {
      const { blockchain } = req.params;
      
      if (!blockchain || !["ETH", "SOL", "TON"].includes(blockchain as string)) {
        return res.status(400).json({
          success: false,
          error: "Invalid blockchain parameter"
        });
      }
      
      const vaults = mockVaults.filter(vault => 
        vault.blockchain === blockchain
      );
      
      res.status(200).json({ 
        success: true, 
        vaults,
        count: vaults.length,
        blockchain
      });
    } catch (error) {
      console.error('[Explorer] Error fetching vaults by blockchain:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch vaults by blockchain' 
      });
    }
  });

  // Get recent vaults
  app.get("/api/vaults/recent", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Sort by creation date (newest first) and limit
      const recentVaults = [...mockVaults]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
      
      res.status(200).json({ 
        success: true, 
        vaults: recentVaults,
        count: recentVaults.length
      });
    } catch (error) {
      console.error('[Explorer] Error fetching recent vaults:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch recent vaults' 
      });
    }
  });

  // Get vault by ID
  app.get("/api/vaults/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const vault = mockVaults.find(v => v.id === id);
      
      if (!vault) {
        return res.status(404).json({
          success: false,
          error: "Vault not found"
        });
      }
      
      res.status(200).json({ 
        success: true, 
        vault
      });
    } catch (error) {
      console.error('[Explorer] Error fetching vault details:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch vault details' 
      });
    }
  });

  // Get explorer stats
  app.get("/api/explorer/stats", async (req: Request, res: Response) => {
    try {
      // Calculate statistics from mock vaults
      const totalVaults = mockVaults.length;
      
      // Count vaults by blockchain
      const byChain = {
        ETH: mockVaults.filter(v => v.blockchain === "ETH").length,
        SOL: mockVaults.filter(v => v.blockchain === "SOL").length,
        TON: mockVaults.filter(v => v.blockchain === "TON").length
      };
      
      // Count vaults by status
      const byStatus = {
        active: mockVaults.filter(v => v.status === "active").length,
        locked: mockVaults.filter(v => v.status === "locked").length,
        unlocked: mockVaults.filter(v => v.status === "unlocked").length,
        pending: mockVaults.filter(v => v.status === "pending").length
      };
      
      // Calculate total value by blockchain
      const totalValue = {
        ETH: "127.45 ETH",
        SOL: "3,891.27 SOL",
        TON: "15,420.89 TON"
      };
      
      res.status(200).json({ 
        success: true, 
        stats: {
          totalVaults,
          byChain,
          byStatus,
          totalValue
        }
      });
    } catch (error) {
      console.error('[Explorer] Error fetching explorer stats:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch explorer stats' 
      });
    }
  });
};

// Mock vaults data
const mockVaults = [
  {
    id: "eth-v-001",
    name: "Diamond Hands ETH Vault",
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    blockchain: "ETH" as BlockchainType,
    status: "locked" as VaultStatus,
    unlockDate: new Date("2025-12-31"),
    value: "32.5 ETH",
    txHash: "0x8a634a10d92ed82b7a68d731760f91f88ca56117ed7dd73b81c08128920305a3",
    securityLevel: "maximum" as const,
    createdAt: new Date("2023-09-15")
  },
  {
    id: "eth-v-002",
    name: "College Fund",
    owner: "0x8C08A3C152D5A404Fb3FFa1e3c7d267d48a0A14A",
    blockchain: "ETH" as BlockchainType,
    status: "active" as VaultStatus,
    unlockDate: new Date("2027-05-01"),
    value: "18.7 ETH",
    txHash: "0x9c302a10d82ed82b7a68d731760f91f88ca56117ed7dd73b81c08128920305b4",
    securityLevel: "enhanced" as const,
    createdAt: new Date("2023-10-22")
  },
  {
    id: "sol-v-001",
    name: "Lambo Fund",
    owner: "9XyQMkZtZkN9YWsfbUXJ5K4zj4tUcyfZhkEkLkQZ8rQH",
    blockchain: "SOL" as BlockchainType,
    status: "locked" as VaultStatus,
    unlockDate: new Date("2026-03-21"),
    value: "1240 SOL",
    txHash: "4jWxnyp1CkTfx41gHs4cg6V8gxHZZSwXrUQnxiVcC6B2tD1VnwG5ZYUCsUE1BVEAoTxJ9FL7b32ZqZBZhpLfMQ94",
    securityLevel: "maximum" as const,
    createdAt: new Date("2023-11-05")
  },
  {
    id: "ton-v-001",
    name: "Retirement Fund",
    owner: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    blockchain: "TON" as BlockchainType,
    status: "active" as VaultStatus,
    unlockDate: new Date("2040-01-01"),
    value: "5000 TON",
    txHash: "7f9a51fb4ff5ece04af0be7f7320bed5e7e3c3a8f3532e71f547aa42c8e91887",
    securityLevel: "maximum" as const,
    createdAt: new Date("2023-12-01")
  },
  {
    id: "sol-v-002",
    name: "NFT Purchase Vault",
    owner: "5RAogvug3R9FTpb6x5UjrwRTyNRZeNZo3Py7Lamp9Sxk",
    blockchain: "SOL" as BlockchainType,
    status: "unlocked" as VaultStatus,
    unlockDate: new Date("2024-02-20"),
    value: "450 SOL",
    txHash: "5rx1a9wziK8PsP4EfKnWzHrZbKcSDJa83c3QJK6HUbfn2o34LXqZPyvj8WLXHzF6Q35JX3H6oKejJfGG9S6bzqj8",
    securityLevel: "standard" as const,
    createdAt: new Date("2023-08-15")
  },
  {
    id: "ton-v-002",
    name: "Project Fund",
    owner: "UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2M",
    blockchain: "TON" as BlockchainType,
    status: "pending" as VaultStatus,
    unlockDate: null,
    value: "2500 TON",
    txHash: "d7a10a6bdd0b7eed9a8d74cb33879c56852dde7f5b8004de839f81bf52d7597e",
    securityLevel: "enhanced" as const,
    createdAt: new Date("2024-01-15")
  },
  {
    id: "eth-v-003",
    name: "Wedding Gift",
    owner: "0x3dA31077C5f9Dd8bD0AFD0a0d89b471c6DF5C083",
    blockchain: "ETH" as BlockchainType,
    status: "locked" as VaultStatus,
    unlockDate: new Date("2025-06-15"),
    value: "3.2 ETH",
    txHash: "0x6a0f9c39e4b5a5e8c1c9b2a3d4e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
    securityLevel: "enhanced" as const,
    createdAt: new Date("2024-02-10")
  },
  {
    id: "sol-v-003",
    name: "Gaming Assets",
    owner: "DgEUw2PqMA4KTg4yYJH3iLXu8CnTZANPk1CjWWJKN2C4",
    blockchain: "SOL" as BlockchainType,
    status: "active" as VaultStatus,
    unlockDate: new Date("2024-12-25"),
    value: "125 SOL",
    txHash: "8wGW7LjL9vP6J5PhH6L4ycPFyymDiMxbwGQTJcHPZeiYRBjwRRJNR1CZLycUv9t4wNCuVXkw1yxXM5WMrw5NmD3",
    securityLevel: "standard" as const,
    createdAt: new Date("2024-01-20")
  },
  {
    id: "ton-v-003",
    name: "Business Expansion",
    owner: "EQBD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2K",
    blockchain: "TON" as BlockchainType,
    status: "locked" as VaultStatus,
    unlockDate: new Date("2026-08-01"),
    value: "7920 TON",
    txHash: "9f1a42fb5ff5ece04af0be7f7320bed5e7e3c3a8f3532e71f547aa42c8e91434",
    securityLevel: "maximum" as const,
    createdAt: new Date("2024-02-01")
  },
  {
    id: "eth-v-004",
    name: "Inheritance Vault",
    owner: "0x9872d6EBE8dFfA1C2B5C1F830C7dA97BA852D0FE",
    blockchain: "ETH" as BlockchainType,
    status: "active" as VaultStatus,
    unlockDate: new Date("2050-01-01"),
    value: "73.05 ETH",
    txHash: "0xb4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3",
    securityLevel: "maximum" as const,
    createdAt: new Date("2023-07-04")
  }
];