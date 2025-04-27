import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import BitcoinHalvingVault from '@/components/bitcoin/BitcoinHalvingVault';

export default function BitcoinHalvingPage() {
  return (
    <Container className="py-8 md:py-12">
      <PageHeader 
        heading="Bitcoin Halving Vault" 
        description="Secure your Bitcoin until the next halving event to maximize potential gains."
        separator
      />
      
      <div className="mt-8">
        <BitcoinHalvingVault />
      </div>
    </Container>
  );
}