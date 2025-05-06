/**
 * Types related to the Chronos Vault storage system
 */

// Represents an uploaded file in a vault
export interface StoredFile {
  id: string;              // Unique identifier
  fileName: string;        // Original file name
  fileSize: number;        // Size in bytes
  fileType: string;        // MIME type
  uploadDate: Date;        // When the file was uploaded
  userId: number;          // User who uploaded the file
  vaultId: number;         // Vault containing the file
  transactionId: string;   // Arweave transaction ID
  encryptionType: string;  // Type of encryption used
  status: FileStatus;      // Current status of the file
  verified: boolean;       // Whether file has been verified on-chain
  verifiedChains: string[]; // List of chains that have verified this file
  permanentUri: string;    // Permanent URI for the file
  metadata?: any;          // Optional additional metadata
}

// Status of a stored file
export enum FileStatus {
  PENDING = 'pending',     // Upload started but not complete
  PROCESSING = 'processing', // Upload complete, being processed
  STORED = 'stored',       // Successfully stored
  VERIFIED = 'verified',   // Verified across multiple chains
  FAILED = 'failed'        // Failed to store
}

// Upload configuration options
export interface UploadOptions {
  // Whether to encrypt the file (client-side encryption)
  encrypt?: boolean;
  // Custom encryption key (if null, a generated key will be used)
  encryptionKey?: string | null;
  // Additional tags to include with the upload
  tags?: Record<string, string>;
  // Security level to apply to the upload
  securityLevel?: 'standard' | 'enhanced' | 'maximum';
  // Whether to verify the upload across multiple chains
  crossChainVerify?: boolean;
  // Callback for tracking upload progress (0-100)
  onProgress?: (progress: number) => void;
}

// Result of a successful upload
export interface UploadResult {
  // Transaction ID on Arweave
  transactionId: string;
  // File details
  file: StoredFile;
  // URI where the file can be accessed
  uri: string;
  // Encryption details (if encrypted)
  encryption?: {
    type: string;
    // Encrypted encryption key (if applicable)
    encryptedKey?: string;
  };
  // Cross-chain verification details
  verification?: {
    verified: boolean;
    chains: string[];
    // Transaction IDs on other chains
    transactions: Record<string, string>;
  };
}

// Error returned by storage services
export interface StorageError {
  code: string;            // Error code
  message: string;         // Human-readable error message
  details?: any;           // Additional error details
  recoverable?: boolean;   // Whether the error is recoverable
  // Suggested action to recover (if recoverable)
  suggestedAction?: string;
}

// Status of the storage service
export interface StorageStatus {
  available: boolean;      // Whether the storage service is available
  gateway: string;         // Current gateway being used
  network: 'mainnet' | 'testnet'; // Current network
  balance?: string;       // Current balance (if applicable)
  // Estimated cost per MB (in the native token)
  costPerMb?: string;
  // Average upload time in seconds
  avgUploadTime?: number;
}

// Verification record for cross-chain verification
export interface VerificationRecord {
  id: string;              // Unique identifier
  fileId: string;          // ID of the verified file
  chain: string;           // Blockchain where verification occurred
  transactionId: string;   // Transaction ID on the blockchain
  timestamp: Date;         // When verification occurred
  blockNumber?: number;    // Block number of the verification
  status: 'pending' | 'confirmed' | 'failed'; // Status of verification
  // Who performed the verification (user or system)
  verifier: 'user' | 'system';
}
