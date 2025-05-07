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
import { EthereumProvider } from "@/contexts/ethereum-context";
import { SolanaProvider } from "@/contexts/solana-context";
import { TonProvider } from "@/contexts/ton-context";
import { BlockchainErrorProvider, BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="chronos-vault-theme">
        <BlockchainErrorProvider>
          <BlockchainErrorDisplay />
          <AuthProvider>
            <EthereumProvider>
              <SolanaProvider>
                <TonProvider>
                  <App />
                  <Toaster />
                </TonProvider>
              </SolanaProvider>
            </EthereumProvider>
          </AuthProvider>
        </BlockchainErrorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
