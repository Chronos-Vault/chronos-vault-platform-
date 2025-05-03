import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import logoPath from '@assets/IMG_3726.jpeg';

export default function LogoReviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D1F]">
      <main className="flex-grow container mx-auto px-4 py-10 max-w-7xl">
        <div className="space-y-12">
          {/* Hero section */}
          <div className="text-center my-12 space-y-5 relative">
            <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full -z-10"></div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
              Chronos Vault Logo Review
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Evaluating our potential logo for the Chronos Vault brand
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="flex flex-col items-center space-y-8">
              <div className="w-80 h-80 rounded-2xl border-4 border-[#6B00D7] overflow-hidden shadow-2xl">
                <img 
                  src={logoPath} 
                  alt="Proposed Chronos Vault Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-[#6B00D7] to-[#9747FF] text-white hover:opacity-90 transition-all px-6">
                  Download Logo
                </Button>
                <Button variant="outline" className="text-white border-[#444] hover:bg-[#222] hover:text-white">
                  View Variations
                </Button>
              </div>
            </div>
            
            <div className="space-y-8">
              <Card className="border border-[#2A2A42] bg-[#14141F]/60 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#6B00D7] opacity-10 blur-3xl"></div>
                
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Logo Analysis</CardTitle>
                  <CardDescription className="text-gray-400">Professional assessment of the proposed logo</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">Brand Alignment</h3>
                    <p className="font-light leading-relaxed">
                      The proposed logo effectively captures the essence of our "Tesla x Rolex x Web3" luxury branding. The geometric design with subtle gradients conveys a sense of precision and technological sophistication.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">Visual Impact</h3>
                    <p className="font-light leading-relaxed">
                      The logo has strong visual presence with its distinctive shape and premium color palette. The deep royal purple (#6B00D7) combined with neon pink accents (#FF5AF7) creates an eye-catching contrast that will stand out in the blockchain space.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">Versatility & Recognition</h3>
                    <p className="font-light leading-relaxed">
                      The logo is simple enough to remain recognizable at various sizes, from app icons to website headers. The distinctive shape creates a memorable silhouette that will help with brand recognition as Chronos Vault grows in the market.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-[#2A2A42]">
                    <h3 className="text-xl font-medium text-white mb-2">Final Assessment</h3>
                    <p className="font-light leading-relaxed">
                      This logo is an excellent representation of the Chronos Vault brand identity. It effectively communicates our position as a premium, cutting-edge platform in the blockchain space while maintaining the sophisticated aesthetic that appeals to our target audience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}