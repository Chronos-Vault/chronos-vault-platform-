import { useState, useEffect } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlockchainType } from "@/contexts/multi-chain-context";
import { Loader2 } from "lucide-react";

type SwapAsset = {
  blockchain: BlockchainType;
  tokenAddress: string;
  tokenSymbol: string;
  amount: string;
  decimals: number;
};

type SwapPair = {
  source: SwapAsset;
  destination: SwapAsset;
};

interface CrossChainSwapConfigProps {
  form: any; // Using any for form type to keep it flexible
}

export const CrossChainSwapConfig = ({ form }: CrossChainSwapConfigProps) => {
  const { toast } = useToast();
  const [selectedSourceChain, setSelectedSourceChain] = useState<BlockchainType>(BlockchainType.TON);
  const [selectedDestChain, setSelectedDestChain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [estimatedFees, setEstimatedFees] = useState<{[key: string]: number}>({});
  const [swapRate, setSwapRate] = useState<number | null>(null);
  const [isValidatingRate, setIsValidatingRate] = useState(false);
  
  const handleSourceChainChange = (value: string) => {
    const chain = value as BlockchainType;
    setSelectedSourceChain(chain);
    // Update the form values
    form.setValue("crossChainSource", chain);
  };
  
  const handleDestChainChange = (value: string) => {
    const chain = value as BlockchainType;
    setSelectedDestChain(chain);
    // Update the form values
    form.setValue("crossChainDestination", chain);
  };

  // When a user enters source amount, calculate destination amount based on rate
  const handleSourceAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sourceAmount = parseFloat(e.target.value) || 0;
    form.setValue("crossChainSourceAmount", e.target.value);
    
    if (swapRate && sourceAmount > 0) {
      const destAmount = (sourceAmount * swapRate).toFixed(6);
      form.setValue("crossChainDestAmount", destAmount);
    }
  };
  
  // Validate the swap rate between selected chains
  const validateSwapRate = async () => {
    setIsValidatingRate(true);
    try {
      // In a real implementation, this would call an API to get the current rate
      // For now, we'll simulate with static values
      
      let rate = 0;
      
      // Simulated rates between chains
      if (selectedSourceChain === BlockchainType.TON && selectedDestChain === BlockchainType.ETHEREUM) {
        rate = 0.00025; // 1 TON ≈ 0.00025 ETH
      } else if (selectedSourceChain === BlockchainType.TON && selectedDestChain === BlockchainType.SOLANA) {
        rate = 0.075; // 1 TON ≈ 0.075 SOL
      } else if (selectedSourceChain === BlockchainType.ETHEREUM && selectedDestChain === BlockchainType.TON) {
        rate = 4000; // 1 ETH ≈ 4000 TON
      } else if (selectedSourceChain === BlockchainType.ETHEREUM && selectedDestChain === BlockchainType.SOLANA) {
        rate = 300; // 1 ETH ≈ 300 SOL
      } else if (selectedSourceChain === BlockchainType.SOLANA && selectedDestChain === BlockchainType.TON) {
        rate = 13.33; // 1 SOL ≈ 13.33 TON
      } else if (selectedSourceChain === BlockchainType.SOLANA && selectedDestChain === BlockchainType.ETHEREUM) {
        rate = 0.0033; // 1 SOL ≈ 0.0033 ETH
      }
      
      setSwapRate(rate);
      
      // Update estimated fees
      const fees = {
        [BlockchainType.TON]: 0.1, // TON network fee
        [BlockchainType.ETHEREUM]: 0.001, // ETH gas fee
        [BlockchainType.SOLANA]: 0.00001, // SOL network fee
      };
      
      setEstimatedFees(fees);
      
      const sourceAmount = parseFloat(form.watch("crossChainSourceAmount")) || 0;
      if (sourceAmount > 0) {
        const destAmount = (sourceAmount * rate).toFixed(6);
        form.setValue("crossChainDestAmount", destAmount);
      }
      
      toast({
        title: "Swap rate validated",
        description: `Current rate: 1 ${getCurrencySymbol(selectedSourceChain)} = ${rate} ${getCurrencySymbol(selectedDestChain)}`,
      });
    } catch (error) {
      toast({
        title: "Failed to validate swap rate",
        description: "Could not get current exchange rate between chains",
        variant: "destructive",
      });
    } finally {
      setIsValidatingRate(false);
    }
  };
  
  // Get currency symbol for a blockchain
  const getCurrencySymbol = (chain: BlockchainType) => {
    switch (chain) {
      case BlockchainType.TON:
        return "TON";
      case BlockchainType.ETHEREUM:
        return "ETH";
      case BlockchainType.SOLANA:
        return "SOL";
      default:
        return "???"
    }
  };
  
  // Initialize form values
  useEffect(() => {
    form.setValue("crossChainSource", selectedSourceChain);
    form.setValue("crossChainDestination", selectedDestChain);
    form.setValue("crossChainSourceAmount", "");
    form.setValue("crossChainDestAmount", "");
    form.setValue("additionalChains", [selectedSourceChain, selectedDestChain]);
    form.setValue("htlcTimeout", "24"); // Default 24-hour timeout
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <Card className="border border-[#8B00D7]/20 bg-gradient-to-r from-[#1A1A1A] to-[#231A2A]">
        <CardHeader>
          <CardTitle className="text-xl text-[#8B00D7] font-semibold flex items-center gap-2">
            Cross-Chain Atomic Swap
            <Badge className="bg-[#8B00D7] text-white">Advanced</Badge>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Securely exchange assets between different blockchains in a decentralized, trustless manner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Chain Configuration */}
            <div className="space-y-4 border border-[#8B00D7]/30 rounded-lg p-4 bg-black/20">
              <h3 className="text-lg text-[#8B00D7] font-medium">Source Chain</h3>

              <FormField
                control={form.control}
                name="crossChainSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blockchain</FormLabel>
                    <Select
                      onValueChange={handleSourceChainChange}
                      defaultValue={selectedSourceChain}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source blockchain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BlockchainType.TON}>TON</SelectItem>
                        <SelectItem value={BlockchainType.ETHEREUM}>Ethereum</SelectItem>
                        <SelectItem value={BlockchainType.SOLANA}>Solana</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The blockchain where your assets currently reside
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crossChainSourceAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Swap</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="0.0" 
                          {...field} 
                          onChange={handleSourceAmountChange}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 sm:text-sm">
                            {getCurrencySymbol(selectedSourceChain)}
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Amount of {getCurrencySymbol(selectedSourceChain)} to swap
                      {estimatedFees[selectedSourceChain] && (
                        <span className="block text-xs mt-1 text-gray-400">
                          Network fee: ~{estimatedFees[selectedSourceChain]} {getCurrencySymbol(selectedSourceChain)}
                        </span>
                      )}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Destination Chain Configuration */}
            <div className="space-y-4 border border-[#8B00D7]/30 rounded-lg p-4 bg-black/20">
              <h3 className="text-lg text-[#8B00D7] font-medium">Destination Chain</h3>

              <FormField
                control={form.control}
                name="crossChainDestination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blockchain</FormLabel>
                    <Select
                      onValueChange={handleDestChainChange}
                      defaultValue={selectedDestChain}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination blockchain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BlockchainType.TON}>TON</SelectItem>
                        <SelectItem value={BlockchainType.ETHEREUM}>Ethereum</SelectItem>
                        <SelectItem value={BlockchainType.SOLANA}>Solana</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The blockchain where you want to receive assets
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crossChainDestAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Receive Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="text" placeholder="0.0" {...field} disabled />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 sm:text-sm">
                            {getCurrencySymbol(selectedDestChain)}
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Estimated amount you'll receive after swap
                      {estimatedFees[selectedDestChain] && (
                        <span className="block text-xs mt-1 text-gray-400">
                          Network fee: ~{estimatedFees[selectedDestChain]} {getCurrencySymbol(selectedDestChain)}
                        </span>
                      )}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Rate Validation */}
          <div className="flex flex-col items-center space-y-4 p-4 border border-[#8B00D7]/20 rounded-lg bg-black/20">
            <div className="text-center">
              {swapRate ? (
                <div className="text-xl font-semibold">
                  1 {getCurrencySymbol(selectedSourceChain)} = {swapRate} {getCurrencySymbol(selectedDestChain)}
                </div>
              ) : (
                <div className="text-gray-400">Click the button below to validate current swap rate</div>
              )}
            </div>
            <Button 
              onClick={validateSwapRate} 
              variant="outline" 
              className="border-[#8B00D7] text-[#8B00D7] hover:bg-[#8B00D7]/10"
              disabled={isValidatingRate}
            >
              {isValidatingRate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating Rate
                </>
              ) : (
                "Validate Swap Rate"
              )}
            </Button>
          </div>

          {/* HTLC Configuration */}
          <div className="space-y-4 border border-[#8B00D7]/20 rounded-lg p-4 bg-black/10">
            <h3 className="text-lg text-[#8B00D7] font-medium">Hash Time Locked Contract (HTLC) Settings</h3>
            <p className="text-sm text-gray-300">
              HTLC ensures your cross-chain swap executes securely, with a timeout for refund if the swap fails
            </p>
            
            <FormField
              control={form.control}
              name="htlcTimeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout Period (hours)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString() || "24"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    If the swap isn't completed within this time, you can recover your funds
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="enhanced-security" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="enhanced-security"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enable Triple-Chain Security
                </label>
                <p className="text-xs text-gray-400">
                  Use all three blockchains for enhanced security verification, at an additional cost for higher protection
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossChainSwapConfig;
