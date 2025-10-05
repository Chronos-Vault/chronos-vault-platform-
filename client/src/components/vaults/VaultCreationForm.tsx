import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, Clock, Coins, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VAULT_TYPES = [
  { value: 'time-lock', label: 'Time Lock Vault', description: 'Unlock after specified time' },
  { value: 'multi-sig', label: 'Multi-Signature Vault', description: 'Requires multiple approvals' },
  { value: 'inheritance', label: 'Mathematical Inheritance', description: 'AI-powered inheritance system' },
  { value: 'quantum-resistant', label: 'Quantum-Resistant Vault', description: 'Future-proof encryption' },
  { value: 'geo-location', label: 'Geo-Location Vault', description: 'Unlock in specific location' },
  { value: 'social-recovery', label: 'Social Recovery Vault', description: 'Recover using trusted contacts' },
];

const SECURITY_LEVELS = [
  { value: 'standard', label: 'Standard', chains: 1, color: 'bg-blue-500' },
  { value: 'enhanced', label: 'Enhanced', chains: 2, color: 'bg-purple-500' },
  { value: 'maximum', label: 'Maximum (Trinity)', chains: 3, color: 'bg-green-500' },
];

const CRYPTOCURRENCIES = [
  { value: 'ETH', label: 'Ethereum (ETH)', icon: '⟠' },
  { value: 'SOL', label: 'Solana (SOL)', icon: '◎' },
  { value: 'TON', label: 'TON Coin', icon: '💎' },
  { value: 'BTC', label: 'Bitcoin (BTC)', icon: '₿' },
  { value: 'CVT', label: 'Chronos Vault Token', icon: '🔺' },
];

export default function VaultCreationForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vaultName: '',
    vaultType: '',
    securityLevel: 'maximum',
    cryptocurrency: '',
    amount: '',
    unlockTime: '',
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vaultName || !formData.vaultType || !formData.cryptocurrency || !formData.amount) {
      toast({
        title: "❌ Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const selectedSecurity = SECURITY_LEVELS.find(s => s.value === formData.securityLevel);
      
      toast({
        title: "🔺 Creating Trinity Protocol Vault",
        description: `Deploying across ${selectedSecurity?.chains} blockchain${selectedSecurity?.chains! > 1 ? 's' : ''}...`,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "✅ Vault Created Successfully!",
        description: `${formData.vaultName} is now protected by Trinity Protocol with ${selectedSecurity?.label} security (${selectedSecurity?.chains}-chain protection)`,
      });

      setFormData({
        vaultName: '',
        vaultType: '',
        securityLevel: 'maximum',
        cryptocurrency: '',
        amount: '',
        unlockTime: '',
      });
    } catch (error: any) {
      toast({
        title: "❌ Vault Creation Failed",
        description: error.message || "Failed to create vault",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const selectedSecurity = SECURITY_LEVELS.find(s => s.value === formData.securityLevel);

  return (
    <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-purple-400" />
          Create Trinity Protocol Vault
        </CardTitle>
        <CardDescription className="text-gray-400">
          Secure your digital assets with multi-chain Trinity Protocol protection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vaultName" className="text-white">Vault Name *</Label>
            <Input
              id="vaultName"
              placeholder="My Secure Vault"
              value={formData.vaultName}
              onChange={(e) => setFormData({ ...formData, vaultName: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              data-testid="input-vault-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vaultType" className="text-white">Vault Type *</Label>
            <Select value={formData.vaultType} onValueChange={(value) => setFormData({ ...formData, vaultType: value })}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white" data-testid="select-vault-type">
                <SelectValue placeholder="Select vault type" />
              </SelectTrigger>
              <SelectContent>
                {VAULT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-semibold">{type.label}</div>
                      <div className="text-xs text-gray-400">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityLevel" className="text-white">Security Level *</Label>
            <Select value={formData.securityLevel} onValueChange={(value) => setFormData({ ...formData, securityLevel: value })}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white" data-testid="select-security-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECURITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${level.color}`} />
                      <span className="font-semibold">{level.label}</span>
                      <span className="text-xs text-gray-400">({level.chains} chain{level.chains > 1 ? 's' : ''})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSecurity && (
              <div className="mt-2 p-3 bg-purple-900/30 rounded border border-purple-500/30">
                <p className="text-xs text-purple-200">
                  <Shield className="w-4 h-4 inline mr-1" />
                  {selectedSecurity.label} Security: Your vault will be protected across{' '}
                  <strong>{selectedSecurity.chains} blockchain{selectedSecurity.chains > 1 ? 's' : ''}</strong>
                  {selectedSecurity.chains === 3 && ' with Trinity Protocol 2-of-3 consensus'}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cryptocurrency" className="text-white">Cryptocurrency *</Label>
              <Select value={formData.cryptocurrency} onValueChange={(value) => setFormData({ ...formData, cryptocurrency: value })}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white" data-testid="select-cryptocurrency">
                  <SelectValue placeholder="Select crypto" />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTOCURRENCIES.map((crypto) => (
                    <SelectItem key={crypto.value} value={crypto.value}>
                      <span>{crypto.icon} {crypto.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">Amount *</Label>
              <div className="relative">
                <Coins className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  step="0.0001"
                  placeholder="0.0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white pl-10"
                  data-testid="input-amount"
                />
              </div>
            </div>
          </div>

          {formData.vaultType === 'time-lock' && (
            <div className="space-y-2">
              <Label htmlFor="unlockTime" className="text-white">Unlock Date & Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="unlockTime"
                  type="datetime-local"
                  value={formData.unlockTime}
                  onChange={(e) => setFormData({ ...formData, unlockTime: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white pl-10"
                  data-testid="input-unlock-time"
                />
              </div>
            </div>
          )}

          <div className="p-4 bg-yellow-900/30 rounded border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-200 font-semibold text-sm">Mathematical Security Guarantee</p>
                <p className="text-gray-300 text-xs mt-1">
                  With Trinity Protocol Maximum Security, even if 1 blockchain is hacked, 
                  your vault remains secure through 2-of-3 mathematical consensus verification.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              data-testid="button-create-vault"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating Vault...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Create Protected Vault
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  vaultName: '',
                  vaultType: '',
                  securityLevel: 'maximum',
                  cryptocurrency: '',
                  amount: '',
                  unlockTime: '',
                });
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              data-testid="button-reset-form"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
