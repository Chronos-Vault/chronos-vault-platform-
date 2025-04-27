import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { BitcoinHalvingVault } from '@/components/bitcoin/BitcoinHalvingVault';
import { BitcoinHalvingRewards } from '@/components/bitcoin/bitcoin-halving-rewards';
import { Helmet } from 'react-helmet';
import { CVTTokenProvider } from '@/contexts/cvt-token-context';

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            <BitcoinHalvingVault />
          </div>
          <div className="lg:col-span-1">
            <CVTTokenProvider>
              <BitcoinHalvingRewards />
            </CVTTokenProvider>
          </div>
        </div>
      </Container>
    </>
  );
}