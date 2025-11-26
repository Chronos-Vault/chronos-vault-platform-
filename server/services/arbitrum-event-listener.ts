/**
 * Arbitrum Event Listener Service
 * 
 * Real-time monitoring of ChronosVault events on Arbitrum Sepolia
 * Part of Trinity Protocol Cross-Chain State Synchronization
 * 
 * Monitors:
 * - VaultCreated: New vault initialization
 * - VaultUnlocked: Time-lock expiration
 * - VaultDeposit: Asset deposits
 * - VaultWithdrawal: Asset withdrawals
 * - CrossChainVerificationRequested: Trinity Protocol consensus requests
 */

import { ethers } from 'ethers';
import config from '../config';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { EventEmitter } from 'events';

export interface ArbitrumVaultEvent {
  eventName: string;
  vaultId: string;
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
  data: any;
}

export class ArbitrumEventListener extends EventEmitter {
  private provider: ethers.JsonRpcProvider | null = null;
  private vaultContract: ethers.Contract | null = null;
  private bridgeContract: ethers.Contract | null = null;
  private isListening: boolean = false;
  private lastProcessedBlock: number = 0;

  // ChronosVault ABI - Events we monitor
  private vaultAbi = [
    "event VaultCreated(string indexed vaultId, address indexed owner, uint256 unlockTime, uint256 amount)",
    "event VaultUnlocked(string indexed vaultId, uint256 timestamp)",
    "event VaultDeposit(string indexed vaultId, address indexed depositor, uint256 amount)",
    "event VaultWithdrawal(string indexed vaultId, address indexed recipient, uint256 amount)",
    "event CrossChainVerificationRequested(string indexed vaultId, string targetChain, bytes32 stateHash)",
    "event EmergencyRecoveryTriggered(string indexed vaultId, address indexed initiator, uint256 timestamp)",
    
    // View functions for state queries
    "function getVaultState(string vaultId) view returns (uint8 state, uint256 unlockTime, uint256 balance, bool isLocked)",
    "function checkUnlockConditions(string vaultId) view returns (bool canUnlock, string reason)",
    "function verifyWithdrawalPermissions(string vaultId, address user) view returns (bool hasPermission)"
  ];

  // CVTBridge ABI - Cross-chain events
  private bridgeAbi = [
    "event HTLCCreated(bytes32 indexed htlcId, address indexed sender, uint256 amount, bytes32 hashlock, uint256 timelock)",
    "event HTLCClaimed(bytes32 indexed htlcId, address indexed receiver, bytes32 preimage)",
    "event HTLCRefunded(bytes32 indexed htlcId, address indexed sender)",
    "event CrossChainSwapInitiated(bytes32 indexed swapId, string sourceChain, string targetChain, uint256 amount)"
  ];

  constructor() {
    super();
  }

