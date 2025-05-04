import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  metadata: jsonb("metadata"),
});

export const vaults = pgTable("vaults", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  description: text("description"),
  vaultType: text("vault_type").notNull(), // legacy, investment, project
  assetType: text("asset_type").notNull(),
  assetAmount: text("asset_amount").notNull(),
  timeLockPeriod: integer("time_lock_period").notNull(), // in days
  createdAt: timestamp("created_at").notNull().defaultNow(),
  unlockDate: timestamp("unlock_date").notNull(),
  isLocked: boolean("is_locked").notNull().default(true),
  // Adding metadata field for additional vault configuration
  metadata: jsonb("metadata"),
  // Cross-chain contract addresses
  ethereumContractAddress: text("ethereum_contract_address"),
  solanaContractAddress: text("solana_contract_address"),
  tonContractAddress: text("ton_contract_address"),
  // Security and cross-chain settings
  securityLevel: integer("security_level").default(1), // Level 1-5
  crossChainEnabled: boolean("cross_chain_enabled").default(false),
  privacyEnabled: boolean("privacy_enabled").default(false),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  email: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionStatus: true,
  metadata: true,
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
    ethereumContractAddress: true,
    solanaContractAddress: true,
    tonContractAddress: true,
    securityLevel: true,
    crossChainEnabled: true,
    privacyEnabled: true,
  })
  .extend({
    // Allow string inputs and convert to appropriate types
    assetAmount: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
    unlockDate: z.union([z.string(), z.date()]).transform(val => typeof val === 'string' ? new Date(val) : val),
    securityLevel: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
    timeLockPeriod: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
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

export type InsertCrossChainTransaction = z.infer<typeof insertCrossChainTransactionSchema>;
export type CrossChainTransaction = typeof crossChainTransactions.$inferSelect;

export type InsertSecurityIncident = z.infer<typeof insertSecurityIncidentSchema>;
export type SecurityIncident = typeof securityIncidents.$inferSelect;
