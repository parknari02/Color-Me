import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../ChatMessage';
import { ProductCard } from '../ProductCard';
import { Button } from '../common/button';
import { useApp } from '../../context/AppContext';
import { mockFashion } from '../../data/mockData';

export function FashionRecommendationsStep() {
    const {
        personalColor,
        stylePreferences,
        getPersonalColorName,
        setStep,
        setPersonalColor,
        setUploadedImage,
        setStylePreferences,
    } = useApp();

    const handleReset = () => {
        setStep('welcome');
        setPersonalColor('');
        setUploadedImage(null);
        setStylePreferences(null);
    };

    return (
        <>
            {stylePreferences && (
                <ChatMessage type="user">
                    <p>입력 완료했어요!</p>
                </ChatMessage>
            )}
            <ChatMessage type="bot" delay={0.2}>
                <p>
                    {getPersonalColorName(personalColor)}
                    {stylePreferences && stylePreferences.style && (
                        <>, {stylePreferences.style} 스타일</>
                    )}에 어울리는 패션 아이템을 추천해드릴게요! 👗
                </p>
            </ChatMessage>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mt-4"
            >
                {mockFashion.map((product, index) => (
                    <ProductCard
                        key={index}
                        name={product.name}
                        brand={product.brand}
                        category={product.category}
                        imageUrl={product.imageUrl}
                        description={product.description}
                        delay={0.5 + index * 0.1}
                    />
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <ChatMessage type="bot" delay={0}>
                    <p>추천이 마음에 드셨나요? 😊</p>
                </ChatMessage>
            </motion.div>

            <div className="flex gap-3 justify-center flex-wrap mt-6">
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5"
                >
                    처음으로
                </Button>
            </div>
        </>
    );
}

