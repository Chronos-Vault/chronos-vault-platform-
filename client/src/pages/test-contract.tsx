import React from 'react';
import TestContractDeployment from '@/components/testing/TestContractDeployment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestContractPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
          Contract Development & Testing
        </h1>
        <p className="text-gray-300 mt-2 max-w-3xl">
          This area allows developers to test and deploy smart contracts on various blockchain testnets. All deployments are to test networks only and have no real-world impact.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TestContractDeployment className="w-full" />
      </div>
    </div>
  );
}
