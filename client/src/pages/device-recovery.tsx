import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle } from "lucide-react";
// Removed old device recovery flow import

/**
 * Device Recovery Page
 * 
 * This page provides multiple options for users to recover access
 * to their accounts when they've lost access to their primary device.
 */
const DeviceRecoveryPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [recoveryMethod, setRecoveryMethod] = useState<string>('multi-sig');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Device Recovery</h1>
          <p className="text-muted-foreground">
            Restore access to your Chronos Vault account using one of the secure recovery methods below.
          </p>
        </div>

        <Card className="mb-6 border-[#333] bg-black/20">
          <CardHeader>
            <CardTitle>Select Recovery Method</CardTitle>
            <CardDescription>
              Choose the recovery method that works best for your situation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-amber-500/30 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-500">Important Security Notice</AlertTitle>
              <AlertDescription className="text-amber-400/80">
                For your protection, recovery attempts are logged and monitored. 
                Multiple failed attempts may trigger additional security checks.
              </AlertDescription>
            </Alert>

            <div className="text-center text-gray-400">
            Device recovery functionality will be implemented with the new wallet system.
          </div>
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="border-[#6B00D7] text-white hover:bg-[#6B00D7]/10"
                onClick={() => navigate("/security-dashboard")}
              >
                Return to Security Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceRecoveryPage;