import { WebBundlr } from '@bundlr-network/client';
import { UploadedMedia, MediaType } from '@/components/vault/media-uploader';
import { Buffer } from 'buffer';

/**
 * ArweaveService provides functionality for uploading files to the Arweave network
 * using Bundlr as a transaction bundling service.
 */
class ArweaveService {
  private bundlr: WebBundlr | null = null;
  private initialized = false;
  private initializing = false;
  
  /**
   * Check if the service is initialized
   * @returns True if initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Initialize the Bundlr client with the user's wallet
   * @param provider - Injected web3 provider from the user's wallet
   */
  async initialize(provider: any): Promise<boolean> {
    if (this.initialized) return true;
    if (this.initializing) {
      // Wait for initialization to complete
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (this.initialized) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
      return true;
    }

    try {
      this.initializing = true;
      // Create a new Bundlr client connecting to the Arweave network
      // For testnet/development use the devnet: "https://devnet.bundlr.network"
      this.bundlr = new WebBundlr(
        "https://devnet.bundlr.network", 
        "ethereum",  // The currency to pay with
        provider,    // Provider from user's wallet
        {
          providerUrl: "https://ethereum-goerli.publicnode.com", // Use Goerli testnet for development
        }
      );
      
      // Initialize the bundlr client
      await this.bundlr.ready();
      
      this.initialized = true;
      this.initializing = false;
      console.log("Arweave service initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize Arweave service:", error);
      this.initializing = false;
      return false;
    }
  }

  /**
   * Get the balance of the connected wallet
   * @returns Balance in the native currency
   */
  async getBalance(): Promise<string> {
    if (!this.bundlr || !this.initialized) {
      throw new Error("Arweave service not initialized");
    }
    
    const address = await this.bundlr.address;
    if (!address) {
      throw new Error("Failed to get wallet address");
    }
    const balance = await this.bundlr.getBalance(address);
    return this.bundlr.utils.unitConverter(balance).toString();
  }

  /**
   * Upload a file to Arweave
   * @param file - File to upload
   * @param tags - Optional metadata tags
   * @returns Object containing transaction ID and other metadata
   */
  async uploadFile(file: File, tags: { name: string; value: string }[] = []): Promise<UploadedMedia> {
    if (!this.bundlr || !this.initialized) {
      throw new Error("Arweave service not initialized");
    }
    
    try {
      // Determine media type
      const mediaType = this.getMediaType(file.type);
      
      // Add standard tags
      const standardTags = [
        { name: "Content-Type", value: file.type },
        { name: "App-Name", value: "Chronos Vault" },
        { name: "File-Name", value: file.name },
        { name: "Media-Type", value: mediaType },
        { name: "Upload-Time", value: Date.now().toString() },
      ];
      
      // Combine user-provided tags with standard tags
      const allTags = [...standardTags, ...tags];
      
      // Get file data as arrayBuffer and convert to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload the file to Arweave
      const response = await this.bundlr.upload(buffer, {
        tags: allTags
      });
      
      // For images, create a thumbnail
      let thumbnailUrl: string | undefined = undefined;
      if (mediaType === MediaType.IMAGE) {
        thumbnailUrl = URL.createObjectURL(file);
      }
      
      // Return the uploaded file metadata
      return {
        id: response.id,
        name: file.name,
        type: mediaType,
        size: file.size,
        contentType: file.type,
        url: `https://arweave.net/${response.id}`,
        thumbnailUrl,
        uploadedAt: Date.now()
      };
    } catch (error) {
      console.error("Failed to upload file to Arweave:", error);
      throw error;
    }
  }

  /**
   * Estimate the cost to upload a file
   * @param file - The file to estimate for
   * @returns The estimated cost in the native currency
   */
  async getUploadCost(file: File): Promise<string> {
    if (!this.bundlr || !this.initialized) {
      throw new Error("Arweave service not initialized");
    }
    
    try {
      const price = await this.bundlr.getPrice(file.size);
      return this.bundlr.utils.unitConverter(price).toString();
    } catch (error) {
      console.error("Failed to estimate upload cost:", error);
      throw error;
    }
  }

  /**
   * Determine the media type based on MIME type
   * @param mimeType - The MIME type of the file
   * @returns The categorized media type
   */
  private getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else if (
      mimeType === 'application/pdf' || 
      mimeType === 'application/msword' || 
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'text/plain'
    ) {
      return MediaType.DOCUMENT;
    } else {
      return MediaType.OTHER;
    }
  }
}

// Create a singleton instance
export const arweaveService = new ArweaveService();