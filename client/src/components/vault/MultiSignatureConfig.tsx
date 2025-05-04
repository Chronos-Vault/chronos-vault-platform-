import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Users, Shield, Globe, Clock, Lock, Wallet } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMultiChain } from '@/contexts/multi-chain-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Schema for an authorized signer
const signerSchema = z.object({
  address: z.string().min(10, { message: "Please enter a valid wallet address" }),
  name: z.string().optional(),
  weight: z.number().min(1).max(10).default(1),
});

// Schema for the multi-signature configuration
const multiSigConfigSchema = z.object({
  threshold: z.number().min(1).max(100),
  signers: z.array(signerSchema).min(2, { message: "At least 2 signers are required" }),
  timeLimit: z.number().min(1).optional(),
  requireGeolocation: z.boolean().default(false),
});

type Signer = z.infer<typeof signerSchema>;
type MultiSigConfig = z.infer<typeof multiSigConfigSchema>;

interface MultiSignatureConfigProps {
  vaultId?: number;
  onConfigChange?: (config: MultiSigConfig) => void;
  className?: string;
  defaultConfig?: Partial<MultiSigConfig>;
}

export function MultiSignatureConfig({
  vaultId,
  onConfigChange,
  className,
  defaultConfig,
}: MultiSignatureConfigProps) {
  const { toast } = useToast();
  const { walletInfo } = useMultiChain();
  const [signers, setSigners] = useState<Signer[]>([]);
  
  // Initialize with at least the owner's address
  useEffect(() => {
    if (defaultConfig?.signers && defaultConfig.signers.length > 0) {
      setSigners(defaultConfig.signers);
    } else if (walletInfo.ethereum.address) {
      setSigners([
        {
          address: walletInfo.ethereum.address,
          name: 'Owner',
          weight: 1,
        }
      ]);
    }
  }, [walletInfo.ethereum.address, defaultConfig]);

  // Create form with default values
  const form = useForm<MultiSigConfig>({
    resolver: zodResolver(multiSigConfigSchema),
    defaultValues: {
      threshold: defaultConfig?.threshold || 2,
      signers: signers,
      timeLimit: defaultConfig?.timeLimit || 24, // 24 hours default
      requireGeolocation: defaultConfig?.requireGeolocation || false,
    },
  });

  // Watch for changes to update parent component
  const watchedValues = form.watch();
  
  useEffect(() => {
    // Only notify parent if we have valid values
    if (signers.length >= 2 && watchedValues.threshold > 0) {
      const currentConfig = {
        ...watchedValues,
        signers: signers,
      };
      onConfigChange?.(currentConfig);
    }
  }, [watchedValues, signers, onConfigChange]);

  // Add a new signer
  const addSigner = () => {
    const newSigner: Signer = {
      address: '',
      name: `Signer ${signers.length + 1}`,
      weight: 1,
    };
    setSigners([...signers, newSigner]);
  };

  // Remove a signer by index
  const removeSigner = (index: number) => {
    if (signers.length <= 2) {
      toast({
        title: "Cannot remove signer",
        description: "At least 2 signers are required for a multi-signature vault",
        variant: "destructive",
      });
      return;
    }
    const newSigners = [...signers];
    newSigners.splice(index, 1);
    setSigners(newSigners);
  };

  // Update a signer's address
  const updateSignerAddress = (index: number, address: string) => {
    const newSigners = [...signers];
    newSigners[index].address = address;
    setSigners(newSigners);
  };

  // Update a signer's name
  const updateSignerName = (index: number, name: string) => {
    const newSigners = [...signers];
    newSigners[index].name = name;
    setSigners(newSigners);
  };

  // Update a signer's weight
  const updateSignerWeight = (index: number, weight: number) => {
    const newSigners = [...signers];
    newSigners[index].weight = weight;
    setSigners(newSigners);
  };

  return (
    <Card className={`${className || ''} border-purple-700/30 bg-black/40 shadow-xl`}>
      <CardHeader className="pb-4 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-white">
          <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
          Multi-Signature Configuration
        </CardTitle>
        <CardDescription className="text-sm md:text-base opacity-80">
          Setup trusted parties who must approve vault operations
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <Form {...form}>
          <div className="space-y-4">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                  <FormItem className="space-y-3 bg-black/20 rounded-lg p-4 border border-purple-600/20">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      Approval Threshold
                    </FormLabel>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center gap-3">
                        <Slider
                          min={1}
                          max={Math.max(signers.length, 2)}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="flex-1"
                        />
                        <div className="w-16 text-center">
                          <div className="rounded-md border border-purple-600/30 bg-purple-900/20 px-3 py-1.5 text-sm font-medium text-white">
                            {field.value}/{signers.length}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        At least <span className="text-purple-400 font-medium">{field.value}</span> out of <span className="text-purple-400 font-medium">{signers.length}</span> signers must approve
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem className="space-y-3 bg-black/20 rounded-lg p-4 border border-purple-600/20">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      Time Limit (hours)
                    </FormLabel>
                    <div className="space-y-3">
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={720} // 30 days max
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 24)}
                          className="h-10 bg-purple-900/10 border-purple-600/30 text-base md:text-sm"
                        />
                      </FormControl>
                      <div className="text-xs text-gray-400">
                        Signatures must be collected within this time window
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requireGeolocation"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 rounded-lg border border-purple-600/20 p-4 bg-gradient-to-br from-purple-900/10 to-black/40 shadow-inner">
                  <div className="space-y-1">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-500" />
                      Require Geolocation Verification
                    </FormLabel>
                    <p className="text-xs text-gray-400">
                      Signers must verify their location matches predefined safe zones
                    </p>
                  </div>
                  <FormControl>
                    <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-purple-900/20 border border-purple-600/30 hover:border-purple-500/70 transition-colors shadow-md">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="accent-purple-600 h-6 w-6"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0 bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg p-4 border border-purple-600/20">
                <div>
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Authorized Signers
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Add wallet addresses of trusted parties who can approve vault operations
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={addSigner}
                  className="gap-2 text-sm font-medium border-purple-600/50 hover:bg-purple-600/20 bg-black/20 h-11"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Signer
                </Button>
              </div>
              
              <div className="rounded-lg overflow-hidden border border-purple-600/30 divide-y divide-purple-600/10 bg-black/20 shadow-xl">
                {signers.map((signer, index) => (
                  <div key={index} className="p-4 flex flex-col gap-4 transition-colors hover:bg-purple-900/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-800/40 to-fuchsia-600/20 text-white text-sm font-medium border border-purple-600/30 shadow-inner">
                          {index + 1}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-sm font-medium text-white">{signer.name || `Signer ${index + 1}`}</span>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            <span className="truncate max-w-[180px]">{signer.address ? signer.address.substring(0, 8) + '...' + signer.address.substring(signer.address.length - 6) : 'No address yet'}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSigner(index)}
                        className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-700/10 border-red-500/20"
                        disabled={signers.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-7">
                        <FormLabel className="text-xs font-medium text-gray-400 mb-1.5 block">Wallet Address</FormLabel>
                        <Input
                          placeholder="0x..."
                          value={signer.address}
                          onChange={(e) => updateSignerAddress(index, e.target.value)}
                          className="h-10 text-xs sm:text-sm bg-black/30 border-purple-600/30 focus:border-purple-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <FormLabel className="text-xs font-medium text-gray-400 mb-1.5 block">Name (Optional)</FormLabel>
                        <Input
                          placeholder="Alice"
                          value={signer.name || ''}
                          onChange={(e) => updateSignerName(index, e.target.value)}
                          className="h-10 text-xs sm:text-sm bg-black/30 border-purple-600/30 focus:border-purple-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormLabel className="text-xs font-medium text-gray-400 mb-1.5 block">Weight</FormLabel>
                        <Select
                          value={signer.weight.toString()}
                          onValueChange={(value) => updateSignerWeight(index, parseInt(value))}
                        >
                          <SelectTrigger className="h-10 text-xs sm:text-sm bg-black/30 border-purple-600/30">
                            <SelectValue placeholder="1" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
