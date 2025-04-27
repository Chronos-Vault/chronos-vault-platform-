// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title ChronosVault
 * @dev An ERC-4626 compliant tokenized vault for time-locked digital assets
 *      with cross-chain integration capabilities
 * 
 * This vault implements the ERC-4626 Tokenized Vault Standard to provide
 * advanced financial functionality for the Chronos Vault platform.
 */
contract ChronosVault is ERC4626, Ownable, ReentrancyGuard {
    using Math for uint256;

    // =========== State Variables ===========

    // Time lock details
    uint256 public unlockTime;
    bool public isUnlocked;
    uint8 public securityLevel;
    
    // Cross-chain integration
    mapping(string => string) public crossChainAddresses;
    string[] public supportedBlockchains;
    
    // Vault metadata
    struct VaultMetadata {
        string name;
        string description;
        string[] tags;
        string contentHash;  // IPFS or other decentralized storage hash
        bool isPublic;
    }
    VaultMetadata public metadata;
    
    // Security mechanisms
    mapping(address => bool) public authorizedRetrievers;
    bytes32 public accessKeyHash;  // Hashed access key for high security levels
    
    // Proof of reserve
    uint256 public lastVerificationTimestamp;
    bytes32 public verificationProof;
    
    // Advanced vault features
    uint256 public performanceFee; // Basis points (1/100 of a percent)
    uint256 public managementFee;  // Basis points per year
    uint256 public lastFeeCollection;
    
    // =========== Events ===========
    
    event VaultCreated(address indexed creator, uint256 unlockTime, uint8 securityLevel);
    event VaultUnlocked(address indexed retriever, uint256 unlockTime);
    event CrossChainAddressAdded(string blockchain, string address);
    event SecurityLevelChanged(uint8 oldLevel, uint8 newLevel);
    event VerificationProofUpdated(bytes32 proof, uint256 timestamp);
    event AssetDeposited(address indexed from, uint256 amount);
    event AssetWithdrawn(address indexed to, uint256 amount);
    
    // =========== Constructor ===========
    
    /**
     * @dev Creates a new ChronosVault
     * @param _asset The ERC20 token address this vault will manage
     * @param _name The name of the vault token
     * @param _symbol The symbol of the vault token
     * @param _unlockTime Unix timestamp when the vault will unlock
     * @param _securityLevel Security level from 1-5
     * @param _accessKey Optional access key (required for security levels > 1)
     * @param _isPublic Whether the vault is publicly visible
     */
    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        uint256 _unlockTime,
        uint8 _securityLevel,
        string memory _accessKey,
        bool _isPublic
    ) 
        ERC20(_name, _symbol)
        ERC4626(_asset)
        Ownable(msg.sender)
    {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        require(_securityLevel >= 1 && _securityLevel <= 5, "Security level must be 1-5");
        
        // If security level > 1, require an access key
        if (_securityLevel > 1) {
            require(bytes(_accessKey).length > 0, "Access key required for security levels > 1");
            accessKeyHash = keccak256(abi.encodePacked(_accessKey));
        }
        
        unlockTime = _unlockTime;
        isUnlocked = false;
        securityLevel = _securityLevel;
        lastFeeCollection = block.timestamp;
        
        // Initialize metadata
        metadata = VaultMetadata({
            name: _name,
            description: "",
            tags: new string[](0),
            contentHash: "",
            isPublic: _isPublic
        });
        
        // Add vault creator as authorized retriever
        authorizedRetrievers[msg.sender] = true;
        
        emit VaultCreated(msg.sender, _unlockTime, _securityLevel);
    }
    
    // =========== Modifiers ===========
    
    modifier onlyWhenUnlocked() {
        require(block.timestamp >= unlockTime || isUnlocked, "Vault is still locked");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedRetrievers[msg.sender] || owner() == msg.sender, "Not authorized");
        _;
    }
    
    // =========== Core ERC-4626 Overrides ===========
    
    /**
     * @dev Deposit assets and mint vault tokens
     * @param assets Amount of assets to deposit
     * @param receiver Receiver of the vault tokens
     */
    function deposit(uint256 assets, address receiver) public override nonReentrant returns (uint256) {
        // If vault is unlocked, only owner can deposit
        if (isUnlocked) {
            require(msg.sender == owner(), "Only owner can deposit after unlock");
        }
        
        uint256 shares = super.deposit(assets, receiver);
        
        emit AssetDeposited(msg.sender, assets);
        return shares;
    }
    
    /**
     * @dev Withdraw assets
     * @param assets Amount of assets to withdraw
     * @param receiver Receiver of the assets
     * @param owner Owner of the vault shares
     */
    function withdraw(uint256 assets, address receiver, address owner) 
        public 
        override 
        nonReentrant 
        onlyWhenUnlocked
        returns (uint256) 
    {
        if (securityLevel > 1) {
            require(authorizedRetrievers[msg.sender], "Not an authorized retriever");
        }
        
        // Apply fees before withdrawal
        _collectFees();
        
        uint256 shares = super.withdraw(assets, receiver, owner);
        
        emit AssetWithdrawn(receiver, assets);
        return shares;
    }
    
    /**
     * @dev Redeem shares
     * @param shares Amount of shares to redeem
     * @param receiver Receiver of the assets
     * @param owner Owner of the vault shares
     */
    function redeem(uint256 shares, address receiver, address owner) 
        public 
        override 
        nonReentrant 
        onlyWhenUnlocked
        returns (uint256) 
    {
        if (securityLevel > 1) {
            require(authorizedRetrievers[msg.sender], "Not an authorized retriever");
        }
        
        // Apply fees before redemption
        _collectFees();
        
        uint256 assets = super.redeem(shares, receiver, owner);
        
        emit AssetWithdrawn(receiver, assets);
        return assets;
    }
    
    // =========== Vault Management Functions ===========
    
    /**
     * @dev Manually unlock the vault before the unlock time
     * @param _accessKey Access key for verification (required for security levels > 1)
     */
    function unlockEarly(string memory _accessKey) external onlyAuthorized {
        require(!isUnlocked, "Vault is already unlocked");
        
        // Verify access key for security levels > 1
        if (securityLevel > 1) {
            require(keccak256(abi.encodePacked(_accessKey)) == accessKeyHash, "Invalid access key");
        }
        
        isUnlocked = true;
        emit VaultUnlocked(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Add or update a cross-chain address for this vault
     * @param blockchain Name of the blockchain
     * @param contractAddress Address on that blockchain
     */
    function addCrossChainAddress(string memory blockchain, string memory contractAddress) 
        external 
        onlyOwner 
    {
        bool exists = false;
        for (uint i = 0; i < supportedBlockchains.length; i++) {
            if (keccak256(abi.encodePacked(supportedBlockchains[i])) == keccak256(abi.encodePacked(blockchain))) {
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            supportedBlockchains.push(blockchain);
        }
        
        crossChainAddresses[blockchain] = contractAddress;
        emit CrossChainAddressAdded(blockchain, contractAddress);
    }
    
    /**
     * @dev Update the vault's security level
     * @param _newLevel New security level (1-5)
     */
    function updateSecurityLevel(uint8 _newLevel) external onlyOwner {
        require(_newLevel >= 1 && _newLevel <= 5, "Security level must be 1-5");
        
        // If increasing security level, require that an access key is set
        if (_newLevel > securityLevel && _newLevel > 1) {
            require(accessKeyHash != bytes32(0), "Must set access key first for higher security");
        }
        
        uint8 oldLevel = securityLevel;
        securityLevel = _newLevel;
        
        emit SecurityLevelChanged(oldLevel, _newLevel);
    }
    
    /**
     * @dev Update the access key for the vault
     * @param _newAccessKey New access key
     */
    function updateAccessKey(string memory _newAccessKey) external onlyOwner {
        require(bytes(_newAccessKey).length > 0, "Access key cannot be empty");
        accessKeyHash = keccak256(abi.encodePacked(_newAccessKey));
    }
    
    /**
     * @dev Add an authorized retriever who can access the vault when unlocked
     * @param _retriever Address of the retriever
     */
    function addAuthorizedRetriever(address _retriever) external onlyOwner {
        authorizedRetrievers[_retriever] = true;
    }
    
    /**
     * @dev Remove an authorized retriever
     * @param _retriever Address of the retriever to remove
     */
    function removeAuthorizedRetriever(address _retriever) external onlyOwner {
        require(_retriever != owner(), "Cannot remove owner");
        authorizedRetrievers[_retriever] = false;
    }
    
    /**
     * @dev Update the vault's metadata
     * @param _name New name
     * @param _description New description
     * @param _tags New tags
     * @param _contentHash New content hash
     * @param _isPublic New visibility setting
     */
    function updateMetadata(
        string memory _name,
        string memory _description,
        string[] memory _tags,
        string memory _contentHash,
        bool _isPublic
    ) external onlyOwner {
        metadata.name = _name;
        metadata.description = _description;
        metadata.tags = _tags;
        metadata.contentHash = _contentHash;
        metadata.isPublic = _isPublic;
    }
    
    // =========== Fee Management Functions ===========
    
    /**
     * @dev Set the performance fee (taken on profits)
     * @param _feeInBasisPoints Fee in basis points (1/100 of a percent)
     */
    function setPerformanceFee(uint256 _feeInBasisPoints) external onlyOwner {
        require(_feeInBasisPoints <= 2000, "Fee cannot exceed 20%");
        performanceFee = _feeInBasisPoints;
    }
    
    /**
     * @dev Set the management fee (annual fee on all assets)
     * @param _feeInBasisPoints Fee in basis points per year
     */
    function setManagementFee(uint256 _feeInBasisPoints) external onlyOwner {
        require(_feeInBasisPoints <= 500, "Fee cannot exceed 5% annually");
        managementFee = _feeInBasisPoints;
    }
    
    /**
     * @dev Collect accrued fees
     */
    function collectFees() external onlyOwner {
        _collectFees();
    }
    
    /**
     * @dev Internal function to collect accrued fees
     */
    function _collectFees() internal {
        if (lastFeeCollection == block.timestamp) {
            return;
        }
        
        uint256 totalAssets = totalAssets();
        if (totalAssets == 0) {
            lastFeeCollection = block.timestamp;
            return;
        }
        
        // Calculate time-based management fee
        uint256 timeElapsed = block.timestamp - lastFeeCollection;
        if (managementFee > 0 && timeElapsed > 0) {
            // managementFee is in basis points per year
            // Calculate pro-rated fee for the time elapsed
            uint256 yearInSeconds = 365 days;
            uint256 feeAmount = totalAssets
                .mulDiv(managementFee, 10000) // Convert basis points to percentage
                .mulDiv(timeElapsed, yearInSeconds); // Pro-rate for time elapsed
                
            if (feeAmount > 0) {
                // Mint new shares for the owner as fees
                _mint(owner(), convertToShares(feeAmount));
            }
        }
        
        lastFeeCollection = block.timestamp;
    }
    
    // =========== Verification Functions ===========
    
    /**
     * @dev Update the verification proof for cross-chain validation
     * @param _proof New verification proof
     */
    function updateVerificationProof(bytes32 _proof) external onlyOwner {
        verificationProof = _proof;
        lastVerificationTimestamp = block.timestamp;
        
        emit VerificationProofUpdated(_proof, block.timestamp);
    }
    
    /**
     * @dev Generate a verification proof for cross-chain validation
     * @return The generated proof
     */
    function generateVerificationProof() external view returns (bytes32) {
        return keccak256(abi.encodePacked(
            address(this),
            block.timestamp,
            unlockTime,
            totalAssets(),
            securityLevel
        ));
    }
    
    // =========== View Functions ===========
    
    /**
     * @dev Get all supported blockchains
     * @return Array of blockchain names
     */
    function getSupportedBlockchains() external view returns (string[] memory) {
        return supportedBlockchains;
    }
    
    /**
     * @dev Get all cross-chain addresses
     * @return Array of blockchain names and their corresponding addresses
     */
    function getAllCrossChainAddresses() external view returns (string[] memory, string[] memory) {
        string[] memory blockchains = new string[](supportedBlockchains.length);
        string[] memory addresses = new string[](supportedBlockchains.length);
        
        for (uint i = 0; i < supportedBlockchains.length; i++) {
            blockchains[i] = supportedBlockchains[i];
            addresses[i] = crossChainAddresses[supportedBlockchains[i]];
        }
        
        return (blockchains, addresses);
    }
    
    /**
     * @dev Get the vault's metadata
     * @return Complete metadata structure
     */
    function getMetadata() external view returns (
        string memory name,
        string memory description,
        string[] memory tags,
        string memory contentHash,
        bool isPublic
    ) {
        return (
            metadata.name,
            metadata.description,
            metadata.tags,
            metadata.contentHash,
            metadata.isPublic
        );
    }
    
    /**
     * @dev Check if vault is currently unlocked
     * @return True if unlocked
     */
    function checkIfUnlocked() external view returns (bool) {
        return isUnlocked || block.timestamp >= unlockTime;
    }
    
    /**
     * @dev Check if an address is authorized to retrieve assets
     * @param _address Address to check
     * @return True if authorized
     */
    function isAuthorizedRetriever(address _address) external view returns (bool) {
        return authorizedRetrievers[_address] || _address == owner();
    }
    
    /**
     * @dev Verify an access key
     * @param _accessKey Access key to verify
     * @return True if valid
     */
    function verifyAccessKey(string memory _accessKey) external view returns (bool) {
        return keccak256(abi.encodePacked(_accessKey)) == accessKeyHash;
    }
}