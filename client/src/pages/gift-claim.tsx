import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Lock, Unlock, Sparkles, Calendar, DollarSign, Shield, Check, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useEthereum } from '@/contexts/ethereum-context';
import { useToast } from '@/hooks/use-toast';

const GiftClaimPage: React.FC = () => {
  const { claimCode } = useParams<{ claimCode: string }>();
  const [showUnwrap, setShowUnwrap] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { walletInfo, isConnected, connect } = useEthereum();
  const { toast } = useToast();

  // Fetch gift vault by claim code
  const { data: giftResponse, isLoading, error } = useQuery({
    queryKey: ['/api/gift-vaults/claim', claimCode],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/gift-vaults/claim/${claimCode}`);
      return response as any;
    },
    enabled: !!claimCode,
  });

  const gift = giftResponse?.vault;
  const metadata = gift?.metadata as any;
  const isLocked = gift?.isLocked && new Date(gift.unlockDate) > new Date();
  const unlockDate = gift?.unlockDate ? new Date(gift.unlockDate) : null;

  // Claim gift mutation
  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!walletInfo?.address) {
        throw new Error("Please connect your wallet to claim this gift");
      }

      return apiRequest("POST", `/api/gift-vaults/claim/${claimCode}`, {
        walletAddress: walletInfo.address,
      });
    },
    onSuccess: (data) => {
      setClaimed(true);
      toast({
        title: "🎁 Gift Claimed!",
        description: "Congratulations! Your gift has been unlocked.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/gift-vaults/claim', claimCode] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim gift",
        variant: "destructive",
      });
    },
  });

  const handleClaim = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    claimMutation.mutate();
  };

  const getOccasionEmoji = (occasion: string) => {
    const emojiMap: Record<string, string> = {
      birthday: "🎂",
      holiday: "🎄",
      anniversary: "💝",
      wedding: "💒",
      graduation: "🎓",
      thank_you: "🙏",
      custom: "✨",
    };
    return emojiMap[occasion] || "🎁";
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Gift className="h-16 w-16 text-purple-500" />
          </motion.div>
          <p className="mt-4 text-gray-600">Loading your gift...</p>
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="container max-w-4xl py-20">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Gift Not Found</AlertTitle>
          <AlertDescription>
            This gift claim link is invalid or has expired. Please check the link and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12">
      <div className="container max-w-4xl">
        {/* Animated Gift Box - Unwrap Animation */}
        <AnimatePresence mode="wait">
          {!showUnwrap && !metadata?.claimed && !claimed ? (
            <motion.div
              key="wrapped"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0, rotateY: 180 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-30 rounded-full"></div>
                  <Gift className="h-32 w-32 text-purple-500 relative z-10" />
                  <Sparkles className="h-8 w-8 text-yellow-400 absolute top-0 right-0 animate-pulse" />
                </div>
              </motion.div>
              <h1 className="text-4xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                You've Received a Gift! 🎉
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {metadata?.senderWallet 
                  ? `From ${metadata.senderWallet.slice(0, 6)}...${metadata.senderWallet.slice(-4)}` 
                  : "From a special someone"}
              </p>
              <Button
                size="lg"
                onClick={() => setShowUnwrap(true)}
                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
                data-testid="button-unwrap-gift"
              >
                <Gift className="mr-2 h-5 w-5" />
                Unwrap Gift
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="unwrapped"
              initial={{ scale: 1.2, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Gift Details Card */}
              <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{getOccasionEmoji(metadata?.occasion || "custom")}</div>
                      <div>
                        <CardTitle className="text-2xl">
                          {metadata?.occasion === "custom" 
                            ? metadata?.customOccasion || "Special Gift" 
                            : `${metadata?.occasion?.charAt(0).toUpperCase()}${metadata?.occasion?.slice(1).replace('_', ' ')} Gift`}
                        </CardTitle>
                        <CardDescription>
                          {metadata?.recipientName 
                            ? `For ${metadata.recipientName}` 
                            : "A thoughtful crypto gift"}
                        </CardDescription>
                      </div>
                    </div>
                    {metadata?.claimed || claimed ? (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="h-4 w-4 mr-1" />
                        Claimed
                      </Badge>
                    ) : isLocked ? (
                      <Badge variant="secondary">
                        <Lock className="h-4 w-4 mr-1" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-blue-500">
                        <Unlock className="h-4 w-4 mr-1" />
                        Ready to Claim
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Gift Message */}
                  {metadata?.giftMessage && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Personal Message:</p>
                      <p className="text-gray-700 dark:text-gray-200 italic">"{metadata.giftMessage}"</p>
                    </div>
                  )}

                  <Separator />

                  {/* Gift Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Gift Amount</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {gift.assetAmount} {gift.assetType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {isLocked ? "Unlocks On" : "Available Since"}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {unlockDate?.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Shield className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Security Level</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                          {gift.securityLevel === 3 ? "Military-Grade" : 
                           gift.securityLevel === 2 ? "Premium" : "Standard"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Sparkles className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-500">Blockchain</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                          {gift.primaryChain || "Ethereum"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unlock Countdown (if locked) */}
                  {isLocked && unlockDate && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertTitle>Time-Locked Gift</AlertTitle>
                      <AlertDescription>
                        This gift will be available to claim on{' '}
                        <strong>{unlockDate.toLocaleString()}</strong>
                        <br />
                        <span className="text-sm text-gray-500">
                          Come back then to unwrap your present!
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Claim Button */}
                  {!metadata?.claimed && !claimed && !isLocked && (
                    <div className="pt-4">
                      {!isConnected ? (
                        <Button
                          size="lg"
                          onClick={handleClaim}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
                          data-testid="button-connect-claim"
                        >
                          <Unlock className="mr-2 h-5 w-5" />
                          Connect Wallet to Claim Gift
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Connected: <strong className="font-mono">{walletInfo?.address?.slice(0, 10)}...{walletInfo?.address?.slice(-8)}</strong>
                            </p>
                          </div>
                          <Button
                            size="lg"
                            onClick={handleClaim}
                            disabled={claimMutation.isPending}
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
                            data-testid="button-claim-gift"
                          >
                            {claimMutation.isPending ? (
                              <>Processing...</>
                            ) : (
                              <>
                                <Gift className="mr-2 h-5 w-5" />
                                Claim Your Gift Now!
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Already Claimed Message */}
                  {(metadata?.claimed || claimed) && (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Gift Claimed!</AlertTitle>
                      <AlertDescription className="text-green-700">
                        This gift has been successfully claimed{metadata?.claimedAt && ` on ${new Date(metadata.claimedAt).toLocaleDateString()}`}.
                        <br />
                        The {gift.assetAmount} {gift.assetType} has been transferred to your wallet.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        {gift && giftResponse?.vault?.attachments && giftResponse.vault.attachments.length > 0 && (showUnwrap || metadata?.claimed || claimed) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Gift Attachments
                </CardTitle>
                <CardDescription>Files and documents included with your gift</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {giftResponse.vault.attachments.map((attachment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{attachment.fileName}</p>
                        <p className="text-sm text-gray-500">{attachment.fileType}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GiftClaimPage;
