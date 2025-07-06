import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MultiSigTest = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Multi-Signature Vault Form Test Page</h1>
      <p className="mb-8 text-gray-300">This is a test page to debug the routing to the multi-signature vault form.</p>
      
      <div className="space-y-8">
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Direct Links</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Using Link Component:</h3>
              <Link href="/multi-signature-vault-new">
                <Button>Go to Multi-Signature Form (Link)</Button>
              </Link>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Using window.location:</h3>
              <Button onClick={() => window.location.href = '/multi-signature-vault-new'}>
                Go to Multi-Signature Form (window.location.href)
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Using window.location.replace:</h3>
              <Button onClick={() => window.location.replace('/multi-signature-vault-new')}>
                Go to Multi-Signature Form (window.location.replace)
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">With full URL:</h3>
              <Button onClick={() => window.location.href = window.location.origin + '/multi-signature-vault-new'}>
                Go to Multi-Signature Form (full URL)
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/vault-types">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vault Types
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MultiSigTest;