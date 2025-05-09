import { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { ArrowDownToLine, RefreshCw, LineChart, Activity } from "lucide-react";
import { OraclePriceFeed } from './oracle-price-feed';
import { OracleTechnicalIndicator } from './oracle-technical-indicator';

interface MarketDataDashboardProps {
  defaultAsset?: string;
  defaultBlockchain?: BlockchainType;
  showTechnicalIndicators?: boolean;
  compact?: boolean;
}

export function MarketDataDashboard({ 
  defaultAsset = 'BTC',
  defaultBlockchain = BlockchainType.ETHEREUM,
  showTechnicalIndicators = true,
  compact = false
}: MarketDataDashboardProps) {
  const [selectedAsset, setSelectedAsset] = useState<string>(defaultAsset);
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(defaultBlockchain);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  const handleAssetChange = (value: string) => {
    setSelectedAsset(value);
    // Force refresh components
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const handleBlockchainChange = (value: string) => {
    setSelectedBlockchain(value as BlockchainType);
    // Force refresh components
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const assets = [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'SOL', label: 'Solana (SOL)' },
    { value: 'TON', label: 'TON (TON)' }
  ];
  
  const blockchains = [
    { value: BlockchainType.ETHEREUM, label: 'Ethereum' },
    { value: BlockchainType.SOLANA, label: 'Solana' },
    { value: BlockchainType.TON, label: 'TON' }
  ];
  
  return (
    <Card className="w-full bg-black/40 border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">On-Chain Market Data</CardTitle>
            <CardDescription className="text-xs">
              Real-time oracle data from Chainlink network
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleRefresh}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2 mt-2">
          <Select
            value={selectedAsset}
            onValueChange={handleAssetChange}
          >
            <SelectTrigger className="text-sm h-8 bg-gray-900 border-gray-700">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map(asset => (
                <SelectItem key={asset.value} value={asset.value}>
                  {asset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedBlockchain}
            onValueChange={handleBlockchainChange}
          >
            <SelectTrigger className="text-sm h-8 w-36 bg-gray-900 border-gray-700">
              <SelectValue placeholder="Select blockchain" />
            </SelectTrigger>
            <SelectContent>
              {blockchains.map(blockchain => (
                <SelectItem key={blockchain.value} value={blockchain.value}>
                  {blockchain.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {compact ? (
          <div className="space-y-4">
            <OraclePriceFeed 
              key={`price-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
              asset={selectedAsset}
              blockchain={selectedBlockchain}
              showDetails={false}
            />
            
            {showTechnicalIndicators && (
              <div className="grid grid-cols-2 gap-3">
                <OracleTechnicalIndicator 
                  key={`rsi-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
                  asset={selectedAsset}
                  indicator="rsi"
                  period={14}
                  blockchain={selectedBlockchain}
                />
                <OracleTechnicalIndicator 
                  key={`ma-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
                  asset={selectedAsset}
                  indicator="ma"
                  period={50}
                  blockchain={selectedBlockchain}
                />
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="price" className="space-y-4">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="price" className="data-[state=active]:bg-[#3F51FF]/20">
                <Activity className="h-4 w-4 mr-1" />
                Price
              </TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-[#3F51FF]/20">
                <LineChart className="h-4 w-4 mr-1" />
                Technical
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-[#3F51FF]/20">
                <ArrowDownToLine className="h-4 w-4 mr-1" />
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="price" className="space-y-4">
              <OraclePriceFeed 
                key={`price-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
                asset={selectedAsset}
                blockchain={selectedBlockchain}
                showDetails={true}
                showSources={true}
              />
              
              <div className="text-xs text-gray-400 mt-2">
                <p>
                  This price feed is powered by Chainlink's decentralized oracle network,
                  which aggregates price data from multiple high-quality sources to provide
                  accurate, tamper-proof financial data for your investment strategies.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <OracleTechnicalIndicator 
                  key={`rsi-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
                  asset={selectedAsset}
                  indicator="rsi"
                  period={14}
                  blockchain={selectedBlockchain}
                />
                <OracleTechnicalIndicator 
                  key={`ma-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
                  asset={selectedAsset}
                  indicator="ma"
                  period={50}
                  blockchain={selectedBlockchain}
                />
                
                <OracleTechnicalIndicator 
                  key={`volume-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
                  asset={selectedAsset}
                  indicator="volume"
                  period={7}
                  blockchain={selectedBlockchain}
                />
                <OracleTechnicalIndicator 
                  key={`macd-${selectedAsset}-${selectedBlockchain}-${refreshKey}`}
                  asset={selectedAsset}
                  indicator="macd"
                  period={12}
                  secondaryPeriod={26}
                  signalPeriod={9}
                  blockchain={selectedBlockchain}
                />
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                <p>
                  Technical indicators are calculated using a combination of reliable price feeds,
                  secured by Chainlink's oracle networks. These indicators can be used to create
                  and automate investment strategies with rules based on on-chain conditions.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <Card className="bg-black/40 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-sm">Historical Price Data</CardTitle>
                  <CardDescription className="text-xs">
                    Chainlink oracle data history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Historical price chart coming soon
                      </p>
                      <p className="text-xs text-gray-500 max-w-xs mt-1">
                        On-chain historical data access will allow you to analyze past market conditions
                        and backtest your investment strategies
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}