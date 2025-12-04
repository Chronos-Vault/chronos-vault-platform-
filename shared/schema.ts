import { pgTable, text, serial, integer, timestamp, boolean, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  email: text("email"),
  subscriptionStatus: text("subscription_status"),
  metadata: jsonb("metadata"),
});

// Wallet authentication table for multi-chain signature verification
export const walletAuth = pgTable("wallet_auth", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  blockchain: text("blockchain").notNull(), // ethereum, solana, ton
  publicKey: text("public_key"),
  nonce: text("nonce").notNull(),
  signature: text("signature"),
  signedMessage: text("signed_message"),
  isVerified: boolean("is_verified").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsed: timestamp("last_used"),
  status: text("status").notNull().default("pending"), // pending, verified, expired, revoked
  metadata: jsonb("metadata"),
});

// Session management for authenticated wallets
export const walletSessions = pgTable("wallet_sessions", {
  id: serial("id").primaryKey(),
  walletAuthId: integer("wallet_auth_id").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  walletAddress: text("wallet_address").notNull(),
  blockchain: text("blockchain").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
});

export const vaults = pgTable("vaults", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  description: text("description"),
  vaultType: text("vault_type").notNull(), // timelock, multisig, crosschain_fragment, etc.
  assetType: text("asset_type").notNull(),
  assetAmount: text("asset_amount").notNull(),
  timeLockPeriod: integer("time_lock_period").notNull(), // in days
  createdAt: timestamp("created_at").notNull().defaultNow(),
  unlockDate: timestamp("unlock_date").notNull(),
  isLocked: boolean("is_locked").notNull().default(true),
  // Adding metadata field for additional vault configuration
  metadata: jsonb("metadata"),
  // Primary blockchain for this vault - user's choice!
  primaryChain: text("primary_chain").notNull().default("ethereum"), // ethereum, solana, ton
  // Cross-chain contract addresses
  ethereumContractAddress: text("ethereum_contract_address"),
  solanaContractAddress: text("solana_contract_address"),
  tonContractAddress: text("ton_contract_address"),
  // Security and cross-chain settings
  securityLevel: integer("security_level").default(1), // Level 1-5
  crossChainEnabled: boolean("cross_chain_enabled").default(false),
  privacyEnabled: boolean("privacy_enabled").default(false),
  // Fee tracking and chain selection metadata
  estimatedCreationFee: text("estimated_creation_fee"), // Fee in native token (ETH/SOL/TON)
  estimatedCreationFeeUsd: text("estimated_creation_fee_usd"), // Fee in USD for comparison
  actualCreationFee: text("actual_creation_fee"), // Actual fee paid after creation
  chainSelectionReason: text("chain_selection_reason"), // Why user picked this chain
  trinityRoles: jsonb("trinity_roles"), // Dynamic Trinity Protocol roles: {primary: "ethereum", verify1: "solana", verify2: "ton"}
  // Trinity Protocol verification status
  trinityVerificationStatus: text("trinity_verification_status").default("pending"), // pending, verified, failed
  trinityVerificationHash: text("trinity_verification_hash"), // Cross-chain verification proof hash
  // Transaction hashes for vault creation on each chain
  ethereumTxHash: text("ethereum_tx_hash"),
  solanaTxHash: text("solana_tx_hash"),
  tonTxHash: text("ton_tx_hash"),
  // Multi-sig specific fields
  signaturesRequired: integer("signatures_required"), // For multi-sig vaults
  signerAddresses: jsonb("signer_addresses"), // Array of signer wallet addresses
  // Fragment vault specific fields
  fragmentDistribution: jsonb("fragment_distribution"), // How fragments are distributed across chains
  fragmentRecoveryThreshold: integer("fragment_recovery_threshold"), // Minimum fragments needed for recovery
});

export const beneficiaries = pgTable("beneficiaries", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull(),
  name: text("name").notNull(),
  walletAddress: text("wallet_address").notNull(),
  share: integer("share").notNull(), // percentage share of the vault
});

// New table for media attachments
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(), // MIME type
  fileSize: integer("file_size").notNull(), // Size in bytes
  description: text("description"),
  storageKey: text("storage_key").notNull(), // URL or key for storage
  thumbnailUrl: text("thumbnail_url"), // For images/videos
  isEncrypted: boolean("is_encrypted").notNull().default(true),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  metadata: jsonb("metadata"), // For additional file metadata
});

// New table for blockchain contract deployments
export const chainContracts = pgTable("chain_contracts", {
  id: serial("id").primaryKey(),
  blockchain: text("blockchain").notNull(), // ethereum, solana, ton
  contractType: text("contract_type").notNull(), // vault, bridge, factory
  contractName: text("contract_name").notNull(),
  contractAddress: text("contract_address").notNull(),
  network: text("network").notNull(), // mainnet, testnet, devnet
  deployedAt: timestamp("deployed_at").notNull().defaultNow(),
  abiReference: text("abi_reference"),
  deploymentTx: text("deployment_tx"),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata"),
});

// Chain fee estimates for real-time comparison
export const chainFeeEstimates = pgTable("chain_fee_estimates", {
  id: serial("id").primaryKey(),
  blockchain: text("blockchain").notNull(), // ethereum, solana, ton
  operationType: text("operation_type").notNull(), // vault_creation, withdrawal, transfer, swap
  estimatedFeeNative: text("estimated_fee_native").notNull(), // Fee in native token
  estimatedFeeUsd: text("estimated_fee_usd").notNull(), // Fee in USD
  gasPrice: text("gas_price"), // Current gas price (for Ethereum)
  networkCongestion: text("network_congestion"), // low, medium, high
  estimatedTime: integer("estimated_time"), // Estimated confirmation time in seconds
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  metadata: jsonb("metadata"), // Additional chain-specific data
});

// New table for cross-chain transactions
export const crossChainTransactions = pgTable("cross_chain_transactions", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull(),
  sourceChain: text("source_chain").notNull(),
  targetChain: text("target_chain").notNull(),
  sourceTxHash: text("source_tx_hash").notNull(),
  targetTxHash: text("target_tx_hash"),
  status: text("status").notNull(), // pending, completed, failed
  amount: text("amount"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  errorDetails: text("error_details"),
  metadata: jsonb("metadata"),
});

// New table for security incidents
export const securityIncidents = pgTable("security_incidents", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id"),
  incidentType: text("incident_type").notNull(), // anomaly, attack, suspicious_activity
  severity: text("severity").notNull(), // low, medium, high, critical
  blockchain: text("blockchain"),
  description: text("description").notNull(),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  aiConfidence: integer("ai_confidence"), // 0-100 confidence percentage
  transactionHash: text("transaction_hash"),
  resolutionDetails: text("resolution_details"),
  metadata: jsonb("metadata"),
});

// New table for multi-signature requests
export const signatureRequests = pgTable("signature_requests", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull(),
  requestType: text("request_type").notNull(), // withdraw, transfer, settings_change
  requesterAddress: text("requester_address").notNull(),
  requesterName: text("requester_name"),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, approved, executed, rejected, expired
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  executedAt: timestamp("executed_at"),
  threshold: integer("threshold").notNull(), // Number of signatures required
  metadata: jsonb("metadata"), // Additional request details
});

// Table for signature approvals on multi-sig requests
export const signatures = pgTable("signatures", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull(),
  signerAddress: text("signer_address").notNull(),
  signerName: text("signer_name"),
  signatureData: text("signature_data").notNull(), // Actual blockchain signature
  signedAt: timestamp("signed_at").notNull().defaultNow(),
  weight: integer("weight").default(1), // Signature weight for weighted voting
  metadata: jsonb("metadata"), // Additional signature metadata
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  email: true,
  subscriptionStatus: true,
  metadata: true,
});

export const insertWalletAuthSchema = createInsertSchema(walletAuth)
  .pick({
    userId: true,
    walletAddress: true,
    blockchain: true,
    publicKey: true,
    nonce: true,
    signature: true,
    signedMessage: true,
    isVerified: true,
    expiresAt: true,
    status: true,
    metadata: true,
  })
  .extend({
    expiresAt: z.union([z.string(), z.date()])
      .transform(val => {
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format for expiresAt');
          }
          return date;
        }
        return new Date();
      })
  });

export const insertWalletSessionSchema = createInsertSchema(walletSessions)
  .pick({
    walletAuthId: true,
    sessionToken: true,
    walletAddress: true,
    blockchain: true,
    isActive: true,
    expiresAt: true,
    ipAddress: true,
    userAgent: true,
    metadata: true,
  })
  .extend({
    expiresAt: z.union([z.string(), z.date()])
      .transform(val => {
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format for expiresAt');
          }
          return date;
        }
        return new Date();
      })
  });

export const insertVaultSchema = createInsertSchema(vaults)
  .pick({
    userId: true,
    name: true,
    description: true,
    vaultType: true,
    assetType: true,
    assetAmount: true,
    timeLockPeriod: true,
    unlockDate: true,
    metadata: true,
    primaryChain: true,
    ethereumContractAddress: true,
    solanaContractAddress: true,
    tonContractAddress: true,
    securityLevel: true,
    crossChainEnabled: true,
    privacyEnabled: true,
    estimatedCreationFee: true,
    estimatedCreationFeeUsd: true,
    actualCreationFee: true,
    chainSelectionReason: true,
    trinityRoles: true,
    trinityVerificationStatus: true,
    trinityVerificationHash: true,
    ethereumTxHash: true,
    solanaTxHash: true,
    tonTxHash: true,
    signaturesRequired: true,
    signerAddresses: true,
    fragmentDistribution: true,
    fragmentRecoveryThreshold: true,
  })
  .extend({
    // Match database schema where assetAmount is a text field
    assetAmount: z.union([z.string(), z.number()])
      .transform(val => typeof val === 'string' ? val : String(val)),
    timeLockPeriod: z.union([z.string(), z.number()])
      .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
    securityLevel: z.union([z.string(), z.number(), z.null()])
      .optional()
      .transform(val => {
        if (val === null || val === undefined) return null;
        return typeof val === 'string' ? parseInt(val, 10) : val;
      }),
    // Accept string, date, or ISO date string for unlockDate
    unlockDate: z.union([z.string(), z.date()])
      .transform(val => {
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format for unlockDate');
          }
          return date;
        }
        return new Date();
      })
  });

export const insertBeneficiarySchema = createInsertSchema(beneficiaries).pick({
  vaultId: true,
  name: true,
  walletAddress: true,
  share: true,
});

export const insertAttachmentSchema = createInsertSchema(attachments).pick({
  vaultId: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  description: true,
  storageKey: true,
  thumbnailUrl: true,
  isEncrypted: true,
  metadata: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVault = z.infer<typeof insertVaultSchema>;
export type Vault = typeof vaults.$inferSelect;

export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type Beneficiary = typeof beneficiaries.$inferSelect;

export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;
export type Attachment = typeof attachments.$inferSelect;

// New schemas for chain contracts and cross-chain transactions
export const insertChainContractSchema = createInsertSchema(chainContracts).pick({
  blockchain: true,
  contractType: true,
  contractName: true,
  contractAddress: true,
  network: true,
  abiReference: true,
  deploymentTx: true,
  isActive: true,
  metadata: true,
});

export const insertChainFeeEstimateSchema = createInsertSchema(chainFeeEstimates).pick({
  blockchain: true,
  operationType: true,
  estimatedFeeNative: true,
  estimatedFeeUsd: true,
  gasPrice: true,
  networkCongestion: true,
  estimatedTime: true,
  metadata: true,
});

export const insertCrossChainTransactionSchema = createInsertSchema(crossChainTransactions).pick({
  vaultId: true,
  sourceChain: true,
  targetChain: true,
  sourceTxHash: true,
  targetTxHash: true,
  status: true,
  amount: true,
  errorDetails: true,
  metadata: true,
});

export const insertSecurityIncidentSchema = createInsertSchema(securityIncidents).pick({
  vaultId: true,
  incidentType: true,
  severity: true,
  blockchain: true,
  description: true,
  aiConfidence: true,
  transactionHash: true,
  resolutionDetails: true,
  metadata: true,
});

export type InsertChainContract = z.infer<typeof insertChainContractSchema>;
export type ChainContract = typeof chainContracts.$inferSelect;

export type InsertChainFeeEstimate = z.infer<typeof insertChainFeeEstimateSchema>;
export type ChainFeeEstimate = typeof chainFeeEstimates.$inferSelect;

export type InsertCrossChainTransaction = z.infer<typeof insertCrossChainTransactionSchema>;
export type CrossChainTransaction = typeof crossChainTransactions.$inferSelect;

export type InsertSecurityIncident = z.infer<typeof insertSecurityIncidentSchema>;
export type SecurityIncident = typeof securityIncidents.$inferSelect;

// Add insert schemas for signature requests and signatures
export const insertSignatureRequestSchema = createInsertSchema(signatureRequests)
  .pick({
    vaultId: true,
    requestType: true,
    requesterAddress: true,
    requesterName: true,
    description: true,
    status: true,
    expiresAt: true,
    threshold: true,
    metadata: true,
  })
  .extend({
    // Accept string, date, or ISO date string for expiresAt
    expiresAt: z.union([z.string(), z.date()])
      .transform(val => {
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format for expiresAt');
          }
          return date;
        }
        return new Date();
      })
  });

export const insertSignatureSchema = createInsertSchema(signatures).pick({
  requestId: true,
  signerAddress: true,
  signerName: true,
  signatureData: true,
  weight: true,
  metadata: true,
});

export type InsertSignatureRequest = z.infer<typeof insertSignatureRequestSchema>;
export type SignatureRequest = typeof signatureRequests.$inferSelect;

export type InsertSignature = z.infer<typeof insertSignatureSchema>;
export type Signature = typeof signatures.$inferSelect;

// New wallet system tables
export const walletConnections = pgTable("wallet_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletType: varchar("wallet_type", { length: 50 }).notNull(),
  walletAddress: varchar("wallet_address", { length: 100 }).notNull(),
  blockchain: varchar("blockchain", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  signature: text("signature"),
  message: text("message"),
  connectedAt: timestamp("connected_at").defaultNow(),
  lastUsed: timestamp("last_used").defaultNow(),
});

