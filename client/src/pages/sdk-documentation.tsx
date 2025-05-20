import React, { useState } from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Code, 
  Download, 
  FileJson, 
  SquareCode, 
  PackageCheck, 
  Boxes,
  MessageSquareCode,
  Braces,
  ArrowRightLeft,
  Lock,
  Layers,
  Languages,
  BookOpen,
  Key,
  Wallet
} from "lucide-react";

const SDKDocumentation = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java' | 'go' | 'rust'>('javascript');

  // Installation code snippets for different languages
  const installationSnippets = {
    javascript: `# npm
npm install @chronos-vault/sdk

# yarn
yarn add @chronos-vault/sdk

# pnpm
pnpm add @chronos-vault/sdk`,
    
    python: `pip install chronos-vault-sdk`,
    
    java: `<!-- Maven -->
<dependency>
  <groupId>org.chronosvault</groupId>
  <artifactId>chronos-vault-sdk</artifactId>
  <version>1.0.0</version>
</dependency>

// Gradle
implementation 'org.chronosvault:chronos-vault-sdk:1.0.0'`,
    
    go: `go get github.com/chronosvault/sdk-go`,
    
    rust: `# Cargo.toml
[dependencies]
chronos-vault-sdk = "1.0.0"`
  };

  // Auth code snippets
  const authSnippets = {
    javascript: `import { ChronosVaultClient } from '@chronos-vault/sdk';

// API Key Authentication
const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production' // or 'testnet'
});

// Wallet-based Authentication
const walletClient = new ChronosVaultClient({
  wallet: {
    type: 'ethereum', // or 'ton', 'solana', 'bitcoin'
    provider: window.ethereum // or custom provider
  },
  environment: 'production'
});

// Authenticate
await walletClient.authenticate();`,
    
    python: `from chronos_vault_sdk import ChronosVaultClient
from chronos_vault_sdk.providers import EthereumProvider

# API Key Authentication
client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='production'  # or 'testnet'
)

# Wallet-based Authentication
ethereum_provider = EthereumProvider(private_key='your_ethereum_private_key')
wallet_client = ChronosVaultClient(
    wallet={
        'type': 'ethereum',  # or 'ton', 'solana', 'bitcoin'
        'provider': ethereum_provider
    },
    environment='production'
)

# Authenticate
wallet_client.authenticate()`,
    
    java: `import org.chronosvault.ChronosVaultClient;
import org.chronosvault.auth.ApiKeyAuth;
import org.chronosvault.auth.WalletAuth;
import org.chronosvault.providers.EthereumProvider;

// API Key Authentication
ChronosVaultClient client = ChronosVaultClient.builder()
    .withApiKey("YOUR_API_KEY")
    .withEnvironment("production") // or "testnet"
    .build();

// Wallet-based Authentication
EthereumProvider provider = new EthereumProvider(privateKey);
WalletAuth walletAuth = new WalletAuth("ethereum", provider);

ChronosVaultClient walletClient = ChronosVaultClient.builder()
    .withWallet(walletAuth)
    .withEnvironment("production")
    .build();

// Authenticate
walletClient.authenticate();`,
    
    go: `package main

import (
    "context"
    "log"
    
    "github.com/chronosvault/sdk-go"
    "github.com/chronosvault/sdk-go/auth"
)

func main() {
    ctx := context.Background()
    
    // API Key Authentication
    client, err := chronosvault.NewClient(
        chronosvault.WithAPIKey("YOUR_API_KEY"),
        chronosvault.WithEnvironment("production"),
    )
    if err != nil {
        log.Fatalf("Failed to create client: %v", err)
    }
    
    // Wallet-based Authentication
    walletClient, err := chronosvault.NewClient(
        chronosvault.WithWallet(auth.Wallet{
            Type:     "ethereum",
            Provider: ethereumProvider,
        }),
        chronosvault.WithEnvironment("production"),
    )
    if err != nil {
        log.Fatalf("Failed to create wallet client: %v", err)
    }
    
    // Authenticate
    if err := walletClient.Authenticate(ctx); err != nil {
        log.Fatalf("Authentication failed: %v", err)
    }
}`,
    
    rust: `use chronos_vault_sdk::{Client, ClientBuilder, Environment};
use chronos_vault_sdk::auth::{ApiKeyAuth, WalletAuth};
use chronos_vault_sdk::providers::EthereumProvider;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // API Key Authentication
    let client = ClientBuilder::new()
        .with_api_key("YOUR_API_KEY")
        .with_environment(Environment::Production)
        .build()?;
        
    // Wallet-based Authentication
    let provider = EthereumProvider::new(private_key);
    let wallet_auth = WalletAuth::new("ethereum", Box::new(provider));
    
    let wallet_client = ClientBuilder::new()
        .with_wallet(wallet_auth)
        .with_environment(Environment::Production)
        .build()?;
        
    // Authenticate
    wallet_client.authenticate()?;
    
    Ok(())
}`
  };

  // Vault operations snippets
  const vaultSnippets = {
    javascript: `// Create a new vault
const vault = await client.vaults.create({
  name: "My Savings Vault",
  description: "Long-term savings vault",
  type: "time-lock",
  lockUntil: new Date("2026-01-01T00:00:00Z"),
  chains: ["ethereum", "ton"],
  features: {
    quantumResistant: true,
    crossChainVerification: true,
    multiSignature: false
  },
  security: {
    verificationLevel: "advanced",
    requireMultiSignature: false,
    timeDelay: 86400
  }
});

// List all vaults
const vaults = await client.vaults.list({
  type: "time-lock",
  status: "active"
});

// Get vault details
const vaultDetails = await client.vaults.get("v_1a2b3c4d5e6f");

// Update a vault
const updatedVault = await client.vaults.update("v_1a2b3c4d5e6f", {
  name: "Updated Vault Name",
  security: {
    verificationLevel: "maximum"
  }
});

// Deposit assets
const deposit = await client.assets.deposit("v_1a2b3c4d5e6f", {
  chain: "ethereum",
  assetType: "native",
  amount: "0.5"
});

// Withdraw assets
const withdrawal = await client.assets.withdraw("v_1a2b3c4d5e6f", {
  chain: "ethereum",
  assetType: "native",
  amount: "0.5",
  destinationAddress: "0x1234567890abcdef1234567890abcdef12345678"
});`,
    
    python: `# Create a new vault
from datetime import datetime, timezone

vault = client.vaults.create({
    'name': 'My Savings Vault',
    'description': 'Long-term savings vault',
    'type': 'time-lock',
    'lockUntil': datetime(2026, 1, 1, tzinfo=timezone.utc),
    'chains': ['ethereum', 'ton'],
    'features': {
        'quantumResistant': True,
        'crossChainVerification': True,
        'multiSignature': False
    },
    'security': {
        'verificationLevel': 'advanced',
        'requireMultiSignature': False,
        'timeDelay': 86400
    }
})

# List all vaults
vaults = client.vaults.list(
    type='time-lock',
    status='active'
)

# Get vault details
vault_details = client.vaults.get('v_1a2b3c4d5e6f')

# Update a vault
updated_vault = client.vaults.update('v_1a2b3c4d5e6f', {
    'name': 'Updated Vault Name',
    'security': {
        'verificationLevel': 'maximum'
    }
})

# Deposit assets
deposit = client.assets.deposit('v_1a2b3c4d5e6f', {
    'chain': 'ethereum',
    'assetType': 'native',
    'amount': '0.5'
})

# Withdraw assets
withdrawal = client.assets.withdraw('v_1a2b3c4d5e6f', {
    'chain': 'ethereum',
    'assetType': 'native',
    'amount': '0.5',
    'destinationAddress': '0x1234567890abcdef1234567890abcdef12345678'
})`,
    
    java: `// Create a new vault
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Map;

VaultCreationRequest request = new VaultCreationRequest();
request.setName("My Savings Vault");
request.setDescription("Long-term savings vault");
request.setType("time-lock");
request.setLockUntil(ZonedDateTime.parse("2026-01-01T00:00:00Z"));
request.setChains(Arrays.asList("ethereum", "ton"));

Map<String, Object> features = Map.of(
    "quantumResistant", true,
    "crossChainVerification", true,
    "multiSignature", false
);
request.setFeatures(features);

Map<String, Object> security = Map.of(
    "verificationLevel", "advanced",
    "requireMultiSignature", false,
    "timeDelay", 86400
);
request.setSecurity(security);

Vault vault = client.vaults().create(request);

// List all vaults
VaultListRequest listRequest = new VaultListRequest();
listRequest.setType("time-lock");
listRequest.setStatus("active");
List<Vault> vaults = client.vaults().list(listRequest).getVaults();

// Get vault details
Vault vaultDetails = client.vaults().get("v_1a2b3c4d5e6f");

// Update a vault
VaultUpdateRequest updateRequest = new VaultUpdateRequest();
updateRequest.setName("Updated Vault Name");
updateRequest.setSecurity(Map.of("verificationLevel", "maximum"));
Vault updatedVault = client.vaults().update("v_1a2b3c4d5e6f", updateRequest);

// Deposit assets
DepositRequest depositRequest = new DepositRequest();
depositRequest.setChain("ethereum");
depositRequest.setAssetType("native");
depositRequest.setAmount("0.5");
Deposit deposit = client.assets().deposit("v_1a2b3c4d5e6f", depositRequest);

// Withdraw assets
WithdrawalRequest withdrawalRequest = new WithdrawalRequest();
withdrawalRequest.setChain("ethereum");
withdrawalRequest.setAssetType("native");
withdrawalRequest.setAmount("0.5");
withdrawalRequest.setDestinationAddress("0x1234567890abcdef1234567890abcdef12345678");
Withdrawal withdrawal = client.assets().withdraw("v_1a2b3c4d5e6f", withdrawalRequest);`,
    
    go: `// Create a new vault
import (
    "context"
    "time"
    
    "github.com/chronosvault/sdk-go/vault"
)

func createVault(ctx context.Context, client *chronosvault.Client) (*vault.Vault, error) {
    lockUntil, _ := time.Parse(time.RFC3339, "2026-01-01T00:00:00Z")
    
    request := &vault.CreateRequest{
        Name:        "My Savings Vault",
        Description: "Long-term savings vault",
        Type:        "time-lock",
        LockUntil:   lockUntil,
        Chains:      []string{"ethereum", "ton"},
        Features: map[string]interface{}{
            "quantumResistant":      true,
            "crossChainVerification": true,
            "multiSignature":        false,
        },
        Security: map[string]interface{}{
            "verificationLevel":    "advanced",
            "requireMultiSignature": false,
            "timeDelay":            86400,
        },
    }
    
    return client.Vaults.Create(ctx, request)
}

// List all vaults
func listVaults(ctx context.Context, client *chronosvault.Client) (*vault.ListResponse, error) {
    request := &vault.ListRequest{
        Type:   "time-lock",
        Status: "active",
    }
    
    return client.Vaults.List(ctx, request)
}

// Get vault details
func getVault(ctx context.Context, client *chronosvault.Client, vaultID string) (*vault.Vault, error) {
    return client.Vaults.Get(ctx, vaultID)
}

// Update a vault
func updateVault(ctx context.Context, client *chronosvault.Client, vaultID string) (*vault.Vault, error) {
    request := &vault.UpdateRequest{
        Name: "Updated Vault Name",
        Security: map[string]interface{}{
            "verificationLevel": "maximum",
        },
    }
    
    return client.Vaults.Update(ctx, vaultID, request)
}

// Deposit assets
func depositAssets(ctx context.Context, client *chronosvault.Client, vaultID string) (*asset.Deposit, error) {
    request := &asset.DepositRequest{
        Chain:     "ethereum",
        AssetType: "native",
        Amount:    "0.5",
    }
    
    return client.Assets.Deposit(ctx, vaultID, request)
}

// Withdraw assets
func withdrawAssets(ctx context.Context, client *chronosvault.Client, vaultID string) (*asset.Withdrawal, error) {
    request := &asset.WithdrawalRequest{
        Chain:              "ethereum",
        AssetType:          "native",
        Amount:             "0.5",
        DestinationAddress: "0x1234567890abcdef1234567890abcdef12345678",
    }
    
    return client.Assets.Withdraw(ctx, vaultID, request)
}`,
    
    rust: `// Create a new vault
use chrono::{DateTime, Utc};
use std::collections::HashMap;

async fn create_vault(client: &Client) -> Result<Vault, Box<dyn std::error::Error>> {
    let lock_until = "2026-01-01T00:00:00Z".parse::<DateTime<Utc>>()?;
    
    let mut features = HashMap::new();
    features.insert("quantumResistant".to_string(), true.into());
    features.insert("crossChainVerification".to_string(), true.into());
    features.insert("multiSignature".to_string(), false.into());
    
    let mut security = HashMap::new();
    security.insert("verificationLevel".to_string(), "advanced".into());
    security.insert("requireMultiSignature".to_string(), false.into());
    security.insert("timeDelay".to_string(), 86400.into());
    
    let request = CreateVaultRequest {
        name: "My Savings Vault".to_string(),
        description: Some("Long-term savings vault".to_string()),
        vault_type: "time-lock".to_string(),
        lock_until: Some(lock_until),
        chains: vec!["ethereum".to_string(), "ton".to_string()],
        features,
        security,
    };
    
    Ok(client.vaults().create(request).await?)
}

// List all vaults
async fn list_vaults(client: &Client) -> Result<Vec<Vault>, Box<dyn std::error::Error>> {
    let request = ListVaultsRequest {
        vault_type: Some("time-lock".to_string()),
        status: Some("active".to_string()),
        ..Default::default()
    };
    
    let response = client.vaults().list(request).await?;
    Ok(response.vaults)
}

// Get vault details
async fn get_vault(client: &Client, vault_id: &str) -> Result<Vault, Box<dyn std::error::Error>> {
    Ok(client.vaults().get(vault_id).await?)
}

// Update a vault
async fn update_vault(client: &Client, vault_id: &str) -> Result<Vault, Box<dyn std::error::Error>> {
    let mut security = HashMap::new();
    security.insert("verificationLevel".to_string(), "maximum".into());
    
    let request = UpdateVaultRequest {
        name: Some("Updated Vault Name".to_string()),
        security: Some(security),
        ..Default::default()
    };
    
    Ok(client.vaults().update(vault_id, request).await?)
}

// Deposit assets
async fn deposit_assets(client: &Client, vault_id: &str) -> Result<Deposit, Box<dyn std::error::Error>> {
    let request = DepositRequest {
        chain: "ethereum".to_string(),
        asset_type: "native".to_string(),
        amount: "0.5".to_string(),
    };
    
    Ok(client.assets().deposit(vault_id, request).await?)
}

// Withdraw assets
async fn withdraw_assets(client: &Client, vault_id: &str) -> Result<Withdrawal, Box<dyn std::error::Error>> {
    let request = WithdrawalRequest {
        chain: "ethereum".to_string(),
        asset_type: "native".to_string(),
        amount: "0.5".to_string(),
        destination_address: "0x1234567890abcdef1234567890abcdef12345678".to_string(),
    };
    
    Ok(client.assets().withdraw(vault_id, request).await?)
}`
  };

  // WebSocket snippets
  const websocketSnippets = {
    javascript: `// Connect to WebSocket
const socket = client.connectWebSocket();

// Listen for transaction confirmations
socket.on('TRANSACTION_CONFIRMED', (data) => {
  console.log(\`Transaction \${data.transactionId} confirmed\`);
  console.log(\`Block number: \${data.blockNumber}\`);
});

// Listen for security alerts
socket.on('SECURITY_ALERT', (data) => {
  console.log(\`Security alert: \${data.type}\`);
  console.log(\`Severity: \${data.severity}\`);
  console.log(\`Description: \${data.description}\`);
});

// Listen for vault status changes
socket.on('VAULT_STATUS_CHANGED', (data) => {
  console.log(\`Vault \${data.vaultId} status changed from \${data.previousStatus} to \${data.newStatus}\`);
});

// Close connection when done
socket.close();`,
    
    python: `# Define event handlers
def on_transaction_confirmed(data):
    print(f"Transaction {data['transactionId']} confirmed")
    print(f"Block number: {data['blockNumber']}")

def on_security_alert(data):
    print(f"Security alert: {data['type']}")
    print(f"Severity: {data['severity']}")
    print(f"Description: {data['description']}")

def on_vault_status_changed(data):
    print(f"Vault {data['vaultId']} status changed from {data['previousStatus']} to {data['newStatus']}")

# Connect to WebSocket
socket = client.connect_websocket()

# Register event handlers
socket.on('TRANSACTION_CONFIRMED', on_transaction_confirmed)
socket.on('SECURITY_ALERT', on_security_alert)
socket.on('VAULT_STATUS_CHANGED', on_vault_status_changed)

# Keep connection open (in a real application)
# import time
# time.sleep(60)  # Keep connection open for 1 minute

# Close connection when done
socket.close()`,
    
    java: `// Connect to WebSocket
import org.chronosvault.websocket.WebSocketListener;
import org.chronosvault.websocket.event.TransactionConfirmedEvent;
import org.chronosvault.websocket.event.SecurityAlertEvent;
import org.chronosvault.websocket.event.VaultStatusChangedEvent;

WebSocketClient webSocket = client.connectWebSocket();

// Add event listeners
webSocket.addListener(new WebSocketListener<TransactionConfirmedEvent>(TransactionConfirmedEvent.class) {
    @Override
    public void onEvent(TransactionConfirmedEvent event) {
        System.out.println("Transaction " + event.getTransactionId() + " confirmed");
        System.out.println("Block number: " + event.getBlockNumber());
    }
});

webSocket.addListener(new WebSocketListener<SecurityAlertEvent>(SecurityAlertEvent.class) {
    @Override
    public void onEvent(SecurityAlertEvent event) {
        System.out.println("Security alert: " + event.getType());
        System.out.println("Severity: " + event.getSeverity());
        System.out.println("Description: " + event.getDescription());
    }
});

webSocket.addListener(new WebSocketListener<VaultStatusChangedEvent>(VaultStatusChangedEvent.class) {
    @Override
    public void onEvent(VaultStatusChangedEvent event) {
        System.out.println("Vault " + event.getVaultId() + " status changed from " 
            + event.getPreviousStatus() + " to " + event.getNewStatus());
    }
});

// Close connection when done
webSocket.close();`,
    
    go: `// Connect to WebSocket
import (
    "context"
    "fmt"
    "log"
    
    "github.com/chronosvault/sdk-go/websocket"
)

func connectWebSocket(ctx context.Context, client *chronosvault.Client) error {
    ws, err := client.ConnectWebSocket(ctx)
    if err != nil {
        return err
    }
    
    // Set up event handlers
    ws.On(websocket.EventTransactionConfirmed, func(data map[string]interface{}) {
        txID := data["transactionId"].(string)
        blockNumber := data["blockNumber"].(float64)
        fmt.Printf("Transaction %s confirmed\n", txID)
        fmt.Printf("Block number: %d\n", int(blockNumber))
    })
    
    ws.On(websocket.EventSecurityAlert, func(data map[string]interface{}) {
        alertType := data["type"].(string)
        severity := data["severity"].(string)
        description := data["description"].(string)
        fmt.Printf("Security alert: %s\n", alertType)
        fmt.Printf("Severity: %s\n", severity)
        fmt.Printf("Description: %s\n", description)
    })
    
    ws.On(websocket.EventVaultStatusChanged, func(data map[string]interface{}) {
        vaultID := data["vaultId"].(string)
        prevStatus := data["previousStatus"].(string)
        newStatus := data["newStatus"].(string)
        fmt.Printf("Vault %s status changed from %s to %s\n", vaultID, prevStatus, newStatus)
    })
    
    // Keep connection open
    // select {} // In a real application
    
    // Close connection when done
    return ws.Close()
}`,
    
    rust: `// Connect to WebSocket
use chronos_vault_sdk::websocket::{WebSocketClient, Event};
use futures::StreamExt;

async fn connect_websocket(client: &Client) -> Result<(), Box<dyn std::error::Error>> {
    let mut ws = client.connect_websocket().await?;
    
    // Process events
    while let Some(event) = ws.next().await {
        match event? {
            Event::TransactionConfirmed(data) => {
                println!("Transaction {} confirmed", data.transaction_id);
                println!("Block number: {}", data.block_number);
            },
            Event::SecurityAlert(data) => {
                println!("Security alert: {}", data.alert_type);
                println!("Severity: {}", data.severity);
                println!("Description: {}", data.description);
            },
            Event::VaultStatusChanged(data) => {
                println!("Vault {} status changed from {} to {}", 
                    data.vault_id, data.previous_status, data.new_status);
            },
            _ => println!("Received other event type"),
        }
    }
    
    Ok(())
}`
  };

  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
              SDK Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Client libraries for multiple programming languages to interact with the Chronos Vault API
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
              <Link href="/api-documentation">View API Documentation</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="usage">Usage Examples</TabsTrigger>
            <TabsTrigger value="websocket">WebSocket API</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageCheck className="h-6 w-6 text-indigo-500" />
                  SDK Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive client libraries for the Chronos Vault platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                  <p className="text-lg mb-4">
                    The Chronos Vault SDK provides a robust, type-safe interface to interact with the Chronos Vault API. 
                    Our client libraries are available in multiple programming languages, enabling seamless integration 
                    with your existing applications and workflows.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Key Features</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Type-safe API with comprehensive language-specific types</li>
                    <li>Simplified authentication with both API key and wallet-based options</li>
                    <li>Automatic retries with exponential backoff for transient errors</li>
                    <li>WebSocket support for real-time updates</li>
                    <li>Comprehensive error handling with detailed error messages</li>
                    <li>Cross-chain functionality with unified interface</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Supported Languages</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <img src="/icons/javascript.svg" alt="JavaScript" className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">JavaScript</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <img src="/icons/python.svg" alt="Python" className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Python</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <img src="/icons/java.svg" alt="Java" className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Java</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <img src="/icons/go.svg" alt="Go" className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Go</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <img src="/icons/rust.svg" alt="Rust" className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Rust</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/30 border-indigo-100 dark:border-indigo-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-500" />
                        Modular Architecture
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Carefully designed with a modular structure that separates concerns and enables targeted usage.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/30 border-indigo-100 dark:border-indigo-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="h-5 w-5 text-indigo-500" />
                        Security-First Design
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Built with security best practices, including secure key handling and quantum-resistant options.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/30 border-indigo-100 dark:border-indigo-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5 text-indigo-500" />
                        Cross-Platform Compatibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Consistent API design across all language implementations for seamless multi-platform development.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="outline" asChild className="mr-4">
                  <Link href="/api-documentation">View API Reference</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <Link href="https://github.com/chronos-vault/sdk-examples" target="_blank" rel="noopener noreferrer">
                    <FileJson className="mr-2 h-4 w-4" />
                    Example Repository
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="installation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-6 w-6 text-indigo-500" />
                  Installation
                </CardTitle>
                <CardDescription>
                  Quick installation instructions for all supported languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-2 mb-6">
                  <Button
                    variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('javascript')}
                    size="sm"
                  >
                    JavaScript
                  </Button>
                  <Button
                    variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('python')}
                    size="sm"
                  >
                    Python
                  </Button>
                  <Button
                    variant={selectedLanguage === 'java' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('java')}
                    size="sm"
                  >
                    Java
                  </Button>
                  <Button
                    variant={selectedLanguage === 'go' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('go')}
                    size="sm"
                  >
                    Go
                  </Button>
                  <Button
                    variant={selectedLanguage === 'rust' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('rust')}
                    size="sm"
                  >
                    Rust
                  </Button>
                </div>
                
                <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      {installationSnippets[selectedLanguage]}
                    </code>
                  </pre>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">JavaScript / TypeScript</h4>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>Node.js 14.x or higher</li>
                        <li>npm 6.x or higher</li>
                        <li>TypeScript 4.x+ (for TypeScript projects)</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">Python</h4>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>Python 3.7 or higher</li>
                        <li>pip 20.0 or higher</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">Java</h4>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>Java 11 or higher</li>
                        <li>Maven 3.6+ or Gradle 6.0+</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">Go</h4>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>Go 1.16 or higher</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-indigo-500" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  Securely connect to the Chronos Vault API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-2 mb-6">
                  <Button
                    variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('javascript')}
                    size="sm"
                  >
                    JavaScript
                  </Button>
                  <Button
                    variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('python')}
                    size="sm"
                  >
                    Python
                  </Button>
                  <Button
                    variant={selectedLanguage === 'java' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('java')}
                    size="sm"
                  >
                    Java
                  </Button>
                  <Button
                    variant={selectedLanguage === 'go' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('go')}
                    size="sm"
                  >
                    Go
                  </Button>
                  <Button
                    variant={selectedLanguage === 'rust' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('rust')}
                    size="sm"
                  >
                    Rust
                  </Button>
                </div>

                <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      {authSnippets[selectedLanguage]}
                    </code>
                  </pre>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-4">Authentication Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Key size={16} className="text-indigo-500" />
                        API Key Authentication
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        The simplest way to authenticate with the API. Ideal for server-side applications
                        and backend services.
                      </p>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>Easy to implement and use</li>
                        <li>Perfect for automated scripts and services</li>
                        <li>Supports rate limits for high-volume operations</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Wallet size={16} className="text-indigo-500" />
                        Wallet-Based Authentication
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Connect directly with blockchain wallets. Ideal for client-side applications
                        and dApps.
                      </p>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>No need to store API keys</li>
                        <li>Direct integration with user wallets</li>
                        <li>Supports multiple blockchain networks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-indigo-500" />
                  Usage Examples
                </CardTitle>
                <CardDescription>
                  Code samples for common operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-2 mb-6">
                  <Button
                    variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('javascript')}
                    size="sm"
                  >
                    JavaScript
                  </Button>
                  <Button
                    variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('python')}
                    size="sm"
                  >
                    Python
                  </Button>
                  <Button
                    variant={selectedLanguage === 'java' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('java')}
                    size="sm"
                  >
                    Java
                  </Button>
                  <Button
                    variant={selectedLanguage === 'go' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('go')}
                    size="sm"
                  >
                    Go
                  </Button>
                  <Button
                    variant={selectedLanguage === 'rust' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('rust')}
                    size="sm"
                  >
                    Rust
                  </Button>
                </div>

                <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      {vaultSnippets[selectedLanguage]}
                    </code>
                  </pre>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-4">Advanced Use Cases</h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="error-handling">
                      <AccordionTrigger>Error Handling</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <p className="mb-4">
                            The SDK provides structured error handling with specific error types for different
                            error scenarios.
                          </p>
                          <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                            <pre className="text-sm overflow-x-auto">
                              <code>
                                {selectedLanguage === 'javascript' && `try {
  const vault = await client.vaults.get("non_existent_vault_id");
} catch (error) {
  if (error.code === 'RESOURCE_NOT_FOUND') {
    console.error('Vault not found');
  } else if (error.code === 'AUTHENTICATION_REQUIRED') {
    console.error('Authentication required');
  } else {
    console.error(\`Error: \${error.message}\`);
  }
  console.log(\`Request ID: \${error.requestId}\`);
}`}
                                {selectedLanguage === 'python' && `try:
    vault = client.vaults.get('non_existent_vault_id')
except ChronosVaultException as error:
    if error.code == 'RESOURCE_NOT_FOUND':
        print('Vault not found')
    elif error.code == 'AUTHENTICATION_REQUIRED':
        print('Authentication required')
    else:
        print(f'Error: {error.message}')
    print(f'Request ID: {error.request_id}')`}
                                {selectedLanguage === 'java' && `try {
    Vault vault = client.vaults().get("non_existent_vault_id");
} catch (ResourceNotFoundException e) {
    System.out.println("Vault not found");
} catch (AuthenticationRequiredException e) {
    System.out.println("Authentication required");
} catch (ChronosVaultException e) {
    System.out.println("Error: " + e.getMessage());
    System.out.println("Request ID: " + e.getRequestId());
}`}
                                {selectedLanguage === 'go' && `vault, err := client.Vaults.Get(ctx, "non_existent_vault_id")
if err != nil {
    var resourceNotFoundErr *chronosvault.ResourceNotFoundError
    var authRequiredErr *chronosvault.AuthenticationRequiredError
    
    switch {
    case errors.As(err, &resourceNotFoundErr):
        fmt.Println("Vault not found")
    case errors.As(err, &authRequiredErr):
        fmt.Println("Authentication required")
    default:
        var apiErr *chronosvault.APIError
        if errors.As(err, &apiErr) {
            fmt.Printf("Error: %s\n", apiErr.Message)
            fmt.Printf("Request ID: %s\n", apiErr.RequestID)
        } else {
            fmt.Printf("Unknown error: %v\n", err)
        }
    }
}`}
                                {selectedLanguage === 'rust' && `match client.vaults().get("non_existent_vault_id").await {
    Ok(vault) => { /* Process vault */ },
    Err(err) => {
        match &err {
            Error::ResourceNotFound(_) => {
                println!("Vault not found");
            },
            Error::AuthenticationRequired(_) => {
                println!("Authentication required");
            },
            Error::Api(api_err) => {
                println!("Error: {}", api_err.message);
                println!("Request ID: {}", api_err.request_id);
            },
            _ => println!("Unknown error: {}", err),
        }
    }
}`}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="pagination">
                      <AccordionTrigger>Pagination</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <p className="mb-4">
                            Working with paginated results is simplified with the SDK's pagination helpers.
                          </p>
                          <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                            <pre className="text-sm overflow-x-auto">
                              <code>
                                {selectedLanguage === 'javascript' && `// Get all vaults across multiple pages
async function getAllVaults() {
  let allVaults = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await client.vaults.list({ page, limit: 100 });
    allVaults = [...allVaults, ...response.vaults];
    hasMore = response.pagination.hasMore;
    page++;
  }
  
  return allVaults;
}`}
                                {selectedLanguage === 'python' && `# Get all vaults across multiple pages
def get_all_vaults():
    all_vaults = []
    page = 1
    has_more = True
    
    while has_more:
        response = client.vaults.list(page=page, limit=100)
        all_vaults.extend(response.vaults)
        has_more = response.pagination.has_more
        page += 1
    
    return all_vaults`}
                                {selectedLanguage === 'java' && `// Get all vaults across multiple pages
public List<Vault> getAllVaults() {
    List<Vault> allVaults = new ArrayList<>();
    int page = 1;
    boolean hasMore = true;
    
    while (hasMore) {
        VaultListRequest request = new VaultListRequest();
        request.setPage(page);
        request.setLimit(100);
        
        VaultListResponse response = client.vaults().list(request);
        allVaults.addAll(response.getVaults());
        
        hasMore = response.getPagination().getHasMore();
        page++;
    }
    
    return allVaults;
}`}
                                {selectedLanguage === 'go' && `// Get all vaults across multiple pages
func getAllVaults(ctx context.Context, client *chronosvault.Client) ([]vault.Vault, error) {
    var allVaults []vault.Vault
    page := 1
    hasMore := true
    
    for hasMore {
        request := &vault.ListRequest{
            Page:  page,
            Limit: 100,
        }
        
        response, err := client.Vaults.List(ctx, request)
        if err != nil {
            return nil, err
        }
        
        allVaults = append(allVaults, response.Vaults...)
        hasMore = response.Pagination.HasMore
        page++
    }
    
    return allVaults, nil
}`}
                                {selectedLanguage === 'rust' && `// Get all vaults across multiple pages
async fn get_all_vaults(client: &Client) -> Result<Vec<Vault>, Box<dyn std::error::Error>> {
    let mut all_vaults = Vec::new();
    let mut page = 1;
    let mut has_more = true;
    
    while has_more {
        let request = ListVaultsRequest {
            page: Some(page),
            limit: Some(100),
            ..Default::default()
        };
        
        let response = client.vaults().list(request).await?;
        all_vaults.extend(response.vaults);
        
        has_more = response.pagination.has_more;
        page += 1;
    }
    
    Ok(all_vaults)
}`}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="inheritance">
                      <AccordionTrigger>Intent-Based Inheritance</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <p className="mb-4">
                            The SDK simplifies configuring intent-based inheritance for secure asset transfers.
                          </p>
                          <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                            <pre className="text-sm overflow-x-auto">
                              <code>
                                {selectedLanguage === 'javascript' && `// Configure inheritance for a vault
const inheritance = await client.inheritance.configure('v_1a2b3c4d5e6f', {
  beneficiaries: [
    {
      address: '0x9876543210abcdef9876543210abcdef98765432',
      email: 'beneficiary@example.com',
      allocation: 100,
      unlockConditions: {
        timeBasedTrigger: {
          inactivityPeriod: 31536000 // 1 year in seconds
        }
      }
    }
  ],
  verificationRequirements: {
    requireLegalDocumentation: true,
    identityVerificationLevel: 'advanced'
  }
});

console.log(inheritance.inheritanceId); // "i_7h8j9k0l1m2n"
console.log(inheritance.status); // "configured"

// Provide proof of life
const proofOfLife = await client.inheritance.provideProofOfLife('v_1a2b3c4d5e6f', {
  verificationMethod: 'signature'
});

console.log(proofOfLife.proofOfLifeRecorded); // true
console.log(proofOfLife.nextRequiredProofDate); // "2025-08-20T14:30:00Z"`}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="websocket">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-6 w-6 text-indigo-500" />
                  WebSocket API
                </CardTitle>
                <CardDescription>
                  Real-time updates and events integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-2 mb-6">
                  <Button
                    variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('javascript')}
                    size="sm"
                  >
                    JavaScript
                  </Button>
                  <Button
                    variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('python')}
                    size="sm"
                  >
                    Python
                  </Button>
                  <Button
                    variant={selectedLanguage === 'java' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('java')}
                    size="sm"
                  >
                    Java
                  </Button>
                  <Button
                    variant={selectedLanguage === 'go' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('go')}
                    size="sm"
                  >
                    Go
                  </Button>
                  <Button
                    variant={selectedLanguage === 'rust' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('rust')}
                    size="sm"
                  >
                    Rust
                  </Button>
                </div>

                <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      {websocketSnippets[selectedLanguage]}
                    </code>
                  </pre>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-4">WebSocket Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">TRANSACTION_CONFIRMED</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Sent when a blockchain transaction is confirmed.
                      </p>
                      <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-xs mb-2">
                        {`{
  "type": "TRANSACTION_CONFIRMED",
  "data": {
    "transactionId": "tx_7h8j9k0l1m2n",
    "vaultId": "v_1a2b3c4d5e6f",
    "chainId": "ethereum",
    "status": "confirmed",
    "blockNumber": 12345678,
    "timestamp": "2025-05-20T13:00:00Z"
  }
}`}
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">SECURITY_ALERT</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Sent when a security issue is detected.
                      </p>
                      <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-xs mb-2">
                        {`{
  "type": "SECURITY_ALERT",
  "data": {
    "alertId": "alert_7h8j9k0l1m2n",
    "vaultId": "v_1a2b3c4d5e6f",
    "severity": "high",
    "type": "UNUSUAL_ACTIVITY",
    "description": "Multiple failed authentication attempts",
    "timestamp": "2025-05-20T13:00:00Z",
    "recommendations": [
      "Review recent activity",
      "Consider enabling multi-signature"
    ]
  }
}`}
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">VAULT_STATUS_CHANGED</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Sent when a vault's status changes.
                      </p>
                      <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-xs mb-2">
                        {`{
  "type": "VAULT_STATUS_CHANGED",
  "data": {
    "vaultId": "v_1a2b3c4d5e6f",
    "previousStatus": "pending",
    "newStatus": "active",
    "timestamp": "2025-05-20T13:00:00Z"
  }
}`}
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card shadow p-4">
                      <h4 className="font-medium mb-2">INHERITANCE_TRIGGERED</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Sent when an inheritance process is triggered.
                      </p>
                      <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-xs mb-2">
                        {`{
  "type": "INHERITANCE_TRIGGERED",
  "data": {
    "vaultId": "v_1a2b3c4d5e6f",
    "inheritanceId": "i_7h8j9k0l1m2n",
    "triggerReason": "inactivity_threshold_exceeded",
    "timestamp": "2025-05-20T13:00:00Z",
    "nextSteps": {
      "verificationRequired": true,
      "waitingPeriod": 604800
    }
  }
}`}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <Link href="/api-documentation#websocket">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View WebSocket API Reference
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default SDKDocumentation;