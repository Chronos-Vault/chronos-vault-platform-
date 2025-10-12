import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Globe, Smartphone, Download, Code, Shield, 
  ChevronRight, Copy, CheckCircle, ArrowLeft,
  Terminal, Package, Zap, Lock, Settings
} from "lucide-react";
import { motion } from "framer-motion";

const SDKDocumentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const downloadSDK = (platform: 'ios' | 'android') => {
    const sdkData = {
      name: '@chronos-vault/mobile-sdk',
      version: '1.0.0',
      description: `Chronos Vault Mobile SDK for ${platform === 'ios' ? 'iOS' : 'Android'}`,
      main: 'ChronosVaultSDK.js',
      dependencies: {
        'react-native': '^0.73.0',
        'react-native-keychain': '^8.1.3',
        'react-native-biometrics': '^3.0.1',
        'react-native-encrypted-storage': '^4.0.3',
        '@solana/web3.js': '^1.87.6',
        'ethers': '^6.9.2',
        '@tonconnect/sdk': '^3.0.0'
      }
    };

    const link = document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + btoa(JSON.stringify(sdkData, null, 2));
    link.download = `chronos-vault-sdk-${platform}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-black to-[#0a0014] border-b border-[#6B00D7]/20">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10">
              <Smartphone className="w-8 h-8 text-[#FF5AF7]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white">
                Mobile SDK Documentation
              </h1>
              <p className="text-gray-400 mt-2">
                Integrate Chronos Vault security into your mobile applications
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => downloadSDK('ios')}
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#6B00D7]/50 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download iOS SDK
            </button>
            <button 
              onClick={() => downloadSDK('android')}
              className="bg-transparent border border-[#FF5AF7]/60 text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF5AF7]/10 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Android SDK
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Contents</h3>
              <nav className="space-y-2">
                {[
                  { id: 'installation', label: 'Installation', icon: Package },
                  { id: 'quickstart', label: 'Quick Start', icon: Zap },
                  { id: 'authentication', label: 'Authentication', icon: Lock },
                  { id: 'vault-management', label: 'Vault Management', icon: Shield },
                  { id: 'configuration', label: 'Configuration', icon: Settings },
                  { id: 'examples', label: 'Examples', icon: Code }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-[#FF5AF7] transition-colors py-2 px-3 rounded-lg hover:bg-[#6B00D7]/10"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Installation Section */}
            <section id="installation">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Package className="w-8 h-8 text-[#FF5AF7]" />
                Installation
              </h2>
              
              <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">NPM Installation</h3>
                <div className="relative">
                  <div className="bg-black/60 rounded-lg p-4 border border-[#6B00D7]/20 font-mono text-sm">
                    <code className="text-purple-400">npm install @chronos-vault/mobile-sdk</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npm install @chronos-vault/mobile-sdk', 'npm-install')}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCode === 'npm-install' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Required Dependencies</h3>
                <div className="relative">
                  <div className="bg-black/60 rounded-lg p-4 border border-[#6B00D7]/20 font-mono text-sm text-gray-300">
                    <div className="text-gray-500">// Required React Native dependencies</div>
                    <div className="text-purple-400">npm install react-native-keychain</div>
                    <div className="text-purple-400">npm install react-native-biometrics</div>
                    <div className="text-purple-400">npm install react-native-encrypted-storage</div>
                    <div className="text-purple-400">npm install @react-native-async-storage/async-storage</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`npm install react-native-keychain react-native-biometrics react-native-encrypted-storage @react-native-async-storage/async-storage`, 'dependencies')}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCode === 'dependencies' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Start Section */}
            <section id="quickstart">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-[#FF5AF7]" />
                Quick Start
              </h2>
              
              <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Basic Setup</h3>
                <div className="relative">
                  <div className="bg-black/60 rounded-lg p-4 border border-[#6B00D7]/20 font-mono text-sm text-gray-300 overflow-x-auto">
                    <div className="text-gray-500">// Import the SDK</div>
                    <div className="text-emerald-400">import ChronosVaultSDK from '@chronos-vault/mobile-sdk';</div>
                    <br />
                    <div className="text-gray-500">// Initialize with your configuration</div>
                    <div className="text-purple-400">const sdk = new ChronosVaultSDK({`{`}</div>
                    <div className="pl-4"><span className="text-yellow-400">apiEndpoint</span>: <span className="text-green-400">'https://api.chronosvault.com'</span>,</div>
                    <div className="pl-4"><span className="text-yellow-400">enableBiometrics</span>: <span className="text-blue-400">true</span>,</div>
                    <div className="pl-4"><span className="text-yellow-400">enableEncryption</span>: <span className="text-blue-400">true</span>,</div>
                    <div className="pl-4"><span className="text-yellow-400">debugMode</span>: <span className="text-blue-400">__DEV__</span></div>
                    <div className="text-purple-400">{`}`});</div>
                    <br />
                    <div className="text-gray-500">// Initialize and authenticate</div>
                    <div className="text-emerald-400">await sdk.initialize();</div>
                    <div className="text-emerald-400">const authenticated = await sdk.authenticate();</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`import ChronosVaultSDK from '@chronos-vault/mobile-sdk';

const sdk = new ChronosVaultSDK({
  apiEndpoint: 'https://api.chronosvault.com',
  enableBiometrics: true,
  enableEncryption: true,
  debugMode: __DEV__
});

await sdk.initialize();
const authenticated = await sdk.authenticate();`, 'quickstart')}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCode === 'quickstart' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </section>

            {/* Authentication Section */}
            <section id="authentication">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Lock className="w-8 h-8 text-[#FF5AF7]" />
                Authentication
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Biometric Authentication</h3>
                  <div className="relative">
                    <div className="bg-black/60 rounded-lg p-4 border border-[#6B00D7]/20 font-mono text-sm text-gray-300">
                      <div className="text-gray-500">// Authenticate with biometrics</div>
                      <div className="text-purple-400">const authenticateUser = async () {`=>`} {`{`}</div>
                      <div className="pl-4 text-yellow-400">try {`{`}</div>
                      <div className="pl-8 text-emerald-400">const result = await sdk.authenticate();</div>
                      <div className="pl-8 text-purple-400">if (result) {`{`}</div>
                      <div className="pl-12 text-gray-300">// User authenticated successfully</div>
                      <div className="pl-12 text-emerald-400">const vaults = await sdk.getVaults();</div>
                      <div className="pl-8 text-purple-400">{`}`}</div>
                      <div className="pl-4 text-yellow-400">{`} catch (error) {`}</div>
                      <div className="pl-8 text-red-400">console.error(&apos;Authentication failed:&apos;, error);</div>
                      <div className="pl-4 text-yellow-400">{`}`}</div>
                      <div className="text-purple-400">{`}`};</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`const authenticateUser = async () => {
  try {
    const result = await sdk.authenticate();
    if (result) {
      // User authenticated successfully
      const vaults = await sdk.getVaults();
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};`, 'auth')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === 'auth' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Vault Management Section */}
            <section id="vault-management">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-[#FF5AF7]" />
                Vault Management
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Create a Vault</h3>
                  <div className="relative">
                    <div className="bg-black/60 rounded-lg p-4 border border-[#6B00D7]/20 font-mono text-sm text-gray-300">
                      <div className="text-gray-500">// Create a new vault</div>
                      <div className="text-purple-400">const createVault = async () {`=>`} {`{`}</div>
                      <div className="pl-4 text-purple-400">const vaultConfig = {`{`}</div>
                      <div className="pl-8"><span className="text-yellow-400">name</span>: <span className="text-green-400">'My Mobile Vault'</span>,</div>
                      <div className="pl-8"><span className="text-yellow-400">type</span>: <span className="text-green-400">'personal'</span>,</div>
                      <div className="pl-8"><span className="text-yellow-400">assets</span>: [<span className="text-green-400">'ETH'</span>, <span className="text-green-400">'SOL'</span>, <span className="text-green-400">'TON'</span>],</div>
                      <div className="pl-8"><span className="text-yellow-400">securityLevel</span>: <span className="text-green-400">'enhanced'</span></div>
                      <div className="pl-4 text-purple-400">{`}`};</div>
                      <br />
                      <div className="pl-4 text-emerald-400">const vault = await sdk.createVault(vaultConfig);</div>
                      <div className="pl-4 text-gray-300">console.log('Vault created:', vault.id);</div>
                      <div className="text-purple-400">{`}`};</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`const createVault = async () => {
  const vaultConfig = {
    name: 'My Mobile Vault',
    type: 'personal',
    assets: ['ETH', 'SOL', 'TON'],
    securityLevel: 'enhanced'
  };
  
  const vault = await sdk.createVault(vaultConfig);
  console.log('Vault created:', vault.id);
};`, 'create-vault')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === 'create-vault' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Transfer Assets</h3>
                  <div className="relative">
                    <div className="bg-black/60 rounded-lg p-4 border border-[#6B00D7]/20 font-mono text-sm text-gray-300">
                      <div className="text-gray-500">// Transfer assets from vault</div>
                      <div className="text-purple-400">const transferAssets = async (vaultId) {`=>`} {`{`}</div>
                      <div className="pl-4 text-purple-400">const transferConfig = {`{`}</div>
                      <div className="pl-8"><span className="text-yellow-400">to</span>: <span className="text-green-400">'0x742d35Cc6634C0532925a3b8D46C0Ac5c2A4C0c0'</span>,</div>
                      <div className="pl-8"><span className="text-yellow-400">amount</span>: <span className="text-green-400">'0.1'</span>,</div>
                      <div className="pl-8"><span className="text-yellow-400">asset</span>: <span className="text-green-400">'ETH'</span>,</div>
                      <div className="pl-8"><span className="text-yellow-400">memo</span>: <span className="text-green-400">'Mobile transfer'</span></div>
                      <div className="pl-4 text-purple-400">{`}`};</div>
                      <br />
                      <div className="pl-4 text-emerald-400">const txId = await sdk.transfer(vaultId, transferConfig);</div>
                      <div className="pl-4 text-gray-300">console.log('Transfer completed:', txId);</div>
                      <div className="text-purple-400">{`}`};</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`const transferAssets = async (vaultId) => {
  const transferConfig = {
    to: '0x742d35Cc6634C0532925a3b8D46C0Ac5c2A4C0c0',
    amount: '0.1',
    asset: 'ETH',
    memo: 'Mobile transfer'
  };
  
  const txId = await sdk.transfer(vaultId, transferConfig);
  console.log('Transfer completed:', txId);
};`, 'transfer')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === 'transfer' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration Section */}
            <section id="configuration">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-8 h-8 text-[#FF5AF7]" />
                Configuration
              </h2>
              
              <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">SDK Configuration Options</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#6B00D7]/20">
                        <th className="text-left py-3 px-4 text-[#FF5AF7]">Option</th>
                        <th className="text-left py-3 px-4 text-[#FF5AF7]">Type</th>
                        <th className="text-left py-3 px-4 text-[#FF5AF7]">Default</th>
                        <th className="text-left py-3 px-4 text-[#FF5AF7]">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-[#6B00D7]/10">
                        <td className="py-3 px-4 font-mono">apiEndpoint</td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">-</td>
                        <td className="py-3 px-4">Your Chronos Vault backend URL</td>
                      </tr>
                      <tr className="border-b border-[#6B00D7]/10">
                        <td className="py-3 px-4 font-mono">enableBiometrics</td>
                        <td className="py-3 px-4">boolean</td>
                        <td className="py-3 px-4">true</td>
                        <td className="py-3 px-4">Enable biometric authentication</td>
                      </tr>
                      <tr className="border-b border-[#6B00D7]/10">
                        <td className="py-3 px-4 font-mono">enableEncryption</td>
                        <td className="py-3 px-4">boolean</td>
                        <td className="py-3 px-4">true</td>
                        <td className="py-3 px-4">Enable data encryption</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono">debugMode</td>
                        <td className="py-3 px-4">boolean</td>
                        <td className="py-3 px-4">false</td>
                        <td className="py-3 px-4">Enable debug logging</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section id="examples">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Code className="w-8 h-8 text-[#FF5AF7]" />
                Complete Example
              </h2>
              
              <div className="bg-gradient-to-b from-black/80 to-[#0a0014] border border-[#6B00D7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">React Native App Example</h3>
                  <Link href="/integration-examples">
                    <button className="text-[#FF5AF7] hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                      View Full Example
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
                <p className="text-gray-400 mb-4">
                  A complete React Native application showing how to integrate all SDK features.
                </p>
                <div className="bg-black/60 rounded-lg p-4 border border-[#6B00D7]/20 text-center">
                  <Terminal className="w-12 h-12 text-[#FF5AF7] mx-auto mb-3" />
                  <p className="text-gray-300 mb-4">
                    See the complete implementation with authentication, vault management, and transfers.
                  </p>
                  <Link href="/integration-examples">
                    <button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                      View Integration Examples
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKDocumentation;