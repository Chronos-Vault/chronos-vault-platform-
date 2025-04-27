/**
 * Contract interfaces for interacting with Chronos Vault smart contracts
 * across multiple blockchains.
 */
import { Contract, formatUnits } from 'ethers';
import { parseEther, formatEther } from 'viem';

/**
 * ChronosVault contract ABI (Ethereum)
 */
export const CHRONOS_VAULT_ABI = [
  // Core functionality
  "constructor(address _asset, string memory _name, string memory _symbol, uint256 _unlockTime, uint8 _securityLevel, string memory _accessKey, bool _isPublic)",
  "function deposit(uint256 assets, address receiver) public returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) public returns (uint256)",
  "function redeem(uint256 shares, address receiver, address owner) public returns (uint256)",
  
  // Vault Management
  "function unlockEarly(string memory _accessKey) external",
  "function addAuthorizedRetriever(address _retriever) external",
  "function removeAuthorizedRetriever(address _retriever) external",
  "function updateSecurityLevel(uint8 _newLevel) external",
  "function updateAccessKey(string memory _newAccessKey) external",
  "function updateMetadata(string memory _name, string memory _description, string[] memory _tags, string memory _contentHash, bool _isPublic) external",
  
  // Cross-chain
  "function addCrossChainAddress(string memory blockchain, string memory contractAddress) external",
  "function getSupportedBlockchains() external view returns (string[] memory)",
  "function getAllCrossChainAddresses() external view returns (string[] memory, string[] memory)",
  
  // Fee management
  "function setPerformanceFee(uint256 _feeInBasisPoints) external",
  "function setManagementFee(uint256 _feeInBasisPoints) external",
  "function collectFees() external",
  
  // Verification
  "function updateVerificationProof(bytes32 _proof) external",
  "function generateVerificationProof() external view returns (bytes32)",
  
  // View functions
  "function unlockTime() public view returns (uint256)",
  "function isUnlocked() public view returns (bool)",
  "function securityLevel() public view returns (uint8)",
  "function checkIfUnlocked() external view returns (bool)",
  "function isAuthorizedRetriever(address _address) external view returns (bool)",
  "function verifyAccessKey(string memory _accessKey) external view returns (bool)",
  "function getMetadata() external view returns (string memory name, string memory description, string[] memory tags, string memory contentHash, bool isPublic)",
  
  // ERC4626 standard
  "function asset() external view returns (address)",
  "function totalAssets() external view returns (uint256)",
  "function convertToShares(uint256 assets) external view returns (uint256)",
  "function convertToAssets(uint256 shares) external view returns (uint256)",
  "function maxDeposit(address receiver) external view returns (uint256)",
  "function maxMint(address receiver) external view returns (uint256)",
  "function maxWithdraw(address owner) external view returns (uint256)",
  "function maxRedeem(address owner) external view returns (uint256)",
  
  // Events
  "event VaultCreated(address indexed creator, uint256 unlockTime, uint8 securityLevel)",
  "event VaultUnlocked(address indexed retriever, uint256 unlockTime)",
  "event CrossChainAddressAdded(string blockchain, string address)",
  "event SecurityLevelChanged(uint8 oldLevel, uint8 newLevel)",
  "event VerificationProofUpdated(bytes32 proof, uint256 timestamp)",
  "event AssetDeposited(address indexed from, uint256 amount)",
  "event AssetWithdrawn(address indexed to, uint256 amount)"
];

/**
 * CVT Bridge contract ABI (Ethereum)
 */
export const CVT_BRIDGE_ABI = [
  // Bridge out
  "function bridgeOut(uint8 targetChain, bytes calldata targetAddress, uint256 amount) external",
  
  // Bridge in
  "function bridgeIn(uint8 sourceChain, bytes calldata sourceAddress, address recipient, uint256 amount, uint256 nonce, bytes[] calldata signatures) external",
  
  // Admin functions
  "function addValidator(address validator) external",
  "function removeValidator(address validator) external",
  "function updateThreshold(uint256 newThreshold) external",
  "function updateFee(uint256 newFee) external",
  "function updateMinAmount(uint256 newMinAmount) external",
  "function pause() external",
  "function unpause() external",
  "function emergencyWithdraw(address token, address recipient, uint256 amount) external",
  
  // View functions
  "function isBridgeProcessed(uint8 sourceChain, bytes calldata sourceAddress, address recipient, uint256 amount, uint256 nonce) external view returns (bool)",
  "function getBridgeSignatureCount(uint8 sourceChain, bytes calldata sourceAddress, address recipient, uint256 amount, uint256 nonce) external view returns (uint256)",
  "function isValidator(address validator) external view returns (bool)",
  "function bridgeFee() public view returns (uint256)",
  "function minAmount() public view returns (uint256)",
  "function threshold() public view returns (uint256)",
  "function validatorCount() public view returns (uint256)",
  
  // Events
  "event BridgeInitiated(address indexed sender, uint8 targetChain, bytes targetAddress, uint256 amount, uint256 fee, uint256 nonce)",
  "event BridgeCompleted(address indexed recipient, uint8 sourceChain, bytes sourceAddress, uint256 amount, uint256 nonce)",
  "event ValidatorAdded(address indexed validator)",
  "event ValidatorRemoved(address indexed validator)",
  "event ThresholdUpdated(uint256 oldThreshold, uint256 newThreshold)",
  "event FeeUpdated(uint256 oldFee, uint256 newFee)"
];

