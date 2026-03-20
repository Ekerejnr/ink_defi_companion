import { useState, useEffect } from "react";

// Token type
interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
  marketCap: number;
  progress: number;
  createdAt: string;
  contractAddress: string;
}

// Placeholder tokens for when API is unavailable
const PLACEHOLDER_TOKENS: Token[] = [
  {
    id: "1",
    name: "Inky Pepe",
    symbol: "INKYPEPE",
    image: "🐸",
    description: "The OG memecoin on Ink L2",
    marketCap: 125000,
    progress: 78,
    createdAt: "2h ago",
    contractAddress: "0x1234...5678",
  },
  {
    id: "2",
    name: "Ink Doge",
    symbol: "INKDOGE",
    image: "🐕",
    description: "Much ink, very fast, wow",
    marketCap: 89000,
    progress: 45,
    createdAt: "5h ago",
    contractAddress: "0x8765...4321",
  },
  {
    id: "3",
    name: "Kraken Inu",
    symbol: "KINU",
    image: "🦑",
    description: "Kraken's favorite memecoin",
    marketCap: 234000,
    progress: 92,
    createdAt: "1d ago",
    contractAddress: "0xabcd...efgh",
  },
  {
    id: "4",
    name: "Superchain Cat",
    symbol: "SCAT",
    image: "🐱",
    description: "Meowing across all L2s",
    marketCap: 45000,
    progress: 23,
    createdAt: "3h ago",
    contractAddress: "0xdead...beef",
  },
  {
    id: "5",
    name: "Ink Moon",
    symbol: "IMOON",
    image: "🌙",
    description: "To the moon on Ink L2",
    marketCap: 178000,
    progress: 65,
    createdAt: "12h ago",
    contractAddress: "0xcafe...babe",
  },
];

export function PumpTab() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"new" | "trending">("new");

  useEffect(() => {
    // Simulate API fetch — replace with real InkyPump API when available
    const fetchTokens = async () => {
      setLoading(true);
      try {
        // Try to fetch from InkyPump API
        // const response = await fetch("https://api.inkypump.com/tokens/recent");
        // const data = await response.json();
        // setTokens(data);

        // For now use placeholders with a small delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 800));
        setTokens(PLACEHOLDER_TOKENS);
      } catch (err) {
        console.error("Failed to fetch tokens:", err);
        setTokens(PLACEHOLDER_TOKENS);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [filter]);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">InkyPump 🚀</h2>
        <a
          href="https://inkypump.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#6C63FF] bg-[#6C63FF20] px-3 py-1 rounded-full"
        >
          Open App →
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("new")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === "new"
              ? "bg-[#6C63FF] text-white"
              : "bg-[#111111] text-gray-400 border border-[#222222]"
          }`}
        >
          🆕 New
        </button>
        <button
          onClick={() => setFilter("trending")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === "trending"
              ? "bg-[#6C63FF] text-white"
              : "bg-[#111111] text-gray-400 border border-[#222222]"
          }`}
        >
          🔥 Trending
        </button>
      </div>

      {/* Token List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#111111] rounded-2xl p-4 border border-[#222222] animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#222222] rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#222222] rounded w-24"></div>
                  <div className="h-3 bg-[#222222] rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-[#111111] rounded-2xl p-3 border border-[#222222]">
        <p className="text-xs text-gray-500 text-center">
          ⚠️ Demo data shown — live InkyPump feed coming soon
        </p>
      </div>
    </div>
  );
}

// Token Card Component
function TokenCard({ token }: { token: Token }) {
  return (
    <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222] hover:border-[#6C63FF50] transition-all">
      <div className="flex items-start gap-3">
        {/* Token Icon */}
        <div className="w-12 h-12 bg-[#222222] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          {token.image}
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-bold text-sm">{token.name}</span>
              <span className="text-gray-500 text-xs ml-2">${token.symbol}</span>
            </div>
            <span className="text-xs text-gray-500">{token.createdAt}</span>
          </div>

          <p className="text-xs text-gray-400 mb-2 truncate">
            {token.description}
          </p>

          {/* Bonding Curve Progress */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Bonding curve</span>
              <span className="text-xs text-[#6C63FF]">{token.progress}%</span>
            </div>
            <div className="w-full bg-[#222222] rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-[#6C63FF] to-[#a78bfa] h-1.5 rounded-full transition-all"
                style={{ width: `${token.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Market Cap + Trade Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              MCap: <span className="text-white">${token.marketCap.toLocaleString()}</span>
            </span>
            <a
              href={`https://inkyswap.com/swap?token=${token.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-[#6C63FF] text-white px-3 py-1 rounded-lg hover:bg-[#5a52d5] transition-all"
            >
              Trade →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}