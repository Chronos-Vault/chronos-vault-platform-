import React, { useEffect, useState } from 'react';
import DocumentationLayout from '@/components/layout/DocumentationLayout';
import { Loader2 } from 'lucide-react';

// Import documentation components
import BitcoinHalvingVaultDocumentation from '@/pages/documentation/bitcoin-halving-vault';
import TimeLockedMemoryVaultDocumentation from '@/pages/documentation/time-locked-memory-vault';
import MultiSignatureVaultDocumentation from '@/pages/documentation/multi-signature-vault';
import QuantumResistantVaultDocumentation from '@/pages/documentation/quantum-resistant-vault';
import CrossChainFragmentVaultDocumentation from '@/pages/documentation/cross-chain-fragment-vault';
import GeoLocationVaultDocumentation from '@/pages/documentation/geo-location-vault';
import NftPoweredVaultDocumentation from '@/pages/documentation/nft-powered-vault';
import AiAssistedInvestmentVaultDocumentation from '@/pages/documentation/ai-assisted-investment-vault';
import AiIntentInheritanceVaultDocumentation from '@/pages/documentation/ai-intent-inheritance-vault';
import FamilyHeritageVaultDocumentation from '@/pages/documentation/family-heritage-vault';
import InvestmentDisciplineVaultDocumentation from '@/pages/documentation/investment-discipline-vault';
import LocationTimeVaultDocumentation from '@/pages/documentation/location-time-vault';
import MilestoneBasedVaultDocumentation from '@/pages/documentation/milestone-based-vault';
import PaymentChannelVaultDocumentation from '@/pages/documentation/payment-channel-vault';
import SovereignFortressVaultDocumentation from '@/pages/documentation/sovereign-fortress-vault';
import UniqueSecurityVaultDocumentation from '@/pages/documentation/unique-security-vault';

interface DocumentationRouterProps {
  vaultType: string;
}

const DocumentationRouter: React.FC<DocumentationRouterProps> = ({ vaultType }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [vaultType]);
  
  if (isLoading) {
    return (
      <DocumentationLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#FF5AF7]" />
        </div>
      </DocumentationLayout>
    );
  }

  // Render appropriate documentation component based on vault type
  switch (vaultType) {
    case 'bitcoin-halving-vault':
      return <BitcoinHalvingVaultDocumentation />;
    case 'time-locked-memory-vault':
      return <TimeLockedMemoryVaultDocumentation />;
    case 'multi-signature-vault':
      return <MultiSignatureVaultDocumentation />;
    case 'quantum-resistant-vault':
      return <QuantumResistantVaultDocumentation />;
    case 'cross-chain-fragment-vault':
      return <CrossChainFragmentVaultDocumentation />;
    case 'geo-location-vault':
      return <GeoLocationVaultDocumentation />;
    case 'nft-powered-vault':
      return <NftPoweredVaultDocumentation />;
    case 'ai-assisted-investment-vault':
      return <AiAssistedInvestmentVaultDocumentation />;
    case 'ai-intent-inheritance-vault':
      return <AiIntentInheritanceVaultDocumentation />;
    case 'family-heritage-vault':
      return <FamilyHeritageVaultDocumentation />;
    case 'investment-discipline-vault':
      return <InvestmentDisciplineVaultDocumentation />;
    case 'location-time-vault':
      return <LocationTimeVaultDocumentation />;
    case 'milestone-based-vault':
      return <MilestoneBasedVaultDocumentation />;
    case 'payment-channel-vault':
      return <PaymentChannelVaultDocumentation />;
    case 'sovereign-fortress-vault':
      return <SovereignFortressVaultDocumentation />;
    case 'unique-security-vault':
      return <UniqueSecurityVaultDocumentation />;
    // Add more documentation components as needed
    default:
      return (
        <DocumentationLayout>
          <div className="container mx-auto py-10 px-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6">Documentation Not Found</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Sorry, we couldn't find documentation for '{vaultType}'. Please check the URL or return to the Vault School Hub.
            </p>
          </div>
        </DocumentationLayout>
      );
  }
};

export default DocumentationRouter;