/**
 * ChronosToken (CVT) contract ABI (Ethereum)
 */
export const CVT_TOKEN_ABI = [
  // ERC20 standard
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  
  // ERC20Permit
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external",
  
  // ERC20Votes
  "function delegate(address delegatee) external",
  "function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external",
  "function getCurrentVotes(address account) external view returns (uint256)",
  "function getPriorVotes(address account, uint256 blockNumber) external view returns (uint256)",
  
  // Bridge functions
  "function bridgeMint(address to, uint256 amount) external",
  "function bridgeBurn(address from, uint256 amount) external",
  "function setBridge(address _bridge) external",
  "function bridge() external view returns (address)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event BridgeUpdated(address indexed previousBridge, address indexed newBridge)"
];

/**
 * CVT Staking Vault contract ABI (Ethereum)
 */
export const CVT_STAKING_VAULT_ABI = [
  // Staking functions
  "function stake(uint256 amount, uint256 lockDuration) external",
  "function stakeWithPooling(uint256 amount, uint256 lockDuration, uint256 poolId) external",
  "function unstake(uint256 amount) external",
  "function claimRewards() external",
  "function exitPool(uint256 poolId) external",
  
  // Pool functions
  "function createPool(string memory name, uint256 minContribution) external",
  "function joinPool(uint256 poolId, uint256 amount) external",
  "function getPoolInfo(uint256 poolId) external view returns (string memory name, uint256 totalStaked, uint8 tier, uint256 participantCount)",
  
  // View functions
  "function getStakeInfo(address user) external view returns (uint256 amount, uint256 lockedUntil, uint256 stakedAt, uint8 tier, bool autoCompound, address rewardsDestination)",
  "function calculateRewards(address user) external view returns (uint256)",
  "function getUserTier(address user) external view returns (uint8)",
  "function getUserMultiplier(address user) external view returns (uint256)",
  
  // Admin functions
  "function updateTierThresholds(uint256 guardian, uint256 architect, uint256 sovereign) external",
  "function updateTierMultipliers(uint256 guardian, uint256 architect, uint256 sovereign) external",
  "function updateTimeMultipliers(uint256 threeMonth, uint256 sixMonth, uint256 oneYear, uint256 twoYear) external",
  
  // Events
  "event Staked(address indexed user, uint256 amount, uint256 lockDuration, uint8 tier)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
  "event PoolCreated(uint256 indexed poolId, address indexed creator, string name, uint256 minContribution)",
  "event PoolJoined(uint256 indexed poolId, address indexed user, uint256 amount)"
];

/**
 * Chain IDs for the bridge
 */
export enum ChainId {
  TON = 0,
  ETHEREUM = 1,
  SOLANA = 2
}

/**
 * Security levels for vaults
 */
export enum SecurityLevel {
  BASIC = 1,
  ENHANCED = 2,
  ADVANCED = 3,
  MILITARY = 4,
  QUANTUM = 5
}

/**
 * Vault types
 */
export enum VaultType {
  LEGACY = "legacy",
  INVESTMENT = "investment",
  PERSONAL = "personal",
  MULTI_SIG = "multi-sig"
}

/**
 * Vault metadata structure
 */
export interface VaultMetadata {
  name: string;
  description: string;
  tags: string[];
  contentHash: string;
  isPublic: boolean;
}

/**
 * Structure for creating a new vault
 */
export interface CreateVaultParams {
  asset: string;               // Address of the token to store
  name: string;                // Name of the vault
  symbol: string;              // Symbol for the vault token
  unlockTime: number;          // Unix timestamp for unlock
  securityLevel: SecurityLevel; // Security level (1-5)
  accessKey?: string;          // Access key (required for security level > 1)
  isPublic: boolean;           // Whether the vault is publicly visible
  vaultType: VaultType;        // Type of vault
  initialDeposit?: string;     // Optional initial deposit amount
}

/**
 * Bridge transaction parameters
 */
export interface BridgeParams {
  sourceChain: ChainId;
  targetChain: ChainId;
  targetAddress: string;
  amount: string;
}

/**
 * Helper function to format vault creation parameters for contract calls
 */
export function formatVaultParams(params: CreateVaultParams) {
  return [
    params.asset,
    params.name,
    params.symbol,
    params.unlockTime,
    params.securityLevel,
    params.accessKey || "",
    params.isPublic
  ];
}

/**
 * Helper function to estimate gas for vault creation
 */
export async function estimateVaultCreationGas(
  contract: Contract,
  params: CreateVaultParams
) {
  const formattedParams = formatVaultParams(params);
  try {
    const gasEstimate = await contract.estimateGas.constructor(...formattedParams);
    // Add 10% buffer for gas price fluctuations
    return gasEstimate.mul(110).div(100);
  } catch (error) {
    console.error("Gas estimation failed:", error);
    // Return a default high gas limit if estimation fails
    return parseEther("3000000");
  }
}

/**
 * Helper function to format bridge parameters for contract calls
 */
export function formatBridgeParams(params: BridgeParams) {
  return [
    params.targetChain,
    new TextEncoder().encode(params.targetAddress),
    parseEther(params.amount)
  ];
}