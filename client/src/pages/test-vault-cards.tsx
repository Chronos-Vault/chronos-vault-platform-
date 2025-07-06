import React, { useState } from 'react';
import FreshVaultSelector, { SpecializedVaultType } from '@/components/vault/fresh-vault-selector';
import { useLocation } from 'wouter';

export default function TestVaultCards() {
  const [selectedVaultType, setSelectedVaultType] = useState<SpecializedVaultType>('standard');
  const [_, navigate] = useLocation();

  const handleVaultSelect = (type: SpecializedVaultType) => {
    setSelectedVaultType(type);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#6B00D7]">Vault Card Test Page</h1>
          <button
            onClick={() => navigate('/vault-types')}
            className="px-3 py-2 rounded-md bg-[#6B00D7]/20 text-[#6B00D7] border border-[#6B00D7]/30"
          >
            Back to Vault Types
          </button>
        </div>
        
        <p className="text-gray-400 mb-8">
          This page demonstrates the new vault card implementation with properly aligned features.
        </p>
        
        <FreshVaultSelector 
          selectedType={selectedVaultType}
          onSelect={handleVaultSelect}
        />
        
        <div className="mt-8 flex justify-center">
          <p className="text-gray-400">
            Selected Vault: <span className="text-white">{selectedVaultType}</span>
          </p>
        </div>
      </div>
    </div>
  );
}