import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gift, Send, Check, AlertCircle, Sparkles, FileText, Shield, Rocket, BarChart, PenSquare, ShieldCheck, Layers, Clock } from "lucide-react";
import { useEthereum } from "@/contexts/ethereum-context";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Vault } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { EnhancedMediaUploader } from "@/components/attachments/enhanced-media-uploader";
import { useToast } from "@/hooks/use-toast";

// Define the validation schema for the gift form
const giftFormSchema = z.object({
  recipientAddress: z.string()
    .min(1, { message: "Recipient address is required" })
    .refine(addr => addr.startsWith("0x") || addr.length >= 10, {
      message: "Invalid wallet address format",
    }),
  cryptoType: z.string().min(1, { message: "Cryptocurrency type is required" }),
  amount: z.string()
    .min(1, { message: "Amount is required" })
    .refine(amount => !isNaN(parseFloat(amount)) && parseFloat(amount) > 0, {
      message: "Amount must be a positive number",
    }),
  message: z.string().optional(),
  lockInVault: z.boolean().default(false),
  lockDuration: z.number().min(1).optional(),
  includeAttachments: z.boolean().default(false),
  securityLevel: z.enum(["standard", "premium", "military"]).default("standard"),
  crossChainProtection: z.boolean().default(false),
  visualTheme: z.enum(["elegant", "luxury", "minimalist", "futuristic"]).default("elegant"),
  giftTracking: z.boolean().default(true),
});

type GiftFormValues = z.infer<typeof giftFormSchema>;

// The list of supported cryptocurrencies for gifting
const SUPPORTED_CRYPTOS = [
  { id: "ETH", name: "Ethereum", icon: "⟠", chainId: 1 },
  { id: "TON", name: "Toncoin", icon: "💎", chainId: null },
  { id: "SOL", name: "Solana", icon: "◎", chainId: null },
  { id: "BTC", name: "Bitcoin", icon: "₿", chainId: null },
  { id: "CVT", name: "Chronos Vault Token", icon: "🔒", chainId: null },
];

export interface CryptoGiftSystemProps {
  userId: number;
  onGiftSent?: (giftDetails: any) => void;
  onAdvancedGift?: (recipientAddress?: string) => void;
}

