/**BINANCE WEBSOCKET TYPES**/

/**ORDER BOOK STREAM**/
// Partial Book Depth Stream (depth20@100ms)
export interface OrderBookData {
  lastUpdateId: number;
  bids: [string, string][]; // [price, quantity]
  asks: [string, string][]; // [price, quantity]
}

/**AGGREGATE TRADE STREAM**/
// Aggregate Trade Stream
export interface AggTrade {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  a: number; // Aggregate trade ID
  p: string; // Price
  q: string; // Quantity
  f: number; // First trade ID
  l: number; // Last trade ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}

/**PROCESSED DATA TYPES**/
// Processed order book level for display
export interface OrderBookLevel {
  price: number;
  quantity: number;
  total: number;
}

// Processed trade for display
export interface ProcessedTrade {
  id: number;
  price: number;
  quantity: number;
  time: number;
  isBuyerMaker: boolean;
}

/**CONNECTION STATUS**/
// WebSocket connection status
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

