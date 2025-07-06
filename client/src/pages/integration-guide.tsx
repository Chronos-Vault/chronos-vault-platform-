import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronRight, Code, AlertCircle, CheckCircle2, Info } from "lucide-react";
import DocumentationLayout from "@/components/layout/DocumentationLayout";

const IntegrationGuide = () => {
  return (
    <DocumentationLayout title="Integration Guide" subtitle="Step-by-step instructions for integrating with Chronos Vault">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">On this page</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#overview" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#getting-started" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Getting Started
                    </a>
                  </li>
                  <li>
                    <a href="#authentication" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Authentication
                    </a>
                  </li>
                  <li>
                    <a href="#vault-integration" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Vault Integration
                    </a>
                  </li>
                  <li>
                    <a href="#webhook-setup" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Webhook Setup
                    </a>
                  </li>
                  <li>
                    <a href="#testing" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Testing
                    </a>
                  </li>
                  <li>
                    <a href="#going-live" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Going Live
                    </a>
                  </li>
                  <li>
                    <a href="#common-patterns" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Common Patterns
                    </a>
                  </li>
                  <li>
                    <a href="#troubleshooting" className="flex items-center text-gray-400 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Troubleshooting
                    </a>
                  </li>
                </ul>
              </div>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Need help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Our developer support team is available to help with your integration.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-10">
            <section id="overview" className="space-y-4">
              <h2 className="text-2xl font-bold">Overview</h2>
              <p className="text-gray-300">
                This integration guide will walk you through the process of integrating Chronos Vault's 
                multi-chain vault technology into your application. By the end of this guide, you'll be 
                able to create, manage, and interact with secure digital vaults across Ethereum, TON, 
                and Solana blockchains.
              </p>
              
              <Alert variant="default" className="border-indigo-500 bg-indigo-500/10">
                <Info className="h-4 w-4 text-indigo-500" />
                <AlertTitle>Integration Prerequisites</AlertTitle>
                <AlertDescription>
                  Before you begin, make sure you have an API key and access to the developer portal.
                  If you don't have these yet, contact our team to get started.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <Card className="bg-black/20 border border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">1. Register API Keys</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      Set up your developer account and generate API credentials.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">2. Install SDK</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      Choose your preferred language SDK and install it in your project.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">3. Implement Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      Add vault creation, management, and security features to your app.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="getting-started" className="space-y-6">
              <h2 className="text-2xl font-bold">Getting Started</h2>
              
              <Tabs defaultValue="javascript">
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="java">Java</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript" className="space-y-4 pt-4">
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`// Install the SDK
npm install @chronos-vault/sdk

// Import and initialize
import { ChronosVaultClient } from '@chronos-vault/sdk';

const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'testnet' // or 'mainnet' for production
});`}</code>
                    </pre>
                  </div>
                  
                  <p className="text-gray-300">
                    The JavaScript SDK supports both browser and Node.js environments. For browser usage,
                    you can also connect directly to user wallets for authentication.
                  </p>
                </TabsContent>
                
                <TabsContent value="python" className="space-y-4 pt-4">
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`# Install the SDK
pip install chronos-vault-sdk

# Import and initialize
from chronos_vault_sdk import ChronosVaultClient

client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='testnet'  # or 'mainnet' for production
)`}</code>
                    </pre>
                  </div>
                  
                  <p className="text-gray-300">
                    The Python SDK works well for server-side implementations and backend services.
                  </p>
                </TabsContent>
                
                <TabsContent value="java" className="space-y-4 pt-4">
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`// Add the SDK to your Maven pom.xml
<dependency>
  <groupId>org.chronosvault</groupId>
  <artifactId>chronos-vault-sdk</artifactId>
  <version>1.0.0</version>
</dependency>

// Import and initialize
import org.chronosvault.ChronosVaultClient;

ChronosVaultClient client = ChronosVaultClient.builder()
    .withApiKey("YOUR_API_KEY")
    .withEnvironment("testnet") // or "mainnet" for production
    .build();`}</code>
                    </pre>
                  </div>
                  
                  <p className="text-gray-300">
                    The Java SDK is ideal for enterprise applications and services that require strong typing.
                  </p>
                </TabsContent>
                
                <TabsContent value="other" className="space-y-4 pt-4">
                  <p className="text-gray-300">
                    We also provide SDKs for Go and Rust. See the SDK documentation for installation and usage 
                    instructions for these languages.
                  </p>
                  
                  <p className="text-gray-300">
                    Alternatively, you can directly use our REST API with any HTTP client in your preferred language.
                  </p>
                  
                  <Button asChild variant="outline">
                    <Link href="/api-documentation">View REST API Documentation</Link>
                  </Button>
                </TabsContent>
              </Tabs>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="authentication" className="space-y-6">
              <h2 className="text-2xl font-bold">Authentication</h2>
              
              <p className="text-gray-300">
                Chronos Vault supports two authentication methods: API key authentication for server-side
                applications and wallet-based authentication for client-side applications.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="api-key">
                  <AccordionTrigger>API Key Authentication</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      API key authentication is used for server-side applications where you need to make
                      API calls on behalf of your service.
                    </p>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// JavaScript example
