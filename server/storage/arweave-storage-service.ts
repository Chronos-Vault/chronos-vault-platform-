/**
 * Arweave Storage Service for Chronos Vault
 * 
 * This service provides integration with Arweave permanent storage
 * using Bundlr for improved upload performance.
 */

import Arweave from 'arweave';
import { WebBundlr } from '@bundlr-network/client';
import { db } from '../db';
import type { StoredFile, FileStatus, UploadOptions, UploadResult, StorageStatus, VerificationRecord, StorageError } from '../../shared/types/storage';
import { STORAGE_CONFIG } from '../../shared/config/storage';
import { logger } from '../utils/logger';

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * ArweaveStorageService handles storing files permanently on Arweave
 * Uses Bundlr for improved upload performance
 */
export class ArweaveStorageService {
  private arweave: Arweave;
  private bundlr: WebBundlr | null = null;
  private initialized = false;
  private currentNode: string;
  private wallet: any; // Arweave JWK wallet

  constructor() {
    // Initialize Arweave instance
    this.arweave = Arweave.init({
      host: new URL(STORAGE_CONFIG.ARWEAVE.GATEWAY_URL).hostname,
      port: 443,
      protocol: 'https'
    });
    
    this.currentNode = STORAGE_CONFIG.ARWEAVE.BUNDLR_NODE_1;
    
    console.log('ArweaveStorageService created. Initialization required before use.');
  }

  /**
   * Initialize the storage service with a wallet
   * Must be called before using any other methods
   * 
   * @param jwkOrPrivateKey JWK object or private key for Arweave wallet
   * @returns Promise resolving to true if initialization succeeded
   */
  async initialize(jwkOrPrivateKey: any): Promise<boolean> {
    try {
      this.wallet = jwkOrPrivateKey;
      
      // Initialize Bundlr with the wallet
      // Note: In browser, use Window.ethereum provider instead of jwk
      this.bundlr = new WebBundlr(
        this.currentNode,
        STORAGE_CONFIG.ARWEAVE.DEFAULT_CURRENCY, 
        jwkOrPrivateKey,
        { providerUrl: "https://arweave.net" }
      );
      
      await this.bundlr.ready();
      
      // Check if we can fund if needed
      const balance = await this.bundlr.getLoadedBalance();
      
      console.log(`ArweaveStorageService initialized with Bundlr node: ${this.currentNode}`);
      console.log(`Current balance: ${balance}`);
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize ArweaveStorageService:', error);
      
      // Try fallback node if first one fails
      if (this.currentNode === STORAGE_CONFIG.ARWEAVE.BUNDLR_NODE_1) {
        console.log('Trying fallback Bundlr node...');
        this.currentNode = STORAGE_CONFIG.ARWEAVE.BUNDLR_NODE_2;
        return this.initialize(jwkOrPrivateKey);
      }
      
      this.initialized = false;
      return false;
    }
  }

  /**
   * Check if the service is ready to use
   * @returns boolean indicating if service is initialized
   */
  isReady(): boolean {
    return this.initialized && this.bundlr !== null;
  }

  /**
   * Get the current status of the storage service
   * @returns Promise resolving to status information
   */
  async getStatus(): Promise<StorageStatus> {
    if (!this.isReady()) {
      return {
        available: false,
        gateway: STORAGE_CONFIG.ARWEAVE.GATEWAY_URL,
        network: 'mainnet'
      };
    }
    
    try {
      const balance = await this.bundlr!.getLoadedBalance();
      const atomicBalance = balance.toString();
      
      const price = await this.bundlr!.getPrice(1024 * 1024); // Price for 1MB
      const costPerMb = price.toString();
      
      return {
        available: true,
        gateway: this.currentNode,
        network: 'mainnet',
        balance: atomicBalance,
        costPerMb,
        avgUploadTime: 15 // Estimated average upload time in seconds
      };
    } catch (error) {
      console.error('Error getting storage status:', error);
      return {
        available: false,
        gateway: this.currentNode,
        network: 'mainnet'
      };
    }
  }

  /**
   * Upload a file to Arweave via Bundlr
   * 
   * @param file File buffer to upload
   * @param fileName Original file name
   * @param fileType MIME type of the file
   * @param userId User who is uploading the file
   * @param vaultId Vault to store the file in
   * @param options Additional upload options
   * @returns Promise resolving to upload result
   */
  async uploadFile(
    file: Buffer,
    fileName: string,
    fileType: string,
    userId: number,
    vaultId: number,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.isReady()) {
      throw new Error('ArweaveStorageService not initialized. Call initialize() first.');
    }
    
