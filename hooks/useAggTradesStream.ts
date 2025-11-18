'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { AggTrade, ProcessedTrade, ConnectionStatus } from '../types/binance';
import { useToast } from '../contexts/ToastContext';

/**CONSTANTS**/
const WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@aggTrade';
const MAX_TRADES = 100; // Keep only the most recent 100 trades

/**TYPES**/
interface UseAggTradesStreamReturn {
  trades: ProcessedTrade[];
  status: ConnectionStatus;
}

/**CUSTOM HOOK**/
export function useAggTradesStream(): UseAggTradesStreamReturn {
  /**CONTEXT**/
  const { addToast } = useToast();

  /**STATES**/
  const [trades, setTrades] = useState<ProcessedTrade[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  
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
        addToast('Aggregate trades WebSocket connected', 'success', 3000);
      };

      ws.onmessage = (event) => {
        try {
          const data: AggTrade = JSON.parse(event.data);
          const processedTrade: ProcessedTrade = {
            id: data.a,
            price: parseFloat(data.p),
            quantity: parseFloat(data.q),
            time: data.T,
            isBuyerMaker: data.m,
          };

          setTrades(prevTrades => {
            const newTrades = [processedTrade, ...prevTrades];
            return newTrades.slice(0, MAX_TRADES);
          });
        } catch (error) {
          addToast(`Error parsing trade data: ${error}`, 'error');
        }
      };

      ws.onerror = () => {
        addToast('Aggregate trades WebSocket error occurred', 'error');
        setStatus('error');
      };

      ws.onclose = () => {
        setStatus('disconnected');
        addToast('Aggregate trades WebSocket disconnected', 'warning', 3000);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < 10) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current += 1;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            addToast(`Reconnecting to trades stream (attempt ${reconnectAttemptsRef.current})...`, 'info', 2000);
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

  return { trades, status };
}

