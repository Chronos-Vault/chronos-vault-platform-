import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCVTToken } from '@/contexts/cvt-token-context';
import { Coins, PieChart, ArrowRight, Users, Wrench, Handshake } from 'lucide-react';

type DistributionItem = {
  name: string;
  percentage: number;
  amount: string;
  color: string;
  icon: React.ReactNode;
  description: string;
};

export const CVTDistributionChart: React.FC = () => {
  const { totalSupply } = useCVTToken();
  
  const distribution: DistributionItem[] = [
    {
      name: 'Community & Ecosystem',
      percentage: 50,
      amount: '10,500,000',
      color: 'from-[#6B00D7] to-[#9B00FF]',
      icon: <Users className="h-5 w-5" />,
      description: 'Allocated for community rewards, staking incentives, and ecosystem growth'
    },
    {
      name: 'Development Fund',
      percentage: 25,
      amount: '5,250,000',
      color: 'from-[#FF5AF7] to-[#FF8AFF]',
      icon: <Wrench className="h-5 w-5" />,
      description: 'Reserved for ongoing platform development, security audits, and infrastructure'
    },
    {
      name: 'Team & Advisors',
      percentage: 15,
      amount: '3,150,000',
      color: 'from-[#00A3FF] to-[#00C2FF]',
      icon: <Coins className="h-5 w-5" />,
      description: 'Subject to 2-year vesting with 6-month cliff for long-term alignment'
    },
    {
      name: 'Partners & Liquidity',
      percentage: 10,
      amount: '2,100,000',
      color: 'from-[#00D1B2] to-[#00F5D4]',
      icon: <Handshake className="h-5 w-5" />,
      description: 'Strategic partnerships and cross-chain liquidity provisioning'
    }
  ];
  
  // Calculate the stroke dasharray and dashoffset for each segment
  const calculateCircleSegment = (percentage: number, index: number) => {
    const circumference = 2 * Math.PI * 40; // r=40
    const segmentLength = (percentage / 100) * circumference;
    
    // Calculate the offset based on previous segments
    let previousPercentage = 0;
    for (let i = 0; i < index; i++) {
      previousPercentage += distribution[i].percentage;
    }
    
    const dashOffset = circumference - (previousPercentage / 100) * circumference;
    
    return {
      strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,
      strokeDashoffset: dashOffset
    };
  };
  
  return (
    <Card className="w-full border border-[#6B00D7]/20 dark:border-[#6B00D7]/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-[#6B00D7]" />
          <CardTitle className="text-lg">CVT Token Distribution</CardTitle>
        </div>
        <CardDescription>
          Total Supply: {parseInt(totalSupply).toLocaleString()} CVT tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Chart Visualization */}
          <div className="relative w-80 h-80 flex-shrink-0">
            <svg width="160" height="160" viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Circular segments for distribution */}
              {distribution.map((item, index) => {
                const { strokeDasharray, strokeDashoffset } = calculateCircleSegment(item.percentage, index);
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={`url(#gradient-${index})`}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000 ease-in-out"
                    style={{ 
                      animation: `grow-segment 1.5s ease-out forwards ${index * 0.2}s`,
                      opacity: 0
                    }}
                  />
                );
              })}
              
              {/* Center info */}
              <circle cx="50" cy="50" r="30" className="fill-white dark:fill-black" />
              <text x="50" y="45" textAnchor="middle" className="fill-gray-900 dark:fill-white font-bold text-4">
                21M
              </text>
              <text x="50" y="55" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400 text-3">
                CVT
              </text>
            </svg>
            
            {/* Gradient definitions */}
            <svg width="0" height="0">
              <defs>
                {distribution.map((item, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`stop-${item.color.split(' ')[0].replace('from-', '')}`} />
                    <stop offset="100%" className={`stop-${item.color.split(' ')[1].replace('to-', '')}`} />
                  </linearGradient>
                ))}
              </defs>
            </svg>
            
            <style dangerouslySetInnerHTML={{ __html: `
              .stop-\\[\\#6B00D7\\] { stop-color: #6B00D7; }
              .stop-\\[\\#9B00FF\\] { stop-color: #9B00FF; }
              .stop-\\[\\#FF5AF7\\] { stop-color: #FF5AF7; }
              .stop-\\[\\#FF8AFF\\] { stop-color: #FF8AFF; }
              .stop-\\[\\#00A3FF\\] { stop-color: #00A3FF; }
              .stop-\\[\\#00C2FF\\] { stop-color: #00C2FF; }
              .stop-\\[\\#00D1B2\\] { stop-color: #00D1B2; }
              .stop-\\[\\#00F5D4\\] { stop-color: #00F5D4; }
              
              @keyframes grow-segment {
                from {
                  opacity: 0;
                  stroke-dasharray: 0 251.2;
                }
                to {
                  opacity: 1;
                }
              }
            `}} />
          </div>
          
          {/* Distribution Legend */}
          <div className="flex-1 space-y-4 w-full">
            {distribution.map((item, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0 text-white shadow-sm`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="font-bold text-[#6B00D7] dark:text-[#FF5AF7]">{item.percentage}%</div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm font-medium">{item.amount} CVT</div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6B00D7] dark:text-[#FF5AF7] flex items-center gap-1 text-sm">
                      Details
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
          <p>
            CVT has a fixed supply of 21 million tokens, with a transparent allocation structure designed 
            to ensure long-term project sustainability while maximizing community benefits. The token model 
            includes deflationary mechanisms through regular buyback and burn events, further increasing scarcity over time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};