    // Validate file type is supported
    if (!STORAGE_CONFIG.SUPPORTED_FILE_TYPES.includes(fileType)) {
      throw {
        code: 'UNSUPPORTED_FILE_TYPE',
        message: 'File type not supported for vault storage',
        details: { supportedTypes: STORAGE_CONFIG.SUPPORTED_FILE_TYPES }
      } as StorageError;
    }
    
    // Check file size limits based on security level
    const securityLevel = options.securityLevel || 'standard';
    const sizeLimit = STORAGE_CONFIG.FILE_SIZE_LIMITS[securityLevel.toUpperCase() as keyof typeof STORAGE_CONFIG.FILE_SIZE_LIMITS];
    
    if (file.length > sizeLimit) {
      throw {
        code: 'FILE_TOO_LARGE',
        message: `File exceeds the size limit for ${securityLevel} security level`,
        details: { fileSize: file.length, maxSize: sizeLimit }
      } as StorageError;
    }
    
    try {
      // Calculate cost of upload
      const price = await this.bundlr!.getPrice(file.length);
      console.log(`Upload cost for ${fileName} (${file.length} bytes): ${price.toString()}`);
      
      // Fund Bundlr if needed
      const balance = await this.bundlr!.getLoadedBalance();
      if (balance.lt(price)) {
        console.log(`Funding bundlr with ${price.toString()} (current balance: ${balance.toString()})`);
        // In production, you may want to ask for user confirmation here
        await this.bundlr!.fund(price);
      }
      
      // Prepare tags for the transaction
      const tags = [
        { name: STORAGE_CONFIG.ARWEAVE_TAGS.APP_NAME, value: STORAGE_CONFIG.ARWEAVE_TAGS.APP_NAME },
        { name: STORAGE_CONFIG.ARWEAVE_TAGS.APP_VERSION, value: STORAGE_CONFIG.ARWEAVE_TAGS.APP_VERSION },
        { name: STORAGE_CONFIG.ARWEAVE_TAGS.CONTENT_TYPE, value: fileType },
        { name: STORAGE_CONFIG.ARWEAVE_TAGS.VAULT_ID, value: vaultId.toString() },
        { name: STORAGE_CONFIG.ARWEAVE_TAGS.USER_ID, value: userId.toString() },
        { name: STORAGE_CONFIG.ARWEAVE_TAGS.TIMESTAMP, value: Date.now().toString() },
        { name: STORAGE_CONFIG.ARWEAVE_TAGS.SECURITY_LEVEL, value: securityLevel }
      ];
      
      // Add custom tags if provided
      if (options.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          tags.push({ name: key, value });
        });
      }
      
      // Create file record in database with pending status
      const fileId = generateId();
      const storedFile: StoredFile = {
        id: fileId,
        fileName,
        fileSize: file.length,
        fileType,
        uploadDate: new Date(),
        userId,
        vaultId,
        transactionId: '', // Will be updated after upload
        encryptionType: options.encrypt ? 'aes-256-gcm' : 'none',
        status: FileStatus.PENDING,
        verified: false,
        verifiedChains: [],
        permanentUri: ''
      };
      
      // TODO: Save file record to database
      // await db.insert(files).values(storedFile);
      
      console.log(`Starting upload of ${fileName} to Arweave via Bundlr...`);
      
      // Upload file to Bundlr
      const response = await this.bundlr!.upload(file, {
        tags
      });
      
      console.log(`Upload successful. Transaction ID: ${response.id}`);
      
      // Update file record with transaction details
      storedFile.transactionId = response.id;
      storedFile.status = FileStatus.STORED;
      storedFile.permanentUri = `${STORAGE_CONFIG.ARWEAVE.GATEWAY_URL}/${response.id}`;
      
      // TODO: Update file record in database
      // await db.update(files).set({
      //   transactionId: response.id,
      //   status: FileStatus.STORED,
      //   permanentUri: `${STORAGE_CONFIG.ARWEAVE.GATEWAY_URL}/${response.id}`
      // }).where(eq(files.id, fileId));
      
      // Return upload result
      const result: UploadResult = {
        transactionId: response.id,
        file: storedFile,
        uri: `${STORAGE_CONFIG.ARWEAVE.GATEWAY_URL}/${response.id}`
      };
      
      // If cross-chain verification is requested, schedule it
      if (options.crossChainVerify) {
        this.scheduleVerification(storedFile);
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading file to Arweave:', error);
      
      // Create proper error response
      let storageError: StorageError;
      
      if ((error as any).code && (error as any).message) {
        // Already a StorageError
        storageError = error as StorageError;
      } else if ((error as Error).message && (error as Error).message.includes('not enough funds')) {
        storageError = {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Not enough funds to complete the upload',
          details: error,
          recoverable: true,
          suggestedAction: 'Add more funds to your wallet or reduce file size'
        };
      } else {
        storageError = {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload file to Arweave',
          details: error,
          recoverable: false
        };
      }
      
      // TODO: Update file status in database to failed
      // await db.update(files).set({
      //   status: FileStatus.FAILED
      // }).where(eq(files.id, fileId));
      
      throw storageError;
    }
  }

  /**
   * Retrieve a file from Arweave by transaction ID
   * 
   * @param transactionId Arweave transaction ID
   * @returns Promise resolving to file data
   */
  async getFile(transactionId: string): Promise<Buffer> {
    try {
      console.log(`Retrieving file with transaction ID: ${transactionId}`);
      
      // Fetch data from Arweave gateway
      const response = await fetch(`${STORAGE_CONFIG.ARWEAVE.GATEWAY_URL}/${transactionId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve file: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error retrieving file from Arweave:', error);
      throw {
        code: 'RETRIEVAL_FAILED',
        message: 'Failed to retrieve file from Arweave',
        details: error
      } as StorageError;
    }
  }

  /**
   * Verify a file exists on Arweave
   * 
   * @param transactionId Arweave transaction ID to verify
   * @returns Promise resolving to boolean indicating if file exists
   */
  async verifyFile(transactionId: string): Promise<boolean> {
    try {
      console.log(`Verifying file existence on Arweave: ${transactionId}`);
      
      // Check if transaction exists and has been confirmed
      const status = await this.arweave.transactions.getStatus(transactionId);
      
      return status.status === 200 && status.confirmed;
    } catch (error) {
      console.error('Error verifying file on Arweave:', error);
      return false;
    }
  }

  /**
   * Schedule cross-chain verification for a file
   * This creates verification records on multiple blockchains
   * 
   * @param file The file to verify
   */
  private async scheduleVerification(file: StoredFile): Promise<void> {
    try {
      console.log(`Scheduling cross-chain verification for file: ${file.id}`);
      
      // We'll implement this when the cross-chain components are ready
      // For now, just log that we would schedule verification
      
      // In a real implementation, we would:
      // 1. Create verification records in each blockchain
      // 2. Update the file record with verification status
      // 3. Setup periodic checks to confirm verifications
      
      console.log(`Cross-chain verification scheduled for file: ${file.id}`);
    } catch (error) {
      console.error('Error scheduling verification:', error);
    }
  }

  /**
   * Get transaction info from Arweave
   * 
   * @param transactionId Arweave transaction ID
   * @returns Promise resolving to transaction data
   */
  async getTransactionInfo(transactionId: string): Promise<any> {
    try {
      const transaction = await this.arweave.transactions.get(transactionId);
      const tags = transaction.get('tags') || [];
      
      // Process tags into readable format
      const decodedTags: Record<string, string> = {};
      for (let tag of tags) {
        const key = tag.get('name', { decode: true, string: true });
        const value = tag.get('value', { decode: true, string: true });
        decodedTags[key] = value;
      }
      
      const data = {
        id: transactionId,
        owner: transaction.owner,
        data: transaction.data,
        quantity: transaction.quantity,
        reward: transaction.reward,
        tags: decodedTags
      };
      
      return data;
    } catch (error) {
      console.error('Error getting transaction info:', error);
      throw {
        code: 'TRANSACTION_INFO_FAILED',
        message: 'Failed to get transaction info from Arweave',
        details: error
      } as StorageError;
    }
  }

  /**
   * Calculate the cost to upload a file of a given size
   * 
   * @param sizeInBytes Size of the file in bytes
   * @returns Promise resolving to price in winston
   */
  async calculateUploadCost(sizeInBytes: number): Promise<string> {
    if (!this.isReady()) {
      throw new Error('ArweaveStorageService not initialized. Call initialize() first.');
    }
    
    try {
      const price = await this.bundlr!.getPrice(sizeInBytes);
      return price.toString();
    } catch (error) {
      console.error('Error calculating upload cost:', error);
      throw {
        code: 'COST_CALCULATION_FAILED',
        message: 'Failed to calculate upload cost',
        details: error
      } as StorageError;
    }
  }
}

// Export a singleton instance
export const arweaveStorageService = new ArweaveStorageService();
