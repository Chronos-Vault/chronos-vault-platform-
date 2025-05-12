import React from "react";
import { CheckCircle2, XCircle, ArrowRight, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlockchainType } from "@/contexts/multi-chain-context";
import { SpecializedVaultType } from "@/components/vault/vault-type-selector";

interface FormReviewProps {
  formData: any;
  vaultType: SpecializedVaultType;
  blockchain: BlockchainType;
  onEdit: () => void;
  onConfirm: () => void;
  calculatedFees: {
    amount: number;
    currency: string;
    discount: string | null;
  };
  hasAttachments: boolean;
}

export const FormReview: React.FC<FormReviewProps> = ({
  formData,
  vaultType,
  blockchain,
  onEdit,
  onConfirm,
  calculatedFees,
  hasAttachments,
}) => {
  const renderSecurityFeatures = () => {
    const features = [];
    
    // Add security features based on form data
    if (formData.tripleChainSecurity) {
      features.push("Triple-Chain Security");
    }
    
    if (formData.metadata?.quantumResistant) {
      features.push("Quantum-Resistant Encryption");
    }
    
    if (formData.metadata?.adaptiveSecurity) {
      features.push("Adaptive Security Protocol");
    }
    
    if (formData.metadata?.instantRecovery) {
      features.push("Instant Recovery Mechanism");
    }
    
    if (formData.metadata?.accessControls?.multiFactorAuth) {
      features.push("Multi-Factor Authentication");
    }
    
    if (formData.metadata?.accessControls?.biometricAuth) {
      features.push("Biometric Authentication");
    }
    
    // Based on the vault type
    if (vaultType === "multi-signature") {
      features.push(`Multi-Signature (${formData.requiredSignatures} required)`);
    }
    
    if (vaultType === "cross-chain") {
      features.push(`Cross-Chain Verification (${formData.verificationThreshold} chains)`);
      features.push(`Primary Chain: ${formData.primaryChain || blockchain}`);
      if (formData.secondaryChain) features.push(`Secondary Chain: ${formData.secondaryChain}`);
    }
    
    if (vaultType === "biometric") {
      features.push(`Biometric Authentication: ${formData.biometricType || "Standard"}`);
    }
    
    if (vaultType === "geolocation") {
      features.push(`Geolocation Restrictions (${formData.geoRadius}km radius)`);
    }
    
    if (vaultType === "smart-contract") {
      features.push("Smart Contract Conditions");
    }
    
    if (vaultType === "nft-powered") {
      features.push(`NFT-Powered Access (${formData.nftType || "Standard NFT"})`);
    }
    
    // Return formatted JSX with the features
    return (
      <div className="space-y-1 mt-2">
        {features.length > 0 ? features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-[#6B00D7]" /> 
            <span>{feature}</span>
          </div>
        )) : (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="h-4 w-4 text-gray-500" />
            <span>Standard security (Time-lock only)</span>
          </div>
        )}
      </div>
    );
  };

  // Format date for display
  const formatDate = (date: string | Date) => {
    if (!date) return "Not specified";
    
    if (typeof date === "string") {
      // Try to parse the string date
      try {
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        return date;
      }
    }
    
    // Handle Date object
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-[#1A1A1A] border border-[#6B00D7]/30">
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-t-lg border-b border-[#6B00D7]/20">
        <CardTitle className="text-[#FF5AF7]">Review Your Vault Configuration</CardTitle>
        <CardDescription>
          Please review your vault details before final confirmation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#6B00D7]">Basic Information</h3>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vault Name:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vault Type:</span>
                  <span className="font-medium capitalize">{vaultType} Vault</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Primary Blockchain:</span>
                  <span className="font-medium">{blockchain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Asset Amount:</span>
                  <span className="font-medium">{formData.assetAmount} {formData.assetSymbol || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Unlock Date:</span>
                  <span className="font-medium">{formatDate(formData.unlockDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Has Attachments:</span>
                  <span className="font-medium flex items-center gap-1">
                    {hasAttachments ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Yes
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-gray-500" />
                        No
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[#6B00D7]">Security Configuration</h3>
              {renderSecurityFeatures()}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#6B00D7]">Description</h3>
              <p className="text-sm text-gray-300 mt-2 border border-gray-800 bg-gray-900/50 p-3 rounded-md h-24 overflow-auto">
                {formData.description || "No description provided."}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[#6B00D7]">Transaction Fee</h3>
              <div className="mt-2 p-4 border border-[#6B00D7]/20 rounded-md bg-[#6B00D7]/5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Fee Amount:</span>
                  <span className="text-xl font-bold text-[#FF5AF7]">
                    {calculatedFees.amount} {calculatedFees.currency}
                  </span>
                </div>
                
                {calculatedFees.discount && (
                  <div className="text-sm mt-1 text-green-400 flex justify-end items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Includes {calculatedFees.discount} staking discount
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-400">
                  Fees cover blockchain transaction costs, multi-chain verification, and secure vault deployment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-[#6B00D7]/20 pt-6">
        <Button variant="outline" onClick={onEdit}>
          Edit Configuration
        </Button>
        <Button 
          onClick={onConfirm}
          className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#8B00D7] hover:to-[#FF7AF7]"
        >
          Confirm and Deploy <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};