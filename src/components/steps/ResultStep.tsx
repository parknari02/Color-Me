import React, { useState } from 'react';
import { ChatMessage } from '../ChatMessage';
import { Button } from '../common/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { recommendCosmetics } from '../../utils/api';

export function ResultStep() {
    const { personalColor, getPersonalColorName, setStep, cosmeticPreferences, setRecommendedProducts } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRecommend = async () => {
        if (!personalColor) {
            setError('퍼스널 컬러가 설정되지 않았습니다.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const query = cosmeticPreferences || '추천해주세요';
            const response = await recommendCosmetics(personalColor, query, undefined, undefined, 10);

            setRecommendedProducts(response.products);
            setStep('cosmetics');
        } catch (err) {
            console.error('화장품 추천 API 호출 실패:', err);
            setError('화장품 추천을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ChatMessage type="bot" delay={0}>
                <p>분석이 완료되었어요! ✨</p>
                <div className="mt-3 p-3 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">당신의 퍼스널 컬러는</p>
                    <h3 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {getPersonalColorName(personalColor)}
                    </h3>
                </div>
            </ChatMessage>
            <ChatMessage type="bot" delay={0.3}>
                <p>이제 화장품 추천을 받아보실까요?</p>
            </ChatMessage>
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}
            <div className="flex gap-3 justify-center flex-wrap mt-6">
                <Button
                    onClick={handleRecommend}
                    disabled={isLoading}
                    className="cursor-pointer bg-gradient-to-r from-primary to-pink-400 hover:opacity-90 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            추천 중...
                        </>
                    ) : (
                        <>
                            화장품 추천 받기
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </>
    );
}

