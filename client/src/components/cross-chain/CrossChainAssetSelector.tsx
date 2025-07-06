import React, { useState, useEffect } from 'react';
import { Plus, Minus, Info, Trash2, ArrowRight } from 'lucide-react';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { NETWORK_CONFIG, SUPPORTED_TOKENS } from '@/lib/cross-chain/bridge';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface CrossChainAssetSelectorProps {
  onAssetsChange: (assets: Array<{blockchain: string, token: string, amount: number}>) => void;
  initialAmount?: number;
  maxAssets?: number;
}

interface AssetEntry {
  id: string;
  blockchain: BlockchainType;
  token: string;
  amount: string;
}

export default function CrossChainAssetSelector({ 
  onAssetsChange, 
  initialAmount = 0,
  maxAssets = 5
}: CrossChainAssetSelectorProps) {
  const [assets, setAssets] = useState<AssetEntry[]>([
    {
      id: `asset-${Date.now()}`,
      blockchain: 'TON',
      token: 'TON',
      amount: initialAmount > 0 ? initialAmount.toString() : ''
    }
  ]);
  
  // Generate chain options for dropdowns
  const chainOptions = Object.keys(NETWORK_CONFIG) as BlockchainType[];
  
  useEffect(() => {
    // Notify parent component when assets change
    const validAssets = assets
      .filter(asset => 
        asset.blockchain && 
        asset.token && 
        asset.amount && 
        !isNaN(Number(asset.amount)) && 
        Number(asset.amount) > 0
      )
      .map(asset => ({
        blockchain: asset.blockchain,
        token: asset.token,
        amount: Number(asset.amount)
      }));
    
    onAssetsChange(validAssets);
  }, [assets, onAssetsChange]);
  
  // Add a new asset entry
  const addAsset = () => {
    if (assets.length >= maxAssets) return;
    
    setAssets([
      ...assets,
      {
        id: `asset-${Date.now()}`,
        blockchain: 'TON',
        token: 'TON',
        amount: ''
      }
    ]);
  };
  
  // Remove an asset entry
  const removeAsset = (id: string) => {
    if (assets.length <= 1) return;
    setAssets(assets.filter(asset => asset.id !== id));
  };
  
  // Update an asset entry
  const updateAsset = (id: string, field: keyof AssetEntry, value: string) => {
    setAssets(assets.map(asset => {
      if (asset.id === id) {
        const updatedAsset = { ...asset, [field]: value };
        
        // If blockchain changes, update token to first available
        if (field === 'blockchain') {
          const blockchain = value as BlockchainType;
          const availableTokens = SUPPORTED_TOKENS[blockchain];
          if (availableTokens?.length > 0) {
            updatedAsset.token = availableTokens[0].symbol;
          }
        }
        
        return updatedAsset;
      }
      return asset;
    }));
  };
  
  // Get available tokens for a blockchain
  const getAvailableTokens = (blockchain: BlockchainType) => {
    return SUPPORTED_TOKENS[blockchain] || [];
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Multi-Chain Assets</CardTitle>
            <CardDescription>
              Select assets from different blockchains
            </CardDescription>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Info className="h-5 w-5 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select up to {maxAssets} assets from different blockchains to include in your vault or transaction.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div key={asset.id} className="flex items-start gap-2">
              <div className="grid grid-cols-12 gap-3 flex-grow">
                <div className="col-span-5">
                  <Select
                    value={asset.blockchain}
                    onValueChange={(value) => updateAsset(asset.id, 'blockchain', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      {chainOptions.map((chain) => (
                        <SelectItem key={chain} value={chain}>
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: NETWORK_CONFIG[chain].color }}
                            ></div>
                            {NETWORK_CONFIG[chain].name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-4">
                  <Select
                    value={asset.token}
                    onValueChange={(value) => updateAsset(asset.id, 'token', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTokens(asset.blockchain).map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center">
                            <span className="mr-2">{token.symbol}</span>
                            {token.isStablecoin && (
                              <Badge variant="outline" className="text-xs">Stable</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={asset.amount}
                    onChange={(e) => updateAsset(asset.id, 'amount', e.target.value)}
                    min="0"
                    step="0.000001"
                  />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => removeAsset(asset.id)}
                disabled={assets.length <= 1}
                className="flex-shrink-0 mt-0.5"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addAsset}
            disabled={assets.length >= maxAssets}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-gray-500">
          {assets.length} of {maxAssets} assets selected
        </div>
        
        <div className="text-sm font-medium">
          {assets.filter(a => a.amount && !isNaN(Number(a.amount)) && Number(a.amount) > 0).length} valid entries
        </div>
      </CardFooter>
    </Card>
  );
}