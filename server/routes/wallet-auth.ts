import { Router } from 'express';

const router = Router();

// Handle wallet authorization callbacks
router.post('/wallet/authorize', async (req, res) => {
  try {
    const { walletType, address, signature } = req.body;
    
    // Store authorized wallet in session
    if (!req.session.authorizedWallets) {
      req.session.authorizedWallets = {};
    }
    
    req.session.authorizedWallets[walletType] = {
      address,
      authorizedAt: new Date().toISOString(),
      signature
    };
    
    res.json({
      status: 'success',
      message: `${walletType} wallet authorized successfully`,
      data: {
        walletType,
        address,
        authorized: true
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to authorize wallet'
    });
  }
});

// Get authorized wallets
router.get('/wallet/authorized', async (req, res) => {
  try {
    const authorizedWallets = req.session.authorizedWallets || {};
    
    res.json({
      status: 'success',
      data: authorizedWallets
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get authorized wallets'
    });
  }
});

// Check mobile wallet connection status
router.post('/wallet/check-connection', async (req, res) => {
  try {
    const { walletType, timestamp } = req.body;
    
    // In a real implementation, this would check for actual wallet connection
    // For now, simulate successful connection after some time
    const connectionTime = Date.now() - timestamp;
    
    if (connectionTime > 10000) { // After 10 seconds, simulate successful connection
      const mockAddress = walletType === 'metamask' 
        ? '0x742d35Cc6635C0532925a3b8D92C'
        : walletType === 'phantom'
        ? 'BfYXwvd4jMYoFnphtf9vkAe8ZiU7roYZSEFGsi2oXhjz'
        : 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        
      res.json({
        connected: true,
        address: mockAddress,
        walletType
      });
    } else {
      res.json({
        connected: false,
        walletType
      });
    }
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: 'Failed to check connection'
    });
  }
});

// Disconnect wallet
router.post('/wallet/disconnect', async (req, res) => {
  try {
    const { walletType } = req.body;
    
    // In a real implementation, clear session data
    res.json({
      status: 'success',
      message: `${walletType} wallet disconnected`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to disconnect wallet'
    });
  }
});

export default router;