import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Check, 
  Info, 
  Lock, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  X, 
  Eye,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { secureCrossChainService, SecureTransferRequest } from '@/lib/cross-chain/SecureCrossChainService';

interface SecurityValidationPanelProps {
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  sourceAddress: string;
  targetAddress: string;
  sourceToken: string;
  targetToken: string;
  amount: number;
  usdValue: number;
  onValidationComplete?: (isValid: boolean, request: SecureTransferRequest) => void;
}

export default function SecurityValidationPanel({
  sourceChain,
  targetChain,
  sourceAddress,
  targetAddress,
  sourceToken,
  targetToken,
  amount,
  usdValue,
  onValidationComplete
}: SecurityValidationPanelProps) {
  const [transferRequest, setTransferRequest] = useState<SecureTransferRequest | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [currentSigner, setCurrentSigner] = useState('');
  
  useEffect(() => {
    // Reset the panel when inputs change
    setTransferRequest(null);
    setIsValidating(false);
    setShowDetails(false);
    setSignatures([]);
    setCurrentSigner('');
  }, [sourceChain, targetChain, sourceAddress, targetAddress, sourceToken, targetToken, amount]);
  
  const handleValidateClick = async () => {
    setIsValidating(true);
    
    try {
      // Create transfer request
      const request = secureCrossChainService.createTransferRequest(
        sourceChain,
        targetChain,
        sourceAddress,
        targetAddress,
        sourceToken,
        targetToken,
        amount,
        usdValue
      );
      
      // Perform validation
      const validatedRequest = await secureCrossChainService.validateTransferRequest(request.id);
      
      if (validatedRequest) {
        setTransferRequest(validatedRequest);
        
        if (onValidationComplete) {
          onValidationComplete(
            validatedRequest.status === 'ready' || validatedRequest.status === 'pending_approval', 
            validatedRequest
          );
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleAddSignature = async () => {
    if (!transferRequest || !currentSigner) return;
    
    // In a real implementation, we would use a wallet to sign a message
    // For this example, we'll simulate a signature
    const fakeSignature = `0x${Math.random().toString(36).substring(2, 15)}`;
    
    const updatedRequest = secureCrossChainService.addSignature(
      transferRequest.id,
      currentSigner,
      fakeSignature
    );
    
    if (updatedRequest) {
      setTransferRequest(updatedRequest);
      setSignatures([...signatures, currentSigner]);
      setCurrentSigner('');
      
      if (updatedRequest.status === 'ready' && onValidationComplete) {
        onValidationComplete(true, updatedRequest);
      }
    }
  };
  
  const renderSecurityStatus = () => {
    if (!transferRequest) {
      return (
        <div className="flex items-center justify-center p-6">
          <Button onClick={handleValidateClick} disabled={isValidating}>
            {isValidating ? (
              <>
                <Shield className="mr-2 h-4 w-4 animate-pulse" />
                Validating Security...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Validate Transaction Security
              </>
            )}
          </Button>
        </div>
      );
    }
    
    const { status, securityChecks, riskScore, riskFactors } = transferRequest;
    
    // Determine status icon and color
    let StatusIcon = AlertTriangle;
    let statusColor = 'text-yellow-500';
    let statusText = 'Validation in Progress';
    
    if (status === 'ready' || status === 'completed') {
      StatusIcon = ShieldCheck;
      statusColor = 'text-green-600';
      statusText = 'Secured & Validated';
    } else if (status === 'failed') {
      StatusIcon = ShieldAlert;
      statusColor = 'text-red-600';
      statusText = 'Security Validation Failed';
    } else if (status === 'pending_approval') {
      StatusIcon = Users;
      statusColor = 'text-yellow-600';
      statusText = 'Pending Multi-Signature Approval';
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StatusIcon className={`${statusColor} h-5 w-5 mr-2`} />
            <span className="font-semibold">{statusText}</span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="ml-1">Details</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show/hide security verification details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Progress value={riskScore} className="h-2" />
          </div>
          <span className="text-sm font-medium whitespace-nowrap">
            {renderRiskBadge(riskScore)}
          </span>
        </div>
        
        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  {securityChecks.addressValidation ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span>Address Validation</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {securityChecks.blacklistCheck ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span>Blacklist Check</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {securityChecks.amountValidation ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span>Amount Validation</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {securityChecks.riskAssessment ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span>Risk Assessment</span>
                </div>
                
                {securityChecks.multiSigRequired && (
                  <div className="flex items-center space-x-2">
                    {securityChecks.multiSigCompleted ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>Multi-Signature Approval</span>
                  </div>
                )}
              </div>
              
              {status === 'failed' && transferRequest.errorMessage && (
                <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
                  <div className="font-medium">Error:</div>
                  <div>{transferRequest.errorMessage}</div>
                </div>
              )}
              
              {riskFactors.length > 0 && (
                <div className="space-y-1">
                  <div className="font-medium">Risk Factors:</div>
                  {riskFactors.map((factor, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-1.5 text-sm"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {status === 'pending_approval' && transferRequest.requiredSignatures && (
                <div className="space-y-2 border-t border-gray-200 dark:border-gray-800 pt-2">
                  <div className="font-medium">
                    Multi-Signature Approval Required ({signatures.length}/{transferRequest.requiredSignatures})
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {signatures.map((signer, index) => (
                      <Badge key={index} variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        {signer}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Enter signer name"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={currentSigner}
                      onChange={(e) => setCurrentSigner(e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleAddSignature}
                      disabled={!currentSigner}
                    >
                      Add Signature
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };
  
  const renderRiskBadge = (score: number) => {
    if (score < 30) {
      return (
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Low Risk ({score}/100)
        </Badge>
      );
    } else if (score < 60) {
      return (
        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
          <Info className="h-3 w-3 mr-1" />
          Medium Risk ({score}/100)
        </Badge>
      );
    } else if (score < 80) {
      return (
        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          High Risk ({score}/100)
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
          <ShieldAlert className="h-3 w-3 mr-1" />
          Critical Risk ({score}/100)
        </Badge>
      );
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold flex items-center">
          <Lock className="h-4 w-4 mr-2 text-primary" />
          Transaction Security
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderSecurityStatus()}
      </CardContent>
    </Card>
  );
}