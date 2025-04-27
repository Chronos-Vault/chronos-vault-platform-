import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
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
});

export const beneficiaries = pgTable("beneficiaries", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull(),
  name: text("name").notNull(),
  walletAddress: text("wallet_address").notNull(),
  share: integer("share").notNull(), // percentage share of the vault
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertVaultSchema = createInsertSchema(vaults).pick({
  userId: true,
  name: true,
  description: true,
  vaultType: true,
  assetType: true,
  assetAmount: true,
  timeLockPeriod: true,
  unlockDate: true,
});

export const insertBeneficiarySchema = createInsertSchema(beneficiaries).pick({
  vaultId: true,
  name: true,
  walletAddress: true,
  share: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVault = z.infer<typeof insertVaultSchema>;
export type Vault = typeof vaults.$inferSelect;

export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type Beneficiary = typeof beneficiaries.$inferSelect;
