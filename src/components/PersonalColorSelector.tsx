import React from 'react';

interface PersonalColorSelectorProps {
  onSelect: (color: string) => void;
}

const colorCategories = [
  {
    colors: [
      { name: '봄 라이트', value: 'spring-light', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300', textColor: 'text-yellow-700' },
      { name: '봄 브라이트', value: 'spring-bright', bgColor: 'bg-pink-50', borderColor: 'border-pink-400', textColor: 'text-pink-700' },
    ],
  },
  {
    colors: [
      { name: '여름 라이트', value: 'summer-light', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', textColor: 'text-blue-700' },
      { name: '여름 뮤트', value: 'summer-mute', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', textColor: 'text-purple-700' },
    ],
  },
  {
    colors: [
      { name: '가을 뮤트', value: 'autumn-mute', bgColor: 'bg-orange-50', borderColor: 'border-orange-400', textColor: 'text-orange-700' },
      { name: '가을 딥', value: 'autumn-deep', bgColor: 'bg-amber-50', borderColor: 'border-amber-600', textColor: 'text-amber-800' },
    ],
  },
  {
    colors: [
      { name: '겨울 브라이트', value: 'winter-bright', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-400', textColor: 'text-cyan-700' },
      { name: '겨울 다크', value: 'winter-dark', bgColor: 'bg-slate-100', borderColor: 'border-slate-400', textColor: 'text-slate-700' },
    ],
  },
];

export function PersonalColorSelector({ onSelect }: PersonalColorSelectorProps) {
  return (
    <div className="space-y-3">
      {colorCategories.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <div className="grid grid-cols-2 gap-3">
            {category.colors.map((color) => (
              <button
                key={color.value}
                onClick={() => onSelect(color.value)}
                className={`p-4 rounded-lg border-2 ${color.bgColor} ${color.borderColor} ${color.textColor} transition-all text-center font-medium cursor-pointer hover:border-primary`}
                style={{
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fdf2f8';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
