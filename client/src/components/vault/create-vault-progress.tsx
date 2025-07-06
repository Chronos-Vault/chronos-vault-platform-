import React from "react";
import { CheckCircle2, Circle, Loader2, AlertCircle, Wallet, File, Shield, Database, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "complete" | "current" | "upcoming" | "error";

export interface Step {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  icon?: React.ReactNode;
}

interface VaultCreationProgressProps {
  steps: Step[];
  currentStepId: string;
  variant?: "vertical" | "horizontal";
  className?: string;
}

export const VaultCreationProgress: React.FC<VaultCreationProgressProps> = ({
  steps,
  currentStepId,
  variant = "vertical",
  className,
  ...rest
}) => {
  if (variant === "horizontal") {
    return (
      <div className={cn("mb-6", className)}>
        <div className="flex items-center justify-between space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium",
                    step.status === "complete" 
                      ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white" 
                      : step.status === "current"
                        ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white" 
                        : step.status === "error"
                          ? "bg-red-500/20 text-red-400 border border-red-500/50"
                          : "bg-gray-800 text-gray-400"
                  )}
                >
                  {step.status === "complete" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : step.status === "current" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : step.status === "error" ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    step.icon || <Circle className="h-5 w-5" />
                  )}
                </div>
                <span 
                  className={cn(
                    "text-xs hidden sm:block",
                    step.status === "complete" 
                      ? "text-white" 
                      : step.status === "current"
                        ? "text-[#FF5AF7]"
                        : step.status === "error"
                          ? "text-red-400"
                          : "text-gray-500"
                  )}
                >
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-1 rounded",
                    step.status === "complete"
                      ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                      : "bg-gray-800"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 pb-8", className)}>
      <h3 className="text-lg font-medium text-[#6B00D7]">Vault Creation Progress</h3>
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className={cn(
              stepIdx !== steps.length - 1 ? "pb-8" : "",
              "relative"
            )}>
              {stepIdx !== steps.length - 1 ? (
                <div
                  className={cn(
                    "absolute left-3.5 top-4 -ml-px mt-0.5 h-full w-0.5",
                    step.status === "complete" ? "bg-[#6B00D7]" : "bg-gray-700"
                  )}
                  aria-hidden="true"
                />
              ) : null}
              <div className="group relative flex items-start">
                <span className="flex h-9 items-center">
                  <span
                    className={cn(
                      "relative z-10 flex h-7 w-7 items-center justify-center rounded-full",
                      {
                        "bg-[#6B00D7] group-hover:bg-[#8B00D7]": step.status === "complete",
                        "bg-[#8B00D7]/20 border-2 border-[#8B00D7] text-[#8B00D7]": step.status === "current",
                        "bg-gray-800 group-hover:bg-gray-700": step.status === "upcoming",
                        "bg-red-900 group-hover:bg-red-800": step.status === "error",
                      }
                    )}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                    ) : step.status === "current" ? (
                      <Loader2 className="h-5 w-5 text-[#8B00D7] animate-spin" aria-hidden="true" />
                    ) : step.status === "error" ? (
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    ) : (
                      step.icon || <Circle className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    )}
                  </span>
                </span>
                <div className="ml-4 min-w-0 flex-1">
                  <h3
                    className={cn(
                      "text-sm font-medium",
                      {
                        "text-[#6B00D7]": step.status === "complete",
                        "text-[#FF5AF7]": step.status === "current",
                        "text-gray-400": step.status === "upcoming",
                        "text-red-400": step.status === "error",
                      }
                    )}
                  >
                    {step.name}
                  </h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

// Helper function to get the default steps for vault creation
export const getDefaultVaultCreationSteps = (currentStep: string = "details"): Step[] => {
  const steps: Step[] = [
    {
      id: "wallet",
      name: "Connect Wallet",
      description: "Connect your blockchain wallet",
      status: "upcoming",
      icon: <Wallet className="h-5 w-5" />
    },
    {
      id: "details",
      name: "Vault Details",
      description: "Configure basic vault information",
      status: "upcoming",
      icon: <File className="h-5 w-5" />
    },
    {
      id: "security",
      name: "Security Options",
      description: "Set security parameters and access controls",
      status: "upcoming",
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: "assets",
      name: "Asset Confirmation",
      description: "Confirm assets to be stored",
      status: "upcoming",
      icon: <Database className="h-5 w-5" />
    },
    {
      id: "review",
      name: "Review",
      description: "Review and confirm vault creation",
      status: "upcoming",
      icon: <ClipboardCheck className="h-5 w-5" />
    }
  ];

  // Update statuses based on current step
  let foundCurrent = false;
  return steps.map(step => {
    if (foundCurrent) {
      return { ...step, status: "upcoming" };
    }
    
    if (step.id === currentStep) {
      foundCurrent = true;
      return { ...step, status: "current" };
    }
    
    return { ...step, status: "complete" };
  });
};