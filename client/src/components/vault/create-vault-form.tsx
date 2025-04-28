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
import { EnhancedMediaUploader } from "@/components/attachments/enhanced-media-uploader";

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

// Define a more specific metadata type
const metadataSchema = z.object({
  allowsAttachments: z.boolean().default(true),
  attachmentsEncryption: z.string().default("AES-256"),
  attachments: z.array(z.any()).optional(),
  // Gift-specific metadata
  giftExperience: z.object({
    experienceType: z.string().optional(),
    unlockStages: z.array(z.string()).optional(),
    augmentedMedia: z.boolean().optional(),
    appreciationRate: z.number().optional(),
    challenges: z.array(z.string()).optional()
  }).optional()
});

// Extend the vault schema with additional validation
const formSchema = insertVaultSchema.extend({
  confirmAmount: z.string().min(1, "Please confirm the amount"),
  includeAttachments: z.boolean().optional().default(true),
  unlockDate: z.string(), // Modified to handle string for date ISO
  metadata: metadataSchema.optional().default({
    allowsAttachments: true,
    attachmentsEncryption: "AES-256"
  }),
  // Gift-specific fields
  giftType: z.string().optional(),
  giftRecipient: z.string().optional(),
  giftMessage: z.string().optional()
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
  const [attachments, setAttachments] = useState<any[]>([]);

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
      },
      // Add default values for gift fields
      giftType: "surprise",
      giftRecipient: "",
      giftMessage: ""
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/vaults", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCreatedVaultId(data.id);
      
      // If attachments were already uploaded with the enhanced uploader
      if (attachments.length > 0) {
        toast({
          title: "Vault created successfully",
          description: "Your vault has been created with all your media attachments.",
        });
        // Navigate directly to the vault details
        navigate(`/vault-details?id=${data.id}`);
      } else if (form.watch("includeAttachments")) {
        // Show the attachment upload step only if includeAttachments is checked
        setShowAttachmentUpload(true);
        toast({
          title: "Vault created successfully",
          description: "Your vault has been created. You can now add media attachments.",
        });
      } else {
        // No attachments needed, go directly to vault details
        toast({
          title: "Vault created successfully",
          description: "Your vault has been created successfully.",
        });
        navigate(`/vault-details?id=${data.id}`);
      }
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
    setAttachments(prevAttachments => [...prevAttachments, attachment]);
    toast({
      title: "File uploaded successfully",
      description: "Your attachment has been added to the vault.",
    });
  };
  
  const handleAttachmentsChange = (newAttachments: any[]) => {
    setAttachments(newAttachments);
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
    // Create gift experience metadata if vault type is "gift"
    let giftExperience;
    if (data.vaultType === "gift") {
      giftExperience = {
        experienceType: data.giftType || "surprise",
        recipientAddress: data.giftRecipient || "",
        message: data.giftMessage || "",
        unlockStages: [],
        augmentedMedia: true,
        appreciationRate: 1.05
      };
    }
    
    // Include attachment information and gift data in the vault metadata
    const vaultData = {
      ...data,
      metadata: {
        allowsAttachments: data.metadata?.allowsAttachments ?? true,
        attachmentsEncryption: data.metadata?.attachmentsEncryption ?? "AES-256",
        attachments: attachments.length > 0 ? attachments : undefined,
        ...(giftExperience && { giftExperience })
      }
    };
    
    mutation.mutate(vaultData as FormValues);
  }

  const getCardStyle = () => {
    switch (activeTab) {
      case "legacy":
        return "border-[#6B00D7]/30 hover:border-[#6B00D7]";
      case "investment":
        return "border-[#FF5AF7]/30 hover:border-[#FF5AF7]";
      case "project":
        return "border-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/30 hover:from-[#6B00D7] hover:to-[#FF5AF7]";
      case "gift":
        return "border-[#00D7C3]/30 hover:border-[#00D7C3]";
      default:
        return "border-[#6B00D7]/30 hover:border-[#6B00D7]";
    }
  };

  return (
    <div>
      <Tabs defaultValue={initialVaultType} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="legacy">Legacy Vault</TabsTrigger>
          <TabsTrigger value="investment">Investment Vault</TabsTrigger>
          <TabsTrigger value="project">Project Vault</TabsTrigger>
          <TabsTrigger value="gift">Gift Vault</TabsTrigger>
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
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        Add any details about this vault's purpose or beneficiaries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Enhanced Media Uploader - shown when includeAttachments is checked */}
                {form.watch("includeAttachments") && !showAttachmentUpload && (
                  <div className="border border-[#FF5AF7]/20 rounded-lg p-4 bg-[#1A1A1A] mt-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Media Attachments</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Add multimedia files to your vault. These files will be encrypted and only 
                      accessible after the time-lock period expires.
                    </p>
                    
                    <EnhancedMediaUploader
                      onAttachmentsChange={handleAttachmentsChange}
                      maxUploads={5}
                      allowedTypes={["image/*", "application/pdf", "video/*", "audio/*"]}
                      initialAttachments={attachments}
                    />
                  </div>
                )}

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
                
                <TabsContent value="gift" className="mt-0 space-y-6">
                  <div className="bg-[#00D7C3]/10 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#00D7C3] to-[#00A3FF] p-1.5 rounded-full mr-3">
                        <i className="ri-gift-2-fill text-black text-xl"></i>
                      </div>
                      <h3 className="font-poppins font-semibold text-[#00D7C3]">Revolutionary Gift Vault</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">
                      Create a unique time-locked gift experience that combines digital assets with real-world moments 
                      in ways never seen before in the crypto space.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div className="border border-[#00D7C3]/30 rounded-lg p-3">
                        <h4 className="font-medium text-[#00D7C3] mb-2 text-sm">Memory Augmentation</h4>
                        <p className="text-xs text-gray-400">Upload AR-compatible media that can be revealed at specific physical locations, creating a scavenger hunt for their crypto gift.</p>
                      </div>
                      
                      <div className="border border-[#00D7C3]/30 rounded-lg p-3">
                        <h4 className="font-medium text-[#00D7C3] mb-2 text-sm">Achievement Unlocking</h4>
                        <p className="text-xs text-gray-400">Set specific challenges or tasks that the recipient must complete to gradually unlock portions of the gift.</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 text-sm text-gray-300 mt-4">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Multi-stage revelation with sequential unlocking moments</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Add personalized interactive experiences and puzzles</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Trigger unlocks based on real-world events or achievements</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Include appreciation multipliers that increase gift value over time</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="giftType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#00D7C3]">Gift Experience Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue="surprise"
                          >
                            <FormControl>
                              <SelectTrigger className="border-[#00D7C3]/30 focus:ring-[#00D7C3]">
                                <SelectValue placeholder="Select gift experience type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="surprise">Surprise Moment</SelectItem>
                              <SelectItem value="journey">Discovery Journey</SelectItem>
                              <SelectItem value="milestone">Achievement Milestone</SelectItem>
                              <SelectItem value="adventure">Geo-Located Adventure</SelectItem>
                              <SelectItem value="appreciation">Value Appreciation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            How would you like the gift to be revealed?
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="giftRecipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#00D7C3]">Recipient's Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0x..." 
                              className="border-[#00D7C3]/30 focus:ring-[#00D7C3]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Who will receive this special gift?
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="giftMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#00D7C3]">Personal Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write a personal message that will be revealed when this gift is unlocked..."
                            className="resize-none border-[#00D7C3]/30 focus:ring-[#00D7C3]"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Add a heartfelt message to accompany your gift
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center p-3 border border-[#00D7C3]/30 rounded-lg bg-[#00D7C3]/5 my-2">
                    <div className="flex-shrink-0 bg-[#00D7C3]/10 p-2 rounded-full mr-3">
                      <i className="ri-magic-line text-[#00D7C3] text-lg"></i>
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-[#00D7C3]">Revolutionary Feature: </span>
                      This gift vault will increase in value by 5% each year until it's claimed by the recipient.
                    </div>
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
