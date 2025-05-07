import React from 'react';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Network,
  RadioTower,
  RefreshCw,
  Shield,
  XCircle
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change }) => {
  return (
    <div className={`bg-[#1A1A1A] border border-[#333] p-4 rounded-xl shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
          {change !== undefined && (
            <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}% in 24h
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const TransactionStats: React.FC = () => {
  const { 
    transactions, 
    transactionGroups, 
    getChainStats, 
    getTransactionSummary 
  } = useTransactionMonitoring();
  
  // Get chain statistics
  const chainStats = getChainStats();
  
  // Get transaction summary
  const summary = getTransactionSummary();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Transactions"
        value={transactions.length}
        icon={<Activity className="h-5 w-5 text-blue-500" />}
        color="blue"
      />
      <StatCard
        title="Verified Transactions"
        value={summary.verified}
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        color="green"
      />
      <StatCard
        title="Pending Transactions"
        value={summary.pending}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        color="amber"
        change={summary.pendingChangePercent}
      />
      <StatCard
        title="Failed Transactions"
        value={summary.failed}
        icon={<XCircle className="h-5 w-5 text-red-500" />}
        color="red"
      />
      <StatCard
        title="Cross-chain Groups"
        value={transactionGroups.length}
        icon={<Network className="h-5 w-5 text-purple-500" />}
        color="purple"
      />
      <StatCard
        title="Average Security Level"
        value={summary.avgSecurityLevel.toFixed(1)}
        icon={<Shield className="h-5 w-5 text-[#FF5AF7]" />}
        color="purple"
      />
      <StatCard
        title="Ethereum Activity"
        value={chainStats.Ethereum || 0}
        icon={<Activity className="h-5 w-5 text-indigo-500" />}
        color="indigo"
      />
      <StatCard
        title="Solana Activity"
        value={chainStats.Solana || 0}
        icon={<RadioTower className="h-5 w-5 text-purple-500" />}
        color="purple"
      />
      <StatCard
        title="TON Activity"
        value={chainStats.TON || 0}
        icon={<Network className="h-5 w-5 text-blue-500" />}
        color="blue"
      />
      <StatCard
        title="Bitcoin Activity"
        value={chainStats.Bitcoin || 0}
        icon={<Activity className="h-5 w-5 text-amber-500" />}
        color="amber"
      />
      <StatCard
        title="Verification Timeout"
        value={summary.verificationTimeout}
        icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
        color="orange"
      />
      <StatCard
        title="Confirming"
        value={summary.confirming}
        icon={<RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
        color="blue"
      />
    </div>
  );
};

export default TransactionStats;