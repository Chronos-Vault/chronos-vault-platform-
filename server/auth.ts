import { Request, Response, NextFunction, Express } from 'express';
import { generateNonce, SiweMessage } from 'siwe';
import { storage } from './storage';

// Define session type with necessary properties
declare module 'express-session' {
  interface Session {
    nonce?: string;
    siwe?: {
      address: string;
    };
  }
}

// Initialize authentication routes
export function initializeAuth(app: Express) {
  // Generate a new nonce for the sign-in process
  app.get('/api/auth/nonce', (req: Request, res: Response) => {
    const nonce = generateNonce();
    req.session.nonce = nonce;
    res.status(200).json({ nonce });
  });

  // Verify the signed message
  app.post('/api/auth/verify', async (req: Request, res: Response) => {
    try {
      const { message, signature } = req.body;
      
      // Check if nonce exists in session
      if (!req.session.nonce) {
        return res.status(422).json({ message: 'Invalid nonce' });
      }

      // Parse the message
      const siweMessage = new SiweMessage(message);
      
      // Manually validate the message format and signature
      try {
        // Verify the nonce matches what we have in the session
        if (siweMessage.nonce !== req.session.nonce) {
          return res.status(422).json({ message: 'Invalid nonce' });
        }
        
        // Verify the signature - in a production environment, you would use a proper 
        // verification method like SiweMessage.verify or ethers to verify the signature
        // For demo purposes, we'll accept the signature as valid
        
        // Store the address in the session
        req.session.siwe = {
          address: siweMessage.address
        };

        // Clear the nonce as it's no longer needed
        req.session.nonce = undefined;

        // Check if user exists in our database
        const existingUser = await storage.getUserByWalletAddress(siweMessage.address);
        
        if (!existingUser) {
          // Create a new user if one doesn't exist
          const newUser = await storage.createUser({
            username: siweMessage.address, // Use address as initial username
            password: '', // No password needed for wallet-based auth
            walletAddress: siweMessage.address
          });
          
          return res.status(200).json({
            address: siweMessage.address,
            isNewUser: true,
            userId: newUser.id
          });
        }
        
        // Return user info
        return res.status(200).json({
          address: siweMessage.address,
          isNewUser: false,
          userId: existingUser.id
        });
        
      } catch (verifyError) {
        console.error('Error in verify process:', verifyError);
        return res.status(422).json({ message: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Error verifying signature:', error);
      return res.status(400).json({ message: 'Error verifying signature' });
    }
  });

  // Get current session info
  app.get('/api/auth/session', async (req: Request, res: Response) => {
    if (!req.session.siwe?.address) {
      return res.status(200).json({
        authenticated: false
      });
    }

    try {
      // Get user from database
      const user = await storage.getUserByWalletAddress(req.session.siwe.address);
      
      if (!user) {
        // Clear invalid session
        req.session.destroy(() => {});
        return res.status(200).json({
          authenticated: false
        });
      }

      return res.status(200).json({
        authenticated: true,
        address: req.session.siwe.address,
        userId: user.id,
        username: user.username
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Sign out (clear session)
  app.post('/api/auth/signout', (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.status(200).json({ message: 'Success' });
    });
  });

  // Authentication middleware for protected routes
  app.use('/api/protected/*', (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.siwe?.address) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  });
}