export const newWalletSessions = pgTable("new_wallet_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  walletConnectionId: integer("wallet_connection_id").references(() => walletConnections.id),
  userId: integer("user_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newWalletAuthAttempts = pgTable("new_wallet_auth_attempts", {
  id: serial("id").primaryKey(),
  walletAddress: varchar("wallet_address", { length: 100 }).notNull(),
  walletType: varchar("wallet_type", { length: 50 }).notNull(),
  blockchain: varchar("blockchain", { length: 50 }).notNull(),
  nonce: varchar("nonce", { length: 100 }).notNull(),
  message: text("message").notNull(),
  signature: text("signature"),
  isVerified: boolean("is_verified").default(false),
  attemptedAt: timestamp("attempted_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// New wallet connection types
export type NewWalletConnection = typeof walletConnections.$inferSelect;
export type InsertNewWalletConnection = typeof walletConnections.$inferInsert;
export type NewWalletSession = typeof newWalletSessions.$inferSelect;
export type InsertNewWalletSession = typeof newWalletSessions.$inferInsert;
export type NewWalletAuthAttempt = typeof newWalletAuthAttempts.$inferSelect;
export type InsertNewWalletAuthAttempt = typeof newWalletAuthAttempts.$inferInsert;

// Zod schemas for new wallet system
export const insertNewWalletConnectionSchema = createInsertSchema(walletConnections);
export const insertNewWalletSessionSchema = createInsertSchema(newWalletSessions);
export const insertNewWalletAuthAttemptSchema = createInsertSchema(newWalletAuthAttempts);

// Explorer types for the Vault Explorer feature
export type BlockchainType = 'ETH' | 'SOL' | 'TON';
export type VaultStatus = 'active' | 'locked' | 'unlocked' | 'pending';
export type SecurityLevel = 'standard' | 'enhanced' | 'maximum';
export type GeoBoundaryType = 'circle' | 'polygon' | 'country';

export interface VaultInfo {
  id: string;
  name: string;
  owner: string;
  blockchain: BlockchainType;
  status: VaultStatus;
  unlockDate: Date | null;
  value: string;
  txHash: string;
  securityLevel: SecurityLevel;
  createdAt: Date;
}

export interface ExplorerStats {
  totalVaults: number;
  byChain: {
    ETH: number;
    SOL: number;
    TON: number;
  };
  byStatus: {
    active: number;
    locked: number;
    unlocked: number;
    pending: number;
  };
  totalValue: {
    ETH: string;
    SOL: string;
    TON: string;
  };
}

// GeoVault database schema and types
export const geoVaults = pgTable("geo_vaults", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  boundaryType: text("boundary_type").notNull(), // circle, polygon, country
  coordinates: jsonb("coordinates").notNull(), // Array of lat/long points
  radius: integer("radius"), // For circle boundaries, in meters
  countryCode: text("country_code"), // For country boundaries
  minAccuracy: integer("min_accuracy"), // Minimum GPS accuracy required in meters
  requiresRealTimeVerification: boolean("requires_real_time_verification").default(false),
  multiFactorUnlock: boolean("multi_factor_unlock").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  metadata: jsonb("metadata"),
});

// Access logs for geo vaults
export const geoAccessLogs = pgTable("geo_access_logs", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull(),
  userId: integer("user_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  accuracy: integer("accuracy"),
  success: boolean("success").notNull(),
  failureReason: text("failure_reason"),
  deviceInfo: jsonb("device_info"),
});

// Insert schemas for geo vaults
export const insertGeoVaultSchema = createInsertSchema(geoVaults)
  .pick({
    userId: true,
    name: true,
    description: true,
    boundaryType: true,
    coordinates: true,
    radius: true,
    countryCode: true,
    minAccuracy: true,
    requiresRealTimeVerification: true,
    multiFactorUnlock: true,
    metadata: true,
  })
  .extend({
    // Ensure coordinates is a proper array
    coordinates: z.array(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        accuracy: z.number().optional(),
        timestamp: z.number().optional(),
      })
    ),
  });

export const insertGeoAccessLogSchema = createInsertSchema(geoAccessLogs)
  .pick({
    vaultId: true,
    userId: true,
    latitude: true,
    longitude: true,
    accuracy: true,
    success: true,
    failureReason: true,
    deviceInfo: true,
  });

export type InsertGeoVault = z.infer<typeof insertGeoVaultSchema>;
export type GeoVault = typeof geoVaults.$inferSelect;

export type InsertGeoAccessLog = z.infer<typeof insertGeoAccessLogSchema>;
export type GeoAccessLog = typeof geoAccessLogs.$inferSelect;

// GeoVault settings type
export interface GeoVaultSettings {
  userId: number;
  boundaryType: GeoBoundaryType;
  coordinates: Array<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
  }>;
  radius?: number; // For circle boundaries
  countryCode?: string; // For country boundaries
  minAccuracy?: number;
  requiresRealTimeVerification: boolean;
  multiFactorUnlock: boolean;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Device management schema and types
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  deviceName: text("device_name").notNull(),
  deviceId: text("device_id").notNull().unique(),
  deviceType: text("device_type").notNull(), // mobile, tablet, desktop, hardware
  operatingSystem: text("operating_system"),
  browserInfo: text("browser_info"),
  lastIpAddress: text("last_ip_address"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  status: text("status").notNull().default("pending"), // pending, active, revoked, suspended
  trustScore: integer("trust_score").default(50), // 0-100 indicating level of trust
  isTrusted: boolean("is_trusted").default(false),
  isCurrent: boolean("is_current").default(false),
  publicKey: text("public_key"), // For device cryptographic auth
  authMethod: text("auth_method").default("password"), // password, biometric, hardware, multisig
  tonContractAddress: text("ton_contract_address"), // Contract verifying this device
  metadata: jsonb("metadata"),
});

// Device authorization logs
export const deviceAuthLogs = pgTable("device_auth_logs", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  userId: integer("user_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  action: text("action").notNull(), // login, logout, verify, revoke, recover
  success: boolean("success").notNull(),
  ipAddress: text("ip_address"),
  location: text("location"),
  failureReason: text("failure_reason"),
  riskScore: integer("risk_score"), // 0-100 indicating risk level
  chainVerification: jsonb("chain_verification"), // TON/ETH/SOL verification details
  metadata: jsonb("metadata"),
});

// Multi-chain device verifications
export const deviceVerifications = pgTable("device_verifications", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  blockchain: text("blockchain").notNull(), // ton, ethereum, solana
  contractAddress: text("contract_address").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  verificationData: text("verification_data").notNull(), // Cryptographic proof
  signatureData: text("signature_data").notNull(),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, failed, expired
  expiresAt: timestamp("expires_at"),
  metadata: jsonb("metadata"),
});

// Recovery keys for device recovery
export const recoveryKeys = pgTable("recovery_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  keyHash: text("key_hash").notNull(), // Hashed recovery key
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  usedAt: timestamp("used_at"),
  isUsed: boolean("is_used").default(false),
  deviceId: integer("device_id"), // Device that was recovered (if any)
  metadata: jsonb("metadata"),
});

