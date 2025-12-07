import React from 'react';
import DocumentationLayout from '@/components/layout/DocumentationLayout';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
// No need for Onboarding Provider - using DocumentationLayout instead

// Import all documentation components directly
import BitcoinHalvingVaultDoc from '@/pages/documentation/bitcoin-halving-vault';
import TimeLockedMemoryVaultDoc from '@/pages/documentation/time-locked-memory-vault';
import MultiSignatureVaultDoc from '@/pages/documentation/multi-signature-vault';
import QuantumResistantVaultDoc from '@/pages/documentation/quantum-resistant-vault';
import CrossChainFragmentVaultDoc from '@/pages/documentation/cross-chain-fragment-vault';
import GeoLocationVaultDoc from '@/pages/documentation/geo-location-vault';
import NftPoweredVaultDoc from '@/pages/documentation/nft-powered-vault';
import AiAssistedInvestmentVaultDoc from '@/pages/documentation/ai-assisted-investment-vault';
import AiIntentInheritanceVaultDoc from '@/pages/documentation/ai-intent-inheritance-vault';
import FamilyHeritageVaultDoc from '@/pages/documentation/family-heritage-vault';
import InvestmentDisciplineVaultDoc from '@/pages/documentation/investment-discipline-vault';
import MilestoneBasedVaultDoc from '@/pages/documentation/milestone-based-vault';
import PaymentChannelVaultDoc from '@/pages/documentation/payment-channel-vault';
import SovereignFortressVaultDoc from '@/pages/documentation/sovereign-fortress-vault';
import UniqueSecurityVaultDoc from '@/pages/documentation/unique-security-vault';
import DynamicSecurityVaultDoc from '@/pages/documentation/dynamic-security-vault';
import GiftCryptoVaultDoc from '@/pages/documentation/gift-crypto-vault';
import InheritancePlanningVaultDoc from '@/pages/documentation/inheritance-planning-vault';
import LocationTimeVaultDoc from '@/pages/documentation/location-time-vault';
import BiometricVaultDoc from '@/pages/documentation/biometric-vault';
import SecurityWhitepaperDoc from '@/pages/documentation/security-whitepaper';
import SDKDocumentationPage from '@/pages/sdk-documentation';

interface DocumentationRouterProps {
  vaultType: string;
}

const DocumentationRouter: React.FC<DocumentationRouterProps> = ({ vaultType }) => {
  const [location, setLocation] = useLocation();
  
  // Debug logging
  console.log('[DocumentationRouter] Received vaultType:', vaultType);
  console.log('[DocumentationRouter] Current location:', location);
  
  // Map of vault types to their corresponding components
  const vaultComponents: Record<string, React.ComponentType> = {
    'bitcoin-halving-vault': BitcoinHalvingVaultDoc,
    'time-locked-memory-vault': TimeLockedMemoryVaultDoc,
    'multi-signature-vault': MultiSignatureVaultDoc,
    'quantum-resistant-vault': QuantumResistantVaultDoc,
    'cross-chain-fragment-vault': CrossChainFragmentVaultDoc,
    'geo-location-vault': GeoLocationVaultDoc,
    'nft-powered-vault': NftPoweredVaultDoc,
    'ai-assisted-investment-vault': AiAssistedInvestmentVaultDoc,
    'ai-intent-inheritance-vault': AiIntentInheritanceVaultDoc,
    'family-heritage-vault': FamilyHeritageVaultDoc,
    'investment-discipline-vault': InvestmentDisciplineVaultDoc,
    'milestone-based-vault': MilestoneBasedVaultDoc,
    'payment-channel-vault': PaymentChannelVaultDoc,
    'sovereign-fortress-vault': SovereignFortressVaultDoc,
    'unique-security-vault': UniqueSecurityVaultDoc,
    'dynamic-security-vault': DynamicSecurityVaultDoc,
    'gift-crypto-vault': GiftCryptoVaultDoc,
    'inheritance-planning-vault': InheritancePlanningVaultDoc,
    'location-time-vault': LocationTimeVaultDoc,
    'biometric-vault': BiometricVaultDoc,
    'security-whitepaper': SecurityWhitepaperDoc,
    'sdk': SDKDocumentationPage
  };

  // Get the component for the requested vault type
  const VaultDocComponent = vaultComponents[vaultType];

  // Simply render the component without special providers
  const renderComponent = () => {
    if (VaultDocComponent) {
      // Just render the component directly
      return <VaultDocComponent />;
    }

    // Fallback if component doesn't exist
    return (
      <DocumentationLayout>
        <div className="container mx-auto py-10 px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Documentation Not Found</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Sorry, we couldn't find documentation for '{vaultType}'. Please check the URL or return to the Vault School Hub.
          </p>
          <button 
            onClick={() => setLocation('/vault-school-hub')} 
            className="px-4 py-2 bg-[#FF5AF7] text-white rounded-md hover:bg-[#E047D9] transition-colors"
          >
            Back to Vault School Hub
          </button>
        </div>
      </DocumentationLayout>
    );
  };

  return renderComponent();
};

export default DocumentationRouter;