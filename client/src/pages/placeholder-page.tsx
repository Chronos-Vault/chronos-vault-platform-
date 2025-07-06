import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

interface PlaceholderPageProps {
  pageName: string;
  description?: string;
}

export default function PlaceholderPage({ pageName, description }: PlaceholderPageProps) {
  const [location, _] = useLocation();
  const currentPath = location;

  return (
    <div className="flex-1 w-full flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl mx-4 bg-[#1A1A1A] border border-[#6B00D7]/20 shadow-xl shadow-[#6B00D7]/5">
        <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#6B00D7]/10 flex items-center justify-center mb-6">
            <Info className="h-10 w-10 text-[#FF5AF7]" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
            {pageName}
          </h1>

          <p className="text-base md:text-lg text-gray-300 text-center mb-8 font-poppins font-light">
            {description || `This page is currently under development. The functionality for "${currentPath}" will be available soon.`}
          </p>
          
          <div className="flex gap-4">
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white rounded-lg px-6 py-2 font-medium transition-all flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}