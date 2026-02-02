import { useEffect } from 'react';
import { useToast, ToastContainer } from '@/components/ui/Toasts';


const GlobalToastListener = () => {
  const { toasts,removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    // Listen for toast events from AuthContext
    const handleToastEvent = (event: CustomEvent) => {
      const { message, type } = event.detail;
      
      
      if (type === 'success') {
        showSuccess(message);
      } else if (type === 'error') {
        showError(message);
      }
    };

    window.addEventListener('show-toast', handleToastEvent as EventListener);

    return () => {
      window.removeEventListener('show-toast', handleToastEvent as EventListener);
    };
  }, [showSuccess, showError]);

  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
};

export default GlobalToastListener;