import { Button } from "@/components/ui/button";
import { 
  Globe, FileText, CheckCircle, ShieldCheck, Landmark, Diamond
} from "lucide-react";
import { useLocation } from "wouter";

const StakingTiersSection = () => {
  const [_, setLocation] = useLocation();
  
  return (
    <div className="mt-16 mb-16">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white mb-4 animate-text-shine">CVT Staking Tiers & Benefits</h3>
        <p className="text-gray-300 max-w-2xl mx-auto">Stake your CVT tokens to unlock premium features and reduce transaction fees</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Vault Guardian Tier */}
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
          
          <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)] h-full">
            {/* Top Gradient Line Effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>
            
            {/* Badge */}
            <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
              1,000+ CVT
            </div>

            {/* Title and Description */}
            <h3 className="text-xl font-bold text-white mt-2 mb-3 flex items-center">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                <ShieldCheck className="text-[#FF5AF7] w-6 h-6" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7]">Vault Guardian</span>
            </h3>
            
            <p className="text-gray-300 mb-5 pl-1 text-sm">
              Entry-level staking tier with significant fee reductions and basic premium features.
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF5AF7] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">75% reduction in vault creation fees</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF5AF7] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Access to Specialized Vaults</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF5AF7] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Priority customer support</span>
              </li>
            </ul>
            
            {/* Shimmering Effect */}
            <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Vault Architect Tier */}
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
          
          <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#FF5AF7]/30 hover:border-[#FF5AF7]/60 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(255,90,247,0.4)] h-full">
            {/* Top Gradient Line Effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/80 to-transparent"></div>
            
            {/* Badge */}
            <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#FF5AF7]/20 text-[#FF5AF7] rounded-full font-medium">
              10,000+ CVT
            </div>

            {/* Title and Description */}
            <h3 className="text-xl font-bold text-white mt-2 mb-3 flex items-center">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#FF5AF7]/20 to-[#6B00D7]/10 flex items-center justify-center">
                <Landmark className="text-[#FF5AF7] w-6 h-6" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7]">Vault Architect</span>
            </h3>
            
            <p className="text-gray-300 mb-5 pl-1 text-sm">
              Mid-tier staking level with near-complete fee reductions and expanded premium features.
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF5AF7] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">90% reduction in vault creation fees</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF5AF7] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Access to all Specialized Vaults</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF5AF7] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Customized security protocols</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF5AF7] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">VIP customer support</span>
              </li>
            </ul>
            
            {/* Shimmering Effect */}
            <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Vault Sovereign Tier */}
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
          
          <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)] h-full">
            {/* Top Gradient Line Effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/80 to-transparent"></div>
            
            {/* Badge */}
            <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-full font-medium">
              100,000+ CVT
            </div>

            {/* Title and Description */}
            <h3 className="text-xl font-bold text-white mt-2 mb-3 flex items-center">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/10 flex items-center justify-center">
                <Diamond className="text-[#FFD700] w-6 h-6" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFD700] via-white">Vault Sovereign</span>
            </h3>
            
            <p className="text-gray-300 mb-5 pl-1 text-sm">
              Top-tier staking level with complete fee elimination and exclusive premium features.
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">100% elimination of all fees</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Unlimited vaults across all chains</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Custom security design services</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Dedicated account manager</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Early access to new features</span>
              </li>
            </ul>
            
            {/* Shimmering Effect */}
            <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Buttons for Tokenomics and Whitepaper */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Button 
          variant="outline" 
          className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10 font-semibold py-6 px-8 rounded-xl transition-all"
          onClick={() => setLocation("/cvt-tokenomics")}
        >
          <Globe className="mr-2 h-5 w-5" />
          CVT Tokenomics
        </Button>
        
        <Button 
          variant="outline" 
          className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10 font-semibold py-6 px-8 rounded-xl transition-all"
          onClick={() => setLocation("/whitepaper")}
        >
          <FileText className="mr-2 h-5 w-5" />
          CVT Whitepaper
        </Button>
      </div>
    </div>
  );
};

export default StakingTiersSection;