import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { AlertCircle, Plus, Settings, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Portfolio asset type
interface PortfolioAsset {
  id: string;
  name: string; 
  symbol: string;
  blockchain: string;
  amount: number;
  valueUSD: number;
  allocation: number;
  targetAllocation: number;
  color: string;
}

// Risk rating type
type RiskRating = 'low' | 'medium' | 'high' | 'very-high';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF5AF7', '#3F51FF', '#6B00D7'];

const calculateRebalanceActions = (assets: PortfolioAsset[]): { buy: PortfolioAsset[], sell: PortfolioAsset[] } => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
  
  const actions = {
    buy: [] as PortfolioAsset[],
    sell: [] as PortfolioAsset[]
  };

  assets.forEach(asset => {
    const currentAllocation = (asset.valueUSD / totalValue) * 100;
    const targetAllocation = asset.targetAllocation;
    const diff = targetAllocation - currentAllocation;

    // If the difference is more than 1%, add to rebalance actions
    if (Math.abs(diff) > 1) {
      const assetCopy = {...asset, allocation: currentAllocation};
      if (diff > 0) {
        actions.buy.push(assetCopy);
      } else {
        actions.sell.push(assetCopy);
      }
    }
  });

  return actions;
};

const calculatePortfolioRisk = (assets: PortfolioAsset[]): RiskRating => {
  // Example logic: based on asset composition
  const btcPercentage = assets.find(a => a.symbol === 'BTC')?.allocation || 0;
  const ethPercentage = assets.find(a => a.symbol === 'ETH')?.allocation || 0;
  const altcoinsPercentage = 100 - btcPercentage - ethPercentage;
  
  if (altcoinsPercentage > 50) return 'very-high';
  if (altcoinsPercentage > 30) return 'high';
  if (altcoinsPercentage > 15) return 'medium';
  return 'low';
};

export interface PortfolioManagementProps {
  vaultId?: number;
  defaultAssets?: PortfolioAsset[];
  onAssetsChange?: (assets: PortfolioAsset[]) => void;
  readOnly?: boolean;
}

