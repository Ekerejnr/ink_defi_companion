import { useBalance, useBlockNumber } from "wagmi";
import { inkChain } from "../config/wagmi";

export function useInkBalance(address: string | undefined) {
  const { data: balance, isLoading: balanceLoading, refetch } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: inkChain.id,
    query: {
      enabled: !!address,
      refetchInterval: 15000, // Refetch every 15 seconds
    },
  });

  const { data: blockNumber } = useBlockNumber({
    chainId: inkChain.id,
    query: {
      refetchInterval: 12000, // Refetch every 12 seconds
    },
  });

  return {
    balance,
    balanceLoading,
    blockNumber,
    refetch,
    formattedBalance: balance
      ? parseFloat(balance.formatted).toFixed(6)
      : "0.000000",
  };
}