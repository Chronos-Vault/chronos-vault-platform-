import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertVaultSchema, 
  insertBeneficiarySchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Special route to serve TON Connect manifest with proper headers
  app.get("/tonconnect-manifest.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      url: "https://8e33114e-6bdb-4fc9-a798-e4b7d77b5366-00-23l8s2c5r5iyx.spock.replit.dev",
      name: "Chronos Vault",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/4021/4021708.png"
    });
  });
  
  const httpServer = createServer(app);

  // Helper function to handle errors
  const handleError = (res: Response, error: any) => {
    console.error(error);
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Invalid input data", 
        errors: error.errors 
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  // User routes
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      // Check if wallet address already exists
      if (userData.walletAddress) {
        const existingWallet = await storage.getUserByWalletAddress(userData.walletAddress);
        if (existingWallet) {
          return res.status(409).json({ message: "Wallet address already registered" });
        }
      }

      const user = await storage.createUser(userData);
      res.status(201).json({
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/users/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      res.status(200).json({
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/users/wallet/:address", async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const user = await storage.getUserByWalletAddress(address);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Vault routes
  app.post("/api/vaults", async (req: Request, res: Response) => {
    try {
      const vaultData = insertVaultSchema.parse(req.body);
      
      const user = await storage.getUser(vaultData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const vault = await storage.createVault(vaultData);
      res.status(201).json(vault);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/vaults/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const vaults = await storage.getVaultsByUser(userId);
      res.status(200).json(vaults);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/vaults/:id", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.id);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      // Get beneficiaries for this vault
      const beneficiaries = await storage.getBeneficiariesByVault(vaultId);

      res.status(200).json({ ...vault, beneficiaries });
    } catch (error) {
      handleError(res, error);
    }
  });

  app.put("/api/vaults/:id", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.id);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const existingVault = await storage.getVault(vaultId);
      if (!existingVault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const updatedVault = await storage.updateVault(vaultId, req.body);
      res.status(200).json(updatedVault);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/vaults/:id", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.id);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const success = await storage.deleteVault(vaultId);
      if (!success) {
        return res.status(404).json({ message: "Vault not found" });
      }

      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // Beneficiary routes
  app.post("/api/beneficiaries", async (req: Request, res: Response) => {
    try {
      const beneficiaryData = insertBeneficiarySchema.parse(req.body);
      
      const vault = await storage.getVault(beneficiaryData.vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const beneficiary = await storage.createBeneficiary(beneficiaryData);
      res.status(201).json(beneficiary);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/beneficiaries/vault/:vaultId", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const beneficiaries = await storage.getBeneficiariesByVault(vaultId);
      res.status(200).json(beneficiaries);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.put("/api/beneficiaries/:id", async (req: Request, res: Response) => {
    try {
      const beneficiaryId = parseInt(req.params.id);
      if (isNaN(beneficiaryId)) {
        return res.status(400).json({ message: "Invalid beneficiary ID" });
      }

      const updatedBeneficiary = await storage.updateBeneficiary(beneficiaryId, req.body);
      if (!updatedBeneficiary) {
        return res.status(404).json({ message: "Beneficiary not found" });
      }

      res.status(200).json(updatedBeneficiary);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/beneficiaries/:id", async (req: Request, res: Response) => {
    try {
      const beneficiaryId = parseInt(req.params.id);
      if (isNaN(beneficiaryId)) {
        return res.status(400).json({ message: "Invalid beneficiary ID" });
      }

      const success = await storage.deleteBeneficiary(beneficiaryId);
      if (!success) {
        return res.status(404).json({ message: "Beneficiary not found" });
      }

      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  return httpServer;
}
