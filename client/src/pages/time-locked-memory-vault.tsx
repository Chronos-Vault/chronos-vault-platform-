import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Clock, Shield, Image, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TimeLockedMemoryVault: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/vault-types" className="text-gray-400 flex items-center hover:text-[#FF5AF7] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vault Types
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-white">Time-Locked Memory Vault</h1>
        <p className="text-gray-400">
          Combine digital assets with multimedia memories that unlock at a future date
        </p>
      </div>
      
      <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Time-Locked Memory Vault Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What are Time-Locked Memory Vaults?</h3>
            <p className="text-gray-400">
              A specialized vault type that combines digital assets with multimedia memories 
              (photos, videos, messages) that unlock at a future date. Perfect for creating digital 
              time capsules, future gifts, or preserving memories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center space-y-2 bg-[#1A1A1A] p-4 rounded-lg border border-[#6B00D7]/10">
              <div className="w-10 h-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-[#FF5AF7]">
                <Image className="w-5 h-5" />
              </div>
              <h4 className="font-medium">Photos & Media</h4>
              <p className="text-sm text-center text-gray-400">Store photos and videos that unlock at a specific time</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 bg-[#1A1A1A] p-4 rounded-lg border border-[#6B00D7]/10">
              <div className="w-10 h-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-[#FF5AF7]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-medium">Personal Messages</h4>
              <p className="text-sm text-center text-gray-400">Include personal notes and messages with your memories</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 bg-[#1A1A1A] p-4 rounded-lg border border-[#6B00D7]/10">
              <div className="w-10 h-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-[#FF5AF7]">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-medium">Future Unlocking</h4>
              <p className="text-sm text-center text-gray-400">Set precise dates or events when memories will be accessible</p>
            </div>
          </div>
          
          <div className="bg-[#2A1143] p-4 rounded-lg">
            <h3 className="text-lg font-medium flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#FF5AF7]" />
              Enhanced Security Features
            </h3>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-gray-300">
                Triple-chain protection across Ethereum, Solana, and TON blockchains
              </li>
              <li className="text-sm text-gray-300">
                Advanced encryption ensures only authorized recipients can access
              </li>
              <li className="text-sm text-gray-300">
                Permanent storage options for multi-decade memories
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5A00B6] hover:to-[#EE49E6]">
              Continue to Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeLockedMemoryVault;