import { 
  users, type User, type InsertUser,
  vaults, type Vault, type InsertVault,
  beneficiaries, type Beneficiary, type InsertBeneficiary
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vaults: Map<number, Vault>;
  private beneficiaries: Map<number, Beneficiary>;
  private currentUserId: number;
  private currentVaultId: number;
  private currentBeneficiaryId: number;

  constructor() {
    this.users = new Map();
    this.vaults = new Map();
    this.beneficiaries = new Map();
    this.currentUserId = 1;
    this.currentVaultId = 1;
    this.currentBeneficiaryId = 1;
    
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
    const user: User = { ...insertUser, id };
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
      isLocked: true
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
}

export const storage = new MemStorage();
