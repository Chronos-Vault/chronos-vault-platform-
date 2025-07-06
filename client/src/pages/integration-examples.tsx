import React from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Code, 
  Link as LinkIcon, 
  Github, 
  Monitor, 
  Smartphone, 
  Rocket, 
  Building2,
  ArrowLeftRight,
  HeartHandshake,
  FileCode,
  ExternalLink
} from "lucide-react";

const IntegrationExamples = () => {
  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
              Integration Examples
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Practical examples for integrating Chronos Vault into your applications
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
              <Link href="/api-documentation">View API Documentation</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="web" className="w-full">
          <TabsList className="grid grid-cols-6 w-full mb-8">
            <TabsTrigger value="web">Web App</TabsTrigger>
            <TabsTrigger value="mobile">Mobile App</TabsTrigger>
            <TabsTrigger value="defi">DeFi Protocol</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            <TabsTrigger value="cross-chain">Cross-Chain</TabsTrigger>
            <TabsTrigger value="estate">Digital Estate</TabsTrigger>
          </TabsList>

          <TabsContent value="web">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-6 w-6 text-indigo-500" />
                  Web Application Integration
                </CardTitle>
                <CardDescription>
                  Integrate Chronos Vault into a React.js application using Next.js
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                  <p className="text-lg mb-4">
                    This example demonstrates how to integrate Chronos Vault into a modern React web application.
                    It includes authentication with Web3 wallets, listing and managing vaults, and working with real-time updates.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Key Integration Points</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Authentication with Web3 wallets (MetaMask, WalletConnect)</li>
                    <li>Vault management (listing, creation, updates)</li>
                    <li>WebSocket integration for real-time updates</li>
                    <li>Error handling and user feedback</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Authentication Component</h3>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// components/ChronosAuth.tsx
import { useState, useEffect } from 'react';
import { ChronosVaultClient } from '@chronos-vault/sdk';
import { useWeb3React } from '@web3-react/core';

export default function ChronosAuth({ onAuthComplete }) {
  const { account, library } = useWeb3React();
  const [authStatus, setAuthStatus] = useState('idle');
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (account && library) {
      setAuthStatus('authenticating');
      
      const chronosClient = new ChronosVaultClient({
        wallet: {
          type: 'ethereum',
          provider: library.provider
        },
        environment: process.env.NEXT_PUBLIC_CHRONOS_ENVIRONMENT || 'production'
      });
      
      chronosClient.authenticate()
        .then(() => {
          setClient(chronosClient);
          setAuthStatus('authenticated');
          onAuthComplete(chronosClient);
        })
        .catch(error => {
          console.error('Authentication failed:', error);
          setAuthStatus('failed');
        });
    }
  }, [account, library, onAuthComplete]);

  return (
    <div className="auth-status">
      {authStatus === 'idle' && !account && (
        <p>Please connect your wallet to continue</p>
      )}
      {authStatus === 'authenticating' && (
        <p>Authenticating with Chronos Vault...</p>
      )}
      {authStatus === 'authenticated' && (
        <p className="success">Connected to Chronos Vault</p>
      )}
      {authStatus === 'failed' && (
        <p className="error">Failed to connect to Chronos Vault</p>
      )}
    </div>
  );
}`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Vault List Component</h3>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// components/VaultList.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VaultList({ client }) {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!client) return;
    
    setLoading(true);
    client.vaults.list()
      .then(response => {
        setVaults(response.vaults);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [client]);

  if (loading) return <div>Loading vaults...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="vault-list">
      <h2>Your Vaults</h2>
      {vaults.length === 0 ? (
        <p>You don't have any vaults yet. Create your first vault to get started.</p>
      ) : (
        <ul>
          {vaults.map(vault => (
            <li key={vault.id} className="vault-item">
              <h3>{vault.name}</h3>
              <p>{vault.type} - {vault.status}</p>
              <div className="asset-summary">
                {vault.assets.map(asset => (
                  <span key={asset.assetId} className="asset-badge">
                    {asset.amount} {asset.symbol}
                  </span>
                ))}
              </div>
              <Link href={\`/vault/\${vault.id}\`}>
                <a className="view-details">View Details</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/create-vault">
        <a className="create-button">Create New Vault</a>
      </Link>
    </div>
  );
}`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Real-Time Updates with WebSockets</h3>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// hooks/useChronosWebSocket.js
import { useState, useEffect } from 'react';

