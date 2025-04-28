import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SiTon, SiSolana, SiEthereum, SiBitcoin } from "react-icons/si";
import { useLocation } from 'wouter';

type BlockchainSelectorProps = {
  className?: string;
}

const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({ className }) => {
  const [_, navigate] = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <span>Select Blockchain</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Supported Blockchains</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/ton-integration')}
          >
            <SiTon className="mr-2 h-4 w-4 text-teal-500" />
            <span>TON Integration</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/solana-integration')}
          >
            <SiSolana className="mr-2 h-4 w-4 text-purple-500" />
            <span>Solana Integration</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer disabled:opacity-50"
            disabled
          >
            <SiEthereum className="mr-2 h-4 w-4 text-blue-500" />
            <span>Ethereum (Coming Soon)</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer disabled:opacity-50"
            disabled
          >
            <SiBitcoin className="mr-2 h-4 w-4 text-orange-500" />
            <span>Bitcoin (Coming Soon)</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlockchainSelector;