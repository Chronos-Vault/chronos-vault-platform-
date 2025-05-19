import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';

/**
 * TransactionGraphCard component that safely renders the transaction graph
 * or shows a placeholder when no data is available
 */
export const TransactionGraphCard: React.FC = () => {
  const { transactionGroups } = useTransactionMonitoring();
  
  // Check if there are valid transaction groups
  const hasValidGroups = transactionGroups && 
    transactionGroups.length > 0 && 
    transactionGroups[0]?.metadata?.primaryTransaction;

  return (
    <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-purple-400" />
          Cross-Chain Transaction Graph
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 min-h-[300px] flex items-center justify-center">
        {hasValidGroups ? (
          <div className="relative w-full h-[300px]">
            {/* Graph visualization would go here in future implementation */}
            <div className="flex items-center justify-center h-full text-center">
              <div className="max-w-md">
                <p className="text-muted-foreground mb-2">
                  Transaction graph visualization is loading...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 max-w-sm mx-auto text-center">
            <Network className="h-12 w-12 text-[#6B00D7]/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Transaction Data</h3>
            <p className="text-muted-foreground text-sm">
              Transaction graph will be displayed when cross-chain verification data is available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};