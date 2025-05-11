import { useState } from 'react';
import { motion } from 'framer-motion';
import { LockClosed, Shield, ArrowRight, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Block {
  id: number;
  data: string;
  hash: string;
  prevHash: string;
}

export const BlockchainDemo = ({ 
  onInteract 
}: { 
  onInteract: () => void;
}) => {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 1,
      data: "Genesis Block",
      hash: "0x8C7dF7f29e01A5",
      prevHash: "0x0000000000000"
    }
  ]);
  
  const [newBlockData, setNewBlockData] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Simple hash function for demo purposes
  const createHash = (data: string, prevHash: string): string => {
    const combined = data + prevHash;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }
    return "0x" + Math.abs(hash).toString(16).substring(0, 12);
  };
  
  const addBlock = () => {
    if (!newBlockData.trim()) return;
    
    const lastBlock = blocks[blocks.length - 1];
    const newBlock: Block = {
      id: lastBlock.id + 1,
      data: newBlockData,
      prevHash: lastBlock.hash,
      hash: createHash(newBlockData, lastBlock.hash)
    };
    
    setBlocks([...blocks, newBlock]);
    setNewBlockData("");
    
    if (!hasInteracted) {
      setHasInteracted(true);
      onInteract();
    }
  };
  
  const tamperedIndex = blocks.findIndex((block, index) => {
    if (index === 0) return false;
    return block.prevHash !== blocks[index - 1].hash;
  });

  return (
    <div className="blockchain-demo p-4 flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                className={`block p-4 rounded-lg border-2 ${
                  index >= tamperedIndex && tamperedIndex !== -1
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-green-500 bg-green-50 dark:bg-green-900/20"
                } w-[180px]`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Block {block.id}</span>
                  {index >= tamperedIndex && tamperedIndex !== -1 ? (
                    <span className="text-red-500">Invalid</span>
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="text-xs mb-1 overflow-hidden text-ellipsis">
                  <span className="font-semibold">Data:</span> {block.data}
                </div>
                <div className="text-xs mb-1 overflow-hidden text-ellipsis">
                  <span className="font-semibold">Prev Hash:</span>
                  <span
                    className={
                      index > 0 && block.prevHash !== blocks[index - 1].hash
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {block.prevHash.substring(0, 10)}...
                  </span>
                </div>
                <div className="text-xs overflow-hidden text-ellipsis">
                  <span className="font-semibold">Hash:</span> {block.hash.substring(0, 10)}...
                </div>
                
                {index < blocks.length - 1 && (
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="add-block-form flex flex-col space-y-4">
        <h3 className="text-lg font-bold">Add New Block</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter transaction data..."
            value={newBlockData}
            onChange={(e) => setNewBlockData(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addBlock}>
            <Plus className="h-4 w-4 mr-2" /> Add Block
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Add a new block to see how each block's hash is used as the "previous hash" in the next block,
          creating an immutable chain of data.
        </p>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-primary mr-2" />
          <span className="text-sm font-medium">Blockchain Security</span>
        </div>
        <div className="flex items-center">
          <LockClosed className="h-5 w-5 text-[#FF5AF7] mr-2" />
          <span className="text-sm font-medium">Immutable Records</span>
        </div>
      </div>
    </div>
  );
};