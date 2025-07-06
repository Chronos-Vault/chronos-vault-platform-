/**
 * Dynamic Security Requirements Module
 * 
 * This module manages dynamic security requirements based on
 * vault type, asset value, and threat model.
 */

// Security requirement level enums
export enum DynamicRequirementLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  ADVANCED = 'advanced',
  MAXIMUM = 'maximum'
}

// Security requirement types
export type RequirementType = 
  | 'password'
  | 'twoFactor'
  | 'biometric'
  | 'multisig'
  | 'timelock'
  | 'recovery'
  | 'encryption'
  | 'geolocation'
  | 'deviceVerification'
  | 'quantumResistance';

// Security requirement definition
export interface SecurityRequirement {
  type: RequirementType;
  level: DynamicRequirementLevel;
  description: string;
  mandatory: boolean;
  validator?: (value: any) => boolean;
}

/**
 * Determines security requirements based on vault type and asset value
 */
export function getSecurityRequirements(
  vaultType: string,
  assetValueUSD: number,
  threatModel: string
): SecurityRequirement[] {
  
  // Base requirements for all vaults
  const baseRequirements: SecurityRequirement[] = [
    {
      type: 'password',
      level: DynamicRequirementLevel.BASIC,
      description: 'Strong password protection',
      mandatory: true,
      validator: function(value: any): boolean {
        const password = String(value || '');
        return password.length >= 8;
      }
    }
  ];
  
  // Determine security level based on asset value
  let securityLevel = DynamicRequirementLevel.BASIC;
  
  if (assetValueUSD >= 1000000) {
    securityLevel = DynamicRequirementLevel.MAXIMUM;
  } else if (assetValueUSD >= 100000) {
    securityLevel = DynamicRequirementLevel.ADVANCED;
  } else if (assetValueUSD >= 10000) {
    securityLevel = DynamicRequirementLevel.ENHANCED;
  } else if (assetValueUSD >= 1000) {
    securityLevel = DynamicRequirementLevel.STANDARD;
  }
  
  // Add requirements based on security level
  const additionalRequirements: SecurityRequirement[] = [];
  
  if (securityLevel >= DynamicRequirementLevel.STANDARD) {
    additionalRequirements.push({
      type: 'twoFactor',
      level: DynamicRequirementLevel.STANDARD,
      description: 'Two-factor authentication',
      mandatory: true
    });
  }
  
  if (securityLevel >= DynamicRequirementLevel.ENHANCED) {
    additionalRequirements.push({
      type: 'multisig',
      level: DynamicRequirementLevel.ENHANCED,
      description: 'Multi-signature protection',
      mandatory: true
    });
    
    additionalRequirements.push({
      type: 'recovery',
      level: DynamicRequirementLevel.ENHANCED,
      description: 'Recovery mechanism',
      mandatory: true
    });
  }
  
  if (securityLevel >= DynamicRequirementLevel.ADVANCED) {
    additionalRequirements.push({
      type: 'timelock',
      level: DynamicRequirementLevel.ADVANCED,
      description: 'Time-locked access',
      mandatory: true
    });
    
    additionalRequirements.push({
      type: 'encryption',
      level: DynamicRequirementLevel.ADVANCED,
      description: 'Advanced encryption',
      mandatory: true
    });
    
    additionalRequirements.push({
      type: 'deviceVerification',
      level: DynamicRequirementLevel.ADVANCED,
      description: 'Device verification',
      mandatory: false
    });
  }
  
  if (securityLevel >= DynamicRequirementLevel.MAXIMUM) {
    additionalRequirements.push({
      type: 'biometric',
      level: DynamicRequirementLevel.MAXIMUM,
      description: 'Biometric verification',
      mandatory: true
    });
    
    additionalRequirements.push({
      type: 'geolocation',
      level: DynamicRequirementLevel.MAXIMUM,
      description: 'Geolocation restrictions',
      mandatory: false
    });
    
    additionalRequirements.push({
      type: 'quantumResistance',
      level: DynamicRequirementLevel.MAXIMUM,
      description: 'Quantum-resistant encryption',
      mandatory: true
    });
  }
  
  // Add threat model specific requirements
  if (threatModel === 'nation-state' || threatModel === 'quantum') {
    additionalRequirements.push({
      type: 'quantumResistance',
      level: DynamicRequirementLevel.MAXIMUM,
      description: 'Quantum-resistant encryption',
      mandatory: true
    });
  }
  
  if (threatModel === 'physical') {
    additionalRequirements.push({
      type: 'biometric',
      level: DynamicRequirementLevel.MAXIMUM,
      description: 'Biometric verification',
      mandatory: true
    });
  }
  
  return [...baseRequirements, ...additionalRequirements];
}

/**
 * Validates if a vault configuration meets security requirements
 */
export function validateSecurityRequirements(
  requirements: SecurityRequirement[],
  vaultConfig: Record<string, any>
): { valid: boolean; missingRequirements: SecurityRequirement[] } {
  const missingRequirements = requirements.filter(req => {
    if (!req.mandatory) return false;
    
    // Check if requirement is met in vault config
    switch (req.type) {
      case 'password':
        return !vaultConfig.passwordProtection || 
               (req.validator && !req.validator(vaultConfig.password));
      
      case 'twoFactor':
        return !vaultConfig.twoFactorEnabled;
      
      case 'multisig':
        return !vaultConfig.multisigEnabled && !vaultConfig.guardians?.length;
      
      case 'timelock':
        return !vaultConfig.timelockEnabled && !vaultConfig.timelock;
      
      case 'recovery':
        return !vaultConfig.recoveryMethods?.length;
      
      case 'encryption':
        return !vaultConfig.encryption?.primary;
      
      case 'biometric':
        return !vaultConfig.biometric?.enabled;
      
      case 'geolocation':
        return !vaultConfig.geoSecurity?.enabled;
      
      case 'deviceVerification':
        return !vaultConfig.deviceVerification;
      
      case 'quantumResistance':
        return !vaultConfig.postQuantum?.enabled;
      
      default:
        return true;
    }
  });
  
  return {
    valid: missingRequirements.length === 0,
    missingRequirements
  };
}