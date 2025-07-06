import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatEther, parseEther } from "viem";

// Define form schema with Zod
const smartContractVaultSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  symbol: z.string().min(1, "Symbol is required").max(8, "Symbol must be 8 characters or less"),
  asset: z.string().min(42, "Please enter a valid asset address"), // ETH address validation is simplified here
  unlockTime: z.date().refine((date) => date > new Date(), {
    message: "Unlock time must be in the future",
  }),
  securityLevel: z.number().min(1).max(5),
  accessKey: z.string().optional(),
  isPublic: z.boolean().default(true),
  description: z.string().optional(),
  tags: z.string().optional(),
  enableCrossChain: z.boolean().default(false),
  enableMultiSig: z.boolean().default(false),
  enableGeoLock: z.boolean().default(false),
});

type FormValues = z.infer<typeof smartContractVaultSchema>;

// Define available assets (in a real app, this might come from an API)
const availableAssets = [
  { name: "ETH (Native)", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
  { name: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { name: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
  { name: "CVT (Chronos Token)", address: "0xCVT00000000000000000000000000000000000000" },
];

// Define security levels
const securityLevels = [
  { level: 1, name: "Standard", description: "Basic time-lock functionality" },
  { level: 2, name: "Enhanced", description: "Access key and authorized retrievers" },
  { level: 3, name: "Advanced", description: "Cross-chain verification" },
  { level: 4, name: "Maximum", description: "Multi-signature requirements" },
  { level: 5, name: "Fortress™", description: "Quantum-resistant encryption" },
];

export default function CreateSmartContractVault() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const defaultValues: Partial<FormValues> = {
    securityLevel: 1,
    isPublic: true,
    enableCrossChain: false,
    enableMultiSig: false,
    enableGeoLock: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(smartContractVaultSchema),
    defaultValues,
  });

  const selectedSecurityLevel = form.watch("securityLevel");
  const enableCrossChain = form.watch("enableCrossChain");
  const enableMultiSig = form.watch("enableMultiSig");
  const enableGeoLock = form.watch("enableGeoLock");

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  async function onSubmit(data: FormValues) {
    try {
      setIsCreating(true);
      console.log("Creating vault with data:", data);

      // Here we would connect to the blockchain and create the vault
      // This is a simplified placeholder for the actual blockchain interaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Success!",
        description: "Your Smart Contract Vault has been created",
      });

      // Reset form
      form.reset(defaultValues);
      setStep(1);
    } catch (error) {
      console.error("Error creating vault:", error);
      toast({
        title: "Error",
        description: "Failed to create vault. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="bg-[#151515] border-[#333]">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Create Smart Contract Vault</CardTitle>
          <CardDescription className="text-gray-400">
            Deploy an ERC-4626 compliant vault contract on Ethereum with advanced security features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className="flex items-center"
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${step > i + 1 ? "bg-[#00E5A0] text-black" : step === i + 1 ? "bg-[#FF5AF7] text-white" : "bg-[#333] text-gray-400"}`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`h-1 w-24 ${step > i + 1 ? "bg-[#00E5A0]" : "bg-[#333]"}`}></div>
                )}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Vault Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Smart Contract Vault" {...field} className="bg-[#202020] border-[#444] text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          A descriptive name for your vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Token Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="CVT" {...field} className="bg-[#202020] border-[#444] text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          The symbol for your vault token (e.g., CVT)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="asset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Asset Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#202020] border-[#444] text-white">
                              <SelectValue placeholder="Select an asset to secure" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#202020] border-[#444]">
                            {availableAssets.map((asset) => (
                              <SelectItem key={asset.address} value={asset.address} className="text-white hover:bg-[#333]">
                                {asset.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          The asset this vault will manage
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unlockTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Unlock Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''} 
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            className="bg-[#202020] border-[#444] text-white" 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          When the vault will unlock and allow withdrawals
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#333] p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-[#FF5AF7]"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white">Public Vault</FormLabel>
                          <FormDescription className="text-gray-400">
                            Make this vault visible to everyone on the Chronos Vault platform
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Security Configuration</h3>

                  <FormField
                    control={form.control}
                    name="securityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Security Level</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              defaultValue={[field.value]}
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={(values) => field.onChange(values[0])}
                              className="w-full"
                            />
                            <div className="flex justify-between">
                              {securityLevels.map((level) => (
                                <div 
                                  key={level.level}
                                  className={`text-center ${level.level === selectedSecurityLevel ? 'text-[#FF5AF7] font-bold' : 'text-gray-400'}`}
                                  style={{ width: '20%' }}
                                >
                                  {level.level}
                                </div>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <div className="mt-4 p-4 rounded-lg bg-[#202020] border border-[#444]">
                          <h4 className="font-medium text-white">
                            {securityLevels.find(l => l.level === selectedSecurityLevel)?.name}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {securityLevels.find(l => l.level === selectedSecurityLevel)?.description}
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedSecurityLevel >= 2 && (
                    <FormField
                      control={form.control}
                      name="accessKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Access Key</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Secure access key" 
                              {...field} 
                              className="bg-[#202020] border-[#444] text-white" 
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Required for security levels 2 and above
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Advanced Security Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="enableCrossChain"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#333] p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={selectedSecurityLevel < 3}
                                className="data-[state=checked]:bg-[#FF5AF7]"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className={`${selectedSecurityLevel < 3 ? 'text-gray-500' : 'text-white'}`}>
                                Cross-Chain Verification
                              </FormLabel>
                              <FormDescription className="text-gray-400">
                                Enable Triple-Chain Security™
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enableMultiSig"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#333] p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={selectedSecurityLevel < 4}
                                className="data-[state=checked]:bg-[#FF5AF7]"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className={`${selectedSecurityLevel < 4 ? 'text-gray-500' : 'text-white'}`}>
                                Multi-Signature
                              </FormLabel>
                              <FormDescription className="text-gray-400">
                                Require multiple approvals
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enableGeoLock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#333] p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={selectedSecurityLevel < 3}
                                className="data-[state=checked]:bg-[#FF5AF7]"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className={`${selectedSecurityLevel < 3 ? 'text-gray-500' : 'text-white'}`}>
                                Geo-Location Lock
                              </FormLabel>
                              <FormDescription className="text-gray-400">
                                Restrict access by location
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Vault Metadata</h3>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the purpose of this vault..." 
                            {...field} 
                            className="bg-[#202020] border-[#444] text-white resize-none h-24" 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Optional description of your vault's purpose
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="assets, savings, inheritance, etc." 
                            {...field} 
                            className="bg-[#202020] border-[#444] text-white" 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Comma-separated tags to categorize your vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-6 bg-[#202020] rounded-lg border border-[#444] mt-8">
                    <h4 className="text-lg font-semibold text-white mb-4">Deployment Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Gas:</span>
                        <span className="text-white">0.012 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Security Level:</span>
                        <span className="text-white">
                          <Badge className="bg-[#FF5AF7] text-white">
                            {securityLevels.find(l => l.level === selectedSecurityLevel)?.name}
                          </Badge>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network:</span>
                        <span className="text-white">Ethereum (Sepolia Testnet)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cross-Chain Security:</span>
                        <span className="text-white">{enableCrossChain ? "Enabled" : "Disabled"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Multi-Signature:</span>
                        <span className="text-white">{enableMultiSig ? "Enabled" : "Disabled"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Geo-Location:</span>
                        <span className="text-white">{enableGeoLock ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 ? (
                  <Button 
                    type="button" 
                    onClick={goToPreviousStep}
                    variant="outline"
                    className="bg-transparent border-[#444] text-white hover:bg-[#333] hover:text-white"
                  >
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}

                {step < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={goToNextStep}
                    className="bg-[#6B00D7] hover:bg-[#8400FF] text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="bg-[#FF5AF7] hover:bg-[#FF70F8] text-white"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Vault...
                      </>
                    ) : (
                      "Deploy Smart Contract Vault"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}