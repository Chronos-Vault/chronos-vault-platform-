import { 
  users, type User, type InsertUser,
  vaults, type Vault, type InsertVault,
  beneficiaries, type Beneficiary, type InsertBeneficiary,
  attachments, type Attachment, type InsertAttachment,
  chainContracts, type ChainContract, type InsertChainContract,
  crossChainTransactions, type CrossChainTransaction, type InsertCrossChainTransaction,
  securityIncidents, type SecurityIncident, type InsertSecurityIncident,
  signatureRequests, type SignatureRequest, type InsertSignatureRequest,
  signatures, type Signature, type InsertSignature
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
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
  
  // Chain contract methods
  getChainContract(id: number): Promise<ChainContract | undefined>;
  getChainContractsByType(contractType: string): Promise<ChainContract[]>;
  getChainContractsByBlockchain(blockchain: string): Promise<ChainContract[]>;
  createChainContract(contract: InsertChainContract): Promise<ChainContract>;
  updateChainContract(id: number, contract: Partial<ChainContract>): Promise<ChainContract | undefined>;
  deleteChainContract(id: number): Promise<boolean>;
  
  // Cross-chain transaction methods
  getCrossChainTransaction(id: number): Promise<CrossChainTransaction | undefined>;
  getCrossChainTransactionsByVault(vaultId: number): Promise<CrossChainTransaction[]>;
  getCrossChainTransactionsByStatus(status: string): Promise<CrossChainTransaction[]>;
  createCrossChainTransaction(transaction: InsertCrossChainTransaction): Promise<CrossChainTransaction>;
  updateCrossChainTransaction(id: number, transaction: Partial<CrossChainTransaction>): Promise<CrossChainTransaction | undefined>;
  
  // Security incident methods
  getSecurityIncident(id: number): Promise<SecurityIncident | undefined>;
  getSecurityIncidentsByVault(vaultId: number): Promise<SecurityIncident[]>;
  getSecurityIncidentsBySeverity(severity: string): Promise<SecurityIncident[]>;
  createSecurityIncident(incident: InsertSecurityIncident): Promise<SecurityIncident>;
  updateSecurityIncident(id: number, incident: Partial<SecurityIncident>): Promise<SecurityIncident | undefined>;
  resolveSecurityIncident(id: number, resolutionDetails: string): Promise<SecurityIncident | undefined>;
  
  // Multi-signature request methods
  getSignatureRequest(id: number): Promise<SignatureRequest | undefined>;
  getSignatureRequestsByVault(vaultId: number): Promise<SignatureRequest[]>;
  getSignatureRequestsByStatus(status: string): Promise<SignatureRequest[]>;
  getSignatureRequestsByRequester(requesterAddress: string): Promise<SignatureRequest[]>;
  createSignatureRequest(request: InsertSignatureRequest): Promise<SignatureRequest>;
  updateSignatureRequest(id: number, request: Partial<SignatureRequest>): Promise<SignatureRequest | undefined>;
  completeSignatureRequest(id: number): Promise<SignatureRequest | undefined>;
  
  // Signature methods
  getSignature(id: number): Promise<Signature | undefined>;
  getSignaturesByRequest(requestId: number): Promise<Signature[]>;
  getSignaturesBySigner(signerAddress: string): Promise<Signature[]>;
  createSignature(signature: InsertSignature): Promise<Signature>;
  deleteSignature(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vaults: Map<number, Vault>;
  private beneficiaries: Map<number, Beneficiary>;
  private attachments: Map<number, Attachment>;
  private chainContracts: Map<number, ChainContract>;
  private crossChainTransactions: Map<number, CrossChainTransaction>;
  private securityIncidents: Map<number, SecurityIncident>;
  private signatureRequests: Map<number, SignatureRequest>;
  private signatures: Map<number, Signature>;
  private currentUserId: number;
  private currentVaultId: number;
  private currentBeneficiaryId: number;
  private currentAttachmentId: number;
  private currentChainContractId: number;
  private currentCrossChainTransactionId: number;
  private currentSecurityIncidentId: number;
  private currentSignatureRequestId: number;
  private currentSignatureId: number;

  constructor() {
    this.users = new Map();
    this.vaults = new Map();
    this.beneficiaries = new Map();
    this.attachments = new Map();
    this.chainContracts = new Map();
    this.crossChainTransactions = new Map();
    this.securityIncidents = new Map();
    this.signatureRequests = new Map();
    this.signatures = new Map();
    this.currentUserId = 1;
    this.currentVaultId = 1;
    this.currentBeneficiaryId = 1;
    this.currentAttachmentId = 1;
    this.currentChainContractId = 1;
    this.currentCrossChainTransactionId = 1;
    this.currentSecurityIncidentId = 1;
    this.currentSignatureRequestId = 1;
    this.currentSignatureId = 1;
    
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
      walletAddress: insertUser.walletAddress || null,
      email: insertUser.email || null,
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null,
      subscriptionStatus: insertUser.subscriptionStatus || null,
      metadata: insertUser.metadata || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
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
      ethereumContractAddress: insertVault.ethereumContractAddress ?? null,
      solanaContractAddress: insertVault.solanaContractAddress ?? null,
      tonContractAddress: insertVault.tonContractAddress ?? null,
      securityLevel: insertVault.securityLevel ?? 1,
      crossChainEnabled: insertVault.crossChainEnabled ?? false,
      privacyEnabled: insertVault.privacyEnabled ?? false,
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
  
  // Chain contract methods
  async getChainContract(id: number): Promise<ChainContract | undefined> {
    return this.chainContracts.get(id);
  }
  
  async getChainContractsByType(contractType: string): Promise<ChainContract[]> {
    return Array.from(this.chainContracts.values()).filter(
      (contract) => contract.contractType === contractType
    );
  }
  
  async getChainContractsByBlockchain(blockchain: string): Promise<ChainContract[]> {
    return Array.from(this.chainContracts.values()).filter(
      (contract) => contract.blockchain === blockchain
    );
  }
  
  async createChainContract(insertContract: InsertChainContract): Promise<ChainContract> {
    const id = this.currentChainContractId++;
    const contract: ChainContract = { 
      ...insertContract, 
      id,
      deployedAt: new Date(),
      abiReference: insertContract.abiReference || null,
      deploymentTx: insertContract.deploymentTx || null,
      isActive: insertContract.isActive ?? true,
      metadata: insertContract.metadata || {}
    };
    this.chainContracts.set(id, contract);
    return contract;
  }
  
  async updateChainContract(id: number, updateData: Partial<ChainContract>): Promise<ChainContract | undefined> {
    const contract = this.chainContracts.get(id);
    if (!contract) return undefined;
    
    const updatedContract = { ...contract, ...updateData };
    this.chainContracts.set(id, updatedContract);
    return updatedContract;
  }
  
  async deleteChainContract(id: number): Promise<boolean> {
    return this.chainContracts.delete(id);
  }
  
  // Cross-chain transaction methods
  async getCrossChainTransaction(id: number): Promise<CrossChainTransaction | undefined> {
    return this.crossChainTransactions.get(id);
  }
  
  async getCrossChainTransactionsByVault(vaultId: number): Promise<CrossChainTransaction[]> {
    return Array.from(this.crossChainTransactions.values()).filter(
      (transaction) => transaction.vaultId === vaultId
    );
  }
  
  async getCrossChainTransactionsByStatus(status: string): Promise<CrossChainTransaction[]> {
    return Array.from(this.crossChainTransactions.values()).filter(
      (transaction) => transaction.status === status
    );
  }
  
  async createCrossChainTransaction(insertTransaction: InsertCrossChainTransaction): Promise<CrossChainTransaction> {
    const id = this.currentCrossChainTransactionId++;
    const transaction: CrossChainTransaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date(),
      targetTxHash: insertTransaction.targetTxHash ?? null,
      amount: insertTransaction.amount ?? null,
      completedAt: null,
      errorDetails: insertTransaction.errorDetails ?? null,
      metadata: insertTransaction.metadata ?? {}
    };
    this.crossChainTransactions.set(id, transaction);
    return transaction;
  }
  
  async updateCrossChainTransaction(id: number, updateData: Partial<CrossChainTransaction>): Promise<CrossChainTransaction | undefined> {
    const transaction = this.crossChainTransactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updateData };
    this.crossChainTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // Security incident methods
  async getSecurityIncident(id: number): Promise<SecurityIncident | undefined> {
    return this.securityIncidents.get(id);
  }
  
  async getSecurityIncidentsByVault(vaultId: number): Promise<SecurityIncident[]> {
    return Array.from(this.securityIncidents.values()).filter(
      (incident) => incident.vaultId === vaultId
    );
  }
  
  async getSecurityIncidentsBySeverity(severity: string): Promise<SecurityIncident[]> {
    return Array.from(this.securityIncidents.values()).filter(
      (incident) => incident.severity === severity
    );
  }
  
  async createSecurityIncident(insertIncident: InsertSecurityIncident): Promise<SecurityIncident> {
    const id = this.currentSecurityIncidentId++;
    const incident: SecurityIncident = { 
      ...insertIncident, 
      id,
      detectedAt: new Date(),
      resolvedAt: null,
      vaultId: insertIncident.vaultId ?? null,
      blockchain: insertIncident.blockchain ?? null,
      aiConfidence: insertIncident.aiConfidence ?? null,
      transactionHash: insertIncident.transactionHash ?? null,
      resolutionDetails: insertIncident.resolutionDetails ?? null,
      metadata: insertIncident.metadata ?? {}
    };
    this.securityIncidents.set(id, incident);
    return incident;
  }
  
  async updateSecurityIncident(id: number, updateData: Partial<SecurityIncident>): Promise<SecurityIncident | undefined> {
    const incident = this.securityIncidents.get(id);
    if (!incident) return undefined;
    
    const updatedIncident = { ...incident, ...updateData };
    this.securityIncidents.set(id, updatedIncident);
    return updatedIncident;
  }
  
  async resolveSecurityIncident(id: number, resolutionDetails: string): Promise<SecurityIncident | undefined> {
    const incident = this.securityIncidents.get(id);
    if (!incident) return undefined;
    
    const resolvedIncident = { 
      ...incident,
      resolvedAt: new Date(),
      resolutionDetails
    };
    
    this.securityIncidents.set(id, resolvedIncident);
    return resolvedIncident;
  }

  // Multi-signature request methods
  async getSignatureRequest(id: number): Promise<SignatureRequest | undefined> {
    return this.signatureRequests.get(id);
  }

  async getSignatureRequestsByVault(vaultId: number): Promise<SignatureRequest[]> {
    return Array.from(this.signatureRequests.values()).filter(
      (request) => request.vaultId === vaultId
    );
  }

  async getSignatureRequestsByStatus(status: string): Promise<SignatureRequest[]> {
    return Array.from(this.signatureRequests.values()).filter(
      (request) => request.status === status
    );
  }

  async getSignatureRequestsByRequester(requesterAddress: string): Promise<SignatureRequest[]> {
    return Array.from(this.signatureRequests.values()).filter(
      (request) => request.requesterAddress === requesterAddress
    );
  }

  async createSignatureRequest(insertRequest: InsertSignatureRequest): Promise<SignatureRequest> {
    const id = this.currentSignatureRequestId++;
    const request: SignatureRequest = {
      ...insertRequest,
      id,
      status: insertRequest.status ?? "pending",
      createdAt: new Date(),
      executedAt: null,
      requesterName: insertRequest.requesterName ?? null,
      description: insertRequest.description ?? null,
      metadata: insertRequest.metadata ?? {}
    };
    this.signatureRequests.set(id, request);
    return request;
  }

  async updateSignatureRequest(id: number, updateData: Partial<SignatureRequest>): Promise<SignatureRequest | undefined> {
    const request = this.signatureRequests.get(id);
    if (!request) return undefined;

    const updatedRequest = { ...request, ...updateData };
    this.signatureRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async completeSignatureRequest(id: number): Promise<SignatureRequest | undefined> {
    const request = this.signatureRequests.get(id);
    if (!request) return undefined;

    const completedRequest = {
      ...request,
      status: "executed",
      executedAt: new Date()
    };

    this.signatureRequests.set(id, completedRequest);
    return completedRequest;
  }

  // Signature methods
  async getSignature(id: number): Promise<Signature | undefined> {
    return this.signatures.get(id);
  }

  async getSignaturesByRequest(requestId: number): Promise<Signature[]> {
    return Array.from(this.signatures.values()).filter(
      (signature) => signature.requestId === requestId
    );
  }

  async getSignaturesBySigner(signerAddress: string): Promise<Signature[]> {
    return Array.from(this.signatures.values()).filter(
      (signature) => signature.signerAddress === signerAddress
    );
  }

  async createSignature(insertSignature: InsertSignature): Promise<Signature> {
    const id = this.currentSignatureId++;
    const signature: Signature = {
      ...insertSignature,
      id,
      signedAt: new Date(),
      signerName: insertSignature.signerName ?? null,
      weight: insertSignature.weight ?? 1,
      metadata: insertSignature.metadata ?? {}
    };
    this.signatures.set(id, signature);
    return signature;
  }

  async deleteSignature(id: number): Promise<boolean> {
    return this.signatures.delete(id);
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
  
  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async getVault(id: number): Promise<Vault | undefined> {
    const [vault] = await db.select().from(vaults).where(eq(vaults.id, id));
    return vault || undefined;
  }

  async getVaultsByUser(userId: number): Promise<Vault[]> {
    return await db.select().from(vaults).where(eq(vaults.userId, userId));
  }

  async createVault(insertVault: InsertVault): Promise<Vault> {
    try {
      console.log('Creating vault with data:', JSON.stringify(insertVault));
      
      // Ensure unlockDate is a proper Date object if it's a string ISO date
      let processedVaultData = {...insertVault};
      if (typeof processedVaultData.unlockDate === 'string') {
        try {
          processedVaultData.unlockDate = new Date(processedVaultData.unlockDate);
          console.log('Converted unlockDate string to Date:', processedVaultData.unlockDate);
        } catch (dateError) {
          console.error('Error parsing unlock date:', dateError);
          // If conversion fails, use current date + 1 year as fallback
          const fallbackDate = new Date();
          fallbackDate.setFullYear(fallbackDate.getFullYear() + 1);
          processedVaultData.unlockDate = fallbackDate;
        }
      }
      
      // Convert any JSON objects to proper jsonb for postgres
      if (processedVaultData.metadata && typeof processedVaultData.metadata === 'object') {
        try {
          console.log('Processing metadata object');
          // Metadata is already an object, which is what Drizzle expects
        } catch (metadataError) {
          console.error('Error processing metadata:', metadataError);
        }
      }
      
      const [vault] = await db
        .insert(vaults)
        .values(processedVaultData)
        .returning();
        
      console.log('Vault created successfully:', JSON.stringify(vault));
      return vault;
    } catch (error) {
      console.error('Error in DatabaseStorage.createVault:', error);
      throw error;
    }
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
  
  // Chain contract methods
  async getChainContract(id: number): Promise<ChainContract | undefined> {
    const [contract] = await db.select().from(chainContracts).where(eq(chainContracts.id, id));
    return contract || undefined;
  }
  
  async getChainContractsByType(contractType: string): Promise<ChainContract[]> {
    return await db.select().from(chainContracts).where(eq(chainContracts.contractType, contractType));
  }
  
  async getChainContractsByBlockchain(blockchain: string): Promise<ChainContract[]> {
    return await db.select().from(chainContracts).where(eq(chainContracts.blockchain, blockchain));
  }
  
  async createChainContract(contract: InsertChainContract): Promise<ChainContract> {
    const [newContract] = await db
      .insert(chainContracts)
      .values(contract)
      .returning();
    return newContract;
  }
  
  async updateChainContract(id: number, contract: Partial<ChainContract>): Promise<ChainContract | undefined> {
    const [updatedContract] = await db
      .update(chainContracts)
      .set(contract)
      .where(eq(chainContracts.id, id))
      .returning();
    return updatedContract || undefined;
  }
  
  async deleteChainContract(id: number): Promise<boolean> {
    const result = await db
      .delete(chainContracts)
      .where(eq(chainContracts.id, id))
      .returning({ id: chainContracts.id });
    return result.length > 0;
  }
  
  // Cross-chain transaction methods
  async getCrossChainTransaction(id: number): Promise<CrossChainTransaction | undefined> {
    const [transaction] = await db
      .select()
      .from(crossChainTransactions)
      .where(eq(crossChainTransactions.id, id));
    return transaction || undefined;
  }
  
  async getCrossChainTransactionsByVault(vaultId: number): Promise<CrossChainTransaction[]> {
    return await db
      .select()
      .from(crossChainTransactions)
      .where(eq(crossChainTransactions.vaultId, vaultId));
  }
  
  async getCrossChainTransactionsByStatus(status: string): Promise<CrossChainTransaction[]> {
    return await db
      .select()
      .from(crossChainTransactions)
      .where(eq(crossChainTransactions.status, status));
  }
  
  async createCrossChainTransaction(transaction: InsertCrossChainTransaction): Promise<CrossChainTransaction> {
    const [newTransaction] = await db
      .insert(crossChainTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }
  
  async updateCrossChainTransaction(id: number, transaction: Partial<CrossChainTransaction>): Promise<CrossChainTransaction | undefined> {
    const [updatedTransaction] = await db
      .update(crossChainTransactions)
      .set(transaction)
      .where(eq(crossChainTransactions.id, id))
      .returning();
    return updatedTransaction || undefined;
  }
  
  // Security incident methods
  async getSecurityIncident(id: number): Promise<SecurityIncident | undefined> {
    const [incident] = await db
      .select()
      .from(securityIncidents)
      .where(eq(securityIncidents.id, id));
    return incident || undefined;
  }
  
  async getSecurityIncidentsByVault(vaultId: number): Promise<SecurityIncident[]> {
    return await db
      .select()
      .from(securityIncidents)
      .where(eq(securityIncidents.vaultId, vaultId));
  }
  
  async getSecurityIncidentsBySeverity(severity: string): Promise<SecurityIncident[]> {
    return await db
      .select()
      .from(securityIncidents)
      .where(eq(securityIncidents.severity, severity));
  }
  
  async createSecurityIncident(incident: InsertSecurityIncident): Promise<SecurityIncident> {
    const [newIncident] = await db
      .insert(securityIncidents)
      .values(incident)
      .returning();
    return newIncident;
  }
  
  async updateSecurityIncident(id: number, incident: Partial<SecurityIncident>): Promise<SecurityIncident | undefined> {
    const [updatedIncident] = await db
      .update(securityIncidents)
      .set(incident)
      .where(eq(securityIncidents.id, id))
      .returning();
    return updatedIncident || undefined;
  }
  
  async resolveSecurityIncident(id: number, resolutionDetails: string): Promise<SecurityIncident | undefined> {
    const [resolvedIncident] = await db
      .update(securityIncidents)
      .set({
        resolvedAt: new Date(),
        resolutionDetails
      })
      .where(eq(securityIncidents.id, id))
      .returning();
    return resolvedIncident || undefined;
  }

  // Multi-signature request methods
  async getSignatureRequest(id: number): Promise<SignatureRequest | undefined> {
    const [request] = await db
      .select()
      .from(signatureRequests)
      .where(eq(signatureRequests.id, id));
    return request || undefined;
  }

  async getSignatureRequestsByVault(vaultId: number): Promise<SignatureRequest[]> {
    return await db
      .select()
      .from(signatureRequests)
      .where(eq(signatureRequests.vaultId, vaultId));
  }

  async getSignatureRequestsByStatus(status: string): Promise<SignatureRequest[]> {
    return await db
      .select()
      .from(signatureRequests)
      .where(eq(signatureRequests.status, status));
  }

  async getSignatureRequestsByRequester(requesterAddress: string): Promise<SignatureRequest[]> {
    return await db
      .select()
      .from(signatureRequests)
      .where(eq(signatureRequests.requesterAddress, requesterAddress));
  }

  async createSignatureRequest(request: InsertSignatureRequest): Promise<SignatureRequest> {
    const [newRequest] = await db
      .insert(signatureRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateSignatureRequest(id: number, request: Partial<SignatureRequest>): Promise<SignatureRequest | undefined> {
    const [updatedRequest] = await db
      .update(signatureRequests)
      .set(request)
      .where(eq(signatureRequests.id, id))
      .returning();
    return updatedRequest || undefined;
  }

  async completeSignatureRequest(id: number): Promise<SignatureRequest | undefined> {
    const [completedRequest] = await db
      .update(signatureRequests)
      .set({
        status: "executed",
        executedAt: new Date()
      })
      .where(eq(signatureRequests.id, id))
      .returning();
    return completedRequest || undefined;
  }

  // Signature methods
  async getSignature(id: number): Promise<Signature | undefined> {
    const [signature] = await db
      .select()
      .from(signatures)
      .where(eq(signatures.id, id));
    return signature || undefined;
  }

  async getSignaturesByRequest(requestId: number): Promise<Signature[]> {
    return await db
      .select()
      .from(signatures)
      .where(eq(signatures.requestId, requestId));
  }

  async getSignaturesBySigner(signerAddress: string): Promise<Signature[]> {
    return await db
      .select()
      .from(signatures)
      .where(eq(signatures.signerAddress, signerAddress));
  }

  async createSignature(signature: InsertSignature): Promise<Signature> {
    const [newSignature] = await db
      .insert(signatures)
      .values(signature)
      .returning();
    return newSignature;
  }

  async deleteSignature(id: number): Promise<boolean> {
    const result = await db
      .delete(signatures)
      .where(eq(signatures.id, id))
      .returning({ id: signatures.id });
    return result.length > 0;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
