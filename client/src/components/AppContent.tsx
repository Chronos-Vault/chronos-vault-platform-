import React from 'react';
import { Route, Switch } from 'wouter';
import { useAuthContext } from '@/context/AuthContext';
import { WalletAuthModal } from '@/components/auth/WalletAuthModal';
import { NavBar } from '@/components/navigation/NavBar';
import Footer from '@/components/layout/footer';
import DocumentationRouter from '@/components/documentation/DocumentationRouter';

// Main Pages
import HomePage from '@/pages/home';
import MyVaultsPage from '@/pages/my-vaults';
import AboutPage from '@/pages/about';
import FaqPage from '@/pages/faq';
import TeamPage from '@/pages/team';
import WhitepaperPage from '@/pages/whitepaper';
import ProjectWhitepaperPage from '@/pages/project-whitepaper';
import CvtTokenomicsPage from '@/pages/cvt-tokenomics';
import CvtUtilityPage from '@/pages/cvt-utility-new';
import TermsOfServicePage from '@/pages/terms-of-service';
import CookiePolicyPage from '@/pages/cookie-policy';
import DocumentationPage from '@/pages/documentation';
import VaultSchoolPage from '@/pages/vault-school';
import RoadmapPage from '@/pages/roadmap';
import SmartContractsPage from '@/pages/smart-contracts';
import TechnicalSpecPage from '@/pages/technical-spec';

// Documentation Pages
import APIDocumentationPage from '@/pages/api-documentation';
import SDKDocumentationPage from '@/pages/sdk-documentation';
import IntegrationExamplesPage from '@/pages/integration-examples';
import DeveloperPortalPage from '@/pages/developer-portal';
import IntegrationGuidePage from '@/pages/integration-guide';
import SmartContractSDKPage from '@/pages/smart-contract-sdk';
import DeveloperAPIKeysPage from '@/pages/DeveloperAPIKeys';
import WalletIntegrationDemoPage from '@/pages/WalletIntegrationDemo';
import WalletPage from '@/pages/wallet';
import CreateWalletPage from '@/pages/create-wallet';
import SecurityDashboard from '@/pages/security-dashboard';
import DeFiDashboard from '@/pages/defi-dashboard';

// Vault Type Pages
import VaultTypesPage from '@/pages/vault-types-new';
import VaultTypesSelector from '@/pages/vault-types-selector';
import VaultShowcase from '@/pages/stunning-vault-showcase';

export function AppContent() {
  const { showAuthModal, setShowAuthModal } = useAuthContext();

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <div className="relative">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/my-vaults" component={MyVaultsPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/faq" component={FaqPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/whitepaper" component={WhitepaperPage} />
          <Route path="/project-whitepaper" component={ProjectWhitepaperPage} />
          <Route path="/cvt-tokenomics" component={CvtTokenomicsPage} />
          <Route path="/cvt-utility" component={CvtUtilityPage} />
          <Route path="/terms-of-service" component={TermsOfServicePage} />
          <Route path="/cookie-policy" component={CookiePolicyPage} />
          <Route path="/documentation" component={DocumentationPage} />
          <Route path="/vault-school" component={VaultSchoolPage} />
          <Route path="/roadmap" component={RoadmapPage} />
          <Route path="/smart-contracts" component={SmartContractsPage} />
          <Route path="/technical-spec" component={TechnicalSpecPage} />
          
          {/* Documentation Routes */}
          <Route path="/api-documentation" component={APIDocumentationPage} />
          <Route path="/sdk-documentation" component={SDKDocumentationPage} />
          <Route path="/integration-examples" component={IntegrationExamplesPage} />
          <Route path="/developer-portal" component={DeveloperPortalPage} />
          <Route path="/integration-guide" component={IntegrationGuidePage} />
          <Route path="/smart-contract-sdk" component={SmartContractSDKPage} />
          <Route path="/developer-api-keys" component={DeveloperAPIKeysPage} />
          <Route path="/wallet-integration-demo" component={WalletIntegrationDemoPage} />
          <Route path="/wallet" component={WalletPage} />
          <Route path="/create-wallet" component={CreateWalletPage} />
          <Route path="/security-dashboard" component={SecurityDashboard} />
          <Route path="/defi-dashboard" component={DeFiDashboard} />
          
          {/* Vault Type Routes */}
          <Route path="/vault-types" component={VaultTypesPage} />
          <Route path="/vault-types-selector" component={VaultTypesSelector} />
          <Route path="/vault-showcase" component={VaultShowcase} />
          
          {/* Documentation with vault type parameter */}
          <Route path="/documentation/:vaultType">
            {(params) => <DocumentationRouter vaultType={params.vaultType} />}
          </Route>
        </Switch>
        
        <Footer />
      </div>

      {/* Wallet Authentication Modal */}
      <WalletAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={() => {
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}