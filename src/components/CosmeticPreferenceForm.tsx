import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './common/button';
import { Textarea } from './common/textarea';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CosmeticPreferenceFormProps {
  onSubmit: (preferences: string) => void;
  onSkip: () => void;
}

export function CosmeticPreferenceForm({ onSubmit, onSkip }: CosmeticPreferenceFormProps) {
  const [preferences, setPreferences] = useState('');

  const handleSubmit = () => {
    if (preferences.trim()) {
      onSubmit(preferences);
    }
  };

  const suggestions = [
    '건성 피부라 촉촉한 제품이 좋아요',
    '지성 피부라 매트한 제품 원해요',
    '민감성 피부라 순한 제품 필요해요',
    '데일리 메이크업용 추천해주세요',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          추가로 원하시는 조건을 입력해주세요 (선택사항)
        </label>
        <Textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="예: 지성 피부라 매트한 제품이 좋아요, 민감성 피부라 순한 제품 필요해요..."
          className="min-h-24 resize-none"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">추천 예시:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setPreferences(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-colors"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={onSkip}
          variant="outline"
          className="flex-1"
        >
          건너뛰기
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!preferences.trim()}
          className="flex-1 bg-gradient-to-r from-primary to-pink-400"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          추천받기
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
