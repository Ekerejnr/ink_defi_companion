import { http } from "wagmi";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// ── Define Ink Chain ────────────────────────────────────────────────
export const inkChain = defineChain({
  id: 57073,
  name: "Ink",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-gel.inkonchain.com"],
    },
    public: {
      http: ["https://rpc-gel.inkonchain.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Ink Explorer",
      url: "https://explorer.inkonchain.com",
    },
  },
});

// ── Wagmi Config ────────────────────────────────────────────────────
export const config = getDefaultConfig({
  appName: "Ink DeFi Companion",
  projectId: "6dd848ee40e17afa41461abd733e94df", // We'll update this soon
  chains: [inkChain],
  transports: {
    [inkChain.id]: http("https://rpc-gel.inkonchain.com"),
  },
});