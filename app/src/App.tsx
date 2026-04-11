import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { PortfolioTab } from "./components/PortfolioTab";
import { PumpTab } from "./components/PumpTab";
import { TradeTab } from "./components/TradeTab";
import { BridgeTab } from "./components/BridgeTab";
import {
  LayoutDashboard,
  Rocket,
  TrendingUp,
  ArrowLeftRight,
} from "lucide-react";
import {
  trackPageView,
  trackTabSwitch,
  trackWalletConnect,
  trackWalletDisconnect,
} from "./analytics";

type Tab = "portfolio" | "pump" | "trade" | "bridge";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const { address, isConnected } = useAccount();

  // Track initial page view
  useEffect(() => {
    trackPageView("/");
  }, []);

  // Track wallet connect/disconnect
  useEffect(() => {
    if (isConnected && address) {
      trackWalletConnect(address);
    } else {
      trackWalletDisconnect();
    }
  }, [isConnected, address]);

  // Handle tab switch with tracking
  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
    trackTabSwitch(tab);
    trackPageView(`/${tab}`);
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "var(--ink-bg)" }}
    >
      {/* Header */}
      <header
        style={{
          background:
            "linear-gradient(135deg, #0f0a1e 0%, #1a0f3e 50%, #0f0a1e 100%)",
          borderBottom: "1px solid var(--ink-border)",
        }}
        className="flex items-center justify-between px-4 py-3 sticky top-0 z-50"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center pulse-glow"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}
          >
            <span className="text-white font-black text-sm">INK</span>
          </div>
          <div>
            <span className="font-bold text-white text-base leading-none">
              Ink DeFi
            </span>
            <p
              className="text-xs leading-none mt-0.5"
              style={{ color: "var(--ink-purple-light)" }}
            >
              Companion
            </p>
          </div>
        </div>
        <ConnectButton
          showBalance={false}
          chainStatus="none"
          accountStatus="avatar"
        />
      </header>

      {/* Wallet Status Bar */}
      {isConnected && address && (
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{
            background: "var(--ink-purple-glow)",
            borderBottom: "1px solid var(--ink-border)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--ink-green)" }}
          ></div>
          <p className="text-xs" style={{ color: "var(--ink-purple-light)" }}>
            {address.slice(0, 6)}...{address.slice(-4)} connected on Ink L2
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === "portfolio" && <PortfolioTab />}
        {activeTab === "pump" && <PumpTab />}
        {activeTab === "trade" && <TradeTab />}
        {activeTab === "bridge" && <BridgeTab />}
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2"
        style={{
          background: "#0f0a1e",
          borderTop: "1px solid var(--ink-border)",
          backdropFilter: "blur(20px)",
        }}
      >
        <TabButton
          icon={<LayoutDashboard size={20} />}
          label="Portfolio"
          active={activeTab === "portfolio"}
          onClick={() => handleTabSwitch("portfolio")}
        />
        <TabButton
          icon={<Rocket size={20} />}
          label="InkyPump"
          active={activeTab === "pump"}
          onClick={() => handleTabSwitch("pump")}
        />
        <TabButton
          icon={<TrendingUp size={20} />}
          label="Trade"
          active={activeTab === "trade"}
          onClick={() => handleTabSwitch("trade")}
        />
        <TabButton
          icon={<ArrowLeftRight size={20} />}
          label="Bridge"
          active={activeTab === "bridge"}
          onClick={() => handleTabSwitch("bridge")}
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
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative"
      style={{
        color: active ? "var(--ink-purple-light)" : "var(--ink-text-faint)",
        background: active ? "var(--ink-purple-glow)" : "transparent",
      }}
    >
      {active && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
          style={{ background: "var(--ink-purple-light)" }}
        ></div>
      )}
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default App;