const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'testnet'
});

// The client is now authenticated and ready to use
const vaults = await client.vaults.list();`}</code>
                      </pre>
                    </div>
                    
                    <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important Security Note</AlertTitle>
                      <AlertDescription>
                        Never include your API key directly in client-side code. API keys should be stored
                        securely on your server and used only in server-to-server communications.
                      </AlertDescription>
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="wallet">
                  <AccordionTrigger>Wallet-Based Authentication</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      Wallet-based authentication allows users to connect with their own blockchain wallets,
                      granting them direct control over their vaults.
                    </p>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// JavaScript example with MetaMask
const client = new ChronosVaultClient({
  wallet: {
    type: 'ethereum',
    provider: window.ethereum // browser wallet provider (e.g. MetaMask)
  },
  environment: 'testnet'
});

// Authenticate the user with their wallet
await client.authenticate();

// The client is now authenticated with the user's wallet
const vaults = await client.vaults.list();`}</code>
                      </pre>
                    </div>
                    
                    <p className="text-gray-300">
                      We support wallet authentication for Ethereum (MetaMask, WalletConnect), TON (Tonkeeper),
                      and Solana (Phantom, Solflare) wallets.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="vault-integration" className="space-y-6">
              <h2 className="text-2xl font-bold">Vault Integration</h2>
              
              <p className="text-gray-300">
                Once authenticated, you can create and manage vaults across multiple blockchains.
                Here are the core operations you'll need to implement.
              </p>
              
              <h3 className="text-xl font-semibold pt-4">Creating a Vault</h3>
              <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// JavaScript example
const vault = await client.vaults.create({
  name: "Long Term Savings",
  description: "My primary savings vault",
  type: "time-lock",
  lockUntil: new Date("2026-01-01T00:00:00Z"),
  chains: ["ethereum", "ton"], // Multi-chain security
  features: {
    quantumResistant: true,
    crossChainVerification: true,
    multiSignature: false
  },
  security: {
    verificationLevel: "advanced",
    requireMultiSignature: false,
    timeDelay: 86400 // 24 hours in seconds
  }
});

console.log(\`Vault created with ID: \${vault.id}\`);`}</code>
                </pre>
              </div>
              
              <h3 className="text-xl font-semibold pt-4">Retrieving Vaults</h3>
              <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// List all vaults
const vaults = await client.vaults.list({
  type: "time-lock", // optional filter
  status: "active" // optional filter
});

// Get a specific vault
const vaultDetails = await client.vaults.get("v_1a2b3c4d5e6f");`}</code>
                </pre>
              </div>
              
              <h3 className="text-xl font-semibold pt-4">Depositing Assets</h3>
              <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// Deposit assets to a vault
const deposit = await client.assets.deposit("v_1a2b3c4d5e6f", {
  chain: "ethereum",
  assetType: "native", // or "token" for ERC-20/SPL tokens
  amount: "0.5"
});

// For tokens, include token address
const tokenDeposit = await client.assets.deposit("v_1a2b3c4d5e6f", {
  chain: "ethereum",
  assetType: "token",
  tokenAddress: "0x1234...5678", // Token contract address
  amount: "100"
});`}</code>
                </pre>
              </div>
              
              <h3 className="text-xl font-semibold pt-4">Withdrawing Assets</h3>
              <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// Withdraw assets from a vault
