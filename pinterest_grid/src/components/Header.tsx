import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Header Component
 * 
 * Pinterest header with:
 * - Logo and branding
 * - Search functionality
 * - Navigation menu
 * - User profile
 */
interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const navItems = [
    { label: 'Home', icon: '🏠' },
    { label: 'Explore', icon: '🔥' },
    { label: 'Create', icon: '➕' },
    { label: 'Messages', icon: '💬' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-100"
    >
      <nav className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <svg
              className="w-8 h-8 text-pinterest-red"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" fill="white" />
            </svg>
          </motion.div>
          <span className="text-xl font-bold text-pinterest-dark hidden sm:block">
            Pinterest
          </span>
        </div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="flex-1 max-w-md mx-4"
          animate={{ width: isSearchFocused ? '100%' : 'auto' }}
        >
          <div
            className={`relative transition-all rounded-full px-4 py-2 flex items-center ${
              isSearchFocused
                ? 'bg-pinterest-light ring-2 ring-gray-300'
                : 'bg-pinterest-light'
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search pins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent flex-1 ml-2 outline-none text-sm placeholder-gray-400"
            />
            {searchQuery && (
              <motion.button
                type="button"
                onClick={() => setSearchQuery('')}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Navigation and User Section */}
        <div className="flex items-center gap-6">
          {/* Nav Items - Desktop Only */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-pinterest-red font-medium text-sm transition-colors"
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-600 hover:text-pinterest-red transition-colors"
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1 right-1 w-2 h-2 bg-pinterest-red rounded-full"
            />
          </motion.button>

          {/* User Profile Menu */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <img
              src="https://i.pravatar.cc/40?img=1"
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-pinterest-light hover:border-pinterest-red transition-colors"
            />
          </motion.div>

          {/* Mobile Menu Toggle */}
          <motion.button className="lg:hidden p-2 text-gray-600">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
