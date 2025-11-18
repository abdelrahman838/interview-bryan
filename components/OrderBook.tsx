'use client';

import { memo, useMemo } from 'react';
import type { OrderBookLevel } from '../types/binance';
import { formatPrice, formatQuantity } from '../utils/formatters';

/**TYPES**/
interface OrderBookRowProps {
  level: OrderBookLevel;
  maxTotal: number;
  type: 'bid' | 'ask';
}

/**MEMOIZED COMPONENTS**/
const OrderBookRow = memo(({ level, maxTotal, type }: OrderBookRowProps) => {
  const percentage = (level.total / maxTotal) * 100;
  const bgColor = type === 'bid' ? 'bg-[#0ecb81]/10' : 'bg-[#f6465d]/10';
  const textColor = type === 'bid' ? 'text-[#0ecb81]' : 'text-[#f6465d]';

  return (
    <div className="relative h-[20px] sm:h-[22px] flex items-center text-[10px] sm:text-xs font-mono">
      {/* Background bar */}
      <div
        className={`absolute right-0 h-full ${bgColor} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
      
      {/* Content */}
      <div className="relative w-full grid grid-cols-3 gap-1 sm:gap-2 px-1 sm:px-2">
        <span className={`${textColor} text-left`}>
          {formatPrice(level.price)}
        </span>
        <span className="text-[#eaecef] text-right">
          {formatQuantity(level.quantity)}
        </span>
        <span className="text-[#848e9c] text-right">
          {formatQuantity(level.total)}
        </span>
      </div>
    </div>
  );
});

OrderBookRow.displayName = 'OrderBookRow';

interface OrderBookProps {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

/**COMPONENT**/
export default function OrderBook({ bids, asks }: OrderBookProps) {
  /**MEMOIZED VALUES**/
  const maxBidTotal = useMemo(() => {
    return bids.length > 0 ? Math.max(...bids.map(b => b.total)) : 0;
  }, [bids]);

  const maxAskTotal = useMemo(() => {
    return asks.length > 0 ? Math.max(...asks.map(a => a.total)) : 0;
  }, [asks]);

  // Calculate spread
  const spread = useMemo(() => {
    if (asks.length === 0 || bids.length === 0) return null;
    const lowestAsk = asks[0].price;
    const highestBid = bids[0].price;
    const spreadValue = lowestAsk - highestBid;
    const spreadPercent = ((spreadValue / highestBid) * 100).toFixed(2);
    return { value: spreadValue, percent: spreadPercent };
  }, [asks, bids]);

  return (
    <div className="flex flex-col h-full bg-[#181a20]">
      {/* Header */}
      <div className="px-1 sm:px-2 py-2 sm:py-3 border-b border-[#2b3139]">
        <div className="grid grid-cols-3 gap-1 sm:gap-2 text-[10px] sm:text-xs text-[#848e9c] font-medium">
          <span className="text-left">Price(USDT)</span>
          <span className="text-right">Amount(BTC)</span>
          <span className="text-right">Total</span>
        </div>
      </div>

      {/* Order Book Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Sell Orders) - Reversed to show lowest at bottom */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto scrollbar-thin scrollbar-thumb-[#2b3139] scrollbar-track-transparent">
          {asks.slice().reverse().map((ask, index) => (
            <OrderBookRow
              key={`ask-${index}-${ask.price}`}
              level={ask}
              maxTotal={maxAskTotal}
              type="ask"
            />
          ))}
        </div>

        {/* Spread */}
        {spread && (
          <div className="py-2 px-1 sm:px-2 bg-[#1e2329] border-y border-[#2b3139]">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-[#0ecb81] font-semibold text-sm sm:text-base">
                {formatPrice(bids[0]?.price || 0)}
              </span>
              <span className="text-[#848e9c]">
                <span className="hidden sm:inline">Spread: </span>{formatPrice(spread.value)} ({spread.percent}%)
              </span>
            </div>
          </div>
        )}

        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2b3139] scrollbar-track-transparent">
          {bids.map((bid, index) => (
            <OrderBookRow
              key={`bid-${index}-${bid.price}`}
              level={bid}
              maxTotal={maxBidTotal}
              type="bid"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

