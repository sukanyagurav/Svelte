import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pin, MasonryLayoutProps } from '../types';
import PinCard from './PinCard';

/**
 * MasonryLayout Component
 * 
 * A responsive masonry grid layout that:
 * - Dynamically calculates column heights
 * - Places items in the shortest column (greedy algorithm)
 * - Supports smooth animations on item entry/exit
 * - Handles responsive column count changes
 * 
 * Algorithm: Balance columns by height
 * - Time Complexity: O(n * m) where n = items, m = columns
 * - Space Complexity: O(m) for column height tracking
 */
interface MasonryColumn {
  items: Pin[];
  height: number;
}

interface MasonryLayoutState {
  columns: MasonryColumn[];
  itemHeights: Map<string, number>;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  items,
  columnCount = 5,
  gap = 16,
  isLoading = false,
  onLoadMore,
}) => {
  // Estimated heights for pins (can be optimized with actual image dimensions)
  const estimatedItemHeight = 250;

  /**
   * Calculate masonry layout
   * Distributes items across columns based on current column heights
   */
  const layoutedItems = useMemo(() => {
    const columns: MasonryColumn[] = Array.from({ length: columnCount }, () => ({
      items: [],
      height: 0,
    }));

    // Distribute items across columns using greedy algorithm
    items.forEach(item => {
      // Find column with minimum height
      const shortestColumnIndex = columns.reduce(
        (minIdx, col, idx) => (col.height < columns[minIdx].height ? idx : minIdx),
        0
      );

      columns[shortestColumnIndex].items.push(item);
      // Add gap between items + estimated item height
      columns[shortestColumnIndex].height +=
        estimatedItemHeight + gap;
    });

    return columns;
  }, [items, columnCount, gap]);

  /**
   * Get variant for stagger animation
   */
  const getItemVariants = useCallback((columnIndex: number, itemIndex: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: (columnIndex * 0.1) + (itemIndex * 0.05),
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }), []);

  return (
    <div className="w-full min-h-screen bg-white">
      <div
        className="grid gap-4 px-4 sm:px-6 lg:px-8 py-6"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(200, 300 - (5 - columnCount) * 40)}px, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {layoutedItems.map((column, colIndex) =>
          column.items.map((pin, itemIndex) => (
            <motion.div
              key={pin.id}
              variants={getItemVariants(colIndex, itemIndex)}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ y: -4 }}
              className="h-fit"
            >
              <PinCard
                pin={pin}
                columnIndex={colIndex}
                index={itemIndex}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-3 border-pinterest-light border-t-pinterest-red rounded-full"
          />
        </div>
      )}

      {/* End of feed indicator */}
      {!isLoading && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500">You've reached the end</p>
        </motion.div>
      )}

      {/* Empty state */}
      {items.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 12m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-400">No pins found</p>
        </div>
      )}
    </div>
  );
};

export default MasonryLayout;
