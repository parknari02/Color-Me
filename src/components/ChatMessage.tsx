import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  type: 'bot' | 'user';
  children?: ReactNode;
  delay?: number;
}

export function ChatMessage({ type, children, delay = 0 }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex gap-3 ${type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {type === 'bot' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${type === 'bot'
          ? 'bg-white border border-primary/20 shadow-sm'
          : 'bg-gradient-to-r from-primary to-pink-400 text-white'
          }`}
      >
        {children}
      </div>
      {type === 'user' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 flex-shrink-0" />
      )}
    </motion.div>
  );
}
