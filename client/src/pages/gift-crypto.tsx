import React from 'react';
import { useLocation } from 'wouter';
import { Gift, LucideGift, Sparkles, Award, Zap } from 'lucide-react';
import { CryptoGiftSystem } from '@/components/gift/crypto-gift-system';

// Page components
import { PageHeader } from '@/components/page-header';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const GiftCryptoPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userId, setUserId] = React.useState<number>(1); // Default to user 1 for demo
  
  // Handle successful gift sending
  const handleGiftSent = (giftDetails: any) => {
    toast({
      title: "Gift Sent Successfully!",
      description: `You sent ${giftDetails.amount} ${giftDetails.cryptoType} to ${giftDetails.recipientAddress.substring(0, 10)}...`,
      variant: "default",
    });
  };
  
  // Navigate to the advanced vault creation page with gift parameters
  const handleCreateAdvancedGift = (recipientAddress?: string) => {
    const params = new URLSearchParams();
    params.append('type', 'gift');
    if (recipientAddress) {
      params.append('recipient', recipientAddress);
    }
    setLocation(`/advanced-vault?${params.toString()}`);
  };
  
  return (
    <div className="container max-w-7xl py-10">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 transform rotate-1 rounded-xl"></div>
        <div className="relative bg-black/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-[#6B00D7]/30">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                Luxury Crypto Gifting
              </h1>
              <p className="text-gray-300 mb-4">
                The world's most sophisticated crypto gift platform with time-locked vaults and multi-chain support. Delight your loved ones with the gift of digital assets in a luxurious presentation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  Multi-Chain
                </span>
                <span className="inline-flex items-center rounded-full bg-[#FF5AF7]/10 px-2 py-1 text-xs font-medium text-[#FF5AF7]">
                  Time-Locked
                </span>
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  Military-Grade Security
                </span>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <button
                onClick={() => handleCreateAdvancedGift()}
                className="relative group overflow-hidden rounded-lg px-6 py-3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-medium shadow-xl hover:shadow-[#FF5AF7]/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
                <div className="relative flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="text-lg">Design Premium Vault Gift</span>
                  <Zap className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CryptoGiftSystem 
            userId={userId} 
            onGiftSent={handleGiftSent}
            onAdvancedGift={handleCreateAdvancedGift}
          />
        </div>
        
        <div className="space-y-6">
          <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-900/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
                <Sparkles className="mr-2 h-5 w-5" />
                Gift Benefits
              </CardTitle>
              <CardDescription className="text-purple-600/80 dark:text-purple-400/80">
                Why use our gift system?
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="list-disc list-inside space-y-2 text-purple-700/90 dark:text-purple-300/90">
                <li>Instant transfers to any crypto wallet</li>
                <li>Time-lock gifts in secure digital vaults</li>
                <li>Add personalized messages to your gifts</li>
                <li>Support across multiple blockchains</li>
                <li>Gift tracking and history</li>
                <li>Beautiful gift certificates (coming soon)</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Gift Ideas</CardTitle>
              <CardDescription>
                Perfect occasions for crypto gifts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="birthdays">
                <TabsList className="w-full">
                  <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
                  <TabsTrigger value="holidays">Holidays</TabsTrigger>
                  <TabsTrigger value="occasions">Special</TabsTrigger>
                </TabsList>
                <TabsContent value="birthdays" className="mt-4 text-sm space-y-3">
                  <p>
                    Create a time-locked birthday vault that unlocks on their 
                    next birthday. Include a special message and watch your gift 
                    potentially grow in value over time.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600">
                    <LucideGift size={16} />
                    <span className="font-medium">Pro tip:</span> 
                    <span>Lock for 1 year with appreciation potential</span>
                  </div>
                </TabsContent>
                <TabsContent value="holidays" className="mt-4 text-sm space-y-3">
                  <p>
                    Send holiday gifts that can be unlocked during the festive season.
                    A perfect alternative to traditional presents with the added
                    benefit of potential appreciation.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600">
                    <LucideGift size={16} />
                    <span className="font-medium">Pro tip:</span> 
                    <span>Send before holiday price increases</span>
                  </div>
                </TabsContent>
                <TabsContent value="occasions" className="mt-4 text-sm space-y-3">
                  <p>
                    Weddings, graduations, anniversaries - create memorable gifts
                    for special milestones. Secure assets that can be unlocked at
                    meaningful future dates.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600">
                    <LucideGift size={16} />
                    <span className="font-medium">Pro tip:</span> 
                    <span>Set future unlocks for special anniversaries</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Coming Soon</CardTitle>
              <CardDescription>
                Future gift system features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Gift className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-medium">Gift Certificates:</strong> Beautiful 
                    downloadable certificates for your crypto gifts
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-medium">Multi-sig Gifting:</strong> Require 
                    multiple approvals to unlock particularly valuable gifts
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-medium">Group Gifting:</strong> Pool funds 
                    with friends to send larger collective gifts
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GiftCryptoPage;