  /**
   * Initialize the event listener with automatic RPC fallback and exponential backoff
   */
  async initialize(): Promise<void> {
    try {
      securityLogger.info('🎧 Initializing Arbitrum Event Listener...', SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Try multiple RPC endpoints with automatic fallback
      // PRIORITY: Use free, unlimited endpoints first to avoid rate limiting
      const rpcEndpoints = [
        'https://arbitrum-sepolia.public.blastapi.io', // BlastAPI - Free, no rate limits
        'https://public.stackup.sh/api/v1/node/arbitrum-sepolia', // StackUp - Free tier
        config.blockchainConfig.ethereum.rpcUrl, // User's custom RPC
        'https://sepolia-rollup.arbitrum.io/rpc', // Official (rate limited - last resort)
      ];

      let lastError: any = null;
      
      for (const rpcUrl of rpcEndpoints) {
        // EXPONENTIAL BACKOFF: Retry each endpoint with increasing delays
        const maxRetries = 3;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            securityLogger.info(`   Trying RPC endpoint (attempt ${attempt}/${maxRetries}): ${rpcUrl.substring(0, 50)}...`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
            
            this.provider = new ethers.JsonRpcProvider(rpcUrl);
            const network = await this.provider.getNetwork();
            
            securityLogger.info(`   ✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

            // Initialize ChronosVault contract
            const vaultAddress = config.blockchainConfig.ethereum.contracts.vault;
            this.vaultContract = new ethers.Contract(vaultAddress, this.vaultAbi, this.provider);
            securityLogger.info(`   Monitoring ChronosVault at: ${vaultAddress}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

            // Initialize CVTBridge contract
            const bridgeAddress = config.blockchainConfig.ethereum.contracts.cvtBridge;
            this.bridgeContract = new ethers.Contract(bridgeAddress, this.bridgeAbi, this.provider);
            securityLogger.info(`   Monitoring CVTBridge at: ${bridgeAddress}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

            // Get current block number
            this.lastProcessedBlock = await this.provider.getBlockNumber();
            securityLogger.info(`   Starting from block: ${this.lastProcessedBlock}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

            securityLogger.info('✅ Arbitrum Event Listener initialized successfully', SecurityEventType.CROSS_CHAIN_VERIFICATION);
            return; // Success - exit immediately
            
          } catch (error: any) {
            lastError = error;
            const is429 = error.message?.includes('429') || error.message?.includes('Too Many Requests');
            
            if (is429 && attempt < maxRetries) {
              const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
              securityLogger.warn(`   ⚠️ Rate limited (429) - waiting ${delay}ms before retry...`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Retry same endpoint
            } else {
              securityLogger.warn(`   ⚠️ RPC endpoint failed: ${error.message}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
              break; // Try next endpoint
            }
          }
        }
      }

      // All endpoints failed - log warning but DON'T crash the server
      securityLogger.error('❌ All Arbitrum RPC endpoints failed - Event Listener will be disabled', SecurityEventType.SYSTEM_ERROR, lastError);
      securityLogger.info('ℹ️ Server will continue running without Arbitrum event monitoring', SecurityEventType.CROSS_CHAIN_VERIFICATION);
      
    } catch (error) {
      securityLogger.error('❌ Failed to initialize Arbitrum Event Listener', SecurityEventType.SYSTEM_ERROR, error);
      // Don't throw - let the server continue running
    }
  }

  /**
   * Start listening to events
   */
  async startListening(): Promise<void> {
    if (this.isListening) {
      securityLogger.warn('Arbitrum Event Listener is already running', SecurityEventType.CROSS_CHAIN_VERIFICATION);
      return;
    }

    if (!this.vaultContract || !this.bridgeContract) {
      throw new Error('Event listener not initialized. Call initialize() first.');
    }

    this.isListening = true;
    securityLogger.info('🚀 Arbitrum Event Listener started - monitoring real-time events', SecurityEventType.CROSS_CHAIN_VERIFICATION);

    // Listen to ChronosVault events
    this.vaultContract.on('VaultCreated', async (vaultId, owner, unlockTime, amount, event) => {
      await this.handleVaultCreated(vaultId, owner, unlockTime, amount, event);
    });

    this.vaultContract.on('VaultUnlocked', async (vaultId, timestamp, event) => {
      await this.handleVaultUnlocked(vaultId, timestamp, event);
    });

    this.vaultContract.on('VaultDeposit', async (vaultId, depositor, amount, event) => {
      await this.handleVaultDeposit(vaultId, depositor, amount, event);
    });

    this.vaultContract.on('VaultWithdrawal', async (vaultId, recipient, amount, event) => {
      await this.handleVaultWithdrawal(vaultId, recipient, amount, event);
    });

    this.vaultContract.on('CrossChainVerificationRequested', async (vaultId, targetChain, stateHash, event) => {
      await this.handleCrossChainVerificationRequest(vaultId, targetChain, stateHash, event);
    });

    this.vaultContract.on('EmergencyRecoveryTriggered', async (vaultId, initiator, timestamp, event) => {
      await this.handleEmergencyRecovery(vaultId, initiator, timestamp, event);
    });

    // Listen to CVTBridge events
    this.bridgeContract.on('HTLCCreated', async (htlcId, sender, amount, hashlock, timelock, event) => {
      await this.handleHTLCCreated(htlcId, sender, amount, hashlock, timelock, event);
    });

    this.bridgeContract.on('CrossChainSwapInitiated', async (swapId, sourceChain, targetChain, amount, event) => {
      await this.handleCrossChainSwap(swapId, sourceChain, targetChain, amount, event);
    });

    // Poll for missed events every 5 minutes (300 seconds) to prevent RPC rate limiting
    // Reduced from 15s to avoid "429 Too Many Requests" errors from Arbitrum Sepolia RPC
    setInterval(() => this.pollForMissedEvents(), 300000);
  }

  /**
   * Stop listening to events
   */
  async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    if (this.vaultContract) {
      this.vaultContract.removeAllListeners();
    }

    if (this.bridgeContract) {
      this.bridgeContract.removeAllListeners();
    }

    this.isListening = false;
    securityLogger.info('🛑 Arbitrum Event Listener stopped', SecurityEventType.CROSS_CHAIN_VERIFICATION);
  }

  /**
   * Handle VaultCreated event
   */
  private async handleVaultCreated(vaultId: string, owner: string, unlockTime: bigint, amount: bigint, event: any): Promise<void> {
    securityLogger.info(`🔔 VaultCreated event detected: ${vaultId}`, SecurityEventType.VAULT_CREATION);
    securityLogger.info(`   Owner: ${owner}`, SecurityEventType.VAULT_CREATION);
    securityLogger.info(`   Unlock Time: ${new Date(Number(unlockTime) * 1000).toISOString()}`, SecurityEventType.VAULT_CREATION);
    securityLogger.info(`   Amount: ${ethers.formatEther(amount)} ETH`, SecurityEventType.VAULT_CREATION);

    const vaultEvent: ArbitrumVaultEvent = {
      eventName: 'VaultCreated',
      vaultId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        owner,
        unlockTime: Number(unlockTime),
        amount: amount.toString()
      }
    };

    this.emit('vault:created', vaultEvent);
  }

  /**
   * Handle VaultUnlocked event - CRITICAL for Trinity Protocol
   */
  private async handleVaultUnlocked(vaultId: string, timestamp: bigint, event: any): Promise<void> {
    securityLogger.info(`🔓 VaultUnlocked event detected: ${vaultId}`, SecurityEventType.VAULT_ACCESS);
    securityLogger.info(`   Unlock Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`, SecurityEventType.VAULT_ACCESS);
    securityLogger.info(`   🔺 Triggering Trinity Protocol verification...`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

    const vaultEvent: ArbitrumVaultEvent = {
      eventName: 'VaultUnlocked',
      vaultId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        unlockTimestamp: Number(timestamp)
      }
    };

    // Emit event for Trinity Protocol state sync
    this.emit('vault:unlocked', vaultEvent);
    this.emit('trinity:verify', vaultEvent); // Trigger cross-chain verification
  }

  /**
   * Handle VaultDeposit event
   */
  private async handleVaultDeposit(vaultId: string, depositor: string, amount: bigint, event: any): Promise<void> {
    securityLogger.info(`💰 VaultDeposit event detected: ${vaultId}`, SecurityEventType.VAULT_CREATION);
    securityLogger.info(`   Depositor: ${depositor}`, SecurityEventType.VAULT_CREATION);
    securityLogger.info(`   Amount: ${ethers.formatEther(amount)} ETH`, SecurityEventType.VAULT_CREATION);

    const vaultEvent: ArbitrumVaultEvent = {
      eventName: 'VaultDeposit',
      vaultId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        depositor,
        amount: amount.toString()
      }
    };

    this.emit('vault:deposit', vaultEvent);
  }

  /**
   * Handle VaultWithdrawal event
   */
  private async handleVaultWithdrawal(vaultId: string, recipient: string, amount: bigint, event: any): Promise<void> {
    securityLogger.info(`💸 VaultWithdrawal event detected: ${vaultId}`, SecurityEventType.VAULT_ACCESS);
    securityLogger.info(`   Recipient: ${recipient}`, SecurityEventType.VAULT_ACCESS);
    securityLogger.info(`   Amount: ${ethers.formatEther(amount)} ETH`, SecurityEventType.VAULT_ACCESS);

    const vaultEvent: ArbitrumVaultEvent = {
      eventName: 'VaultWithdrawal',
      vaultId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        recipient,
        amount: amount.toString()
      }
    };

    this.emit('vault:withdrawal', vaultEvent);
  }

  /**
   * Handle CrossChainVerificationRequested event
   */
  private async handleCrossChainVerificationRequest(vaultId: string, targetChain: string, stateHash: string, event: any): Promise<void> {
    securityLogger.info(`🔺 CrossChainVerificationRequested: ${vaultId} → ${targetChain}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   State Hash: ${stateHash}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

    const vaultEvent: ArbitrumVaultEvent = {
      eventName: 'CrossChainVerificationRequested',
      vaultId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        targetChain,
        stateHash
      }
    };

    this.emit('trinity:verification-requested', vaultEvent);
  }

  /**
   * Handle EmergencyRecoveryTriggered event
   */
  private async handleEmergencyRecovery(vaultId: string, initiator: string, timestamp: bigint, event: any): Promise<void> {
    securityLogger.warn(`🚨 EmergencyRecoveryTriggered: ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY);
    securityLogger.warn(`   Initiator: ${initiator}`, SecurityEventType.SUSPICIOUS_ACTIVITY);
    securityLogger.warn(`   Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`, SecurityEventType.SUSPICIOUS_ACTIVITY);

    const vaultEvent: ArbitrumVaultEvent = {
      eventName: 'EmergencyRecoveryTriggered',
      vaultId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        initiator,
        recoveryTimestamp: Number(timestamp)
      }
    };

    this.emit('emergency:recovery', vaultEvent);
  }

  /**
   * Handle HTLC Created event (atomic swaps)
   */
  private async handleHTLCCreated(htlcId: string, sender: string, amount: bigint, hashlock: string, timelock: bigint, event: any): Promise<void> {
    securityLogger.info(`🔒 HTLC Created: ${htlcId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   Sender: ${sender}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   Amount: ${ethers.formatEther(amount)} ETH`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   Timelock: ${new Date(Number(timelock) * 1000).toISOString()}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

    const htlcEvent: ArbitrumVaultEvent = {
      eventName: 'HTLCCreated',
      vaultId: htlcId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        sender,
        amount: amount.toString(),
        hashlock,
        timelock: Number(timelock)
      }
    };

    this.emit('htlc:created', htlcEvent);
  }

  /**
   * Handle CrossChainSwap event
   */
  private async handleCrossChainSwap(swapId: string, sourceChain: string, targetChain: string, amount: bigint, event: any): Promise<void> {
    securityLogger.info(`🔄 CrossChainSwap initiated: ${swapId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   Route: ${sourceChain} → ${targetChain}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   Amount: ${ethers.formatEther(amount)} tokens`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

    const swapEvent: ArbitrumVaultEvent = {
      eventName: 'CrossChainSwapInitiated',
      vaultId: swapId,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      timestamp: Date.now(),
      data: {
        sourceChain,
        targetChain,
        amount: amount.toString()
      }
    };

    this.emit('swap:initiated', swapEvent);
  }

  /**
   * Poll for missed events (backup mechanism)
   * RPC RATE LIMITING: Reduced frequency and added block range limits
   */
  private async pollForMissedEvents(): Promise<void> {
    if (!this.provider || !this.vaultContract) {
      return;
    }

    try {
      const currentBlock = await this.provider.getBlockNumber();
      
      if (currentBlock > this.lastProcessedBlock) {
        const fromBlock = this.lastProcessedBlock + 1;
        
        // RATE LIMITING: Query max 1000 blocks at a time to avoid RPC overload
        const toBlock = Math.min(currentBlock, fromBlock + 1000);

        // Query missed vault events (limit range to prevent RPC throttling)
        const vaultEvents = await this.vaultContract.queryFilter('*', fromBlock, toBlock);
        
        if (vaultEvents.length > 0) {
          securityLogger.info(`📥 Found ${vaultEvents.length} missed vault events (blocks ${fromBlock}-${toBlock})`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
        }

        this.lastProcessedBlock = toBlock; // Update to toBlock, not currentBlock
      }
    } catch (error: any) {
      // Handle 429 rate limiting errors gracefully
      if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
        securityLogger.warn('⚠️ RPC rate limited - skipping this poll cycle', SecurityEventType.CROSS_CHAIN_VERIFICATION);
      } else {
        securityLogger.error('Error polling for missed events', SecurityEventType.SYSTEM_ERROR, error);
      }
    }
  }

  /**
   * Query vault state (for manual verification)
   */
  async getVaultState(vaultId: string): Promise<any> {
    if (!this.vaultContract) {
      throw new Error('Vault contract not initialized');
    }

    try {
      const state = await this.vaultContract.getVaultState(vaultId);
      return {
        state: Number(state[0]),
        unlockTime: Number(state[1]),
        balance: state[2].toString(),
        isLocked: state[3]
      };
    } catch (error) {
      securityLogger.error(`Error querying vault state for ${vaultId}`, SecurityEventType.SYSTEM_ERROR, error);
      throw error;
    }
  }
}

export const arbitrumEventListener = new ArbitrumEventListener();
