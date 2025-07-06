import React, { useEffect, useRef, useState } from 'react';
import { TransactionGroup, CrossChainTransaction } from '@shared/transaction-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Eye, RefreshCw, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';

// Force graph node types
interface GraphNode {
  id: string;
  label: string;
  type: 'transaction' | 'wallet' | 'contract';
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  network: string;
  size?: number;
  tx?: CrossChainTransaction;
}

// Force graph edge types
interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'transaction' | 'verification' | 'signature';
  status: 'pending' | 'completed' | 'failed';
  animated?: boolean;
  dotted?: boolean;
}

// Network colors for badges and nodes
const networkColors = {
  'Ethereum': { bg: '#626890', light: '#8A92B2', text: '#FFFFFF' },
  'Solana': { bg: '#9945FF', light: '#B980FF', text: '#FFFFFF' },
  'TON': { bg: '#0098EA', light: '#33B1F0', text: '#FFFFFF' },
  'Bitcoin': { bg: '#F7931A', light: '#F9AB4C', text: '#FFFFFF' }
};

// Status colors
const statusColors = {
  'pending': { bg: '#F59E0B', text: '#FFFFFF' },
  'confirming': { bg: '#3B82F6', text: '#FFFFFF' },
  'confirmed': { bg: '#10B981', text: '#FFFFFF' },
  'failed': { bg: '#EF4444', text: '#FFFFFF' },
  'completed': { bg: '#10B981', text: '#FFFFFF' }
};

interface TransactionGraphProps {
  transactionGroup: TransactionGroup;
  width?: number;
  height?: number;
  onSelectTransaction?: (transaction: CrossChainTransaction) => void;
}

