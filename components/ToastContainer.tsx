'use client';

import { useToast } from '../contexts/ToastContext';
import Toast from './Toast';

/**COMPONENT**/
export default function ToastContainer() {
  /**CONTEXT**/
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
}

