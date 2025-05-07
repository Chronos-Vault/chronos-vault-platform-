import { Request, Response } from "express";
import { VaultInfo, ExplorerStats } from '@shared/schema';

/**
 * Register explorer routes
 * @param app Express app
 */
export const registerExplorerRoutes = (app: any) => {
  // Sample vault data for demo purposes - in production, this would come from the database
  const mockVaults: VaultInfo[] = [
    {
      id: "vault-001",
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
      id: "vault-002",
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
      id: "vault-003",
      name: "TON Family Trust",
      owner: "UQA1234...5678",
      blockchain: "TON",
      status: "pending",
      unlockDate: null,
      value: "1000 TON",
      txHash: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
      securityLevel: "standard",
      createdAt: new Date("2023-11-10")
    }
  ];

  // Search vaults
  app.get("/api/vaults/search", async (req: Request, res: Response) => {
    const query = req.query.q?.toString().toLowerCase() || "";
    
    if (!query) {
      return res.json({ success: true, vaults: [] });
    }
    
    const results = mockVaults.filter((vault) => {
      return vault.id.toLowerCase().includes(query) ||
        vault.name.toLowerCase().includes(query) ||
        vault.owner.toLowerCase().includes(query) ||
        vault.txHash.toLowerCase().includes(query);
    });
    
    res.json({
      success: true,
      vaults: results
    });
  });

  // Get vaults by blockchain
  app.get("/api/vaults/blockchain/:blockchain", async (req: Request, res: Response) => {
    const blockchain = req.params.blockchain;
    
    const filteredVaults = mockVaults.filter(
      vault => vault.blockchain.toUpperCase() === blockchain.toUpperCase()
    );
    
    res.json({
      success: true,
      vaults: filteredVaults
    });
  });

  // Get recent vaults
  app.get("/api/vaults/recent", async (req: Request, res: Response) => {
    const sortedVaults = [...mockVaults].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const recent = sortedVaults.slice(0, limit);
    
    res.json({
      success: true,
      vaults: recent
    });
  });

  // Get vault by ID
  app.get("/api/vaults/:id", async (req: Request, res: Response) => {
    const vaultId = req.params.id;
    const vault = mockVaults.find(v => v.id === vaultId);
    
    if (!vault) {
      return res.status(404).json({
        success: false,
        error: "Vault not found"
      });
    }
    
    res.json({
      success: true,
      vault
    });
  });

  // Get explorer stats
  app.get("/api/explorer/stats", async (req: Request, res: Response) => {
    // Calculate stats from mock data
    const ethVaults = mockVaults.filter(v => v.blockchain === "ETH");
    const solVaults = mockVaults.filter(v => v.blockchain === "SOL");
    const tonVaults = mockVaults.filter(v => v.blockchain === "TON");
    
    const activeVaults = mockVaults.filter(v => v.status === "active");
    const lockedVaults = mockVaults.filter(v => v.status === "locked");
    const unlockedVaults = mockVaults.filter(v => v.status === "unlocked");
    const pendingVaults = mockVaults.filter(v => v.status === "pending");
    
    const stats: ExplorerStats = {
      totalVaults: mockVaults.length,
      byChain: {
        ETH: ethVaults.length,
        SOL: solVaults.length,
        TON: tonVaults.length
      },
      byStatus: {
        active: activeVaults.length,
        locked: lockedVaults.length,
        unlocked: unlockedVaults.length,
        pending: pendingVaults.length
      },
      totalValue: {
        ETH: "12.5 ETH",
        SOL: "250 SOL",
        TON: "1000 TON"
      }
    };
    
    res.json({
      success: true,
      stats
    });
  });
};