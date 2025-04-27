/**
 * Olympic Vault Data Service
 * Handles Olympic-themed time-locked vaults tied to Olympic event dates
 */

// Olympic Vault Type
export interface OlympicVault {
  id: number;
  name: string;
  type: 'summer' | 'winter';
  location: string;
  year: number;
  startDate: string; // ISO date string
  unlockDate: string; // ISO date string
  tokenAmount: number;
  bonusPercentage: number;
  isUnlocked: boolean;
  olympicNumber: number; // e.g., XXXIII Summer Olympics
  unlockRequirements: string[];
}

/**
 * Service for Olympic-themed vaults
 */
export class OlympicVaultService {
  /**
   * Gets all Olympic vaults data
   */
  async getOlympicVaults(): Promise<OlympicVault[]> {
    // Summer and Winter Olympic data with accurate dates
    const vaults: OlympicVault[] = [
      // Past Olympics
      {
        id: 1,
        name: "Tokyo Olympics Vault",
        type: "summer",
        location: "Tokyo, Japan",
        year: 2021, // Delayed from 2020
        startDate: "2021-07-23T00:00:00Z",
        unlockDate: "2021-08-08T00:00:00Z",
        tokenAmount: 100000,
        bonusPercentage: 5,
        isUnlocked: true,
        olympicNumber: 32,
        unlockRequirements: [
          "Successful completion of the Tokyo Olympics",
          "Verification by Olympic Committee multisig",
          "Community governance approval"
        ]
      },
      {
        id: 2,
        name: "Beijing Winter Olympics Vault",
        type: "winter",
        location: "Beijing, China",
        year: 2022,
        startDate: "2022-02-04T00:00:00Z",
        unlockDate: "2022-02-20T00:00:00Z",
        tokenAmount: 80000,
        bonusPercentage: 4,
        isUnlocked: true,
        olympicNumber: 24,
        unlockRequirements: [
          "Successful completion of the Beijing Winter Olympics",
          "Verification by Olympic Committee multisig",
          "Community governance approval"
        ]
      },
      
      // Future Olympics
      {
        id: 3,
        name: "Paris Olympics Vault",
        type: "summer",
        location: "Paris, France",
        year: 2024,
        startDate: "2024-07-26T00:00:00Z",
        unlockDate: "2024-08-11T00:00:00Z",
        tokenAmount: 150000,
        bonusPercentage: 7.5,
        isUnlocked: false,
        olympicNumber: 33,
        unlockRequirements: [
          "Successful opening ceremony in Paris",
          "Minimum participation of 120 countries",
          "Verification by Olympic Committee multisig",
          "Community governance approval"
        ]
      },
      {
        id: 4,
        name: "Milano Cortina Winter Olympics Vault",
        type: "winter",
        location: "Milano Cortina, Italy",
        year: 2026,
        startDate: "2026-02-06T00:00:00Z",
        unlockDate: "2026-02-22T00:00:00Z",
        tokenAmount: 120000,
        bonusPercentage: 6,
        isUnlocked: false,
        olympicNumber: 25,
        unlockRequirements: [
          "Successful opening ceremony in Milano Cortina",
          "Minimum participation of 90 countries",
          "Verification by Olympic Committee multisig",
          "Community governance approval"
        ]
      },
      {
        id: 5,
        name: "Los Angeles Olympics Vault",
        type: "summer",
        location: "Los Angeles, USA",
        year: 2028,
        startDate: "2028-07-21T00:00:00Z",
        unlockDate: "2028-08-06T00:00:00Z",
        tokenAmount: 200000,
        bonusPercentage: 10,
        isUnlocked: false,
        olympicNumber: 34,
        unlockRequirements: [
          "Successful opening ceremony in Los Angeles",
          "Minimum participation of 130 countries",
          "Verification by Olympic Committee multisig",
          "Community governance approval"
        ]
      },
      {
        id: 6,
        name: "Salt Lake City Winter Olympics Vault",
        type: "winter",
        location: "Salt Lake City, USA",
        year: 2030, // Projected, not officially confirmed
        startDate: "2030-02-08T00:00:00Z", // Estimated
        unlockDate: "2030-02-24T00:00:00Z", // Estimated
        tokenAmount: 150000,
        bonusPercentage: 7.5,
        isUnlocked: false,
        olympicNumber: 26,
        unlockRequirements: [
          "Successful opening ceremony in Salt Lake City",
          "Minimum participation of 95 countries",
          "Verification by Olympic Committee multisig",
          "Community governance approval"
        ]
      },
      {
        id: 7,
        name: "Brisbane Olympics Vault",
        type: "summer",
        location: "Brisbane, Australia",
        year: 2032,
        startDate: "2032-07-23T00:00:00Z", // Estimated
        unlockDate: "2032-08-08T00:00:00Z", // Estimated
        tokenAmount: 250000,
        bonusPercentage: 12.5,
        isUnlocked: false,
        olympicNumber: 35,
        unlockRequirements: [
          "Successful opening ceremony in Brisbane",
          "Minimum participation of 140 countries",
          "Verification by Olympic Committee multisig",
          "Community governance approval"
        ]
      }
    ];
    
    return vaults;
  }
  
  /**
   * Get detailed information for a specific Olympic vault
   */
  async getOlympicVaultById(id: number): Promise<OlympicVault | null> {
    const vaults = await this.getOlympicVaults();
    return vaults.find(vault => vault.id === id) || null;
  }
  
  /**
   * Check if a vault is eligible for unlocking
   */
  async checkUnlockEligibility(id: number): Promise<{
    eligible: boolean;
    reasonsIfNotEligible?: string[];
  }> {
    const vault = await this.getOlympicVaultById(id);
    
    if (!vault) {
      return {
        eligible: false,
        reasonsIfNotEligible: ['Vault not found']
      };
    }
    
    // Already unlocked
    if (vault.isUnlocked) {
      return {
        eligible: true
      };
    }
    
    // Check if the unlock date has passed
    const now = new Date();
    const unlockDate = new Date(vault.unlockDate);
    
    if (now < unlockDate) {
      return {
        eligible: false,
        reasonsIfNotEligible: [
          `Unlock date not reached. Vault unlocks on ${unlockDate.toLocaleDateString()}.`
        ]
      };
    }
    
    // In a real implementation, additional checks would be performed here
    // such as verifying blockchain conditions, multisig requirements, etc.
    
    return {
      eligible: true
    };
  }
}

// Export singleton instance
export const olympicVaultService = new OlympicVaultService();