import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, Clock, Globe } from 'lucide-react';

export const PersonalizedGreeting = ({ onContinue }: { onContinue: () => void }) => {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [region, setRegion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Determine time of day for personalized greeting
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else if (hour >= 17 && hour < 22) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
    
    // Simulate fetching region information
    // In a real implementation, this would use a geolocation service
    setTimeout(() => {
      setRegion('Global');
      setLoading(false);
    }, 1500);
  }, []);
  
  // Get personalized greeting based on time of day
  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Good morning';
      case 'afternoon':
        return 'Good afternoon';
      case 'evening':
        return 'Good evening';
      case 'night':
        return 'Good night';
      default:
        return 'Hello';
    }
  };
  
  // Get illustration based on time of day
  const getIllustration = () => {
    switch (timeOfDay) {
      case 'morning':
        return (
          <div className="relative w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full bg-amber-400" />
            <div className="absolute w-full h-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-2 w-1 h-6 bg-amber-400"
                  style={{
                    left: '50%',
                    transformOrigin: 'bottom center',
                    transform: `rotate(${i * 45}deg) translateX(-50%)`,
                  }}
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    height: ['20px', '24px', '20px']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 'afternoon':
        return (
          <div className="relative w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full bg-blue-400" />
            <motion.div 
              className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-white"
              animate={{ 
                x: [0, 3, 0],
                y: [0, -3, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
            />
          </div>
        );
      case 'evening':
        return (
          <div className="relative w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center overflow-hidden">
            <div className="absolute w-16 h-16 rounded-full bg-indigo-400" />
            <div className="absolute w-20 h-20 rounded-full bg-indigo-900 -left-10" />
          </div>
        );
      case 'night':
        return (
          <div className="relative w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="absolute w-10 h-10 rounded-full bg-gray-200" />
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{ 
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        );
    }
  };
  
  return (
    <div className="personalized-greeting h-full w-full flex flex-col items-center justify-center p-6">
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Preparing your experience...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full flex flex-col items-center text-center"
        >
          <div className="mb-8">
            {getIllustration()}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]">Vault Explorer</span>
          </h1>
          
          <div className="flex items-center mb-2 text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">Local time: {new Date().toLocaleTimeString()}</span>
          </div>
          
          {region && (
            <div className="flex items-center mb-6 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">Region: {region}</span>
            </div>
          )}
          
          <p className="text-muted-foreground mb-8">
            We've customized your Chronos Vault experience based on your local time and region. Your vault security is our top priority, and all interactions are optimized for your location.
          </p>
          
          <Button onClick={onContinue} size="lg" className="gap-2">
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="mt-8 flex items-center text-xs text-muted-foreground">
            <Globe className="h-3 w-3 mr-1" />
            <span>All vault security features are available globally</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};