const withdrawal = await client.assets.withdraw("v_1a2b3c4d5e6f", {
  chain: "ethereum",
  assetType: "native",
  amount: "0.5",
  destinationAddress: "0x1234567890abcdef1234567890abcdef12345678"
});`}</code>
                </pre>
              </div>
              
              <Alert className="border-green-500/50 bg-green-500/10 mt-6">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Triple-Chain Security</AlertTitle>
                <AlertDescription>
                  When using multi-chain vaults, deposits and withdrawals are secured by our 
                  Triple-Chain Security system. Cross-chain verification ensures transactions 
                  are verified across multiple blockchains before being processed.
                </AlertDescription>
              </Alert>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="webhook-setup" className="space-y-6">
              <h2 className="text-2xl font-bold">Webhook Setup</h2>
              
              <p className="text-gray-300">
                Webhooks allow your application to receive real-time notifications about vault events.
                This is especially useful for events like vault activation, deposits, withdrawals, and security alerts.
              </p>
              
              <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// Register a webhook
const webhook = await client.webhooks.create({
  url: "https://your-app.com/webhook-endpoint",
  events: [
    "vault.created",
    "deposit.confirmed",
    "withdrawal.requested",
    "security.alert"
  ],
  secret: "your-webhook-signing-secret" // Used to verify webhook payloads
});

console.log(\`Webhook registered with ID: \${webhook.id}\`);`}</code>
                </pre>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mt-4">
                <h3 className="text-lg font-semibold mb-2">Webhook Event Structure</h3>
                <p className="text-gray-400 mb-4">
                  All webhook events follow a standard structure with the following fields:
                </p>
                <div className="bg-black/40 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`{
  "id": "evt_12345",
  "type": "vault.created",
  "created": "2025-05-20T10:00:00Z",
  "data": {
    // Event-specific data
    "vault_id": "v_1a2b3c4d5e6f",
    // Additional fields depending on event type
  }
}`}</code>
                  </pre>
                </div>
              </div>
              
              <Alert className="border-indigo-500 bg-indigo-500/10 mt-4">
                <Info className="h-4 w-4 text-indigo-500" />
                <AlertTitle>Webhook Security</AlertTitle>
                <AlertDescription>
                  Always verify webhook signatures to ensure the events are coming from Chronos Vault.
                  Each webhook request includes a <code>X-Chronos-Signature</code> header that you can verify
                  using your webhook signing secret.
                </AlertDescription>
              </Alert>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="testing" className="space-y-6">
              <h2 className="text-2xl font-bold">Testing</h2>
              
              <p className="text-gray-300">
                We provide a testnet environment where you can test your integration without using real assets.
                The testnet environment mirrors the production environment but uses test tokens instead of real ones.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-2">Test Accounts</h3>
                  <p className="text-gray-400">
                    You can create test accounts with pre-loaded test tokens to use in your integration testing.
                    These accounts can be created in the developer portal.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-2">Test Endpoints</h3>
                  <p className="text-gray-400">
                    When initializing your client with <code>environment: 'testnet'</code>, all API calls
                    will be directed to our testnet environment.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-900 text-slate-50 p-4 rounded-md mt-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// Test environment setup
const client = new ChronosVaultClient({
  apiKey: 'YOUR_TEST_API_KEY',
  environment: 'testnet'
});

// Test wallet connection
const testWalletClient = new ChronosVaultClient({
  wallet: {
    type: 'ethereum',
    provider: testEthereumProvider // Test provider from dev portal
  },
  environment: 'testnet'
});`}</code>
                </pre>
              </div>
              
              <Alert className="border-yellow-500/50 bg-yellow-500/10 mt-4">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Test Tokens vs. Real Tokens</AlertTitle>
                <AlertDescription>
                  Test tokens have no real value and cannot be transferred to mainnet.
                  Always ensure you're using the correct environment for your intended purpose.
                </AlertDescription>
              </Alert>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="going-live" className="space-y-6">
              <h2 className="text-2xl font-bold">Going Live</h2>
              
              <p className="text-gray-300">
                Once you've completed testing, you're ready to move to the production environment.
                Here's a checklist to ensure a smooth transition:
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Generate Production API Keys</h3>
                    <p className="text-gray-400 text-sm">
                      Create a separate set of API keys for production in the developer portal.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Update Environment Settings</h3>
                    <p className="text-gray-400 text-sm">
                      Change the environment setting from 'testnet' to 'mainnet' in your client configuration.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Configure Production Webhooks</h3>
                    <p className="text-gray-400 text-sm">
                      Set up production webhook endpoints and update their URLs in the developer portal.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Review Rate Limits</h3>
                    <p className="text-gray-400 text-sm">
                      Ensure your implementation can handle API rate limits for production traffic.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Implement Monitoring</h3>
                    <p className="text-gray-400 text-sm">
                      Set up monitoring for API calls, webhook events, and error handling.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 text-slate-50 p-4 rounded-md mt-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// Production environment setup
const client = new ChronosVaultClient({
  apiKey: 'YOUR_PRODUCTION_API_KEY',
  environment: 'mainnet'
});`}</code>
                </pre>
              </div>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="common-patterns" className="space-y-6">
              <h2 className="text-2xl font-bold">Common Integration Patterns</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="time-locked-savings">
                  <AccordionTrigger>Time-Locked Savings Application</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      Implement a savings application where users can lock funds for specific time periods,
                      with automatic release on predetermined dates.
                    </p>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Create a time-locked savings vault
const savingsVault = await client.vaults.create({
  name: "Annual Savings",
  type: "time-lock",
  lockUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  chains: ["ethereum", "ton"],
  features: {
    quantumResistant: true,
    crossChainVerification: true
  }
});

// Setup auto-release
await client.automations.schedule({
  vaultId: savingsVault.id,
  action: "release",
  scheduledTime: savingsVault.lockUntil
});`}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="inheritance-planning">
                  <AccordionTrigger>Digital Inheritance Planning</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      Create inheritance vaults that can be accessed by designated beneficiaries
                      after specific conditions are met.
                    </p>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Create an inheritance vault
