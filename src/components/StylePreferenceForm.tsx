import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './common/button';
import { Label } from './common/label';
import { Textarea } from './common/textarea';
import { ArrowRight, X } from 'lucide-react';

interface StylePreferenceFormProps {
  onSubmit: (preferences: { bodyType: string; style: string }) => void;
  onSkip: () => void;
}

const bodyTypes = [
  { label: '슬림', value: 'slim' },
  { label: '보통', value: 'normal' },
  { label: '통통', value: 'curvy' },
  { label: '마름', value: 'petite' },
  { label: '근육질', value: 'athletic' },
];

const styleTypes = [
  { label: '캐주얼', value: 'casual' },
  { label: '포멀', value: 'formal' },
  { label: '스트릿', value: 'street' },
  { label: '로맨틱', value: 'romantic' },
  { label: '미니멀', value: 'minimal' },
  { label: '빈티지', value: 'vintage' },
];

export function StylePreferenceForm({ onSubmit, onSkip }: StylePreferenceFormProps) {
  const [bodyType, setBodyType] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [customStyle, setCustomStyle] = useState<string>('');

  const handleSubmit = () => {
    if (bodyType || style || customStyle) {
      onSubmit({
        bodyType,
        style: customStyle || style,
      });
    } else {
      onSkip();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 space-y-6 border border-primary/20"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-primary">스타일 정보 (선택)</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Body Type */}
      <div className="space-y-3">
        <Label>체형</Label>
        <div className="grid grid-cols-3 gap-2">
          {bodyTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setBodyType(type.value)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${bodyType === type.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-white hover:border-primary/50'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style Type */}
      <div className="space-y-3">
        <Label>선호 스타일</Label>
        <div className="grid grid-cols-3 gap-2">
          {styleTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setStyle(type.value);
                setCustomStyle('');
              }}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${style === type.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-white hover:border-primary/50'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Style */}
      <div className="space-y-3">
        <Label>직접 입력 (선택)</Label>
        <Textarea
          placeholder="예: 편안하면서도 세련된 느낌을 좋아해요"
          value={customStyle}
          onChange={(e) => {
            setCustomStyle(e.target.value);
            setStyle('');
          }}
          rows={3}
          className="resize-none"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-primary to-pink-400 hover:opacity-90"
      >
        완료
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}
