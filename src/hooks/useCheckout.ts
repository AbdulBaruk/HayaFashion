import { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutResult {
  success: boolean;
  error?: string;
}

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processCheckout = async (items: CartItem[]): Promise<CheckoutResult> => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success/failure (80% success rate)
      const success = Math.random() > 0.2;
      if (!success) {
        throw new Error('Payment declined. Please try again.');
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processCheckout, isProcessing };
}