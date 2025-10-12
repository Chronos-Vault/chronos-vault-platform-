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
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sample endpoint for interactive display - EXACT backend structures from server/api/vaults-routes.ts
  const sampleEndpoints = {
    "List Vaults": {
      method: "GET",
      path: "/api/vaults",
      description: "Returns all vaults. Optional 'type' query param filters by vault type. Response structure varies by vault type.",
      parameters: [
        { name: "type", type: "string", description: "Optional: Filter by type ('time-lock', 'quantum-progressive', 'multi-signature', etc.)" }
      ],
      response: {
        success: true,
        vaults: [
          {
            id: "quantum-vault-1",
            name: "High-Value Quantum Vault",
            description: "Quantum-resistant vault with progressive security for high-value assets",
            type: "quantum-progressive",
            value: 125000,
            createdAt: "2025-09-22T00:00:00.000Z",
            updatedAt: "2025-10-07T00:00:00.000Z",
            securityLevel: "advanced",
            securityInfo: {
              vaultId: "quantum-vault-1",
              securityStrength: 90,
              currentTier: "advanced",
              lastUpgrade: "2025-10-07T00:00:00.000Z",
              hasZeroKnowledgeProofs: true,
              requiredSignatures: 2,
              signatures: {
                algorithm: "CRYSTALS-Dilithium",
                strength: "High"
              },
              encryption: {
                algorithm: "Kyber-1024",
                latticeParameters: {
                  dimension: 1024,
                  errorDistribution: "Gaussian",
                  ringType: "Ring-LWE"
                }
              }
            }
          }
        ]
      }
    },
    "Create Vault": {
      method: "POST",
      path: "/api/vaults",
      description: "Creates a new vault. Required: id, name, type, value. Optional: description, primaryChain (defaults to 'ethereum'), unlockDate (for time-lock), metadata (free-form object), securityLevel/beneficiaries/requiredSignatures (type-specific). Backend auto-adds createdAt/updatedAt timestamps via new Date().toISOString().",
      requestBody: {
        id: "vault-67890",
        name: "My Time-Locked Vault",
        description: "Savings locked until 2026",
        type: "time-lock",
        value: 50000,
        primaryChain: "ethereum",
        unlockDate: "2026-01-01T00:00:00Z"
      },
      response: {
        success: true,
        vault: {
          id: "vault-67890",
          name: "My Time-Locked Vault",
          description: "Savings locked until 2026",
          type: "time-lock",
          value: 50000,
          primaryChain: "ethereum",
          unlockDate: "2026-01-01T00:00:00Z",
          createdAt: "2025-10-12T14:30:00.000Z",
          updatedAt: "2025-10-12T14:30:00.000Z"
        }
      }
    }
  };

  // Sample code snippets for different languages
  const codeSnippets = {
    "List Vaults": {
      javascript: `// List all vaults using fetch API
async function listVaults() {
  try {
    const response = await fetch('https://chronosvault.org/api/vaults?type=time-lock', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Vaults:', data.vaults);
  } catch (error) {
    console.error('Error listing vaults:', error);
  }
}

listVaults();`,
      python: `import requests

# List all vaults using requests library
def list_vaults():
    try:
        response = requests.get(
            'https://chronosvault.org/api/vaults',
            params={'type': 'time-lock'},
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_JWT_TOKEN'
            }
        )
        data = response.json()
        print('Vaults:', data['vaults'])
    except Exception as e:
        print(f"Error listing vaults: {e}")

list_vaults()`,
      curl: `curl -X GET "https://chronosvault.org/api/vaults?type=time-lock" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`
    },
    "Create Vault": {
      javascript: `// Create a new vault using fetch API
async function createVault() {
  try {
    const response = await fetch('https://chronosvault.org/api/vaults', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      credentials: 'include',
      body: JSON.stringify({
        id: crypto.randomUUID(),
        name: "My Savings Vault",
        description: "Long-term savings vault",
        type: "time-lock",
        value: 1000,
        primaryChain: "ethereum",
        unlockDate: "2026-01-01T00:00:00Z",
        metadata: {
          quantumResistant: true,
          trinityProtocolEnabled: true
        }
      })
    });
    
    const vault = await response.json();
    console.log('Created vault:', vault);
  } catch (error) {
    console.error('Error creating vault:', error);
  }
}

createVault();`,
      python: `import requests
import uuid

# Create a new vault using requests library
def create_vault():
    try:
        response = requests.post(
            'https://chronosvault.org/api/vaults',
            json={
                'id': 'vault_' + str(uuid.uuid4()),
                'name': 'My Savings Vault',
                'description': 'Long-term savings vault',
                'type': 'time-lock',
                'value': 1000,
                'primaryChain': 'ethereum',
                'unlockDate': '2026-01-01T00:00:00Z',
                'metadata': {
                    'quantumResistant': True,
                    'trinityProtocolEnabled': True
                }
            },
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_JWT_TOKEN'
            }
        )
        vault = response.json()
        print('Created vault:', vault)
    except Exception as e:
        print(f"Error creating vault: {e}")

create_vault()`,
      curl: `curl -X POST "https://chronosvault.org/api/vaults" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "vault-12345",
    "name": "My Savings Vault",
    "description": "Long-term savings vault",
    "type": "time-lock",
    "value": 50000,
    "primaryChain": "ethereum",
    "unlockDate": "2026-01-01T00:00:00Z"
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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="rest">REST Integration</TabsTrigger>
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
                    https://chronosvault.org/api
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
                    <p className="text-amber-800 dark:text-amber-400 text-sm">
                      <strong>Important:</strong> The API is served from the same domain as the platform (chronosvault.org), not a separate subdomain.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">Trinity Protocol Security</h3>
                  <p className="mb-4">
                    All vault operations are secured by the Trinity Protocol with 2-of-3 multi-chain consensus across Arbitrum L2, Solana, and TON blockchains. 
                    Attack probability &lt; 10⁻¹⁸ ensuring mathematical security.
                  </p>
                  
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
                  <Link href="/integration-guide">View Integration Guide</Link>
                </Button>
                <Button 
                  onClick={() => handleTabChange("endpoints")} 
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
                >
                  Explore API Endpoints
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
                        <strong>Security Note:</strong> Store your API keys securely and never expose them 
                        in client-side code. Use environment variables or a secure key management system.
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/developer-portal">Manage API Keys</Link>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="h-8 w-8 text-indigo-500" />
                      <h3 className="text-xl font-semibold">Wallet-Based Authentication</h3>
                    </div>
                    <p className="mb-4">
                      Connect your blockchain wallet to authenticate. The REST API handles signature 
                      verification with a simple nonce → sign → verify flow.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.9981 2L11.8667 2.44485V16.3121L11.9981 16.4428L18.9962 12.1854L11.9981 2Z" fill="#343434"/>
                            <path d="M11.9981 2L5 12.1854L11.9981 16.4428V9.75864V2Z" fill="#8C8C8C"/>
                            <path d="M11.9981 17.7823L11.9242 17.8723V22.8961L11.9981 23.1138L19 13.5273L11.9981 17.7823Z" fill="#3C3C3B"/>
                            <path d="M11.9981 23.1138V17.7823L5 13.5273L11.9981 23.1138Z" fill="#8C8C8C"/>
                            <path d="M11.9981 16.4427L18.9961 12.1852L11.9981 8.93469V16.4427Z" fill="#141414"/>
                            <path d="M5 12.1852L11.9981 16.4427V8.93469L5 12.1852Z" fill="#393939"/>
                          </svg>
                        </div>
                        <span>Ethereum (MetaMask, WalletConnect)</span>
                      </div>
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5953 16.9694L16.7447 20.8188C16.667 20.8965 16.6062 20.9895 16.5661 21.0919C16.526 21.1942 16.5075 21.3035 16.5116 21.413C16.5157 21.5226 16.5423 21.6299 16.5899 21.7284C16.6374 21.8269 16.7049 21.9144 16.7881 21.9854C16.8714 22.0564 16.9685 22.1092 17.0732 22.1402C17.1779 22.1712 17.2879 22.1796 17.396 22.165C17.504 22.1504 17.6072 22.1131 17.6988 22.0553C17.7904 21.9976 17.8683 21.9208 17.9271 21.83L22.4012 17.4012C22.4878 17.3146 22.5563 17.2116 22.603 17.0976C22.6496 16.9836 22.6736 16.8611 22.6736 16.7371C22.6736 16.6131 22.6496 16.4906 22.603 16.3765C22.5563 16.2625 22.4878 16.1595 22.4012 16.0729L17.9859 11.6588C17.9289 11.5658 17.8523 11.4869 17.7613 11.4275C17.6703 11.3682 17.5674 11.3298 17.4595 11.3152C17.3517 11.3006 17.2419 11.3103 17.1378 11.3434C17.0337 11.3766 16.9378 11.4325 16.8563 11.5071C16.7747 11.5816 16.7093 11.6732 16.6644 11.7757C16.6195 11.8782 16.5962 11.9894 16.5957 12.102C16.5952 12.2145 16.6175 12.326 16.6614 12.429C16.7054 12.532 16.77 12.6242 16.8511 12.6994L20.5953 16.4447L3.55764 16.4659C3.41045 16.4659 3.26576 16.4942 3.13285 16.549C2.99993 16.6038 2.88202 16.6839 2.78735 16.7843C2.69267 16.8847 2.62342 17.0032 2.5842 17.1323C2.54498 17.2615 2.5368 17.3982 2.56033 17.5318C2.58385 17.6654 2.63842 17.7924 2.72016 17.9036C2.8019 18.0149 2.90891 18.1077 3.03414 18.1752C3.15938 18.2426 3.2999 18.2831 3.44422 18.2936C3.58855 18.3041 3.73311 18.2843 3.86694 18.2357L3.89516 18.2306L3.57047 18.2318L20.5953 16.9694Z" fill="#0098EA"/>
                            <path d="M20.5953 7.51059L16.8511 11.3094C16.77 11.3846 16.7053 11.4769 16.6614 11.5798C16.6175 11.6827 16.5953 11.7942 16.5957 11.9067C16.5962 12.0192 16.6196 12.1304 16.6644 12.233C16.7093 12.3355 16.7747 12.427 16.8563 12.5016C16.9378 12.5762 17.0338 12.632 17.1378 12.6652C17.2419 12.6984 17.3517 12.7081 17.4596 12.6935C17.5674 12.6789 17.6703 12.6405 17.7613 12.5811C17.8524 12.5217 17.9289 12.4429 17.9859 12.35L22.4012 7.93058C22.4878 7.84398 22.5563 7.74099 22.603 7.62695C22.6496 7.51291 22.6736 7.39045 22.6736 7.26646C22.6736 7.14247 22.6496 7.02001 22.603 6.90597C22.5563 6.79193 22.4878 6.68894 22.4012 6.60234L17.9859 2.18705C17.9289 2.09407 17.8523 2.01519 17.7613 1.9558C17.6703 1.89642 17.5674 1.85801 17.4595 1.84341C17.3517 1.82881 17.2419 1.83853 17.1378 1.87168C17.0337 1.90483 16.9378 1.96069 16.8563 2.03528C16.7747 2.10987 16.7093 2.20142 16.6644 2.30393C16.6195 2.40644 16.5962 2.51764 16.5957 2.63026C16.5952 2.74288 16.6175 2.85441 16.6614 2.95739C16.7054 3.06038 16.77 3.15265 16.8511 3.22763L20.5953 6.9729L3.55764 6.99411C3.41045 6.99411 3.26576 7.02242 3.13285 7.07722C2.99993 7.13203 2.88202 7.2121 2.78735 7.31255C2.69267 7.41299 2.62342 7.53147 2.5842 7.66061C2.54498 7.78974 2.5368 7.92644 2.56033 8.06C2.58385 8.19357 2.63842 8.32056 2.72016 8.43182C2.8019 8.54309 2.90891 8.63589 3.03414 8.7033C3.15938 8.77071 3.2999 8.81123 3.44422 8.82169C3.58855 8.83215 3.73311 8.81241 3.86694 8.76387L3.89516 8.75882L3.57047 8.75999L20.5953 7.51059Z" fill="#0098EA"/>
                          </svg>
                        </div>
                        <span>TON (Tonkeeper, TON Wallet)</span>
                      </div>
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9894 5.53816C14.1678 5.23346 13.2958 5.07253 12.4149 5.06152C11.5339 5.05052 10.6582 5.18971 9.82777 5.47183C7.34844 6.30422 5.51777 8.49352 5.09977 11.048C4.87777 12.3526 5.00111 13.6538 5.44577 14.8839C5.89044 16.114 6.64144 17.2306 7.64177 18.136C8.53377 18.9432 9.61777 19.5384 10.8012 19.8718C10.8012 19.8718 10.6278 20.2328 10.5305 20.392C10.4832 20.4723 10.4193 20.5413 10.3428 20.5942C10.2664 20.6471 10.1791 20.6826 10.0872 20.6984C9.30177 20.8097 8.50777 20.7662 7.74444 20.5707C7.17777 20.4238 6.65177 20.1609 6.19844 19.8019L5.99711 19.6514L3.86777 23.0674L4.05777 23.1889C4.60444 23.5349 5.19044 23.8207 5.80444 24.0403C6.89711 24.4439 8.05711 24.6421 9.22644 24.6244C10.0878 24.612 10.9397 24.4339 11.7372 24.0998C12.1032 23.9494 12.4527 23.7619 12.7811 23.5399C13.6764 22.9436 14.3672 22.0995 14.7685 21.1171C15.1698 20.1348 15.2659 19.0617 15.0465 18.0273L15.0321 17.9688C15.0321 17.9688 14.9641 17.6436 14.9558 17.6018C14.9332 17.494 14.9147 17.4089 14.9002 17.3369C15.1782 17.3033 15.4552 17.2628 15.7311 17.2152C16.7158 17.0465 17.6673 16.7391 18.5585 16.3017C20.0158 15.5453 21.2178 14.3559 21.9921 12.8925C22.7665 11.4292 23.0773 9.7631 22.8843 8.1191C22.6913 6.47509 22.0031 4.92647 20.9114 3.68073C19.8197 2.43498 18.3796 1.55183 16.7777 1.13993" fill="#00FFA3"/>
                          </svg>
                        </div>
                        <span>Solana (Phantom, Solflare)</span>
                      </div>
                      <div className="flex items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.6389 14.9538C22.2079 21.3053 15.9842 25.2467 9.63279 23.8158C3.28139 22.3848 -0.660012 16.1611 0.770955 9.80965C2.20192 3.45825 8.42564 -0.483155 14.777 0.947813C21.1284 2.37878 25.0699 8.6025 23.6389 14.9538V14.9538Z" fill="#F7931A"/>
                            <path d="M17.2909 10.5269C17.5176 8.90402 16.283 7.88108 14.5627 7.19651L15.1471 4.92805L13.7574 4.57265L13.1918 6.76963C12.8062 6.67754 12.4083 6.59075 12.0132 6.50455L12.5823 4.29136L11.1932 3.93597L10.6082 6.20384C10.2849 6.1337 9.9691 6.06473 9.6639 5.99052L9.66567 5.9834L7.70842 5.48877L7.33147 6.97479C7.33147 6.97479 8.35323 7.21472 8.33079 7.23066C8.91044 7.37305 9.01212 7.75886 8.99442 8.06286L8.32629 10.6429C8.36932 10.6518 8.42412 10.6655 8.48419 10.6882C8.433 10.6752 8.37879 10.6616 8.32276 10.6485L7.38919 14.2524C7.32383 14.4254 7.14682 14.6818 6.74568 14.5831C6.75984 14.6055 5.746 14.3273 5.746 14.3273L5.04834 15.9116L6.90034 16.3833C7.25574 16.4695 7.60469 16.5592 7.94835 16.6438L7.35805 18.9414L8.74655 19.2968L9.33209 17.0254C9.72735 17.1277 10.111 17.2212 10.4862 17.309L9.90303 19.572L11.2927 19.9274L11.883 17.6333C14.2129 18.0568 15.9661 17.8894 16.7502 15.7978C17.3822 14.1078 16.807 13.1156 15.6562 12.4647C16.5133 12.2781 17.1535 11.7123 17.2909 10.5269Z" fill="white"/>
                          </svg>
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
                      <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                        <pre>{`// Wallet-based Authentication with MetaMask
import { ethers } from 'ethers';

async function authenticateWithWallet() {
  try {
    // Connect to MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // Step 1: Request nonce from server
    const nonceRes = await fetch('/api/auth/nonce');
    const { nonce } = await nonceRes.json();
    
    // Step 2: Sign message with wallet
    const message = \`Sign this message to authenticate: \${nonce}\`;
    const signature = await signer.signMessage(message);
    
    // Step 3: Verify signature on server
    const authRes = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, nonce })
    });
    
    const { token } = await authRes.json();
    console.log('JWT Token:', token);
    
    // Step 4: Use token for authenticated requests
    const vaultsRes = await fetch('/api/vaults', {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    
    const { vaults } = await vaultsRes.json();
    return { token, vaults };
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}

authenticateWithWallet();`}</pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="python" className="mt-4">
                      <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                        <pre>{`# Wallet-based Authentication with Python
import requests
from eth_account import Account
from eth_account.messages import encode_defunct

def authenticate_with_wallet(private_key):
    # Create account from private key
    account = Account.from_key(private_key)
    address = account.address
    
    # Step 1: Request nonce from server
    nonce_res = requests.get('https://chronosvault.org/api/vault/request-nonce')
    nonce = nonce_res.json()['nonce']
    
    # Step 2: Sign message with wallet
    message = f"Sign this message to authenticate: {nonce}"
    encoded_message = encode_defunct(text=message)
    signed_message = account.sign_message(encoded_message)
    
    # Step 3: Verify signature on server
    auth_res = requests.post(
        'https://chronosvault.org/api/wallet/verify-signature',
        json={
            'address': address,
            'signature': signed_message.signature.hex(),
            'message': nonce
        }
    )
    
    # Session created automatically, use credentials
    print('Authentication successful')
    
    # Step 4: Use session for authenticated requests
    vaults_res = requests.get(
        'https://chronosvault.org/api/vaults',
        headers={'Content-Type': 'application/json'}
    )
    
    vaults = vaults_res.json()['vaults']
    return {'token': token, 'vaults': vaults}

# Example usage
authenticate_with_wallet('YOUR_PRIVATE_KEY')`}</pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="curl" className="mt-4">
                      <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                        <pre>{`# API Key Authentication
curl -X GET "https://chronosvault.org/api/vaults" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Wallet-based Authentication (3-step process)

# Step 1: Request nonce
curl -X POST "https://chronosvault.org/api/vault/request-nonce" \\
  -H "Content-Type: application/json" \\
  -d '{"walletAddress": "0xYourWalletAddress"}'

# Step 2: Sign message with nonce using wallet (cannot be done with curl alone)
# Using web3.js, ethers.js, or other wallet library:
# const signature = await wallet.signMessage(\`Sign this message to authenticate: \${nonce}\`);

# Step 3: Verify signature
curl -X POST "https://chronosvault.org/api/wallet/verify-signature" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0xYourWalletAddress",
    "signature": "0xSignatureFromWallet",
    "message": "NonceFromStep1"
  }'

# Step 4: Use session for subsequent requests (session-based, no token needed)
curl -X GET "https://chronosvault.org/api/vaults" \\
  --cookie-jar cookies.txt \\
  --cookie cookies.txt \\
  -H "Content-Type: application/json"`}</pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-6 w-6 text-indigo-500" />
                  API Endpoints
                </CardTitle>
                <CardDescription>
                  Complete reference for all available API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <BoxSelect className="h-5 w-5 mr-2 text-indigo-500" />
                      Interactive API Explorer
                    </h3>
                    <p className="mb-4">
                      Select an endpoint to view detailed documentation and try it out with interactive examples.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="endpoint-select">Select Endpoint</Label>
                        <div className="flex gap-2 mt-2">
                          <select 
                            id="endpoint-select"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedEndpoint || ""}
                            onChange={(e) => setSelectedEndpoint(e.target.value as EndpointKey || null)}
                          >
                            <option value="">Select endpoint...</option>
                            <option value="List Vaults">GET /api/vaults - List Vaults</option>
                            <option value="Create Vault">POST /api/vaults - Create Vault</option>
                          </select>
                          <Button 
                            className="bg-indigo-500 hover:bg-indigo-600"
                            disabled={!selectedEndpoint}
                          >
                            Try It
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedEndpoint && (
                    <Card className="bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-900/10 border-indigo-100 dark:border-indigo-900/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${sampleEndpoints[selectedEndpoint].method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                            {sampleEndpoints[selectedEndpoint].method}
                          </span>
                          <code className="font-mono text-base">{sampleEndpoints[selectedEndpoint].path}</code>
                        </CardTitle>
                        <CardDescription>
                          {sampleEndpoints[selectedEndpoint].description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {'parameters' in sampleEndpoints[selectedEndpoint] && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                            <div className="border rounded-md overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="text-left p-2 border-b">Name</th>
                                    <th className="text-left p-2 border-b">Type</th>
                                    <th className="text-left p-2 border-b">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(sampleEndpoints[selectedEndpoint] as any).parameters?.map((param: any, i: number) => (
                                    <tr key={i} className="border-b last:border-b-0">
                                      <td className="p-2 font-mono">{param.name}</td>
                                      <td className="p-2">{param.type}</td>
                                      <td className="p-2">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {'requestBody' in sampleEndpoints[selectedEndpoint] && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Request Body</h4>
                            <div className="bg-zinc-950 text-zinc-50 p-3 rounded-md overflow-auto">
                              <pre className="text-xs">{JSON.stringify(sampleEndpoints[selectedEndpoint].requestBody, null, 2)}</pre>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium mb-2">Response</h4>
                          <div className="bg-zinc-950 text-zinc-50 p-3 rounded-md overflow-auto">
                            <pre className="text-xs">{JSON.stringify(sampleEndpoints[selectedEndpoint].response, null, 2)}</pre>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Code Example</h4>
                          <Tabs defaultValue={selectedLanguage}>
                            <TabsList>
                              <TabsTrigger value="javascript" onClick={() => setSelectedLanguage('javascript')}>JavaScript</TabsTrigger>
                              <TabsTrigger value="python" onClick={() => setSelectedLanguage('python')}>Python</TabsTrigger>
                              <TabsTrigger value="curl" onClick={() => setSelectedLanguage('curl')}>cURL</TabsTrigger>
                            </TabsList>
                            <TabsContent value={selectedLanguage} className="mt-2">
                              <div className="bg-zinc-950 text-zinc-50 p-3 rounded-md">
                                <pre className="text-xs whitespace-pre-wrap font-mono">{codeSnippets[selectedEndpoint][selectedLanguage]}</pre>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="vaults">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <BoxSelect className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Vault Endpoints</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/vaults</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">List all vaults</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/vaults</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Create a new vault</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Get vault details</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">PATCH</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Update vault</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">DELETE</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Delete vault</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Security Endpoints</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/auth/verify</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Verify wallet signature</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/auth/nonce</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Get authentication nonce</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}/signatures/add</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Add signature to multi-sig vault</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}/verification</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Verify vault integrity</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="assets">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Asset Management Endpoints</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}/assets</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">List assets in vault</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}/withdraw</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Withdraw assets from vault</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/vaults/{"{id}"}/transactions</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">List vault transactions</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="webhooks">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Webhook className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Webhook Endpoints</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/webhooks</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">List registered webhooks</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/webhooks</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Register new webhook</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">DELETE</span>
                              <code className="font-mono text-sm">/api/webhooks/{"{id}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Delete webhook</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="trinity-protocol">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Trinity Protocol Endpoints (In Development)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Trinity Protocol endpoints provide access to our 2-of-3 multi-chain consensus system across Arbitrum, Solana, and TON.
                        </p>
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/trinity/consensus/{"{vaultId}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Get consensus status across all chains</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/trinity/events/subscribe</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Subscribe to cross-chain vault events</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/trinity/circuit-breaker/{"{vaultId}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Check circuit breaker status</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/trinity/circuit-breaker/{"{vaultId}"}/reset</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Reset circuit breaker with multi-sig</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/trinity/state-sync/{"{vaultId}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Verify state synchronization</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/trinity/proof/verify</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Verify cross-chain proof</span>
                          </li>
                        </ul>
                        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-purple-800 dark:text-purple-300">
                            <strong>Note:</strong> Trinity Protocol endpoints are currently in development. WebSocket support for real-time event streaming will be available in the next release.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="cross-chain">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Cross-Chain Operations</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/cross-chain-operations</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">List all cross-chain operations</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/cross-chain-operations</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Create cross-chain operation</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/vault-verification/verify</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Verify vault across chains</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/bridge/status</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Get bridge status</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="defi">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">DeFi Operations</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/defi/swap/routes</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Find optimal swap routes</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/defi/swap/price</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Get real-time swap price</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/defi/swap/create</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Create atomic swap order</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/defi/staking/pools</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">List staking pools</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="advanced-security">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Key className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Advanced Security (ZK, Quantum, Multi-Sig)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/security/zk-proofs/ownership</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Generate ZK proof of ownership</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/security/zk-proofs/verify</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Verify ZK proof</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/security/quantum/keypair</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Generate quantum-resistant keypair</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/security/quantum/encrypt</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Encrypt with CRYSTALS-Kyber</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GET</span>
                              <code className="font-mono text-sm">/api/security/vaults/{"{vaultId}"}/signers</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Get multi-sig signers</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/security/approval-requests</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Create approval request</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="wallet">
                      <AccordionTrigger className="hover:bg-slate-100 dark:hover:bg-slate-900/50 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Wallet Management</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <ul className="space-y-2 py-2">
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/wallet/connect/{"{chain}"}</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Connect wallet to chain</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/wallet/deposit</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Deposit to vault</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/wallet/withdraw</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Withdraw from vault</span>
                          </li>
                          <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">POST</span>
                              <code className="font-mono text-sm">/api/wallet/verify-signature</code>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Verify wallet signature</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-500" />
                  Example Scenarios
                </CardTitle>
                <CardDescription>
                  Complete examples for common integration scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">1. Creating a Time-Locked Vault</h3>
                    <div className="rounded-lg p-6 border">
                      <p className="mb-4">
                        This example demonstrates creating a vault that will unlock at a specific time in the future.
                        Perfect for savings plans or scheduled releases of assets.
                      </p>
                      <Tabs defaultValue="javascript">
                        <TabsList>
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>
                        <TabsContent value="javascript" className="mt-4">
                          <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                            <pre>{`import { ChronosVaultClient } from '@chronos-vault/sdk';

// Initialize client with API key
const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

async function createTimeLockVault() {
  try {
    // Calculate unlock date (1 year from now)
    const unlockDate = new Date();
    unlockDate.setFullYear(unlockDate.getFullYear() + 1);
    
    // Create the time-locked vault
    const vault = await client.vaults.create({
      name: "1-Year Savings Vault",
      description: "Assets locked for 1 year",
      type: "time-lock",
      lockUntil: unlockDate,
      chains: ["ethereum", "ton"],  // Enable both chains for this vault
      features: {
        quantumResistant: true,
        crossChainVerification: true,
        multiSignature: false
      },
      security: {
        verificationLevel: "advanced",
        requireMultiSignature: false,
        timeDelay: 0  // No time delay needed since we have a lock date
      }
    });
    
    console.log("Vault created successfully:");
    console.log("Vault ID:", vault.id);
    console.log("Ethereum deposit address:", vault.depositAddresses.ethereum);
    console.log("TON deposit address:", vault.depositAddresses.ton);
    console.log("Unlock date:", vault.lockUntil);
    
    return vault;
  } catch (error) {
    console.error('Error creating time-locked vault:', error);
  }
}

// Execute the function
createTimeLockVault();`}</pre>
                          </div>
                        </TabsContent>
                        <TabsContent value="python" className="mt-4">
                          <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                            <pre>{`from chronos_vault_sdk import ChronosVaultClient
from datetime import datetime, timezone, timedelta

# Initialize client with API key
client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='production'
)

def create_time_lock_vault():
    try:
        # Calculate unlock date (1 year from now)
        unlock_date = datetime.now(timezone.utc) + timedelta(days=365)
        
        # Create the time-locked vault
        vault = client.vaults.create({
            'name': '1-Year Savings Vault',
            'description': 'Assets locked for 1 year',
            'type': 'time-lock',
            'lockUntil': unlock_date,
            'chains': ['ethereum', 'ton'],  # Enable both chains for this vault
            'features': {
                'quantumResistant': True,
                'crossChainVerification': True,
                'multiSignature': False
            },
            'security': {
                'verificationLevel': 'advanced',
                'requireMultiSignature': False,
                'timeDelay': 0  # No time delay needed since we have a lock date
            }
        })
        
        print("Vault created successfully:")
        print(f"Vault ID: {vault['id']}")
        print(f"Ethereum deposit address: {vault['depositAddresses']['ethereum']}")
        print(f"TON deposit address: {vault['depositAddresses']['ton']}")
        print(f"Unlock date: {vault['lockUntil']}")
        
        return vault
    except Exception as e:
        print(f"Error creating time-locked vault: {e}")

# Execute the function
if __name__ == "__main__":
    create_time_lock_vault()`}</pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">2. Multi-Signature Vault with Inheritance</h3>
                    <div className="rounded-lg p-6 border">
                      <p className="mb-4">
                        This example demonstrates creating a multi-signature vault with inheritance capabilities.
                        This setup requires multiple approvals for withdrawals and includes beneficiary settings.
                      </p>
                      
                      <Tabs defaultValue="javascript">
                        <TabsList>
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>
                        <TabsContent value="javascript" className="mt-4">
                          <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                            <pre>{`import { ChronosVaultClient } from '@chronos-vault/sdk';

// Initialize client with API key
const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

async function createMultiSigVaultWithInheritance() {
  try {
    // Create the multi-signature vault with inheritance settings
    const vault = await client.vaults.create({
      name: "Family Trust Vault",
      description: "Requires 2 of 3 signatures for withdrawal, with inheritance settings",
      type: "multi-signature",
      chains: ["ethereum", "bitcoin"],
      features: {
        quantumResistant: true,
        crossChainVerification: true,
        multiSignature: true
      },
      security: {
        verificationLevel: "maximum",
        requireMultiSignature: true,
        timeDelay: 86400, // 24-hour delay for added security
        requiredSignatures: 2,  // Require 2 signatures
        totalSigners: 3  // Out of 3 total signers
      },
      signers: [
        { 
          address: "0xYourPrimaryAddress", 
          chain: "ethereum",
          weight: 1,
          name: "Primary Owner"
        },
        { 
          address: "0xFamilyMember1Address", 
          chain: "ethereum",
          weight: 1,
          name: "Family Member 1"
        },
        { 
          address: "0xFamilyMember2Address", 
          chain: "ethereum",
          weight: 1,
          name: "Family Member 2"
        }
      ],
      inheritance: {
        enabled: true,
        beneficiaries: [
          {
            address: "0xBeneficiaryAddress",
            chain: "ethereum",
            share: 100, // Percentage (100%)
            name: "Primary Beneficiary",
            relationshipProof: "legal-document"
          }
        ],
        activationConditions: {
          inactivityPeriod: 31536000, // 1 year of inactivity in seconds
          requireLegalDocuments: true
        }
      }
    });
    
    console.log("Multi-Signature Vault with Inheritance created successfully:");
    console.log("Vault ID:", vault.id);
    console.log("Required signatures:", vault.security.requiredSignatures);
    console.log("Inactivity period for inheritance:", vault.inheritance.activationConditions.inactivityPeriod);
    
    return vault;
  } catch (error) {
    console.error('Error creating multi-signature vault with inheritance:', error);
  }
}

// Execute the function
createMultiSigVaultWithInheritance();`}</pre>
                          </div>
                        </TabsContent>
                        <TabsContent value="python" className="mt-4">
                          <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                            <pre>{`from chronos_vault_sdk import ChronosVaultClient

# Initialize client with API key
client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='production'
)

def create_multisig_vault_with_inheritance():
    try:
        # Create the multi-signature vault with inheritance settings
        vault = client.vaults.create({
            'name': 'Family Trust Vault',
            'description': 'Requires 2 of 3 signatures for withdrawal, with inheritance settings',
            'type': 'multi-signature',
            'chains': ['ethereum', 'bitcoin'],
            'features': {
                'quantumResistant': True,
                'crossChainVerification': True,
                'multiSignature': True
            },
            'security': {
                'verificationLevel': 'maximum',
                'requireMultiSignature': True,
                'timeDelay': 86400,  # 24-hour delay for added security
                'requiredSignatures': 2,  # Require 2 signatures
                'totalSigners': 3  # Out of 3 total signers
            },
            'signers': [
                {
                    'address': '0xYourPrimaryAddress',
                    'chain': 'ethereum',
                    'weight': 1,
                    'name': 'Primary Owner'
                },
                {
                    'address': '0xFamilyMember1Address',
                    'chain': 'ethereum',
                    'weight': 1,
                    'name': 'Family Member 1'
                },
                {
                    'address': '0xFamilyMember2Address',
                    'chain': 'ethereum',
                    'weight': 1,
                    'name': 'Family Member 2'
                }
            ],
            'inheritance': {
                'enabled': True,
                'beneficiaries': [
                    {
                        'address': '0xBeneficiaryAddress',
                        'chain': 'ethereum',
                        'share': 100,  # Percentage (100%)
                        'name': 'Primary Beneficiary',
                        'relationshipProof': 'legal-document'
                    }
                ],
                'activationConditions': {
                    'inactivityPeriod': 31536000,  # 1 year of inactivity in seconds
                    'requireLegalDocuments': True
                }
            }
        })
        
        print("Multi-Signature Vault with Inheritance created successfully:")
        print(f"Vault ID: {vault['id']}")
        print(f"Required signatures: {vault['security']['requiredSignatures']}")
        print(f"Inactivity period for inheritance: {vault['inheritance']['activationConditions']['inactivityPeriod']}")
        
        return vault
    except Exception as e:
        print(f"Error creating multi-signature vault with inheritance: {e}")

# Execute the function
if __name__ == "__main__":
    create_multisig_vault_with_inheritance()`}</pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">3. Setting Up Webhook Notifications</h3>
                    <div className="rounded-lg p-6 border">
                      <p className="mb-4">
                        This example demonstrates how to set up webhook notifications to monitor your vaults
                        for specific events like deposits, withdrawals, and security alerts.
                      </p>
                      
                      <Tabs defaultValue="javascript">
                        <TabsList>
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>
                        <TabsContent value="javascript" className="mt-4">
                          <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                            <pre>{`import { ChronosVaultClient } from '@chronos-vault/sdk';

// Initialize client with API key
const client = new ChronosVaultClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

async function setupWebhookNotifications() {
  try {
    // Set up webhook for all vault events
    const allEventsWebhook = await client.webhooks.create({
      url: "https://your-server.com/webhook/vault-events",
      events: ["*"], // Subscribe to all events
      description: "All vault events webhook",
      active: true,
      secret: "your-webhook-secret" // Used to verify webhook payloads
    });
    
    console.log("All events webhook created:", allEventsWebhook.id);
    
    // Set up webhook specifically for security events
    const securityWebhook = await client.webhooks.create({
      url: "https://your-server.com/webhook/security-alerts",
      events: [
        "vault.security.unauthorized_access",
        "vault.security.verification_failed",
        "vault.security.signature_added",
        "vault.security.delay_triggered"
      ],
      description: "Security events webhook",
      active: true,
      secret: "your-security-webhook-secret"
    });
    
    console.log("Security webhook created:", securityWebhook.id);
    
    // Set up webhook for a specific vault
    const vaultId = "v_1a2b3c4d5e6f"; // Replace with your vault ID
    
    const specificVaultWebhook = await client.webhooks.create({
      url: "https://your-server.com/webhook/specific-vault",
      events: [
        "vault.deposit",
        "vault.withdrawal",
        "vault.modification"
      ],
      vaultId: vaultId, // Only events for this specific vault
      description: "Specific vault events webhook",
      active: true,
      secret: "your-specific-vault-webhook-secret"
    });
    
    console.log("Specific vault webhook created:", specificVaultWebhook.id);
    
    // List all registered webhooks
    const webhooks = await client.webhooks.list();
    console.log("Total registered webhooks:", webhooks.length);
    
    return {
      allEventsWebhook,
      securityWebhook,
      specificVaultWebhook,
      allWebhooks: webhooks
    };
  } catch (error) {
    console.error('Error setting up webhook notifications:', error);
  }
}

// Execute the function
setupWebhookNotifications();`}</pre>
                          </div>
                        </TabsContent>
                        <TabsContent value="python" className="mt-4">
                          <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md font-mono text-sm overflow-auto">
                            <pre>{`from chronos_vault_sdk import ChronosVaultClient

# Initialize client with API key
client = ChronosVaultClient(
    api_key='YOUR_API_KEY',
    environment='production'
)

def setup_webhook_notifications():
    try:
        # Set up webhook for all vault events
        all_events_webhook = client.webhooks.create({
            'url': 'https://your-server.com/webhook/vault-events',
            'events': ['*'],  # Subscribe to all events
            'description': 'All vault events webhook',
            'active': True,
            'secret': 'your-webhook-secret'  # Used to verify webhook payloads
        })
        
        print(f"All events webhook created: {all_events_webhook['id']}")
        
        # Set up webhook specifically for security events
        security_webhook = client.webhooks.create({
            'url': 'https://your-server.com/webhook/security-alerts',
            'events': [
                'vault.security.unauthorized_access',
                'vault.security.verification_failed',
                'vault.security.signature_added',
                'vault.security.delay_triggered'
            ],
            'description': 'Security events webhook',
            'active': True,
            'secret': 'your-security-webhook-secret'
        })
        
        print(f"Security webhook created: {security_webhook['id']}")
        
        # Set up webhook for a specific vault
        vault_id = 'v_1a2b3c4d5e6f'  # Replace with your vault ID
        
        specific_vault_webhook = client.webhooks.create({
            'url': 'https://your-server.com/webhook/specific-vault',
            'events': [
                'vault.deposit',
                'vault.withdrawal',
                'vault.modification'
            ],
            'vaultId': vault_id,  # Only events for this specific vault
            'description': 'Specific vault events webhook',
            'active': True,
            'secret': 'your-specific-vault-webhook-secret'
        })
        
        print(f"Specific vault webhook created: {specific_vault_webhook['id']}")
        
        # List all registered webhooks
        webhooks = client.webhooks.list()
        print(f"Total registered webhooks: {len(webhooks)}")
        
        return {
            'all_events_webhook': all_events_webhook,
            'security_webhook': security_webhook,
            'specific_vault_webhook': specific_vault_webhook,
            'all_webhooks': webhooks
        }
    except Exception as e:
        print(f"Error setting up webhook notifications: {e}")

# Execute the function
if __name__ == "__main__":
    setup_webhook_notifications()`}</pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rest">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-indigo-500" />
                  REST API Integration
                </CardTitle>
                <CardDescription>
                  Chronos Vault uses standard REST API - no proprietary SDK needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 border border-indigo-100 dark:from-indigo-950/20 dark:to-cyan-950/20 dark:border-indigo-900/50">
                    <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">100% Standard REST API</h3>
                    <p className="text-lg mb-4">
                      There is <strong>NO proprietary SDK package</strong> to install. Chronos Vault is built on standard REST API architecture, 
                      allowing you to integrate using any HTTP client library in your preferred programming language.
                    </p>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">⚠️ No SDK Installation Required</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Packages like @chronos-vault/sdk or chronos-vault-sdk do NOT exist. 
                        Use standard HTTP clients (fetch, axios, requests, etc.) to call our REST API endpoints directly.
                      </p>
                    </div>
                    
                    <h4 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Use Standard HTTP Clients</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                        <h5 className="font-medium mb-2">JavaScript / TypeScript</h5>
                        <div className="bg-zinc-950 text-zinc-50 p-2 rounded-md font-mono text-xs">
                          <code>fetch(), axios, got</code>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                        <h5 className="font-medium mb-2">Python</h5>
                        <div className="bg-zinc-950 text-zinc-50 p-2 rounded-md font-mono text-xs">
                          <code>requests, httpx, aiohttp</code>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                        <h5 className="font-medium mb-2">Go</h5>
                        <div className="bg-zinc-950 text-zinc-50 p-2 rounded-md font-mono text-xs">
                          <code>net/http, resty</code>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                        <h5 className="font-medium mb-2">Java</h5>
                        <div className="bg-zinc-950 text-zinc-50 p-2 rounded-md font-mono text-xs">
                          <code>HttpClient, OkHttp</code>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg p-6 border bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                      <div className="flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 text-indigo-500" fill="currentColor">
                          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
                        </svg>
                        <h3 className="text-xl font-semibold">JavaScript / TypeScript</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Standard fetch() API</h4>
                          <div className="bg-zinc-950 text-zinc-50 p-3 rounded-md font-mono text-sm">
                            <pre>{`// No installation needed - use fetch()
const res = await fetch('/api/vaults', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});
const data = await res.json();`}</pre>
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button asChild variant="default" className="w-full bg-indigo-500 hover:bg-indigo-600">
                            <Link href="/integration-guide">
                              <span className="flex items-center justify-center gap-2">
                                View REST API Integration Guide
                                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.7761 3 12 3.22386 12 3.5L12 9C12 9.27614 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.27614 11 9L11 4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-6 border bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20">
                      <div className="flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-500" fill="currentColor">
                          <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07l.01-.13.05-.19.07-.24.11-.28.15-.28.19-.27.22-.25.25-.2.28-.17.3-.12.3-.08.33-.04.35.01zM8.15 14.77l.01 2.22.3.31c.32.04.64.06.98.06.33 0 .66-.01.98-.05l.3-.02.01-2.22-.3-.02c-.32-.04-.64-.06-.98-.06-.33 0-.66.01-.98.05z"/>
                        </svg>
                        <h3 className="text-xl font-semibold">Python</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Standard requests library</h4>
                          <div className="bg-zinc-950 text-zinc-50 p-3 rounded-md font-mono text-sm">
                            <pre>{`# pip install requests
import requests

res = requests.get('/api/vaults',
    headers={
        'Authorization': f'Bearer {token}'
    }
)
data = res.json()`}</pre>
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button asChild variant="default" className="w-full bg-indigo-500 hover:bg-indigo-600">
                            <Link href="/integration-guide">
                              <span className="flex items-center justify-center gap-2">
                                View REST API Integration Guide
                                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.7761 3 12 3.22386 12 3.5L12 9C12 9.27614 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.27614 11 9L11 4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-900/50">
                    <h4 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Authentication Flow</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      All authentication is wallet-based (MetaMask, Phantom, TON Keeper):
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>GET /api/auth/nonce - Get authentication nonce</li>
                      <li>Sign message with wallet (contains nonce)</li>
                      <li>POST /api/auth/verify - Verify signature, receive JWT token</li>
                      <li>Use JWT token in Authorization header for all API calls</li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 pt-4">
                    <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                      <Link href="/integration-guide">
                        Complete Integration Guide with Code Examples
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="#endpoints">
                        Browse API Endpoints Reference
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-lg p-6 border bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20">
                      <div className="flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 text-orange-500" fill="currentColor">
                          <path d="M0 11.865v.598h12.539v-.598H0zm13.809-4.195v.598h6.12v-.598h-6.12zM0 7.67v.598h24v-.598H0zm13.809 4.195v.598H24v-.598h-10.191zM0 16.06v.598h7.275v-.598H0zm8.545 0v.598H24v-.598H8.545z" />
                        </svg>
                        <h3 className="text-xl font-semibold">Go</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Standard net/http</h4>
                          <div className="bg-zinc-950 text-zinc-50 p-2 rounded-md font-mono text-xs">
                            <code>import "net/http"</code>
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/integration-guide">
                              View Integration Guide
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-6 border bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
                      <div className="flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 text-red-500" fill="currentColor">
                          <path d="M9.585 11.692h4.328s2.432.039 2.432-2.35V5.391S16.714 3 14.312 3H7.871s-2.272.039-2.272 2.211v4.123s-.039 1.911 1.601 2.203c0 0 .741.154 1.231-.309l.778-.894s.308-.35.308.195v6.828s-.039 2.115 2.003 2.115h2.43s1.602.039 1.602-1.601v-1.68s.039-1.328 1.601-1.328h2.509s1.563-.039 1.563-1.641v-1.131s.039-1.522-1.681-1.522h-3.083s-1.72-.195-1.72-1.601v-2.313s.039-1.403 1.72-1.403h3.007s1.403-.039 1.403 1.403v1.169s.117 1.169 1.169 1.169h3.007s1.325-.039 1.325-1.403V5.508s.156-2.508-2.547-2.508h-6.373s-2.742-.234-2.742 2.742v3.322s-.078 2.627-2.431 2.627z" />
                        </svg>
                        <h3 className="text-xl font-semibold">Java</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Installation</h4>
                          <div className="bg-zinc-950 text-zinc-50 p-3 rounded-md font-mono text-sm">
                            <pre>{`<dependency>
    <groupId>org.chronosvault</groupId>
    <artifactId>chronos-vault-sdk</artifactId>
    <version>1.0.0</version>
</dependency>`}</pre>
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/documentation/sdk">
                              <span className="flex items-center justify-center gap-2">
                                View Java SDK Documentation
                                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.7761 3 12 3.22386 12 3.5L12 9C12 9.27614 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.27614 11 9L11 4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-6 border bg-gradient-to-br from-stone-50/50 to-orange-50/50 dark:from-stone-950/20 dark:to-orange-950/20">
                      <div className="flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 text-stone-500" fill="currentColor">
                          <path d="M23.1138 15.864s-1.4601 1.4372-3.6912 1.4372c-2.3351 0-3.9663-1.5264-3.9663-3.6213 0-2.6102 1.8492-3.4895 3.4123-3.4895.9201 0 1.4831.2623 1.4831.2623l.3165-.5433s-.8741-.6792-2.5041-.6792c-1.9182 0-4.4723 1.1241-4.4723 4.6321 0 2.3351 1.5264 4.1905 4.1905 4.1905 1.7591 0 3.09-.8287 3.2677-.9646.0216-.0174.0467-.0057.0512.0241l.2232.8816c.0057.0256-.0135.0362-.0362.0362-.292.0057-1.0339.1912-1.6778.3456.0045-.0107.0506-1.5193.0506-1.5193l-3.4925.0107-.0107 4.8767c0 .0249-.0249.0348-.0442.0196-.2131-.1733-1.0213-.7743-1.3388-1.2447-.045-.0682-.0158-.116.039-.1196l.9646-.0569c.0398-.24.282-1.6759.282-1.6759l-4.0639.0107s.2513 1.4372.2773 1.6656l1.0155.078c.0512.0041.0789.0467.0513.0911-.2131.341-1.5553 2.0957-2.5886 2.0957-1.0282 0-1.5553-.724-1.5553-1.7599 0-.7757.3214-1.5661.3214-1.5661l-1.6541-.7065s-.3922.9659-.3922 2.1673c0 1.7557.9246 2.856 2.6903 2.856 1.8932 0 3.2427-1.3808 3.9003-2.0769.1022-.1078.1648-.0442.1368.0743l-.2383 1.0368c-.221.0952-.0452.0569-.1045.0911-.6089.3456-1.6047.7704-2.765.7704-2.7443 0-4.4629-1.9297-4.4629-4.8406 0-3.0906 2.0508-5.9827 5.687-5.9827 3.3153 0 4.4584 1.8048 4.4584 1.8048l.7306-1.319s-.1648-.2939-1.0328-.8514c-.8679-.5532-1.9404-.7973-1.9404-.7973l.4047-1.9155c.0174-.0823-.0362-.1252-.1024-.0983l-1.9155.7973c-.0823.0343-.1185-.0107-.1185-.0849V4.8349c0-.0849-.0407-.0983-.1128-.0569l-2.0409 1.2095c-.0664.0398-.1209.0197-.1209-.0512v-.5687c0-.0712-.0432-.085-.0903-.0362l-1.9594 2.0131c-.047.0489-.1033.0376-.1252-.0208l-.5823-1.6301c-.0219-.0609-.0712-.0609-.1045 0l-.9905 1.8064c-.0333.0609-.0939.0569-.1272 0l-.9327-1.6323c-.0332-.0569-.0823-.0569-.1057 0l-.5714 1.324c-.0233.0569-.0801.0657-.1252.0192l-1.2069-1.2447c-.0451-.047-.085-.0332-.085.0253v1.0203c0 .0609-.0427.0772-.0952.0398l-1.2845-.8978c-.0514-.0362-.0991-.0135-.0991.0473l-.0341 3.09c-.45.0609-.0558.0549-.1097.0057L2.8426 7.2582c-.054-.0489-.1009-.0292-.1009.0429v.5167c0 .0712-.0381.0903-.0892.0406l-1.6048-1.533c-.0512-.0489-.0916-.0312-.0916.0398v.8538c0 .0712-.0362.0971-.085.0569l-1.7373-.85c-.0063-.0031-.0136-.0041-.0203-.0031.0012.0073.0031.0143.0031.0219 0 2.4925 1.764 4.3851 3.9953 4.3851 1.0358 0 1.979-.4074 2.7097-1.0727.0733-.0657.1335-.0359.1335.064v3.4865c0 .0989-.0626.1304-.1368.0644-.8431-.7414-1.9429-1.1958-3.1439-1.1958-2.6538 0-4.8064 2.2212-4.8064 4.9572C.0001 20.1677 2.1527 22.4 4.8065 22.4c2.6538 0 4.8064-2.2323 4.8064-4.9684 0-.4367-.0615-.8588-.1715-1.2618-.0267-.0963.0045-.1372.0801-.0903l1.1656.7236c.0752.047.0983-.88.0501-.1185l-2.4641-1.5392c-.0489-.0295-.0458-.086.0063-.1262l2.4234-1.8752c.0512-.0398.0349-.0932-.0358-.1176l-3.1563-1.0613c-.0714-.0239-.0704-.0762.0023-.1176l3.3105-1.8773c.0733-.0415.0628-.0916-.0219-.1124l-2.2349-.5476c-.085-.0209-.091-.0717-.0107-.113l2.1447-1.1086c.0801-.0415.0747-.0952-.0107-.1172l-1.1229-.2939c-.0862-.0226-.0887-.0747-.0045-.1172l.9423-.4754c.0837-.0429.0857-.095.0056-.1172l-.5973-.166c-.079-.0219-.0699-.0783.0209-.1245l.723-.3669c.0908-.0461.1039-.0893.0294-.0952l-2.2349-.1632c-.0733-.0056-.0762-.0512-.0045-.1015l2.9035-2.0607c.0712-.051.0407-.1132-.0663-.1372l-1.4452-.3214c-.1069-.0239-.1192-.0693-.0262-.1002L16.2622.1001c.0937-.0316.1215.45.0609.0947l-3.09 2.5468c-.0601.0489-.0219.0747.0848.0569l2.2774-.3669c.1093-.0167.1317.174.0483.076l-4.8011 3.3574c-.0834.0589-.0719.0939.0262.0786l4.8011-.7413c.0975-.0157.1304.0174.0722.0732l-3.0662 2.9035c-.0582.0555-.0384.0834.0438.0624l2.53-.6596c.0821-.0215.111.0093.0633.0676l-2.2887 2.8198c-.048.0589-.0227.0862.0562.0611l1.3249-.4142c.0788-.0246.1107.0088.0717.073l-1.8932 3.1281c-.0395.0646-.0127.0909.0597.0577l2.8647-1.2664c.0721-.032.0989.0063.0586.0857l-1.9182 3.7725c-.0398.078.0013.0932.0903.0355l3.5259-2.3114c.0887-.0582.1277-.0284.0871.0654l-.8316 1.9155c-.0407.0939.0107.1141.1141.0452l1.7006-1.1305c.1041-.069.1612-.0474.1273.0454-.463.126-1.9453 4.8132-1.9453 4.8132-.0339.0926.0022.1233.0875.069l1.0577-.6739c.0862-.0549.1401-.0295.1209.0549l-.6109 2.765c-.18.0844.0479.1223.1465.0844l.5297-.2031c.0985-.0382.1592-.0107.1344.0616l-.4343 1.2572c-.0248.0718.0292.1193.121.1073l2.463-.3317c.0911-.0123.1329-.0845.0936-.1598l-2.3339-4.4428c-.0393-.075-.0044-.0911.0771-.0362l3.4124 2.3294c.0822.056.1484.0306.1469-.0565l-.0106-6.0566c-.0011-.0873.042-.1206.0938-.0745l2.4772 2.1785c.0514.0454.1184.0334.1481-.0256l.9659-1.9025c.0302-.0589.0928-.0591.1265-.0007l1.2276 1.9202c.0339.0583.0981.065.1429.0161l1.1958-1.3069c.0446-.0487.1064-.0399.1368.0196l.98 1.9032c.0305.0592.0942.0599.1426.0016l3.6033-4.339c.0482-.0582.1241-.0525.1669.0141l.7299 1.1131c.0424.0669.1136.0764.1545.0226l.3466-.4484c.0411-.0538.1148-.0459.1637.0162l.9007 1.1415c.0486.0616.1165.0602.1488-.0034l.3163-.6228c.0321-.0636.1012-.079.1535-.0334l.9303.8164c.0526.0462.124.0221.1594-.0528l.7138-1.5174c.0355-.0752.1109-.088.1669-.0273l.3543.3846c.0557.0601.1375.0516.1798-.0198z"/>
                        </svg>
                        <h3 className="text-xl font-semibold">Rust</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Installation</h4>
                          <div className="bg-zinc-950 text-zinc-50 p-3 rounded-md font-mono text-sm">
                            cargo add chronos-vault-sdk
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/documentation/sdk">
                              <span className="flex items-center justify-center gap-2">
                                View Rust SDK Documentation
                                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.7761 3 12 3.22386 12 3.5L12 9C12 9.27614 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.27614 11 9L11 4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold mb-2">API Client Libraries</h3>
                      <p className="text-muted-foreground">
                        View comprehensive documentation for all SDK libraries
                      </p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                        <Link href="/documentation/sdk">Complete SDK Documentation</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/integration-examples">See Integration Examples</Link>
                      </Button>
                    </div>
                  </div>
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