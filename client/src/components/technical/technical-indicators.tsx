import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle, TrendingUp, Layers, Info, Shield } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TechnicalIndicator = {
  id: string;
  type: 'ma' | 'rsi' | 'macd' | 'volume';
  period: number;
  condition: 'above' | 'below' | 'crossing_up' | 'crossing_down';
  value?: number;
  secondaryPeriod?: number; // For MACD
  signalPeriod?: number; // For MACD
  enabled: boolean;
};

type IndicatorConfig = {
  label: string;
  description: string;
  icon: React.ReactNode;
  periods: number[];
  conditions: { value: string; label: string }[];
  hasValue: boolean;
  hasSecondaryParams: boolean;
};

const INDICATOR_CONFIGS: Record<string, IndicatorConfig> = {
  ma: {
    label: 'Moving Average',
    description: 'Trigger based on simple moving average (SMA) or exponential moving average (EMA)',
    icon: <TrendingUp className="h-4 w-4 text-[#3F51FF]" />,
    periods: [7, 14, 21, 50, 100, 200],
    conditions: [
      { value: 'above', label: 'Price Above MA' },
      { value: 'below', label: 'Price Below MA' },
      { value: 'crossing_up', label: 'Price Crossing Above MA' },
      { value: 'crossing_down', label: 'Price Crossing Below MA' }
    ],
    hasValue: false,
    hasSecondaryParams: false
  },
  rsi: {
    label: 'RSI',
    description: 'Relative Strength Index indicates overbought/oversold conditions',
    icon: <Layers className="h-4 w-4 text-[#FF5AF7]" />,
    periods: [7, 14, 21],
    conditions: [
      { value: 'above', label: 'RSI Above Value' },
      { value: 'below', label: 'RSI Below Value' }
    ],
    hasValue: true,
    hasSecondaryParams: false
  },
  macd: {
    label: 'MACD',
    description: 'Moving Average Convergence Divergence momentum indicator',
    icon: <TrendingUp className="h-4 w-4 text-[#00E5FF]" />,
    periods: [12, 26],
    conditions: [
      { value: 'crossing_up', label: 'MACD Crossing Above Signal' },
      { value: 'crossing_down', label: 'MACD Crossing Below Signal' },
      { value: 'above', label: 'MACD Above Zero' },
      { value: 'below', label: 'MACD Below Zero' }
    ],
    hasValue: false,
    hasSecondaryParams: true
  },
  volume: {
    label: 'Volume',
    description: 'Trading volume indicators',
    icon: <Layers className="h-4 w-4 text-[#6B00D7]" />,
    periods: [7, 14, 30],
    conditions: [
      { value: 'above', label: 'Volume Above Average' },
      { value: 'below', label: 'Volume Below Average' }
    ],
    hasValue: true,
    hasSecondaryParams: false
  }
};

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator[];
  onChange: (indicators: TechnicalIndicator[]) => void;
  className?: string;
}

