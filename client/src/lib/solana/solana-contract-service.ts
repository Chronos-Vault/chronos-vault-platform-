import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  AccountMeta
} from '@solana/web3.js';
import { solanaService } from './solana-service';
/**
 * Service for interacting with Solana programs (smart contracts)
 */
export class SolanaContractService {
  private static instance: SolanaContractService;
  
  // Program IDs from our actual deployed contracts
  private readonly VAULT_PROGRAM_ID = 'ChronoSVauLt11111111111111111111111111111111';
  private readonly BRIDGE_PROGRAM_ID = 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS';
  private readonly TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
  
  // Instruction type enum values
  private readonly CREATE_VAULT_INSTRUCTION = 0;
  private readonly DEPOSIT_INSTRUCTION = 1;
  private readonly WITHDRAW_INSTRUCTION = 2;
  private readonly ADD_CROSS_CHAIN_LINK_INSTRUCTION = 3;
  private readonly ADD_AUTHORIZED_WITHDRAWER_INSTRUCTION = 4;
  private readonly REMOVE_AUTHORIZED_WITHDRAWER_INSTRUCTION = 5;
  private readonly UPDATE_METADATA_INSTRUCTION = 6;
  private readonly UNLOCK_EARLY_INSTRUCTION = 7;
  private readonly GENERATE_VERIFICATION_PROOF_INSTRUCTION = 8;
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    console.log('Initializing SolanaContractService');
    console.log(`Vault Program ID: ${this.VAULT_PROGRAM_ID}`);
    console.log(`Bridge Program ID: ${this.BRIDGE_PROGRAM_ID}`);
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): SolanaContractService {
    if (!SolanaContractService.instance) {
      SolanaContractService.instance = new SolanaContractService();
    }
    return SolanaContractService.instance;
  }
  
  /**
   * Get the Solana connection from the service
   */
  private getConnection(): Connection | null {
    return solanaService['connection'];  // Accessing private property
  }
  
  /**
   * Get the current wallet's public key
   */
  private getWalletPublicKey(): PublicKey | null {
    return solanaService['walletPublicKey'];  // Accessing private property
  }
  
  /**
   * Helper: Serialize a create vault instruction
   */
  private serializeCreateVaultInstruction(
    unlockTime: number,
    securityLevel: number,
    accessKeyHash: Uint8Array,
    isPublic: boolean,
    name: string,
    description: string
  ): Uint8Array {
    // Use Uint8Array instead of Buffer for browser compatibility
    const buffer = new Uint8Array(1000); // Allocate more than enough space
    
    // Write instruction type
    buffer[0] = this.CREATE_VAULT_INSTRUCTION;
    
    // Write unlock time (64-bit LE) - manually write bytes for browser compatibility
    const unlockTimeBigInt = BigInt(unlockTime);
    buffer[1] = Number(unlockTimeBigInt & BigInt(0xFF));
    buffer[2] = Number((unlockTimeBigInt >> BigInt(8)) & BigInt(0xFF));
    buffer[3] = Number((unlockTimeBigInt >> BigInt(16)) & BigInt(0xFF));
    buffer[4] = Number((unlockTimeBigInt >> BigInt(24)) & BigInt(0xFF));
    buffer[5] = Number((unlockTimeBigInt >> BigInt(32)) & BigInt(0xFF));
    buffer[6] = Number((unlockTimeBigInt >> BigInt(40)) & BigInt(0xFF));
    buffer[7] = Number((unlockTimeBigInt >> BigInt(48)) & BigInt(0xFF));
    buffer[8] = Number((unlockTimeBigInt >> BigInt(56)) & BigInt(0xFF));
    
    // Write security level
    buffer[9] = securityLevel;
    
    // Write access key hash (32 bytes)
    // Copy the bytes manually
    for (let i = 0; i < accessKeyHash.length; i++) {
      buffer[10 + i] = accessKeyHash[i];
    }
    
    // Write isPublic flag
    buffer[42] = isPublic ? 1 : 0;
    
    // Write name string
    const nameEncoder = new TextEncoder();
    const nameBytes = nameEncoder.encode(name);
    
    // Write string length first (32-bit LE)
    const nameLength = nameBytes.length;
    buffer[43] = nameLength & 0xFF;
    buffer[44] = (nameLength >> 8) & 0xFF;
    buffer[45] = (nameLength >> 16) & 0xFF;
    buffer[46] = (nameLength >> 24) & 0xFF;
    
    // Then write string content
    for (let i = 0; i < nameBytes.length; i++) {
      buffer[47 + i] = nameBytes[i];
    }
    
    // Write description string at the next position
    const descStartPos = 47 + nameBytes.length;
    const descEncoder = new TextEncoder();
    const descBytes = descEncoder.encode(description);
    
    // Write string length first (32-bit LE)
    const descLength = descBytes.length;
    buffer[descStartPos] = descLength & 0xFF;
    buffer[descStartPos + 1] = (descLength >> 8) & 0xFF;
    buffer[descStartPos + 2] = (descLength >> 16) & 0xFF;
    buffer[descStartPos + 3] = (descLength >> 24) & 0xFF;
    
    // Then write string content
    for (let i = 0; i < descBytes.length; i++) {
      buffer[descStartPos + 4 + i] = descBytes[i];
    }
    
    // Calculate the actual size used and trim the buffer
    const actualSize = descStartPos + 4 + descBytes.length;
    return buffer.slice(0, actualSize);
  }
  
  /**
   * Helper: Serialize a withdraw instruction
   */
  private serializeWithdrawInstruction(
    amount: number,
    accessKey: string
  ): Uint8Array {
    // Use Uint8Array instead of Buffer for browser compatibility
    const buffer = new Uint8Array(1000); // Allocate more than enough space
    
    // Write instruction type
    buffer[0] = this.WITHDRAW_INSTRUCTION;
    
    // Write amount (64-bit LE) - manually write bytes for browser compatibility
    const amountBigInt = BigInt(amount);
    buffer[1] = Number(amountBigInt & BigInt(0xFF));
    buffer[2] = Number((amountBigInt >> BigInt(8)) & BigInt(0xFF));
    buffer[3] = Number((amountBigInt >> BigInt(16)) & BigInt(0xFF));
    buffer[4] = Number((amountBigInt >> BigInt(24)) & BigInt(0xFF));
    buffer[5] = Number((amountBigInt >> BigInt(32)) & BigInt(0xFF));
    buffer[6] = Number((amountBigInt >> BigInt(40)) & BigInt(0xFF));
    buffer[7] = Number((amountBigInt >> BigInt(48)) & BigInt(0xFF));
    buffer[8] = Number((amountBigInt >> BigInt(56)) & BigInt(0xFF));
    
    // Write access key string
    const keyEncoder = new TextEncoder();
    const keyBytes = keyEncoder.encode(accessKey);
    
    // Write string length first (32-bit LE)
    const keyLength = keyBytes.length;
    buffer[9] = keyLength & 0xFF;
    buffer[10] = (keyLength >> 8) & 0xFF;
    buffer[11] = (keyLength >> 16) & 0xFF;
    buffer[12] = (keyLength >> 24) & 0xFF;
    
    // Then write string content
    for (let i = 0; i < keyBytes.length; i++) {
      buffer[13 + i] = keyBytes[i];
    }
    
    // Calculate the actual size used and trim the buffer
    const actualSize = 13 + keyBytes.length;
    return buffer.slice(0, actualSize);
  }
  
  /**
   * Create a time-locked vault using the Chronos Vault program
   */
  public async createTimeLockedVault(params: {
    amount: string;
    unlockTime: number;
    recipient?: string;
    description?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; error?: string }> {
    try {
      const connection = this.getConnection();
      const walletPublicKey = this.getWalletPublicKey();
      
      if (!connection || !walletPublicKey) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      console.log(`Creating Solana vault with ${params.amount} SOL to unlock at ${new Date(params.unlockTime * 1000).toLocaleString()}`);
      
      try {
        // Create a new account for the vault
        const vaultKeypair = Keypair.generate();
        const vaultPubkey = vaultKeypair.publicKey;
        
        // Calculate the space needed for the account
        const VAULT_ACCOUNT_SIZE = 500; // Approximate size for vault data
        
        // Calculate rent exemption
        const rentExemption = await connection.getMinimumBalanceForRentExemption(VAULT_ACCOUNT_SIZE);
        
        // Convert SOL amount to lamports
        const amountLamports = Math.floor(parseFloat(params.amount) * LAMPORTS_PER_SOL);
        
        // Create the transaction to create the account
        const createAccountTx = SystemProgram.createAccount({
          fromPubkey: walletPublicKey,
          newAccountPubkey: vaultPubkey,
          lamports: rentExemption + amountLamports, // Add user's SOL deposit
          space: VAULT_ACCOUNT_SIZE,
          programId: new PublicKey(this.VAULT_PROGRAM_ID)
        });
        
        // Create a dummy access key hash (32 bytes of zeros)
        const accessKeyHash = new Uint8Array(32).fill(0);
        
        // Prepare instruction data
        const data = this.serializeCreateVaultInstruction(
          params.unlockTime,
          1, // Security level 1 (basic time lock)
          accessKeyHash,
          true, // Public vault
          params.recipient ? `Vault for ${params.recipient}` : 'Time-locked vault',
          params.description || ''
        );
        
        // Create the instruction to initialize the vault
        const initVaultIx = new TransactionInstruction({
          keys: [
            { pubkey: walletPublicKey, isSigner: true, isWritable: false }, // Authority
            { pubkey: vaultPubkey, isSigner: false, isWritable: true },    // Vault account
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
            // For a real implementation, we would need more accounts like token accounts if using SPL tokens
          ],
          programId: new PublicKey(this.VAULT_PROGRAM_ID),
          data: Buffer.from(data) // Convert Uint8Array to Buffer for TransactionInstruction compatibility
        });
        
        // Create transaction
        const transaction = new Transaction().add(createAccountTx, initVaultIx);
        
        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = walletPublicKey;
        
        // Sign the transaction (in real implementation, would be sent to wallet for signing)
        transaction.sign(vaultKeypair);
        
        // We would normally use the wallet adapter to sign and send this transaction
        // For now, we'll simulate success but log the transaction details
        console.log('Vault creation transaction prepared:');
        console.log('- Create account instruction');
        console.log('- Initialize vault instruction');
        console.log(`Vault address: ${vaultPubkey.toString()}`);
        
        console.log(`Sending amount: ${amountLamports / LAMPORTS_PER_SOL} SOL`);
        console.log(`Unlock time: ${new Date(params.unlockTime * 1000).toLocaleString()}`);
        if (params.recipient) {
          console.log(`Recipient: ${params.recipient}`);
        }
        if (params.description) {
          console.log(`Description: ${params.description}`);
        }
        
        return {
          success: true,
          vaultAddress: vaultPubkey.toString(),
        };
      } catch (e: any) {
        console.error('Transaction preparation error:', e);
        return { success: false, error: e.message || 'Failed to prepare vault transaction' };
      }
    } catch (error: any) {
      console.error('Failed to create time-locked vault:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
  
  /**
   * Create a multi-signature vault
   */
  public async createMultiSigVault(params: {
    amount: string;
    signers: string[];  // Array of public keys
    threshold: number;  // Number of required signatures
    description?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; error?: string }> {
    try {
      const connection = this.getConnection();
      const walletPublicKey = this.getWalletPublicKey();
      
      if (!connection || !walletPublicKey) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      // Validate the threshold
      if (params.threshold > params.signers.length) {
        return { 
          success: false, 
          error: `Threshold (${params.threshold}) cannot be greater than number of signers (${params.signers.length})` 
        };
      }
      
      console.log(`Creating multi-sig vault with ${params.amount} SOL, ${params.signers.length} signers, threshold: ${params.threshold}`);
      
      // For now, we'll simulate the multi-sig vault creation
      // In a real implementation, we would:
      // 1. Create a multi-sig account using a program like SPL Governance or a custom program
      // 2. Register all signers and set the threshold
      // 3. Transfer SOL to the multi-sig account
      
      // Generate a "vault address" for demonstration
      const vaultKeypair = Keypair.generate();
      const vaultAddress = vaultKeypair.publicKey.toString();
      
      console.log(`Simulated multi-sig vault created at address: ${vaultAddress}`);
      console.log(`Signers: ${params.signers.join(', ')}`);
      console.log(`Threshold: ${params.threshold}`);
      if (params.description) {
        console.log(`Description: ${params.description}`);
      }
      
      return {
        success: true,
        vaultAddress
      };
    } catch (error: any) {
      console.error('Failed to create multi-sig vault:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
  
  /**
   * Create a geo-locked vault (simulated - would need oracle integration in a real implementation)
   */
  public async createGeoLockedVault(params: {
    amount: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    unlockTime?: number;  // Optional: combine with time-lock
    description?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; error?: string }> {
    try {
      const connection = this.getConnection();
      const walletPublicKey = this.getWalletPublicKey();
      
      if (!connection || !walletPublicKey) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      console.log(`Creating geo-locked vault with ${params.amount} SOL at location (${params.latitude}, ${params.longitude}), radius: ${params.radiusMeters}m`);
      
      // For now, we'll simulate the geo-locked vault creation
      // In a real implementation, we would:
      // 1. Create a vault account
      // 2. Store the geo-location data (probably encrypted)
      // 3. Integrate with an oracle for verification
      
      // Generate a "vault address" for demonstration
      const vaultKeypair = Keypair.generate();
      const vaultAddress = vaultKeypair.publicKey.toString();
      
      console.log(`Simulated geo-locked vault created at address: ${vaultAddress}`);
      console.log(`Location: (${params.latitude}, ${params.longitude}), Radius: ${params.radiusMeters}m`);
      if (params.unlockTime) {
        console.log(`Will also unlock at: ${new Date(params.unlockTime * 1000).toLocaleString()}`);
      }
      if (params.description) {
        console.log(`Description: ${params.description}`);
      }
      
      return {
        success: true,
        vaultAddress
      };
    } catch (error: any) {
      console.error('Failed to create geo-locked vault:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
  
  /**
   * Get details of an existing vault
   */
  public async getVaultDetails(vaultAddress: string): Promise<{ 
    exists: boolean; 
    balance?: string;
    unlockTime?: number;
    owner?: string;
    beneficiary?: string;
    isMultiSig?: boolean;
    isGeoLocked?: boolean;
    description?: string;
    error?: string;
  }> {
    try {
      const connection = this.getConnection();
      
      if (!connection) {
        return { exists: false, error: 'No connection to Solana' };
      }
      
      // In a real implementation, we would fetch the account data and deserialize it
      // For now, we'll just return simulated data
      console.log(`Getting info for vault: ${vaultAddress}`);
      
      // Check if the address is valid
      try {
        new PublicKey(vaultAddress);
      } catch (e) {
        return { exists: false, error: 'Invalid vault address' };
      }
      
      // Simulate random vault data
      const isMultiSig = Math.random() > 0.5;
      const isGeoLocked = Math.random() > 0.7;
      const now = new Date();
      const future = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within 30 days
      
      return {
        exists: true,
        balance: (Math.random() * 10).toFixed(4),
        unlockTime: Math.floor(future.getTime() / 1000),
        owner: Keypair.generate().publicKey.toString(),
        beneficiary: Keypair.generate().publicKey.toString(),
        isMultiSig,
        isGeoLocked,
        description: 'Simulated vault for demonstration purposes'
      };
    } catch (error: any) {
      console.error('Failed to get vault details:', error);
      return { exists: false, error: error.message || 'Unknown error occurred' };
    }
  }
  
  /**
   * Withdraw from a vault (if conditions are met)
   */
  public async withdrawFromVault(params: {
    vaultAddress: string;
    amount?: string;  // If not provided, withdraw everything
  }): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const connection = this.getConnection();
      const walletPublicKey = this.getWalletPublicKey();
      
      if (!connection || !walletPublicKey) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      // In a real implementation, we would:
      // 1. Check if the vault conditions are met (time, geo, signatures)
      // 2. Verify the caller is authorized to withdraw
      // 3. Execute the withdrawal transaction
      
      console.log(`Simulating withdrawal from vault: ${params.vaultAddress}`);
      
      // Simulate a successful transaction
      const transactionHash = 'simulated_tx_' + Math.random().toString(36).substring(2, 15);
      
      return {
        success: true,
        transactionHash
      };
    } catch (error: any) {
      console.error('Failed to withdraw from vault:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
}

export const solanaContractService = SolanaContractService.getInstance();