export const TransactionGraph: React.FC<TransactionGraphProps> = ({
  transactionGroup,
  width = 600,
  height = 400,
  onSelectTransaction
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  
  // Convert transaction group to graph nodes and edges
  const { nodes, edges } = React.useMemo(() => {
    const graphNodes: GraphNode[] = [];
    const graphEdges: GraphEdge[] = [];
    const addressNodes: Record<string, boolean> = {};
    const contractNodes: Record<string, boolean> = {};
    
    // Get primary transaction from group metadata
    const primaryTx = transactionGroup.metadata?.primaryTransaction;
    if (!primaryTx) {
      return { nodes: [], links: [] };
    }
    
    // Add from address node if not exists
    if (!addressNodes[primaryTx.fromAddress]) {
      graphNodes.push({
        id: primaryTx.fromAddress,
        label: `${primaryTx.fromAddress.substring(0, 6)}...${primaryTx.fromAddress.substring(primaryTx.fromAddress.length - 4)}`,
        type: 'wallet',
        status: 'confirmed',
        network: primaryTx.network
      });
      addressNodes[primaryTx.fromAddress] = true;
    }
    
    // Add transaction node
    graphNodes.push({
      id: primaryTx.id,
      label: primaryTx.label || primaryTx.type.replace('_', ' '),
      type: 'transaction',
      status: primaryTx.status,
      network: primaryTx.network,
      tx: primaryTx
    });
    
    // Add edge from address to transaction
    graphEdges.push({
      id: `${primaryTx.fromAddress}-${primaryTx.id}`,
      source: primaryTx.fromAddress,
      target: primaryTx.id,
      type: 'transaction',
      status: primaryTx.status === 'confirmed' ? 'completed' : primaryTx.status === 'failed' ? 'failed' : 'pending'
    });
    
    // Add to address or contract node if exists
    if (primaryTx.toAddress) {
      if (!addressNodes[primaryTx.toAddress]) {
        graphNodes.push({
          id: primaryTx.toAddress,
          label: `${primaryTx.toAddress.substring(0, 6)}...${primaryTx.toAddress.substring(primaryTx.toAddress.length - 4)}`,
          type: 'wallet',
          status: 'confirmed',
          network: primaryTx.network
        });
        addressNodes[primaryTx.toAddress] = true;
      }
      
      // Add edge from transaction to address
      graphEdges.push({
        id: `${primaryTx.id}-${primaryTx.toAddress}`,
        source: primaryTx.id,
        target: primaryTx.toAddress,
        type: 'transaction',
        status: primaryTx.status === 'confirmed' ? 'completed' : primaryTx.status === 'failed' ? 'failed' : 'pending'
      });
    } else if (primaryTx.contractAddress) {
      if (!contractNodes[primaryTx.contractAddress]) {
        graphNodes.push({
          id: primaryTx.contractAddress,
          label: `${primaryTx.contractAddress.substring(0, 6)}...${primaryTx.contractAddress.substring(primaryTx.contractAddress.length - 4)}`,
          type: 'contract',
          status: 'confirmed',
          network: primaryTx.network
        });
        contractNodes[primaryTx.contractAddress] = true;
      }
      
      // Add edge from transaction to contract
      graphEdges.push({
        id: `${primaryTx.id}-${primaryTx.contractAddress}`,
        source: primaryTx.id,
        target: primaryTx.contractAddress,
        type: 'transaction',
        status: primaryTx.status === 'confirmed' ? 'completed' : primaryTx.status === 'failed' ? 'failed' : 'pending'
      });
    }
    
    // Add verification transactions from group metadata
    const verificationTransactions = transactionGroup.metadata?.verificationTransactions || [];
    for (const verificationTx of verificationTransactions) {
      // Add from address node if not exists
      if (!addressNodes[verificationTx.fromAddress]) {
        graphNodes.push({
          id: verificationTx.fromAddress,
          label: `${verificationTx.fromAddress.substring(0, 6)}...${verificationTx.fromAddress.substring(verificationTx.fromAddress.length - 4)}`,
          type: 'wallet',
          status: 'confirmed',
          network: verificationTx.network
        });
        addressNodes[verificationTx.fromAddress] = true;
      }
      
      // Add transaction node
      graphNodes.push({
        id: verificationTx.id,
        label: verificationTx.label || 'Verification',
        type: 'transaction',
        status: verificationTx.status,
        network: verificationTx.network,
        tx: verificationTx
      });
      
      // Add edge from address to transaction
      graphEdges.push({
        id: `${verificationTx.fromAddress}-${verificationTx.id}`,
        source: verificationTx.fromAddress,
        target: verificationTx.id,
        type: 'transaction',
        status: verificationTx.status === 'confirmed' ? 'completed' : verificationTx.status === 'failed' ? 'failed' : 'pending'
      });
      
      // Add verification edge from primary transaction to verification transaction
      graphEdges.push({
        id: `${primaryTx.id}-${verificationTx.id}`,
        source: primaryTx.id,
        target: verificationTx.id,
        label: 'verifies',
        type: 'verification',
        status: verificationTx.status === 'confirmed' ? 'completed' : verificationTx.status === 'failed' ? 'failed' : 'pending',
        dotted: true
      });
      
      // Add to address or contract node if exists
      if (verificationTx.toAddress) {
        if (!addressNodes[verificationTx.toAddress]) {
          graphNodes.push({
            id: verificationTx.toAddress,
            label: `${verificationTx.toAddress.substring(0, 6)}...${verificationTx.toAddress.substring(verificationTx.toAddress.length - 4)}`,
            type: 'wallet',
            status: 'confirmed',
            network: verificationTx.network
          });
          addressNodes[verificationTx.toAddress] = true;
        }
        
        // Add edge from transaction to address
        graphEdges.push({
          id: `${verificationTx.id}-${verificationTx.toAddress}`,
          source: verificationTx.id,
          target: verificationTx.toAddress,
          type: 'transaction',
          status: verificationTx.status === 'confirmed' ? 'completed' : verificationTx.status === 'failed' ? 'failed' : 'pending'
        });
      } else if (verificationTx.contractAddress) {
        if (!contractNodes[verificationTx.contractAddress]) {
          graphNodes.push({
            id: verificationTx.contractAddress,
            label: `${verificationTx.contractAddress.substring(0, 6)}...${verificationTx.contractAddress.substring(verificationTx.contractAddress.length - 4)}`,
            type: 'contract',
            status: 'confirmed',
            network: verificationTx.network
          });
          contractNodes[verificationTx.contractAddress] = true;
        }
        
        // Add edge from transaction to contract
        graphEdges.push({
          id: `${verificationTx.id}-${verificationTx.contractAddress}`,
          source: verificationTx.id,
          target: verificationTx.contractAddress,
          type: 'transaction',
          status: verificationTx.status === 'confirmed' ? 'completed' : verificationTx.status === 'failed' ? 'failed' : 'pending'
        });
      }
    }
    
    return { nodes: graphNodes, edges: graphEdges };
  }, [transactionGroup]);
  
  // Simple force directed graph layout in canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const nodeRadius = 20;
    const repulsionForce = 0.2;
    const attractionForce = 0.05;
    const centerForce = 0.01;
    
    // Initialize node positions if not set
    nodes.forEach(node => {
      if (!node.x || !node.y) {
        node.x = Math.random() * width;
        node.y = Math.random() * height;
        node.vx = 0;
        node.vy = 0;
      }
    });
    
    // Simulation step
    const simulate = () => {
      // Apply forces
      nodes.forEach(node1 => {
        // Repulsion between nodes
        nodes.forEach(node2 => {
          if (node1 === node2) return;
          
          const dx = node1.x - node2.x;
          const dy = node1.y - node2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = repulsionForce / Math.max(distance, 1);
          
          node1.vx += (dx / distance) * force;
          node1.vy += (dy / distance) * force;
        });
        
        // Attraction along edges
        edges.forEach(edge => {
          if (edge.source === node1.id) {
            const target = nodes.find(n => n.id === edge.target);
            if (target) {
              const dx = target.x - node1.x;
              const dy = target.y - node1.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              node1.vx += dx * attractionForce;
              node1.vy += dy * attractionForce;
            }
          } else if (edge.target === node1.id) {
            const source = nodes.find(n => n.id === edge.source);
            if (source) {
              const dx = source.x - node1.x;
              const dy = source.y - node1.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              node1.vx += dx * attractionForce;
              node1.vy += dy * attractionForce;
            }
          }
        });
        
        // Center force
        node1.vx += (width / 2 - node1.x) * centerForce;
        node1.vy += (height / 2 - node1.y) * centerForce;
        
        // Apply velocity
        node1.x += node1.vx;
        node1.y += node1.vy;
        
        // Friction
        node1.vx *= 0.9;
        node1.vy *= 0.9;
        
        // Constrain to canvas
        node1.x = Math.max(nodeRadius, Math.min(width - nodeRadius, node1.x));
        node1.y = Math.max(nodeRadius, Math.min(height - nodeRadius, node1.y));
      });
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw edges
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return;
        
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        // Edge styling
        if (edge.dotted) {
          ctx.setLineDash([5, 3]);
        } else {
          ctx.setLineDash([]);
        }
        
        let strokeColor;
        switch (edge.status) {
          case 'completed':
            strokeColor = '#10B981';
            break;
          case 'failed':
            strokeColor = '#EF4444';
            break;
          default:
            strokeColor = '#9CA3AF';
        }
        
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = edge.type === 'verification' ? 2 : 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw edge label if any
        if (edge.label) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          
          ctx.font = '10px Arial';
          ctx.fillStyle = '#9CA3AF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.label, midX, midY - 10);
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        
        // Node styling
        let fillColor;
        let strokeColor;
        
        if (node.type === 'transaction') {
          // Transaction nodes
          fillColor = networkColors[node.network]?.bg || '#4B5563';
          strokeColor = networkColors[node.network]?.light || '#6B7280';
        } else if (node.type === 'wallet') {
          // Wallet nodes
          fillColor = '#1F2937';
          strokeColor = '#374151';
        } else {
          // Contract nodes
          fillColor = '#4B5563';
          strokeColor = '#6B7280';
        }
        
        // Highlight selected node
        if (node.id === selectedTxId) {
          strokeColor = '#F9FAFB';
          ctx.shadowColor = '#F9FAFB';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }
        
        // Draw node circle
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        
        // Add status indicator
        if (node.type === 'transaction') {
          ctx.beginPath();
          ctx.arc(node.x + nodeRadius - 5, node.y - nodeRadius + 5, 5, 0, Math.PI * 2);
          ctx.fillStyle = statusColors[node.status]?.bg || '#9CA3AF';
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();
        }
        
        // Draw node label
        ctx.font = '10px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const maxLength = 12;
        const label = node.label.length > maxLength 
          ? node.label.substring(0, maxLength - 3) + '...' 
          : node.label;
        
        ctx.fillText(label, node.x, node.y);
        
        if (node.type !== 'transaction') {
          ctx.font = '8px Arial';
          ctx.fillStyle = '#9CA3AF';
          ctx.fillText(node.type, node.x, node.y + 12);
        }
      });
    };
    
    // Handle clicks
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      let clicked = false;
      
      // Check if clicked on a node
      for (const node of nodes) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= nodeRadius) {
          if (node.type === 'transaction' && node.tx) {
            setSelectedTxId(node.id);
            if (onSelectTransaction) {
              onSelectTransaction(node.tx);
            }
            clicked = true;
          }
          break;
        }
      }
      
      if (!clicked) {
        setSelectedTxId(null);
      }
    };
    
    canvas.addEventListener('click', handleClick);
    
    // Start animation loop
    let animationFrame: number;
    const animate = () => {
      simulate();
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrame);
    };
  }, [nodes, edges, width, height, selectedTxId, onSelectTransaction]);
  
  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="border border-[#333] rounded-md bg-[#111]"
      />
    </div>
  );
};

