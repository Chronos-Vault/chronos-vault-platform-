import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hourglass, Clock, ChevronRight, CalendarDays, HelpCircle } from 'lucide-react';
import { RELEASE_PERIODS, TIME_LOCKED_SUPPLY, INITIAL_CIRCULATION, TOTAL_SUPPLY } from '@/lib/cvt/token-service';

export interface CVTReleaseScheduleProps {
  className?: string;
}

export const CVTReleaseSchedule: React.FC<CVTReleaseScheduleProps> = ({ className }) => {
  // Calculate the cumulative release amount for each period
  const cumulativeReleases = RELEASE_PERIODS.map((period, index) => {
    const previousReleases = index === 0 
      ? INITIAL_CIRCULATION
      : INITIAL_CIRCULATION + RELEASE_PERIODS.slice(0, index)
          .reduce((sum, p) => sum + (TIME_LOCKED_SUPPLY * p.percentage), 0);
          
    const currentRelease = TIME_LOCKED_SUPPLY * period.percentage;
    const totalReleased = previousReleases + currentRelease;
    const percentageReleased = (totalReleased / TOTAL_SUPPLY) * 100;
    
    return {
      ...period,
      previousReleases,
      currentRelease,
      totalReleased,
      percentageReleased
    };
  });
  
  // Generate a timeline entry for Year 0 (initial circulation)
  const initialCirculationEntry = {
    year: 0,
    percentage: INITIAL_CIRCULATION / TOTAL_SUPPLY,
    previousReleases: 0,
    currentRelease: INITIAL_CIRCULATION,
    totalReleased: INITIAL_CIRCULATION,
    percentageReleased: (INITIAL_CIRCULATION / TOTAL_SUPPLY) * 100
  };
  
  // Combine initial and cumulative releases
  const allReleases = [initialCirculationEntry, ...cumulativeReleases];
  
  // Function to generate a color based on the year
  const getYearColor = (yearIndex: number): string => {
    const colors = [
      'bg-blue-500', // Initial
      'bg-purple-600', // Year 4
      'bg-indigo-600', // Year 8
      'bg-violet-600', // Year 12
      'bg-fuchsia-600', // Year 16
      'bg-pink-600', // Year 21
    ];
    return colors[yearIndex] || 'bg-gray-500';
  };
  
  return (
    <Card className={`border border-[#6B00D7]/20 dark:border-[#6B00D7]/30 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
              <Hourglass className="h-4 w-4 text-white" />
            </div>
            <CardTitle>21-Year Release Schedule</CardTitle>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            Halving-inspired
          </Badge>
        </div>
        <CardDescription>
          Progressive distribution model ensuring long-term stability and gradual token release
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-4 top-0 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 via-purple-600 to-pink-600"></div>
          
          {/* Timeline entries */}
          <div className="space-y-8 pl-11 pt-2 relative">
            {allReleases.map((release, index) => (
              <div key={index} className="relative pb-1">
                {/* Year marker */}
                <div className={`absolute -left-11 w-6 h-6 rounded-full ${getYearColor(index)} flex items-center justify-center shadow-md z-10`}>
                  <span className="text-xs font-bold text-white">{release.year}</span>
                </div>
                
                {/* Content */}
                <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="h-4 w-4 text-[#6B00D7] dark:text-[#FF5AF7]" />
                        <h4 className="font-semibold">
                          {index === 0 ? 'Initial Circulation' : `Year ${release.year} Release`}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Released this period</div>
                          <div className="font-medium">
                            {release.currentRelease.toLocaleString(undefined, {maximumFractionDigits: 0})} CVT
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Release Percentage</div>
                          <div className="font-medium">
                            {(release.percentage * 100).toFixed(1)}% of tokens
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Total Released</div>
                          <div className="font-medium">
                            {release.totalReleased.toLocaleString(undefined, {maximumFractionDigits: 0})} CVT
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Circulation %</div>
                          <div className="font-medium">
                            {release.percentageReleased.toFixed(1)}% of supply
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center" 
                        style={{
                          background: `conic-gradient(${getYearColor(index)} ${release.percentageReleased}%, transparent 0)`
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-black flex items-center justify-center">
                          <span className="text-sm font-bold">{Math.round(release.percentageReleased)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Future Entry */}
            <div className="relative">
              <div className="absolute -left-11 w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Complete circulation achieved after 21 years</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-md border border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <p>
            The CVT token release is designed with a halving-inspired model, gradually reducing the percentage of tokens released over 21 years. This approach balances the needs for initial utility while ensuring long-term value preservation through a controlled distribution schedule.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
