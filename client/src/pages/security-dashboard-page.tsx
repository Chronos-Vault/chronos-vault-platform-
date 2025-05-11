/**
 * Security Dashboard Page
 * 
 * Main page displaying the cross-chain security status dashboard that provides
 * a comprehensive view of the Triple-Chain Security architecture status.
 */

import React from 'react';
import CrossChainSecurityDashboard from '@/components/security/CrossChainSecurityDashboard';
import { Helmet } from 'react-helmet';

export default function SecurityDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Security Dashboard | Chronos Vault</title>
        <meta name="description" content="Triple-Chain Security Dashboard for Chronos Vault" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <CrossChainSecurityDashboard />
      </div>
    </>
  );
}