import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import multer from "multer";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertVaultSchema, 
  insertBeneficiarySchema,
  insertAttachmentSchema,
  insertSignatureRequestSchema,
  insertSignatureSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { registerAdminRoutes } from "./api/admin-routes";
import { registerSecurityRoutes } from "./api/security-routes";
import { securityServiceManager } from "./security/security-service-manager";
import storageRoutes from "./api/storage-routes";
import { arweaveStorageService } from "./storage/arweave-storage-service";
import securityVerificationRoutes from "./api/security-verification-routes";


if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

// Configure multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

const upload = multer({ 
  storage: fileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/csv',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'video/mp4', 'video/quicktime', 'video/webm'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Please upload a valid file.'), false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files from the uploads directory
  app.use('/uploads', (req, res, next) => {
    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
    next();
  }, (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', req.path);
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
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
  
  // Initialize security service
  await securityServiceManager.initialize();

  // Register security routes for enhanced protection
  registerSecurityRoutes(app);
  
  // Register admin routes for technical testing
  registerAdminRoutes(app);
  
  // Register permanent storage routes with Arweave integration
  app.use('/api/storage', storageRoutes);
  
  // Register enhanced security verification routes for cross-chain verification
  app.use('/api/security', securityVerificationRoutes);
  
  // Initialize Arweave storage service with a wallet
  // Note: In production, this would use a secure wallet from environment variables
  // For now, we'll initialize without a wallet, which will limit functionality
  try {
    // We'll initialize without a wallet for now - this limits functionality
    // but allows the routes to be registered and the service to provide status info
    console.log('Setting up Arweave storage service...');
  } catch (error) {
    console.error('Failed to initialize Arweave storage service:', error);
  }

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
      console.log("Received vault creation request:", JSON.stringify(req.body));
      
      // Additional logging for data types
      console.log("Data types in request:", {
        assetAmount: typeof req.body.assetAmount,
        unlockDate: typeof req.body.unlockDate,
        timeLockPeriod: typeof req.body.timeLockPeriod,
        securityLevel: typeof req.body.securityLevel
      });
      
      try {
        // Manually convert problematic fields before validation
        const preparedData = {
          ...req.body,
          // Convert string date to Date object - ensure it's a valid date
          unlockDate: req.body.unlockDate ? (
            typeof req.body.unlockDate === 'string' ? new Date(req.body.unlockDate) : 
            req.body.unlockDate instanceof Date ? req.body.unlockDate : 
            new Date(req.body.unlockDate)
          ) : new Date(),
          // Keep assetAmount as string to match database schema
          assetAmount: typeof req.body.assetAmount !== 'undefined' ? 
            (typeof req.body.assetAmount === 'string' ? req.body.assetAmount : String(req.body.assetAmount)) : 
            "0",
          // Convert string numbers to actual numbers
          timeLockPeriod: typeof req.body.timeLockPeriod !== 'undefined' ? 
            (typeof req.body.timeLockPeriod === 'string' ? parseInt(req.body.timeLockPeriod, 10) : req.body.timeLockPeriod) : 
            0,
          securityLevel: typeof req.body.securityLevel !== 'undefined' ? 
            (typeof req.body.securityLevel === 'string' ? parseInt(req.body.securityLevel, 10) : req.body.securityLevel) : 
            3
        };
        
        console.log("Prepared data with conversions:", {
          unlockDate: preparedData.unlockDate,
          unlockDateType: typeof preparedData.unlockDate,
          assetAmount: preparedData.assetAmount,
          assetAmountType: typeof preparedData.assetAmount
        });
        
        const vaultData = insertVaultSchema.parse(preparedData);
        console.log("Parsed vault data:", JSON.stringify(vaultData));
        
        const user = await storage.getUser(vaultData.userId);
        if (!user) {
          console.log("User not found for ID:", vaultData.userId);
          return res.status(404).json({ message: "User not found" });
        }

        try {
          const vault = await storage.createVault(vaultData);
          console.log("Vault created successfully:", JSON.stringify(vault));
          res.status(201).json(vault);
        } catch (dbError) {
          console.error("Error creating vault in database:", dbError);
          return res.status(500).json({ 
            message: "Database error", 
            error: dbError.message || "Unknown database error" 
          });
        }
      } catch (validationError: any) {
        console.error("Validation error:", validationError);
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: validationError.errors || validationError.message 
        });
      }
    } catch (error: any) {
      console.error("Error in vault creation:", error);
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

  // Attachment routes
  
  // Get all attachments for a vault
  app.get("/api/vaults/:vaultId/attachments", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const attachments = await storage.getAttachmentsByVault(vaultId);
      res.json(attachments);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get a specific attachment
  app.get("/api/attachments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attachment ID" });
      }

      const attachment = await storage.getAttachment(id);
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      
      res.json(attachment);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Create a new attachment with file upload
  app.post("/api/attachments", upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Get the file data
      const { originalname, mimetype, filename, size, path: filePath } = req.file;
      const fileUrl = `/uploads/${filename}`;
      
      // Extract attachment metadata from the request body
      const { vaultId, name, description, type, isEncrypted } = req.body;
      
      if (!vaultId || isNaN(parseInt(vaultId))) {
        return res.status(400).json({ message: "Valid vaultId is required" });
      }
      
      // Verify that vault exists
      const vault = await storage.getVault(parseInt(vaultId));
      if (!vault) {
        // Delete the uploaded file if the vault doesn't exist
        fs.unlinkSync(filePath);
        return res.status(404).json({ message: "Vault not found" });
      }
      
      // Create metadata object for the file
      const metadata = {
        originalName: originalname,
        mimeType: mimetype,
        uploadPath: filePath,
        fileUrl: fileUrl
      };
      
      // Create the attachment record that matches our schema
      const attachmentData = {
        vaultId: parseInt(vaultId),
        fileName: name || originalname,
        fileType: mimetype,
        fileSize: size,
        description: description || "",
        storageKey: fileUrl,
        thumbnailUrl: mimetype.startsWith('image/') ? fileUrl : null,
        isEncrypted: isEncrypted === "true",
        metadata: metadata
      };
      
      const attachment = await storage.createAttachment(attachmentData);
      res.status(201).json(attachment);
    } catch (error) {
      // If there was an error and a file was uploaded, delete it
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Failed to delete file after error:", unlinkError);
        }
      }
      handleError(res, error);
    }
  });
  
  // Update an attachment
  app.put("/api/attachments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attachment ID" });
      }
      
      const attachment = await storage.getAttachment(id);
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      
      const updatedAttachment = await storage.updateAttachment(id, req.body);
      res.json(updatedAttachment);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Delete an attachment
  app.delete("/api/attachments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attachment ID" });
      }
      
      const success = await storage.deleteAttachment(id);
      if (!success) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // Triple-Chain Security API Routes
  
  // In-memory storage for security incidents
  const securityIncidents: Array<{
    id: string;
    vaultId: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: number;
    status: 'active' | 'resolved' | 'investigating';
    blockchainData: {
      chain: 'ETH' | 'SOL' | 'TON';
      txHash: string;
      blockNumber: number;
    };
    details: any;
  }> = [];

  // Chain statuses
  let chainStatuses = {
    ETH: { status: 'online' as const, latestBlock: 15243789, lastUpdate: Date.now() },
    SOL: { status: 'online' as const, latestBlock: 189764321, lastUpdate: Date.now() },
    TON: { status: 'online' as const, latestBlock: 28974563, lastUpdate: Date.now() }
  };

  // Get all security incidents for a vault
  app.get("/api/security/incidents/:vaultId", async (req: Request, res: Response) => {
    try {
      const { vaultId } = req.params;
      
      if (!vaultId) {
        return res.status(400).json({ message: "Vault ID is required" });
      }
      
      // Check if vault exists
      const vault = await storage.getVault(parseInt(vaultId));
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }
      
      // Return incidents for this vault from our in-memory storage
      const incidents = securityIncidents.filter(incident => incident.vaultId === vaultId);
      res.json(incidents);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Create a security incident
  app.post("/api/security/incidents", async (req: Request, res: Response) => {
    try {
      const { vaultId, type, severity, chain, txHash, blockNumber, details } = req.body;
      
      if (!vaultId || !type || !severity || !chain) {
        return res.status(400).json({ message: "Required fields are missing" });
      }
      
      // Check if vault exists
      const vault = await storage.getVault(parseInt(vaultId));
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }
      
      // Create new incident
      const incident = {
        id: `incident-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        vaultId,
        type,
        severity,
        timestamp: Date.now(),
        status: 'active' as const,
        blockchainData: {
          chain,
          txHash: txHash || `0x${Math.random().toString(16).substring(2, 42)}`,
          blockNumber: blockNumber || Math.floor(Math.random() * 1000000)
        },
        details: details || {}
      };
      
      securityIncidents.push(incident);
      res.status(201).json(incident);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Update a security incident
  app.put("/api/security/incidents/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, details } = req.body;
      
      const incidentIndex = securityIncidents.findIndex(i => i.id === id);
      if (incidentIndex === -1) {
        return res.status(404).json({ message: "Security incident not found" });
      }
      
      // Update the incident
      if (status) {
        securityIncidents[incidentIndex].status = status;
      }
      
      if (details) {
        securityIncidents[incidentIndex].details = {
          ...securityIncidents[incidentIndex].details,
          ...details
        };
      }
      
      res.json(securityIncidents[incidentIndex]);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get chain statuses
  app.get("/api/security/chain-status", (_req: Request, res: Response) => {
    try {
      // Update timestamps and randomize block numbers to simulate updates
      const now = Date.now();
      const timeSinceUpdate = now - chainStatuses.ETH.lastUpdate;
      
      // If it's been more than 30 seconds since last update, update block numbers
      if (timeSinceUpdate > 30000) {
        chainStatuses = {
          ETH: { 
            status: Math.random() > 0.1 ? 'online' : 'degraded', 
            latestBlock: chainStatuses.ETH.latestBlock + Math.floor(Math.random() * 10) + 1,
            lastUpdate: now
          },
          SOL: {
            status: Math.random() > 0.1 ? 'online' : 'degraded',
            latestBlock: chainStatuses.SOL.latestBlock + Math.floor(Math.random() * 1000) + 100,
            lastUpdate: now
          },
          TON: {
            status: Math.random() > 0.1 ? 'online' : 'degraded',
            latestBlock: chainStatuses.TON.latestBlock + Math.floor(Math.random() * 100) + 10,
            lastUpdate: now
          }
        };
      }
      
      res.json(chainStatuses);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Cross-chain vault verification
  app.get("/api/security/verify-vault/:vaultId", async (req: Request, res: Response) => {
    try {
      const { vaultId } = req.params;
      
      if (!vaultId) {
        return res.status(400).json({ message: "Vault ID is required" });
      }
      
      // Check if vault exists
      const vault = await storage.getVault(parseInt(vaultId));
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }
      
      // Simulate cross-chain verification with some random data
      const verified = Math.random() > 0.1; // 90% success rate
      const verificationResults = {
        ETH: {
          verified: Math.random() > 0.1,
          blockHeight: chainStatuses.ETH.latestBlock,
          timestamp: Date.now() - Math.floor(Math.random() * 60000)
        },
        SOL: {
          verified: Math.random() > 0.1,
          blockHeight: chainStatuses.SOL.latestBlock,
          timestamp: Date.now() - Math.floor(Math.random() * 30000)
        },
        TON: {
          verified: Math.random() > 0.1,
          blockHeight: chainStatuses.TON.latestBlock,
          timestamp: Date.now() - Math.floor(Math.random() * 45000)
        }
      };
      
      // Overall verification only succeeds if all chains verify
      const allChainsVerified = Object.values(verificationResults).every(r => r.verified);
      
      res.json({
        vaultId,
        verified: allChainsVerified,
        timestamp: Date.now(),
        results: verificationResults,
        consistencyScore: allChainsVerified ? 
          Math.floor(Math.random() * 10) + 90 : // 90-100 for verified
          Math.floor(Math.random() * 30) + 60   // 60-90 for not verified
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Security metrics
  app.get("/api/security/metrics", (_req: Request, res: Response) => {
    try {
      const activeIncidentCount = securityIncidents.filter(i => i.status === 'active').length;
      
      // Generate security metrics
      res.json({
        timestamp: Date.now(),
        incidentCount: securityIncidents.length,
        activeIncidents: activeIncidentCount,
        resolvedIncidents: securityIncidents.length - activeIncidentCount,
        incidentsByType: {
          unauthorized_access: Math.floor(Math.random() * 3),
          suspected_fraud: Math.floor(Math.random() * 2),
          abnormal_transfer: Math.floor(Math.random() * 4),
          multi_sig_failure: Math.floor(Math.random() * 1),
          protocol_vulnerability: Math.floor(Math.random() * 1),
          data_inconsistency: Math.floor(Math.random() * 2),
          cross_chain_attack: Math.floor(Math.random() * 1)
        },
        incidentsBySeverity: {
          critical: Math.floor(Math.random() * 1),
          high: Math.floor(Math.random() * 2),
          medium: Math.floor(Math.random() * 4),
          low: Math.floor(Math.random() * 5)
        },
        securityScore: Math.floor(Math.random() * 20) + 80, // 80-100
        crossChainConsistency: Math.floor(Math.random() * 10) + 90, // 90-100
        allChainsOnline: Object.values(chainStatuses).every(status => status.status === 'online')
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Smart contract deployment endpoints for testnet
  
  // Get all contracts
  app.get("/api/contracts", async (_req: Request, res: Response) => {
    try {
      // Get all contracts across blockchains
      const contracts = await Promise.all([
        storage.getChainContractsByBlockchain("ethereum"),
        storage.getChainContractsByBlockchain("solana"),
        storage.getChainContractsByBlockchain("ton")
      ]).then(results => results.flat());
      
      res.json(contracts);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get contracts by blockchain
  app.get("/api/contracts/:blockchain", async (req: Request, res: Response) => {
    try {
      const { blockchain } = req.params;
      if (!blockchain || !['ethereum', 'solana', 'ton'].includes(blockchain)) {
        return res.status(400).json({ error: "Invalid blockchain specified. Must be 'ethereum', 'solana', or 'ton'." });
      }
      
      const contracts = await storage.getChainContractsByBlockchain(blockchain);
      res.json(contracts);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get contracts by type
  app.get("/api/contracts/type/:contractType", async (req: Request, res: Response) => {
    try {
      const { contractType } = req.params;
      if (!contractType || !['vault', 'bridge', 'factory'].includes(contractType)) {
        return res.status(400).json({ error: "Invalid contract type. Must be 'vault', 'bridge', or 'factory'." });
      }
      
      const contracts = await storage.getChainContractsByType(contractType);
      res.json(contracts);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Register a new contract deployment
  app.post("/api/contracts", async (req: Request, res: Response) => {
    try {
      const contractData = req.body;
      
      // Basic validation
      if (!contractData.blockchain || !contractData.contractType || !contractData.contractName || !contractData.contractAddress || !contractData.network) {
        return res.status(400).json({ error: "Missing required contract fields" });
      }
      
      const newContract = await storage.createChainContract(contractData);
      res.status(201).json(newContract);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Update contract status
  app.put("/api/contracts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedContract = await storage.updateChainContract(id, updateData);
      
      if (!updatedContract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      res.json(updatedContract);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Delete contract (admin only)
  app.delete("/api/contracts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if contract exists first
      const contract = await storage.getChainContract(id);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      const result = await storage.deleteChainContract(id);
      
      if (result) {
        res.json({ success: true, message: "Contract deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete contract" });
      }
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Cross-chain transaction endpoints
  
  // Get cross-chain transactions for a vault
  app.get("/api/vaults/:vaultId/cross-chain-txs", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ error: "Invalid vault ID" });
      }
      
      // Check if vault exists
      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ error: "Vault not found" });
      }
      
      const transactions = await storage.getCrossChainTransactionsByVault(vaultId);
      res.json(transactions);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Create a new cross-chain transaction
  app.post("/api/cross-chain-txs", async (req: Request, res: Response) => {
    try {
      const txData = req.body;
      
      // Basic validation
      if (!txData.vaultId || !txData.sourceChain || !txData.targetChain || !txData.sourceTxHash || !txData.status) {
        return res.status(400).json({ error: "Missing required cross-chain transaction fields" });
      }
      
      const newTransaction = await storage.createCrossChainTransaction(txData);
      res.status(201).json(newTransaction);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Update a cross-chain transaction
  app.put("/api/cross-chain-txs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedTransaction = await storage.updateCrossChainTransaction(id, updateData);
      
      if (!updatedTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Multi-Signature Vault Routes
  
  // Get all signers for a vault
  app.get("/api/vaults/:vaultId/signers", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      // Parse the vault metadata to get the signers
      const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
      const multiSigConfig = metadata.multiSigConfig || { signers: [] };
      
      res.json(multiSigConfig.signers || []);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update multi-signature configuration
  app.put("/api/vaults/:vaultId/multisig", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      // Update the metadata with the new multisig configuration
      const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
      metadata.multiSigConfig = req.body;
      
      const updatedVault = await storage.updateVault(vaultId, { 
        metadata: JSON.stringify(metadata) 
      });
      
      res.json({ success: true, multiSigConfig: req.body });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Create a new signature request for a vault
  app.post("/api/vaults/:vaultId/signature-requests", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const { requestType, requester, expiresAt, description } = req.body;
      
      if (!requestType || !requester) {
        return res.status(400).json({ message: "Request type and requester are required" });
      }

      // For now we'll just return a mock signature request
      // In production, this would be stored in the database
      const signatureRequest = {
        id: Math.floor(Math.random() * 10000),
        vaultId,
        requestType,
        requester,
        description: description || "",
        expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        signatures: [],
        createdAt: new Date().toISOString()
      };
      
      res.status(201).json(signatureRequest);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Sign a signature request
  app.post("/api/signature-requests/:requestId/sign", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.requestId);
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      const { signerAddress, signature, message } = req.body;
      
      if (!signerAddress || !signature) {
        return res.status(400).json({ message: "Signer address and signature are required" });
      }

      // In production, this would validate the signature and update the database
      // For now, we'll just return a success response
      res.json({
        success: true,
        message: "Signature added successfully",
        requestId,
        signer: signerAddress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Geolocation Verification Routes
  
  // Get geolocation settings for a vault
  app.get("/api/vaults/:vaultId/geolocation", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      // Parse the vault metadata to get the geolocation settings
      const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
      const geoConfig = metadata.geoConfig || { safeZones: [] };
      
      // Don't return exact coordinates in the response for security
      const sanitizedConfig = {
        ...geoConfig,
        safeZones: geoConfig.safeZones?.map((zone: any) => ({
          id: zone.id || Math.random().toString(36).substring(2, 15),
          name: zone.name,
          // Don't return exact coordinates, only approximate
          approximate: `${zone.latitude.toFixed(1)}, ${zone.longitude.toFixed(1)}`,
          radius: zone.radius
        }))
      };
      
      res.json(sanitizedConfig);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update geolocation settings for a vault
  app.put("/api/vaults/:vaultId/geolocation", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      // Update the metadata with the new geolocation configuration
      const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
      metadata.geoConfig = req.body;
      
      const updatedVault = await storage.updateVault(vaultId, { 
        metadata: JSON.stringify(metadata) 
      });
      
      res.json({ success: true, geoConfig: req.body });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Verify geolocation for a vault action
  app.post("/api/vaults/:vaultId/verify-location", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const { latitude, longitude, walletAddress } = req.body;
      
      if (!latitude || !longitude || !walletAddress) {
        return res.status(400).json({ message: "Latitude, longitude, and wallet address are required" });
      }

      // Parse the vault metadata to get the geolocation settings
      const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
      const geoConfig = metadata.geoConfig || { safeZones: [] };
      
      if (!geoConfig.safeZones || geoConfig.safeZones.length === 0) {
        return res.status(400).json({ message: "No safe zones configured for this vault" });
      }

      // Check if the provided location is within any safe zone
      const isInSafeZone = geoConfig.safeZones.some((zone: any) => {
        // Calculate distance using Haversine formula
        const lat1 = zone.latitude;
        const lon1 = zone.longitude;
        const lat2 = parseFloat(latitude);
        const lon2 = parseFloat(longitude);
        
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= zone.radius;
      });

      if (!isInSafeZone) {
        return res.status(403).json({ 
          success: false, 
          message: "Location verification failed. You are not in a safe zone."
        });
      }

      // Location verified successfully
      res.json({
        success: true,
        message: "Location verified successfully",
        verificationToken: `geo-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // CVT Token Integration Routes
  
  // Get CVT token balances for a user
  app.get("/api/token/cvt/balances/:walletAddress", async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      // In production, this would query the blockchain
      // For now, we'll just return mock balances
      const balances = [
        {
          chain: "ethereum",
          balance: 1000 + Math.floor(Math.random() * 500),
          marketValue: 1250 + Math.floor(Math.random() * 625),
          address: walletAddress
        },
        {
          chain: "solana",
          balance: 500 + Math.floor(Math.random() * 250),
          marketValue: 625 + Math.floor(Math.random() * 312),
          address: `SOL${walletAddress.substring(3)}`
        },
        {
          chain: "ton",
          balance: 750 + Math.floor(Math.random() * 375),
          marketValue: 937.5 + Math.floor(Math.random() * 469),
          address: `TON${walletAddress.substring(3)}`
        }
      ];
      
      res.json(balances);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get CVT token economics data
  app.get("/api/token/cvt/economics", async (_req: Request, res: Response) => {
    try {
      // In production, this would query from a database or blockchain
      const economics = {
        totalSupply: 100000000,
        circulatingSupply: 35000000,
        marketCap: 43750000,
        currentPrice: 1.25,
        allTimeHigh: 1.75,
        stakingApr: 12.5,
        burnRate: 2.5,
        stakingRatio: 42.5,
      };
      
      res.json(economics);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get CVT staking positions for a user
  app.get("/api/token/cvt/staking", async (req: Request, res: Response) => {
    try {
      const { walletAddress, vaultId } = req.query;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      // In production, this would query the blockchain or database
      // For now, we'll just return mock staking positions
      const stakingPositions = [
        {
          id: 1,
          amount: 500,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          apr: 12.5,
          chain: "ethereum",
          status: "active",
          securityBoost: 15,
          vaultId: vaultId ? parseInt(vaultId as string) : null
        },
        {
          id: 2,
          amount: 250,
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          apr: 10,
          chain: "ton",
          status: "active",
          securityBoost: 7.5,
          vaultId: vaultId ? parseInt(vaultId as string) : null
        }
      ];
      
      res.json(stakingPositions);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Stake CVT tokens
  app.post("/api/token/cvt/stake", async (req: Request, res: Response) => {
    try {
      const { amount, chain, duration, vaultId, walletAddress } = req.body;
      
      if (!amount || !chain || !duration || !walletAddress) {
        return res.status(400).json({ 
          message: "Amount, chain, duration, and wallet address are required" 
        });
      }

      // In production, this would initiate a blockchain transaction
      // For now, we'll just return a mock staking position
      
      // Calculate security boost based on amount and duration
      let securityBoost = 5; // Base boost
      
      // Add boost based on amount
      if (amount >= 1000) securityBoost += 10;
      else if (amount >= 500) securityBoost += 7.5;
      else if (amount >= 100) securityBoost += 5;
      else securityBoost += 2.5;
      
      // Add boost based on duration
      if (duration >= 365) securityBoost += 15; // 1 year+
      else if (duration >= 180) securityBoost += 10; // 6 months+
      else if (duration >= 90) securityBoost += 7.5; // 3 months+
      else if (duration >= 30) securityBoost += 5; // 1 month+
      
      const stakingPosition = {
        id: Math.floor(Math.random() * 1000) + 1,
        amount: parseFloat(amount),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
        apr: parseFloat(amount) > 500 ? 15 : 10,
        chain,
        status: "active",
        securityBoost,
        walletAddress,
        vaultId: vaultId ? parseInt(vaultId) : null,
        txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      };
      
      // If this is connected to a vault, update the vault's security boost
      if (vaultId) {
        const vault = await storage.getVault(parseInt(vaultId));
        if (vault) {
          const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
          
          if (!metadata.cvtStaking) {
            metadata.cvtStaking = {
              totalStaked: parseFloat(amount),
              securityBoost,
              positions: [stakingPosition.id]
            };
          } else {
            metadata.cvtStaking.totalStaked += parseFloat(amount);
            metadata.cvtStaking.securityBoost += securityBoost;
            metadata.cvtStaking.positions = [...(metadata.cvtStaking.positions || []), stakingPosition.id];
          }
          
          await storage.updateVault(parseInt(vaultId), { 
            metadata: JSON.stringify(metadata) 
          });
        }
      }
      
      res.status(201).json(stakingPosition);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Multi-Signature Routes
  // Get all signature requests for a vault
  app.get("/api/signature-requests/vault/:vaultId", async (req: Request, res: Response) => {
    try {
      const vaultId = parseInt(req.params.vaultId);
      if (isNaN(vaultId)) {
        return res.status(400).json({ message: "Invalid vault ID" });
      }

      const vault = await storage.getVault(vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const signatureRequests = await storage.getSignatureRequestsByVault(vaultId);
      res.status(200).json(signatureRequests);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get signature requests by status
  app.get("/api/signature-requests/status/:status", async (req: Request, res: Response) => {
    try {
      const { status } = req.params;
      if (!status) {
        return res.status(400).json({ message: "Status parameter is required" });
      }

      const signatureRequests = await storage.getSignatureRequestsByStatus(status);
      res.status(200).json(signatureRequests);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get signature requests by requester address
  app.get("/api/signature-requests/requester/:address", async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      if (!address) {
        return res.status(400).json({ message: "Requester address is required" });
      }

      const signatureRequests = await storage.getSignatureRequestsByRequester(address);
      res.status(200).json(signatureRequests);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get a specific signature request
  app.get("/api/signature-requests/:id", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Invalid signature request ID" });
      }

      const signatureRequest = await storage.getSignatureRequest(requestId);
      if (!signatureRequest) {
        return res.status(404).json({ message: "Signature request not found" });
      }

      // Get all signatures for this request
      const signatures = await storage.getSignaturesByRequest(requestId);

      res.status(200).json({ ...signatureRequest, signatures });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Create a new signature request
  app.post("/api/signature-requests", async (req: Request, res: Response) => {
    try {
      const requestData = insertSignatureRequestSchema.parse(req.body);
      
      // Verify the vault exists
      const vault = await storage.getVault(requestData.vaultId);
      if (!vault) {
        return res.status(404).json({ message: "Vault not found" });
      }

      const signatureRequest = await storage.createSignatureRequest(requestData);
      res.status(201).json(signatureRequest);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update a signature request
  app.put("/api/signature-requests/:id", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Invalid signature request ID" });
      }

      const existingRequest = await storage.getSignatureRequest(requestId);
      if (!existingRequest) {
        return res.status(404).json({ message: "Signature request not found" });
      }

      const updatedRequest = await storage.updateSignatureRequest(requestId, req.body);
      res.status(200).json(updatedRequest);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Complete a signature request (mark as approved/executed)
  app.post("/api/signature-requests/:id/complete", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Invalid signature request ID" });
      }

      const existingRequest = await storage.getSignatureRequest(requestId);
      if (!existingRequest) {
        return res.status(404).json({ message: "Signature request not found" });
      }

      // Check if the request has enough signatures
      const signatures = await storage.getSignaturesByRequest(requestId);
      const signatureCount = signatures.length;
      
      // Required signature count is stored in threshold property
      if (signatureCount < existingRequest.threshold) {
        return res.status(400).json({ 
          message: "Not enough signatures to complete this request", 
          currentCount: signatureCount,
          requiredCount: existingRequest.threshold
        });
      }

      const completedRequest = await storage.completeSignatureRequest(requestId);
      res.status(200).json(completedRequest);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Add a signature to a request
  app.post("/api/signatures", async (req: Request, res: Response) => {
    try {
      const signatureData = insertSignatureSchema.parse(req.body);
      
      // Verify the signature request exists
      const request = await storage.getSignatureRequest(signatureData.requestId);
      if (!request) {
        return res.status(404).json({ message: "Signature request not found" });
      }
      
      // Check if the request is still pending
      if (request.status !== 'pending') {
        return res.status(400).json({ 
          message: `Cannot sign a request with status: ${request.status}` 
        });
      }

      // Check if the signer has already signed
      const existingSignatures = await storage.getSignaturesByRequest(signatureData.requestId);
      const alreadySigned = existingSignatures.some(sig => 
        sig.signerAddress.toLowerCase() === signatureData.signerAddress.toLowerCase()
      );
      
      if (alreadySigned) {
        return res.status(400).json({ message: "This address has already signed this request" });
      }

      const signature = await storage.createSignature(signatureData);
      
      // Check if we now have enough signatures to auto-complete the request
      const updatedSignatures = await storage.getSignaturesByRequest(signatureData.requestId);
      if (updatedSignatures.length >= request.threshold) {
        await storage.completeSignatureRequest(signatureData.requestId);
      }
      
      res.status(201).json(signature);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Delete a signature
  app.delete("/api/signatures/:id", async (req: Request, res: Response) => {
    try {
      const signatureId = parseInt(req.params.id);
      if (isNaN(signatureId)) {
        return res.status(400).json({ message: "Invalid signature ID" });
      }

      const success = await storage.deleteSignature(signatureId);
      if (!success) {
        return res.status(404).json({ message: "Signature not found" });
      }

      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // Stripe Payment Integration Routes
  // One-time payment route
  app.post("/api/payments/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount, currency = "usd", vaultId, description } = req.body;
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          error: "Invalid payment parameters. A positive amount is required."
        });
      }

      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: currency,
        description: description || `Payment for vault ${vaultId}`,
        metadata: {
          vaultId: vaultId?.toString() || "",
          type: "premium_vault_features"
        }
      });

      // Return the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        error: "Failed to create payment intent",
        message: error.message
      });
    }
  });

  // Subscription plan route
  app.post("/api/payments/create-subscription", async (req: Request, res: Response) => {
    try {
      const { userId, priceId, customerEmail, customerName } = req.body;
      
      if (!userId || !priceId) {
        return res.status(400).json({
          error: "Invalid subscription parameters. userId and priceId are required."
        });
      }

      // Check if we already have a customer for this user
      let customerId;
      const user = await storage.getUser(parseInt(userId));
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create a customer if we don't have one
      if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: customerEmail || user.email,
          name: customerName || user.username,
          metadata: {
            userId: userId.toString()
          }
        });
        
        customerId = customer.id;
        
        // Update user with new Stripe customer ID
        // This would require adding stripeCustomerId to your user schema
        if (user.metadata) {
          const metadata = JSON.parse(user.metadata);
          metadata.stripeCustomerId = customerId;
          await storage.updateUser(user.id, { metadata: JSON.stringify(metadata) });
        } else {
          const metadata = { stripeCustomerId: customerId };
          await storage.updateUser(user.id, { metadata: JSON.stringify(metadata) });
        }
      } else {
        // Use existing customer ID from user record
        customerId = user.stripeCustomerId;
      }

      // Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          { price: priceId }
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: userId.toString()
        }
      });

      // Return the client secret
      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({
        error: "Failed to create subscription",
        message: error.message
      });
    }
  });

  // Webhook for Stripe events (payment success, failure, etc.)
  app.post("/api/payments/webhook", async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    if (endpointSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }
    } else {
      // For testing without signature verification
      event = req.body;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Process successful payment
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
        
        // If this payment is for a vault, update the vault's premium status
        if (paymentIntent.metadata && paymentIntent.metadata.vaultId) {
          try {
            const vaultId = parseInt(paymentIntent.metadata.vaultId);
            const vault = await storage.getVault(vaultId);
            
            if (vault) {
              // Update vault with premium features
              const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
              metadata.premium = {
                active: true,
                activatedAt: new Date().toISOString(),
                paymentId: paymentIntent.id
              };
              
              await storage.updateVault(vaultId, {
                metadata: JSON.stringify(metadata)
              });
            }
          } catch (error) {
            console.error("Error updating vault premium status:", error);
          }
        }
        break;
        
      case 'subscription_schedule.created':
      case 'customer.subscription.created':
        const subscription = event.data.object;
        console.log(`Subscription created: ${subscription.id}`);
        break;
        
      case 'subscription_schedule.canceled':
      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        console.log(`Subscription canceled: ${canceledSubscription.id}`);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  });

  return httpServer;
}
