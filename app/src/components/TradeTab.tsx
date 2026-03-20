import { useState, useEffect } from "react";

// Price pair type
interface PricePair {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  icon: string;
}

// Alert type
interface Alert {
  id: string;
  symbol: string;
  condition: "above" | "below";
  targetPrice: number;
  currentPrice: number;
  active: boolean;
}

// Placeholder price data
const PLACEHOLDER_PRICES: PricePair[] = [
  {
    id: "1",
    name: "Ethereum",
    symbol: "ETH/USD",
    price: 3245.67,
    change24h: 2.34,
    volume24h: 12500000,
    icon: "⟠",
  },
  {
    id: "2",
    name: "Wrapped Bitcoin",
    symbol: "WBTC/USD",
    price: 67823.45,
    change24h: -1.23,
    volume24h: 8900000,
    icon: "₿",
  },
  {
    id: "3",
    name: "USD Coin",
    symbol: "USDC/USD",
    price: 1.0001,
    change24h: 0.01,
    volume24h: 45000000,
    icon: "💵",
  },
  {
    id: "4",
    name: "Ink Token",
    symbol: "INK/USD",
    price: 0.00234,
    change24h: 15.67,
    volume24h: 234000,
    icon: "🖊️",
  },
];

export function TradeTab() {
  const [prices, setPrices] = useState<PricePair[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [alertSymbol, setAlertSymbol] = useState("ETH/USD");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [alertPrice, setAlertPrice] = useState("");
  const [activeSection, setActiveSection] = useState<"prices" | "positions" | "alerts">("prices");

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setPrices(PLACEHOLDER_PRICES);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        setPrices(PLACEHOLDER_PRICES);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const addAlert = () => {
    if (!alertPrice) return;
    const currentPrice =
      prices.find((p) => p.symbol === alertSymbol)?.price ?? 0;
    const newAlert: Alert = {
      id: Date.now().toString(),
      symbol: alertSymbol,
      condition: alertCondition,
      targetPrice: parseFloat(alertPrice),
      currentPrice,
      active: true,
    };
    setAlerts([...alerts, newAlert]);
    setAlertPrice("");
    setShowAddAlert(false);
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Trade & Alerts 📈</h2>
        <a
          href="https://nado.finance"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#6C63FF] bg-[#6C63FF20] px-3 py-1 rounded-full"
        >
          Open Nado →
        </a>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2">
        {(["prices", "positions", "alerts"] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
              activeSection === section
                ? "bg-[#6C63FF] text-white"
                : "bg-[#111111] text-gray-400 border border-[#222222]"
            }`}
          >
            {section === "prices" && "💹 Prices"}
            {section === "positions" && "📊 Positions"}
            {section === "alerts" && "🔔 Alerts"}
          </button>
        ))}
      </div>

      {/* Prices Section */}
      {activeSection === "prices" && (
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#111111] rounded-2xl p-4 border border-[#222222] animate-pulse"
                >
                  <div className="h-4 bg-[#222222] rounded w-32 mb-2"></div>
                  <div className="h-6 bg-[#222222] rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            prices.map((pair) => (
              <div
                key={pair.id}
                className="bg-[#111111] rounded-2xl p-4 border border-[#222222] hover:border-[#6C63FF50] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pair.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{pair.name}</p>
                      <p className="text-xs text-gray-500">{pair.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      ${pair.price.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        pair.change24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {pair.change24h >= 0 ? "▲" : "▼"}{" "}
                      {Math.abs(pair.change24h)}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href="https://nado.finance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600 transition-all"
                  >
                    Buy
                  </a>
                  <a
                    href="https://nado.finance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Sell
                  </a>
                </div>
              </div>
            ))
          )}
          <p className="text-xs text-gray-500 text-center">
            ⚠️ Demo prices — live Nado feed coming soon
          </p>
        </div>
      )}

      {/* Positions Section */}
      {activeSection === "positions" && (
        <div className="space-y-3">
          <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
            <p className="text-gray-400 text-xs mb-3">Tydro Health Factor</p>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-green-400 flex items-center justify-center">
                <span className="text-green-400 font-bold text-lg">--</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">No open positions</p>
                <a
                  href="https://tydro.finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6C63FF]"
                >
                  Open Tydro →
                </a>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
            <p className="text-gray-400 text-xs mb-2">Supplied Assets</p>
            <p className="text-center text-gray-500 text-sm py-4">
              Connect to Tydro to see positions
            </p>
          </div>
          <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
            <p className="text-gray-400 text-xs mb-2">Borrowed Assets</p>
            <p className="text-center text-gray-500 text-sm py-4">
              Connect to Tydro to see positions
            </p>
          </div>
        </div>
      )}

      {/* Alerts Section */}
      {activeSection === "alerts" && (
        <div className="space-y-3">
          {/* Add Alert Button */}
          <button
            onClick={() => setShowAddAlert(!showAddAlert)}
            className="w-full py-3 rounded-xl border border-dashed border-[#6C63FF] text-[#6C63FF] text-sm font-medium hover:bg-[#6C63FF10] transition-all"
          >
            + Add Price Alert
          </button>

          {/* Add Alert Form */}
          {showAddAlert && (
            <div className="bg-[#111111] rounded-2xl p-4 border border-[#6C63FF30] space-y-3">
              <p className="text-sm font-medium">New Price Alert</p>

              {/* Symbol Select */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Token</p>
                <select
                  value={alertSymbol}
                  onChange={(e) => setAlertSymbol(e.target.value)}
                  className="w-full bg-[#222222] text-white text-sm rounded-xl px-3 py-2 border border-[#333333]"
                >
                  {prices.map((p) => (
                    <option key={p.id} value={p.symbol}>
                      {p.symbol}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Select */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Condition</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAlertCondition("above")}
                    className={`flex-1 py-2 rounded-xl text-sm transition-all ${
                      alertCondition === "above"
                        ? "bg-green-500 text-white"
                        : "bg-[#222222] text-gray-400"
                    }`}
                  >
                    ▲ Above
                  </button>
                  <button
                    onClick={() => setAlertCondition("below")}
                    className={`flex-1 py-2 rounded-xl text-sm transition-all ${
                      alertCondition === "below"
                        ? "bg-red-500 text-white"
                        : "bg-[#222222] text-gray-400"
                    }`}
                  >
                    ▼ Below
                  </button>
                </div>
              </div>

              {/* Price Input */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Target Price (USD)</p>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full bg-[#222222] text-white text-sm rounded-xl px-3 py-2 border border-[#333333] placeholder-gray-600"
                />
              </div>

              {/* Submit */}
              <button
                onClick={addAlert}
                className="w-full py-2 bg-[#6C63FF] text-white rounded-xl text-sm font-medium hover:bg-[#5a52d5] transition-all"
              >
                Set Alert
              </button>
            </div>
          )}

          {/* Alert List */}
          {alerts.length === 0 ? (
            <div className="bg-[#111111] rounded-2xl p-6 border border-[#222222] text-center">
              <p className="text-2xl mb-2">🔔</p>
              <p className="text-gray-400 text-sm">No alerts set</p>
              <p className="text-gray-600 text-xs mt-1">
                Add an alert to get notified
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#111111] rounded-2xl p-4 border border-[#222222] flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{alert.symbol}</p>
                  <p className="text-xs text-gray-400">
                    {alert.condition === "above" ? "▲ Above" : "▼ Below"} $
                    {alert.targetPrice.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-red-400 text-xs bg-red-40010 px-2 py-1 rounded-lg hover:bg-red-40020"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}