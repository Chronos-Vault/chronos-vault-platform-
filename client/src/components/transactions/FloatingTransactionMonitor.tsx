import React from 'react';
import { Link } from 'wouter';
import { ChartLine, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const FloatingTransactionMonitor = () => {
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/transaction-monitor">
        <motion.div 
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white shadow-lg shadow-[#FF5AF7]/30 cursor-pointer hover:shadow-xl hover:shadow-[#FF5AF7]/40 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChartLine className="h-5 w-5" />
          <span className="font-medium">Transaction Monitor</span>
          <Badge className="h-5 bg-white text-[#6B00D7] font-bold text-xs">NEW</Badge>
          <Activity className="h-4 w-4 ml-1 animate-pulse" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default FloatingTransactionMonitor;