export function useChronosWebSocket(client) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!client) return;
    
    try {
      // Connect to WebSocket
      const ws = client.connectWebSocket();
      setSocket(ws);
      
      // Handle connection events
      ws.onOpen(() => {
        setConnected(true);
        setError(null);
      });
      
      ws.onClose(() => {
        setConnected(false);
      });
      
      ws.onError((err) => {
        setError(err.message);
        setConnected(false);
      });
      
      // Listen for transaction confirmations
      ws.on('TRANSACTION_CONFIRMED', (data) => {
        setEvents(prev => [...prev, { type: 'TRANSACTION_CONFIRMED', data, timestamp: new Date() }]);
      });
      
      // Listen for security alerts
      ws.on('SECURITY_ALERT', (data) => {
        setEvents(prev => [...prev, { type: 'SECURITY_ALERT', data, timestamp: new Date() }]);
      });
      
      return () => {
        if (ws) ws.close();
      };
    } catch (err) {
      setError(err.message);
    }
  }, [client]);

  return {
    socket,
    connected,
    error,
    events
  };
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="outline" asChild>
                  <a href="https://github.com/chronos-vault/web-integration-example" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Complete Example
                  </a>
                </Button>
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <Link href="/sdk-documentation">
                    <FileCode className="mr-2 h-4 w-4" />
                    SDK Documentation
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="mobile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-6 w-6 text-indigo-500" />
                  Mobile Application Integration
                </CardTitle>
                <CardDescription>
                  Integrate Chronos Vault into a React Native mobile application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                  <p className="text-lg mb-4">
                    This example demonstrates how to integrate Chronos Vault into a React Native mobile application,
                    enabling secure vault management on iOS and Android devices.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Mobile Integration Highlights</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Mobile-optimized UI for vault management</li>
                    <li>Secure authentication with mobile wallets</li>
                    <li>Biometric security integration (TouchID/FaceID)</li>
                    <li>Offline capabilities and sync</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Vault Dashboard Screen</h3>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`// screens/VaultDashboard.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ChronosVaultClient } from '@chronos-vault/sdk-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VaultDashboard = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [vaults, setVaults] = useState([]);
  const [error, setError] = useState(null);
  const { walletAddress, walletType } = route.params;
  
  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Retrieve API key from secure storage
        const apiKey = await AsyncStorage.getItem('chronos_api_key');
        
        if (!apiKey) {
          throw new Error('API key not found');
        }
        
        const client = new ChronosVaultClient({
          apiKey,
          environment: 'production'
        });
        
        const response = await client.vaults.list();
        setVaults(response.vaults);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load vaults:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    initializeClient();
  }, [walletAddress, walletType]);
  
  const renderVaultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.vaultItem}
      onPress={() => navigation.navigate('VaultDetails', { vaultId: item.id })}
    >
      <View style={styles.vaultHeader}>
        <Text style={styles.vaultName}>{item.name}</Text>
        <Text style={[
          styles.statusBadge,
          item.status === 'active' ? styles.statusActive : styles.statusPending
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      
      <Text style={styles.vaultType}>{formatVaultType(item.type)}</Text>
      
      <View style={styles.assetsContainer}>
        {item.assets.map(asset => (
          <View key={asset.assetId} style={styles.assetItem}>
            <Text style={styles.assetAmount}>{asset.amount}</Text>
            <Text style={styles.assetSymbol}>{asset.symbol}</Text>
          </View>
        ))}
      </View>
      
      {item.lockUntil && (
        <Text style={styles.lockDate}>
          Locked until: {new Date(item.lockUntil).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );
  
  const formatVaultType = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') + ' Vault';
  };
  
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading your vaults...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace('VaultDashboard', route.params)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.walletAddress}>
        Connected: {\`\${walletAddress.slice(0, 6)}...\${walletAddress.slice(-4)}\`}
      </Text>
      
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Your Secure Vaults</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateVault')}
        >
          <Text style={styles.createButtonText}>+ New Vault</Text>
        </TouchableOpacity>
      </View>
      
      {vaults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You don't have any vaults yet. Create your first vault to get started.
          </Text>
          <TouchableOpacity
            style={styles.bigCreateButton}
            onPress={() => navigation.navigate('CreateVault')}
          >
            <Text style={styles.bigCreateButtonText}>Create Your First Vault</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vaults}
          renderItem={renderVaultItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles omitted for brevity
});

export default VaultDashboard;`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <a href="https://github.com/chronos-vault/mobile-integration-example" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Mobile Example Repository
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="defi">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-indigo-500" />
                  DeFi Protocol Integration
                </CardTitle>
                <CardDescription>
                  Integrate Chronos Vault security features into a DeFi protocol
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                  <p className="text-lg mb-4">
                    This example demonstrates how to integrate Chronos Vault security features into
                    a DeFi protocol using smart contracts and the Chronos Vault API.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">DeFi Integration Benefits</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Enhanced security for protocol treasury</li>
                    <li>Quantum-resistant protection for critical operations</li>
                    <li>Time-locked governance decisions</li>
                    <li>Multi-signature requirements for high-value transactions</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Smart Contract Interface</h3>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IChronosVaultConnector {
    event VaultCreated(address indexed user, string vaultId, string vaultType);
    event AssetDeposited(address indexed user, string vaultId, address token, uint256 amount);
    event WithdrawalRequested(address indexed user, string vaultId, address token, uint256 amount);
    
    /**
     * @notice Creates a new vault for the user through the Chronos Vault API
     * @param vaultType The type of vault to create
     * @param vaultOptions Additional options in JSON format
     * @return vaultId The ID of the created vault
     */
    function createVault(string calldata vaultType, string calldata vaultOptions) external returns (string memory vaultId);
    
    /**
     * @notice Deposits assets into a Chronos Vault
     * @param vaultId The ID of the vault
     * @param token The address of the token to deposit
     * @param amount The amount to deposit
     */
    function depositToVault(string calldata vaultId, address token, uint256 amount) external;
    
    /**
     * @notice Initiates a withdrawal from a Chronos Vault
     * @param vaultId The ID of the vault
     * @param token The address of the token to withdraw
     * @param amount The amount to withdraw
     * @return requestId The ID of the withdrawal request
     */
    function requestWithdrawal(string calldata vaultId, address token, uint256 amount) external returns (string memory requestId);
    
    /**
     * @notice Gets the status of a withdrawal request
     * @param requestId The ID of the withdrawal request
     * @return status The status of the withdrawal request
     */
    function getWithdrawalStatus(string calldata requestId) external view returns (string memory status);
}`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">DeFi Protocol Integration</h3>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IChronosVaultConnector.sol";

contract DeFiProtocolWithChronosVault is Ownable {
    IChronosVaultConnector public chronosConnector;
    mapping(address => string) public userVaults;
    mapping(string => address) public vaultOwners;
    
    event UserVaultCreated(address indexed user, string vaultId);
    event AssetSecured(address indexed user, string vaultId, address token, uint256 amount);
    event SecurityWithdrawalRequested(address indexed user, string vaultId, string withdrawalId);
    
    constructor(address _chronosConnector) {
        chronosConnector = IChronosVaultConnector(_chronosConnector);
    }
    
    /**
     * @notice Creates a quantum-resistant vault for the user
     */
    function createSecurityVault() external {
        require(bytes(userVaults[msg.sender]).length == 0, "User already has a vault");
        
        string memory vaultOptions = '{"name":"DeFi Security Vault","features":{"quantumResistant":true,"crossChainVerification":true}}';
        string memory vaultId = chronosConnector.createVault("quantum-resistant", vaultOptions);
        
        userVaults[msg.sender] = vaultId;
        vaultOwners[vaultId] = msg.sender;
        
        emit UserVaultCreated(msg.sender, vaultId);
    }
    
    /**
     * @notice Secures user assets in their quantum-resistant vault
     * @param token The token address to secure
     * @param amount The amount to secure
     */
    function secureAssets(address token, uint256 amount) external {
        string memory vaultId = userVaults[msg.sender];
        require(bytes(vaultId).length > 0, "No vault found for user");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        IERC20(token).approve(address(chronosConnector), amount);
        
        chronosConnector.depositToVault(vaultId, token, amount);
        
        emit AssetSecured(msg.sender, vaultId, token, amount);
    }
    
    /**
     * @notice Requests withdrawal from the security vault
     * @param token The token address to withdraw
     * @param amount The amount to withdraw
     */
    function requestSecurityWithdrawal(address token, uint256 amount) external {
        string memory vaultId = userVaults[msg.sender];
        require(bytes(vaultId).length > 0, "No vault found for user");
        
        string memory withdrawalId = chronosConnector.requestWithdrawal(vaultId, token, amount);
        
        emit SecurityWithdrawalRequested(msg.sender, vaultId, withdrawalId);
    }
    
    /**
     * @notice Checks the status of a withdrawal request
     * @param withdrawalId The ID of the withdrawal request
     * @return The status of the withdrawal
     */
    function checkWithdrawalStatus(string calldata withdrawalId) external view returns (string memory) {
        return chronosConnector.getWithdrawalStatus(withdrawalId);
    }
    
    /**
     * @notice Updates the Chronos Vault connector address
     * @param newConnector The new connector address
     */
    function updateChronosConnector(address newConnector) external onlyOwner {
        chronosConnector = IChronosVaultConnector(newConnector);
    }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="outline" asChild className="mr-4">
                  <a href="https://github.com/chronos-vault/defi-integration-example" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Example Repository
                  </a>
                </Button>
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <Link href="/api-documentation">
                    <FileCode className="mr-2 h-4 w-4" />
                    API Documentation
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="enterprise">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-indigo-500" />
                  Enterprise System Integration
                </CardTitle>
                <CardDescription>
                  Integrate Chronos Vault into an enterprise Java backend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50 mb-6">
                  <p className="text-lg mb-4">
                    This example demonstrates how to integrate Chronos Vault's maximum security features
                    into an enterprise application using Java and Spring Boot.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Enterprise Integration Benefits</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>High-security storage for sensitive corporate assets</li>
                    <li>Multi-signature approval workflows</li>
                    <li>Audit logs and compliance reporting</li>
                    <li>Integration with existing identity management systems</li>
                  </ul>
                </div>

                <div className="bg-slate-900 text-slate-50 p-4 rounded-md mb-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// src/main/java/com/example/enterprise/service/SecurityVaultService.java
package com.example.enterprise.service;

import org.chronosvault.ChronosVaultClient;
import org.chronosvault.model.Vault;
import org.chronosvault.model.VaultCreationRequest;
import org.chronosvault.model.VaultVerification;
import org.chronosvault.model.VaultType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SecurityVaultService {

    private final ChronosVaultClient chronosVaultClient;
    
    @Autowired
    public SecurityVaultService(ChronosVaultClient chronosVaultClient) {
        this.chronosVaultClient = chronosVaultClient;
    }
    
    /**
     * Creates a new corporate security vault
     */
    public Vault createCorporateVault(String name, String description) {
        VaultCreationRequest request = new VaultCreationRequest();
        request.setName(name);
        request.setDescription(description);
        request.setType(VaultType.QUANTUM_RESISTANT);
        request.setChains(List.of("ethereum", "bitcoin"));
        
        Map<String, Object> features = Map.of(
            "quantumResistant", true,
            "crossChainVerification", true,
            "multiSignature", true
        );
        request.setFeatures(features);
        
        Map<String, Object> security = Map.of(
            "verificationLevel", "maximum",
            "requireMultiSignature", true,
            "timeDelay", 43200 // 12 hours in seconds
        );
        request.setSecurity(security);
        
        return chronosVaultClient.vaults().create(request);
    }
    
    /**
     * Lists all corporate vaults
     */
    public List<Vault> listCorporateVaults() {
        return chronosVaultClient.vaults().list().getVaults();
    }
    
    /**
     * Gets details of a specific vault
     */
    public Vault getVaultDetails(String vaultId) {
        return chronosVaultClient.vaults().get(vaultId);
    }
    
    /**
     * Performs a security verification of a vault
     */
    public VaultVerification verifyVaultSecurity(String vaultId) {
        return chronosVaultClient.security().verifyVault(vaultId);
    }
    
    /**
     * Configures quantum security settings for a vault
     */
    public void enhanceQuantumSecurity(String vaultId) {
        Map<String, Object> config = Map.of(
            "algorithms", List.of("lattice-based", "multivariate", "hash-based"),
            "keySize", "maximum",
            "adaptiveMode", true
        );
        
        chronosVaultClient.security().configureQuantumSecurity(vaultId, config);
    }
}`}</code>
                  </pre>
                </div>

                <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// src/main/java/com/example/enterprise/controller/SecurityVaultController.java