const inheritanceVault = await client.vaults.create({
  name: "Digital Legacy",
  type: "inheritance",
  chains: ["ethereum", "ton", "solana"],
  features: {
    multiSignature: true,
    quantumResistant: true
  }
});

// Set up beneficiaries
await client.inheritance.configure(inheritanceVault.id, {
  beneficiaries: [
    {
      email: "beneficiary@example.com",
      share: 100, // Percentage
      accessCondition: "owner_inactivity", // Access after owner inactivity
      inactivityPeriod: 365 * 24 * 60 * 60 // 1 year in seconds
    }
  ],
  proofOfLifeInterval: 30 * 24 * 60 * 60 // 30 days in seconds
});`}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="defi-integration">
                  <AccordionTrigger>DeFi Platform Integration</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      Integrate vaults with DeFi platforms to allow users to earn yield on their locked assets.
                    </p>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Create a DeFi-enabled vault
const defiVault = await client.vaults.create({
  name: "Yield-Generating Vault",
  type: "yield",
  chains: ["ethereum"],
  features: {
    defiIntegration: true,
    yieldStrategy: "aave-lending" // or other supported strategies
  }
});

// Deposit assets for yield generation
await client.assets.deposit(defiVault.id, {
  chain: "ethereum",
  assetType: "token",
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  amount: "1000",
  yieldOptions: {
    strategy: "aave-lending",
    autoCompound: true
  }
});`}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <Separator className="my-8 bg-gray-800" />
            
            <section id="troubleshooting" className="space-y-6">
              <h2 className="text-2xl font-bold">Troubleshooting</h2>
              
              <p className="text-gray-300">
                Here are solutions to common issues you might encounter during integration.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="authentication-errors">
                  <AccordionTrigger>Authentication Errors</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      If you're receiving authentication errors, check the following:
                    </p>
                    
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Verify your API key is correct and active</li>
                      <li>Ensure you're using the correct environment (testnet vs. mainnet)</li>
                      <li>Check that your API key has the necessary permissions</li>
                      <li>For wallet authentication, ensure the user has connected their wallet</li>
                    </ul>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// API key troubleshooting
try {
  const vaults = await client.vaults.list();
} catch (error) {
  if (error.code === 'AUTHENTICATION_FAILED') {
    console.error('API key authentication failed', error.message);
    // Prompt user to re-authenticate or check API key
  }
}`}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="blockchain-errors">
                  <AccordionTrigger>Blockchain Transaction Errors</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      Blockchain transactions can fail for various reasons:
                    </p>
                    
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Insufficient funds for gas fees</li>
                      <li>Network congestion causing transaction timeouts</li>
                      <li>Smart contract execution errors</li>
                      <li>Cross-chain verification failures</li>
                    </ul>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Transaction error handling
try {
  const deposit = await client.assets.deposit(vaultId, {
    chain: "ethereum",
    assetType: "native",
    amount: "0.5"
  });
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Insufficient funds for deposit', error.message);
    // Prompt user to add funds
  } else if (error.code === 'NETWORK_ERROR') {
    console.error('Network error, retry later', error.message);
    // Implement retry mechanism
  }
}`}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="rate-limits">
                  <AccordionTrigger>Rate Limiting</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-gray-300">
                      Our API enforces rate limits to ensure fair usage. If you're hitting rate limits:
                    </p>
                    
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Implement exponential backoff for retries</li>
                      <li>Cache results where appropriate</li>
                      <li>Batch requests when possible</li>
                      <li>Consider upgrading your plan for higher limits</li>
                    </ul>
                    
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Rate limit handling with exponential backoff
async function fetchWithRetry(fn, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        retries++;
        if (retries >= maxRetries) throw error;
        
        // Exponential backoff with jitter
        const delay = Math.min(1000 * 2 ** retries, 10000) * (0.8 + Math.random() * 0.4);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}`}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mt-6">
                <h3 className="text-xl font-semibold mb-3">Need More Help?</h3>
                <p className="text-gray-400 mb-4">
                  If you're experiencing issues not covered here, our developer support team is ready to help.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline">
                    <Link href="/documentation">Browse Docs</Link>
                  </Button>
                  <Button variant="default" className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                    Contact Support
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DocumentationLayout>
  );
};

export default IntegrationGuide;