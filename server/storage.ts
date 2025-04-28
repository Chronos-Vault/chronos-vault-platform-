import { 
  users, type User, type InsertUser,
  vaults, type Vault, type InsertVault,
  beneficiaries, type Beneficiary, type InsertBeneficiary,
  attachments, type Attachment, type InsertAttachment
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vault methods
  getVault(id: number): Promise<Vault | undefined>;
  getVaultsByUser(userId: number): Promise<Vault[]>;
  createVault(vault: InsertVault): Promise<Vault>;
  updateVault(id: number, vault: Partial<Vault>): Promise<Vault | undefined>;
  deleteVault(id: number): Promise<boolean>;
  
  // Beneficiary methods
  getBeneficiariesByVault(vaultId: number): Promise<Beneficiary[]>;
  createBeneficiary(beneficiary: InsertBeneficiary): Promise<Beneficiary>;
  updateBeneficiary(id: number, beneficiary: Partial<Beneficiary>): Promise<Beneficiary | undefined>;
  deleteBeneficiary(id: number): Promise<boolean>;
  
  // Attachment methods
  getAttachment(id: number): Promise<Attachment | undefined>;
  getAttachmentsByVault(vaultId: number): Promise<Attachment[]>;
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  updateAttachment(id: number, attachment: Partial<Attachment>): Promise<Attachment | undefined>;
  deleteAttachment(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vaults: Map<number, Vault>;
  private beneficiaries: Map<number, Beneficiary>;
  private attachments: Map<number, Attachment>;
  private currentUserId: number;
  private currentVaultId: number;
  private currentBeneficiaryId: number;
  private currentAttachmentId: number;

  constructor() {
    this.users = new Map();
    this.vaults = new Map();
    this.beneficiaries = new Map();
    this.attachments = new Map();
    this.currentUserId = 1;
    this.currentVaultId = 1;
    this.currentBeneficiaryId = 1;
    this.currentAttachmentId = 1;
    
    // Add a demo user for testing
    this.createUser({
      username: "demo",
      password: "password123",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      walletAddress: insertUser.walletAddress || null
    };
    this.users.set(id, user);
    return user;
  }

  // Vault methods
  async getVault(id: number): Promise<Vault | undefined> {
    return this.vaults.get(id);
  }

  async getVaultsByUser(userId: number): Promise<Vault[]> {
    return Array.from(this.vaults.values()).filter(
      (vault) => vault.userId === userId
    );
  }

  async createVault(insertVault: InsertVault): Promise<Vault> {
    const id = this.currentVaultId++;
    const vault: Vault = { 
      ...insertVault, 
      id, 
      createdAt: new Date(),
      isLocked: true,
      userId: insertVault.userId ?? null,
      description: insertVault.description ?? null,
      metadata: insertVault.metadata ?? {}
    };
    this.vaults.set(id, vault);
    return vault;
  }

  async updateVault(id: number, updateData: Partial<Vault>): Promise<Vault | undefined> {
    const vault = this.vaults.get(id);
    if (!vault) return undefined;
    
    const updatedVault = { ...vault, ...updateData };
    this.vaults.set(id, updatedVault);
    return updatedVault;
  }

  async deleteVault(id: number): Promise<boolean> {
    return this.vaults.delete(id);
  }

  // Beneficiary methods
  async getBeneficiariesByVault(vaultId: number): Promise<Beneficiary[]> {
    return Array.from(this.beneficiaries.values()).filter(
      (beneficiary) => beneficiary.vaultId === vaultId
    );
  }

  async createBeneficiary(insertBeneficiary: InsertBeneficiary): Promise<Beneficiary> {
    const id = this.currentBeneficiaryId++;
    const beneficiary: Beneficiary = { ...insertBeneficiary, id };
    this.beneficiaries.set(id, beneficiary);
    return beneficiary;
  }

  async updateBeneficiary(id: number, updateData: Partial<Beneficiary>): Promise<Beneficiary | undefined> {
    const beneficiary = this.beneficiaries.get(id);
    if (!beneficiary) return undefined;
    
    const updatedBeneficiary = { ...beneficiary, ...updateData };
    this.beneficiaries.set(id, updatedBeneficiary);
    return updatedBeneficiary;
  }

  async deleteBeneficiary(id: number): Promise<boolean> {
    return this.beneficiaries.delete(id);
  }
  
  // Attachment methods
  async getAttachment(id: number): Promise<Attachment | undefined> {
    return this.attachments.get(id);
  }
  
  async getAttachmentsByVault(vaultId: number): Promise<Attachment[]> {
    return Array.from(this.attachments.values()).filter(
      (attachment) => attachment.vaultId === vaultId
    );
  }
  
  async createAttachment(insertAttachment: InsertAttachment): Promise<Attachment> {
    const id = this.currentAttachmentId++;
    const attachment: Attachment = { 
      ...insertAttachment, 
      id, 
      description: insertAttachment.description ?? null,
      thumbnailUrl: insertAttachment.thumbnailUrl ?? null,
      isEncrypted: insertAttachment.isEncrypted ?? true,
      metadata: insertAttachment.metadata ?? {},
      uploadedAt: new Date() 
    };
    this.attachments.set(id, attachment);
    return attachment;
  }
  
  async updateAttachment(id: number, updateData: Partial<Attachment>): Promise<Attachment | undefined> {
    const attachment = this.attachments.get(id);
    if (!attachment) return undefined;
    
    const updatedAttachment = { ...attachment, ...updateData };
    this.attachments.set(id, updatedAttachment);
    return updatedAttachment;
  }
  
  async deleteAttachment(id: number): Promise<boolean> {
    return this.attachments.delete(id);
  }
}

import { db } from "./db";
import { eq } from "drizzle-orm";

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getVault(id: number): Promise<Vault | undefined> {
    const [vault] = await db.select().from(vaults).where(eq(vaults.id, id));
    return vault || undefined;
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

  async updateVault(id: number, updateData: Partial<Vault>): Promise<Vault | undefined> {
    const [updatedVault] = await db
      .update(vaults)
      .set(updateData)
      .where(eq(vaults.id, id))
      .returning();
    return updatedVault || undefined;
  }

  async deleteVault(id: number): Promise<boolean> {
    const result = await db
      .delete(vaults)
      .where(eq(vaults.id, id))
      .returning({ id: vaults.id });
    return result.length > 0;
  }

  async getBeneficiariesByVault(vaultId: number): Promise<Beneficiary[]> {
    return await db
      .select()
      .from(beneficiaries)
      .where(eq(beneficiaries.vaultId, vaultId));
  }

  async createBeneficiary(insertBeneficiary: InsertBeneficiary): Promise<Beneficiary> {
    const [beneficiary] = await db
      .insert(beneficiaries)
      .values(insertBeneficiary)
      .returning();
    return beneficiary;
  }

  async updateBeneficiary(id: number, updateData: Partial<Beneficiary>): Promise<Beneficiary | undefined> {
    const [updatedBeneficiary] = await db
      .update(beneficiaries)
      .set(updateData)
      .where(eq(beneficiaries.id, id))
      .returning();
    return updatedBeneficiary || undefined;
  }

  async deleteBeneficiary(id: number): Promise<boolean> {
    const result = await db
      .delete(beneficiaries)
      .where(eq(beneficiaries.id, id))
      .returning({ id: beneficiaries.id });
    return result.length > 0;
  }
  
  // Attachment methods
  async getAttachment(id: number): Promise<Attachment | undefined> {
    const [attachment] = await db.select().from(attachments).where(eq(attachments.id, id));
    return attachment || undefined;
  }
  
  async getAttachmentsByVault(vaultId: number): Promise<Attachment[]> {
    return await db
      .select()
      .from(attachments)
      .where(eq(attachments.vaultId, vaultId));
  }
  
  async createAttachment(insertAttachment: InsertAttachment): Promise<Attachment> {
    const [attachment] = await db
      .insert(attachments)
      .values(insertAttachment)
      .returning();
    return attachment;
  }
  
  async updateAttachment(id: number, updateData: Partial<Attachment>): Promise<Attachment | undefined> {
    const [updatedAttachment] = await db
      .update(attachments)
      .set(updateData)
      .where(eq(attachments.id, id))
      .returning();
    return updatedAttachment || undefined;
  }
  
  async deleteAttachment(id: number): Promise<boolean> {
    const result = await db
      .delete(attachments)
      .where(eq(attachments.id, id))
      .returning({ id: attachments.id });
    return result.length > 0;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
