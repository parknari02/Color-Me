import { motion } from 'motion/react';
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  displayNames?: Record<string, string>;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory, displayNames }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category, index) => (
        <motion.button
          key={category}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          onClick={() => onSelectCategory(category)}
          className={`cursor-pointer px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === category
            ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-md'
            : 'bg-white border border-primary/30 text-foreground hover:border-primary/60'
            }`}
        >
          {displayNames?.[category] || category}
        </motion.button>
      ))}
    </div>
  );
}
