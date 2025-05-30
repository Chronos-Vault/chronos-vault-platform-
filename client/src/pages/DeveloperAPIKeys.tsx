import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Key, Shield, Eye, EyeOff, Trash2, Plus, Users, Activity, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface APIKey {
  id: string;
  walletId: string;
  walletName: string;
  apiKey: string;
  apiSecret: string;
  permissions: string[];
  rateLimits: {
    requests_per_minute: number;
    burst_limit: number;
  };
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

interface APIKeyStats {
  totalKeys: number;
  activeKeys: number;
  totalRequests: number;
  requestsToday: number;
}

export default function DeveloperAPIKeys() {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [newKeyData, setNewKeyData] = useState({
    walletName: '',
    developerAddress: '',
    callback_url: '',
    requested_permissions: [] as string[]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch API keys
  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['/api/developer/api-keys'],
    retry: false,
  });

  // Fetch API statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/developer/stats'],
    retry: false,
  });

  // Create new API key mutation
  const createAPIKeyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/v1/wallet/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "API Key Created",
        description: "New API key has been generated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/developer/api-keys'] });
      queryClient.invalidateQueries({ queryKey: ['/api/developer/stats'] });
      setNewKeyData({
        walletName: '',
        developerAddress: '',
        callback_url: '',
        requested_permissions: []
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Revoke API key mutation
  const revokeAPIKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      return await apiRequest(`/api/developer/api-keys/${keyId}/revoke`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "API Key Revoked",
        description: "API key has been revoked successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/developer/api-keys'] });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  const toggleSecretVisibility = (keyId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handlePermissionToggle = (permission: string) => {
    setNewKeyData(prev => ({
      ...prev,
      requested_permissions: prev.requested_permissions.includes(permission)
        ? prev.requested_permissions.filter(p => p !== permission)
        : [...prev.requested_permissions, permission]
    }));
  };

  const availablePermissions = [
    'vault_creation',
    'transaction_monitoring',
    'security_alerts',
    'portfolio_optimization',
    'cross_chain_bridge',
    'webhook_management'
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Developer API Keys
        </h1>
        <p className="text-gray-600 mt-2">
          Manage API keys for wallet integrations with Chronos Vault Trinity Protocol
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total API Keys</p>
                <p className="text-2xl font-bold">{stats?.totalKeys || 0}</p>
              </div>
              <Key className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Keys</p>
                <p className="text-2xl font-bold text-green-600">{stats?.activeKeys || 0}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{stats?.totalRequests || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requests Today</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.requestsToday || 0}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Manage Keys</TabsTrigger>
          <TabsTrigger value="create">Create New Key</TabsTrigger>
          <TabsTrigger value="documentation">Integration Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>
                View and manage API keys for external wallet integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading API keys...</div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
                  <p className="text-gray-600 mb-4">Create your first API key to get started</p>
                  <Button onClick={() => document.querySelector('[data-state="active"][value="create"]')?.click()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key: APIKey) => (
                    <Card key={key.id} className="border-l-4 border-l-blue-600">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{key.walletName}</h3>
                            <p className="text-sm text-gray-600">Wallet ID: {key.walletId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={key.isActive ? "default" : "secondary"}>
                              {key.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revokeAPIKeyMutation.mutate(key.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium">API Key</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                type={showSecrets[key.id] ? "text" : "password"}
                                value={key.apiKey}
                                readOnly
                                className="font-mono text-sm"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleSecretVisibility(key.id)}
                              >
                                {showSecrets[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(key.apiKey, 'API Key')}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">API Secret</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                type={showSecrets[`${key.id}-secret`] ? "text" : "password"}
                                value={key.apiSecret}
                                readOnly
                                className="font-mono text-sm"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleSecretVisibility(`${key.id}-secret`)}
                              >
                                {showSecrets[`${key.id}-secret`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(key.apiSecret, 'API Secret')}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {key.permissions.map((permission) => (
                            <Badge key={permission} variant="outline">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Rate Limit</p>
                            <p className="font-medium">{key.rateLimits.requests_per_minute}/min</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Burst Limit</p>
                            <p className="font-medium">{key.rateLimits.burst_limit}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Created</p>
                            <p className="font-medium">{formatDate(key.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Usage Count</p>
                            <p className="font-medium">{key.usageCount || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New API Key</CardTitle>
              <CardDescription>
                Generate a new API key for wallet integration with Trinity Protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="walletName">Wallet Name</Label>
                  <Input
                    id="walletName"
                    placeholder="e.g., MetaWallet Pro"
                    value={newKeyData.walletName}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, walletName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developerAddress">Developer Address</Label>
                  <Input
                    id="developerAddress"
                    placeholder="0x..."
                    value={newKeyData.developerAddress}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, developerAddress: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="callbackUrl">Callback URL</Label>
                  <Input
                    id="callbackUrl"
                    placeholder="https://yourwallet.com/chronos-callback"
                    value={newKeyData.callback_url}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, callback_url: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission}
                        checked={newKeyData.requested_permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  API keys provide access to Chronos Vault's Trinity Protocol security infrastructure. 
                  Keep your API secret secure and never expose it in client-side code.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => createAPIKeyMutation.mutate(newKeyData)}
                disabled={createAPIKeyMutation.isPending || !newKeyData.walletName || !newKeyData.developerAddress}
                className="w-full"
              >
                {createAPIKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Documentation</CardTitle>
              <CardDescription>
                Quick start guide for integrating with Chronos Vault API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Authentication</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`curl -X POST https://api.chronosvault.org/v1/wallet/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "walletName": "YourWallet",
    "developerAddress": "0x...",
    "callback_url": "https://yourwallet.com/callback",
    "requested_permissions": ["vault_creation", "transaction_monitoring"]
  }'`}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Create User Session</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`curl -X POST https://api.chronosvault.org/v1/wallet/session \\
  -H "Authorization: Bearer {api_key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_address": "0x...",
    "wallet_signature": "0x...",
    "chain": "ethereum",
    "session_duration": 3600
  }'`}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Create Vault</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`curl -X POST https://api.chronosvault.org/v1/vault/create \\
  -H "Authorization: Bearer {session_token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "vault_type": "personal",
    "name": "My Secure Vault",
    "security_level": "maximum",
    "assets": [
      {
        "chain": "ethereum",
        "token_address": "0x...",
        "amount": "1000000000000000000"
      }
    ]
  }'`}
                </pre>
              </div>

              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  For complete API documentation, visit our developer portal at 
                  <span className="font-mono ml-1">https://docs.chronosvault.org/api</span>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}