import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OraclePriceFeed } from './oracle-price-feed';
import { OracleTechnicalIndicator } from './oracle-technical-indicator';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Info, 
  Link2, 
  LineChart,
  BarChart, 
  Network,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { chainlinkOracleService } from '@/services/chainlink-oracle-service';
import type { PriceFeed, TechnicalIndicator, OracleNetwork } from '@/services/chainlink-oracle-service';

interface MarketDataDashboardProps {
  defaultAsset?: string;
  defaultBlockchain?: string;
  compact?: boolean;
}

export function MarketDataDashboard({ 
  defaultAsset = 'BTC', 
  defaultBlockchain = 'ethereum',
  compact = false 
}: MarketDataDashboardProps) {
  const [activeTab, setActiveTab] = useState('price-feeds');
  const [selectedAsset, setSelectedAsset] = useState(defaultAsset);
  const [selectedBlockchain, setSelectedBlockchain] = useState(defaultBlockchain);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Data states
  const [priceFeeds, setPriceFeeds] = useState<PriceFeed[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [networks, setNetworks] = useState<OracleNetwork[]>([]);
  
  // Analytics and metrics
  const [networkHealth, setNetworkHealth] = useState<{
    activeNodes: number;
    totalNodes: number;
    avgResponseTime: number;
    lastHeartbeat: Date | null;
  }>({
    activeNodes: 0,
    totalNodes: 0,
    avgResponseTime: 0,
    lastHeartbeat: null
  });

  // Load data on component mount and when selected options change
  useEffect(() => {
    loadData();
  }, [selectedAsset, selectedBlockchain]);
  
  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Get price feeds
      const feeds = await chainlinkOracleService.getPriceFeeds(selectedBlockchain as any);
      setPriceFeeds(feeds);
      
      // Get technical indicators
      const indicators = await chainlinkOracleService.getTechnicalIndicators(selectedAsset, selectedBlockchain as any);
      setTechnicalIndicators(indicators);
      
      // Get networks information
      const networksData = await chainlinkOracleService.getNetworks();
      setNetworks(networksData);
      
      // Calculate network health
      const relevantNetworks = networksData.filter(n => n.networkType === selectedBlockchain);
      if (relevantNetworks.length > 0) {
        const activeNodes = relevantNetworks.filter(n => n.active).length;
        const totalNodes = relevantNetworks.reduce((sum, n) => sum + n.nodeCount, 0);
        const avgResponseTime = relevantNetworks.reduce((sum, n) => sum + n.responseTime, 0) / relevantNetworks.length;
        const lastHeartbeat = new Date(Math.max(...relevantNetworks.map(n => n.lastHeartbeat)));
        
        setNetworkHealth({
          activeNodes,
          totalNodes,
          avgResponseTime,
          lastHeartbeat
        });
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading oracle data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get appropriate price feed for the selected asset
  const getPriceFeedForAsset = (assetSymbol: string): PriceFeed | undefined => {
    return priceFeeds.find(feed => 
      feed.pair.toLowerCase().startsWith(assetSymbol.toLowerCase())
    );
  };
  
  // Filter technical indicators by type
  const getIndicatorsByType = (type: string): TechnicalIndicator[] => {
    return technicalIndicators.filter(indicator => 
      indicator.type === type
    );
  };
  
  // Calculate time since last update
  const getTimeSinceUpdate = (): string => {
    if (!lastUpdated) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} minutes ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} hours ago`;
    return `${Math.floor(diffSecs / 86400)} days ago`;
  };
  
  // Get icon for network status
  const getNetworkStatusIcon = () => {
    if (!networkHealth.lastHeartbeat) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    
    const now = new Date();
    const diffMs = now.getTime() - networkHealth.lastHeartbeat.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 5) return <Badge className="bg-green-600">Healthy</Badge>;
    if (diffMins < 30) return <Badge className="bg-amber-600">Delayed</Badge>;
    return <Badge className="bg-red-600">Degraded</Badge>;
  };
  
  // Calculate network health percentage
  const getNetworkHealthPercentage = (): number => {
    if (networkHealth.totalNodes === 0) return 0;
    return (networkHealth.activeNodes / networkHealth.totalNodes) * 100;
  };
  
  // Render dashboard content based on selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'price-feeds':
        return (
          <div className="space-y-4">
            {!compact && (
              <div className="bg-black/20 border border-gray-800 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Oracle Price Feeds</h3>
                  <Badge className="bg-indigo-900/70 text-indigo-300 border border-indigo-700/50">
                    Chainlink
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Real-time price data from decentralized oracle networks
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main asset price feed */}
              <div className={compact ? '' : 'md:col-span-2'}>
                <OraclePriceFeed 
                  feed={getPriceFeedForAsset(selectedAsset)} 
                  isLoading={isLoading} 
                  highlighted={true}
                />
              </div>
              
              {/* Other price feeds */}
              {!compact && priceFeeds
                .filter(feed => !feed.pair.toLowerCase().startsWith(selectedAsset.toLowerCase()))
                .slice(0, 3)
                .map((feed) => (
                  <OraclePriceFeed key={feed.id} feed={feed} isLoading={isLoading} />
                ))}
            </div>
          </div>
        );
        
      case 'technical':
        return (
          <div className="space-y-4">
            {!compact && (
              <div className="bg-black/20 border border-gray-800 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Technical Indicators</h3>
                  <Badge className="bg-indigo-900/70 text-indigo-300 border border-indigo-700/50">
                    Chainlink
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  On-chain technical analysis indicators powered by oracle networks
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* RSI Indicator */}
              <OracleTechnicalIndicator 
                indicator={getIndicatorsByType('RSI')[0]} 
                isLoading={isLoading} 
                type="RSI"
              />
              
              {/* MACD Indicator */}
              <OracleTechnicalIndicator 
                indicator={getIndicatorsByType('MACD')[0]} 
                isLoading={isLoading} 
                type="MACD"
              />
              
              {!compact && (
                <>
                  {/* Moving Averages */}
                  <OracleTechnicalIndicator 
                    indicator={getIndicatorsByType('MA')[0]} 
                    secondaryIndicator={getIndicatorsByType('MA')[1]}
                    isLoading={isLoading} 
                    type="MA"
                  />
                  
                  {/* EMA */}
                  <OracleTechnicalIndicator 
                    indicator={getIndicatorsByType('EMA')[0]} 
                    isLoading={isLoading} 
                    type="EMA"
                  />
                </>
              )}
            </div>
          </div>
        );
        
      case 'networks':
        if (compact) return null;
        
        return (
          <div className="space-y-4">
            <div className="bg-black/20 border border-gray-800 rounded-md p-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Oracle Networks</h3>
                <Badge className="bg-indigo-900/70 text-indigo-300 border border-indigo-700/50">
                  Chainlink
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Status and performance of decentralized oracle networks
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 border border-gray-800 rounded-md p-4">
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Network className="h-4 w-4 mr-2 text-indigo-400" />
                  Network Health
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Active Nodes</div>
                    <div className="text-xl font-semibold">
                      {networkHealth.activeNodes} / {networkHealth.totalNodes}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Response Time</div>
                    <div className="text-xl font-semibold">
                      {networkHealth.avgResponseTime.toFixed(0)} ms
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Network Status</span>
                    {getNetworkStatusIcon()}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${getNetworkHealthPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getNetworkHealthPercentage().toFixed(0)}% operational
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 border border-gray-800 rounded-md p-4">
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Clock className="h-4 w-4 mr-2 text-indigo-400" />
                  Oracle Activity
                </h3>
                
                <div className="space-y-3">
                  {networks
                    .filter(network => network.networkType === selectedBlockchain)
                    .map(network => (
                      <div key={network.id} className="flex justify-between items-center">
                        <div>
                          <div className="text-sm">{network.name}</div>
                          <div className="text-xs text-gray-500">
                            {network.nodeCount} Nodes
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge className={network.active ? 'bg-green-600' : 'bg-red-600'}>
                            {network.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  
                  {networks.filter(network => network.networkType === selectedBlockchain).length === 0 && (
                    <div className="text-center py-3 text-gray-500">
                      No data available for this network
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        {!compact && (
          <h2 className="text-lg font-semibold flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-indigo-400" />
            On-Chain Market Data
          </h2>
        )}
        
        <div className="flex items-center space-x-2">
          <Select
            value={selectedAsset}
            onValueChange={setSelectedAsset}
          >
            <SelectTrigger className="w-[100px] bg-gray-800 border-gray-700 h-8">
              <SelectValue placeholder="Asset" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="LINK">LINK</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={selectedBlockchain}
            onValueChange={setSelectedBlockchain}
          >
            <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 h-8">
              <SelectValue placeholder="Network" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-gray-700"
            onClick={loadData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="price-feeds">Price Feeds</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          {!compact && <TabsTrigger value="networks">Networks</TabsTrigger>}
        </TabsList>
        
        <div className="p-4 bg-black/20 border border-gray-800 rounded-md mt-3">
          <TabsContent value="price-feeds" className="m-0">
            {renderTabContent()}
          </TabsContent>
          
          <TabsContent value="technical" className="m-0">
            {renderTabContent()}
          </TabsContent>
          
          {!compact && (
            <TabsContent value="networks" className="m-0">
              {renderTabContent()}
            </TabsContent>
          )}
        </div>
      </Tabs>
      
      {!compact && (
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div>
            Last updated: {getTimeSinceUpdate()}
          </div>
          <div className="flex items-center">
            <Link2 className="h-3 w-3 mr-1" />
            <span>Powered by Chainlink Oracle Networks</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketDataDashboard;