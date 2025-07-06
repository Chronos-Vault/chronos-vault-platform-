import React from 'react';

// Token release phase information
export interface TokenReleasePhase {
  id: number;
  year: number;
  releaseDate: string;
  percentage: number;
  tokens: number;
  releaseDescription: string;
  status: 'released' | 'upcoming';
  vaultTheme: string;
  vaultImageUrl?: string;
}

// Main props interface
export interface JourneyVaultsProps {
  name?: string;
  description?: string;
  date?: {
    month: number;
    year: number;
  };
  completed?: boolean;
  percentage?: number;
  phases?: TokenReleasePhase[];
  type?: "feature" | "release" | "milestone";
  vaults?: TokenReleasePhase[];
  totalSupply?: number;
}

/**
 * A component for displaying roadmap milestones as digital time vaults
 */
const JourneyVaults: React.FC<JourneyVaultsProps> = ({
  name,
  description,
  date,
  completed,
  percentage = completed ? 100 : 0,
  phases = [],
  type = "feature",
  vaults = [],
  totalSupply = 0
}) => {
  // If we have the newer "vaults" prop, use that instead of phases
  const hasVaults = vaults && vaults.length > 0;
  
  const getStatusColor = (status?: string) => {
    if (status === 'released' || completed) return "#6B00D7";
    if (status === 'upcoming' && percentage > 0) return "#FF5AF7";
    return "#555555";
  };

  const getVaultThemeColor = (theme: string) => {
    switch (theme) {
      case 'genesis': return "#6B00D7";
      case 'quantum': return "#FF5AF7";
      case 'cosmic': return "#4A90E2";
      case 'nebula': return "#9B59B6";
      case 'aurora': return "#2ECC71";
      case 'infinity': return "#E67E22";
      default: return "#6B00D7";
    }
  };

  if (hasVaults) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Digital Time Vaults</h2>
        <div className="grid grid-cols-1 gap-6">
          {vaults.map((vault) => (
            <div 
              key={vault.id} 
              className={`p-6 rounded-lg border ${vault.status === 'released' ? 'border-[#6B00D7]/40' : 'border-[#FF5AF7]/40'} ${vault.status === 'released' ? 'bg-[#6B00D7]/5' : 'bg-[#1A1A1A]'}`}
            >
              <div className="flex items-center mb-3">
                <div className={`w-5 h-5 rounded-full mr-3`} style={{ backgroundColor: getVaultThemeColor(vault.vaultTheme) }}></div>
                <h3 className="font-semibold text-lg">Time Vault #{vault.id}</h3>
                {vault.status === 'released' && (
                  <span className="ml-auto bg-[#6B00D7]/20 text-[#6B00D7] text-xs py-1 px-2 rounded-full">
                    Released
                  </span>
                )}
                {vault.status === 'upcoming' && (
                  <span className="ml-auto bg-[#FF5AF7]/20 text-[#FF5AF7] text-xs py-1 px-2 rounded-full">
                    Upcoming
                  </span>
                )}
              </div>
              
              <div className="ml-8 space-y-2">
                <p className="text-sm text-gray-300">{vault.releaseDescription}</p>
                
                <div className="flex items-center text-xs text-gray-400">
                  <div className="mr-4">
                    <span className="font-medium">Release:</span> {vault.releaseDate}
                  </div>
                  <div>
                    <span className="font-medium">Tokens:</span> {vault.tokens.toLocaleString()} ({vault.percentage}%)
                  </div>
                </div>
                
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${vault.percentage}%`,
                      backgroundColor: getVaultThemeColor(vault.vaultTheme)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 rounded bg-gray-800 mt-6">
          <div className="text-sm">
            <span className="font-medium">Total Supply:</span> {totalSupply.toLocaleString()} CVT Tokens
          </div>
        </div>
      </div>
    );
  }

  // Legacy rendering for older props format
  return (
    <div className="relative p-5 rounded-lg border-2 mb-4" 
         style={{ 
           borderColor: `${getStatusColor()}40`,
           background: completed ? 'rgba(107, 0, 215, 0.05)' : '#1A1A1A'
         }}>
      <div className="flex items-center mb-2">
        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: getStatusColor() }}></div>
        <h3 className="font-semibold text-lg">{name}</h3>
        {completed && (
          <span className="ml-auto bg-[#6B00D7]/20 text-[#6B00D7] text-xs py-1 px-2 rounded-full">
            Completed
          </span>
        )}
        {!completed && percentage > 0 && (
          <span className="ml-auto bg-[#FF5AF7]/20 text-[#FF5AF7] text-xs py-1 px-2 rounded-full">
            In Progress
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-400 ml-7 mb-3">{description}</p>
      
      {date && (
        <div className="ml-7 text-xs text-gray-500">
          {date.month}/{date.year}
        </div>
      )}
      
      {percentage > 0 && percentage < 100 && (
        <div className="mt-3 ml-7">
          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{percentage}% complete</div>
        </div>
      )}
      
      {phases.length > 0 && (
        <div className="mt-4 ml-7">
          <h4 className="text-sm font-medium mb-2">Release Phases</h4>
          <div className="space-y-2">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${phase.status === 'released' ? 'bg-[#6B00D7]' : 'bg-gray-600'}`}></div>
                <span className="text-xs">{phase.releaseDescription} - {phase.releaseDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyVaults;