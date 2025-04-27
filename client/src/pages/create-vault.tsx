import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import CreateVaultForm from "@/components/vault/create-vault-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
          <div className="text-center mb-12">
            <h1 className="font-poppins font-bold text-3xl mb-2">Create Your Time-Locked Vault</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">Design a secure vault to protect your assets with blockchain technology. Set the time lock period, add beneficiaries, and establish conditions for access.</p>
          </div>
          
          <Card className="mb-8 bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5 border-0">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-2 rounded-full bg-[#6B00D7]/20">
                  <i className="ri-shield-keyhole-line text-[#6B00D7] text-xl"></i>
                </div>
                <div>
                  <h3 className="font-poppins font-medium text-lg">Unbreakable Security</h3>
                  <p className="text-gray-400 text-sm">Your assets are secured by blockchain technology, with no centralized control or access.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 p-2 rounded-full bg-[#FF5AF7]/20">
                  <i className="ri-time-line text-[#FF5AF7] text-xl"></i>
                </div>
                <div>
                  <h3 className="font-poppins font-medium text-lg">Flexible Time Locks</h3>
                  <p className="text-gray-400 text-sm">Set time periods ranging from days to decades, with precise unlocking mechanisms.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <CreateVaultForm initialVaultType={vaultType} />
        </div>
      </div>
    </section>
  );
};

export default CreateVault;
