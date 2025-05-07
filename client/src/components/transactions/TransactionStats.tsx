import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';

interface TransactionStatsProps {
  className?: string;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ className = '' }) => {
  const { 
    transactions, 
    pendingTransactions, 
    transactionGroups,
    getTransactionsByNetwork,
    getTransactionsByVerificationStatus
  } = useTransactionMonitoring();
  
  // Calculate stats for each blockchain
  const ethTransactions = getTransactionsByNetwork('Ethereum');
  const solTransactions = getTransactionsByNetwork('Solana');
  const tonTransactions = getTransactionsByNetwork('TON');
  const btcTransactions = getTransactionsByNetwork('Bitcoin');
  
  // Calculate verification stats
  const pendingVerifications = getTransactionsByVerificationStatus('pending');
  const verifiedTransactions = getTransactionsByVerificationStatus('verified');
  const failedVerifications = getTransactionsByVerificationStatus('failed');
  
  // Cross-chain transactions are those with verification transactions
  const crossChainGroups = transactionGroups.filter(group => 
    group.verificationTransactions.length > 0
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{transactions.length}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-indigo-500/10">
                Ethereum: {ethTransactions.length}
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10">
                Solana: {solTransactions.length}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10">
                TON: {tonTransactions.length}
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10">
                BTC: {btcTransactions.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pending Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{pendingTransactions.length}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-amber-500/10">
                New: {pendingTransactions.filter(tx => tx.status === 'pending').length}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10">
                Confirming: {pendingTransactions.filter(tx => tx.status === 'confirming').length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{pendingVerifications.length + verifiedTransactions.length + failedVerifications.length}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-amber-500/10">
                Pending: {pendingVerifications.length}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10">
                Verified: {verifiedTransactions.length}
              </Badge>
              <Badge variant="outline" className="bg-red-500/10">
                Failed: {failedVerifications.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cross-Chain Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{crossChainGroups.length}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-indigo-500/10">
                Active: {crossChainGroups.filter(g => g.status === 'pending').length}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10">
                Completed: {crossChainGroups.filter(g => g.status === 'completed').length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStats;