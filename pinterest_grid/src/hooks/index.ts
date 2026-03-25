import { useEffect, useRef, useCallback, useState } from 'react';
import { InfiniteScrollOptions, PaginationState } from '../types';

/**
 * useInfiniteScroll Hook
 * 
 * Handles infinite scroll pagination using Intersection Observer API
 * Automatically triggers load more when scroll threshold is reached
 */
export const useInfiniteScroll = (
  onLoadMore: () => void | Promise<void>,
  options: InfiniteScrollOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '200px',
  } = options;

  const observerTarget = useRef<HTMLDivElement>(null);
  const [isObservoActive, setIsObserverActive] = useState(true);

  useEffect(() => {
    // Create intersection observer
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Trigger load more when element becomes visible
          if (entry.isIntersecting && isObservoActive) {
            const loadMorePromise = onLoadMore();

            // Disable observer if async, re-enable after completion
            if (loadMorePromise instanceof Promise) {
              setIsObserverActive(false);
              loadMorePromise.finally(() => {
                setIsObserverActive(true);
              });
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
      observer.disconnect();
    };
  }, [onLoadMore, threshold, rootMargin, isObservoActive]);

  return observerTarget;
};

/**
 * usePagination Hook
 * 
 * Manages pagination state with cursor-based pagination support
 */
export const usePagination = (pageSize: number = 20) => {
  const [state, setState] = useState<PaginationState>({
    cursor: undefined,
    isLoading: false,
    hasMore: true,
    page: 0,
  });

  const fetchMore = useCallback(
    (cursor?: string, hasMore: boolean = true) => {
      setState(prev => ({
        ...prev,
        cursor,
        hasMore,
        page: prev.page + 1,
      }));
    },
    []
  );

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      cursor: undefined,
      isLoading: false,
      hasMore: true,
      page: 0,
    });
  }, []);

  return {
    ...state,
    fetchMore,
    setLoading,
    reset,
  };
};

/**
 * useResponsiveColumns Hook
 * 
 * Calculates optimal column count based on screen width
 * Updates on window resize with debouncing
 */
export const useResponsiveColumns = (baseColumns: number = 5) => {
  const [columnCount, setColumnCount] = useState(baseColumns);

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setColumnCount(1); // Mobile
      } else if (width < 1024) {
        setColumnCount(2); // Tablet
      } else if (width < 1280) {
        setColumnCount(3); // Small desktop
      } else if (width < 1920) {
        setColumnCount(4); // Desktop
      } else {
        setColumnCount(5); // Large desktop
      }
    };

    calculateColumns();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateColumns, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return columnCount;
};
