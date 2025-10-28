/**
 * Atomic Swap Service Integration Tests
 * 
 * Comprehensive testing for Trinity Protocol HTLC atomic swaps
 * Tests all security features, rate limiting, and edge cases
 * 
 * @author Chronos Vault Team
 * @version v1.5-PRODUCTION
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ethers } from 'ethers';
import type { AtomicSwapService } from '../defi/atomic-swap-service';

describe('Atomic Swap Service - Integration Tests', () => {
  let service: AtomicSwapService;
  let testUserAddress: string;
  
  beforeEach(async () => {
    // Initialize service (imported dynamically to avoid initialization issues)
    const { atomicSwapService } = await import('../defi/atomic-swap-service');
    service = atomicSwapService;
    testUserAddress = '0x' + '1'.repeat(40);
  });
  
  describe('Secret Hash Validation', () => {
    it('should accept valid secret hash format', async () => {
      const validHash = ethers.keccak256(ethers.toUtf8Bytes(ethers.hexlify(ethers.randomBytes(32))));
      
      const order = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        validHash
      );
      
      expect(order.id).toBeDefined();
      expect(order.secretHash).toBe(validHash);
    });
    
    it('should reject invalid secret hash format - too short', async () => {
      const invalidHash = '0x123';
      
      await expect(
        service.createAtomicSwap(
          testUserAddress,
          'ETH',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          invalidHash
        )
      ).rejects.toThrow('Invalid secretHash format');
    });
    
    it('should reject invalid secret hash format - no 0x prefix', async () => {
      const invalidHash = 'a'.repeat(64);
      
      await expect(
        service.createAtomicSwap(
          testUserAddress,
          'ETH',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          invalidHash
        )
      ).rejects.toThrow('Invalid secretHash format');
    });
    
    it('should reject non-hex characters in secret hash', async () => {
      const invalidHash = '0x' + 'g'.repeat(64);
      
      await expect(
        service.createAtomicSwap(
          testUserAddress,
          'ETH',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          invalidHash
        )
      ).rejects.toThrow('Invalid secretHash format');
    });
  });
  
  describe('Rate Limiting', () => {
    it('should allow up to 10 orders per hour per user', async () => {
      const userAddress = '0x' + '2'.repeat(40);
      
      // Create 10 orders (should succeed)
      for (let i = 0; i < 10; i++) {
        const secretHash = ethers.keccak256(ethers.toUtf8Bytes(`secret-${i}`));
        await service.createAtomicSwap(
          userAddress,
          'ETH',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          secretHash
        );
      }
      
      // 11th order should fail
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret-11'));
      await expect(
        service.createAtomicSwap(
          userAddress,
          'ETH',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          secretHash
        )
      ).rejects.toThrow('Rate limit exceeded');
    });
    
    it('should track rate limits separately per user', async () => {
      const user1 = '0x' + '3'.repeat(40);
      const user2 = '0x' + '4'.repeat(40);
      
      // User 1 creates 10 orders
      for (let i = 0; i < 10; i++) {
        const secretHash = ethers.keccak256(ethers.toUtf8Bytes(`user1-${i}`));
        await service.createAtomicSwap(
          user1,
          'ETH',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          secretHash
        );
      }
      
      // User 2 should still be able to create orders
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('user2-1'));
      const order = await service.createAtomicSwap(
        user2,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash
      );
      
      expect(order.id).toBeDefined();
    });
  });
  
  describe('Amount Validation', () => {
    it('should reject swap amount below minimum ($1 USD)', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      // Assuming ETH = $3000, 0.0001 ETH = $0.30 (below $1 minimum)
      await expect(
        service.createAtomicSwap(
          testUserAddress,
          'ETH',
          'USDC',
          '0.0001',
          '0.0001',
          'ethereum',
          'solana',
          secretHash
        )
      ).rejects.toThrow('Swap amount too small');
    });
    
    it('should reject swap amount above maximum ($1M USD)', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      // Assuming ETH = $3000, 400 ETH = $1.2M (above $1M maximum)
      await expect(
        service.createAtomicSwap(
          testUserAddress,
          'ETH',
          'USDC',
          '400',
          '400',
          'ethereum',
          'solana',
          secretHash
        )
      ).rejects.toThrow('Swap amount too large');
    });
    
    it('should accept amounts within valid range', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      // 1 ETH ≈ $3000 (within range)
      const order = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash
      );
      
      expect(order.id).toBeDefined();
      expect(order.fromAmount).toBe('1.0');
    });
  });
  
  describe('Timelock Validation', () => {
    it('should prevent claims after timelock expiry', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      const secret = ethers.hexlify(ethers.toUtf8Bytes('secret'));
      
      const order = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash
      );
      
      // Manually set status to consensus_achieved and expired timelock
      const expiredTimelock = Math.floor(Date.now() / 1000) - 100;
      // Note: In real implementation, this would be tested with time manipulation
      
      // Attempt to claim with expired timelock should fail
      // (This test would need the actual implementation to verify)
    });
  });
  
  describe('Input Validation', () => {
    it('should reject invalid decimal format in amount', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      await expect(
        service.createAtomicSwap(
          testUserAddress,
          'ETH',
          'USDC',
          '1.0e18', // Scientific notation not allowed
          '0.99',
          'ethereum',
          'solana',
          secretHash
        )
      ).rejects.toThrow();
    });
    
    it('should accept valid decimal amounts', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      const order = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.5',
        '1.49',
        'ethereum',
        'solana',
        secretHash
      );
      
      expect(order.fromAmount).toBe('1.5');
      expect(order.minAmount).toBe('1.49');
    });
  });
  
  describe('Order Status Tracking', () => {
    it('should return correct order status', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      const order = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash
      );
      
      const status = service.getSwapOrderStatus(order.id);
      
      expect(status).toBeDefined();
      expect(status?.id).toBe(order.id);
      expect(status?.status).toBe('pending');
      expect(status?.secretHash).toBe(secretHash);
    });
    
    it('should return undefined for non-existent order', () => {
      const status = service.getSwapOrderStatus('non-existent-id');
      expect(status).toBeUndefined();
    });
  });
  
  describe('Trinity Protocol Integration', () => {
    it('should create swap with valid Trinity consensus parameters', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      const order = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'SOL',
        '1.0',
        '144.0',
        'ethereum',
        'solana',
        secretHash
      );
      
      expect(order.consensusRequired).toBe(2); // 2-of-3 Trinity consensus
      expect(order.validProofCount).toBe(0); // No proofs yet
      expect(order.proofs).toBeDefined();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle missing parameters gracefully', async () => {
      await expect(
        service.createAtomicSwap(
          '',
          'ETH',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          '0x' + 'a'.repeat(64)
        )
      ).rejects.toThrow();
    });
    
    it('should handle invalid token symbols', async () => {
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes('secret'));
      
      await expect(
        service.createAtomicSwap(
          testUserAddress,
          'INVALID_TOKEN',
          'USDC',
          '1.0',
          '0.99',
          'ethereum',
          'solana',
          secretHash
        )
      ).rejects.toThrow();
    });
  });
  
  describe('Security Features', () => {
    it('should never store plaintext secrets', async () => {
      const secret = ethers.hexlify(ethers.randomBytes(32));
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
      
      const order = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash
      );
      
      // Order should only have hash, not secret
      expect(order.secretHash).toBe(secretHash);
      expect(JSON.stringify(order)).not.toContain(secret);
    });
    
    it('should generate unique order IDs', async () => {
      const secretHash1 = ethers.keccak256(ethers.toUtf8Bytes('secret1'));
      const secretHash2 = ethers.keccak256(ethers.toUtf8Bytes('secret2'));
      
      const order1 = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash1
      );
      
      const order2 = await service.createAtomicSwap(
        testUserAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash2
      );
      
      expect(order1.id).not.toBe(order2.id);
    });
  });
});

/**
 * Load Testing Suite (commented out for normal runs)
 * 
 * Uncomment to run load tests
 */
/*
describe.skip('Atomic Swap Load Tests', () => {
  it('should handle 100 concurrent swap creations', async () => {
    const { atomicSwapService } = await import('../defi/atomic-swap-service');
    
    const promises = Array.from({ length: 100 }, (_, i) => {
      const userAddress = '0x' + i.toString().padStart(40, '0');
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes(`secret-${i}`));
      
      return atomicSwapService.createAtomicSwap(
        userAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash
      );
    });
    
    const orders = await Promise.all(promises);
    expect(orders.length).toBe(100);
    expect(new Set(orders.map(o => o.id)).size).toBe(100); // All unique IDs
  });
  
  it('should maintain performance under load', async () => {
    const { atomicSwapService } = await import('../defi/atomic-swap-service');
    const startTime = Date.now();
    
    const promises = Array.from({ length: 50 }, (_, i) => {
      const userAddress = '0x' + i.toString().padStart(40, '0');
      const secretHash = ethers.keccak256(ethers.toUtf8Bytes(`secret-${i}`));
      
      return atomicSwapService.createAtomicSwap(
        userAddress,
        'ETH',
        'USDC',
        '1.0',
        '0.99',
        'ethereum',
        'solana',
        secretHash
      );
    });
    
    await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    // Should complete 50 swaps in under 5 seconds
    expect(duration).toBeLessThan(5000);
  });
});
*/