export function PortfolioManagement({ 
  vaultId, 
  defaultAssets,
  onAssetsChange,
  readOnly = false
}: PortfolioManagementProps) {
  const [assets, setAssets] = useState<PortfolioAsset[]>(defaultAssets || [
    { 
      id: "1", 
      name: "Bitcoin", 
      symbol: "BTC", 
      blockchain: "Bitcoin",
      amount: 0.25, 
      valueUSD: 12500, 
      allocation: 50,
      targetAllocation: 50,
      color: COLORS[0]
    },
    { 
      id: "2", 
      name: "Ethereum", 
      symbol: "ETH", 
      blockchain: "Ethereum",
      amount: 5, 
      valueUSD: 7500, 
      allocation: 30,
      targetAllocation: 30,
      color: COLORS[1]
    },
    { 
      id: "3", 
      name: "Solana", 
      symbol: "SOL", 
      blockchain: "Solana",
      amount: 50, 
      valueUSD: 5000, 
      allocation: 20,
      targetAllocation: 20,
      color: COLORS[2]
    }
  ]);
  
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    symbol: "",
    blockchain: "Bitcoin",
    amount: "",
    valueUSD: "",
    targetAllocation: 0
  });
  
  const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
  const pieData = assets.map((asset) => ({
    name: asset.symbol,
    value: asset.valueUSD,
    color: asset.color
  }));
  
  const riskRating = calculatePortfolioRisk(assets);
  const rebalanceActions = calculateRebalanceActions(assets);
  const needsRebalancing = rebalanceActions.buy.length > 0 || rebalanceActions.sell.length > 0;
  
  const handleAddAsset = () => {
    if (
      !newAsset.name ||
      !newAsset.symbol ||
      !newAsset.amount ||
      !newAsset.valueUSD ||
      newAsset.targetAllocation <= 0
    ) {
      return;
    }

    // Adjust allocations so they total 100%
    const currentTotal = assets.reduce((sum, asset) => sum + asset.targetAllocation, 0);
    const newAllocation = newAsset.targetAllocation;
    const totalAfterAdd = currentTotal + newAllocation;
    
    let updatedAssets;
    
    if (totalAfterAdd > 100) {
      // Scale down all allocations proportionally
      const scaleFactor = 100 / totalAfterAdd;
      updatedAssets = assets.map(asset => ({
        ...asset,
        targetAllocation: Math.round(asset.targetAllocation * scaleFactor)
      }));
    } else {
      updatedAssets = [...assets];
    }

    const newId = (Math.max(0, ...assets.map(a => parseInt(a.id))) + 1).toString();
    const assetToAdd = {
      id: newId,
      name: newAsset.name,
      symbol: newAsset.symbol.toUpperCase(),
      blockchain: newAsset.blockchain,
      amount: parseFloat(newAsset.amount),
      valueUSD: parseFloat(newAsset.valueUSD),
      allocation: (parseFloat(newAsset.valueUSD) / (totalValue + parseFloat(newAsset.valueUSD))) * 100,
      targetAllocation: totalAfterAdd > 100 
        ? Math.round(newAsset.targetAllocation * (100 / totalAfterAdd))
        : newAsset.targetAllocation,
      color: COLORS[assets.length % COLORS.length]
    };

    const newAssets = [...updatedAssets, assetToAdd];
    
    // Recalculate allocations
    const newTotalValue = newAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    const recalculatedAssets = newAssets.map(asset => ({
      ...asset,
      allocation: (asset.valueUSD / newTotalValue) * 100
    }));
    
    setAssets(recalculatedAssets);
    onAssetsChange?.(recalculatedAssets);
    setIsAddAssetOpen(false);
    setNewAsset({
      name: "",
      symbol: "",
      blockchain: "Bitcoin",
      amount: "",
      valueUSD: "",
      targetAllocation: 0
    });
  };

  const handleDeleteAsset = (id: string) => {
    if (readOnly) return;
    
    const filteredAssets = assets.filter(asset => asset.id !== id);
    
    // Recalculate allocations
    const newTotalValue = filteredAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
    const recalculatedAssets = filteredAssets.map(asset => ({
      ...asset,
      allocation: (asset.valueUSD / newTotalValue) * 100
    }));
    
    setAssets(recalculatedAssets);
    onAssetsChange?.(recalculatedAssets);
  };

  const handleTargetAllocationChange = (id: string, newValue: number) => {
    if (readOnly) return;
    
    setAssets(prevAssets => {
      // Update the target allocation for the changed asset
      const updatedAssets = prevAssets.map(asset => 
        asset.id === id ? { ...asset, targetAllocation: newValue } : asset
      );
      
      // Calculate total target allocation
      const totalTargetAllocation = updatedAssets.reduce(
        (sum, asset) => sum + asset.targetAllocation, 
        0
      );
      
      // If total exceeds 100%, proportionally adjust all assets
      if (totalTargetAllocation > 100) {
        return updatedAssets.map(asset => ({
          ...asset,
          targetAllocation: Math.round((asset.targetAllocation / totalTargetAllocation) * 100)
        }));
      }
      
      return updatedAssets;
    });
  };

  const executeRebalance = () => {
    // In a real implementation, this would trigger transactions
    // For now, we'll just update the UI state
    const rebalancedAssets = assets.map(asset => ({
      ...asset,
      allocation: asset.targetAllocation,
      valueUSD: (asset.targetAllocation / 100) * totalValue
    }));
    
    setAssets(rebalancedAssets);
    onAssetsChange?.(rebalancedAssets);
    setIsRebalanceOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-black/40 border-gray-800 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Portfolio Composition</CardTitle>
                <CardDescription>Current asset allocation</CardDescription>
              </div>
              {!readOnly && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsAddAssetOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Asset
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-[200px] mb-4 md:mb-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2 text-gray-300">Allocation Details</h3>
                <div className="space-y-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="text-sm">{asset.symbol}</span>
                      </div>
                      <div>
                        <span className="text-sm">
                          {asset.allocation.toFixed(1)}% 
                          <span className="text-gray-500 ml-1">
                            ({asset.targetAllocation}% target)
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-300">Total Value</h3>
                    <span className="text-lg font-semibold">${totalValue.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-300">Risk Level</h3>
                    <Badge 
                      className={cn(
                        "text-white",
                        riskRating === 'low' && "bg-green-600",
                        riskRating === 'medium' && "bg-yellow-600",
                        riskRating === 'high' && "bg-orange-600",
                        riskRating === 'very-high' && "bg-red-600"
                      )}
                    >
                      {riskRating === 'low' && "Low Risk"}
                      {riskRating === 'medium' && "Medium Risk"}
                      {riskRating === 'high' && "High Risk"}
                      {riskRating === 'very-high' && "Very High Risk"}
                    </Badge>
                  </div>
                  
                  {!readOnly && needsRebalancing && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 border-orange-600 text-orange-400 hover:bg-orange-900/20"
                      onClick={() => setIsRebalanceOpen(true)}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Rebalance Needed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle>Target Allocations</CardTitle>
            <CardDescription>
              Configure your ideal portfolio distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-6">
                {assets.map((asset) => (
                  <div key={asset.id} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: asset.color }}
                        />
                        <span>{asset.symbol}</span>
                      </div>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-400"
                          onClick={() => handleDeleteAsset(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Slider
                        disabled={readOnly}
                        value={[asset.targetAllocation]}
                        min={1}
                        max={100}
                        step={1}
                        className="flex-1"
                        onValueChange={(value) => handleTargetAllocationChange(asset.id, value[0])}
                      />
                      <span className="text-sm w-8">{asset.targetAllocation}%</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {asset.amount} {asset.symbol} (${asset.valueUSD.toLocaleString()})
                    </div>
                  </div>
                ))}
                
                {assets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No assets added yet.</p>
                    {!readOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsAddAssetOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Asset
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {!readOnly && (
        <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new asset to your portfolio
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetName">Asset Name</Label>
                  <Input
                    id="assetName"
                    placeholder="Bitcoin"
                    className="bg-gray-800 border-gray-700"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetSymbol">Symbol</Label>
                  <Input
                    id="assetSymbol"
                    placeholder="BTC"
                    className="bg-gray-800 border-gray-700"
                    value={newAsset.symbol}
                    onChange={(e) => setNewAsset({...newAsset, symbol: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assetBlockchain">Blockchain</Label>
                <Select
                  value={newAsset.blockchain}
                  onValueChange={(value) => setNewAsset({...newAsset, blockchain: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Solana">Solana</SelectItem>
                    <SelectItem value="TON">TON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetAmount">Amount</Label>
                  <Input
                    id="assetAmount"
                    type="number"
                    placeholder="1.0"
                    className="bg-gray-800 border-gray-700"
                    value={newAsset.amount}
                    onChange={(e) => setNewAsset({...newAsset, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetValueUSD">Value (USD)</Label>
                  <Input
                    id="assetValueUSD"
                    type="number"
                    placeholder="50000"
                    className="bg-gray-800 border-gray-700"
                    value={newAsset.valueUSD}
                    onChange={(e) => setNewAsset({...newAsset, valueUSD: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="targetAllocation">Target Allocation</Label>
                  <span className="text-sm">{newAsset.targetAllocation}%</span>
                </div>
                <Slider
                  id="targetAllocation"
                  value={[newAsset.targetAllocation]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setNewAsset({...newAsset, targetAllocation: value[0]})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-gray-700 hover:bg-gray-800"
                onClick={() => setIsAddAssetOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddAsset}>Add Asset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {!readOnly && (
        <Dialog open={isRebalanceOpen} onOpenChange={setIsRebalanceOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Portfolio Rebalancing</DialogTitle>
              <DialogDescription className="text-gray-400">
                Adjust your portfolio to match your target allocations
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <h3 className="text-sm font-medium mb-2">Recommended Actions</h3>
              
              {rebalanceActions.buy.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm text-green-400 mb-2">Buy</h4>
                  <div className="bg-black/30 rounded-md p-3 border border-gray-800">
                    {rebalanceActions.buy.map(asset => (
                      <div key={asset.id} className="flex justify-between py-1">
                        <span>{asset.symbol}</span>
                        <span className="text-green-400">
                          +{(asset.targetAllocation - asset.allocation).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {rebalanceActions.sell.length > 0 && (
                <div>
                  <h4 className="text-sm text-red-400 mb-2">Sell</h4>
                  <div className="bg-black/30 rounded-md p-3 border border-gray-800">
                    {rebalanceActions.sell.map(asset => (
                      <div key={asset.id} className="flex justify-between py-1">
                        <span>{asset.symbol}</span>
                        <span className="text-red-400">
                          {(asset.targetAllocation - asset.allocation).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 bg-yellow-950/30 rounded-md p-3 border border-yellow-900/50">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-500">Important Note</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Rebalancing will execute transactions to match your target allocations.
                      Fees and price slippage may apply. Your assets will be locked in the vault
                      according to your Investment Discipline Vault rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-gray-700 hover:bg-gray-800"
                onClick={() => setIsRebalanceOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={executeRebalance}>
                Rebalance Portfolio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {assets.length > 0 && (
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Blockchain</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Current %</TableHead>
                  <TableHead className="text-right">Target %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <span>{asset.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{asset.blockchain}</TableCell>
                    <TableCell className="text-right">{asset.amount} {asset.symbol}</TableCell>
                    <TableCell className="text-right">${asset.valueUSD.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{asset.allocation.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{asset.targetAllocation}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PortfolioManagement;