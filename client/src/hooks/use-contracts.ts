/**
 * React hooks for interacting with blockchain contracts
 */
import { useState, useEffect, useCallback } from 'react';
import { ethers, Contract } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { createPublicClient, http, parseEther } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/auth-context';
import { useMultiChain } from '@/contexts/multi-chain-context';
import {
  CHRONOS_VAULT_ABI,
  CVT_BRIDGE_ABI,
  CVT_TOKEN_ABI,
  CVT_STAKING_VAULT_ABI,
  CreateVaultParams,
  VaultMetadata,
  formatVaultParams,
  BridgeParams,
  formatBridgeParams,
  ChainId,
  SecurityLevel,
  VaultType
} from '@/lib/contract-interfaces';

// Contract addresses - in production these would be environment variables or from a config file
const ETH_CONTRACTS = {
  cvtToken: '0x123456789012345678901234567890123456789a', // Replace with actual addresses
  cvtBridge: '0x123456789012345678901234567890123456789b',
  vaultFactory: '0x123456789012345678901234567890123456789c',
  stakingVault: '0x123456789012345678901234567890123456789d'
};

// TON endpoints and contract info
const TON_ENDPOINTS = {
  mainnet: 'https://toncenter.com/api/v2/jsonRPC',
  testnet: 'https://testnet.toncenter.com/api/v2/jsonRPC'
};

/**
 * Hook for getting the CVT token contract
 */
