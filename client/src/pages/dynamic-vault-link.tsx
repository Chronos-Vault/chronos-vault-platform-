import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function DynamicVaultLink() {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-8">Dynamic Vault Links</h1>
      
      <div className="flex flex-col space-y-4 items-center">
        <Link href="/create-vault/dynamic">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Go to Dynamic Vault Form
          </Button>
        </Link>
        
        <Link href="/create-vault/dynamic-doc">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Go to Dynamic Vault Documentation
          </Button>
        </Link>
      </div>
    </div>
  );
}