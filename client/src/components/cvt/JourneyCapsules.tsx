/**
 * @deprecated This file is maintained for backward compatibility only.
 * Please import JourneyVaults from './JourneyVaults' instead.
 * 
 * The terminology has been standardized to use "vault" instead of "capsule"
 * throughout the application to maintain a professional blockchain focus.
 */

import React, { useEffect } from 'react';
import JourneyVaults, { TokenReleasePhase } from './JourneyVaults';

interface JourneyCapsuleProps {
  capsules: TokenReleasePhase[];
  totalSupply: number;
}

const JourneyCapsules: React.FC<JourneyCapsuleProps> = ({ capsules, totalSupply }) => {
  // Display a console warning about deprecation
  useEffect(() => {
    console.warn(
      'JourneyCapsules component is deprecated. Please use JourneyVaults instead. ' +
      'The terminology has been standardized to use "vault" instead of "capsule" ' +
      'throughout the application to maintain a professional blockchain focus.'
    );
  }, []);
  
  // Simply forward to the new component
  return <JourneyVaults vaults={capsules} totalSupply={totalSupply} />;
};

export default JourneyCapsules;