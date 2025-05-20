import React, { useState } from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Code, 
  Database, 
  Lock, 
  Server, 
  Shield, 
  FileJson, 
  Webhook, 
  Wallet, 
  Zap, 
  Key, 
  Clock, 
  Users, 
  Globe, 
  BoxSelect,
  BadgeCheck,
  Filter,
  FileText
} from "lucide-react";

const ApiDocumentation = () => {
  type EndpointKey = "List Vaults" | "Create Vault";
  type LanguageKey = "javascript" | "python" | "curl";
  
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointKey | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>("javascript");

  // Sample endpoint for interactive display
  const sampleEndpoints = {
    "List Vaults": {
      method: "GET",
      path: "/api/vaults",
      description: "Returns a list of vaults associated with the authenticated user.",
      parameters: [
        { name: "type", type: "string", description: "Filter by vault type (e.g., 'time-lock', 'quantum-resistant')" },
        { name: "status", type: "string", description: "Filter by status (e.g., 'active', 'pending', 'locked')" },
        { name: "page", type: "integer", description: "Page number for pagination" },
        { name: "limit", type: "integer", description: "Number of items per page (default: 20, max: 100)" }
      ],
      response: {
        vaults: [
          {
            id: "v_1a2b3c4d5e6f",
            name: "My Savings Vault",
            type: "time-lock",
            status: "active",
            createdAt: "2025-04-15T12:34:56Z",
            lockUntil: "2026-01-01T00:00:00Z",
            chains: ["ethereum", "ton"],
            assets: [
              {
                assetId: "eth_mainnet_native",
                amount: "1.5",
                valueUsd: 4500.00
              }
            ]
          }
        ],
        pagination: {
          total: 12,
          page: 1,
          limit: 20,
          hasMore: false
        }
      }
    },
    "Create Vault": {
      method: "POST",
      path: "/api/vaults",
      description: "Creates a new vault.",
      requestBody: {
        name: "My Savings Vault",
        description: "Long-term savings vault",
        type: "time-lock",
        lockUntil: "2026-01-01T00:00:00Z",
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
      },
      response: {
        id: "v_1a2b3c4d5e6f",
        status: "created",
        depositAddresses: {
          ethereum: "0xabcdef1234567890abcdef1234567890abcdef12",
          ton: "UQAkIXbCToQ6LowMrDNG2K3ERmMH8m4XB2owWgL0BAB14Jtl"
        },
        createdAt: "2025-05-20T12:34:56Z"
      }
    }
  };

  // Sample code snippets for different languages
  const codeSnippets = {
    "List Vaults": {
      javascript: `import { ChronosVaultClient } from '@chronos-vault/sdk';

// Initialize client with API key
const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// List all vaults
async function listVaults() {
  try {
    const response = await client.vaults.list({
      type: 'time-lock',
      status: 'active',
      page: 1,
      limit: 20
    });
    console.log(response.vaults);
  } catch (error) {
    console.error('Error listing vaults:', error);
  }
}

listVaults();`,
      python: `from chronos_vault_sdk import ChronosVaultClient

# Initialize client with API key
client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='production'
)

# List all vaults
try:
    response = client.vaults.list(
        type='time-lock',
        status='active',
        page=1,
        limit=20
    )
    print(response.vaults)
except Exception as e:
    print(f"Error listing vaults: {e}")`,
      curl: `curl -X GET "https://api.chronosvault.org/api/vaults?type=time-lock&status=active&page=1&limit=20" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
    },
    "Create Vault": {
      javascript: `import { ChronosVaultClient } from '@chronos-vault/sdk';

// Initialize client with API key
const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Create a new vault
async function createVault() {
  try {
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
    console.log(vault);
  } catch (error) {
    console.error('Error creating vault:', error);
  }
}

createVault();`,
      python: `from chronos_vault_sdk import ChronosVaultClient
from datetime import datetime, timezone

# Initialize client with API key
client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='production'
)

# Create a new vault
try:
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
    print(vault)
except Exception as e:
    print(f"Error creating vault: {e}")`,
      curl: `curl -X POST "https://api.chronosvault.org/api/vaults" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Savings Vault",
    "description": "Long-term savings vault",
    "type": "time-lock",
    "lockUntil": "2026-01-01T00:00:00Z",
    "chains": ["ethereum", "ton"],
    "features": {
      "quantumResistant": true,
      "crossChainVerification": true,
      "multiSignature": false
    },
    "security": {
      "verificationLevel": "advanced",
      "requireMultiSignature": false,
      "timeDelay": 86400
    }
  }'`
    }
  };

  return (
    <DocumentationLayout>
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex flex-col items-start mb-10">
          <div className="flex items-center mb-2">
            <Code className="h-8 w-8 mr-2 text-indigo-500" />
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
              API Documentation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Comprehensive reference for the Chronos Vault API, including endpoints, parameters, and example responses.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="sdk">SDK Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-6 w-6 text-indigo-500" />
                  API Overview
                </CardTitle>
                <CardDescription>
                  Understanding the Chronos Vault API structure and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                  <p className="text-lg mb-4">
                    The Chronos Vault API provides programmatic access to create, manage, and interact with digital vaults 
                    across multiple blockchain networks. Our RESTful API architecture allows developers to seamlessly 
                    integrate advanced vault functionality into their applications.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Core Capabilities</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Create and manage various types of secure vaults</li>
                    <li>Deposit and withdraw assets across multiple blockchain networks</li>
                    <li>Configure security features like quantum resistance and multi-signature requirements</li>
                    <li>Set up intent-based inheritance and time-locked releases</li>
                    <li>Monitor and verify vault integrity with real-time updates</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Base URL</h3>
                  <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono mb-4">
                    https://api.chronosvault.org/api
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">API Versioning</h3>
                  <p className="mb-4">
                    The current API version is v1. API versioning is maintained through the URL path:
                  </p>
                  <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono mb-4">
                    https://api.chronosvault.org/api/v1/...
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Response Format</h3>
                  <p className="mb-2">
                    All API responses are returned in JSON format and include appropriate HTTP status codes.
                    Successful responses will have a 2xx status code, while errors will return an appropriate
                    4xx or 5xx status code along with an error message.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/30 border-indigo-100 dark:border-indigo-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-indigo-500" />
                        Fast & Reliable
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Optimized for performance with 99.99% uptime guarantee and low-latency global infrastructure.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/30 border-indigo-100 dark:border-indigo-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-indigo-500" />
                        Enterprise-Grade Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Built with multiple layers of encryption, quantum resistance, and comprehensive audit logging.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/30 border-indigo-100 dark:border-indigo-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-indigo-500" />
                        Cross-Chain Compatibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Unified API interface across Ethereum, TON, Solana, and Bitcoin networks with consistent responses.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="outline" asChild className="mr-4">
                  <Link href="/documentation/sdk">View SDK Documentation</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                  <Link href="#endpoints">Explore API Endpoints</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-indigo-500" />
                  Authentication Methods
                </CardTitle>
                <CardDescription>
                  Secure your API requests with authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="h-8 w-8 text-indigo-500" />
                      <h3 className="text-xl font-semibold">API Key Authentication</h3>
                    </div>
                    <p className="mb-4">
                      The simplest authentication method uses API keys for programmatic access.
                      Include your API key in the Authorization header:
                    </p>
                    <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-sm mb-4">
                      Authorization: Bearer YOUR_API_KEY
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
                      <p className="text-amber-800 dark:text-amber-400 text-sm">
                        <strong>Security Note:</strong> Keep your API key secure and never expose it in client-side code.
                        Use environment variables or secure key management solutions.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/developer-portal">Manage API Keys</Link>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="h-8 w-8 text-indigo-500" />
                      <h3 className="text-xl font-semibold">Wallet-Based Authentication</h3>
                    </div>
                    <p className="mb-4">
                      Connect your blockchain wallet to authenticate. Our SDK simplifies this process,
                      handling signature verification automatically.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <img src="/icons/ethereum.svg" alt="Ethereum" className="w-4 h-4" />
                        </div>
                        <span>Ethereum (MetaMask, WalletConnect)</span>
                      </div>
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <img src="/icons/ton.svg" alt="TON" className="w-4 h-4" />
                        </div>
                        <span>TON (Tonkeeper, TON Wallet)</span>
                      </div>
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <img src="/icons/solana.svg" alt="Solana" className="w-4 h-4" />
                        </div>
                        <span>Solana (Phantom, Solflare)</span>
                      </div>
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <img src="/icons/bitcoin.svg" alt="Bitcoin" className="w-4 h-4" />
                        </div>
                        <span>Bitcoin (via xPub)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Sample Authentication Implementation</h3>
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="javascript" className="mt-4">
                      <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                        <pre className="text-sm overflow-x-auto">
                          <code>{`import { ChronosVaultClient } from '@chronos-vault/sdk';

// API Key Authentication
const apiClient = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Wallet-based Authentication
const walletClient = new ChronosVaultClient({
  wallet: {
    type: 'ethereum',
    provider: window.ethereum // or custom provider
  },
  environment: 'production'
});

// Authenticate with wallet
async function authenticateWithWallet() {
  await walletClient.authenticate();
  console.log('Successfully authenticated!');
}`}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="python" className="mt-4">
                      <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                        <pre className="text-sm overflow-x-auto">
                          <code>{`from chronos_vault_sdk import ChronosVaultClient
from chronos_vault_sdk.providers import EthereumProvider

# API Key Authentication
api_client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='production'
)

# Wallet-based Authentication
ethereum_provider = EthereumProvider(private_key='your_ethereum_private_key')
wallet_client = ChronosVaultClient(
    wallet={
        'type': 'ethereum',
        'provider': ethereum_provider
    },
    environment='production'
)

# Authenticate with wallet
wallet_client.authenticate()
print('Successfully authenticated!')`}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="curl" className="mt-4">
                      <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                        <pre className="text-sm overflow-x-auto">
                          <code>{`# API Key Authentication
curl -X GET "https://api.chronosvault.org/api/vaults" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Wallet-based Authentication requires multiple steps:
# 1. Get a nonce
curl -X GET "https://api.chronosvault.org/api/auth/nonce"

# 2. Sign the nonce with your wallet (not shown in curl)

# 3. Verify the signature
curl -X POST "https://api.chronosvault.org/api/auth/verify" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "signature": "0x...",
    "nonce": "..."
  }'`}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <div className="sticky top-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">API Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <nav className="flex flex-col">
                        <a href="#vault-management" className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-2 border-transparent hover:border-indigo-500 transition-colors">
                          Vault Management
                        </a>
                        <a href="#security-verification" className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-2 border-transparent hover:border-indigo-500 transition-colors">
                          Security & Verification
                        </a>
                        <a href="#inheritance" className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-2 border-transparent hover:border-indigo-500 transition-colors">
                          Inheritance
                        </a>
                        <a href="#blockchain" className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-2 border-transparent hover:border-indigo-500 transition-colors">
                          Blockchain
                        </a>
                        <a href="#websocket" className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-2 border-transparent hover:border-indigo-500 transition-colors">
                          WebSocket
                        </a>
                        <a href="#webhooks" className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-2 border-transparent hover:border-indigo-500 transition-colors">
                          Webhooks
                        </a>
                      </nav>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="md:col-span-3 space-y-8">
                <section id="vault-management">
                  <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    Vault Management
                  </h2>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="list-vaults" className="border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-xs font-bold">GET</span>
                          <span className="font-mono text-sm">/api/vaults</span>
                          <span className="text-slate-500 text-sm">List Vaults</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Returns a list of vaults associated with the authenticated user.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Query Parameters</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr>
                                    <th className="py-2 px-4 bg-slate-100 dark:bg-slate-800 text-left">Parameter</th>
                                    <th className="py-2 px-4 bg-slate-100 dark:bg-slate-800 text-left">Type</th>
                                    <th className="py-2 px-4 bg-slate-100 dark:bg-slate-800 text-left">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">type</td>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">string</td>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">Filter by vault type (e.g., "time-lock", "quantum-resistant")</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">status</td>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">string</td>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">Filter by status (e.g., "active", "pending", "locked")</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">page</td>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">integer</td>
                                    <td className="py-2 px-4 border-b dark:border-slate-700">Page number for pagination</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 px-4">limit</td>
                                    <td className="py-2 px-4">integer</td>
                                    <td className="py-2 px-4">Number of items per page (default: 20, max: 100)</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Response</h4>
                            <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                              <pre className="text-sm overflow-x-auto">
                                <code>{JSON.stringify(sampleEndpoints["List Vaults"].response, null, 2)}</code>
                              </pre>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedEndpoint("List Vaults");
                                const tabsElement = document.querySelector('[data-value="examples"]');
                                if (tabsElement) {
                                  (tabsElement as HTMLElement).click();
                                }
                              }}
                            >
                              View Code Examples
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="create-vault" className="border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold">POST</span>
                          <span className="font-mono text-sm">/api/vaults</span>
                          <span className="text-slate-500 text-sm">Create Vault</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Creates a new vault.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Request Body</h4>
                            <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                              <pre className="text-sm overflow-x-auto">
                                <code>{JSON.stringify(sampleEndpoints["Create Vault"].requestBody, null, 2)}</code>
                              </pre>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Response</h4>
                            <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                              <pre className="text-sm overflow-x-auto">
                                <code>{JSON.stringify(sampleEndpoints["Create Vault"].response, null, 2)}</code>
                              </pre>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedEndpoint("Create Vault");
                                const tabsElement = document.querySelector('[data-value="examples"]');
                                if (tabsElement) {
                                  (tabsElement as HTMLElement).click();
                                }
                              }}
                            >
                              View Code Examples
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* More vault management endpoints would be added here */}
                  </Accordion>
                </section>
                
                <section id="security-verification">
                  <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Security & Verification
                  </h2>
                  
                  <Card className="mb-4">
                    <CardContent className="pt-6">
                      <p className="text-slate-600 dark:text-slate-400">
                        Security and verification endpoints provide mechanisms to verify the integrity and security of vaults, 
                        run security scans, and configure quantum-resistant security features.
                      </p>
                      <Button variant="link" asChild className="p-0">
                        <Link href="/api-reference">View All Security Endpoints</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </section>
                
                {/* Additional API endpoint sections would be added here */}
                
                <section id="websocket">
                  <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    WebSocket API
                  </h2>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Real-time Updates</CardTitle>
                      <CardDescription>
                        Connect to our WebSocket API for real-time updates and events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Connection</h4>
                          <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-sm">
                            wss://api.chronosvault.org/api/ws
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Authentication</h4>
                          <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-sm">
                            ?token=YOUR_API_KEY
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Events</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-md p-3">
                              <div className="font-medium mb-1">TRANSACTION_CONFIRMED</div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Sent when a blockchain transaction is confirmed
                              </p>
                              <Button size="sm" variant="outline" asChild>
                                <Link href="/api-reference#websocket-events">View Format</Link>
                              </Button>
                            </div>
                            
                            <div className="border rounded-md p-3">
                              <div className="font-medium mb-1">SECURITY_ALERT</div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Sent when a security issue is detected
                              </p>
                              <Button size="sm" variant="outline" asChild>
                                <Link href="/api-reference#websocket-events">View Format</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-indigo-500" />
                  Code Examples
                </CardTitle>
                <CardDescription>
                  Implementation examples in multiple programming languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      <Button
                        variant={selectedEndpoint === "List Vaults" ? "default" : "outline"}
                        onClick={() => setSelectedEndpoint("List Vaults")}
                      >
                        List Vaults
                      </Button>
                      <Button
                        variant={selectedEndpoint === "Create Vault" ? "default" : "outline"}
                        onClick={() => setSelectedEndpoint("Create Vault")}
                      >
                        Create Vault
                      </Button>
                    </div>
                    
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant={selectedLanguage === "javascript" ? "default" : "outline"}
                        onClick={() => setSelectedLanguage("javascript")}
                      >
                        JavaScript
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedLanguage === "python" ? "default" : "outline"}
                        onClick={() => setSelectedLanguage("python")}
                      >
                        Python
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedLanguage === "curl" ? "default" : "outline"}
                        onClick={() => setSelectedLanguage("curl")}
                      >
                        cURL
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-400">
                        {selectedEndpoint || "Select an endpoint"}
                      </span>
                      <Button size="sm" variant="ghost" className="h-8 text-slate-400 hover:text-white">
                        <FileText className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {selectedEndpoint && selectedLanguage && 
                          codeSnippets[selectedEndpoint]?.[selectedLanguage] || 
                         "Select an endpoint and language to view code examples"}
                      </code>
                    </pre>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-xl font-semibold mb-4">Implementation Notes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-lg border bg-card shadow p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-indigo-500" />
                          Error Handling
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Always implement proper error handling to gracefully manage API failures.
                          The SDK provides built-in error handling with specific error types.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border bg-card shadow p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Filter className="h-4 w-4 text-indigo-500" />
                          Pagination
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          When listing resources, utilize pagination parameters to avoid fetching excessive data.
                          The API returns pagination metadata to help navigate through large result sets.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border bg-card shadow p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-indigo-500" />
                          Rate Limiting
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Respect rate limits by monitoring the rate limit headers and implementing
                          throttling when necessary. The API allows 120 requests per minute.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border bg-card shadow p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Webhook className="h-4 w-4 text-indigo-500" />
                          Webhook Verification
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Always verify webhook signatures to ensure requests are legitimate.
                          The SDK provides helper functions to validate incoming webhook events.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdk">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BoxSelect className="h-6 w-6 text-indigo-500" />
                  SDK Access
                </CardTitle>
                <CardDescription>
                  Client libraries for multiple programming languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <img src="/icons/javascript.svg" alt="JavaScript" className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">JavaScript/TypeScript</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        For web applications, Node.js backends, and React Native mobile apps.
                      </p>
                    </div>
                    <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-sm mb-4">
                      npm install @chronos-vault/sdk
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/sdk-documentation/javascript">Learn More</Link>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <img src="/icons/python.svg" alt="Python" className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Python</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Ideal for data science, scripts, and server-side applications.
                      </p>
                    </div>
                    <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-sm mb-4">
                      pip install chronos-vault-sdk
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/sdk-documentation/python">Learn More</Link>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <img src="/icons/java.svg" alt="Java" className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Java</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        For enterprise applications and Android development.
                      </p>
                    </div>
                    <div className="bg-black/10 dark:bg-white/10 p-3 rounded-md font-mono text-sm mb-4">
                      {"// Maven\n<dependency>\n  <groupId>org.chronosvault</groupId>\n  <artifactId>chronos-vault-sdk</artifactId>\n  <version>1.0.0</version>\n</dependency>"}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/sdk-documentation/java">Learn More</Link>
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">SDK Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Type-safe API</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Full TypeScript/language-specific type definitions for all API responses.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Automatic retries</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Built-in exponential backoff for transient errors.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Wallet integration</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Seamless integration with popular blockchain wallets.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">WebSocket support</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Real-time updates and event streaming.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                    <Link href="/sdk-documentation">View Full SDK Documentation</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default ApiDocumentation;