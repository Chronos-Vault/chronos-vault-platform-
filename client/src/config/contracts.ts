export const CONTRACT_ADDRESSES = {
  ethereum: {
    vault: '0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91',
    token: '0xFb419D8E32c14F774279a4dEEf330dc893257147',
    bridge: '0x83DeAbA0de5252c74E1ac64EDEc25aDab3c50859'
  },
  ton: {
    vault: 'EQiVU0hizNsHqqY4OpxicQHva0jxO5LGovkjWszoRS5uvQ',
    token: 'EQjPkGSKFrZaw9zKuFheouloRsuj8Q9G4-HKvXbBkagjDd',
    bridge: 'EQygggZ1OAabipxMWhoubYd78habRcp2drO55Fo8TGUlbB'
  },
  solana: {
    vault: '7va69VBveDrnZA5ezS4DRUL7AM2CqzUEvfHEBPL4wRA2',
    token: 'aMoyohzfzq3gje4moZphvTBAGSxfELfyik9r9qFAPmZj',
    bridge: 'ZNZeVxsm5cfdp9jnFUPGTaF6o2dCN3dSRzPtovdxZazG'
  },
};

export const NETWORK_CONFIG = {
  ethereum: 'arbitrum-sepolia',
  ton: 'testnet',
  solana: 'devnet',
};

// Contract versions
export const CONTRACT_VERSIONS = {
  CrossChainBridgeOptimized: 'v1.4-PRODUCTION',
  ChronosVault: 'v1.3',
  ChronosVaultOptimized: 'v1.3',
  CVTToken: 'v1.0',
  CVTBridge: 'v1.0',
};
