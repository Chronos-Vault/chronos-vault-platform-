import React, { useState } from 'react';
import ExactCopyCard from '@/components/vault/ExactCopyCard';
import { useLocation } from 'wouter';

export default function FinalVaultTest() {
  const [selectedVaultType, setSelectedVaultType] = useState<string>('standard');
  const [_, navigate] = useLocation();

  const vaultTypes = [
    {
      id: "standard",
      name: "Standard Vault",
      description: "Basic time-locked vault",
      icon: "🔒",
      color: "#FF5AF7",
      features: ["Simple time-lock", "Customizable unlocking", "Multiple formats", "Asset Storage"],
      securityLevel: 3,
      complexityLevel: 1,
    },
    {
      id: "multi-signature",
      name: "Multi-Signature Vault",
      description: "Require multiple keys to unlock",
      icon: "🔑",
      color: "#5271FF",
      features: ["Multiple approvers required", "Threshold configuration", "Request notifications", "Inheritance planning"],
      securityLevel: 4,
      complexityLevel: 3,
    },
    {
      id: "biometric",
      name: "Biometric Vault",
      description: "Unlock with biometric verification",
      icon: "👁️",
      color: "#00D7C3",
      features: ["Facial recognition", "Fingerprint verification", "Voice authentication", "Behavioral analysis"],
      securityLevel: 4,
      complexityLevel: 3,
    },
    {
      id: "time-lock",
      name: "Temporal Vault",
      description: "Advanced time-based conditions",
      icon: "⏱️",
      color: "#F1C40F",
      features: ["Calendar scheduling", "Periodic unlocking", "Conditional time triggers", "Temporal signatures"],
      securityLevel: 3,
      complexityLevel: 2,
    }
  ];

  const handleVaultSelect = (vaultId: string) => {
    setSelectedVaultType(vaultId);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#6B00D7]">Final Vault Card Test</h1>
          <button
            onClick={() => navigate('/test-vault-cards')}
            className="px-3 py-2 rounded-md bg-[#6B00D7]/20 text-[#6B00D7] border border-[#6B00D7]/30"
          >
            Back to Previous Test
          </button>
        </div>
        
        <p className="text-gray-400 mb-8">
          This page tests a completely new card implementation with exact styling copied from the working example.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {vaultTypes.map(vault => (
            <ExactCopyCard
              key={vault.id}
              title={vault.name}
              description={vault.description}
              icon={vault.icon}
              color={vault.color}
              isSelected={selectedVaultType === vault.id}
              onClick={() => handleVaultSelect(vault.id)}
              securityLevel={vault.securityLevel}
              complexityLevel={vault.complexityLevel}
              features={vault.features}
            />
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <p className="text-gray-400">
            Selected Vault: <span className="text-white">{selectedVaultType}</span>
          </p>
        </div>
      </div>
    </div>
  );
}