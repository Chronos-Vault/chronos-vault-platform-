import { 
  users, type User, type InsertUser,
  walletAuth, walletSessions,
  vaults, type Vault, type InsertVault,
  insertWalletAuthSchema, insertWalletSessionSchema
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gt } from "drizzle-orm";
import { z } from "zod";

// Wallet authentication types
export type WalletAuth = typeof walletAuth.$inferSelect;
export type InsertWalletAuth = z.infer<typeof insertWalletAuthSchema>;
export type WalletSession = typeof walletSessions.$inferSelect;
export type InsertWalletSession = z.infer<typeof insertWalletSessionSchema>;

export interface IWalletStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Wallet authentication methods
  createWalletAuth(auth: InsertWalletAuth): Promise<WalletAuth>;
  getWalletAuthByAddress(walletAddress: string, blockchain: string): Promise<WalletAuth | undefined>;
  updateWalletAuth(id: number, updates: Partial<WalletAuth>): Promise<WalletAuth | undefined>;
  getWalletAuthByNonce(nonce: string): Promise<WalletAuth | undefined>;
  
  // Wallet session methods
  createWalletSession(session: InsertWalletSession): Promise<WalletSession>;
  getActiveWalletSession(sessionToken: string): Promise<WalletSession | undefined>;
  invalidateWalletSession(sessionToken: string): Promise<boolean>;
  getUserActiveSession(walletAddress: string): Promise<WalletSession | undefined>;
  
  // Vault methods
  getVault(id: number): Promise<Vault | undefined>;
  getVaultsByUser(userId: number): Promise<Vault[]>;
  createVault(vault: InsertVault): Promise<Vault>;
}

export class DatabaseWalletStorage implements IWalletStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Wallet authentication methods
  async createWalletAuth(insertAuth: InsertWalletAuth): Promise<WalletAuth> {
    const [auth] = await db
      .insert(walletAuth)
      .values(insertAuth)
      .returning();
    return auth;
  }

  async getWalletAuthByAddress(walletAddress: string, blockchain: string): Promise<WalletAuth | undefined> {
    const [auth] = await db
      .select()
      .from(walletAuth)
      .where(and(
        eq(walletAuth.walletAddress, walletAddress),
        eq(walletAuth.blockchain, blockchain),
        gt(walletAuth.expiresAt, new Date())
      ))
      .orderBy(desc(walletAuth.createdAt));
    return auth;
  }

  async updateWalletAuth(id: number, updates: Partial<WalletAuth>): Promise<WalletAuth | undefined> {
    const [auth] = await db
      .update(walletAuth)
      .set(updates)
      .where(eq(walletAuth.id, id))
      .returning();
    return auth;
  }

  async getWalletAuthByNonce(nonce: string): Promise<WalletAuth | undefined> {
    const [auth] = await db
      .select()
      .from(walletAuth)
      .where(and(
        eq(walletAuth.nonce, nonce),
        gt(walletAuth.expiresAt, new Date())
      ));
    return auth;
  }

  // Wallet session methods
  async createWalletSession(insertSession: InsertWalletSession): Promise<WalletSession> {
    const [session] = await db
      .insert(walletSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getActiveWalletSession(sessionToken: string): Promise<WalletSession | undefined> {
    const [session] = await db
      .select()
      .from(walletSessions)
      .where(and(
        eq(walletSessions.sessionToken, sessionToken),
        eq(walletSessions.isActive, true),
        gt(walletSessions.expiresAt, new Date())
      ));
    return session;
  }

  async invalidateWalletSession(sessionToken: string): Promise<boolean> {
    const result = await db
      .update(walletSessions)
      .set({ isActive: false })
      .where(eq(walletSessions.sessionToken, sessionToken));
    return result.rowCount > 0;
  }

  async getUserActiveSession(walletAddress: string): Promise<WalletSession | undefined> {
    const [session] = await db
      .select()
      .from(walletSessions)
      .where(and(
        eq(walletSessions.walletAddress, walletAddress),
        eq(walletSessions.isActive, true),
        gt(walletSessions.expiresAt, new Date())
      ))
      .orderBy(desc(walletSessions.lastActivity));
    return session;
  }

  // Vault methods
  async getVault(id: number): Promise<Vault | undefined> {
    const [vault] = await db.select().from(vaults).where(eq(vaults.id, id));
    return vault;
  }

  async getVaultsByUser(userId: number): Promise<Vault[]> {
    return await db.select().from(vaults).where(eq(vaults.userId, userId));
  }

  async createVault(insertVault: InsertVault): Promise<Vault> {
    const [vault] = await db
      .insert(vaults)
      .values(insertVault)
      .returning();
    return vault;
  }
}

export const walletStorage = new DatabaseWalletStorage();