import { useState, useCallback } from 'react';

export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async (callback: () => Promise<void> | void) => {
    setIsLoading(true);
    try {
      await callback();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, withLoading };
}