import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PinCardProps } from '../types';

/**
 * PinCard Component
 * 
 * Individual pin card with:
 * - Hover overlay with action buttons
 * - Like and save functionality
 * - Image loading states
 * - Smooth animations
 */
const PinCard: React.FC<PinCardProps> = ({
  pin,
  hoveredId,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const isHovered = hoveredId === pin.id;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveMenu(!showSaveMenu);
  };

  return (
    <motion.div
      className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      style={{
        aspectRatio: `${pin.imageWidth} / ${pin.imageHeight}`,
      }}
      whileHover={{ boxShadow: '0 10px 32px rgba(0,0,0,0.1)' }}
    >
      {/* Pin Image */}
      <motion.img
        src={pin.imageUrl}
        alt={pin.title}
        className="w-full h-full object-cover"
        onLoad={() => setIsImageLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isImageLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Loading skeleton */}
      {!isImageLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Overlay - appears on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4"
      >
        {/* Top action buttons */}
        <div className="flex justify-end gap-2">
          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-white text-pinterest-red'
                : 'bg-white/30 text-white hover:bg-white/50'
            }`}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            <svg
              className="w-6 h-6"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z"
              />
            </svg>
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-white/30 text-white hover:bg-white/50 backdrop-blur-md transition-all"
            title="Share"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C9.589 12.881 10 11.955 10 11c0-1.657-.895-3-2-3s-2 1.343-2 3 .895 3 2 3c.464 0 .9-.98 1.684-1.658m0 0A9.015 9.015 0 0120 7m0 0a9 9 0 01-9 9m9-9H3m9 9h-1.642a9 9 0 01-8.358-8.684"
              />
            </svg>
          </motion.button>
        </div>

        {/* Bottom section with user info and like button */}
        <div className="space-y-3">
          {/* User info */}
          {pin.userName && (
            <div className="flex items-center gap-2">
              <img
                src={pin.avatarUrl || 'https://i.pravatar.cc/48'}
                alt={pin.userName}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="text-white text-sm font-medium truncate">
                {pin.userName}
              </span>
            </div>
          )}

          {/* Like button */}
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 px-4 rounded-full font-semibold transition-all backdrop-blur-md ${
              isLiked
                ? 'bg-pinterest-red text-white'
                : 'bg-white/80 text-gray-900 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Title tooltip - visible on hover, below card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
      >
        <h3 className="text-white font-semibold text-sm line-clamp-2">
          {pin.title}
        </h3>
        {pin.boardName && (
          <p className="text-white/70 text-xs mt-1">{pin.boardName}</p>
        )}
      </motion.div>

      {/* Save Menu Dropdown */}
      {showSaveMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute top-14 right-2 bg-white rounded-lg shadow-lg z-10"
        >
          <div className="py-2">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-pinterest-light transition-colors">
              Create new board
            </button>
            {['Favorites', 'Travel Ideas', 'Design'].map((board) => (
              <button
                key={board}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-pinterest-light transition-colors"
              >
                {board}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PinCard;
