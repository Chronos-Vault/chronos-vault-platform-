type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

type RegionalData = {
  adoptionRate: string;
  blockchainStats: {
    userPercentage: number;
    growthRate: number;
    popularChains: string[];
  };
  culturalElements?: {
    timeReferences: string[];
    traditionalConcepts: string[];
  };
};

// Get time-based theme settings
export function getTimeBasedTheme(timeOfDay: TimeOfDay): string {
  const themes = {
    morning: 'theme-morning',
    afternoon: 'theme-afternoon',
    evening: 'theme-evening',
    night: 'theme-night'
  };
  
  return themes[timeOfDay];
}

// Get regional elements for personalization
export function getRegionalElements(country: string | null): RegionalData | null {
  if (!country) return null;
  
  // Default regional data
  const defaultData: RegionalData = {
    adoptionRate: 'growing steadily',
    blockchainStats: {
      userPercentage: 5,
      growthRate: 12,
      popularChains: ['Ethereum', 'TON', 'Solana']
    }
  };
  
  // Region-specific data (expanded as needed)
  const regionData: Record<string, Partial<RegionalData>> = {
    'United States': {
      adoptionRate: 'rapidly growing',
      blockchainStats: {
        userPercentage: 12,
        growthRate: 18,
        popularChains: ['Ethereum', 'Bitcoin', 'Solana']
      }
    },
    'United Kingdom': {
      adoptionRate: 'steadily increasing',
      blockchainStats: {
        userPercentage: 8,
        growthRate: 15,
        popularChains: ['Ethereum', 'Solana', 'TON']
      }
    },
    'Japan': {
      adoptionRate: 'well-established',
      blockchainStats: {
        userPercentage: 16,
        growthRate: 9,
        popularChains: ['Bitcoin', 'Ethereum', 'TON']
      },
      culturalElements: {
        timeReferences: ['shunkashuutou (four seasons)', 'nenmatsu (year-end)'],
        traditionalConcepts: ['yuino (engagement gifts)', 'koseki (family registry)']
      }
    },
    'South Korea': {
      adoptionRate: 'very high',
      blockchainStats: {
        userPercentage: 19,
        growthRate: 7,
        popularChains: ['Ethereum', 'Klaytn', 'TON']
      }
    },
    'China': {
      adoptionRate: 'complex but emerging',
      blockchainStats: {
        userPercentage: 9,
        growthRate: 22,
        popularChains: ['TON', 'BSC', 'NEO']
      }
    },
    'Russia': {
      adoptionRate: 'rapidly expanding',
      blockchainStats: {
        userPercentage: 11,
        growthRate: 25,
        popularChains: ['TON', 'Ethereum', 'Bitcoin']
      }
    },
    'Germany': {
      adoptionRate: 'growing with regulation',
      blockchainStats: {
        userPercentage: 7,
        growthRate: 14,
        popularChains: ['Ethereum', 'Bitcoin', 'Polygon']
      }
    },
    'India': {
      adoptionRate: 'exponential growth',
      blockchainStats: {
        userPercentage: 14,
        growthRate: 35,
        popularChains: ['Ethereum', 'Polygon', 'TON']
      }
    },
    'Brazil': {
      adoptionRate: 'rapid adoption',
      blockchainStats: {
        userPercentage: 10,
        growthRate: 28,
        popularChains: ['Bitcoin', 'TON', 'Ethereum']
      }
    },
    'Australia': {
      adoptionRate: 'steady growth',
      blockchainStats: {
        userPercentage: 9,
        growthRate: 16,
        popularChains: ['Ethereum', 'Bitcoin', 'Solana']
      }
    }
  };
  
  // Return region-specific data or default
  return country in regionData
    ? { ...defaultData, ...regionData[country] }
    : defaultData;
}