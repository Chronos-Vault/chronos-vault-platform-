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

// Disconnect wallet
router.post('/wallet/disconnect', async (req, res) => {
  try {
    const { walletType } = req.body;
    
    if (req.session.authorizedWallets && req.session.authorizedWallets[walletType]) {
      delete req.session.authorizedWallets[walletType];
    }
    
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