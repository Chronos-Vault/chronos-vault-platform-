import { Router } from "express";
import { z } from "zod";
import { walletService } from "./wallet-service";

const router = Router();

// Request wallet authentication
const requestAuthSchema = z.object({
  walletAddress: z.string().min(1),
  walletType: z.enum(['metamask', 'phantom', 'tonkeeper']),
  blockchain: z.enum(['ethereum', 'solana', 'ton']),
});

router.post("/auth/request", async (req, res) => {
  try {
    const data = requestAuthSchema.parse(req.body);
    
    const result = await walletService.createAuthAttempt(data);
    
    res.json({
      success: true,
      nonce: result.nonce,
      message: result.message,
      attemptId: result.attemptId,
    });
  } catch (error) {
    console.error("Wallet auth request error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid request data",
    });
  }
});

// Verify wallet signature and connect
const verifySignatureSchema = z.object({
  attemptId: z.number(),
  signature: z.string().min(1),
});

router.post("/auth/verify", async (req, res) => {
  try {
    const data = verifySignatureSchema.parse(req.body);
    
    const isValid = await walletService.verifySignature(data.attemptId, data.signature);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid signature",
      });
    }

    res.json({
      success: true,
      message: "Signature verified successfully",
    });
  } catch (error) {
    console.error("Wallet signature verification error:", error);
    res.status(500).json({
      success: false,
      error: "Verification failed",
    });
  }
});

// Connect wallet to user account
const connectWalletSchema = z.object({
  walletAddress: z.string().min(1),
  walletType: z.enum(['metamask', 'phantom', 'tonkeeper']),
  blockchain: z.enum(['ethereum', 'solana', 'ton']),
  signature: z.string().min(1),
  message: z.string().min(1),
});

router.post("/connect", async (req, res) => {
  try {
    const data = connectWalletSchema.parse(req.body);
    
    // Get or create user
    const user = await walletService.getOrCreateUserByWallet(data.walletAddress, data.walletType);
    
    // Connect wallet
    const connection = await walletService.connectWallet({
      userId: user.id,
      ...data,
    });
    
    // Create session
    const session = await walletService.createSession(connection.id, user.id);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
      wallet: {
        id: connection.id,
        address: connection.walletAddress,
        type: connection.walletType,
        blockchain: connection.blockchain,
      },
      session: {
        id: session.sessionId,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Wallet connection error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to connect wallet",
    });
  }
});

// Get user's connected wallets
router.get("/wallets", async (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: "No session provided",
      });
    }
    
    const session = await walletService.validateSession(sessionId);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired session",
      });
    }
    
    const wallets = await walletService.getUserWallets(session.userId);
    
    res.json({
      success: true,
      wallets: wallets.map(wallet => ({
        id: wallet.id,
        address: wallet.walletAddress,
        type: wallet.walletType,
        blockchain: wallet.blockchain,
        connectedAt: wallet.connectedAt,
        lastUsed: wallet.lastUsed,
      })),
    });
  } catch (error) {
    console.error("Get wallets error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get wallets",
    });
  }
});

// Disconnect wallet
router.post("/disconnect/:walletId", async (req, res) => {
  try {
    const walletId = parseInt(req.params.walletId);
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: "No session provided",
      });
    }
    
    const session = await walletService.validateSession(sessionId);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired session",
      });
    }
    
    const success = await walletService.disconnectWallet(walletId);
    
    res.json({
      success,
      message: success ? "Wallet disconnected successfully" : "Failed to disconnect wallet",
    });
  } catch (error) {
    console.error("Disconnect wallet error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to disconnect wallet",
    });
  }
});

// Validate session endpoint
router.get("/session/validate", async (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: "No session provided",
      });
    }
    
    const session = await walletService.validateSession(sessionId);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired session",
      });
    }
    
    res.json({
      success: true,
      session: {
        id: session.sessionId,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    res.status(500).json({
      success: false,
      error: "Session validation failed",
    });
  }
});

export default router;