package com.example.enterprise.controller;

import com.example.enterprise.service.SecurityVaultService;
import org.chronosvault.model.Vault;
import org.chronosvault.model.VaultVerification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-vaults")
public class SecurityVaultController {

    private final SecurityVaultService securityVaultService;
    
    @Autowired
    public SecurityVaultController(SecurityVaultService securityVaultService) {
        this.securityVaultService = securityVaultService;
    }
    
    @GetMapping
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<List<Vault>> listVaults() {
        return ResponseEntity.ok(securityVaultService.listCorporateVaults());
    }
    
    @GetMapping("/{vaultId}")
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<Vault> getVault(@PathVariable String vaultId) {
        return ResponseEntity.ok(securityVaultService.getVaultDetails(vaultId));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<Vault> createVault(@RequestBody VaultCreationRequest request) {
        Vault vault = securityVaultService.createCorporateVault(
            request.getName(), 
            request.getDescription()
        );
        return ResponseEntity.ok(vault);
    }
    
    @GetMapping("/{vaultId}/verify")
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<VaultVerification> verifyVault(@PathVariable String vaultId) {
        return ResponseEntity.ok(securityVaultService.verifyVaultSecurity(vaultId));
    }
    
    @PostMapping("/{vaultId}/enhance-security")
    @PreAuthorize("hasRole('SECURITY_ADMIN')")
    public ResponseEntity<?> enhanceSecurity(@PathVariable String vaultId) {
        securityVaultService.enhanceQuantumSecurity(vaultId);
        return ResponseEntity.ok().build();
    }
    
    static class VaultCreationRequest {
        private String name;
        private String description;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}`}</code>
                  </pre>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <a href="https://github.com/chronos-vault/enterprise-integration-example" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Enterprise Example Repository
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="cross-chain">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-6 w-6 text-indigo-500" />
                  Cross-Chain Transfer Application
                </CardTitle>
                <CardDescription>
                  Build a cross-chain transfer application with Python and Chronos Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                  <p className="text-lg mb-4">
                    This example demonstrates how to build a cross-chain transfer application using 
                    Python, FastAPI, and the Chronos Vault SDK.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Key Features</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Secure cross-chain transfers between different blockchain networks</li>
                    <li>API for initiating and tracking transfers</li>
                    <li>Quantum-resistant security for in-flight assets</li>
                    <li>Verification of transfer completion</li>
                  </ul>
                </div>

                <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`# app.py
import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from typing import List, Optional
from chronos_vault_sdk import ChronosVaultClient
from chronos_vault_sdk.exceptions import ChronosVaultException

app = FastAPI(title="Cross-Chain Transfer API")

# API Key authentication
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME)

# Initialize Chronos Vault client
chronos_client = ChronosVaultClient(
    api_key=os.environ.get("CHRONOS_API_KEY"),
    environment="production"
)

# Models
class CrossChainTransferRequest(BaseModel):
    source_chain: str
    destination_chain: str
    source_asset: str
    destination_asset: str
    amount: str
    recipient_address: str

class CrossChainTransferResponse(BaseModel):
    transfer_id: str
    status: str
    source_transaction: Optional[str] = None
    destination_transaction: Optional[str] = None
    estimated_completion_time: Optional[str] = None

# Helper function to validate API key
async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key != os.environ.get("APP_API_KEY"):
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

# Routes
@app.post("/transfers", response_model=CrossChainTransferResponse)
async def create_cross_chain_transfer(
    request: CrossChainTransferRequest,
    api_key: str = Depends(get_api_key)
):
    """
    Initiate a cross-chain transfer using Chronos Vault secure bridges
    """
    try:
        # Create a cross-chain fragment vault for the transfer
        vault_response = chronos_client.vaults.create({
            "name": f"Cross-Chain Transfer {request.source_chain} to {request.destination_chain}",
            "type": "cross-chain-fragment",
            "chains": [request.source_chain, request.destination_chain],
            "features": {
                "quantumResistant": True,
                "crossChainVerification": True
            }
        })
        
