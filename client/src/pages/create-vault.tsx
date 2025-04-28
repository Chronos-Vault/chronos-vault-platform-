import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import CreateVaultForm from "@/components/vault/create-vault-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Clock, File } from "lucide-react";

const CreateVault = () => {
  const [_, params] = useLocation();
  const [vaultType, setVaultType] = useState("legacy");
  
  useEffect(() => {
    // Parse query params
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get("type");
    
    if (typeParam && ["legacy", "investment", "project"].includes(typeParam)) {
      setVaultType(typeParam);
    }
  }, []);
  
  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost" 
          className="mb-8 text-gray-400 hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-poppins font-bold text-3xl mb-2">Create Your Time-Locked Vault</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">Design a secure vault to protect your assets with blockchain technology. Set the time lock period, add beneficiaries, and establish conditions for access.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-[#6B00D7]/5 to-[#6B00D7]/10 border-[#6B00D7]/20 hover:border-[#6B00D7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#6B00D7]/20 mb-4">
                    <Shield className="h-6 w-6 text-[#6B00D7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Unbreakable Security</h3>
                  <p className="text-gray-400 text-sm">Your assets are secured by blockchain technology, with no centralized access.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-[#FF5AF7]/5 to-[#FF5AF7]/10 border-[#FF5AF7]/20 hover:border-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#FF5AF7]/20 mb-4">
                    <Clock className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Flexible Time Locks</h3>
                  <p className="text-gray-400 text-sm">Set time periods from days to decades with precise unlocking conditions.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/10 border-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/40 hover:to-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 mb-4">
                    <File className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Media Attachments</h3>
                  <p className="text-gray-400 text-sm">Include documents, images, videos, or other digital assets in your vault.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <CreateVaultForm initialVaultType={vaultType} />
        </div>
      </div>
    </section>
  );
};

export default CreateVault;
