import { Router } from "express";
import { walletStorage } from "./wallet-storage";
import { insertWalletAuthSchema, insertWalletSessionSchema } from "@shared/schema";
import crypto from "crypto";
import { ethers } from "ethers";

const router = Router();

// Generate authentication nonce for wallet
router.post("/auth/nonce", async (req, res) => {
  try {
    const { walletAddress, blockchain } = req.body;

    if (!walletAddress || !blockchain) {
      return res.status(400).json({ 
        success: false, 
        message: "Wallet address and blockchain are required" 
      });
    }

    // Generate a unique nonce
    const nonce = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create or update wallet auth record
    const existingAuth = await walletStorage.getWalletAuthByAddress(walletAddress, blockchain);
    
    let walletAuth;
    if (existingAuth) {
      // Update existing auth with new nonce
      walletAuth = await walletStorage.updateWalletAuth(existingAuth.id, {
        nonce,
        expiresAt,
        status: 'pending',
        isVerified: false
      });
    } else {
      // Find or create user
      let user = await walletStorage.getUserByWalletAddress(walletAddress);
      if (!user) {
        user = await walletStorage.createUser({
          username: `user_${walletAddress.slice(-8)}`,
          password: crypto.randomBytes(32).toString('hex'), // Random password for wallet users
          walletAddress
        });
      }

      // Create new wallet auth
      walletAuth = await walletStorage.createWalletAuth({
        userId: user.id,
        walletAddress,
        blockchain,
        nonce,
        expiresAt,
        status: 'pending',
        isVerified: false
      });
    }

    res.json({
      success: true,
      nonce,
      message: `Sign this message to authenticate with Chronos Vault:\n\nNonce: ${nonce}\nAddress: ${walletAddress}\nTimestamp: ${Date.now()}`
    });
  } catch (error) {
    console.error("Error generating nonce:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate authentication nonce" 
    });
  }
});

// Verify wallet signature and create session
router.post("/auth/verify", async (req, res) => {
  try {
    const { walletAddress, blockchain, signature, message, nonce } = req.body;

    if (!walletAddress || !blockchain || !signature || !message || !nonce) {
      return res.status(400).json({ 
        success: false, 
        message: "All authentication fields are required" 
      });
    }

    // Get wallet auth by nonce
    const walletAuth = await walletStorage.getWalletAuthByNonce(nonce);
    if (!walletAuth) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired nonce" 
      });
    }

    // Verify signature based on blockchain
    let isValidSignature = false;
    
    try {
      switch (blockchain.toLowerCase()) {
        case 'ethereum':
        case 'eth':
          // Verify Ethereum signature
          const recoveredAddress = ethers.verifyMessage(message, signature);
          isValidSignature = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
          break;
          
        case 'solana':
        case 'sol':
          // For Solana, we'll accept the signature for now
          // In production, you'd use @solana/web3.js to verify
          isValidSignature = signature.length > 50; // Basic validation
          break;
          
        case 'ton':
          // For TON, we'll accept the signature for now
          // In production, you'd use TON SDK to verify
          isValidSignature = signature.length > 50; // Basic validation
          break;
          
        default:
          return res.status(400).json({ 
            success: false, 
            message: "Unsupported blockchain" 
          });
      }
    } catch (sigError) {
      console.error("Signature verification error:", sigError);
      isValidSignature = false;
    }

    if (!isValidSignature) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid signature" 
      });
    }

    // Update wallet auth as verified
    await walletStorage.updateWalletAuth(walletAuth.id, {
      signature,
      signedMessage: message,
      isVerified: true,
      status: 'verified',
      lastUsed: new Date()
    });

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Invalidate any existing sessions for this wallet
    const existingSession = await walletStorage.getUserActiveSession(walletAddress);
    if (existingSession) {
      await walletStorage.invalidateWalletSession(existingSession.sessionToken);
    }

    // Create new session
    const session = await walletStorage.createWalletSession({
      walletAuthId: walletAuth.id,
      sessionToken,
      walletAddress,
      blockchain,
      isActive: true,
      expiresAt: sessionExpiresAt,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      metadata: {
        loginTimestamp: new Date().toISOString(),
        blockchain
      }
    });

    // Get user details
    const user = await walletStorage.getUser(walletAuth.userId);

    res.json({
      success: true,
      sessionToken,
      expiresAt: sessionExpiresAt,
      user: {
        id: user?.id,
        username: user?.username,
        walletAddress: user?.walletAddress,
        email: user?.email
      },
      walletInfo: {
        address: walletAddress,
        blockchain,
        verified: true
      },
      message: "Authentication successful"
    });
  } catch (error) {
    console.error("Error verifying signature:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to verify authentication" 
    });
  }
});

// Check authentication status
router.get("/auth/status", async (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({ 
        success: false, 
        message: "No session token provided" 
      });
    }

    const session = await walletStorage.getActiveWalletSession(sessionToken);
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired session" 
      });
    }

    // Update last activity
    await walletStorage.createWalletSession({
      ...session,
      lastActivity: new Date()
    });

    const user = await walletStorage.getUser(session.walletAuthId);

    res.json({
      success: true,
      authenticated: true,
      user: {
        id: user?.id,
        username: user?.username,
        walletAddress: user?.walletAddress,
        email: user?.email
      },
      session: {
        walletAddress: session.walletAddress,
        blockchain: session.blockchain,
        expiresAt: session.expiresAt
      }
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check authentication status" 
    });
  }
});

// Logout
router.post("/auth/logout", async (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(400).json({ 
        success: false, 
        message: "No session token provided" 
      });
    }

    const invalidated = await walletStorage.invalidateWalletSession(sessionToken);
    
    if (invalidated) {
      res.json({
        success: true,
        message: "Successfully logged out"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Session not found or already invalidated"
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to logout" 
    });
  }
});

// Middleware to check authentication
export const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const session = await walletStorage.getActiveWalletSession(sessionToken);
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired session" 
      });
    }

    const user = await walletStorage.getUser(session.walletAuthId);
    req.user = user;
    req.session = session;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Authentication check failed" 
    });
  }
};

export default router;