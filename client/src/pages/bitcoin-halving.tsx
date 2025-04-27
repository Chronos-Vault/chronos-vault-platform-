import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { BitcoinHalvingVault } from '@/components/bitcoin/BitcoinHalvingVault';
import { Helmet } from 'react-helmet';

export default function BitcoinHalvingPage() {
  return (
    <>
      <Helmet>
        <title>Bitcoin Halving Vault | ChronosVault</title>
        <meta 
          name="description" 
          content="Secure your Bitcoin through market cycles with our specialized time-locked halvening-synchronized vaults." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="Bitcoin Halving Vault" 
          description="Secure your Bitcoin through market cycles with our time-locked halving vaults" 
          separator
        />
        
        <div className="mt-12">
          <BitcoinHalvingVault />
        </div>
      </Container>
    </>
  );
}