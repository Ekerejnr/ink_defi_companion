import { useState, useEffect } from "react";

// Bridge route type
interface BridgeRoute {
  id: string;
  name: string;
  icon: string;
  fromChain: string;
  toChain: string;
  estimatedTime: string;
  estimatedFee: string;
  url: string;
}

// Gas data type
interface GasData {
  slow: string;
  normal: string;
  fast: string;
  blockNumber: string;
}

// Bridge routes
const BRIDGE_ROUTES: BridgeRoute[] = [
  {
    id: "1",
    name: "Bungee",
    icon: "🔌",
    fromChain: "Ethereum",
    toChain: "Ink L2",
    estimatedTime: "~5 mins",
    estimatedFee: "~$2.50",
    url: "https://bungee.exchange",
  },
  {
    id: "2",
    name: "Owlto",
    icon: "🦉",
    fromChain: "Ethereum",
    toChain: "Ink L2",
    estimatedTime: "~2 mins",
    estimatedFee: "~$1.80",
    url: "https://owlto.finance",
  },
  {
    id: "3",
    name: "Relay",
    icon: "⚡",
    fromChain: "Base",
    toChain: "Ink L2",
    estimatedTime: "~1 min",
    estimatedFee: "~$0.50",
    url: "https://relay.link",
  },
  {
    id: "4",
    name: "Superbridge",
    icon: "🌉",
    fromChain: "Ethereum",
    toChain: "Ink L2",
    estimatedTime: "~7 days",
    estimatedFee: "~$1.20",
    url: "https://superbridge.app",
  },
];

