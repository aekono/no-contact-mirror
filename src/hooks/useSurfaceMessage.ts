import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getRandomMessageForSurface, 
  getCategoriesForSurface, 
  getMessagesByCategory,
  ContentRow,
  initializeContentStore 
} from '../content/contentStore';

interface UseSurfaceMessageOptions {
  rotateMs?: number;
  onCycle?: (msg: ContentRow) => void;
  seed?: string;
}

interface UseSurfaceMessageReturn {
  message: ContentRow | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  getMessagesByCategory: (category: string) => ContentRow[];
  getCategoriesForSurface: (surface: string) => string[];
}

/**
 * Hook for getting messages for a specific surface
 */
export function useSurfaceMessage(
  surface: string, 
  options: UseSurfaceMessageOptions = {}
): UseSurfaceMessageReturn {
  const { rotateMs, onCycle, seed } = options;
  const [message, setMessage] = useState<ContentRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Initialize content store on first use
  useEffect(() => {
    let isMounted = true;
    
    const initContent = async () => {
      try {
        await initializeContentStore();
        if (isMounted) {
          const initialMessage = getRandomMessageForSurface(surface);
          setMessage(initialMessage);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load content');
          setIsLoading(false);
        }
      }
    };

    initContent();

    return () => {
      isMounted = false;
    };
  }, [surface]);

  // Set up rotation if specified
  useEffect(() => {
    if (!rotateMs || !message) return;

    const startRotation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (!mountedRef.current) return;
        
        const newMessage = getRandomMessageForSurface(surface);
        if (newMessage) {
          setMessage(newMessage);
          onCycle?.(newMessage);
        }
      }, rotateMs);
    };

    startRotation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [surface, rotateMs, message, onCycle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const refresh = useCallback(() => {
    const newMessage = getRandomMessageForSurface(surface);
    setMessage(newMessage);
    if (newMessage) {
      onCycle?.(newMessage);
    }
  }, [surface, onCycle]);

  return {
    message,
    isLoading,
    error,
    refresh,
    getMessagesByCategory,
    getCategoriesForSurface,
  };
}

/**
 * Hook for getting multiple messages by category
 */
export function useMessagesByCategory(category: string) {
  const [messages, setMessages] = useState<ContentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        await initializeContentStore();
        const categoryMessages = getMessagesByCategory(category);
        setMessages(categoryMessages);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading messages by category:', err);
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [category]);

  return { messages, isLoading };
}

/**
 * Hook for getting categories for a surface
 */
export function useCategoriesForSurface(surface: string) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await initializeContentStore();
        const surfaceCategories = getCategoriesForSurface(surface);
        setCategories(surfaceCategories);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading categories for surface:', err);
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [surface]);

  return { categories, isLoading };
}
