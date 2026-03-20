import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { PortfolioTab } from "./components/PortfolioTab";
import { PumpTab } from "./components/PumpTab";
import { TradeTab } from "./components/TradeTab";
import { BridgeTab } from "./components/BridgeTab";

// Tab types
type Tab = "portfolio" | "pump" | "trade" | "bridge";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const { address, isConnected } = useAccount();

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-[#222222]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🖊️</span>
          <span className="font-bold text-lg">Ink DeFi</span>
        </div>
        <ConnectButton
          showBalance={false}
          chainStatus="none"
          accountStatus="avatar"
        />
      </header>

      {/* Wallet Status Bar */}
      {isConnected && address && (
        <div className="px-4 py-2 bg-[#6C63FF20] border-b border-[#6C63FF30]">
          <p className="text-xs text-[#6C63FF]">
            ✅ Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === "portfolio" && <PortfolioTab />}
        {activeTab === "pump" && <PumpTab />}
        {activeTab === "trade" && <TradeTab />}
        {activeTab === "bridge" && <BridgeTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#222222] flex items-center justify-around px-2 py-2">
        <TabButton
          icon="📊"
          label="Portfolio"
          active={activeTab === "portfolio"}
          onClick={() => setActiveTab("portfolio")}
        />
        <TabButton
          icon="🚀"
          label="InkyPump"
          active={activeTab === "pump"}
          onClick={() => setActiveTab("pump")}
        />
        <TabButton
          icon="📈"
          label="Trade"
          active={activeTab === "trade"}
          onClick={() => setActiveTab("trade")}
        />
        <TabButton
          icon="🌉"
          label="Bridge"
          active={activeTab === "bridge"}
          onClick={() => setActiveTab("bridge")}
        />
      </nav>
    </div>
  );
}

// Tab Button Component
function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
        active
          ? "text-[#6C63FF] bg-[#6C63FF15]"
          : "text-gray-500 hover:text-gray-300"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default App;