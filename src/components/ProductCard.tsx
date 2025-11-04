import { motion } from 'motion/react';
import React from 'react';
import { ImageWithFallback } from './common/ImageWithFallback';
import { Card } from './common/card';

interface ProductCardProps {
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  description: string;
  delay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  category,
  imageUrl,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="text-xs text-primary mb-1">{brand}</div>
          <h4 className="mb-1">{name}</h4>
          <div className="text-xs text-muted-foreground mb-2">{category}</div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
};
