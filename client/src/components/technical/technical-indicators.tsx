import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle, TrendingUp, Layers } from 'lucide-react';

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
    icon: <TrendingUp className="h-4 w-4" />,
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
    icon: <Layers className="h-4 w-4" />,
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
    icon: <TrendingUp className="h-4 w-4" />,
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
    icon: <Layers className="h-4 w-4" />,
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
      <h3 className="text-lg font-medium">Technical Analysis Triggers</h3>
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
                    {INDICATOR_CONFIGS[indicator.type].icon}
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
      
      <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-500">
        <p>All technical indicators are calculated using Chainlink oracle data for reliable on-chain price feeds.</p>
      </div>
    </div>
  );
}