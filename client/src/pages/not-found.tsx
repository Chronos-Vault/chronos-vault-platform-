import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCcw, Home, RotateCcw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [_, navigate] = useLocation();
  const [isEmergencyVisible, setIsEmergencyVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Re-check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Function to toggle emergency options
  const toggleEmergencyOptions = () => {
    setIsEmergencyVisible(!isEmergencyVisible);
  };
  
  return (
    <div className="flex-1 w-full flex items-center justify-center py-12">
      <Card className="w-full max-w-md mx-4 bg-[#1A1A1A] border border-[#6B00D7]/20 shadow-xl shadow-[#6B00D7]/5">
        <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#6B00D7]/10 flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-[#FF5AF7]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
            404 - Page Not Found
          </h1>

          <p className="text-lg text-gray-300 text-center mb-6 font-poppins font-light">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex gap-4 mb-6">
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white rounded-lg px-6 py-2 font-medium transition-all flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
            
            {isMobile && (
              <Link href="/mobile-direct">
                <Button className="bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white rounded-lg px-6 py-2 font-medium transition-all flex items-center">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile App
                </Button>
              </Link>
            )}
            
            <Button 
              variant="outline" 
              className="border-[#6B00D7]/30 text-[#FF5AF7] hover:bg-[#6B00D7]/10 rounded-lg px-6 py-2 font-medium transition-all flex items-center"
              onClick={toggleEmergencyOptions}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Emergency
            </Button>
          </div>
          
          {/* Emergency options - only visible when toggled */}
          {isEmergencyVisible && (
            <div className="w-full rounded-md bg-[#FF5AF7]/5 border border-[#FF5AF7]/20 p-4 mb-2">
              <h3 className="text-[#FF5AF7] font-semibold mb-2">Emergency Recovery Options</h3>
              
              <p className="text-gray-300 text-sm mb-4">
                If you're experiencing issues with the application, you can try these recovery options:
              </p>
              
              <div className="flex flex-col gap-2">
                {isMobile && (
                  <>
                    <Button 
                      variant="outline"
                      className="w-full justify-between border-[#FF5AF7]/30 bg-[#1A1A1A] hover:bg-[#FF5AF7]/10"
                      onClick={() => navigate('/mobile-direct')}
                    >
                      <span className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4 text-[#FF5AF7]" />
                        Mobile Direct Experience
                      </span>
                      <span className="text-xs bg-[#FF5AF7]/20 text-[#FF5AF7] px-2 py-1 rounded">Recommended</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full justify-between border-[#6B00D7]/30 bg-[#1A1A1A] hover:bg-[#6B00D7]/10 mt-2"
                      onClick={() => navigate('/mobile')}
                    >
                      <span className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4 text-[#6B00D7]" />
                        Simple Mobile Landing
                      </span>
                      <span className="text-xs bg-[#6B00D7]/20 text-[#6B00D7] px-2 py-1 rounded">Alternative</span>
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="outline"
                  className="w-full justify-between border-[#FF5AF7]/30 bg-[#1A1A1A] hover:bg-[#FF5AF7]/10"
                  onClick={() => navigate('/force-reset')}
                >
                  <span className="flex items-center">
                    <RotateCcw className="mr-2 h-4 w-4 text-[#FF5AF7]" />
                    Reset Onboarding
                  </span>
                  <span className="text-xs bg-[#FF5AF7]/20 text-[#FF5AF7] px-2 py-1 rounded">Recommended</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-between border-[#6B00D7]/30 bg-[#1A1A1A] hover:bg-[#6B00D7]/10"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                >
                  <span className="flex items-center">
                    <RefreshCcw className="mr-2 h-4 w-4 text-[#6B00D7]" />
                    Full Reset (Clear Storage)
                  </span>
                  <span className="text-xs bg-[#6B00D7]/20 text-[#6B00D7] px-2 py-1 rounded">Last Resort</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