export function CryptoGiftSystem({ userId, onGiftSent, onAdvancedGift }: CryptoGiftSystemProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const { toast } = useToast();
  const { walletInfo, isConnected, connect, sendETH } = useEthereum();
  
  // Fetch user's vaults for the lock-in-vault feature
  const { data: userVaults } = useQuery({
    queryKey: ['/api/vaults/user', userId],
    queryFn: () => apiRequest("GET", `/api/vaults/user/${userId}`),
    enabled: !!userId,
  });
  
  const form = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      recipientAddress: "",
      cryptoType: "",
      amount: "",
      message: "",
      lockInVault: false,
      lockDuration: 30, // Default lock duration of 30 days
      includeAttachments: false,
      securityLevel: "standard",
      crossChainProtection: false,
      visualTheme: "elegant",
      giftTracking: true,
    },
  });
  
  // Handle wallet connection if not connected
  const connectWallet = async () => {
    if (!isConnected) {
      try {
        const success = await connect();
        if (!success) {
          setError("Failed to connect wallet. Please try again.");
        }
      } catch (err) {
        console.error("Connection error:", err);
        setError("Failed to connect to wallet. Please check if your wallet is unlocked and try again.");
      }
    }
  };
  
  // Send a crypto gift
  const onSubmit = async (values: GiftFormValues) => {
    setError(null);
    setTransactionHash(null);
    setIsSubmitting(true);
    
    try {
      if (!isConnected) {
        await connectWallet();
        if (!isConnected) {
          throw new Error("Please connect your wallet first");
        }
      }
      
      // Different handling based on crypto type
      switch (values.cryptoType) {
        case "ETH":
          // Send ETH directly or create a vault with it
          if (values.lockInVault) {
            // Create a new time-locked vault with ETH for the recipient
            const vaultData = {
              userId,
              name: `ETH Gift for ${values.recipientAddress.substring(0, 6)}...`,
              description: values.message || "A gift of ETH from Chronos Vault",
              vaultType: "gift",
              assetType: "ETH",
              assetAmount: values.amount,
              timeLockPeriod: values.lockDuration || 30,
              unlockDate: new Date(Date.now() + (values.lockDuration || 30) * 24 * 60 * 60 * 1000).toISOString(),
              metadata: {
                recipient: values.recipientAddress,
                giftMessage: values.message,
                senderAddress: walletInfo?.address,
                securityLevel: values.securityLevel,
                crossChainProtection: values.crossChainProtection,
                visualTheme: values.visualTheme,
                giftTracking: values.giftTracking
              },
              securityLevel: values.securityLevel === "military" ? 3 : 
                             values.securityLevel === "premium" ? 2 : 1,
              crossChainVerification: values.crossChainProtection
            };
            
            // First send ETH to the contract
            const ethSendResult = await sendETH(values.recipientAddress, values.amount);
            if (!ethSendResult.success) {
              throw new Error(ethSendResult.error || "Failed to send ETH");
            }
            
            // Create the gift vault
            const vaultResponse = await apiRequest("POST", "/api/vaults", vaultData);
            const vault = vaultResponse as unknown as Vault;
            setTransactionHash(ethSendResult.transactionHash || "");
            
            // If there are attachments, upload them to the vault
            if (values.includeAttachments && attachments.length > 0 && vault) {
              // Attach files to the vault
              for (const attachment of attachments) {
                if (!attachment.id) { // Only handle attachments that aren't already saved
                  const attachmentData = {
                    vaultId: vault?.id || 0,
                    fileName: attachment.fileName,
                    fileType: attachment.fileType,
                    fileSize: attachment.fileSize,
                    filePath: attachment.filePath,
                    description: `Gift attachment for ${values.recipientAddress}`,
                    metadata: {
                      addedAt: new Date().toISOString(),
                      securityLevel: 'standard'
                    }
                  };
                  
                  try {
                    await apiRequest("POST", "/api/attachments", attachmentData);
                  } catch (err) {
                    console.error("Failed to attach file to vault:", err);
                    // Continue with other attachments
                  }
                }
              }
            }
            
            // Notify parent component
            if (onGiftSent) {
              onGiftSent({
                ...vaultResponse,
                transactionHash: ethSendResult.transactionHash,
                recipientAddress: values.recipientAddress,
                amount: values.amount,
                cryptoType: values.cryptoType,
                attachments: values.includeAttachments ? attachments : []
              });
            }
          } else {
            // Send ETH directly
            const result = await sendETH(values.recipientAddress, values.amount);
            if (!result.success) {
              throw new Error(result.error || "Failed to send ETH");
            }
            
            setTransactionHash(result.transactionHash || "");
            
            // Record the gift in our system
            const giftRecord = {
              senderId: userId,
              recipientAddress: values.recipientAddress,
              cryptoType: values.cryptoType,
              amount: values.amount,
              message: values.message || "",
              transactionHash: result.transactionHash,
              timestamp: new Date().toISOString()
            };
            
            // Optional: Save gift record to the API
            // await apiRequest("POST", "/api/gifts", giftRecord);
            
            // Notify parent component
            if (onGiftSent) {
              onGiftSent(giftRecord);
            }
          }
          break;
          
        case "TON":
        case "SOL":
        case "CVT":
          // Display message that these are coming soon
          setError(`${values.cryptoType} gifting will be available in the next update!`);
          // TODO: Implement for other crypto types
          break;
          
        default:
          throw new Error("Unsupported cryptocurrency selected");
      }
      
      // Reset form after successful submission
      form.reset();
    } catch (err: any) {
      console.error("Gift error:", err);
      setError(err.message || "Failed to send gift. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle attachment uploads
  const handleAttachmentUpload = (attachment: any) => {
    setAttachments(prev => [...prev, attachment]);
    
    toast({
      title: "Media attached",
      description: "Your file has been attached to the gift",
    });
  };
  
  const selectedCrypto = form.watch("cryptoType");
  const lockInVault = form.watch("lockInVault");
  const includeAttachments = form.watch("includeAttachments");
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Gift className="h-6 w-6 text-purple-500" />
          Cryptocurrency Gift System
        </CardTitle>
        <CardDescription>
          Send cryptocurrency gifts to friends and family, with optional time-locking in a vault
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              You need to connect your wallet to send gifts.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {transactionHash && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Gift Sent Successfully!</AlertTitle>
            <AlertDescription className="text-green-700">
              Transaction Hash: <span className="font-mono text-xs">{transactionHash}</span>
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the wallet address of the gift recipient
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cryptoType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cryptocurrency</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUPPORTED_CRYPTOS.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center">
                            <span className="mr-2">{crypto.icon}</span>
                            {crypto.name} ({crypto.id})
                            {crypto.id !== "ETH" && (
                              <span className="ml-2 text-xs text-gray-500">Coming soon</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select which cryptocurrency you want to gift
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="text"
                        placeholder="0.01" 
                        {...field} 
                      />
                      {selectedCrypto && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          {SUPPORTED_CRYPTOS.find(c => c.id === selectedCrypto)?.icon} {selectedCrypto}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount of {selectedCrypto || "cryptocurrency"} to send
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gift Message (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Happy Birthday!" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Add a personal message to your gift
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="lockInVault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-purple-100 bg-purple-50/30">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        Time-Lock in a Vault
                      </FormLabel>
                      <FormDescription>
                        Create a time-locked vault for this gift with premium security
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {lockInVault && (
                <>
                  <FormField
                    control={form.control}
                    name="lockDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-purple-600" />
                          Lock Duration (Days)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min={1}
                            max={3650}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="border-purple-200 focus-visible:ring-purple-500"
                          />
                        </FormControl>
                        <FormDescription>
                          How long the gift will be locked in the vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="securityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-purple-600" />
                          Security Level
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-purple-200 focus-visible:ring-purple-500">
                              <SelectValue placeholder="Select security level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">
                              Standard Security
                            </SelectItem>
                            <SelectItem value="premium">
                              Premium (Enhanced Encryption)
                            </SelectItem>
                            <SelectItem value="military">
                              Military-Grade Security
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the level of security for your gift vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="crossChainProtection"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-purple-100 bg-purple-50/30">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Layers className="h-5 w-5 text-purple-600" />
                            Cross-Chain Protection
                          </FormLabel>
                          <FormDescription>
                            Enable multi-chain verification for maximum security
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-purple-600"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visualTheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <PenSquare className="h-4 w-4 text-purple-600" />
                          Gift Presentation Theme
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-purple-200 focus-visible:ring-purple-500">
                              <SelectValue placeholder="Select visual theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="elegant">Elegant Minimalist</SelectItem>
                            <SelectItem value="luxury">Luxury Premium</SelectItem>
                            <SelectItem value="minimalist">Clean Modern</SelectItem>
                            <SelectItem value="futuristic">Futuristic Neon</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how your gift will be presented to the recipient
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="giftTracking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-purple-100 bg-purple-50/30">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-purple-600" />
                            Enable Gift Tracking
                          </FormLabel>
                          <FormDescription>
                            Track when your gift is viewed and unlocked
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-purple-600"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <FormField
                control={form.control}
                name="includeAttachments"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Include Media Attachments</FormLabel>
                      <FormDescription>
                        Add images, videos, or documents to your gift
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <AnimatePresence>
                {includeAttachments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-lg border mt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <h3 className="font-medium">Gift Attachments</h3>
                      </div>
                      
                      <EnhancedMediaUploader
                        onUploadComplete={handleAttachmentUpload}
                        onAttachmentsChange={setAttachments}
                        maxUploads={5}
                        allowedTypes={["images", "documents", "videos"]}
                        initialAttachments={attachments}
                        className="w-full"
                      />
                      
                      {!lockInVault && (
                        <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertTitle className="text-yellow-800">Vault Required for Attachments</AlertTitle>
                          <AlertDescription className="text-yellow-700">
                            To include attachments with your gift, you must enable the Time-Lock Vault option above.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {attachments.length > 0 && (
                        <div className="mt-4 p-3 rounded-md bg-purple-50 text-sm text-purple-800">
                          <p className="flex items-center gap-1.5">
                            <Check className="h-4 w-4" />
                            {attachments.length} {attachments.length === 1 ? 'file' : 'files'} attached to gift
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>Clear all fields</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onAdvancedGift && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button 
                      variant="outline" 
                      className="border-[#6B00D7] text-[#6B00D7] hover:bg-[#6B00D7]/10 animate-pulse-subtle"
                      onClick={() => onAdvancedGift(form.getValues("recipientAddress"))}
                    >
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        Create Luxury Gift Vault
                      </span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Create advanced gift vault with more options
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting || !isConnected}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="mr-2 h-4 w-4" />
              Send Gift
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}