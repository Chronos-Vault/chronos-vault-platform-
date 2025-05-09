import React, { useState } from "react";
import { Link } from "wouter";
import { MultiSignatureVault } from "@/components/multi-signature/multi-signature-vault";
import { BlockchainType } from "@/components/multi-signature/multi-signature-vault";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MultiSignatureVaultPage() {
  const [showDemo, setShowDemo] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="pt-6 pb-16">
        <div className="container">
          <div className="flex items-center mb-6">
            <Link to="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          {showDemo ? (
            <MultiSignatureVault 
              vaultName="Strategic Treasury Vault"
              vaultDescription="Multi-signature vault for company treasury with advanced security features and Triple-Chain protection"
              blockchain={BlockchainType.ETHEREUM}
              threshold={3}
              signers={[]}
              isReadOnly={false}
              onCreateVault={(data) => {
                console.log("Vault created:", data);
                setShowDemo(false);
              }}
            />
          ) : (
            <MultiSignatureVault 
              vaultName="Strategic Treasury Vault"
              vaultDescription="Multi-signature vault for company treasury with advanced security features and Triple-Chain protection"
              blockchain={BlockchainType.ETHEREUM}
              threshold={3}
              signers={[
                {
                  id: "1",
                  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                  name: "You (Owner)",
                  status: 'accepted',
                  role: 'owner',
                  timeAdded: new Date(),
                  hasKey: true
                },
                {
                  id: "2",
                  address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
                  name: "Alice (Finance)",
                  status: 'accepted',
                  role: 'signer',
                  timeAdded: new Date(),
                  hasKey: true
                },
                {
                  id: "3",
                  address: "0xDc26F5E4b5E4dEF47A247c38714499a9d5e57Eb9",
                  name: "Bob (Operations)",
                  status: 'accepted',
                  role: 'signer',
                  timeAdded: new Date(),
                  hasKey: true
                },
                {
                  id: "4",
                  address: "0x583031D1113aD414F02576BD6afaBfb302140225",
                  name: "Carol (Legal)",
                  status: 'accepted',
                  role: 'signer',
                  timeAdded: new Date(),
                  hasKey: true
                }
              ]}
              isReadOnly={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}