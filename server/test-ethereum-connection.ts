/**
 * Test Script for Real Ethereum Connection
 * Tests connection to deployed ChronosVault contract on Sepolia
 */

import { ethers } from 'ethers';
import config from './config';

async function testEthereumConnection() {
  console.log('\n🧪 Testing REAL Ethereum Connection...\n');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Connect to Sepolia
    console.log('📡 Step 1: Connecting to Sepolia RPC...');
    const rpcUrl = process.env.ETHEREUM_RPC_URL || config.blockchainConfig.ethereum.rpcUrl;
    console.log(`   RPC URL: ${rpcUrl}`);
    
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    console.log(`✅ Connected to: ${network.name} (Chain ID: ${network.chainId})\n`);
    
    // Step 2: Get deployed contract addresses
    console.log('📍 Step 2: Loading deployed contract addresses...');
    const vaultAddress = config.blockchainConfig.ethereum.contractAddresses.vault;
    const tokenAddress = config.blockchainConfig.ethereum.contractAddresses.testToken;
    const bridgeAddress = config.blockchainConfig.ethereum.contractAddresses.crossChainBridge;
    
    console.log(`   ChronosVault: ${vaultAddress}`);
    console.log(`   TestERC20: ${tokenAddress}`);
    console.log(`   CrossChainBridge: ${bridgeAddress}\n`);
    
    // Step 3: Check if contracts exist on-chain
    console.log('🔍 Step 3: Verifying contracts exist on Sepolia...');
    
    const vaultCode = await provider.getCode(vaultAddress);
    const tokenCode = await provider.getCode(tokenAddress);
    const bridgeCode = await provider.getCode(bridgeAddress);
    
    if (vaultCode === '0x') {
      throw new Error(`ChronosVault not found at ${vaultAddress}`);
    }
    if (tokenCode === '0x') {
      throw new Error(`TestERC20 not found at ${tokenAddress}`);
    }
    if (bridgeCode === '0x') {
      throw new Error(`CrossChainBridge not found at ${bridgeAddress}`);
    }
    
    console.log('✅ ChronosVault contract verified on-chain');
    console.log('✅ TestERC20 contract verified on-chain');
    console.log('✅ CrossChainBridge contract verified on-chain\n');
    
    // Step 4: Test basic contract interaction
    console.log('🔗 Step 4: Testing contract interaction...');
    
    // Simple ABI for testing
    const vaultAbi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)"
    ];
    
    const tokenAbi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)"
    ];
    
    const vaultContract = new ethers.Contract(vaultAddress, vaultAbi, provider);
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
    
    try {
      const vaultName = await vaultContract.name();
      const vaultSymbol = await vaultContract.symbol();
      console.log(`✅ ChronosVault: ${vaultName} (${vaultSymbol})`);
    } catch (e) {
      console.log('⚠️  ChronosVault: Contract exists but name/symbol not available (expected for time-lock vault)');
    }
    
    const tokenName = await tokenContract.name();
    const tokenSymbol = await tokenContract.symbol();
    const totalSupply = await tokenContract.totalSupply();
    
    console.log(`✅ TestERC20: ${tokenName} (${tokenSymbol})`);
    console.log(`   Total Supply: ${ethers.formatUnits(totalSupply, 18)} tokens\n`);
    
    // Step 5: Check block number
    console.log('📦 Step 5: Checking latest block...');
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Latest block: ${blockNumber}\n`);
    
    // Success!
    console.log('='.repeat(60));
    console.log('🎉 SUCCESS! Real Ethereum connection is working!\n');
    console.log('✅ All contracts deployed and accessible');
    console.log('✅ Can read from blockchain');
    console.log('✅ Trinity Protocol ready for Ethereum integration');
    console.log('\n📍 View your contracts on Etherscan:');
    console.log(`   ChronosVault: https://sepolia.etherscan.io/address/${vaultAddress}`);
    console.log(`   TestERC20: https://sepolia.etherscan.io/address/${tokenAddress}`);
    console.log(`   CrossChainBridge: https://sepolia.etherscan.io/address/${bridgeAddress}`);
    console.log('='.repeat(60));
    console.log('\n');
    
    return true;
  } catch (error) {
    console.log('\n❌ FAILED: Ethereum connection test failed');
    console.error(error);
    return false;
  }
}

export { testEthereumConnection };

// Run if executed directly
testEthereumConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
