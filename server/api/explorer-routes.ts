import { Request, Response } from "express";
import { db } from "../db";
import { BlockchainType, VaultStatus } from "../../shared/types";
import { EthereumService } from "../blockchain/ethereum-service";
import { SolanaService } from "../blockchain/solana-service";
import { TonService } from "../blockchain/ton-service";

// Mock data for development purposes - would be replaced with actual database queries
const vaults = [
  {
    id: "vault-001",
    name: "ETH Timelock Reserve",
    owner: "0x1234...5678",
    blockchain: "ETH" as BlockchainType,
    status: "locked" as VaultStatus,
    unlockDate: new Date("2025-12-31"),
    value: "5.2 ETH",
    txHash: "0x9876543210abcdef",
    securityLevel: "maximum",
    createdAt: new Date("2023-10-15"),
  },
  {
    id: "vault-002",
    name: "SOL Emergency Fund",
    owner: "Sol12...34",
    blockchain: "SOL" as BlockchainType,
    status: "active" as VaultStatus,
    unlockDate: new Date("2026-06-15"),
    value: "120 SOL",
    txHash: "4xzT9...W2f",
    securityLevel: "enhanced",
    createdAt: new Date("2023-11-22"),
  },
  {
    id: "vault-003",
    name: "TON Family Savings",
    owner: "UQDr...zxy",
    blockchain: "TON" as BlockchainType,
    status: "unlocked" as VaultStatus,
    unlockDate: null,
    value: "450 TON",
    txHash: "tTx67...8mn",
    securityLevel: "standard",
    createdAt: new Date("2023-09-01"),
  },
];

export const registerExplorerRoutes = (app: any) => {
  // Search for vaults by various criteria
  app.get("/api/vaults/search", async (req: Request, res: Response) => {
    try {
      const { vaultId, blockchain, address, txHash } = req.query;
      
      // In a production environment, this would query the database and blockchain
      let results = [...vaults];
      
      if (vaultId) {
        results = results.filter(v => v.id.includes(vaultId as string));
      }
      
      if (blockchain) {
        results = results.filter(v => v.blockchain === blockchain);
      }
      
      if (address) {
        results = results.filter(v => v.owner.includes(address as string));
      }
      
      if (txHash) {
        results = results.filter(v => v.txHash && v.txHash.includes(txHash as string));
      }
      
      // Simulate delayed response to mimic blockchain API call
      setTimeout(() => {
        res.status(200).json(results);
      }, 500);
    } catch (error: any) {
      console.error("Error searching vaults:", error);
      res.status(500).json({ error: error.message || "Failed to search vaults" });
    }
  });

  // Get all vaults for a specific blockchain
  app.get("/api/vaults/blockchain/:blockchain", async (req: Request, res: Response) => {
    try {
      const { blockchain } = req.params;
      const results = vaults.filter(v => v.blockchain === blockchain);
      res.status(200).json(results);
    } catch (error: any) {
      console.error("Error fetching vaults by blockchain:", error);
      res.status(500).json({ error: error.message || "Failed to fetch vaults" });
    }
  });

  // Get recent vaults
  app.get("/api/vaults/recent", async (req: Request, res: Response) => {
    try {
      // Sort by creation date (newest first) and limit to 5
      const results = [...vaults].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5);
      
      res.status(200).json(results);
    } catch (error: any) {
      console.error("Error fetching recent vaults:", error);
      res.status(500).json({ error: error.message || "Failed to fetch recent vaults" });
    }
  });

  // Get vault details by ID
  app.get("/api/vaults/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const vault = vaults.find(v => v.id === id);
      
      if (!vault) {
        return res.status(404).json({ error: "Vault not found" });
      }
      
      res.status(200).json(vault);
    } catch (error: any) {
      console.error("Error fetching vault details:", error);
      res.status(500).json({ error: error.message || "Failed to fetch vault details" });
    }
  });

  // Get chain stats for explorer dashboard
  app.get("/api/explorer/stats", async (req: Request, res: Response) => {
    try {
      // This would come from real blockchain data in production
      const stats = {
        totalVaults: vaults.length,
        byChain: {
          ETH: vaults.filter(v => v.blockchain === "ETH").length,
          SOL: vaults.filter(v => v.blockchain === "SOL").length,
          TON: vaults.filter(v => v.blockchain === "TON").length,
        },
        byStatus: {
          active: vaults.filter(v => v.status === "active").length,
          locked: vaults.filter(v => v.status === "locked").length,
          unlocked: vaults.filter(v => v.status === "unlocked").length,
          pending: vaults.filter(v => v.status === "pending").length,
        },
        totalValue: {
          ETH: "5.2",
          SOL: "120",
          TON: "450",
        }
      };
      
      res.status(200).json(stats);
    } catch (error: any) {
      console.error("Error fetching explorer stats:", error);
      res.status(500).json({ error: error.message || "Failed to fetch explorer stats" });
    }
  });
};