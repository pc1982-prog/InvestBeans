import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Start exit animation before removing
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300);

    // Remove component
    const removeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  // Better color schemes that pop against dark backgrounds
  const getToastStyles = () => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-l-4 border-green-500',
          icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
          title: 'text-green-700',
          text: 'text-gray-700'
        };
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-l-4 border-red-500',
          icon: <AlertCircle className="w-6 h-6 text-red-500" />,
          title: 'text-red-700',
          text: 'text-gray-700'
        };
      case 'info':
        return {
          bg: 'bg-white',
          border: 'border-l-4 border-orange-500',
          icon: <Info className="w-6 h-6 text-orange-500" />,
          title: 'text-orange-700',
          text: 'text-gray-700'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-l-4 border-blue-500',
          icon: <Info className="w-6 h-6 text-blue-500" />,
          title: 'text-blue-700',
          text: 'text-gray-700'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`
        ${styles.bg}
        ${styles.border}
        rounded-lg shadow-2xl
        px-5 py-4 min-w-[280px] max-w-md
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[400px] opacity-0 scale-95'}
      `}
      style={{
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-base mb-1 ${styles.title}`}>
            {type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Info'}
          </p>
          <p className={`text-sm ${styles.text} leading-relaxed`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-orange-500'
          }`}
          style={{
            animation: `progress ${duration}ms linear forwards`
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Toast Container Component with better positioning
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>;
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-4 sm:right-6 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess: (message: string) => addToast(message, 'success'),
    showError: (message: string) => addToast(message, 'error'),
    showInfo: (message: string) => addToast(message, 'info'),
  };
};