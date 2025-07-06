import { db } from "../db";
import { 
  walletConnections, 
  newWalletSessions, 
  newWalletAuthAttempts,
  users,
  type NewWalletConnection,
  type InsertNewWalletConnection,
  type NewWalletSession,
  type InsertNewWalletSession,
  type NewWalletAuthAttempt,
  type InsertNewWalletAuthAttempt,
  type User
} from "@shared/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import crypto from "crypto";
import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

export class WalletService {
  // Generate a nonce for wallet authentication
  generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // Generate authentication message
  generateAuthMessage(walletAddress: string, nonce: string): string {
    return `Authenticate with Chronos Vault\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
  }

  // Create wallet authentication attempt
  async createAuthAttempt(data: {
    walletAddress: string;
    walletType: string;
    blockchain: string;
  }): Promise<{ nonce: string; message: string; attemptId: number }> {
    const nonce = this.generateNonce();
    const message = this.generateAuthMessage(data.walletAddress, nonce);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const [attempt] = await db
      .insert(newWalletAuthAttempts)
      .values({
        walletAddress: data.walletAddress,
        walletType: data.walletType,
        blockchain: data.blockchain,
        nonce,
        message,
        expiresAt,
      })
      .returning();

    return {
      nonce,
      message,
      attemptId: attempt.id,
    };
  }

  // Verify wallet signature
  async verifySignature(attemptId: number, signature: string): Promise<boolean> {
    const [attempt] = await db
      .select()
      .from(newWalletAuthAttempts)
      .where(eq(newWalletAuthAttempts.id, attemptId));

    if (!attempt || attempt.expiresAt < new Date()) {
      return false;
    }

    let isValid = false;

    try {
      switch (attempt.blockchain) {
        case 'ethereum':
          const recoveredAddress = ethers.verifyMessage(attempt.message, signature);
          isValid = recoveredAddress.toLowerCase() === attempt.walletAddress.toLowerCase();
          break;

        case 'solana':
          const publicKey = new PublicKey(attempt.walletAddress);
          const messageBytes = new TextEncoder().encode(attempt.message);
          const signatureBytes = new Uint8Array(Buffer.from(signature, 'base64'));
          isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey.toBytes());
          break;

        case 'ton':
          // TON signature verification would go here
          // For now, we'll mark it as valid for development
          isValid = true;
          break;

        default:
          isValid = false;
      }
    } catch (error) {
      console.error('Signature verification error:', error);
      isValid = false;
    }

    // Update attempt with verification result
    await db
      .update(newWalletAuthAttempts)
      .set({
        signature,
        isVerified: isValid,
      })
      .where(eq(newWalletAuthAttempts.id, attemptId));

    return isValid;
  }

  // Connect wallet to user account
  async connectWallet(data: {
    userId: number;
    walletAddress: string;
    walletType: string;
    blockchain: string;
    signature: string;
    message: string;
  }): Promise<NewWalletConnection> {
    // Deactivate existing connections for this wallet
    await db
      .update(walletConnections)
      .set({ isActive: false })
      .where(eq(walletConnections.walletAddress, data.walletAddress));

    // Create new connection
    const [connection] = await db
      .insert(walletConnections)
      .values({
        userId: data.userId,
        walletAddress: data.walletAddress,
        walletType: data.walletType,
        blockchain: data.blockchain,
        signature: data.signature,
        message: data.message,
        isActive: true,
      })
      .returning();

    return connection;
  }

  // Create wallet session
  async createSession(walletConnectionId: number, userId: number): Promise<NewWalletSession> {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const [session] = await db
      .insert(newWalletSessions)
      .values({
        sessionId,
        walletConnectionId,
        userId,
        expiresAt,
      })
      .returning();

    return session;
  }

  // Get active wallet connections for user
  async getUserWallets(userId: number): Promise<NewWalletConnection[]> {
    return await db
      .select()
      .from(walletConnections)
      .where(and(
        eq(walletConnections.userId, userId),
        eq(walletConnections.isActive, true)
      ))
      .orderBy(desc(walletConnections.connectedAt));
  }

  // Get wallet connection by address
  async getWalletByAddress(walletAddress: string): Promise<NewWalletConnection | undefined> {
    const [connection] = await db
      .select()
      .from(walletConnections)
      .where(and(
        eq(walletConnections.walletAddress, walletAddress),
        eq(walletConnections.isActive, true)
      ));

    return connection;
  }

  // Validate session
  async validateSession(sessionId: string): Promise<NewWalletSession | null> {
    const [session] = await db
      .select()
      .from(newWalletSessions)
      .where(and(
        eq(newWalletSessions.sessionId, sessionId),
        eq(newWalletSessions.isActive, true),
        gt(newWalletSessions.expiresAt, new Date())
      ));

    return session || null;
  }

  // Disconnect wallet
  async disconnectWallet(walletConnectionId: number): Promise<boolean> {
    const result = await db
      .update(walletConnections)
      .set({ isActive: false })
      .where(eq(walletConnections.id, walletConnectionId));

    // Also deactivate associated sessions
    await db
      .update(newWalletSessions)
      .set({ isActive: false })
      .where(eq(newWalletSessions.walletConnectionId, walletConnectionId));

    return result.rowCount > 0;
  }

  // Get or create user by wallet address
  async getOrCreateUserByWallet(walletAddress: string, walletType: string): Promise<User> {
    // Check if user already exists with this wallet
    const [existingConnection] = await db
      .select()
      .from(walletConnections)
      .innerJoin(users, eq(walletConnections.userId, users.id))
      .where(eq(walletConnections.walletAddress, walletAddress))
      .limit(1);

    if (existingConnection) {
      return existingConnection.users;
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        username: `wallet_user_${Date.now()}`,
        password: crypto.randomBytes(32).toString('hex'), // Random password for wallet users
        walletAddress: walletAddress,
        email: null,
      })
      .returning();

    return newUser;
  }
}

export const walletService = new WalletService();