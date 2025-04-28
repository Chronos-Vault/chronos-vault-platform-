/**
 * @deprecated This file is maintained for backward compatibility only.
 * Please import JourneyVaults from './JourneyVaults' instead.
 * 
 * The terminology has been standardized to use "digital time vault" consistently
 * throughout the application to maintain a professional blockchain focus.
 */

import React from 'react';
import JourneyVaults, { TokenReleasePhase } from './JourneyVaults';

// Legacy interface for backward compatibility
export interface JourneyDigitalTimeVaultProps {
  name: string;
  description: string;
  unlockYear: number;
  unlockDate: string;
  tokenPercentage: number;
  isUnlocked: boolean;
  hasMinted: boolean;
  signatureCount: number;
  vaultIndex: number;
  totalSupply: number;
  blockchainAddress: string;
}

// Convert legacy vault props to the new TokenReleasePhase format
function mapLegacyPropsToVaultProps(vaults: JourneyDigitalTimeVaultProps[]): TokenReleasePhase[] {
  return vaults.map((vault, index) => ({
    id: index + 1,
    year: vault.unlockYear,
    releaseDate: vault.unlockDate,
    percentage: vault.tokenPercentage,
    tokens: vault.totalSupply * (vault.tokenPercentage / 100),
    releaseDescription: vault.description,
    status: vault.isUnlocked ? 'released' : 'upcoming',
    vaultTheme: index === 0 ? 'genesis' : ['quantum', 'cosmic', 'nebula', 'aurora', 'infinity'][index % 5],
    vaultImageUrl: undefined
  }));
}

// This is a thin wrapper around JourneyVaults for backward compatibility
const JourneyCapsule: React.FC<{ vaults: JourneyDigitalTimeVaultProps[], totalSupply: number }> = ({ 
  vaults: legacyVaults, 
  totalSupply 
}) => {
  // Map the legacy props to the new format
  const vaults = mapLegacyPropsToVaultProps(legacyVaults);
  
  // Display a console warning about deprecation
  React.useEffect(() => {
    console.warn(
      'JourneyCapsule component is deprecated. Please use JourneyVaults instead. ' +
      'The terminology has been standardized to use "digital time vault" consistently ' +
      'throughout the application to maintain a professional blockchain focus.'
    );
  }, []);
  
  // Render the new JourneyVaults component with the mapped props
  return <JourneyVaults vaults={vaults} totalSupply={totalSupply} />;
};

export default JourneyCapsule;