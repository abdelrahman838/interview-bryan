'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { OrderBookData, OrderBookLevel, ConnectionStatus } from '../types/binance';
import { useToast } from '../contexts/ToastContext';

/**CONSTANTS**/
const WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@depth20@100ms';

/**TYPES**/
interface UseOrderBookStreamReturn {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  status: ConnectionStatus;
  lastUpdateId: number;
}

/**CUSTOM HOOK**/
export function useOrderBookStream(): UseOrderBookStreamReturn {
  /**CONTEXT**/
  const { addToast } = useToast();

  /**STATES**/
  const [bids, setBids] = useState<OrderBookLevel[]>([]);
  const [asks, setAsks] = useState<OrderBookLevel[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdateId, setLastUpdateId] = useState<number>(0);
  
  /**REFS**/
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  /**CALLBACKS**/
  const connect = useCallback(function connectToWebSocket() {
    try {
      setStatus('connecting');
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
        addToast('Order book WebSocket connected', 'success', 3000);
      };

      ws.onmessage = (event) => {
        try {
          const data: OrderBookData = JSON.parse(event.data);
          
          // Process bids (highest to lowest)
          const processedBids: OrderBookLevel[] = [];
          let bidTotal = 0;
          
          for (const [price, quantity] of data.bids) {
            const priceNum = parseFloat(price);
            const quantityNum = parseFloat(quantity);
            bidTotal += priceNum * quantityNum;
            
            processedBids.push({
              price: priceNum,
              quantity: quantityNum,
              total: bidTotal,
            });
          }

          // Process asks (lowest to highest)
          const processedAsks: OrderBookLevel[] = [];
          let askTotal = 0;
          
          for (const [price, quantity] of data.asks) {
            const priceNum = parseFloat(price);
            const quantityNum = parseFloat(quantity);
            askTotal += priceNum * quantityNum;
            
            processedAsks.push({
              price: priceNum,
              quantity: quantityNum,
              total: askTotal,
            });
          }

          setBids(processedBids);
          setAsks(processedAsks);
          setLastUpdateId(data.lastUpdateId);
        } catch (error) {
          addToast(`Error parsing order book data: ${error}`, 'error');
        }
      };

      ws.onerror = () => {
        addToast('Order book WebSocket error occurred', 'error');
        setStatus('error');
      };

      ws.onclose = () => {
        setStatus('disconnected');
        addToast('Order book WebSocket disconnected', 'warning', 3000);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < 10) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current += 1;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            addToast(`Reconnecting to order book (attempt ${reconnectAttemptsRef.current})...`, 'info', 2000);
            connectToWebSocket();
          }, delay);
        }
      };
    } catch (error) {
      addToast(`Error creating WebSocket connection: ${error}`, 'error');
      setStatus('error');
    }
  }, [addToast]); // Stable addToast from context

  /**EFFECTS**/
  useEffect(() => {
    let isMounted = true;

    // Add small delay to ensure component is fully mounted
    // This prevents React 19 Strict Mode double-mount disconnection issues
    const connectTimeout = setTimeout(() => {
      if (isMounted) {
        connect();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(connectTimeout);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { bids, asks, status, lastUpdateId };
}

