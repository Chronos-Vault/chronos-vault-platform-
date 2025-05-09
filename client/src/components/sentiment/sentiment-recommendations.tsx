import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Gauge, 
  MinusCircle, 
  Clock,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentRecommendationsProps {
  recommendations: string[];
  isLoading?: boolean;
  compact?: boolean;
}

export function SentimentRecommendations({
  recommendations,
  isLoading = false,
  compact = false
}: SentimentRecommendationsProps) {
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-indigo-400" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center items-center h-40">
            <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render no recommendations state
  if (recommendations.length === 0) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-indigo-400" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MinusCircle className="h-8 w-8 mb-2 text-gray-600" />
            <p>No recommendations available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render recommendations
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Gauge className="h-5 w-5 mr-2 text-indigo-400" />
          Action Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {recommendations.map((recommendation, index) => (
          <div 
            key={index} 
            className="p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5"
          >
            <p className="text-sm text-gray-300">
              {recommendation}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SentimentRecommendations;