export function BridgeTab() {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [gasLoading, setGasLoading] = useState(true);
  const [selectedFrom, setSelectedFrom] = useState<"ethereum" | "base" | "all">("all");
  const [activeSection, setActiveSection] = useState<"bridge" | "gas">("bridge");

  useEffect(() => {
    const fetchGasData = async () => {
      setGasLoading(true);
      try {
        // Fetch real gas data from Ink RPC
        const response = await fetch("https://rpc-gel.inkonchain.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_gasPrice",
            params: [],
            id: 1,
          }),
        });

        const blockResponse = await fetch("https://rpc-gel.inkonchain.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 2,
          }),
        });

        const gasResult = await response.json() as { result: string };
        const blockResult = await blockResponse.json() as { result: string };

        const gasPriceWei = parseInt(gasResult.result, 16);
        const gasPriceGwei = gasPriceWei / 1e9;

        setGasData({
          slow: (gasPriceGwei * 0.8).toFixed(4),
          normal: gasPriceGwei.toFixed(4),
          fast: (gasPriceGwei * 1.2).toFixed(4),
          blockNumber: parseInt(blockResult.result, 16).toLocaleString(),
        });
      } catch (err) {
        console.error("Failed to fetch gas data:", err);
        setGasData({
          slow: "0.0010",
          normal: "0.0012",
          fast: "0.0015",
          blockNumber: "N/A",
        });
      } finally {
        setGasLoading(false);
      }
    };

    fetchGasData();
    const interval = setInterval(fetchGasData, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredRoutes = BRIDGE_ROUTES.filter((route) => {
    if (selectedFrom === "all") return true;
    if (selectedFrom === "ethereum") return route.fromChain === "Ethereum";
    if (selectedFrom === "base") return route.fromChain === "Base";
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Bridge & Gas 🌉</h2>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-[#6C63FF] bg-[#6C63FF20] px-3 py-1 rounded-full"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection("bridge")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            activeSection === "bridge"
              ? "bg-[#6C63FF] text-white"
              : "bg-[#111111] text-gray-400 border border-[#222222]"
          }`}
        >
          🌉 Bridge
        </button>
        <button
          onClick={() => setActiveSection("gas")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            activeSection === "gas"
              ? "bg-[#6C63FF] text-white"
              : "bg-[#111111] text-gray-400 border border-[#222222]"
          }`}
        >
          ⛽ Gas
        </button>
      </div>

      {/* Bridge Section */}
      {activeSection === "bridge" && (
        <div className="space-y-3">
          {/* From Chain Filter */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Bridge from:</p>
            <div className="flex gap-2">
              {(["all", "ethereum", "base"] as const).map((chain) => (
                <button
                  key={chain}
                  onClick={() => setSelectedFrom(chain)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    selectedFrom === chain
                      ? "bg-[#6C63FF] text-white"
                      : "bg-[#111111] text-gray-400 border border-[#222222]"
                  }`}
                >
                  {chain === "all" && "🌐 All"}
                  {chain === "ethereum" && "⟠ ETH"}
                  {chain === "base" && "🔵 Base"}
                </button>
              ))}
            </div>
          </div>

          {/* Bridge Route Cards */}
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-[#111111] rounded-2xl p-4 border border-[#222222] hover:border-[#6C63FF50] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{route.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{route.name}</p>
                    <p className="text-xs text-gray-500">
                      {route.fromChain} → {route.toChain}
                    </p>
                  </div>
                </div>
                <a
                  href={route.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#6C63FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#5a52d5] transition-all"
                >
                  Bridge →
                </a>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-500">Est. Time</p>
                  <p className="text-xs font-medium text-white">
                    {route.estimatedTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Est. Fee</p>
                  <p className="text-xs font-medium text-green-400">
                    {route.estimatedFee}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <p className="text-xs text-gray-500 text-center">
            ⚠️ Fee estimates are approximate
          </p>
        </div>
      )}

      {/* Gas Section */}
      {activeSection === "gas" && (
        <div className="space-y-3">
          {/* Live Gas Card */}
          <div className="bg-gradient-to-br from-[#6C63FF20] to-[#111111] rounded-2xl p-4 border border-[#6C63FF30]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">⛽ Ink L2 Gas Prices</p>
              <span className="text-xs text-green-400">🟢 Live</span>
            </div>

            {gasLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-[#222222] rounded w-32"></div>
                <div className="h-4 bg-[#222222] rounded w-24"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#111111] rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">🐢 Slow</p>
                  <p className="text-sm font-bold text-blue-400">
                    {gasData?.slow}
                  </p>
                  <p className="text-xs text-gray-600">Gwei</p>
                </div>
                <div className="bg-[#111111] rounded-xl p-3 text-center border border-[#6C63FF30]">
                  <p className="text-xs text-gray-500 mb-1">🚶 Normal</p>
                  <p className="text-sm font-bold text-[#6C63FF]">
                    {gasData?.normal}
                  </p>
                  <p className="text-xs text-gray-600">Gwei</p>
                </div>
                <div className="bg-[#111111] rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">🚀 Fast</p>
                  <p className="text-sm font-bold text-green-400">
                    {gasData?.fast}
                  </p>
                  <p className="text-xs text-gray-600">Gwei</p>
                </div>
              </div>
            )}
          </div>

          {/* Block Info */}
          <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
            <p className="text-xs text-gray-400 mb-3">Network Info</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Latest Block</span>
                <span className="text-xs font-mono text-white">
                  {gasData?.blockNumber ?? "Loading..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Network</span>
                <span className="text-xs text-green-400">🟢 Ink L2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Chain ID</span>
                <span className="text-xs font-mono text-white">57073</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Explorer</span>
                <a
                  href="https://explorer.inkonchain.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6C63FF]"
                >
                  View →
                </a>
              </div>
            </div>
          </div>

          {/* Gas Tips */}
          <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
            <p className="text-xs text-gray-400 mb-3">💡 Gas Tips</p>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                • Ink L2 gas fees are much lower than Ethereum mainnet
              </p>
              <p className="text-xs text-gray-500">
                • Bridge from Base for cheaper fees than from Ethereum
              </p>
              <p className="text-xs text-gray-500">
                • Gas prices update every 15 seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}