/**
 * Hardware Wallet API Routes
 * 
 * RESTful API endpoints for hardware wallet integration and biometric authentication
 */

import { Router, Request, Response } from 'express';
import { hardwareWalletService } from '../security/hardware-wallet-service';

const router = Router();

/**
 * Detect connected hardware wallet devices
 */
router.get('/devices/detect', async (req: Request, res: Response) => {
  try {
    const devices = await hardwareWalletService.detectHardwareWallets();
    
    res.json({
      status: 'success',
      data: {
        devices,
        count: devices.length
      }
    });
  } catch (error) {
    console.error('Error detecting hardware wallets:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to detect hardware wallets'
    });
  }
});

/**
 * Get connected devices
 */
router.get('/devices', async (req: Request, res: Response) => {
  try {
    const devices = hardwareWalletService.getConnectedDevices();
    
    res.json({
      status: 'success',
      data: devices
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch connected devices'
    });
  }
});

/**
 * Initialize hardware wallet for specific network
 */
router.post('/devices/:deviceId/initialize', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { network } = req.body;

    if (!network) {
      return res.status(400).json({
        status: 'error',
        message: 'Network is required'
      });
    }

    const publicKey = await hardwareWalletService.initializeDevice(deviceId, network);
    
    res.json({
      status: 'success',
      data: {
        deviceId,
        network,
        publicKey
      }
    });
  } catch (error) {
    console.error('Error initializing device:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to initialize device'
    });
  }
});

/**
 * Create hardware wallet transaction
 */
router.post('/transactions/create', async (req: Request, res: Response) => {
  try {
    const { deviceId, network, recipient, amount } = req.body;

    if (!deviceId || !network || !recipient || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: deviceId, network, recipient, amount'
      });
    }

    const transaction = await hardwareWalletService.createHardwareTransaction(
      deviceId,
      network,
      recipient,
      amount
    );
    
    res.json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating hardware transaction:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to create transaction'
    });
  }
});

/**
 * Sign transaction with hardware wallet
 */
router.post('/transactions/:transactionId/sign', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const signature = await hardwareWalletService.signWithHardware(transactionId);
    
    res.json({
      status: 'success',
      data: {
        transactionId,
        signature
      }
    });
  } catch (error) {
    console.error('Error signing with hardware wallet:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to sign transaction'
    });
  }
});

/**
 * Setup biometric authentication
 */
router.post('/biometric/setup', async (req: Request, res: Response) => {
  try {
    const { userId, deviceId, biometricType } = req.body;

    if (!userId || !deviceId || !biometricType) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: userId, deviceId, biometricType'
      });
    }

    const profile = await hardwareWalletService.setupBiometricAuth(
      userId,
      deviceId,
      biometricType
    );
    
    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    console.error('Error setting up biometric authentication:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to setup biometric authentication'
    });
  }
});

/**
 * Authenticate with biometrics
 */
router.post('/biometric/authenticate', async (req: Request, res: Response) => {
  try {
    const { userId, deviceId } = req.body;

    if (!userId || !deviceId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: userId, deviceId'
      });
    }

    const isAuthenticated = await hardwareWalletService.authenticateWithBiometrics(
      userId,
      deviceId
    );
    
    res.json({
      status: 'success',
      data: {
        authenticated: isAuthenticated,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error authenticating with biometrics:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Biometric authentication failed'
    });
  }
});

/**
 * Get pending transactions for device
 */
router.get('/devices/:deviceId/transactions/pending', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const transactions = hardwareWalletService.getPendingTransactions(deviceId);
    
    res.json({
      status: 'success',
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pending transactions'
    });
  }
});

/**
 * Get device details
 */
router.get('/devices/:deviceId', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = hardwareWalletService.getDevice(deviceId);
    
    if (!device) {
      return res.status(404).json({
        status: 'error',
        message: 'Device not found'
      });
    }
    
    res.json({
      status: 'success',
      data: device
    });
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch device details'
    });
  }
});

export { router as hardwareWalletRoutes };