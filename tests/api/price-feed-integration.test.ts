/**
 * Price Feed Integration Tests
 * 
 * These tests verify that the Chronos Vault application can correctly connect to
 * and retrieve price data from Chainlink oracles on various testnets.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chainlinkOracleService, type PriceFeed, type Network } from '../../client/src/services/chainlink-oracle-service';

// Networks to test
const NETWORKS: Network[] = ['ethereum', 'solana', 'ton', 'bitcoin'];

// Pairs to verify across networks
const PAIRS_TO_CHECK = ['BTC/USD', 'ETH/USD'];

describe('Chainlink Oracle Service Integration Tests', () => {
  
  beforeAll(() => {
    // Clear cache to ensure fresh data fetching
    chainlinkOracleService.clearCache();
  });

  // Test general price feed functionality across all networks
  describe('Price Feed Data Retrieval', () => {
    
    for (const network of NETWORKS) {
      it(`should retrieve price feeds from ${network} testnet`, async () => {
        const feeds = await chainlinkOracleService.getPriceFeeds(network);
        
        // Verify we got at least some feeds
        expect(feeds.length).toBeGreaterThan(0);
        
        // Check that each feed has the expected structure
        feeds.forEach(feed => {
          expect(feed).toHaveProperty('id');
          expect(feed).toHaveProperty('name');
          expect(feed).toHaveProperty('pair');
          expect(feed).toHaveProperty('address');
          expect(feed).toHaveProperty('value');
          expect(feed).toHaveProperty('decimals');
          expect(feed).toHaveProperty('timestamp');
          expect(feed).toHaveProperty('lastUpdate');
          expect(feed).toHaveProperty('change24h');
          expect(feed).toHaveProperty('network');
          
          // Check that value is a number greater than 0
          expect(feed.value).toBeGreaterThan(0);
          
          // Check that network matches the requested network
          expect(feed.network).toBe(network);
        });
      }, 10000); // Increase timeout for network requests
    }
    
    // Test specific price feed retrieval
    describe('Specific Asset Price Retrieval', () => {
      for (const network of NETWORKS) {
        for (const asset of ['BTC', 'ETH']) {
          it(`should retrieve ${asset} price feed from ${network} testnet`, async () => {
            const feed = await chainlinkOracleService.getPriceFeed(asset, network);
            
            // Some networks might not have all assets, so only validate the ones that exist
            if (feed) {
              expect(feed.pair.startsWith(asset)).toBe(true);
              expect(feed.value).toBeGreaterThan(0);
              expect(feed.network).toBe(network);
            }
          }, 5000);
        }
      }
    });
  });
  
  // Test cross-chain price feed consistency
  describe('Cross-Chain Price Consistency', () => {
    
    let priceFeeds: Record<Network, PriceFeed[]> = {} as any;
    
    beforeAll(async () => {
      // Fetch price feeds from all networks
      for (const network of NETWORKS) {
        priceFeeds[network] = await chainlinkOracleService.getPriceFeeds(network);
      }
    });
    
    for (const pair of PAIRS_TO_CHECK) {
      it(`should have reasonably consistent ${pair} price across testnets`, () => {
        const prices: number[] = [];
        const networksWithPair: Network[] = [];
        
        // Collect prices for this pair across networks
        for (const network of NETWORKS) {
          const feed = priceFeeds[network].find(f => f.pair === pair);
          if (feed) {
            prices.push(feed.value);
            networksWithPair.push(network);
          }
        }
        
        // Skip test if less than 2 networks have this pair
        if (prices.length < 2) {
          console.log(`Skipping ${pair} consistency test - not enough networks have this pair`);
          return;
        }
        
        // Calculate average price
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
        // Verify that prices across networks are within 5% of each other
        // This is a reasonable tolerance for testnet oracles which may update at different frequencies
        for (let i = 0; i < prices.length; i++) {
          const priceDiffPercent = Math.abs((prices[i] - avgPrice) / avgPrice) * 100;
          expect(priceDiffPercent).toBeLessThan(5); // 5% tolerance
          
          console.log(`${pair} on ${networksWithPair[i]}: ${prices[i]} USD (${priceDiffPercent.toFixed(2)}% from average)`);
        }
      });
    }
  });
  
  // Test technical indicators (where available)
  describe('Technical Indicators', () => {
    it('should retrieve technical indicators for BTC on ethereum testnet', async () => {
      const indicators = await chainlinkOracleService.getTechnicalIndicators('BTC', 'ethereum');
      
      expect(indicators.length).toBeGreaterThan(0);
      
      // Check first indicator has expected structure
      const firstIndicator = indicators[0];
      expect(firstIndicator).toHaveProperty('id');
      expect(firstIndicator).toHaveProperty('name');
      expect(firstIndicator).toHaveProperty('type');
      expect(firstIndicator).toHaveProperty('asset');
      expect(firstIndicator).toHaveProperty('value');
      expect(firstIndicator).toHaveProperty('timestamp');
      expect(firstIndicator).toHaveProperty('status');
      expect(firstIndicator).toHaveProperty('network');
      
      // Verify the asset matches what we requested
      expect(firstIndicator.asset).toBe('BTC');
      expect(firstIndicator.network).toBe('ethereum');
    });
  });
  
  // Test market alerts
  describe('Market Alerts', () => {
    it('should create and retrieve market alerts', async () => {
      const testAsset = 'BTC';
      const testNetwork = 'ethereum';
      
      // Create a new alert
      const alertResult = await chainlinkOracleService.createAlert(
        testAsset,
        'price',
        120000, // threshold
        'above',
        '1D',
        testNetwork
      );
      
      expect(alertResult).toHaveProperty('success');
      expect(alertResult).toHaveProperty('alertId');
      expect(alertResult.success).toBe(true);
      
      // Retrieve alerts and verify our new one exists
      const alerts = await chainlinkOracleService.getMarketAlerts(testAsset, testNetwork);
      
      const createdAlert = alerts.find(alert => alert.id === alertResult.alertId);
      expect(createdAlert).toBeDefined();
      
      if (createdAlert) {
        expect(createdAlert.assetPair).toBe(`${testAsset}/USD`);
        expect(createdAlert.threshold).toBe(120000);
        expect(createdAlert.direction).toBe('above');
        expect(createdAlert.network).toBe(testNetwork);
      }
      
      // Delete the alert
      const deleteResult = await chainlinkOracleService.deleteAlert(alertResult.alertId);
      expect(deleteResult.success).toBe(true);
    });
  });
  
  afterAll(() => {
    // Clean up
    chainlinkOracleService.clearCache();
  });
});