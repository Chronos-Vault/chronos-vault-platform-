import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertVaultSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/attachments/file-upload";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extend the vault schema with additional validation
const formSchema = insertVaultSchema.extend({
  confirmAmount: z.string().min(1, "Please confirm the amount"),
  includeAttachments: z.boolean().optional().default(true),
}).refine((data) => data.assetAmount === data.confirmAmount, {
  message: "Asset amounts do not match",
  path: ["confirmAmount"],
});

type FormValues = z.infer<typeof formSchema>;

interface CreateVaultFormProps {
  initialVaultType?: string;
}

const CreateVaultForm = ({ initialVaultType = "legacy" }: CreateVaultFormProps) => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialVaultType);
  const [createdVaultId, setCreatedVaultId] = useState<number | null>(null);
  const [showAttachmentUpload, setShowAttachmentUpload] = useState(false);

  // Mocked user ID for demo purposes
  const userId = 1;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId,
      name: "",
      description: "",
      vaultType: initialVaultType,
      assetType: "ETH",
      assetAmount: "",
      confirmAmount: "",
      timeLockPeriod: 365, // Default to 1 year
      unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      includeAttachments: true,
      metadata: {
        allowsAttachments: true,
        attachmentsEncryption: "AES-256"
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/vaults", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCreatedVaultId(data.id);
      setShowAttachmentUpload(true);
      toast({
        title: "Vault created successfully",
        description: "Your vault has been created. You can now add media attachments.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create vault",
        description: error.message || "Something went wrong while creating your vault.",
        variant: "destructive",
      });
    },
  });
  
  const handleAttachmentComplete = (attachment: any) => {
    toast({
      title: "File uploaded successfully",
      description: "Your attachment has been added to the vault.",
    });
  };
  
  const handleFinishCreation = () => {
    toast({
      title: "Vault creation complete",
      description: "Your vault has been created with all assets and attachments.",
    });
    navigate("/my-vaults");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("vaultType", value);
  };

  const handleTimeLockChange = (value: string) => {
    const days = parseInt(value, 10);
    form.setValue("timeLockPeriod", days);
    
    // Also update the unlock date
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + days);
    form.setValue("unlockDate", unlockDate.toISOString());
  };

  function onSubmit(data: FormValues) {
    mutation.mutate(data);
  }

  const getCardStyle = () => {
    switch (activeTab) {
      case "legacy":
        return "border-[#6B00D7]/30 hover:border-[#6B00D7]";
      case "investment":
        return "border-[#FF5AF7]/30 hover:border-[#FF5AF7]";
      case "project":
        return "border-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/30 hover:from-[#6B00D7] hover:to-[#FF5AF7]";
      default:
        return "border-[#6B00D7]/30 hover:border-[#6B00D7]";
    }
  };

  return (
    <div>
      <Tabs defaultValue={initialVaultType} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="legacy">Legacy Vault</TabsTrigger>
          <TabsTrigger value="investment">Investment Vault</TabsTrigger>
          <TabsTrigger value="project">Project Vault</TabsTrigger>
        </TabsList>

        <Card className={`bg-[#1E1E1E] border ${getCardStyle()} transition-all`}>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vault Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Legacy Vault" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your vault a memorable name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeLockPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Lock Period</FormLabel>
                        <Select 
                          onValueChange={handleTimeLockChange}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">1 Month</SelectItem>
                            <SelectItem value="90">3 Months</SelectItem>
                            <SelectItem value="180">6 Months</SelectItem>
                            <SelectItem value="365">1 Year</SelectItem>
                            <SelectItem value="730">2 Years</SelectItem>
                            <SelectItem value="1825">5 Years</SelectItem>
                            <SelectItem value="3650">10 Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Assets will be locked until this period expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the purpose of this vault"
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Add any details about this vault's purpose or beneficiaries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="assetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an asset type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                            <SelectItem value="USDT">Tether (USDT)</SelectItem>
                            <SelectItem value="DAI">Dai (DAI)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the type of asset to lock
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Amount</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the amount to lock in your vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="confirmAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Amount</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Re-enter the amount to confirm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeAttachments"
                  render={({ field }) => (
                    <FormItem className="p-4 border border-[#6B00D7]/20 rounded-lg bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5">
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-400 focus:ring-purple-500"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="text-base font-medium">Include Media Attachments</FormLabel>
                          <FormDescription className="text-sm text-gray-400">
                            Add important documents, images, videos or other files to your vault
                          </FormDescription>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <TabsContent value="legacy" className="mt-0 space-y-6">
                  <div className="bg-[#6B00D7]/10 p-4 rounded-lg">
                    <h3 className="font-poppins font-semibold mb-2">Legacy Vault Features</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#6B00D7] mt-0.5 mr-2"></i>
                        <span>Perfect for inheritance planning</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#6B00D7] mt-0.5 mr-2"></i>
                        <span>Add multiple beneficiaries</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#6B00D7] mt-0.5 mr-2"></i>
                        <span>Flexible time lock periods (1-100 years)</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="investment" className="mt-0 space-y-6">
                  <div className="bg-[#FF5AF7]/10 p-4 rounded-lg">
                    <h3 className="font-poppins font-semibold mb-2">Investment Vault Features</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Enforce long-term investment strategy</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Optional price-based unlock triggers</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Time lock periods from 1 month to 10 years</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="project" className="mt-0 space-y-6">
                  <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-4 rounded-lg">
                    <h3 className="font-poppins font-semibold mb-2">Project Vault Features</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-white mt-0.5 mr-2"></i>
                        <span>Ideal for DAOs and team projects</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-white mt-0.5 mr-2"></i>
                        <span>Multi-signature requirements</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-white mt-0.5 mr-2"></i>
                        <span>Milestone-based unlocking</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                {!showAttachmentUpload && (
                  <div className="pt-4 border-t border-[#333333]">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white cta-button"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Creating Your Vault..." : "Create and Lock Assets"}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
            
            {showAttachmentUpload && createdVaultId && (
              <div className="mt-8 space-y-6">
                <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Add Media to Your Vault</h3>
                  <p className="text-sm text-gray-300">
                    Add images, documents, videos, or audio files to your vault. These will be securely encrypted and time-locked.
                  </p>
                </div>
                
                <FileUpload 
                  vaultId={createdVaultId} 
                  onUploadComplete={handleAttachmentComplete} 
                  className="mb-6"
                />
                
                <div className="border-t border-[#333333] pt-4">
                  <Button
                    onClick={handleFinishCreation}
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white cta-button"
                  >
                    Complete Vault Creation
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CreateVaultForm;
