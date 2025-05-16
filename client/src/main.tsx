import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { wagmiConfig } from "@/lib/web3Config";
import { AuthProvider } from "@/contexts/auth-context";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { BlockchainErrorProvider, BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";
import { DevModeProvider } from "@/contexts/dev-mode-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/wallet-context";
import { CVTTokenProvider } from "@/contexts/cvt-token-context";

// Create a properly nested provider structure
// We need to move the BlockchainErrorDisplay after all blockchain providers
// are initialized in the App component
createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="chronos-vault-theme">
        <TooltipProvider>
          <BlockchainErrorProvider>
            <DevModeProvider>
              <WalletProvider>
                <CVTTokenProvider>
                  <AuthProvider>
                    <App />
                    <Toaster />
                  </AuthProvider>
                </CVTTokenProvider>
              </WalletProvider>
            </DevModeProvider>
          </BlockchainErrorProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
