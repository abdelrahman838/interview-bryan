'use client';

import type { ConnectionStatus as Status } from '../types/binance';

/**TYPES**/
interface ConnectionStatusProps {
  status: Status;
}

/**COMPONENT**/
export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  /**HELPERS**/
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-[#0ecb81]';
      case 'connecting':
        return 'bg-[#f0b90b]';
      case 'disconnected':
      case 'error':
        return 'bg-[#f6465d]';
      default:
        return 'bg-[#848e9c]';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-[#2b3139] rounded-md">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === 'connecting' ? 'animate-pulse' : ''}`} />
      <span className="text-xs text-[#848e9c]">{getStatusText()}</span>
    </div>
  );
}