// Insert schemas for device management
export const insertDeviceSchema = createInsertSchema(devices)
  .pick({
    userId: true,
    deviceName: true,
    deviceId: true,
    deviceType: true,
    operatingSystem: true,
    browserInfo: true,
    lastIpAddress: true,
    status: true,
    authMethod: true,
    publicKey: true,
    tonContractAddress: true,
    metadata: true,
  });

export const insertDeviceAuthLogSchema = createInsertSchema(deviceAuthLogs)
  .pick({
    deviceId: true,
    userId: true,
    action: true,
    success: true,
    ipAddress: true,
    location: true,
    failureReason: true,
    riskScore: true,
    chainVerification: true,
    metadata: true,
  });

export const insertDeviceVerificationSchema = createInsertSchema(deviceVerifications)
  .pick({
    deviceId: true,
    blockchain: true,
    contractAddress: true,
    transactionHash: true,
    verificationData: true,
    signatureData: true,
    verificationStatus: true,
    expiresAt: true,
    metadata: true,
  })
  .extend({
    // Handle date conversion for expiresAt
    expiresAt: z.union([z.string(), z.date(), z.null()])
      .transform(val => {
        if (val === null) return null;
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format for expiresAt');
          }
          return date;
        }
        return new Date();
      }).nullable(),
  });

export const insertRecoveryKeySchema = createInsertSchema(recoveryKeys)
  .pick({
    userId: true,
    keyHash: true,
    expiresAt: true,
    deviceId: true,
    metadata: true,
  })
  .extend({
    // Handle date conversion for expiresAt
    expiresAt: z.union([z.string(), z.date(), z.null()])
      .transform(val => {
        if (val === null) return null;
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format for expiresAt');
          }
          return date;
        }
        return new Date();
      }).nullable(),
  });

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

export type InsertDeviceAuthLog = z.infer<typeof insertDeviceAuthLogSchema>;
export type DeviceAuthLog = typeof deviceAuthLogs.$inferSelect;

export type InsertDeviceVerification = z.infer<typeof insertDeviceVerificationSchema>;
export type DeviceVerification = typeof deviceVerifications.$inferSelect;

export type InsertRecoveryKey = z.infer<typeof insertRecoveryKeySchema>;
export type RecoveryKey = typeof recoveryKeys.$inferSelect;

