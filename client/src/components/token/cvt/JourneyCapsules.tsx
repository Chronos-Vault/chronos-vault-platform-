/**
 * @deprecated This file is maintained for backward compatibility only.
 * Please import JourneyVaults from './JourneyVaults' instead.
 * 
 * The terminology has been standardized to use "digital time vault" consistently
 * throughout the application to maintain a professional blockchain focus.
 */

import React, { useEffect } from 'react';
import JourneyVaults, { TokenReleasePhase } from './JourneyVaults';

interface JourneyDigitalTimeVaultProps {
  vaults: TokenReleasePhase[];
  totalSupply: number;
}

const JourneyCapsules: React.FC<JourneyDigitalTimeVaultProps> = ({ vaults, totalSupply }) => {
  // Display a console warning about deprecation
  useEffect(() => {
    console.warn(
      'JourneyCapsules component is deprecated. Please use JourneyVaults instead. ' +
      'The terminology has been standardized to use "digital time vault" consistently ' +
      'throughout the application to maintain a professional blockchain focus.'
    );
  }, []);
  
  // Simply forward to the new component
  return <JourneyVaults vaults={vaults} totalSupply={totalSupply} />;
};

export default JourneyCapsules;