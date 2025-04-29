import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex-1 w-full flex items-center justify-center py-20">
        <Card className="w-full max-w-md mx-4 bg-[#1A1A1A] border border-[#6B00D7]/20 shadow-xl shadow-[#6B00D7]/5">
          <CardContent className="pt-12 pb-10 px-8 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#6B00D7]/10 flex items-center justify-center mb-6">
              <AlertCircle className="h-12 w-12 text-[#FF5AF7]" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
              404 - Page Not Found
            </h1>

            <p className="text-lg text-gray-300 text-center mb-8 font-poppins font-light">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white rounded-lg px-8 py-2 font-medium transition-all">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
