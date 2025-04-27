import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateProgress, formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Vault } from "@shared/schema";

interface VaultCardProps {
  vault: Vault;
  variant?: "legacy" | "investment" | "project";
}

const VaultCard = ({ vault, variant = "legacy" }: VaultCardProps) => {
  const progress = calculateProgress(vault.createdAt, vault.unlockDate);
  
  const getBgClass = () => {
    switch (variant) {
      case "legacy":
        return "bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5";
      case "investment":
        return "bg-gradient-to-br from-[#FF5AF7]/20 to-[#FF5AF7]/5";
      case "project":
        return "bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20";
      default:
        return "bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5";
    }
  };
  
  const getIconClass = () => {
    switch (variant) {
      case "legacy":
        return "ri-user-heart-line text-[#6B00D7] text-3xl";
      case "investment":
        return "ri-line-chart-line text-[#FF5AF7] text-3xl";
      case "project":
        return "ri-team-line text-white text-3xl";
      default:
        return "ri-user-heart-line text-[#6B00D7] text-3xl";
    }
  };
  
  const getButtonClass = () => {
    switch (variant) {
      case "legacy":
        return "w-full py-3 rounded-lg border border-[#6B00D7]/50 text-[#6B00D7] font-poppins font-medium hover:bg-[#6B00D7]/10 transition-all";
      case "investment":
        return "w-full py-3 rounded-lg border border-[#FF5AF7]/50 text-[#FF5AF7] font-poppins font-medium hover:bg-[#FF5AF7]/10 transition-all";
      case "project":
        return "w-full py-3 rounded-lg bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-poppins font-medium hover:opacity-90 transition-all";
      default:
        return "w-full py-3 rounded-lg border border-[#6B00D7]/50 text-[#6B00D7] font-poppins font-medium hover:bg-[#6B00D7]/10 transition-all";
    }
  };

  return (
    <Card className="vault-card bg-[#1E1E1E] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all">
      <div className={`h-48 ${getBgClass()} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center">
            <i className={getIconClass()}></i>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E1E1E] to-transparent h-20"></div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-poppins font-semibold text-xl">{vault.name}</h3>
          <Badge variant={vault.isLocked ? "default" : "secondary"}>
            {vault.isLocked ? "Locked" : "Unlocked"}
          </Badge>
        </div>
        
        <p className="text-gray-400 mb-4 text-sm line-clamp-2">{vault.description || `Perfect for ${variant} planning and ensuring your digital assets are secure.`}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Asset</span>
            <span className="text-sm text-white">{vault.assetType} {vault.assetAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Unlock Date</span>
            <span className="text-sm text-white">{formatDate(vault.unlockDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#333333]" />
        </div>
        
        <Link href={`/vault/${vault.id}`}>
          <Button className={getButtonClass()} variant="ghost">
            View Vault Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default VaultCard;
