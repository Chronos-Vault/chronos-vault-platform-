// ABI for the Chronos Vault contract (ERC-4626 compliant)
export const CHRONOS_VAULT_ABI = [
  // ERC-20 interface
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // ERC-4626 interface
  "function asset() view returns (address)",
  "function totalAssets() view returns (uint256)",
  "function convertToShares(uint256 assets) view returns (uint256)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function maxDeposit(address receiver) view returns (uint256)",
  "function previewDeposit(uint256 assets) view returns (uint256)",
  "function deposit(uint256 assets, address receiver) returns (uint256)",
  "function maxMint(address receiver) view returns (uint256)",
  "function previewMint(uint256 shares) view returns (uint256)",
  "function mint(uint256 shares, address receiver) returns (uint256)",
  "function maxWithdraw(address owner) view returns (uint256)",
  "function previewWithdraw(uint256 assets) view returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) returns (uint256)",
  "function maxRedeem(address owner) view returns (uint256)",
  "function previewRedeem(uint256 shares) view returns (uint256)",
  "function redeem(uint256 shares, address receiver, address owner) returns (uint256)",
  
  // Chronos Vault specific interface
  "function unlockTime() view returns (uint256)",
  "function securityLevel() view returns (uint8)",
  "function isUnlocked() view returns (bool)",
  "function unlockEarly(string memory accessKey) returns (bool)",
  "function addAuthorizedWithdrawer(address withdrawer) returns (bool)",
  "function removeAuthorizedWithdrawer(address withdrawer) returns (bool)",
  "function isAuthorizedWithdrawer(address withdrawer) view returns (bool)",
  "function getVaultSummary() view returns (string memory name, string memory symbol, address asset, uint256 unlockTime, uint8 securityLevel, bool isUnlocked)",
  "function getMetadata() view returns (string memory name, string memory description, string[] memory tags, bytes32 contentHash, bool isPublic)",
  "function updateMetadata(string memory name, string memory description, string[] memory tags, bytes32 contentHash, bool isPublic) returns (bool)",
  
  // Cross-chain verification
  "function addCrossChainAddress(string memory chain, string memory address) returns (bool)",
  "function removeCrossChainAddress(string memory chain) returns (bool)",
  "function getCrossChainAddresses() view returns (string[] memory chains, string[] memory addresses)",
  "function updateVerificationProof(bytes32 proof) returns (bool)",
  "function generateVerificationProof() view returns (bytes32)",
  
  // Multi-signature support
  "function setupMultiSig(address[] memory signers, uint256 threshold) returns (bool)",
  "function getMultiSigConfig() view returns (address[] memory signers, uint256 threshold, uint256 nonce)",
  "function proposeTransaction(address target, uint256 value, bytes memory data) returns (bytes32)",
  "function confirmTransaction(bytes32 txHash) returns (bool)",
  "function executeTransaction(bytes32 txHash) returns (bool)",
  "function revokeConfirmation(bytes32 txHash) returns (bool)",
  
  // Geo-lock functionality
  "function enableGeoLock(string memory regionCode, bytes32 proofHash) returns (bool)",
  "function disableGeoLock() returns (bool)",
  "function isGeoLocked() view returns (bool)",
  "function verifyGeoLocation(string memory regionCode, bytes calldata proof) returns (bool)",
  
  // Events
  "event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
  "event VaultUnlocked(uint256 timestamp)",
  "event EarlyUnlock(address indexed unlocker, uint256 timestamp)",
  "event AuthorizedWithdrawerAdded(address indexed withdrawer)",
  "event AuthorizedWithdrawerRemoved(address indexed withdrawer)",
  "event MetadataUpdated(bytes32 contentHash)",
  "event CrossChainAddressAdded(string chain, string address)",
  "event CrossChainAddressRemoved(string chain)",
  "event VerificationProofUpdated(bytes32 proof, uint256 timestamp)",
  "event MultiSigSetup(address[] signers, uint256 threshold)",
  "event TransactionProposed(bytes32 indexed txHash, address indexed proposer, address indexed target, uint256 value, bytes data)",
  "event TransactionConfirmed(bytes32 indexed txHash, address indexed signer)",
  "event TransactionExecuted(bytes32 indexed txHash, address indexed executor)",
  "event ConfirmationRevoked(bytes32 indexed txHash, address indexed signer)",
  "event GeoLockEnabled(string regionCode)",
  "event GeoLockDisabled()"
];

// ABI for the Vault Factory contract
export const VAULT_FACTORY_ABI = [
  "function createVault(string name, string symbol, address asset, uint256 unlockTime, uint8 securityLevel, string accessKey, bool isPublic) external returns (address)",
  "function getVaultsByOwner(address owner) external view returns (address[])",
  "event VaultCreated(address indexed vault, address indexed owner, uint256 timestamp)"
];

// ABI for the CVT Bridge contract
export const CVT_BRIDGE_ABI = [
  "function bridgeOut(uint8 targetChain, bytes calldata targetAddress, uint256 amount) external",
  "function bridgeIn(uint8 sourceChain, bytes calldata sourceAddress, address recipient, uint256 amount, uint256 nonce, bytes[] calldata signatures) external",
  "function isBridgeProcessed(uint8 sourceChain, bytes calldata sourceAddress, address recipient, uint256 amount, uint256 nonce) external view returns (bool)",
  "function getBridgeSignatureCount(uint8 sourceChain, bytes calldata sourceAddress, address recipient, uint256 amount, uint256 nonce) external view returns (uint256)",
  "event BridgeInitiated(address indexed sender, uint8 targetChain, bytes targetAddress, uint256 amount, uint256 fee, uint256 nonce)",
  "event BridgeCompleted(address indexed recipient, uint8 sourceChain, bytes sourceAddress, uint256 amount, uint256 nonce)"
];

// Security level definitions
export const SECURITY_LEVELS = {
  STANDARD: 1,
  ENHANCED: 2,
  ADVANCED: 3,
  MAXIMUM: 4,
  FORTRESS: 5
};

// Chain ID constants
export const CHAIN_IDS = {
  TON: 0,
  ETHEREUM: 1,
  SOLANA: 2,
  BITCOIN: 3
};

// TON Vault ABI (simplified for TON Connect)
export const TON_CHRONOS_VAULT_ABI = {
  "name": "ChronosVault",
  "methods": [
    {
      "name": "getInfo",
      "inputs": [],
      "outputs": [
        { "name": "creator", "type": "address" },
        { "name": "recipient", "type": "address" },
        { "name": "unlockTime", "type": "uint64" },
        { "name": "securityLevel", "type": "uint8" },
        { "name": "isLocked", "type": "bool" },
        { "name": "comment", "type": "string" }
      ]
    },
    {
      "name": "unlock",
      "inputs": [],
      "outputs": [
        { "name": "success", "type": "bool" }
      ]
    },
    {
      "name": "withdraw",
      "inputs": [
        { "name": "destination", "type": "address" }
      ],
      "outputs": [
        { "name": "success", "type": "bool" }
      ]
    }
  ]
};

// TON CVT Token ABI (simplified for TON Connect)
export const TON_CVT_TOKEN_ABI = {
  "name": "ChronosVaultToken",
  "methods": [
    {
      "name": "balance",
      "inputs": [
        { "name": "owner", "type": "address" }
      ],
      "outputs": [
        { "name": "balance", "type": "uint128" }
      ]
    },
    {
      "name": "transfer",
      "inputs": [
        { "name": "destination", "type": "address" },
        { "name": "amount", "type": "uint128" },
        { "name": "comment", "type": "string" }
      ],
      "outputs": [
        { "name": "success", "type": "bool" }
      ]
    }
  ]
};

// TON Vault Factory ABI (simplified for TON Connect)
export const TON_VAULT_FACTORY_ABI = {
  "name": "ChronosVaultFactory",
  "methods": [
    {
      "name": "createVault",
      "inputs": [
        { "name": "recipient", "type": "address" },
        { "name": "unlockTime", "type": "uint64" },
        { "name": "securityLevel", "type": "uint8" },
        { "name": "comment", "type": "string" }
      ],
      "outputs": [
        { "name": "vaultAddress", "type": "address" }
      ]
    },
    {
      "name": "getVaults",
      "inputs": [
        { "name": "owner", "type": "address" }
      ],
      "outputs": [
        { "name": "vaults", "type": "address[]" }
      ]
    }
  ],
  "events": [
    {
      "name": "VaultCreated",
      "inputs": [
        { "name": "vaultAddress", "type": "address" },
        { "name": "creator", "type": "address" },
        { "name": "recipient", "type": "address" },
        { "name": "unlockTime", "type": "uint64" }
      ]
    }
  ]
};

// Format TON vault parameters for contract interaction
export interface TONVaultParams {
  recipient: string;
  unlockTime: number;
  securityLevel: number;
  comment?: string;
  amount?: string;
}

// Alias for compatibility with existing code
export type TONCreateVaultParams = TONVaultParams;

/**
 * Formats parameters for TON vault creation
 * @param params Vault creation parameters
 * @returns Formatted parameters for TON contract interaction
 */
export function formatTONVaultParams(params: TONVaultParams): any {
  // Ensure recipient address is properly formatted for TON
  const recipient = params.recipient.startsWith('0:') 
    ? params.recipient 
    : `0:${params.recipient.replace(/^EQ/, '')}`;
  
  // Format parameters according to TON contract expectations
  return {
    recipient: recipient,
    unlockTime: Math.floor(params.unlockTime), // Ensure integer timestamp
    securityLevel: params.securityLevel || 1,
    comment: params.comment || "",
    amount: params.amount ? params.amount : "0.1" // Default small amount for gas
  };
}