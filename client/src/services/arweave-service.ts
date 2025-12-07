/**
 * Arweave Service for Chronos Vault
 * 
 * Client-side service for interacting with Arweave storage via the API
 */

import { apiRequest } from '@/lib/queryClient';
import { UploadOptions, UploadResult, StorageStatus, StorageError, FileStatus } from '../../../shared/types/storage';

/**
 * ArweaveStorageClient provides client-side methods for working with
 * Arweave permanent storage through the backend API
 */
export class ArweaveStorageClient {
  /**
   * Get the current status of the storage service
   * @returns Promise resolving to storage status
   */
  async getStatus(): Promise<StorageStatus> {
    try {
      const response = await apiRequest('GET', '/api/storage/status');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting storage status:', error);
      return {
        available: false,
        gateway: 'https://arweave.net',
        network: 'mainnet'
      };
    }
  }

  /**
   * Upload a file to Arweave permanent storage
   * 
   * @param file File to upload
   * @param vaultId ID of the vault to store the file in
   * @param options Upload options
   * @returns Promise resolving to upload result
   */
  async uploadFile(
    file: File,
    vaultId: number,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vaultId', vaultId.toString());
      formData.append('fileName', file.name);
      formData.append('fileType', file.type);
      
      // Add options
      if (options.encrypt !== undefined) {
        formData.append('encrypt', options.encrypt.toString());
      }
      
      if (options.securityLevel) {
        formData.append('securityLevel', options.securityLevel);
      }
      
      if (options.crossChainVerify !== undefined) {
        formData.append('crossChainVerify', options.crossChainVerify.toString());
      }
      
      if (options.tags) {
        formData.append('tags', JSON.stringify(options.tags));
      }
      
      // Set up progress tracking if provided
      const uploadOptions: RequestInit = {
        method: 'POST',
        body: formData,
        // Don't use the standard apiRequest here because we need to handle FormData
        headers: {}
      };
      
      // Track progress if callback provided
      if (options.onProgress) {
        const xhr = new XMLHttpRequest();
        
        const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable && options.onProgress) {
              const progress = Math.round((event.loaded / event.total) * 100);
              options.onProgress(progress);
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText);
                resolve(result);
              } catch (e) {
                reject(new Error('Invalid response format'));
              }
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText);
                reject(errorData);
              } catch (e) {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          });
          
          xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
          });
          
          xhr.addEventListener('abort', () => {
            reject(new Error('Upload was aborted'));
          });
        });
        
        // Start the upload
        xhr.open('POST', '/api/storage/upload');
        xhr.send(formData);
        
        return uploadPromise;
      } else {
        // Use standard fetch without progress tracking
        const response = await fetch('/api/storage/upload', uploadOptions);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw errorData;
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Get a download URL for a file
   * 
   * @param transactionId Arweave transaction ID
   * @returns String URL to download the file
   */
  getFileUrl(transactionId: string): string {
    return `/api/storage/file/${transactionId}`;
  }

  /**
   * Verify a file exists on Arweave
   * 
   * @param transactionId Arweave transaction ID
   * @returns Promise resolving to verification result
   */
  async verifyFile(transactionId: string): Promise<{ verified: boolean }> {
    try {
      const response = await apiRequest('GET', `/api/storage/verify/${transactionId}`);
      return await response.json();
    } catch (error) {
      console.error('Error verifying file:', error);
      return { verified: false };
    }
  }

  /**
   * Get transaction information
   * 
   * @param transactionId Arweave transaction ID
   * @returns Promise resolving to transaction data
   */
  async getTransactionInfo(transactionId: string): Promise<any> {
    try {
      const response = await apiRequest('GET', `/api/storage/transaction/${transactionId}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting transaction info:', error);
      throw error;
    }
  }

  /**
   * Calculate the cost to upload a file of a given size
   * 
   * @param sizeInBytes Size of the file in bytes
   * @returns Promise resolving to the cost in winston
   */
  async calculateUploadCost(sizeInBytes: number): Promise<{ cost: string }> {
    try {
      const response = await apiRequest('POST', '/api/storage/cost', { sizeInBytes });
      return await response.json();
    } catch (error) {
      console.error('Error calculating upload cost:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const arweaveStorage = new ArweaveStorageClient();
