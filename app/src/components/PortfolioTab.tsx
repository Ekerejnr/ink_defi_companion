import { useAccount } from "wagmi";
import { useInkBalance } from "../hooks/useInkBalance";

export function PortfolioTab() {
  const { address, isConnected } = useAccount();
  const { balanceLoading, blockNumber, formattedBalance, refetch } =
    useInkBalance(address);

  if (!isConnected) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Portfolio</h2>
        <div className="bg-[#111111] rounded-2xl p-6 border border-[#222222] text-center">
          <p className="text-4xl mb-3">👛</p>
          <p className="text-gray-400 text-sm mb-1">No wallet connected</p>
          <p className="text-gray-600 text-xs">
            Tap the button in the top right to connect
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Portfolio</h2>
        <button
          onClick={() => refetch()}
          className="text-xs text-[#6C63FF] bg-[#6C63FF20] px-3 py-1 rounded-full"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Wallet Address Card */}
      <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
        <p className="text-gray-400 text-xs mb-1">Connected Wallet</p>
        <p className="font-mono text-sm text-white">
          {address?.slice(0, 8)}...{address?.slice(-6)}
        </p>
        <a
          href={`https://explorer.inkonchain.com/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#6C63FF] mt-1 inline-block"
        >
          View on Explorer →
        </a>
      </div>

      {/* ETH Balance Card */}
      <div className="bg-gradient-to-br from-[#6C63FF20] to-[#111111] rounded-2xl p-4 border border-[#6C63FF30]">
        <p className="text-gray-400 text-xs mb-1">ETH Balance</p>
        {balanceLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-[#222222] rounded w-32 mb-1"></div>
            <div className="h-3 bg-[#222222] rounded w-20"></div>
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold text-white">
              {formattedBalance}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ETH on Ink L2
            </p>
          </>
        )}
      </div>

      {/* Network Info Card */}
      <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
        <p className="text-gray-400 text-xs mb-3">Network Info</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Network</span>
            <span className="text-xs font-medium text-green-400">
              🟢 Ink L2
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Chain ID</span>
            <span className="text-xs font-mono text-white">57073</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Latest Block</span>
            <span className="text-xs font-mono text-white">
              {blockNumber ? blockNumber.toLocaleString() : "Loading..."}
            </span>
          </div>
        </div>
      </div>

      {/* Coming Soon Cards */}
      <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
        <p className="text-gray-400 text-xs mb-3">Token Holdings</p>
        <div className="text-center py-4">
          <p className="text-2xl mb-2">🪙</p>
          <p className="text-xs text-gray-500">Token balances coming in next update</p>
        </div>
      </div>

      <div className="bg-[#111111] rounded-2xl p-4 border border-[#222222]">
        <p className="text-gray-400 text-xs mb-3">Tydro Positions</p>
        <div className="text-center py-4">
          <p className="text-2xl mb-2">📊</p>
          <p className="text-xs text-gray-500">Lending positions coming in next update</p>
        </div>
      </div>
    </div>
  );
}