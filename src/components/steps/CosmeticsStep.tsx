import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../ChatMessage';
import { CategoryFilter } from '../CategoryFilter';
import { ProductCard } from '../ProductCard';
import { Button } from '../common/button';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockCosmetics } from '../../data/mockData';

export function CosmeticsStep() {
    const {
        personalColor,
        cosmeticPreferences,
        selectedCosmeticCategory,
        setSelectedCosmeticCategory,
        getPersonalColorName,
        setStep,
    } = useApp();

    return (
        <>
            {cosmeticPreferences && (
                <ChatMessage type="user">
                    <p>{cosmeticPreferences}</p>
                </ChatMessage>
            )}
            <ChatMessage type="bot" delay={0.2}>
                <p>
                    {getPersonalColorName(personalColor)}에 어울리는 화장품을 추천해드릴게요! 💄
                </p>
                {cosmeticPreferences && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-lg border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">반영된 조건</p>
                        <p className="text-sm">{cosmeticPreferences}</p>
                    </div>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                    카테고리를 선택해서 제품을 확인해보세요!
                </p>
            </ChatMessage>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
            >
                <CategoryFilter
                    categories={['베이스', '아이', '치크', '립']}
                    selectedCategory={selectedCosmeticCategory}
                    onSelectCategory={setSelectedCosmeticCategory}
                />
                <div className="grid grid-cols-2 gap-4">
                    {mockCosmetics
                        .filter((product) => product.category === selectedCosmeticCategory)
                        .map((product, index) => (
                            <ProductCard
                                key={index}
                                name={product.name}
                                brand={product.brand}
                                category={product.category}
                                imageUrl={product.imageUrl}
                                description={product.description}
                                delay={0.1 + index * 0.1}
                            />
                        ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <ChatMessage type="bot" delay={0}>
                    <p>패션 아이템 추천도 받아보시겠어요? 👗</p>
                </ChatMessage>
            </motion.div>

            <div className="flex gap-3 justify-center flex-wrap mt-6">
                <Button
                    onClick={() => setStep('style-preference')}
                    className="bg-gradient-to-r from-secondary to-yellow-400 hover:opacity-90 text-foreground"
                >
                    패션 아이템 보기
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </>
    );
}

