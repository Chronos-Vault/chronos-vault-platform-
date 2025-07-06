import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingDown, Clock, ChartLine } from 'lucide-react';
import { simulateDeflationaryEffect, TOTAL_SUPPLY, ANNUAL_BURN_RATE } from '@/lib/cvt/token-service';

export interface CVTDeflationaryChartProps {
  className?: string;
}

export const CVTDeflationaryChart: React.FC<CVTDeflationaryChartProps> = ({ className }) => {
  const [defiationaryData, setDeflationaryData] = useState<Array<{
    year: number;
    projectedSupply: number;
    burnedAmount: number;
    percentBurned: number;
  }>>([]);
  
  const [chartView, setChartView] = useState<'supply' | 'burned'>('supply');
  
  useEffect(() => {
    // Simulate the deflationary effect over 30 years
    const data = simulateDeflationaryEffect(30);
    setDeflationaryData(data);
  }, []);
  
  if (defiationaryData.length === 0) {
    return null;
  }
  
  const maxChartValue = chartView === 'supply' ? TOTAL_SUPPLY : Math.max(...defiationaryData.map(d => d.burnedAmount));
  
  // Get significant data points for the table
  const keyYears = [0, 4, 8, 12, 16, 21, 30];
  const tableData = defiationaryData.filter(d => keyYears.includes(d.year));
  
  return (
    <Card className={`border border-[#6B00D7]/20 dark:border-[#6B00D7]/30 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <CardTitle>CVT Deflationary Model</CardTitle>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            {(ANNUAL_BURN_RATE * 100).toFixed(1)}% Annual Burn Rate
          </Badge>
        </div>
        <CardDescription>
          Visualizing the impact of CVT's deflationary mechanism over time (21M max supply)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chart">Visualization</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="pt-2">
            <div className="flex justify-center gap-3 mb-4">
              <Badge 
                onClick={() => setChartView('supply')} 
                className={`cursor-pointer ${chartView === 'supply' ? 'bg-[#6B00D7] text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <ChartLine className="h-3.5 w-3.5 mr-1" />
                Circulating Supply
              </Badge>
              <Badge 
                onClick={() => setChartView('burned')} 
                className={`cursor-pointer ${chartView === 'burned' ? 'bg-[#FF5AF7] text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <Flame className="h-3.5 w-3.5 mr-1" />
                Burned Supply
              </Badge>
            </div>
            
            <div className="h-64 relative mt-6">
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                {[0, 5, 10, 15, 20, 25, 30].map(year => (
                  <div key={year} className="text-center">
                    <div>Year {year}</div>
                  </div>
                ))}
              </div>
              
              {/* Y-axis grid lines */}
              <div className="absolute top-0 left-0 right-0 bottom-6 flex flex-col justify-between">
                {[1, 0.75, 0.5, 0.25, 0].map(line => (
                  <div key={line} className="w-full border-t border-gray-200 dark:border-gray-800 relative">
                    <span className="absolute -top-2.5 -left-8 text-xs text-gray-500">
                      {(maxChartValue * line).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Chart line - SVG approach */}
              <div className="absolute top-0 left-0 right-0 bottom-6 pl-8">
                <svg className="w-full h-full" viewBox={`0 0 30 100`} preserveAspectRatio="none">
                  {chartView === 'supply' ? (
                    <>
                      {/* Initial supply line */}
                      <path 
                        d={`M0,${100 - (defiationaryData[0].projectedSupply/maxChartValue * 100)} L30,${100 - (defiationaryData[0].projectedSupply/maxChartValue * 100)}`} 
                        stroke="#6B00D7" 
                        strokeWidth="1" 
                        strokeDasharray="5,3" 
                        opacity="0.5"
                      />
                      
                      {/* Supply curve */}
                      <path 
                        d={defiationaryData.map((point, i) => 
                          `${i === 0 ? 'M' : 'L'}${point.year},${100 - (point.projectedSupply/maxChartValue * 100)}`
                        ).join(' ')}
                        fill="none" 
                        stroke="#6B00D7" 
                        strokeWidth="2"
                      />
                      
                      {/* Key data points */}
                      {keyYears.map(year => {
                        const dataPoint = defiationaryData.find(d => d.year === year);
                        if (!dataPoint) return null;
                        return (
                          <circle 
                            key={year}
                            cx={dataPoint.year}
                            cy={100 - (dataPoint.projectedSupply/maxChartValue * 100)}
                            r="0.8"
                            fill="#6B00D7"
                            stroke="white"
                            strokeWidth="0.3"
                          />
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {/* Burned amount curve */}
                      <path 
                        d={defiationaryData.map((point, i) => 
                          `${i === 0 ? 'M' : 'L'}${point.year},${100 - (point.burnedAmount/maxChartValue * 100)}`
                        ).join(' ')}
                        fill="none" 
                        stroke="#FF5AF7" 
                        strokeWidth="2"
                      />
                      
                      {/* Area under curve */}
                      <path 
                        d={`
                          ${defiationaryData.map((point, i) => 
                            `${i === 0 ? 'M' : 'L'}${point.year},${100 - (point.burnedAmount/maxChartValue * 100)}`
                          ).join(' ')}
                          L${defiationaryData[defiationaryData.length - 1].year},100
                          L0,100
                          Z
                        `}
                        fill="url(#burnGradient)"
                        opacity="0.2"
                      />
                      
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="burnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FF5AF7" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#FF5AF7" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      
                      {/* Key data points */}
                      {keyYears.map(year => {
                        const dataPoint = defiationaryData.find(d => d.year === year);
                        if (!dataPoint) return null;
                        return (
                          <circle 
                            key={year}
                            cx={dataPoint.year}
                            cy={100 - (dataPoint.burnedAmount/maxChartValue * 100)}
                            r="0.8"
                            fill="#FF5AF7"
                            stroke="white"
                            strokeWidth="0.3"
                          />
                        );
                      })}
                    </>
                  )}
                </svg>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between text-sm">
              <div className="text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Timeline: 30 years
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" /> 
                  Maximum Supply: {TOTAL_SUPPLY.toLocaleString()} CVT
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 font-medium">Year</th>
                    <th className="text-right p-2 font-medium">Projected Supply</th>
                    <th className="text-right p-2 font-medium">Burned Amount</th>
                    <th className="text-right p-2 font-medium">% Burned</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={row.year} className={i % 2 === 0 ? 'bg-muted/20' : 'bg-background'}>
                      <td className="p-2 font-medium">Year {row.year}</td>
                      <td className="text-right p-2">
                        {row.projectedSupply.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </td>
                      <td className="text-right p-2">
                        <span className="flex items-center justify-end gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {row.burnedAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </span>
                      </td>
                      <td className="text-right p-2">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {row.percentBurned.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-muted/30 p-3 rounded-md">
              <p className="flex items-start gap-2">
                <Flame className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>
                  The CVT token implements a deflationary mechanism with a {(ANNUAL_BURN_RATE * 100).toFixed(1)}% annual burn rate, leading to approximately {(defiationaryData[defiationaryData.length - 1].percentBurned).toFixed(1)}% of the total supply being burned over 30 years.
                </span>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
