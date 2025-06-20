import { Router } from "express";
import { walletService } from "./wallet/wallet-service";

const router = Router();

// Simple auth status check
router.get("/auth/status", async (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.json({ 
        authenticated: false,
        message: "No session token provided" 
      });
    }
    
    const session = await walletService.validateSession(sessionToken);
    
    if (session) {
      res.json({
        authenticated: true,
        userId: session.userId,
        expiresAt: session.expiresAt
      });
    } else {
      res.json({
        authenticated: false,
        message: "Invalid or expired session"
      });
    }
  } catch (error) {
    console.error("Auth status check error:", error);
    res.status(500).json({ 
      authenticated: false,
      message: "Authentication check failed" 
    });
  }
});

export default router;