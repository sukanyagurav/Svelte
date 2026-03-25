import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import MasonryLayout from './MasonryLayout';
import { useInfiniteScroll, usePagination, useResponsiveColumns } from '../hooks';
import apiService from '../services/api';
import { Pin } from '../types';

/**
 * HomePage Component
 * 
 * Main application page with:
 * - Header with search
 * - Masonry grid layout
 * - Infinite scroll pagination
 * - Responsive design
 * - Loading and error states
 */
const HomePage: React.FC = () => {
  // State management
  const [pins, setPins] = useState<Pin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pagination = usePagination(20);
  const columnCount = useResponsiveColumns(5);

  // Fetch pins from API
  const fetchPins = useCallback(async () => {
    try {
      pagination.setLoading(true);
      setError(null);

      // For development, use mock data
      // In production, replace with actual API call:
      // const response = await apiService.fetchFeed(20, pagination.cursor);
      
      const mockPins = apiService.generateMockPins(20);
      
      if (pagination.page === 0) {
        // First page - replace data
        setPins(mockPins);
      } else {
        // Subsequent pages - append data
        setPins(prev => [...prev, ...mockPins]);
      }

      // Simulate cursor-based pagination
      const nextCursor = `cursor-${pagination.page + 1}`;
      const hasMore = pagination.page < 5; // Stop after 6 pages (0-5)

      pagination.fetchMore(nextCursor, hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pins';
      setError(errorMessage);
      console.error('Error fetching pins:', err);
    } finally {
      pagination.setLoading(false);
    }
  }, [pagination]);

  // Initial data fetch
  useEffect(() => {
    if (pins.length === 0) {
      fetchPins();
    }
  }, []);

  // Infinite scroll observer
  const observerTarget = useInfiniteScroll(
    () => {
      if (pagination.hasMore && !pagination.isLoading) {
        return fetchPins();
      }
    },
    {
      threshold: 0.1,
      rootMargin: '200px',
    }
  );

  // Handle search
  const handleSearch = useCallback((query: string) => {
    pagination.reset();
    setPins([]);
    console.log('Searching for:', query);
    // Implement search logic here
    // This would filter pins based on the query
  }, [pagination]);

  // Handle error dismiss
  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <Header onSearch={handleSearch} />

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 m-4"
            role="alert"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={dismissError}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Masonry Grid */}
        <MasonryLayout
          items={pins}
          columnCount={columnCount}
          gap={16}
          isLoading={pagination.isLoading && pagination.page === 0}
          onLoadMore={fetchPins}
        />

        {/* Infinite Scroll Trigger */}
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center"
        >
          {pagination.isLoading && pagination.page > 0 && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <svg
                className="w-6 h-6 text-pinterest-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.581 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
          )}
        </div>

        {/* End of Content Message */}
        {!pagination.hasMore && pins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 font-medium">
              That's all for now! Check back soon for more pins.
            </p>
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  );
};

export default HomePage;
