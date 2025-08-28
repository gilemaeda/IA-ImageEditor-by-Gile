
import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => (
  <header className="bg-brand-gray-800/50 backdrop-blur-sm p-4 shadow-lg sticky top-0 z-10">
    <div className="container mx-auto flex items-center justify-center md:justify-start">
      <SparklesIcon />
      <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 ml-3">
        AI Image Editor
      </h1>
    </div>
  </header>
);
