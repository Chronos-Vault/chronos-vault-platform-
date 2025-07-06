import React from "react";
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
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BlockchainType } from "@/contexts/multi-chain-context";
import { PortfolioManagement } from "@/components/portfolio/portfolio-management";
import { EmergencyProtocols } from "@/components/emergency/emergency-protocols";
import { StrategyTester } from "@/components/strategy/strategy-tester";
import { VaultDeploymentMonitor } from "@/components/monitoring/vault-deployment-monitor";

interface AdvancedFeaturesDashboardProps {
  assetType: string;
  initialAmount: string;
  selectedBlockchain: BlockchainType;
  securityLevel: number;
  strategy: string;
  timeBasedExits: { date: string; percentage: number }[];
  priceTargets: { id: string; price: string; percentage: number }[];
  technicalIndicators: any[];
  enableEmergencyProtocol: boolean;
  setEnableEmergencyProtocol: (value: boolean) => void;
  enableAnalytics: boolean;
  setEnableAnalytics: (value: boolean) => void;
  crossChainEnabled: boolean;
}

export function AdvancedFeaturesDashboard({
  assetType,
  initialAmount,
  selectedBlockchain,
  securityLevel,
  strategy,
  timeBasedExits,
  priceTargets,
  technicalIndicators,
  enableEmergencyProtocol,
  setEnableEmergencyProtocol,
  enableAnalytics,
  setEnableAnalytics,
  crossChainEnabled
}: AdvancedFeaturesDashboardProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Advanced Features</h3>
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid grid-cols-5 bg-gray-800/50">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Test</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monitor">Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="mt-4">
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle>Portfolio Management</CardTitle>
              <CardDescription>Optimize and manage your investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioManagement 
                assetType={assetType}
                initialAmount={initialAmount ? parseFloat(initialAmount) : 0}
                strategy={strategy}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emergency" className="mt-4">
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle>Emergency Protocols</CardTitle>
              <CardDescription>Configure safeguards for extreme market conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyProtocols 
                enabled={enableEmergencyProtocol}
                securityLevel={securityLevel}
                assetType={assetType}
                crossChainEnabled={crossChainEnabled}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-4">
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle>Strategy Testing</CardTitle>
              <CardDescription>Backtest your investment strategy against historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <StrategyTester 
                strategy={strategy}
                assetType={assetType}
                initialAmount={initialAmount ? parseFloat(initialAmount) : 0}
                priceTargets={priceTargets.map(pt => ({ 
                  price: parseFloat(pt.price || '0'), 
                  percentage: pt.percentage,
                  hit: false
                }))}
                timeBasedExits={timeBasedExits}
                technicalIndicators={technicalIndicators.filter(ti => ti.enabled)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>AI-driven analysis of your investment strategy</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Performance Analytics Component */}
              <div className="p-4 rounded-lg border border-gray-700 bg-black/20">
                <p className="text-sm text-center text-gray-400">
                  AI-powered performance analysis will be available once your vault is created.
                  <br/>
                  Enable this feature to gain insights into your investment strategy.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="analytics-switch" 
                      checked={enableAnalytics} 
                      onCheckedChange={setEnableAnalytics} 
                    />
                    <Label htmlFor="analytics-switch">Enable Performance Analytics</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitor" className="mt-4">
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle>Vault Deployment Monitoring</CardTitle>
              <CardDescription>Monitor your vault deployment across selected blockchains</CardDescription>
            </CardHeader>
            <CardContent>
              <VaultDeploymentMonitor 
                blockchainType={selectedBlockchain}
                securityLevel={securityLevel}
                strategy={strategy}
                assetType={assetType}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}