'use client';

import { useAggTradesStream } from '../../hooks/useAggTradesStream';
import Navigation from '../../components/Navigation';
import MarketTrades from '../../components/MarketTrades';
import ConnectionStatus from '../../components/ConnectionStatus';

/**PAGE COMPONENT**/
export default function MarketTradesPage() {
  /**HOOKS**/
  const { trades, status } = useAggTradesStream();

  return (
    <div className="min-h-screen bg-[#0b0e11] flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Market Trades - BTC/USDT</h1>
          <ConnectionStatus status={status} />
        </div>

        <div className="bg-[#181a20] rounded-lg overflow-hidden shadow-xl border border-[#2b3139]">
          {status === 'connected' ? (
            <div className="h-[calc(100vh-220px)] sm:h-[calc(100vh-260px)]">
              <MarketTrades trades={trades} />
            </div>
          ) : status === 'connecting' ? (
            <div className="h-[500px] sm:h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0b90b] mb-4"></div>
                <p className="text-[#848e9c] text-sm sm:text-base">Connecting to Binance...</p>
              </div>
            </div>
          ) : status === 'error' || status === 'disconnected' ? (
            <div className="h-[500px] sm:h-[600px] flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-[#f6465d] text-base sm:text-lg mb-2">Connection Error</p>
                <p className="text-[#848e9c] text-sm sm:text-base">Unable to connect to Binance WebSocket</p>
              </div>
            </div>
          ) : (
            <div className="h-[500px] sm:h-[600px] flex items-center justify-center">
              <p className="text-[#848e9c] text-sm sm:text-base">Waiting for data...</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#0ecb81] rounded-sm"></div>
            <span className="text-[#848e9c]">Buy (Market Taker)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#f6465d] rounded-sm"></div>
            <span className="text-[#848e9c]">Sell (Market Taker)</span>
          </div>
        </div>
      </main>
    </div>
  );
}

