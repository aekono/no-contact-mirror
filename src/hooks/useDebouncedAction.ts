import { useRef, useCallback } from 'react';
import { UseDebouncedActionReturn } from '../types';

export function useDebouncedAction<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 400
): UseDebouncedActionReturn {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isExecutingRef = useRef(false);

  const debouncedFn = useCallback((...args: Parameters<T>) => {
    // If already executing, ignore
    if (isExecutingRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        isExecutingRef.current = true;
        await fn(...args);
      } finally {
        isExecutingRef.current = false;
      }
    }, delay);
  }, [fn, delay]);

  return debouncedFn as UseDebouncedActionReturn;
}
