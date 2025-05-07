import React from 'react';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  CheckCircle, 
  Layers, 
  Network, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Zap
} from 'lucide-react';
import { TransactionStatus, VerificationStatus } from '@shared/transaction-types';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  onClick 
}) => {
  return (
    <Card 
      className={`border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7]">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{trend.value}% from previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TransactionStatsProps {
  className?: string;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ className }) => {
  const { 
    transactions, 
    transactionGroups,
    getTransactionsByNetwork,
    getTransactionsByStatus,
    getTransactionsByVerificationStatus
  } = useTransactionMonitoring();

  // Calculate statistics
  const totalTransactions = transactions.length;
  const totalGroups = transactionGroups.length;
  
  // Status counts
  const statusCounts: Record<TransactionStatus, number> = {
    pending: getTransactionsByStatus('pending').length,
    confirming: getTransactionsByStatus('confirming').length,
    confirmed: getTransactionsByStatus('confirmed').length,
    failed: getTransactionsByStatus('failed').length
  };
  
  // Verification status counts
  const verificationCounts: Record<VerificationStatus, number> = {
    not_required: getTransactionsByVerificationStatus('not_required').length,
    pending: getTransactionsByVerificationStatus('pending').length,
    verified: getTransactionsByVerificationStatus('verified').length,
    failed: getTransactionsByVerificationStatus('failed').length,
    timeout: getTransactionsByVerificationStatus('timeout').length
  };
  
  // Network distribution
  const ethereumTxCount = getTransactionsByNetwork('Ethereum').length;
  const solanaTxCount = getTransactionsByNetwork('Solana').length;
  const tonTxCount = getTransactionsByNetwork('TON').length;
  const bitcoinTxCount = getTransactionsByNetwork('Bitcoin').length;
  
  // Success rates
  const successRate = totalTransactions > 0 
    ? Math.round((statusCounts.confirmed / totalTransactions) * 100) 
    : 0;
    
  const verificationRate = (verificationCounts.pending + verificationCounts.verified) > 0
    ? Math.round((verificationCounts.verified / (verificationCounts.pending + verificationCounts.verified)) * 100)
    : 0;
  
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions}
          description="Across all blockchain networks"
          icon={<Activity className="h-5 w-5" />}
        />
        
        <StatCard 
          title="Transaction Groups" 
          value={totalGroups}
          description="Cross-chain linked transactions"
          icon={<Layers className="h-5 w-5" />}
        />
        
        <StatCard 
          title="Success Rate" 
          value={`${successRate}%`}
          description={`${statusCounts.confirmed} confirmed, ${statusCounts.failed} failed`}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{
            value: 5,
            isPositive: true
          }}
        />
        
        <StatCard 
          title="Verification Rate" 
          value={`${verificationRate}%`}
          description={`${verificationCounts.verified} verified, ${verificationCounts.failed} failed`}
          icon={<Network className="h-5 w-5" />}
          trend={{
            value: 3,
            isPositive: true
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        <StatCard 
          title="Pending" 
          value={statusCounts.pending}
          description="Awaiting confirmation"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        
        <StatCard 
          title="Confirming" 
          value={statusCounts.confirming}
          description="In progress confirmation"
          icon={<Zap className="h-5 w-5 text-blue-500" />}
        />
        
        <StatCard 
          title="Confirmed" 
          value={statusCounts.confirmed}
          description="Successfully completed"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        />
        
        <StatCard 
          title="Failed" 
          value={statusCounts.failed}
          description="Failed transactions"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
        />
        
        <StatCard 
          title="Timeout" 
          value={verificationCounts.timeout}
          description="Verification timeouts"
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <StatCard 
          title="Ethereum" 
          value={ethereumTxCount}
          description="Ethereum transactions"
          icon={<div className="font-mono text-lg">Ξ</div>}
        />
        
        <StatCard 
          title="Solana" 
          value={solanaTxCount}
          description="Solana transactions"
          icon={<div className="font-mono text-lg">◎</div>}
        />
        
        <StatCard 
          title="TON" 
          value={tonTxCount}
          description="TON transactions"
          icon={<div className="font-mono text-lg">💎</div>}
        />
        
        <StatCard 
          title="Bitcoin" 
          value={bitcoinTxCount}
          description="Bitcoin transactions"
          icon={<div className="font-mono text-lg">₿</div>}
        />
      </div>
    </div>
  );
};

export default TransactionStats;