        # Deposit source assets
        deposit_response = chronos_client.assets.deposit(vault_response["id"], {
            "chain": request.source_chain,
            "assetType": request.source_asset,
            "amount": request.amount
        })
        
        # Initiate cross-chain transfer
        transfer_response = chronos_client.cross_chain.transfer({
            "vaultId": vault_response["id"],
            "sourceChain": request.source_chain,
            "destinationChain": request.destination_chain,
            "sourceAsset": request.source_asset,
            "destinationAsset": request.destination_asset,
            "amount": request.amount,
            "recipientAddress": request.recipient_address
        })
        
        return CrossChainTransferResponse(
            transfer_id=transfer_response["transferId"],
            status=transfer_response["status"],
            estimated_completion_time=transfer_response.get("estimatedCompletionTime")
        )
    
    except ChronosVaultException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/transfers/{transfer_id}", response_model=CrossChainTransferResponse)
async def get_transfer_status(
    transfer_id: str,
    api_key: str = Depends(get_api_key)
):
    """
    Get the status of a cross-chain transfer
    """
    try:
        transfer = chronos_client.cross_chain.get_transfer(transfer_id)
        
        return CrossChainTransferResponse(
            transfer_id=transfer["transferId"],
            status=transfer["status"],
            source_transaction=transfer.get("sourceTransaction"),
            destination_transaction=transfer.get("destinationTransaction"),
            estimated_completion_time=transfer.get("estimatedCompletionTime")
        )
    
    except ChronosVaultException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
`}</code>
                  </pre>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <a href="https://github.com/chronos-vault/cross-chain-transfer-example" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Cross-Chain Example Repository
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="estate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="h-6 w-6 text-indigo-500" />
                  Digital Estate Planning Service
                </CardTitle>
                <CardDescription>
                  Build a digital estate planning service with Node.js and Chronos Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                  <p className="text-lg mb-4">
                    This example demonstrates how to build a digital estate planning service using 
                    Node.js, Express, and the Chronos Vault inheritance API.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Key Features</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Intent-based inheritance configuration</li>
                    <li>Secure beneficiary management</li>
                    <li>Inactivity monitoring and triggering</li>
                    <li>Identity verification for beneficiaries</li>
                  </ul>
                </div>

                <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// server.js
const express = require('express');
const { ChronosVaultClient } = require('@chronos-vault/sdk');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Chronos Vault client
const chronosClient = new ChronosVaultClient({
  apiKey: process.env.CHRONOS_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'testnet'
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation schemas
const createEstateVaultSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  beneficiaries: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      address: Joi.string().required(),
      allocation: Joi.number().integer().min(1).max(100).required()
    })
  ).min(1).required(),
  inactivityPeriod: Joi.number().integer().min(90).required(), // in days
  requireLegalDocumentation: Joi.boolean().default(true),
  identityVerificationLevel: Joi.string().valid('basic', 'standard', 'advanced').default('standard')
});

// Routes
app.post('/api/estate-vaults', authenticateToken, async (req, res) => {
  try {
    // Validate request
    const { error, value } = createEstateVaultSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Create time-lock vault for estate planning
    const vault = await chronosClient.vaults.create({
      name: value.name,
      description: value.description,
      type: 'time-lock',
      chains: ['ethereum', 'bitcoin'],
      features: {
        quantumResistant: true,
        crossChainVerification: true,
        multiSignature: true
      },
      security: {
        verificationLevel: 'advanced',
        requireMultiSignature: true,
        timeDelay: 86400 // 24 hours
      }
    });
    
    // Configure inheritance
    const beneficiaries = value.beneficiaries.map(b => ({
      address: b.address,
      email: b.email,
      allocation: b.allocation,
      unlockConditions: {
        timeBasedTrigger: {
          inactivityPeriod: value.inactivityPeriod * 24 * 60 * 60 // convert days to seconds
        }
      }
    }));
    
    const inheritance = await chronosClient.inheritance.configure(vault.id, {
      beneficiaries,
      verificationRequirements: {
        requireLegalDocumentation: value.requireLegalDocumentation,
        identityVerificationLevel: value.identityVerificationLevel
      }
    });
    
    // Save to database (omitted for brevity)
    
    res.status(201).json({
      vaultId: vault.id,
      inheritanceId: inheritance.inheritanceId,
      depositAddresses: vault.depositAddresses
    });
  } catch (error) {
    console.error('Error creating estate vault:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Internal server error'
    });
  }
});

app.get('/api/estate-vaults', authenticateToken, async (req, res) => {
  try {
    const vaults = await chronosClient.vaults.list({
      type: 'time-lock'
    });
    
    res.json(vaults);
  } catch (error) {
    console.error('Error fetching estate vaults:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Internal server error'
    });
  }
});

app.get('/api/estate-vaults/:vaultId', authenticateToken, async (req, res) => {
  try {
    const vault = await chronosClient.vaults.get(req.params.vaultId);
    
    // Get inheritance configuration
    const inheritance = await chronosClient.inheritance.getConfiguration(req.params.vaultId);
    
    res.json({
      vault,
      inheritance
    });
  } catch (error) {
    console.error('Error fetching estate vault:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Internal server error'
    });
  }
});

app.post('/api/estate-vaults/:vaultId/proof-of-life', authenticateToken, async (req, res) => {
  try {
    // Reset the inactivity counter for inheritance
    await chronosClient.inheritance.resetInactivityTimer(req.params.vaultId);
    
    res.json({
      success: true,
      message: 'Proof of life recorded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error recording proof of life:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Digital Estate Planning API running on port \${PORT}\`);
});`}</code>
                  </pre>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <a href="https://github.com/chronos-vault/digital-estate-example" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Digital Estate Example Repository
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default IntegrationExamples;