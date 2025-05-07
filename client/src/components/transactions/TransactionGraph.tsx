import React, { useRef, useEffect, useState } from 'react';
import { CrossChainTransaction, TransactionGroup } from '@shared/transaction-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TransactionGraphProps {
  transactionGroup: TransactionGroup;
  onSelectTransaction?: (tx: CrossChainTransaction) => void;
  width?: number;
  height?: number;
}

interface Node {
  id: string;
  type: 'transaction' | 'chain';
  transaction?: CrossChainTransaction;
  chain?: string;
  group?: number;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
  type: 'verification' | 'correlation';
  status?: 'pending' | 'completed' | 'failed';
}

const chainColors = {
  'Ethereum': '#6366f1',
  'Solana': '#9333ea',
  'TON': '#3b82f6',
  'Bitcoin': '#f59e0b'
};

const statusColors = {
  'pending': '#f59e0b',
  'completed': '#10b981',
  'failed': '#ef4444'
};

const TransactionGraph: React.FC<TransactionGraphProps> = ({ 
  transactionGroup, 
  onSelectTransaction,
  width = 600, 
  height = 350 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  useEffect(() => {
    if (!svgRef.current || !transactionGroup) return;
    
    // In a production implementation, we would use D3.js to create
    // a force-directed graph visualization of the transaction relationships
    // For now, we'll create a simplified static visualization
    
    const svg = svgRef.current;
    
    // Clear existing content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Create a simple visualization showing the primary transaction
    // and its verification transactions
    
    // Create the central node (primary transaction)
    const centerX = width / 2;
    const centerY = height / 2;
    const primaryNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    primaryNode.setAttribute('cx', centerX.toString());
    primaryNode.setAttribute('cy', centerY.toString());
    primaryNode.setAttribute('r', '20');
    primaryNode.setAttribute('fill', '#10b981');
    primaryNode.setAttribute('stroke', 'white');
    primaryNode.setAttribute('stroke-width', '2');
    svg.appendChild(primaryNode);
    
    // Add primary transaction label
    const primaryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    primaryLabel.setAttribute('x', centerX.toString());
    primaryLabel.setAttribute('y', centerY.toString());
    primaryLabel.setAttribute('text-anchor', 'middle');
    primaryLabel.setAttribute('dominant-baseline', 'middle');
    primaryLabel.setAttribute('fill', 'white');
    primaryLabel.setAttribute('font-size', '10px');
    primaryLabel.setAttribute('font-weight', 'bold');
    primaryLabel.textContent = transactionGroup.primaryTransaction.type.charAt(0).toUpperCase();
    svg.appendChild(primaryLabel);
    
    // Add chain nodes
    const chains = new Set<string>();
    chains.add(transactionGroup.primaryTransaction.network);
    transactionGroup.verificationTransactions.forEach(tx => chains.add(tx.network));
    
    const chainNodes: Record<string, { x: number, y: number, element: SVGCircleElement }> = {};
    const chainRadius = 60;
    
    Array.from(chains).forEach((chain, index) => {
      const angle = (index * (2 * Math.PI)) / chains.size;
      const x = centerX + chainRadius * Math.cos(angle);
      const y = centerY + chainRadius * Math.sin(angle);
      
      // Create chain node
      const chainNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      chainNode.setAttribute('cx', x.toString());
      chainNode.setAttribute('cy', y.toString());
      chainNode.setAttribute('r', '15');
      chainNode.setAttribute('fill', chainColors[chain as keyof typeof chainColors] || '#999');
      chainNode.setAttribute('stroke', 'white');
      chainNode.setAttribute('stroke-width', '2');
      svg.appendChild(chainNode);
      
      // Add chain label
      const chainLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      chainLabel.setAttribute('x', x.toString());
      chainLabel.setAttribute('y', y.toString());
      chainLabel.setAttribute('text-anchor', 'middle');
      chainLabel.setAttribute('dominant-baseline', 'middle');
      chainLabel.setAttribute('fill', 'white');
      chainLabel.setAttribute('font-size', '10px');
      chainLabel.setAttribute('font-weight', 'bold');
      chainLabel.textContent = chain.substring(0, 3);
      svg.appendChild(chainLabel);
      
      chainNodes[chain] = { x, y, element: chainNode };
    });
    
    // Connect primary transaction to its chain
    const primaryChain = transactionGroup.primaryTransaction.network;
    const primaryChainNode = chainNodes[primaryChain];
    
    if (primaryChainNode) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX.toString());
      line.setAttribute('y1', centerY.toString());
      line.setAttribute('x2', primaryChainNode.x.toString());
      line.setAttribute('y2', primaryChainNode.y.toString());
      line.setAttribute('stroke', statusColors[transactionGroup.primaryTransaction.status === 'confirmed' ? 'completed' : 'pending']);
      line.setAttribute('stroke-width', '2');
      svg.insertBefore(line, svg.firstChild);
    }
    
    // Add verification transactions
    transactionGroup.verificationTransactions.forEach((tx, index) => {
      const verificationCount = transactionGroup.verificationTransactions.length;
      const angle = ((index + 1) * (2 * Math.PI)) / (verificationCount + 1);
      const verificationRadius = 100;
      const x = centerX + verificationRadius * Math.cos(angle);
      const y = centerY + verificationRadius * Math.sin(angle);
      
      // Create verification node
      const txNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      txNode.setAttribute('cx', x.toString());
      txNode.setAttribute('cy', y.toString());
      txNode.setAttribute('r', '15');
      txNode.setAttribute('fill', '#6366f1');
      txNode.setAttribute('stroke', 'white');
      txNode.setAttribute('stroke-width', '2');
      svg.appendChild(txNode);
      
      // Add transaction label
      const txLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txLabel.setAttribute('x', x.toString());
      txLabel.setAttribute('y', y.toString());
      txLabel.setAttribute('text-anchor', 'middle');
      txLabel.setAttribute('dominant-baseline', 'middle');
      txLabel.setAttribute('fill', 'white');
      txLabel.setAttribute('font-size', '10px');
      txLabel.setAttribute('font-weight', 'bold');
      txLabel.textContent = 'V';
      svg.appendChild(txLabel);
      
      // Connect verification transaction to primary
      const primaryLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      primaryLine.setAttribute('x1', centerX.toString());
      primaryLine.setAttribute('y1', centerY.toString());
      primaryLine.setAttribute('x2', x.toString());
      primaryLine.setAttribute('y2', y.toString());
      primaryLine.setAttribute('stroke', '#aaa');
      primaryLine.setAttribute('stroke-width', '2');
      primaryLine.setAttribute('stroke-dasharray', '4');
      svg.insertBefore(primaryLine, svg.firstChild);
      
      // Connect verification transaction to its chain
      const txChain = tx.network;
      const txChainNode = chainNodes[txChain];
      
      if (txChainNode) {
        const chainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        chainLine.setAttribute('x1', x.toString());
        chainLine.setAttribute('y1', y.toString());
        chainLine.setAttribute('x2', txChainNode.x.toString());
        chainLine.setAttribute('y2', txChainNode.y.toString());
        chainLine.setAttribute('stroke', statusColors[tx.status === 'confirmed' ? 'completed' : tx.status === 'failed' ? 'failed' : 'pending']);
        chainLine.setAttribute('stroke-width', '2');
        svg.insertBefore(chainLine, svg.firstChild);
      }
      
      // Add click handler to show transaction details
      txNode.onclick = () => {
        setSelectedNode({
          id: tx.id,
          type: 'transaction',
          transaction: tx
        });
        
        if (onSelectTransaction) {
          onSelectTransaction(tx);
        }
      };
    });
    
    // Add click handler for primary transaction
    primaryNode.onclick = () => {
      setSelectedNode({
        id: transactionGroup.primaryTransaction.id,
        type: 'transaction',
        transaction: transactionGroup.primaryTransaction
      });
      
      if (onSelectTransaction) {
        onSelectTransaction(transactionGroup.primaryTransaction);
      }
    };
    
  }, [transactionGroup, width, height, onSelectTransaction]);
  
  if (!transactionGroup) {
    return <div>No transaction group data available</div>;
  }
  
  return (
    <div className="relative">
      <svg ref={svgRef} width={width} height={height} className="border rounded-md bg-muted/30 backdrop-blur-sm"></svg>
      {selectedNode && selectedNode.type === 'transaction' && selectedNode.transaction && (
        <div className="absolute top-2 right-2 bg-card border rounded-md p-3 shadow-md max-w-[250px]">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">
              {selectedNode.transaction.label || selectedNode.transaction.type.replace('_', ' ')}
            </h4>
            <div className="flex items-center gap-1">
              <Badge className="text-xs">{selectedNode.transaction.network}</Badge>
              <Badge className="text-xs" variant={
                selectedNode.transaction.status === 'confirmed' ? 'success' :
                selectedNode.transaction.status === 'failed' ? 'destructive' : 'outline'
              }>
                {selectedNode.transaction.status}
              </Badge>
            </div>
            <div className="text-xs font-mono mt-1 text-muted-foreground">
              {selectedNode.transaction.txHash.substring(0, 8)}...
              {selectedNode.transaction.txHash.substring(selectedNode.transaction.txHash.length - 8)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// TransactionGraphCard component with a card wrapper
interface TransactionGraphCardProps extends TransactionGraphProps {
  title?: string;
  description?: string;
  className?: string;
}

export const TransactionGraphCard: React.FC<TransactionGraphCardProps> = ({ 
  title = "Cross-Chain Transaction Flow", 
  description,
  className = "",
  ...props 
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <TransactionGraph {...props} />
      </CardContent>
    </Card>
  );
};

export default TransactionGraph;