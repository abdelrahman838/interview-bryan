'use client';

import { memo } from 'react';
import type { ProcessedTrade } from '../types/binance';
import { formatPrice, formatQuantity, formatTime } from '../utils/formatters';

/**TYPES**/
interface TradeRowProps {
  trade: ProcessedTrade;
}

/**MEMOIZED COMPONENTS**/
const TradeRow = memo(({ trade }: TradeRowProps) => {
  const isBuy = !trade.isBuyerMaker; // If buyer is not maker, it's a buy (taker buy)
  const priceColor = isBuy ? 'text-[#0ecb81]' : 'text-[#f6465d]';

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 px-2 sm:px-4 py-2 hover:bg-[#2b3139]/30 transition-colors text-[10px] sm:text-xs font-mono">
      <span className={`${priceColor} font-semibold text-left`}>
        {formatPrice(trade.price)}
      </span>
      <span className="text-[#eaecef] text-right">
        {formatQuantity(trade.quantity)}
      </span>
      <span className="text-[#848e9c] text-right">
        {formatTime(trade.time)}
      </span>
    </div>
  );
});

TradeRow.displayName = 'TradeRow';

interface MarketTradesProps {
  trades: ProcessedTrade[];
}

/**COMPONENT**/
export default function MarketTrades({ trades }: MarketTradesProps) {
  return (
    <div className="flex flex-col h-full bg-[#181a20]">
      {/* Header */}
      <div className="px-2 sm:px-4 py-2 sm:py-3 border-b border-[#2b3139]">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-[10px] sm:text-xs text-[#848e9c] font-medium">
          <span className="text-left">Price(USDT)</span>
          <span className="text-right">Amount(BTC)</span>
          <span className="text-right">Time</span>
        </div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2b3139] scrollbar-track-transparent">
        {trades.length > 0 ? (
          trades.map((trade, index) => (
            <TradeRow key={`${trade.id}-${trade.time}-${index}`} trade={trade} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#848e9c] text-sm">No trades yet...</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {trades.length > 0 && (
        <div className="px-2 sm:px-4 py-2 border-t border-[#2b3139] text-[10px] sm:text-xs text-[#848e9c]">
          <div className="flex items-center justify-between">
            <span>Real-time trades</span>
            <span>{trades.length} recent trades</span>
          </div>
        </div>
      )}
    </div>
  );
}

