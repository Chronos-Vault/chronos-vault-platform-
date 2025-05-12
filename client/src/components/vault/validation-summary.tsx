import React from "react";
import { AlertCircle, X } from "lucide-react";
import { FieldErrors } from "react-hook-form";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ValidationSummaryProps {
  errors: FieldErrors;
  visible: boolean;
  onClose: () => void;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  visible,
  onClose,
}) => {
  if (!visible || Object.keys(errors).length === 0) {
    return null;
  }

  // Extract all error messages into a flat array
  const errorMessages: { path: string; message: string }[] = [];
  
  // Helper function to recursively gather all error messages
  const collectErrors = (errors: any, path = "") => {
    Object.entries(errors).forEach(([key, value]: [string, any]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (value?.message) {
        errorMessages.push({
          path: currentPath,
          message: value.message,
        });
      } else if (typeof value === "object" && value !== null) {
        // Recursively check for nested errors
        collectErrors(value, currentPath);
      }
    });
  };
  
  collectErrors(errors);

  // Only show if we have error messages
  if (errorMessages.length === 0) {
    return null;
  }

  // Get human-readable field names
  const getFieldLabel = (path: string): string => {
    const fieldMap: Record<string, string> = {
      name: "Vault Name",
      description: "Description",
      assetAmount: "Asset Amount",
      confirmAmount: "Confirmation Amount",
      unlockDate: "Unlock Date",
      blockchain: "Blockchain",
      vaultType: "Vault Type",
      securityLevel: "Security Level",
      tripleChainSecurity: "Triple-Chain Security",
      requiredSignatures: "Required Signatures",
      biometricType: "Biometric Type",
      geoRadius: "Geographic Radius",
      geoLocation: "Geographic Location",
      primaryChain: "Primary Chain",
      secondaryChain: "Secondary Chain",
      tertiaryChain: "Tertiary Chain",
      verificationThreshold: "Verification Threshold",
      contractCondition: "Contract Condition",
      dynamicRules: "Dynamic Rules",
      nftType: "NFT Type",
      giftType: "Gift Type",
      giftRecipient: "Gift Recipient",
      giftMessage: "Gift Message",
    };

    // Handle nested paths
    const parts = path.split('.');
    const basePath = parts[0];
    
    return fieldMap[basePath] || path;
  };

  return (
    <Alert variant="destructive" className="mb-8 border-red-800 bg-red-950/50">
      <AlertCircle className="h-5 w-5 text-red-400" />
      <div className="flex justify-between w-full">
        <AlertTitle className="text-red-400">Please fix the following errors</AlertTitle>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-red-900/50 transition-colors"
          aria-label="Close validation summary"
        >
          <X className="h-4 w-4 text-red-400" />
        </button>
      </div>
      <AlertDescription>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {errorMessages.map((error, index) => (
            <li key={index} className="text-red-300">
              <span className="font-medium">{getFieldLabel(error.path)}:</span> {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};