// Wallet Integration API Tables
export const walletRegistrations = pgTable("wallet_registrations", {
  id: serial("id").primaryKey(),
  walletId: text("wallet_id").notNull().unique(),
  walletName: text("wallet_name").notNull(),
  developerAddress: text("developer_address").notNull(),
  callbackUrl: text("callback_url").notNull(),
  apiKey: text("api_key").notNull().unique(),
  apiSecret: text("api_secret").notNull(),
  permissions: jsonb("permissions").notNull(),
  rateLimits: jsonb("rate_limits").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Removed duplicate walletSessions - using the one defined earlier

export const walletVaults = pgTable("wallet_vaults", {
  id: serial("id").primaryKey(),
  vaultId: text("vault_id").notNull().unique(),
  walletId: text("wallet_id").notNull(),
  userAddress: text("user_address").notNull(),
  name: text("name").notNull(),
  vaultType: text("vault_type").notNull(),
  securityLevel: text("security_level").notNull(),
  securityScore: integer("security_score").default(99),
  estimatedAttackCost: text("estimated_attack_cost"),
  assets: jsonb("assets").notNull(),
  timeLock: jsonb("time_lock"),
  beneficiaries: jsonb("beneficiaries"),
  vaultAddresses: jsonb("vault_addresses").notNull(),
  transactionHashes: jsonb("transaction_hashes"),
  status: text("status").default("active"),
  totalValueUsd: text("total_value_usd"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  metadata: jsonb("metadata"),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  verificationId: text("verification_id").notNull(),
  walletId: text("wallet_id").notNull(),
  userAddress: text("user_address").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: text("amount").notNull(),
  tokenAddress: text("token_address"),
  chain: text("chain").notNull(),
  riskScore: integer("risk_score"),
  riskLevel: text("risk_level"),
  aiAnalysis: jsonb("ai_analysis"),
  trinityVerification: jsonb("trinity_verification"),
  status: text("status").default("pending"),
  trinityHashes: jsonb("trinity_hashes"),
  estimatedGas: jsonb("estimated_gas"),
  priority: text("priority"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata"),
});

export const walletSecurityAlerts = pgTable("wallet_security_alerts", {
  id: serial("id").primaryKey(),
  alertId: text("alert_id").notNull().unique(),
  walletId: text("wallet_id").notNull(),
  userAddress: text("user_address"),
  vaultId: text("vault_id"),
  alertType: text("alert_type").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  aiAnalysis: jsonb("ai_analysis"),
  autoActionsTaken: jsonb("auto_actions_taken"),
  affectedVault: text("affected_vault"),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  metadata: jsonb("metadata"),
});

export const walletWebhooks = pgTable("wallet_webhooks", {
  id: serial("id").primaryKey(),
  webhookId: text("webhook_id").notNull().unique(),
  walletId: text("wallet_id").notNull(),
  url: text("url").notNull(),
  events: jsonb("events").notNull(),
  secret: text("secret"),
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  successCount: integer("success_count").default(0),
  failureCount: integer("failure_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Insert schemas for wallet integration
export const insertWalletRegistrationSchema = createInsertSchema(walletRegistrations).pick({
  walletId: true,
  walletName: true,
  developerAddress: true,
  callbackUrl: true,
  apiKey: true,
  apiSecret: true,
  permissions: true,
  rateLimits: true,
  isActive: true,
});

// Removed duplicate insertWalletSessionSchema - using the one defined earlier

export const insertWalletVaultSchema = createInsertSchema(walletVaults).pick({
  vaultId: true,
  walletId: true,
  userAddress: true,
  name: true,
  vaultType: true,
  securityLevel: true,
  securityScore: true,
  estimatedAttackCost: true,
  assets: true,
  timeLock: true,
  beneficiaries: true,
  vaultAddresses: true,
  transactionHashes: true,
  status: true,
  totalValueUsd: true,
  metadata: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).pick({
  transactionId: true,
  verificationId: true,
  walletId: true,
  userAddress: true,
  fromAddress: true,
  toAddress: true,
  amount: true,
  tokenAddress: true,
  chain: true,
  riskScore: true,
  riskLevel: true,
  aiAnalysis: true,
  trinityVerification: true,
  status: true,
  trinityHashes: true,
  estimatedGas: true,
  priority: true,
  metadata: true,
});

// Multi-signature wallet management
export const multiSigWallets = pgTable("multi_sig_wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletId: text("wallet_id").notNull().unique(),
  name: text("name").notNull(),
  network: text("network").notNull(), // ethereum, solana, ton
  address: text("address").notNull(),
  requiredSignatures: integer("required_signatures").notNull(),
  totalSigners: integer("total_signers").notNull(),
  signers: jsonb("signers").notNull(), // Array of signer addresses and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  metadata: jsonb("metadata"),
});

export const insertMultiSigWalletSchema = createInsertSchema(multiSigWallets).pick({
  userId: true,
  walletId: true,
  name: true,
  network: true,
  address: true,
  requiredSignatures: true,
  totalSigners: true,
  signers: true,
  isActive: true,
  metadata: true,
});

export type InsertMultiSigWallet = z.infer<typeof insertMultiSigWalletSchema>;
export type MultiSigWallet = typeof multiSigWallets.$inferSelect;

// Atomic Swap Orders table for HTLC swaps with database persistence
export const atomicSwapOrders = pgTable("atomic_swap_orders", {
  id: text("id").primaryKey(),
  userAddress: text("user_address").notNull(),
  fromToken: text("from_token").notNull(),
  toToken: text("to_token").notNull(),
  fromAmount: text("from_amount").notNull(),
  toAmount: text("to_amount"),
  minAmount: text("min_amount").notNull(),
  fromNetwork: text("from_network").notNull(),
  toNetwork: text("to_network").notNull(),
  secretHash: text("secret_hash").notNull(),
  lockTxHash: text("lock_tx_hash"),
  executeTxHash: text("execute_tx_hash"),
  timelock: integer("timelock").notNull(),
  status: text("status").notNull().default("pending"),
  validProofCount: integer("valid_proof_count").default(0),
  consensusRequired: integer("consensus_required").default(2),
  proofs: jsonb("proofs"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata"),
}, (table) => ({
  userAddressIdx: index("atomic_swap_user_address_idx").on(table.userAddress),
  statusIdx: index("atomic_swap_status_idx").on(table.status),
  createdAtIdx: index("atomic_swap_created_at_idx").on(table.createdAt),
}));

export const insertAtomicSwapOrderSchema = createInsertSchema(atomicSwapOrders).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertAtomicSwapOrder = z.infer<typeof insertAtomicSwapOrderSchema>;
export type AtomicSwapOrder = typeof atomicSwapOrders.$inferSelect;

// Type exports for wallet integration
export type InsertWalletRegistration = z.infer<typeof insertWalletRegistrationSchema>;
export type WalletRegistration = typeof walletRegistrations.$inferSelect;

export type InsertWalletSession = z.infer<typeof insertWalletSessionSchema>;
export type WalletSession = typeof walletSessions.$inferSelect;

export type InsertWalletVault = z.infer<typeof insertWalletVaultSchema>;
export type WalletVault = typeof walletVaults.$inferSelect;

export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;

// ============================================================================
// VALIDATOR ONBOARDING SYSTEM
// ============================================================================

// Validator status enum values
export const validatorStatusValues = [
  'draft',           // Initial registration, not yet submitted
  'submitted',       // Application submitted for review
  'attesting',       // Hardware attestation in progress
  'attestation_failed', // Attestation verification failed
  'approved',        // Approved and active validator
  'rejected',        // Application rejected by admin
  'revoked',         // Previously approved, now revoked
  'expired'          // Attestation expired, needs renewal
] as const;
export type ValidatorStatus = typeof validatorStatusValues[number];

// TEE type enum values
export const teeTypeValues = ['sgx', 'sev'] as const;
export type TEEType = typeof teeTypeValues[number];

// Consensus role enum values  
export const consensusRoleValues = ['arbitrum', 'solana', 'ton'] as const;
export type ConsensusRole = typeof consensusRoleValues[number];

// Validators table - stores validator operator information
export const validators = pgTable("validators", {
  id: serial("id").primaryKey(),
  operatorName: text("operator_name").notNull(),
  operatorEmail: text("operator_email").notNull(),
  organizationName: text("organization_name"),
  walletAddress: text("wallet_address").notNull(),
  teeType: text("tee_type").notNull(), // 'sgx' or 'sev'
  hardwareVendor: text("hardware_vendor"), // 'intel', 'amd'
  hardwareModel: text("hardware_model"),
  region: text("region"), // Geographic region
  consensusRole: text("consensus_role"), // 'arbitrum', 'solana', 'ton'
  status: text("status").notNull().default("draft"),
  statusReason: text("status_reason"), // Reason for rejection/revocation
  approvedBy: jsonb("approved_by"), // Array of admin addresses who approved
  mrenclave: text("mrenclave"), // SGX enclave measurement hash
  measurement: text("measurement"), // SEV measurement hash
  lastAttestationAt: timestamp("last_attestation_at"),
  attestationExpiresAt: timestamp("attestation_expires_at"),
  onChainRegistered: boolean("on_chain_registered").default(false),
  registrationTxHash: text("registration_tx_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  metadata: jsonb("metadata"),
}, (table) => ({
  walletAddressIdx: index("validator_wallet_address_idx").on(table.walletAddress),
  statusIdx: index("validator_status_idx").on(table.status),
  consensusRoleIdx: index("validator_consensus_role_idx").on(table.consensusRole),
}));

// Validator attestations - stores hardware attestation proofs
export const validatorAttestations = pgTable("validator_attestations", {
  id: serial("id").primaryKey(),
  validatorId: integer("validator_id").notNull().references(() => validators.id),
  teeType: text("tee_type").notNull(), // 'sgx' or 'sev'
  quoteHash: text("quote_hash"), // SGX quote hash
  reportHash: text("report_hash"), // Report hash for verification
  mrenclave: text("mrenclave"), // Enclave measurement
  measurement: text("measurement"), // SEV measurement
  reportData: text("report_data"), // Report data binding validator address
  attestationPayload: jsonb("attestation_payload"), // Full attestation payload
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  verifiedAt: timestamp("verified_at"),
  expiresAt: timestamp("expires_at"),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, failed
  verifierTxHash: text("verifier_tx_hash"), // On-chain verification transaction
  failureReason: text("failure_reason"),
  adminNotes: text("admin_notes"),
  metadata: jsonb("metadata"),
}, (table) => ({
  validatorIdIdx: index("attestation_validator_id_idx").on(table.validatorId),
  statusIdx: index("attestation_status_idx").on(table.verificationStatus),
}));

// Validator status events - audit log for status transitions
export const validatorStatusEvents = pgTable("validator_status_events", {
  id: serial("id").primaryKey(),
  validatorId: integer("validator_id").notNull().references(() => validators.id),
  statusFrom: text("status_from").notNull(),
  statusTo: text("status_to").notNull(),
  reason: text("reason"),
  actorAddress: text("actor_address"), // Admin or system that made the change
  actorType: text("actor_type").notNull().default("system"), // 'admin', 'system', 'validator'
  txHash: text("tx_hash"), // Related blockchain transaction
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
}, (table) => ({
  validatorIdIdx: index("status_event_validator_id_idx").on(table.validatorId),
}));

// Insert schemas for validators
export const insertValidatorSchema = createInsertSchema(validators)
  .pick({
    operatorName: true,
    operatorEmail: true,
    organizationName: true,
    walletAddress: true,
    teeType: true,
    hardwareVendor: true,
    hardwareModel: true,
    region: true,
    consensusRole: true,
    metadata: true,
  })
  .extend({
    operatorEmail: z.string().email("Invalid email address"),
    walletAddress: z.string().min(10, "Invalid wallet address"),
    teeType: z.enum(teeTypeValues),
    consensusRole: z.enum(consensusRoleValues).optional(),
  });

export const insertValidatorAttestationSchema = createInsertSchema(validatorAttestations)
  .pick({
    validatorId: true,
    teeType: true,
    quoteHash: true,
    reportHash: true,
    mrenclave: true,
    measurement: true,
    reportData: true,
    attestationPayload: true,
    expiresAt: true,
    metadata: true,
  })
  .extend({
    teeType: z.enum(teeTypeValues),
    expiresAt: z.union([z.string(), z.date()])
      .optional()
      .transform(val => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }),
  });

export const insertValidatorStatusEventSchema = createInsertSchema(validatorStatusEvents)
  .pick({
    validatorId: true,
    statusFrom: true,
    statusTo: true,
    reason: true,
    actorAddress: true,
    actorType: true,
    txHash: true,
    metadata: true,
  });

// Type exports for validators
export type InsertValidator = z.infer<typeof insertValidatorSchema>;
export type Validator = typeof validators.$inferSelect;

export type InsertValidatorAttestation = z.infer<typeof insertValidatorAttestationSchema>;
export type ValidatorAttestation = typeof validatorAttestations.$inferSelect;

export type InsertValidatorStatusEvent = z.infer<typeof insertValidatorStatusEventSchema>;
export type ValidatorStatusEvent = typeof validatorStatusEvents.$inferSelect;

// ============================================================================
// TRINITY SCAN - Blockchain Explorer Tables
// ============================================================================

// Chain configuration for multi-chain indexing
export const scannerChains = pgTable("scanner_chains", {
  id: serial("id").primaryKey(),
  chainId: varchar("chain_id", { length: 50 }).notNull().unique(), // 'arbitrum', 'solana', 'ton'
  chainName: text("chain_name").notNull(),
  chainType: text("chain_type").notNull(), // 'evm', 'solana', 'ton'
  networkId: integer("network_id"), // EVM chain ID (421614 for Arbitrum Sepolia)
  rpcEndpoint: text("rpc_endpoint"),
  explorerUrl: text("explorer_url"),
  nativeToken: text("native_token").notNull(), // 'ETH', 'SOL', 'TON'
  isActive: boolean("is_active").default(true),
  lastIndexedBlock: text("last_indexed_block"),
  lastIndexedAt: timestamp("last_indexed_at"),
  blockTime: integer("block_time"), // Average block time in milliseconds
  metadata: jsonb("metadata"),
}, (table) => ({
  chainIdIdx: index("scanner_chain_id_idx").on(table.chainId),
}));

// Indexed blocks from all chains
export const scannerBlocks = pgTable("scanner_blocks", {
  id: serial("id").primaryKey(),
  chainId: varchar("chain_id", { length: 50 }).notNull(),
  blockNumber: text("block_number").notNull(), // Using text for Solana slot numbers
  blockHash: text("block_hash").notNull(),
  parentHash: text("parent_hash"),
  timestamp: timestamp("timestamp").notNull(),
  transactionCount: integer("transaction_count").default(0),
  gasUsed: text("gas_used"), // EVM specific
  gasLimit: text("gas_limit"), // EVM specific
  baseFeePerGas: text("base_fee_per_gas"), // EVM specific
  validator: text("validator"), // Block producer/validator
  rewards: text("rewards"), // Block rewards
  size: integer("size"), // Block size in bytes
  status: text("status").default("confirmed"), // 'pending', 'confirmed', 'finalized'
  indexedAt: timestamp("indexed_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
}, (table) => ({
  chainBlockIdx: index("scanner_block_chain_block_idx").on(table.chainId, table.blockNumber),
  hashIdx: index("scanner_block_hash_idx").on(table.blockHash),
  timestampIdx: index("scanner_block_timestamp_idx").on(table.timestamp),
}));

// All indexed transactions
export const scannerTransactions = pgTable("scanner_transactions", {
  id: serial("id").primaryKey(),
  chainId: varchar("chain_id", { length: 50 }).notNull(),
  txHash: text("tx_hash").notNull(),
  blockNumber: text("block_number"),
  blockHash: text("block_hash"),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address"),
  value: text("value").default("0"),
  gasPrice: text("gas_price"), // EVM
  gasUsed: text("gas_used"), // EVM
  maxFeePerGas: text("max_fee_per_gas"), // EVM EIP-1559
  maxPriorityFee: text("max_priority_fee"), // EVM EIP-1559
  nonce: integer("nonce"), // EVM
  inputData: text("input_data"), // Transaction input/calldata
  methodId: text("method_id"), // First 4 bytes of input (function selector)
  methodName: text("method_name"), // Decoded method name
  status: text("status").notNull().default("pending"), // 'pending', 'success', 'failed', 'reverted'
  errorMessage: text("error_message"), // Revert reason if failed
  transactionType: text("transaction_type"), // 'transfer', 'contract_call', 'contract_creation', 'trinity_operation'
  timestamp: timestamp("timestamp").notNull(),
  confirmations: integer("confirmations").default(0),
  fee: text("fee"), // Total transaction fee
  feeUsd: text("fee_usd"), // Fee in USD at time of transaction
  contractAddress: text("contract_address"), // For contract creation transactions
  logs: jsonb("logs"), // Event logs
  internalTxs: jsonb("internal_txs"), // Internal transactions
  tokenTransfers: jsonb("token_transfers"), // ERC20/SPL token transfers
  indexedAt: timestamp("indexed_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
}, (table) => ({
  chainTxIdx: index("scanner_tx_chain_hash_idx").on(table.chainId, table.txHash),
  fromIdx: index("scanner_tx_from_idx").on(table.fromAddress),
  toIdx: index("scanner_tx_to_idx").on(table.toAddress),
  blockIdx: index("scanner_tx_block_idx").on(table.chainId, table.blockNumber),
  timestampIdx: index("scanner_tx_timestamp_idx").on(table.timestamp),
  methodIdx: index("scanner_tx_method_idx").on(table.methodId),
}));

// Trinity Protocol consensus operations (2-of-3)
export const scannerConsensusOps = pgTable("scanner_consensus_ops", {
  id: serial("id").primaryKey(),
  operationId: text("operation_id").notNull().unique(),
  operationType: text("operation_type").notNull(), // 'vault_create', 'vault_withdraw', 'bridge_transfer', 'swap_execute'
  initiatorAddress: text("initiator_address").notNull(),
  targetContract: text("target_contract"),
  primaryChain: varchar("primary_chain", { length: 50 }).notNull(), // Where the operation originated
  requiredConfirmations: integer("required_confirmations").default(2),
  currentConfirmations: integer("current_confirmations").default(0),
  status: text("status").notNull().default("pending"), // 'pending', 'partial', 'confirmed', 'executed', 'expired', 'failed'
  arbitrumTxHash: text("arbitrum_tx_hash"),
  arbitrumStatus: text("arbitrum_status"), // 'pending', 'confirmed', 'failed'
  arbitrumConfirmedAt: timestamp("arbitrum_confirmed_at"),
  solanaTxHash: text("solana_tx_hash"),
  solanaStatus: text("solana_status"),
  solanaConfirmedAt: timestamp("solana_confirmed_at"),
  tonTxHash: text("ton_tx_hash"),
  tonStatus: text("ton_status"),
  tonConfirmedAt: timestamp("ton_confirmed_at"),
  dataHash: text("data_hash"), // Keccak256 of operation data
  operationData: jsonb("operation_data"), // Full operation parameters
  validatorSignatures: jsonb("validator_signatures"), // Array of validator signatures
  createdAt: timestamp("created_at").notNull().defaultNow(),
  executedAt: timestamp("executed_at"),
  expiresAt: timestamp("expires_at"),
  gasUsedTotal: text("gas_used_total"),
  feesTotal: text("fees_total"),
  metadata: jsonb("metadata"),
}, (table) => ({
  opIdIdx: index("scanner_consensus_op_id_idx").on(table.operationId),
  initiatorIdx: index("scanner_consensus_initiator_idx").on(table.initiatorAddress),
  statusIdx: index("scanner_consensus_status_idx").on(table.status),
  typeIdx: index("scanner_consensus_type_idx").on(table.operationType),
  createdIdx: index("scanner_consensus_created_idx").on(table.createdAt),
}));

// ChronosVault operations and state changes
export const scannerVaultOps = pgTable("scanner_vault_ops", {
  id: serial("id").primaryKey(),
  vaultAddress: text("vault_address").notNull(),
  chainId: varchar("chain_id", { length: 50 }).notNull(),
  operationType: text("operation_type").notNull(), // 'create', 'deposit', 'withdraw', 'lock', 'unlock', 'emergency_exit'
  operatorAddress: text("operator_address").notNull(),
  amount: text("amount"),
  tokenAddress: text("token_address"),
  tokenSymbol: text("token_symbol"),
  txHash: text("tx_hash").notNull(),
  blockNumber: text("block_number"),
  status: text("status").notNull().default("pending"), // 'pending', 'success', 'failed'
  consensusOpId: text("consensus_op_id"), // Link to consensus operation if applicable
  vaultState: jsonb("vault_state"), // Snapshot of vault state after operation
  timestamp: timestamp("timestamp").notNull(),
  lockUntil: timestamp("lock_until"), // For time-locked operations
  securityLevel: integer("security_level"), // Vault security level 1-5
  isEmergency: boolean("is_emergency").default(false),
  validatorApprovals: jsonb("validator_approvals"),
  metadata: jsonb("metadata"),
  indexedAt: timestamp("indexed_at").notNull().defaultNow(),
}, (table) => ({
  vaultIdx: index("scanner_vault_ops_vault_idx").on(table.vaultAddress),
  chainIdx: index("scanner_vault_ops_chain_idx").on(table.chainId),
  operatorIdx: index("scanner_vault_ops_operator_idx").on(table.operatorAddress),
  typeIdx: index("scanner_vault_ops_type_idx").on(table.operationType),
  txIdx: index("scanner_vault_ops_tx_idx").on(table.txHash),
  timestampIdx: index("scanner_vault_ops_timestamp_idx").on(table.timestamp),
}));

// HTLC atomic swap tracking
export const scannerHtlcSwaps = pgTable("scanner_htlc_swaps", {
  id: serial("id").primaryKey(),
  swapId: text("swap_id").notNull().unique(),
  hashlock: text("hashlock").notNull(), // SHA256 hash of the secret
  secret: text("secret"), // Revealed after completion
  initiatorAddress: text("initiator_address").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  sourceChain: varchar("source_chain", { length: 50 }).notNull(),
  destinationChain: varchar("destination_chain", { length: 50 }).notNull(),
  sourceAmount: text("source_amount").notNull(),
  destinationAmount: text("destination_amount").notNull(),
  sourceToken: text("source_token"),
  destinationToken: text("destination_token"),
  sourceTxHash: text("source_tx_hash"),
  destinationTxHash: text("destination_tx_hash"),
  claimTxHash: text("claim_tx_hash"),
  refundTxHash: text("refund_tx_hash"),
  status: text("status").notNull().default("created"), // 'created', 'locked', 'claimed', 'refunded', 'expired'
  timelock: timestamp("timelock").notNull(), // Expiration timestamp
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lockedAt: timestamp("locked_at"),
  claimedAt: timestamp("claimed_at"),
  refundedAt: timestamp("refunded_at"),
  consensusOpId: text("consensus_op_id"), // Trinity consensus operation
  exchangeRate: text("exchange_rate"),
  fees: text("fees"),
  arbitrator: text("arbitrator"), // Optional arbitrator for disputes
  metadata: jsonb("metadata"),
  indexedAt: timestamp("indexed_at").notNull().defaultNow(),
}, (table) => ({
  swapIdIdx: index("scanner_htlc_swap_id_idx").on(table.swapId),
  hashlockIdx: index("scanner_htlc_hashlock_idx").on(table.hashlock),
  initiatorIdx: index("scanner_htlc_initiator_idx").on(table.initiatorAddress),
  recipientIdx: index("scanner_htlc_recipient_idx").on(table.recipientAddress),
  statusIdx: index("scanner_htlc_status_idx").on(table.status),
  sourceChainIdx: index("scanner_htlc_source_chain_idx").on(table.sourceChain),
  destChainIdx: index("scanner_htlc_dest_chain_idx").on(table.destinationChain),
  createdIdx: index("scanner_htlc_created_idx").on(table.createdAt),
}));

// Cross-chain bridge operations
export const scannerBridgeOps = pgTable("scanner_bridge_ops", {
  id: serial("id").primaryKey(),
  bridgeOpId: text("bridge_op_id").notNull().unique(),
  bridgeContract: text("bridge_contract").notNull(),
  sourceChain: varchar("source_chain", { length: 50 }).notNull(),
  destinationChain: varchar("destination_chain", { length: 50 }).notNull(),
  senderAddress: text("sender_address").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  tokenAddress: text("token_address"),
  tokenSymbol: text("token_symbol"),
  amount: text("amount").notNull(),
  sourceTxHash: text("source_tx_hash"),
  destinationTxHash: text("destination_tx_hash"),
  relayerAddress: text("relayer_address"),
  status: text("status").notNull().default("initiated"), // 'initiated', 'pending_confirmation', 'relaying', 'completed', 'failed', 'stuck'
  confirmationsRequired: integer("confirmations_required").default(2),
  confirmationsReceived: integer("confirmations_received").default(0),
  fee: text("fee"),
  feeToken: text("fee_token"),
  nonce: text("nonce"),
  messageHash: text("message_hash"), // Cross-chain message hash
  initiatedAt: timestamp("initiated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  estimatedArrival: timestamp("estimated_arrival"),
  retryCount: integer("retry_count").default(0),
  lastError: text("last_error"),
  consensusOpId: text("consensus_op_id"),
  metadata: jsonb("metadata"),
  indexedAt: timestamp("indexed_at").notNull().defaultNow(),
}, (table) => ({
  bridgeOpIdIdx: index("scanner_bridge_op_id_idx").on(table.bridgeOpId),
  senderIdx: index("scanner_bridge_sender_idx").on(table.senderAddress),
  recipientIdx: index("scanner_bridge_recipient_idx").on(table.recipientAddress),
  sourceChainIdx: index("scanner_bridge_source_idx").on(table.sourceChain),
  destChainIdx: index("scanner_bridge_dest_idx").on(table.destinationChain),
  statusIdx: index("scanner_bridge_status_idx").on(table.status),
  initiatedIdx: index("scanner_bridge_initiated_idx").on(table.initiatedAt),
}));

// Trinity Shield validator activity tracking
export const scannerValidatorActivity = pgTable("scanner_validator_activity", {
  id: serial("id").primaryKey(),
  validatorAddress: text("validator_address").notNull(),
  chainId: varchar("chain_id", { length: 50 }).notNull(),
  activityType: text("activity_type").notNull(), // 'attestation', 'consensus_vote', 'block_production', 'slashing'
  operationId: text("operation_id"), // Related consensus operation
  txHash: text("tx_hash"),
  status: text("status").notNull(), // 'success', 'failed', 'pending'
  responseTime: integer("response_time"), // Milliseconds to respond
  attestationData: jsonb("attestation_data"),
  rewardAmount: text("reward_amount"),
  penaltyAmount: text("penalty_amount"),
  timestamp: timestamp("timestamp").notNull(),
  blockNumber: text("block_number"),
  metadata: jsonb("metadata"),
  indexedAt: timestamp("indexed_at").notNull().defaultNow(),
}, (table) => ({
  validatorIdx: index("scanner_validator_activity_addr_idx").on(table.validatorAddress),
  chainIdx: index("scanner_validator_activity_chain_idx").on(table.chainId),
  typeIdx: index("scanner_validator_activity_type_idx").on(table.activityType),
  timestampIdx: index("scanner_validator_activity_ts_idx").on(table.timestamp),
  opIdx: index("scanner_validator_activity_op_idx").on(table.operationId),
}));

// Address statistics and analytics
export const scannerAddressStats = pgTable("scanner_address_stats", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  chainId: varchar("chain_id", { length: 50 }).notNull(),
  isContract: boolean("is_contract").default(false),
  contractName: text("contract_name"),
  contractType: text("contract_type"), // 'vault', 'bridge', 'htlc', 'token', 'validator'
  balance: text("balance"),
  balanceUsd: text("balance_usd"),
  txCount: integer("tx_count").default(0),
  txCountIn: integer("tx_count_in").default(0),
  txCountOut: integer("tx_count_out").default(0),
  firstTxAt: timestamp("first_tx_at"),
  lastTxAt: timestamp("last_tx_at"),
  tokenBalances: jsonb("token_balances"), // Array of token balances
  vaultCount: integer("vault_count").default(0), // Vaults owned/managed
  swapCount: integer("swap_count").default(0), // HTLC swaps participated
  bridgeCount: integer("bridge_count").default(0), // Bridge operations
  consensusParticipation: integer("consensus_participation").default(0), // Consensus ops participated
  labels: jsonb("labels"), // Address labels ['validator', 'whale', 'contract', 'exchange']
  riskScore: integer("risk_score"), // 0-100 risk assessment
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
}, (table) => ({
  addressChainIdx: index("scanner_address_stats_addr_chain_idx").on(table.address, table.chainId),
  balanceIdx: index("scanner_address_stats_balance_idx").on(table.balance),
  txCountIdx: index("scanner_address_stats_tx_count_idx").on(table.txCount),
  contractTypeIdx: index("scanner_address_stats_contract_type_idx").on(table.contractType),
}));

// Scanner indexing status and health
export const scannerIndexerStatus = pgTable("scanner_indexer_status", {
  id: serial("id").primaryKey(),
  chainId: varchar("chain_id", { length: 50 }).notNull().unique(),
  indexerType: text("indexer_type").notNull(), // 'block', 'transaction', 'event', 'contract'
  status: text("status").notNull().default("running"), // 'running', 'paused', 'error', 'syncing'
  currentBlock: text("current_block"),
  targetBlock: text("target_block"),
  blocksPerSecond: integer("blocks_per_second"),
  lastProcessedAt: timestamp("last_processed_at"),
  lastErrorAt: timestamp("last_error_at"),
  lastError: text("last_error"),
  reorgCount: integer("reorg_count").default(0),
  totalBlocksProcessed: text("total_blocks_processed"),
  totalTxProcessed: text("total_tx_processed"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
}, (table) => ({
  chainStatusIdx: index("scanner_indexer_chain_status_idx").on(table.chainId, table.status),
}));

// Insert schemas for Trinity Scan
export const insertScannerChainSchema = createInsertSchema(scannerChains).omit({ id: true });
export const insertScannerBlockSchema = createInsertSchema(scannerBlocks).omit({ id: true });
export const insertScannerTransactionSchema = createInsertSchema(scannerTransactions).omit({ id: true });
export const insertScannerConsensusOpSchema = createInsertSchema(scannerConsensusOps).omit({ id: true });
export const insertScannerVaultOpSchema = createInsertSchema(scannerVaultOps).omit({ id: true });
export const insertScannerHtlcSwapSchema = createInsertSchema(scannerHtlcSwaps).omit({ id: true });
export const insertScannerBridgeOpSchema = createInsertSchema(scannerBridgeOps).omit({ id: true });
export const insertScannerValidatorActivitySchema = createInsertSchema(scannerValidatorActivity).omit({ id: true });
export const insertScannerAddressStatsSchema = createInsertSchema(scannerAddressStats).omit({ id: true });

// Type exports for Trinity Scan
export type InsertScannerChain = z.infer<typeof insertScannerChainSchema>;
export type ScannerChain = typeof scannerChains.$inferSelect;

export type InsertScannerBlock = z.infer<typeof insertScannerBlockSchema>;
export type ScannerBlock = typeof scannerBlocks.$inferSelect;

export type InsertScannerTransaction = z.infer<typeof insertScannerTransactionSchema>;
export type ScannerTransaction = typeof scannerTransactions.$inferSelect;

export type InsertScannerConsensusOp = z.infer<typeof insertScannerConsensusOpSchema>;
export type ScannerConsensusOp = typeof scannerConsensusOps.$inferSelect;

export type InsertScannerVaultOp = z.infer<typeof insertScannerVaultOpSchema>;
export type ScannerVaultOp = typeof scannerVaultOps.$inferSelect;

export type InsertScannerHtlcSwap = z.infer<typeof insertScannerHtlcSwapSchema>;
export type ScannerHtlcSwap = typeof scannerHtlcSwaps.$inferSelect;

export type InsertScannerBridgeOp = z.infer<typeof insertScannerBridgeOpSchema>;
export type ScannerBridgeOp = typeof scannerBridgeOps.$inferSelect;

export type InsertScannerValidatorActivity = z.infer<typeof insertScannerValidatorActivitySchema>;
export type ScannerValidatorActivity = typeof scannerValidatorActivity.$inferSelect;

export type InsertScannerAddressStats = z.infer<typeof insertScannerAddressStatsSchema>;
export type ScannerAddressStats = typeof scannerAddressStats.$inferSelect;
