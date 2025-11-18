'use client';

import { useEffect } from 'react';
import { Toast as ToastType } from '../contexts/ToastContext';

/**TYPES**/
interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

/**COMPONENT**/
export default function Toast({ toast, onClose }: ToastProps) {
  /**EFFECTS**/
  useEffect(() => {
    // Auto-dismiss animation
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  /**HELPERS**/
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[#0ecb81] border-[#0ecb81]';
      case 'error':
        return 'bg-[#f6465d] border-[#f6465d]';
      case 'warning':
        return 'bg-[#f0b90b] border-[#f0b90b]';
      case 'info':
      default:
        return 'bg-[#2b3139] border-[#474d57]';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className={`
        ${getToastStyles()}
        min-w-[300px] max-w-[500px] p-4 rounded-lg shadow-lg
        border-l-4 flex items-start gap-3
        animate-slide-in-right
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-white font-bold text-sm">
        {getIcon()}
      </div>

      {/* Message */}
      <div className="flex-1 text-white text-sm leading-relaxed break-words">
        {toast.message}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

