import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { wagmiConfig } from "@/lib/web3Config";
import { AuthProvider } from "@/contexts/auth-context";
import { queryClient } from "@/lib/queryClient";
import { MultiChainProvider } from "@/contexts/multi-chain-context";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="chronos-vault-theme">
        <AuthProvider>
          <MultiChainProvider>
            <App />
            <Toaster />
          </MultiChainProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