export function useCVTTokenContract() {
  const { address, isConnected } = useAccount();
  const { currentChain, isTestnet } = useMultiChain();
  const { toast } = useToast();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;

    const initContract = async () => {
      try {
        // In a real implementation, would check chain ID and use appropriate address
        const tokenAddress = ETH_CONTRACTS.cvtToken;
        
        // Using ethers.js for Web3 Provider interaction
        if (window.ethereum) {
          const provider = new ethers.JsonRpcProvider(window.ethereum);
          const signer = await provider.getSigner();
          const tokenContract = new ethers.Contract(tokenAddress, CVT_TOKEN_ABI, signer);
          
          setContract(tokenContract);
  
          // Get initial balance
          const tokenBalance = await tokenContract.balanceOf(address);
          setBalance(tokenBalance.toString());
        }
      } catch (error) {
        console.error('Error initializing CVT token contract:', error);
        toast({
          title: 'Contract Error',
          description: 'Failed to connect to the CVT token contract',
          variant: 'destructive'
        });
      }
    };

    initContract();
  }, [address, isConnected, toast, currentChain, isTestnet]);

  // Function to refresh balance
  const refreshBalance = useCallback(async () => {
    if (!contract || !address) return;
    
    try {
      setLoading(true);
      const tokenBalance = await contract.balanceOf(address);
      setBalance(tokenBalance.toString());
    } catch (error) {
      console.error('Error fetching CVT balance:', error);
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  // Transfer CVT tokens
  const transferCVT = useCallback(async (recipient: string, amount: string) => {
    if (!contract) {
      toast({
        title: 'Error',
        description: 'Token contract not initialized',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setLoading(true);
      const parsedAmount = parseEther(amount);
      const tx = await contract.transfer(recipient, parsedAmount);
      await tx.wait();
      
      toast({
        title: 'Transfer Successful',
        description: `Transferred ${amount} CVT to ${recipient.substring(0, 6)}...${recipient.substring(38)}`,
      });
      
      await refreshBalance();
      return true;
    } catch (error) {
      console.error('Error transferring CVT:', error);
      toast({
        title: 'Transfer Failed',
        description: 'Failed to transfer CVT tokens',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, toast, refreshBalance]);

  // Approve CVT tokens for spending by another contract
  const approveCVT = useCallback(async (spender: string, amount: string) => {
    if (!contract) {
      toast({
        title: 'Error',
        description: 'Token contract not initialized',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setLoading(true);
      const parsedAmount = parseEther(amount);
      const tx = await contract.approve(spender, parsedAmount);
      await tx.wait();
      
      toast({
        title: 'Approval Successful',
        description: `Approved ${amount} CVT for ${spender.substring(0, 6)}...${spender.substring(38)}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error approving CVT:', error);
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve CVT tokens',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, toast]);

  return {
    contract,
    balance,
    loading,
    refreshBalance,
    transferCVT,
    approveCVT
  };
}

/**
 * Hook for interacting with the bridge contract
 */
export function useBridgeContract() {
  const { address, isConnected } = useAccount();
  const { currentChain, isTestnet } = useMultiChain();
  const { toast } = useToast();
  const { contract: cvtContract } = useCVTTokenContract();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;

    const initContract = async () => {
      try {
        // In a real implementation, would check chain ID and use appropriate address
        const bridgeAddress = ETH_CONTRACTS.cvtBridge;
        
        if (window.ethereum) {
          const provider = new ethers.JsonRpcProvider(window.ethereum);
          const signer = await provider.getSigner();
          const bridgeContract = new ethers.Contract(bridgeAddress, CVT_BRIDGE_ABI, signer);
          
          setContract(bridgeContract);
        }
      } catch (error) {
        console.error('Error initializing bridge contract:', error);
        toast({
          title: 'Contract Error',
          description: 'Failed to connect to the bridge contract',
          variant: 'destructive'
        });
      }
    };

    initContract();
  }, [address, isConnected, toast, currentChain, isTestnet]);

  // Bridge tokens to another chain
  const bridgeTokens = useCallback(async (params: BridgeParams) => {
    if (!contract || !cvtContract) {
      toast({
        title: 'Error',
        description: 'Contracts not initialized',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      // First approve the bridge to spend CVT tokens
      const parsedAmount = parseEther(params.amount);
      const approveTx = await cvtContract.approve(contract.address, parsedAmount);
      await approveTx.wait();
      
      // Then perform the bridge operation
      const formattedParams = formatBridgeParams(params);
      const tx = await contract.bridgeOut(...formattedParams);
      await tx.wait();
      
      toast({
        title: 'Bridge Successful',
        description: `Bridged ${params.amount} CVT to ${ChainId[params.targetChain]}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error bridging tokens:', error);
      toast({
        title: 'Bridge Failed',
        description: 'Failed to bridge tokens',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, cvtContract, toast]);

  return {
    contract,
    loading,
    bridgeTokens
  };
}

/**
 * Hook for creating and interacting with vault contracts
 */
export function useVaultContract() {
  const { address, isConnected } = useAccount();
  const { currentChain, isTestnet } = useMultiChain();
  const { toast } = useToast();
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;

    const initContract = async () => {
      try {
        // In a real implementation, would check chain ID and use appropriate address
        const vaultFactoryAddress = ETH_CONTRACTS.vaultFactory;
        
        if (window.ethereum) {
          const provider = new ethers.JsonRpcProvider(window.ethereum);
          const signer = await provider.getSigner();
          const factory = new ethers.Contract(vaultFactoryAddress, ['function createVault(address,string,string,uint256,uint8,string,bool) returns (address)'], signer);
          
          setFactoryContract(factory);
        }
      } catch (error) {
        console.error('Error initializing vault factory contract:', error);
        toast({
          title: 'Contract Error',
          description: 'Failed to connect to the vault factory contract',
          variant: 'destructive'
        });
      }
    };

    initContract();
  }, [address, isConnected, toast, currentChain, isTestnet]);

  // Create a new vault
  const createVault = useCallback(async (params: CreateVaultParams) => {
    if (!factoryContract) {
      toast({
        title: 'Error',
        description: 'Vault factory contract not initialized',
        variant: 'destructive'
      });
      return null;
    }
    
    try {
      setLoading(true);
      
      const formattedParams = formatVaultParams(params);
      const tx = await factoryContract.createVault(...formattedParams);
      const receipt = await tx.wait();
      
      // Get the vault address from the event
      const vaultCreatedEvent = receipt.events.find((e: any) => e.event === 'VaultCreated');
      const vaultAddress = vaultCreatedEvent?.args?.vault;
      
      if (!vaultAddress) {
        throw new Error('Vault address not found in transaction receipt');
      }
      
      toast({
        title: 'Vault Created',
        description: `Your ${params.vaultType} vault has been created!`,
      });
      
      return vaultAddress;
    } catch (error) {
      console.error('Error creating vault:', error);
      toast({
        title: 'Vault Creation Failed',
        description: 'Failed to create vault',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [factoryContract, toast]);

  // Get an existing vault contract instance
  const getVaultContract = useCallback((vaultAddress: string) => {
    if (!isConnected) return null;
    
    try {
      if (window.ethereum) {
        const provider = new ethers.JsonRpcProvider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(vaultAddress, CHRONOS_VAULT_ABI, signer);
      }
      return null;
    } catch (error) {
      console.error('Error getting vault contract:', error);
      return null;
    }
  }, [isConnected]);

  // Deposit assets into a vault
  const depositToVault = useCallback(async (vaultAddress: string, amount: string) => {
    if (!window.ethereum) {
      toast({
        title: 'No Provider',
        description: 'Ethereum provider not found',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      const provider = new ethers.JsonRpcProvider(window.ethereum);
      const signer = await provider.getSigner();
      const vaultContract = new ethers.Contract(vaultAddress, CHRONOS_VAULT_ABI, signer);
      
      if (!vaultContract) {
        toast({
          title: 'Error',
          description: 'Vault contract not initialized',
          variant: 'destructive'
        });
        return false;
      }
      
      setLoading(true);
      
      // Check what asset the vault accepts
      const asset = await vaultContract.asset();
      // Create ERC20 interface to approve tokens
      const erc20Contract = new ethers.Contract(asset, ['function approve(address,uint256) returns (bool)'], signer);
      
      // Approve vault to spend tokens
      const parsedAmount = parseEther(amount);
      const approveTx = await erc20Contract.approve(vaultAddress, parsedAmount);
      await approveTx.wait();
      
      // Deposit into vault
      const tx = await vaultContract.deposit(parsedAmount, address);
      await tx.wait();
      
      toast({
        title: 'Deposit Successful',
        description: `Deposited ${amount} into your vault`,
      });
      
      return true;
    } catch (error) {
      console.error('Error depositing to vault:', error);
      toast({
        title: 'Deposit Failed',
        description: 'Failed to deposit into vault',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [address, toast]);

  return {
    factoryContract,
    loading,
    createVault,
    getVaultContract,
    depositToVault
  };
}

/**
 * Hook for interacting with staking contracts
 */
export function useStakingContract() {
  const { address, isConnected } = useAccount();
  const { currentChain, isTestnet } = useMultiChain();
  const { toast } = useToast();
  const { contract: cvtContract } = useCVTTokenContract();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [stakedBalance, setStakedBalance] = useState<string>('0');
  const [rewards, setRewards] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;

    const initContract = async () => {
      try {
        // In a real implementation, would check chain ID and use appropriate address
        const stakingAddress = ETH_CONTRACTS.stakingVault;
        
        if (window.ethereum) {
          const provider = new ethers.JsonRpcProvider(window.ethereum);
          const signer = await provider.getSigner();
          const stakingContract = new ethers.Contract(stakingAddress, CVT_STAKING_VAULT_ABI, signer);
          
          setContract(stakingContract);
          
          // Get initial staked balance and rewards
          const stakedBal = await stakingContract.balanceOf(address);
          setStakedBalance(stakedBal.toString());
          
          const currentRewards = await stakingContract.earned(address);
          setRewards(currentRewards.toString());
        }
      } catch (error) {
        console.error('Error initializing staking contract:', error);
        toast({
          title: 'Contract Error',
          description: 'Failed to connect to the staking contract',
          variant: 'destructive'
        });
      }
    };

    initContract();
  }, [address, isConnected, toast, currentChain, isTestnet]);

  // Function to refresh balances
  const refreshBalances = useCallback(async () => {
    if (!contract || !address) return;
    
    try {
      setLoading(true);
      const stakedBal = await contract.balanceOf(address);
      setStakedBalance(stakedBal.toString());
      
      const currentRewards = await contract.earned(address);
      setRewards(currentRewards.toString());
    } catch (error) {
      console.error('Error fetching staking data:', error);
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  // Stake CVT tokens
  const stake = useCallback(async (amount: string) => {
    if (!contract || !cvtContract) {
      toast({
        title: 'Error',
        description: 'Contracts not initialized',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      // First approve staking contract to spend CVT tokens
      const parsedAmount = parseEther(amount);
      const approveTx = await cvtContract.approve(contract.address, parsedAmount);
      await approveTx.wait();
      
      // Then stake the tokens
      const tx = await contract.stake(parsedAmount);
      await tx.wait();
      
      toast({
        title: 'Staking Successful',
        description: `Staked ${amount} CVT tokens`,
      });
      
      await refreshBalances();
      return true;
    } catch (error) {
      console.error('Error staking tokens:', error);
      toast({
        title: 'Staking Failed',
        description: 'Failed to stake CVT tokens',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, cvtContract, toast, refreshBalances]);

  // Withdraw staked tokens
  const withdraw = useCallback(async (amount: string) => {
    if (!contract) {
      toast({
        title: 'Error',
        description: 'Staking contract not initialized',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const parsedAmount = parseEther(amount);
      const tx = await contract.withdraw(parsedAmount);
      await tx.wait();
      
      toast({
        title: 'Withdrawal Successful',
        description: `Withdrew ${amount} CVT tokens`,
      });
      
      await refreshBalances();
      return true;
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      toast({
        title: 'Withdrawal Failed',
        description: 'Failed to withdraw CVT tokens',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, toast, refreshBalances]);

  // Claim staking rewards
  const claimRewards = useCallback(async () => {
    if (!contract) {
      toast({
        title: 'Error',
        description: 'Staking contract not initialized',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const tx = await contract.getReward();
      await tx.wait();
      
      toast({
        title: 'Rewards Claimed',
        description: 'Successfully claimed your staking rewards',
      });
      
      await refreshBalances();
      return true;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast({
        title: 'Claim Failed',
        description: 'Failed to claim staking rewards',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, toast, refreshBalances]);

  return {
    contract,
    stakedBalance,
    rewards,
    loading,
    refreshBalances,
    stake,
    withdraw,
    claimRewards
  };
}

/**
 * Hook for TON-specific functionality
 */
export function useTONFunctionality() {
  // TON wallet-specific functionality
  const connectTON = async () => {
    try {
      if (typeof window !== 'undefined' && typeof (window as any).tonkeeper !== 'undefined') {
        // Connect to TON wallet
      }
    } catch (error) {
      console.error('Error connecting to TON wallet:', error);
    }
  };
  
  return { connectTON };
}

/**
 * Hook for Solana-specific functionality
 */
export function useSolanaFunctionality() {
  // Solana wallet-specific functionality
  const connectSolana = async () => {
    try {
      if (typeof window !== 'undefined' && typeof (window as any).phantom !== 'undefined') {
        // Connect to Phantom wallet
      }
    } catch (error) {
      console.error('Error connecting to Solana wallet:', error);
    }
  };
  
  return { connectSolana };
}