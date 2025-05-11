import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGeoLocation } from '@/hooks/use-geo-location';
import { getTimeBasedTheme, getRegionalElements } from '@/lib/personalization';
import { RegionalBackground } from './RegionalBackground';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const PersonalizedGreeting = ({ onContinue }: { onContinue: () => void }) => {
  const { country, city, loading, error } = useGeoLocation();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) setTimeOfDay('morning');
    else if (hours >= 12 && hours < 17) setTimeOfDay('afternoon');
    else if (hours >= 17 && hours < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const theme = getTimeBasedTheme(timeOfDay);
  const regionalElements = getRegionalElements(country);
  
  const getGreeting = () => {
    if (loading) return 'Welcome to Chronos Vault';
    
    const timeGreeting = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good evening'
    }[timeOfDay];
    
    return `${timeGreeting}${city ? ' from ' + city : ''}`;
  };

  return (
    <motion.div 
      className={`personalized-greeting relative h-full w-full flex items-center justify-center overflow-hidden ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <RegionalBackground region={country} timeOfDay={timeOfDay} />
      
      <div className="greeting-content relative z-10 max-w-2xl w-full p-8 backdrop-blur-sm bg-background/30 rounded-xl shadow-lg border border-primary/10">
        <motion.h1 
          className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {getGreeting()}
        </motion.h1>
        
        <motion.p 
          className="text-xl mb-8 text-foreground/90"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your journey to secure digital asset management begins now
        </motion.p>
        
        {regionalElements && (
          <motion.div 
            className="regional-context mb-8 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="text-lg font-medium mb-2">Blockchain in Your Region</h3>
            <p className="mb-3">In {country}, blockchain adoption is <span className="font-semibold">{regionalElements.adoptionRate}</span></p>
            <div className="regional-stats grid grid-cols-3 gap-4">
              <div className="stat p-2 bg-background/50 rounded-md text-center">
                <div className="text-primary text-2xl font-bold">{regionalElements.blockchainStats.userPercentage}%</div>
                <div className="text-sm text-muted-foreground">User Adoption</div>
              </div>
              <div className="stat p-2 bg-background/50 rounded-md text-center">
                <div className="text-primary text-2xl font-bold">{regionalElements.blockchainStats.growthRate}%</div>
                <div className="text-sm text-muted-foreground">Annual Growth</div>
              </div>
              <div className="stat p-2 bg-background/50 rounded-md text-center">
                <div className="text-[#FF5AF7] text-2xl font-bold">{regionalElements.blockchainStats.popularChains[0]}</div>
                <div className="text-sm text-muted-foreground">Top Chain</div>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center"
        >
          <Button 
            onClick={onContinue}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Start Your Chronos Journey
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};