export function TechnicalIndicators({ 
  indicators, 
  onChange,
  className = ''
}: TechnicalIndicatorsProps) {
  const [selectedIndicatorType, setSelectedIndicatorType] = useState<string>('ma');
  
  const handleAddIndicator = () => {
    const newIndicator: TechnicalIndicator = {
      id: Date.now().toString(),
      type: selectedIndicatorType as any,
      period: INDICATOR_CONFIGS[selectedIndicatorType].periods[0],
      condition: INDICATOR_CONFIGS[selectedIndicatorType].conditions[0].value as any,
      value: INDICATOR_CONFIGS[selectedIndicatorType].hasValue ? 50 : undefined,
      secondaryPeriod: selectedIndicatorType === 'macd' ? 26 : undefined,
      signalPeriod: selectedIndicatorType === 'macd' ? 9 : undefined,
      enabled: true
    };
    
    onChange([...indicators, newIndicator]);
  };
  
  const handleRemoveIndicator = (id: string) => {
    onChange(indicators.filter(ind => ind.id !== id));
  };
  
  const handleUpdateIndicator = (id: string, field: string, value: any) => {
    onChange(indicators.map(ind => {
      if (ind.id === id) {
        return { ...ind, [field]: value };
      }
      return ind;
    }));
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center">
        <h3 className="text-lg font-medium">Technical Analysis Triggers</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 h-6 w-6 p-0">
                <Info className="h-4 w-4 text-[#375BD2]" />
                <span className="sr-only">Chainlink information</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-md bg-gray-900 border border-[#375BD2]/40 p-4 shadow-lg">
              <div className="space-y-2">
                <p className="font-medium text-[#375BD2]">Chainlink Price Feeds</p>
                <p className="text-xs text-gray-300">Technical triggers use Chainlink's tamper-proof price data to ensure accurate and reliable exit conditions. When an indicator's conditions are met, the smart contract will execute the defined exit strategy automatically.</p>
                <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
                  <li>Decentralized price feeds from 100+ validators</li>
                  <li>Aggregated from premium data providers</li>
                  <li>Secured by economic incentives</li>
                  <li>Used by top DeFi platforms</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-sm text-gray-400">
        Set up automated exit conditions based on technical indicators and Chainlink oracle data
      </p>
      
      {indicators.length === 0 ? (
        <Card className="bg-black/20 border-gray-800">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-400 mb-4">No technical indicators configured yet</p>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleAddIndicator}
                className="bg-black/30 border-gray-700 hover:bg-gray-800"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Indicator
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {indicators.map(indicator => (
            <Card key={indicator.id} className="bg-black/20 border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            {INDICATOR_CONFIGS[indicator.type].icon}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-gray-900 border border-gray-700 p-3 shadow-lg">
                          <div className="space-y-2">
                            <p className="font-medium text-sm">{INDICATOR_CONFIGS[indicator.type].label} Indicator</p>
                            <p className="text-xs text-gray-300">
                              {indicator.type === 'ma' && 
                                'Moving Averages smooth out price data to create a trend-following indicator. They help identify the direction of the trend and potential support/resistance levels.'}
                              {indicator.type === 'rsi' && 
                                'Relative Strength Index (RSI) measures the speed and change of price movements. It oscillates between 0 and 100, with values above 70 indicating overbought conditions and below 30 indicating oversold conditions.'}
                              {indicator.type === 'macd' && 
                                'Moving Average Convergence Divergence (MACD) shows the relationship between two moving averages of a security\'s price. The MACD line is the difference between a fast and slow exponential moving average.'}
                              {indicator.type === 'volume' && 
                                'Volume indicators measure the strength of a trend based on trading volume. Increasing volume often confirms the direction of the existing trend.'}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Shield className="h-3 w-3 text-[#375BD2]" />
                              <span>Verified by Chainlink Oracle</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <CardTitle className="ml-2 text-sm">
                      {INDICATOR_CONFIGS[indicator.type].label}
                    </CardTitle>
                  </div>
                  <Switch
                    checked={indicator.enabled}
                    onCheckedChange={(checked) => handleUpdateIndicator(indicator.id, 'enabled', checked)}
                  />
                </div>
                <CardDescription className="text-xs">
                  {INDICATOR_CONFIGS[indicator.type].description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-300">Indicator Period</Label>
                    <Select 
                      value={indicator.period.toString()} 
                      onValueChange={(val) => handleUpdateIndicator(indicator.id, 'period', parseInt(val))}
                    >
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {INDICATOR_CONFIGS[indicator.type].periods.map(period => (
                          <SelectItem key={period} value={period.toString()}>
                            {period} {indicator.type === 'ma' ? 'day' : ''} {indicator.type === 'ma' ? (period > 50 ? 'SMA' : 'EMA') : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-300">Condition</Label>
                    <Select 
                      value={indicator.condition} 
                      onValueChange={(val) => handleUpdateIndicator(indicator.id, 'condition', val)}
                    >
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {INDICATOR_CONFIGS[indicator.type].conditions.map(cond => (
                          <SelectItem key={cond.value} value={cond.value}>
                            {cond.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {INDICATOR_CONFIGS[indicator.type].hasValue && (
                  <div>
                    <Label className="text-xs text-gray-300">
                      {indicator.type === 'rsi' ? 'RSI Value' : 'Volume Threshold (%)'}
                    </Label>
                    <Input
                      type="number"
                      value={indicator.value}
                      onChange={(e) => handleUpdateIndicator(
                        indicator.id, 
                        'value', 
                        parseInt(e.target.value) || 0
                      )}
                      className="mt-1 bg-gray-800 border-gray-700"
                    />
                  </div>
                )}
                
                {INDICATOR_CONFIGS[indicator.type].hasSecondaryParams && indicator.type === 'macd' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-300">Fast Period</Label>
                      <Input
                        type="number"
                        value={indicator.period}
                        onChange={(e) => handleUpdateIndicator(
                          indicator.id, 
                          'period', 
                          parseInt(e.target.value) || 0
                        )}
                        className="mt-1 bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Slow Period</Label>
                      <Input
                        type="number"
                        value={indicator.secondaryPeriod}
                        onChange={(e) => handleUpdateIndicator(
                          indicator.id, 
                          'secondaryPeriod', 
                          parseInt(e.target.value) || 0
                        )}
                        className="mt-1 bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Signal Period</Label>
                      <Input
                        type="number"
                        value={indicator.signalPeriod}
                        onChange={(e) => handleUpdateIndicator(
                          indicator.id, 
                          'signalPeriod', 
                          parseInt(e.target.value) || 0
                        )}
                        className="mt-1 bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIndicator(indicator.id)}
                    className="text-gray-400 hover:text-white hover:bg-red-900/30"
                  >
                    <MinusCircle className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="mt-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Label className="text-xs text-gray-300">Add New Indicator</Label>
                <Select 
                  value={selectedIndicatorType} 
                  onValueChange={setSelectedIndicatorType}
                >
                  <SelectTrigger className="mt-1 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select indicator type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="ma">Moving Average (MA)</SelectItem>
                    <SelectItem value="rsi">Relative Strength Index (RSI)</SelectItem>
                    <SelectItem value="macd">MACD</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAddIndicator}
                className="bg-[#3F51FF] hover:bg-[#3F51FF]/80"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-800 text-xs space-y-2">
        <div className="bg-[#375BD2]/10 p-3 rounded-md border border-[#375BD2]/30">
          <div className="flex items-center mb-1">
            <svg width="16" height="16" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M16 0L0 16L16 32V16H32L16 0Z" fill="#375BD2"/>
              <path d="M16 44L32 28L16 12V28H0L16 44Z" fill="#375BD2"/>
            </svg>
            <span className="text-[#375BD2] font-medium">Chainlink Oracle Network</span>
          </div>
          <p className="text-gray-400 text-xs">
            All technical indicators utilize Chainlink's decentralized oracle network for reliable, tamper-proof price data. 
            Indicators are calculated using time-weighted average prices (TWAP) from multiple trusted sources.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <div className="bg-gray-900/50 p-2 rounded-md border border-gray-800">
            <span className="text-[#375BD2] text-xs">Oracle Refresh Rate:</span>
            <p className="text-gray-400 text-xs">Every block (~12 seconds)</p>
          </div>
          <div className="bg-gray-900/50 p-2 rounded-md border border-gray-800">
            <span className="text-[#375BD2] text-xs">Supported Networks:</span>
            <p className="text-gray-400 text-xs">Ethereum, Solana, TON</p>
          </div>
          <div className="bg-gray-900/50 p-2 rounded-md border border-gray-800">
            <span className="text-[#375BD2] text-xs">Price Aggregation:</span>
            <p className="text-gray-400 text-xs">9+ exchange sources</p>
          </div>
        </div>
      </div>
    </div>
  );
}