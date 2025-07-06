import React from 'react';
import { ArrowRight, AlertCircle, PiggyBank, Layers, Loader2 } from 'lucide-react';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { NetworkConfig, NETWORK_CONFIG } from '@/lib/cross-chain/bridge';

interface CrossChainVisualizerProps {
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  transferStatus?: 'pending' | 'initiated' | 'in_progress' | 'completed' | 'failed';
  sourceToken?: string;
  targetToken?: string;
  transferAmount?: number;
  estimatedTime?: string;
  progress?: number; // 0-100
  transferRoute?: Array<{
    network: BlockchainType;
    protocol: string;
  }>;
}

export default function CrossChainVisualizer({
  sourceChain,
  targetChain,
  transferStatus = 'pending',
  sourceToken,
  targetToken,
  transferAmount,
  estimatedTime,
  progress = 0,
  transferRoute = []
}: CrossChainVisualizerProps) {

  const sourceConfig = NETWORK_CONFIG[sourceChain];
  const targetConfig = NETWORK_CONFIG[targetChain];
  
  // Generate status display
  const getStatusDisplay = () => {
    switch (transferStatus) {
      case 'initiated':
        return (
          <div className="flex items-center gap-2 text-amber-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Transfer Initiated</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-2 text-blue-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Transfer In Progress</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-green-500">
            <PiggyBank className="h-4 w-4" />
            <span>Transfer Complete</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>Transfer Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <Layers className="h-4 w-4" />
            <span>Ready to Transfer</span>
          </div>
        );
    }
  };

  // Create blockchain node with logo and name
  const BlockchainNode = ({ config, isSource = false, isTarget = false, token, amount }: { 
    config: NetworkConfig, 
    isSource?: boolean, 
    isTarget?: boolean,
    token?: string,
    amount?: number
  }) => (
    <div className={`
      relative min-w-[150px] p-4 rounded-lg border 
      ${isSource ? 'border-primary/50 bg-primary/10' : 
        isTarget ? 'border-primary/50 bg-primary/10' : 
        'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
    `}>
      <div className="flex flex-col items-center">
        {/* Blockchain Info */}
        <div className="flex items-center justify-center mb-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {config.name.substring(0, 1)}
          </div>
          <span className="font-semibold">{config.name}</span>
        </div>
        
        {/* Token Information */}
        {token && (
          <div className="text-center mt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isSource ? 'Sending' : 'Receiving'}
            </div>
            <div className="font-medium">
              {amount && `${amount} `}{token}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Create a connecting path between blockchain nodes
  const ConnectionPath = ({ status, progress }: { status: string, progress: number }) => {
    const getPathColor = () => {
      switch (status) {
        case 'completed': return 'bg-green-500';
        case 'failed': return 'bg-red-500';
        case 'in_progress': return 'bg-blue-500';
        case 'initiated': return 'bg-amber-500';
        default: return 'bg-gray-300 dark:bg-gray-600';
      }
    };

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-2">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getPathColor()} transition-all duration-500 ease-in-out`}
            style={{ width: `${status === 'pending' ? 0 : progress}%` }}
          />
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {estimatedTime && (
            <span>{estimatedTime}</span>
          )}
        </div>
        
        <ArrowRight className="text-gray-400 my-1" />
      </div>
    );
  };

  // Display the route if available
  const RouteDisplay = () => (
    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
      <div className="font-semibold mb-1">Bridge Route:</div>
      <div className="space-y-1">
        {transferRoute.length > 0 ? (
          transferRoute.map((step, index) => (
            <div key={index} className="flex items-center">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded mr-2">
                {index + 1}
              </span>
              <span>
                {step.network} via {step.protocol}
                {index < transferRoute.length - 1 && ' → '}
              </span>
            </div>
          ))
        ) : (
          <div>Direct transfer from {sourceChain} to {targetChain}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Cross-Chain Transfer</h3>
        {getStatusDisplay()}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <BlockchainNode 
          config={sourceConfig} 
          isSource={true} 
          token={sourceToken}
          amount={transferAmount}
        />
        
        <ConnectionPath status={transferStatus} progress={progress} />
        
        <BlockchainNode 
          config={targetConfig} 
          isTarget={true} 
          token={targetToken}
          amount={transferAmount}
        />
      </div>
      
      <RouteDisplay />
    </div>
  );
}