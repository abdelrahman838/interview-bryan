'use client';

import { useOrderBookStream } from '../../hooks/useOrderBookStream';
import Navigation from '../../components/Navigation';
import OrderBook from '../../components/OrderBook';
import ConnectionStatus from '../../components/ConnectionStatus';

/**PAGE COMPONENT**/
export default function OrderBookPage() {
  /**HOOKS**/
  const { bids, asks, status } = useOrderBookStream();

  return (
    <div className="min-h-screen bg-[#0b0e11] flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Order Book - BTC/USDT</h1>
          <ConnectionStatus status={status} />
        </div>

        <div className="bg-[#181a20] rounded-lg overflow-hidden shadow-xl border border-[#2b3139]">
          {status === 'connected' && (bids.length > 0 || asks.length > 0) ? (
            <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-200px)]">
              <OrderBook bids={bids} asks={asks} />
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
      </main>
    </div>
  );
}

