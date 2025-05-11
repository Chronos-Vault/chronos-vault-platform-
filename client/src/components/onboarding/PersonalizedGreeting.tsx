import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sun, Moon, Sunset } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';

export const PersonalizedGreeting = () => {
  const { completeCurrentStep } = useOnboarding();
  const [username, setUsername] = useLocalStorage<string>('chronosVault.username', '');
  const [tempUsername, setTempUsername] = useState('');
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState<React.ReactNode>(null);
  
  // Update the greeting based on the time of day
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
      setIcon(<Sun className="h-8 w-8 text-amber-400" />);
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good Afternoon');
      setIcon(<Sun className="h-8 w-8 text-orange-400" />);
    } else if (hour >= 18 && hour < 22) {
      setGreeting('Good Evening');
      setIcon(<Sunset className="h-8 w-8 text-purple-400" />);
    } else {
      setGreeting('Good Night');
      setIcon(<Moon className="h-8 w-8 text-blue-400" />);
    }
    
    // Set the temp username from localStorage
    setTempUsername(username);
  }, [username]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(tempUsername);
    completeCurrentStep();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-background/90">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {icon}
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {greeting}
          </motion.h1>
          
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Let's personalize your Chronos Vault experience
          </motion.p>
        </div>
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              What should we call you?
            </label>
            <Input
              id="username"
              placeholder="Enter your name"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="w-full border-primary/20 focus:border-primary"
              autoFocus
            />
            <p className="mt-2 text-xs text-muted-foreground">
              This will be used to personalize your experience
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            disabled={!tempUsername.trim()}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={completeCurrentStep}
          >
            Skip for now
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
};