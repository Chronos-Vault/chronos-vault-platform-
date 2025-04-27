/**
 * Anomaly Detection Service
 * 
 * This service uses statistical analysis and machine learning techniques
 * to detect anomalies in blockchain transactions and activities.
 */

import { BlockchainType } from './interfaces';

/**
 * Anomaly detection result data structure
 */
export interface AnomalyDetectionResult {
  id: string;
  blockchain: BlockchainType;
  address: string;
  timestamp: number;
  anomalyType: 'transaction_pattern' | 'volume_spike' | 'timing_anomaly' | 'address_behavior' | 'smart_contract_interaction' | 'other';
  confidenceScore: number; // 0.0-1.0
  details: string;
  relatedData?: any;
  acknowledged: boolean;
  falsePositive?: boolean;
}

/**
 * Scan parameters for anomaly detection
 */
export interface AnomalyScanParameters {
  lookbackDays?: number;        // How far back to scan
  sensitivityLevel?: number;    // 1-10, higher means more sensitive detection
  includeHistory?: boolean;     // Include historical transactions
  focusAreas?: Array<'transactions' | 'smart_contracts' | 'addresses' | 'tokens'>;
}

/**
 * Mock anomaly detection results for development
 */
const mockAnomalies: Record<string, AnomalyDetectionResult> = {};
const mockAddressAnomalies: Record<string, string[]> = {};
const mockLastScanTime: Record<string, number> = {};

/**
 * Anomaly Detection Service
 */
class AnomalyDetectionService {
  /**
   * Scan for anomalies for an address
   */
  async scanForAnomalies(
    address: string,
    parameters: AnomalyScanParameters = {}
  ): Promise<AnomalyDetectionResult[]> {
    // Update last scan time
    mockLastScanTime[address] = Date.now();
    
    // In a real implementation, this would run ML models and analysis
    // For now, we'll generate some mock anomalies
    const anomalies: AnomalyDetectionResult[] = [];
    
    // Transaction pattern anomaly (ETH)
    const ethAnomaly = this.createAnomalyResult(
      'ETH',
      address,
      'transaction_pattern',
      0.85,
      'Unusual transaction pattern detected: Sequential transfers to multiple new addresses'
    );
    anomalies.push(ethAnomaly);
    
    // Volume spike anomaly (SOL)
    const solAnomaly = this.createAnomalyResult(
      'SOL',
      address,
      'volume_spike',
      0.76,
      'Significant increase in transaction volume (425% above baseline)'
    );
    anomalies.push(solAnomaly);
    
    // Smart contract interaction anomaly (TON)
    const tonAnomaly = this.createAnomalyResult(
      'TON',
      address,
      'smart_contract_interaction',
      0.68,
      'Interaction with potentially malicious smart contract'
    );
    anomalies.push(tonAnomaly);
    
    // Lower confidence anomaly (MATIC)
    const maticAnomaly = this.createAnomalyResult(
      'MATIC',
      address,
      'timing_anomaly',
      0.42,
      'Unusual transaction timing outside of historical patterns'
    );
    anomalies.push(maticAnomaly);
    
    return anomalies;
  }
  
  /**
   * Get existing anomalies for an address
   */
  async getAnomaliesForAddress(address: string): Promise<AnomalyDetectionResult[]> {
    const anomalyIds = mockAddressAnomalies[address] || [];
    return anomalyIds.map(id => mockAnomalies[id]).filter(Boolean);
  }
  
  /**
   * Get the last scan time for an address
   */
  getLastScanTime(address: string): number {
    return mockLastScanTime[address] || 0;
  }
  
  /**
   * Mark an anomaly as acknowledged
   */
  async acknowledgeAnomaly(id: string, falsePositive?: boolean): Promise<boolean> {
    const anomaly = mockAnomalies[id];
    
    if (!anomaly) {
      return false;
    }
    
    // Update anomaly
    mockAnomalies[id] = {
      ...anomaly,
      acknowledged: true,
      falsePositive
    };
    
    return true;
  }
  
  /**
   * Create a new anomaly result
   */
  private createAnomalyResult(
    blockchain: BlockchainType,
    address: string,
    anomalyType: AnomalyDetectionResult['anomalyType'],
    confidenceScore: number,
    details: string,
    relatedData?: any
  ): AnomalyDetectionResult {
    // Generate ID for the anomaly
    const id = `anomaly-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create the anomaly
    const anomaly: AnomalyDetectionResult = {
      id,
      blockchain,
      address,
      timestamp: Date.now(),
      anomalyType,
      confidenceScore,
      details,
      relatedData,
      acknowledged: false
    };
    
    // Store the anomaly
    mockAnomalies[id] = anomaly;
    
    // Add to address anomalies
    if (!mockAddressAnomalies[address]) {
      mockAddressAnomalies[address] = [];
    }
    mockAddressAnomalies[address].push(id);
    
    return anomaly;
  }
}

// Singleton accessor function
let anomalyService: AnomalyDetectionService | null = null;

export function getAnomalyDetectionService(): AnomalyDetectionService {
  if (!anomalyService) {
    anomalyService = new AnomalyDetectionService();
  }
  return anomalyService;
}