import React from 'react';
import { motion } from 'framer-motion';
import HomePage from './components/HomePage';
import './styles/globals.css';

/**
 * App Root Component
 */
const App: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-white"
    >
      <HomePage />
    </motion.div>
  );
};

export default App;
