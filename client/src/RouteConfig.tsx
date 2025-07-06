import React from 'react';
import { RouteComponentProps } from 'wouter';

// Core pages
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import DocumentationPage from './pages/documentation';
import AboutPage from './pages/about';
import FaqPage from './pages/faq';
import WhitepaperPage from './pages/whitepaper';
import VaultSchoolPage from './pages/vault-school';
import MyVaultsPage from './pages/my-vaults';
import CvtStakingPage from './pages/cvt-staking';
import AuditTestPage from './pages/audit-test';

// Cross-chain pages
import CrossChainBridgePage from './pages/cross-chain-bridge';
import CrossChainVaultPage from './pages/cross-chain-vault';
import CrossChainMonitorPage from './pages/cross-chain-monitor';
import CrossChainSecurityPage from './pages/cross-chain-security';

// Vault type pages
import SmartContractVaultPage from './pages/smart-contract-vault';
import BiometricVaultPage from './pages/biometric-vault';
import GeoVaultPage from './pages/geo-vault';
import MultiSignatureVaultPage from './pages/multi-signature-vault';
import MultiSignatureVaultNewPage from './pages/multi-signature-vault-new';
import SpecializedVaultMemoryPage from './pages/specialized-vault-memory';
import InvestmentDisciplineVaultPage from './pages/investment-discipline-vault';
import AIInvestmentVaultPage from './pages/vault-types/ai-investment-vault';
import MilestoneBasedVaultPage from './pages/vault-types/milestone-based-vault';
import FamilyHeritageVaultPage from './pages/vault-types/family-heritage-vault';

// Create Vault pages
import CreateVaultPage from './pages/create-vault';
import CreateTonVaultPage from './pages/create-ton-vault';
import CreateVaultEnhancedPage from './pages/create-vault-enhanced';
import CreateVaultNewPage from './pages/create-vault-new';
import CreateSmartContractVaultPage from './pages/create-smart-contract-vault';

// Placeholder for pages that might not exist yet
import PlaceholderPage from './pages/placeholder-page';

// Define route configuration with component, title, and description
interface RouteConfig {
  path: string;
  component: React.ComponentType<RouteComponentProps | any>;
  title: string;
  description?: string;
}

// Create route map with component, title, and description for each route
const routes: RouteConfig[] = [
  // Core pages
  { path: '/', component: HomePage, title: 'Home' },
  { path: '/documentation', component: DocumentationPage, title: 'Documentation' },
  { path: '/about', component: AboutPage, title: 'About' },
  { path: '/faq', component: FaqPage, title: 'FAQ' },
  { path: '/whitepaper', component: WhitepaperPage, title: 'Whitepaper' },
  { path: '/vault-school', component: VaultSchoolPage, title: 'Vault School' },
  { path: '/my-vaults', component: MyVaultsPage, title: 'My Vaults' },
  { path: '/staking', component: CvtStakingPage, title: 'CVT Staking' },
  { path: '/audit-test', component: AuditTestPage, title: 'Audit Test' },
  
  // Cross-chain pages
  { path: '/bridge', component: CrossChainBridgePage, title: 'Bridge' },
  { path: '/cross-chain-bridge', component: CrossChainBridgePage, title: 'Cross Chain Bridge' },
  { path: '/cross-chain-vault', component: CrossChainVaultPage, title: 'Cross Chain Vault' },
  { path: '/cross-chain-monitor', component: CrossChainMonitorPage, title: 'Cross Chain Monitor' },
  { path: '/cross-chain-security', component: CrossChainSecurityPage, title: 'Cross Chain Security' },
  
  // Vault type pages
  { path: '/smart-contract-vault', component: SmartContractVaultPage, title: 'Smart Contract Vault' },
  { path: '/biometric-vault', component: BiometricVaultPage, title: 'Biometric Vault' },
  { path: '/geo-vault', component: GeoVaultPage, title: 'Geo Vault' },
  { path: '/multi-signature-vault', component: MultiSignatureVaultPage, title: 'Multi-Signature Vault' },
  { path: '/multi-signature-vault-new', component: MultiSignatureVaultNewPage, title: 'Advanced Multi-Signature Vault' },
  { path: '/specialized-vault-memory', component: SpecializedVaultMemoryPage, title: 'Memory Vault' },
  { path: '/investment-discipline-vault', component: InvestmentDisciplineVaultPage, title: 'Investment Discipline Vault' },
  { path: '/ai-investment-vault', component: AIInvestmentVaultPage, title: 'AI-Assisted Investment Vault' },
  { path: '/milestone-based-vault', component: MilestoneBasedVaultPage, title: 'Milestone-Based Release Vault' },
  { path: '/family-heritage-vault', component: FamilyHeritageVaultPage, title: 'Family Heritage Vault' },
  
  // Create Vault pages
  { path: '/create-vault', component: CreateVaultPage, title: 'Create Vault' },
  { path: '/create-ton-vault', component: CreateTonVaultPage, title: 'Create TON Vault' },
  { path: '/create-vault-enhanced', component: CreateVaultEnhancedPage, title: 'Enhanced Vault Creation' },
  { path: '/create-vault-new', component: CreateVaultNewPage, title: 'New Vault Creation' },
  { path: '/create-smart-contract-vault', component: CreateSmartContractVaultPage, title: 'Create Smart Contract Vault' },
  { path: '/create-vault/ai-investment', component: CreateVaultPage, title: 'Create AI-Assisted Investment Vault' },
  { path: '/create-vault/milestone-based', component: CreateVaultPage, title: 'Create Milestone-Based Release Vault' },
  { path: '/create-vault/family-heritage', component: CreateVaultPage, title: 'Create Family Heritage Vault' },
];

// Function to get component by path
export const getComponentByPath = (path: string): React.ComponentType => {
  const route = routes.find(r => r.path === path);
  
  if (route) {
    return route.component;
  }
  
  // Return NotFound component if path doesn't match any route
  return NotFoundPage;
};

// Function to get a list of all routes for generating routes dynamically
export const getAllRoutes = (): RouteConfig[] => {
  return routes;
};

export default routes;