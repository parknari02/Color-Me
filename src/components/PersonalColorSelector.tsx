import { motion } from 'motion/react';
import React from 'react';

interface PersonalColorSelectorProps {
  onSelect: (color: string) => void;
}

const colorCategories = [
  {
    title: '봄 웜톤',
    colors: [
      { name: '봄 라이트', value: 'spring-light', gradient: 'from-yellow-200 via-peach-200 to-pink-200' },
      { name: '봄 브라이트', value: 'spring-bright', gradient: 'from-yellow-400 via-coral-500 to-pink-400' },
    ],
  },
  {
    title: '여름 쿨톤',
    colors: [
      { name: '여름 라이트', value: 'summer-light', gradient: 'from-blue-200 via-lavender-200 to-pink-200' },
      { name: '여름 뮤트', value: 'summer-mute', gradient: 'from-slate-400 via-purple-400 to-mauve-400' },
    ],
  },
  {
    title: '가을 웜톤',
    colors: [
      { name: '가을 뮤트', value: 'autumn-mute', gradient: 'from-amber-500 via-orange-600 to-brown-600' },
      { name: '가을 딥', value: 'autumn-deep', gradient: 'from-amber-700 via-orange-800 to-red-900' },
    ],
  },
  {
    title: '겨울 쿨톤',
    colors: [
      { name: '겨울 브라이트', value: 'winter-bright', gradient: 'from-blue-500 via-purple-500 to-pink-500' },
      { name: '겨울 다크', value: 'winter-dark', gradient: 'from-blue-800 via-purple-800 to-pink-800' },
    ],
  },
];

export function PersonalColorSelector({ onSelect }: PersonalColorSelectorProps) {
  return (
    <div className="space-y-6">
      {colorCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
          className="space-y-3"
        >
          <h4 className="text-muted-foreground">{category.title}</h4>
          <div className="grid grid-cols-2 gap-3">
            {category.colors.map((color, index) => (
              <motion.button
                key={color.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.05 }}
                onClick={() => onSelect(color.value)}
                className={`p-4 rounded-xl bg-gradient-to-br ${color.gradient} hover:scale-105 transition-transform shadow-md`}
              >
                <div className="text-white drop-shadow-md">{color.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
