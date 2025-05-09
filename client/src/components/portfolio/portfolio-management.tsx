import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export interface PortfolioManagementProps {
  assetType: string;
  initialAmount: number;
  strategy: string;
}

export function PortfolioManagement({
  assetType,
  initialAmount,
  strategy
}: PortfolioManagementProps) {
  const [allocations, setAllocations] = useState<{ name: string; value: number; color: string }[]>([
    { name: assetType, value: 70, color: "#4f46e5" },
    { name: "Stablecoins", value: 20, color: "#10b981" },
    { name: "Other Assets", value: 10, color: "#f59e0b" }
  ]);
  
  const [rebalanceFrequency, setRebalanceFrequency] = useState<number>(30); // days
  const [driftThreshold, setDriftThreshold] = useState<number>(5); // percent
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  
  const handleAllocationChange = (index: number, newValue: number) => {
    const newAllocations = [...allocations];
    
    // Calculate the difference
    const oldValue = newAllocations[index].value;
    const difference = newValue - oldValue;
    
    // Update the changed allocation
    newAllocations[index].value = newValue;
    
    // Distribute the difference among other allocations proportionally
    const otherAllocations = newAllocations.filter((_, i) => i !== index);
    const totalOtherValue = otherAllocations.reduce((sum, alloc) => sum + alloc.value, 0);
    
    if (totalOtherValue > 0) {
      for (let i = 0; i < newAllocations.length; i++) {
        if (i !== index) {
          const proportion = newAllocations[i].value / totalOtherValue;
          newAllocations[i].value = Math.max(0, newAllocations[i].value - (difference * proportion));
        }
      }
    }
    
    // Normalize to ensure sum is 100
    const totalValue = newAllocations.reduce((sum, alloc) => sum + alloc.value, 0);
    for (let i = 0; i < newAllocations.length; i++) {
      newAllocations[i].value = (newAllocations[i].value / totalValue) * 100;
    }
    
    setAllocations(newAllocations);
  };
  
  const handleRebalance = () => {
    setIsRebalancing(true);
    
    // Simulate rebalancing
    setTimeout(() => {
      setIsRebalancing(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Portfolio Allocation</h3>
          
          <div className="space-y-4">
            {allocations.map((allocation, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <Label>{allocation.name}</Label>
                  <span className="text-sm">{allocation.value.toFixed(0)}%</span>
                </div>
                <Slider
                  value={[allocation.value]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => handleAllocationChange(index, values[0])}
                />
                <Progress
                  value={allocation.value}
                  className="h-2"
                  style={{ 
                    '--progress-background': allocation.color 
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Allocation Breakdown</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocations}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {allocations.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(0) + '%' : value} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <Card className="bg-black/20 border-gray-800">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Rebalancing Settings</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Rebalance Frequency (Days)</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={rebalanceFrequency}
                  onChange={(e) => setRebalanceFrequency(parseInt(e.target.value) || 30)}
                />
                <span className="flex items-center text-sm text-gray-400">days</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Drift Threshold</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={driftThreshold}
                  onChange={(e) => setDriftThreshold(parseInt(e.target.value) || 5)}
                />
                <span className="flex items-center text-sm text-gray-400">%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              disabled={isRebalancing}
              onClick={handleRebalance}
              className="bg-[#3F51FF] hover:bg-[#3F51FF]/80"
            >
              {isRebalancing ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Rebalancing...
                </>
              ) : (
                "Rebalance Now"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-black/20 border border-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Estimated Portfolio Value</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-black/40 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Current</p>
            <p className="text-xl font-bold">${initialAmount.toLocaleString()}</p>
          </div>
          <div className="bg-black/40 p-3 rounded-lg">
            <p className="text-xs text-gray-400">6 Months</p>
            <p className="text-xl font-bold">${(initialAmount * 1.2).toLocaleString()}</p>
          </div>
          <div className="bg-black/40 p-3 rounded-lg">
            <p className="text-xs text-gray-400">1 Year</p>
            <p className="text-xl font-bold">${(initialAmount * 1.5).toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          *Projections are based on historical performance and market conditions. Actual results may vary.
        </p>
      </div>
    </div>
  );
}