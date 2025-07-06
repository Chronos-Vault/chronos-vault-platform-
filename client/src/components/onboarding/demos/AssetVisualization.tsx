import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Clock, Share2, DollarSign, FileText, Image, Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Asset {
  id: string;
  name: string;
  type: 'crypto' | 'nft' | 'document' | 'custom';
  icon: JSX.Element;
  locked: boolean;
  unlockDate?: string;
  color: string;
}

export const AssetVisualization = ({ onInteract }: { onInteract: () => void }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onInteract();
    }
  };
  
  const initialAssets: Asset[] = [
    {
      id: 'asset-1',
      name: 'Bitcoin Savings',
      type: 'crypto',
      icon: <DollarSign className="h-6 w-6" />,
      locked: true,
      unlockDate: '2026-05-15',
      color: 'bg-orange-500'
    },
    {
      id: 'asset-2',
      name: 'Family Photos',
      type: 'document',
      icon: <Image className="h-6 w-6" />,
      locked: true,
      color: 'bg-blue-500'
    },
    {
      id: 'asset-3',
      name: 'Legal Documents',
      type: 'document',
      icon: <FileText className="h-6 w-6" />,
      locked: true,
      unlockDate: '2025-12-01',
      color: 'bg-green-500'
    },
    {
      id: 'asset-4',
      name: 'Rare Collection NFT',
      type: 'nft',
      icon: <Hexagon className="h-6 w-6" />,
      locked: false,
      color: 'bg-purple-500'
    },
    {
      id: 'asset-5',
      name: 'Inheritance Fund',
      type: 'crypto',
      icon: <DollarSign className="h-6 w-6" />,
      locked: true,
      unlockDate: '2030-01-01',
      color: 'bg-amber-500'
    }
  ];
  
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  
  const toggleLock = (id: string) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, locked: !asset.locked } : asset
    ));
    handleInteraction();
  };
  
  const filteredAssets = activeTab === 'all' 
    ? assets 
    : assets.filter(asset => activeTab === 'locked' ? asset.locked : !asset.locked);

  return (
    <div className="asset-visualization p-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
        setActiveTab(value);
        handleInteraction();
      }}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="locked">Time-Locked</TabsTrigger>
          <TabsTrigger value="unlocked">Accessible</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} toggleLock={toggleLock} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="locked" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} toggleLock={toggleLock} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="unlocked" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} toggleLock={toggleLock} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">About Asset Protection</h3>
        <p className="text-sm text-muted-foreground">
          Chronos Vault allows you to secure different types of digital assets with time-locks and multi-chain protection.
          Toggle the lock status above to see how assets can be secured and released.
        </p>
      </div>
    </div>
  );
};

interface AssetCardProps {
  asset: Asset;
  toggleLock: (id: string) => void;
}

const AssetCard = ({ asset, toggleLock }: AssetCardProps) => {
  return (
    <motion.div 
      className={`rounded-lg border ${asset.locked ? 'border-primary/50' : 'border-muted'} overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={`p-4 ${asset.color} bg-opacity-10 flex justify-between items-center`}>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center text-white mr-3`}>
            {asset.icon}
          </div>
          <div>
            <h3 className="font-medium">{asset.name}</h3>
            <p className="text-xs text-muted-foreground">{asset.type === 'crypto' ? 'Cryptocurrency' : asset.type === 'nft' ? 'Digital Collectible' : 'Document'}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => toggleLock(asset.id)}
          className={asset.locked ? 'text-primary hover:text-primary' : 'text-muted-foreground'}
        >
          {asset.locked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="p-4">
        {asset.locked ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {asset.unlockDate 
                ? `Unlocks on ${new Date(asset.unlockDate).toLocaleDateString()}`
                : 'Secured in vault'}
            </span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Available for access</span>
          </div>
        )}
        
        <div className="mt-3 text-xs text-muted-foreground">
          Protected by Triple-Chain Security across Ethereum, Solana, and TON networks
        </div>
      </div>
    </motion.div>
  );
};