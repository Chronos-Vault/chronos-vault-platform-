export const CONTRACT_ADDRESSES = {
  ethereum: {
    vault: '0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91',
    token: '0xFb419D8E32c14F774279a4dEEf330dc893257147',
    bridge: '0x4a8Bc58f441Ae7E7eC2879e434D9D7e31CF80e30'
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
  CrossChainBridgeOptimized: 'v3.0-PRODUCTION',
  ChronosVault: 'v1.3',
  ChronosVaultOptimized: 'v1.3',
  CVTToken: 'v1.0',
  CVTBridge: 'v1.0',
};

// Trinity Protocol v3.0 - The Heart of Chronos Vault
export const TRINITY_PROTOCOL = {
  address: '0x4a8Bc58f441Ae7E7eC2879e434D9D7e31CF80e30',
  version: 'v3.0',
  network: 'arbitrum-sepolia',
  chainId: 421614,
  status: 'PRODUCTION-READY',
  validators: {
    arbitrum: '0x66e5046d136e82d17cbeb2ffea5bd5205d962906',
    solana: '5oD8S1TtkdJbAX7qhsGticU7JKxjwY4AbEeBdnkUrrKY',
    ton: 'EQDx6yH5WH3Ex47h0PBnOBMzPCsmHdnL2snts3DZBO5CYVVJ'
  }
};
