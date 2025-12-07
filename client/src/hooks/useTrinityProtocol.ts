import { useQuery } from "@tanstack/react-query";
import trinityProtocolService, { 
  TrinityStats, 
  ChainStatus, 
  Validator, 
  SecurityLayer,
  LeanProof 
} from "@/services/TrinityProtocolService";

export function useTrinityStats() {
  return useQuery<TrinityStats>({
    queryKey: ['/api/trinity/stats'],
    queryFn: () => trinityProtocolService.getTrinityStats(),
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

export function useChains() {
  return useQuery<ChainStatus[]>({
    queryKey: ['/api/trinity/chains'],
    queryFn: () => trinityProtocolService.getChains(),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useValidators(status?: string) {
  return useQuery<Validator[]>({
    queryKey: ['/api/validators', status],
    queryFn: () => trinityProtocolService.getValidators(status),
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useValidatorByWallet(address: string | undefined) {
  return useQuery<Validator | null>({
    queryKey: ['/api/validators/wallet', address],
    queryFn: () => address ? trinityProtocolService.getValidatorByWallet(address) : null,
    enabled: !!address,
    staleTime: 30000,
  });
}

export function useSecurityLayers() {
  return useQuery<SecurityLayer[]>({
    queryKey: ['/api/trinity/security-layers'],
    queryFn: () => trinityProtocolService.getSecurityLayers(),
    staleTime: 60000,
  });
}

export function useLeanProofs() {
  return useQuery<LeanProof[]>({
    queryKey: ['/api/trinity/lean-proofs'],
    queryFn: () => trinityProtocolService.getLeanProofs(),
    staleTime: 60000,
  });
}

export function useQuantumStatus() {
  return useQuery({
    queryKey: ['/api/quantum/status'],
    queryFn: () => trinityProtocolService.getQuantumStatus(),
    staleTime: 60000,
  });
}

export function useDeployedContracts() {
  return useQuery({
    queryKey: ['/api/trinity/contracts'],
    queryFn: () => trinityProtocolService.getDeployedContracts(),
    staleTime: 300000,
  });
}

export function useValidatorAddresses() {
  return useQuery({
    queryKey: ['/api/trinity/validator-addresses'],
    queryFn: () => trinityProtocolService.getValidatorAddresses(),
    staleTime: 300000,
  });
}

export function useConsensusOperations(limit = 10) {
  return useQuery({
    queryKey: ['/api/scanner/consensus', limit],
    queryFn: () => trinityProtocolService.getConsensusOperations(limit),
    refetchInterval: 15000,
    staleTime: 10000,
  });
}

export function useHTLCSwaps(limit = 10) {
  return useQuery({
    queryKey: ['/api/scanner/swaps', limit],
    queryFn: () => trinityProtocolService.getHTLCSwaps(limit),
    refetchInterval: 15000,
    staleTime: 10000,
  });
}

export function useVaultOperations(limit = 10) {
  return useQuery({
    queryKey: ['/api/scanner/vaults', limit],
    queryFn: () => trinityProtocolService.getVaultOperations(limit),
    refetchInterval: 15000,
    staleTime: 10000,
  });
}

export function useBlockchainStatus() {
  return useQuery({
    queryKey: ['/api/blockchain/status'],
    queryFn: () => trinityProtocolService.getBlockchainStatus(),
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
