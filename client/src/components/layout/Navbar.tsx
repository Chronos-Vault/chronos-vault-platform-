import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { WalletConnector } from '@/components/wallet/WalletConnector';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Briefcase, GitBranchIcon, CoinsIcon, LockIcon } from 'lucide-react';
import chronosLogo from '@assets/IMG_3753_1764790970107.jpeg';

export function Navbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center space-x-2" data-testid="link-home-logo">
              <div className="h-9 w-9 rounded-lg overflow-hidden border border-[#6B00D7]/30 shadow-lg shadow-[#6B00D7]/20">
                <img src={chronosLogo} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
              </div>
              <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#0098EA] text-transparent bg-clip-text">
                Chronos Vault
              </span>
            </a>
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem 
                      href="/create-vault" 
                      title="TON Time Vaults" 
                      icon={<LockIcon className="h-4 w-4" />}
                    >
                      Create secure time-locked vaults on the TON blockchain
                    </ListItem>
                    <ListItem 
                      href="/bridge" 
                      title="Cross-Chain Bridge" 
                      icon={<GitBranchIcon className="h-4 w-4" />}
                    >
                      Transfer assets between TON, Ethereum, and Solana 
                    </ListItem>
                    <ListItem 
                      href="/staking" 
                      title="CVT Staking" 
                      icon={<CoinsIcon className="h-4 w-4" />}
                    >
                      Stake CVT tokens to earn rewards and fee discounts
                    </ListItem>
                    <ListItem 
                      href="/portfolio" 
                      title="Portfolio" 
                      icon={<Briefcase className="h-4 w-4" />}
                    >
                      View and manage your crypto assets across chains
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/create-vault">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/create-vault') && "bg-muted"
                    )}
                  >
                    Create Vault
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/bridge">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/bridge') && "bg-muted"
                    )}
                  >
                    Bridge
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/staking">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/staking') && "bg-muted"
                    )}
                  >
                    Staking
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <WalletConnector />
          </div>
          
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <NavigationMenu className="md:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4">
              <MobileNavLink href="/" title="Home" />
              <MobileNavLink href="/create-vault" title="Create Vault" />
              <MobileNavLink href="/bridge" title="Bridge" />
              <MobileNavLink href="/staking" title="Staking" />
              <MobileNavLink href="/portfolio" title="Portfolio" />
              <li className="mt-2 pt-2 border-t">
                <div className="py-2">
                  <WalletConnector />
                </div>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps {
  title: string;
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function ListItem({ title, href, children, icon }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
            <div className="flex items-center gap-2 text-sm font-medium leading-none">
              {icon}
              <span>{title}</span>
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MobileNavLink({ href, title }: { href: string; title: string }) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <a className={cn(
            "block select-none rounded-md p-2 text-sm font-medium leading-none no-underline outline-none transition-colors",
            isActive ? 
              "bg-primary/10 text-primary" : 
              "hover:bg-accent hover:text-accent-foreground"
          )}>
            {title}
          </a>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;