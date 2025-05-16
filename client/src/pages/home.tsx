import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockIcon, ArrowRightIcon, CoinsIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Chronos Vault
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The most secure cross-chain time-locked vault platform, now with complete TON blockchain integration
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
            <Link href="/create-vault">Create a TON Vault</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/bridge">Bridge Assets</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <FeatureCard 
          title="TON Time Vaults" 
          description="Create secure time-locked vaults on the TON blockchain with military-grade security options"
          icon={<LockIcon className="h-6 w-6 text-white" />}
          href="/create-vault"
        />
        
        <FeatureCard 
          title="Cross-Chain Bridge" 
          description="Transfer assets seamlessly between TON, Ethereum, and Solana with the lowest fees in the industry"
          icon={<ArrowRightIcon className="h-6 w-6 text-white" />}
          href="/bridge"
        />
        
        <FeatureCard 
          title="CVT Token Staking" 
          description="Stake CVT tokens to earn rewards and get up to 100% fee discounts on all platform operations"
          icon={<CoinsIcon className="h-6 w-6 text-white" />}
          href="/staking"
        />
      </div>
      
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-8 border border-purple-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">TON Native Integration</h2>
            <p className="text-muted-foreground mb-6">
              Experience the power of TON blockchain with Chronos Vault's native integration. 
              Lower fees, faster transactions, and enhanced security features make TON the 
              ideal blockchain for time-locked vaults.
            </p>
            <ul className="space-y-2">
              {[
                "Up to 95% lower fees compared to Ethereum",
                "Military-grade encryption with quantum resistance",
                "Multi-signature security with up to 16 participants",
                "Cross-chain verification for maximum asset protection"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center text-center gap-2 p-4 bg-secondary/30 rounded-lg">
              <div className="text-4xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">Lower Fees</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 bg-secondary/30 rounded-lg">
              <div className="text-4xl font-bold">3.2s</div>
              <div className="text-sm text-muted-foreground">Transaction Speed</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 bg-secondary/30 rounded-lg">
              <div className="text-4xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">Security Levels</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 bg-secondary/30 rounded-lg">
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <Card className="border border-purple-500/20 transition-all hover:border-purple-500/50 hover:shadow-md">
      <CardHeader>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="link" className="px-0">
          <Link href={href}>
            Learn more <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}