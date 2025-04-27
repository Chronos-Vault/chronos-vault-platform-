/**
 * @deprecated This file is maintained for backward compatibility only.
 * Please import VaultVisualization from './VaultVisualization' instead.
 * 
 * The terminology has been standardized to use "vault" instead of "capsule"
 * throughout the application to maintain a professional blockchain focus.
 */

import React, { useEffect } from 'react';
import VaultVisualization from './VaultVisualization';

interface CapsuleVisualizationProps {
  capsuleId: number;
  status: 'released' | 'upcoming' | 'inProgress';
  theme: string;
  year: number;
  percentage: number;
}

const CapsuleVisualization: React.FC<CapsuleVisualizationProps> = ({
  capsuleId,
  status,
  theme,
  year,
  percentage
}) => {
  // Display a console warning about deprecation
  useEffect(() => {
    console.warn(
      'CapsuleVisualization component is deprecated. Please use VaultVisualization instead. ' +
      'The terminology has been standardized to use "vault" instead of "capsule" ' +
      'throughout the application to maintain a professional blockchain focus.'
    );
  }, []);
  
  // Simply render the VaultVisualization component with the same props
  return (
    <VaultVisualization 
      vaultId={capsuleId} 
      status={status} 
      theme={theme} 
      year={year} 
      percentage={percentage} 
    />
  );
};

export default CapsuleVisualization;