interface TransactionGraphCardProps {
  transactionGroup: TransactionGroup;
  width?: number;
  height?: number;
  onSelectTransaction?: (transaction: CrossChainTransaction) => void;
}

export const TransactionGraphCard: React.FC<TransactionGraphCardProps> = ({
  transactionGroup,
  width = 600,
  height = 400,
  onSelectTransaction
}) => {
  return (
    <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Cross-Chain Transaction Flow</CardTitle>
            <CardDescription>
              Visual representation of transaction relationships
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={
              transactionGroup.status === 'completed' ? 'default' : 
              transactionGroup.status === 'failed' ? 'destructive' : 
              'outline'
            }>
              {transactionGroup.status === 'completed' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : transactionGroup.status === 'failed' ? (
                <XCircle className="h-3 w-3 mr-1" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {transactionGroup.status}
            </Badge>
            <Badge variant="outline">
              <Shield className="h-3 w-3 mr-1" />
              Level {transactionGroup.securityLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionGraph 
          transactionGroup={transactionGroup}
          width={width}
          height={height}
          onSelectTransaction={onSelectTransaction}
        />
      </CardContent>
      <CardFooter className="bg-[#1A1A1A]/50 border-t border-[#6B00D7]/10 flex justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['Ethereum', 'Solana', 'TON', 'Bitcoin'].map(network => {
            // Get transactions from metadata
            const primaryTx = transactionGroup.metadata?.primaryTransaction;
            const verificationTxs = transactionGroup.metadata?.verificationTransactions || [];
            
            // Filter transactions by network
            const networkTxs = [primaryTx, ...verificationTxs]
              .filter(tx => tx && tx.network === network);
            
            if (networkTxs.length === 0) return null;
            
            return (
              <Badge key={network} variant="outline" className={networkColors[network] ? `bg-[${networkColors[network].bg}]/20 text-[${networkColors[network].bg}] border-[${networkColors[network].bg}]/50` : ''}>
                {network}: {networkTxs.length}
              </Badge>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 h-7 px-2">
          <Eye className="h-3 w-3" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};