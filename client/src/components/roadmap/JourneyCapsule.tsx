/**
 * @deprecated This file is maintained for backward compatibility only.
 * Please import JourneyVaults from './JourneyVaults' instead.
 * 
 * The terminology has been standardized to use "vault" instead of "capsule"
 * throughout the application to maintain a professional blockchain focus.
 */

import React from 'react';
import JourneyVaults, { TokenReleasePhase } from './JourneyVaults';

// Legacy interface for backward compatibility
export interface JourneyCapsuleProps {
  name: string;
  description: string;
  unlockYear: number;
  unlockDate: string;
  tokenPercentage: number;
  isUnlocked: boolean;
  hasMinted: boolean;
  signatureCount: number;
  capsuleIndex: number;
  totalSupply: number;
  blockchainAddress: string;
}

// Convert legacy vault props to the new TokenReleasePhase format
function mapCapsulePropsToVaultProps(capsules: JourneyCapsuleProps[]): TokenReleasePhase[] {
  return capsules.map((capsule, index) => ({
    id: index + 1,
    year: capsule.unlockYear,
    releaseDate: capsule.unlockDate,
    percentage: capsule.tokenPercentage,
    tokens: capsule.totalSupply * (capsule.tokenPercentage / 100),
    releaseDescription: capsule.description,
    status: capsule.isUnlocked ? 'released' : 'upcoming',
    vaultTheme: index === 0 ? 'genesis' : ['quantum', 'cosmic', 'nebula', 'aurora', 'infinity'][index % 5],
    vaultImageUrl: undefined
  }));
}

// This is a thin wrapper around JourneyVaults for backward compatibility
const JourneyCapsule: React.FC<{ capsules: JourneyCapsuleProps[], totalSupply: number }> = ({ 
  capsules, 
  totalSupply 
}) => {
  // Map the legacy props to the new format
  const vaults = mapCapsulePropsToVaultProps(capsules);
  
  // Display a console warning about deprecation
  React.useEffect(() => {
    console.warn(
      'JourneyCapsule component is deprecated. Please use JourneyVaults instead. ' +
      'The terminology has been standardized to use "vault" instead of "capsule" ' +
      'throughout the application to maintain a professional blockchain focus.'
    );
  }, []);
  
  // Render the new JourneyVaults component with the mapped props
  return <JourneyVaults vaults={vaults} totalSupply={totalSupply} />;
};

export default JourneyCapsule;