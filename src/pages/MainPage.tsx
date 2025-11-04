import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WelcomeStep } from '../components/steps/WelcomeStep';
import { ChooseMethodStep } from '../components/steps/ChooseMethodStep';
import { UploadStep } from '../components/steps/UploadStep';
import { SelectColorStep } from '../components/steps/SelectColorStep';
import { AnalyzingStep } from '../components/steps/AnalyzingStep';
import { ResultStep } from '../components/steps/ResultStep';
import { CosmeticPreferenceStep } from '../components/steps/CosmeticPreferenceStep';
import { CosmeticsStep } from '../components/steps/CosmeticsStep';
import { StylePreferenceStep } from '../components/steps/StylePreferenceStep';
import { FashionRecommendationsStep } from '../components/steps/FashionRecommendationsStep';

export function MainPage() {
    const { step } = useApp();

    const renderStep = () => {
        switch (step) {
            case 'welcome':
                return <WelcomeStep key="welcome" />;
            case 'choose-method':
                return <ChooseMethodStep key="choose-method" />;
            case 'upload':
                return <UploadStep key="upload" />;
            case 'select-color':
                return <SelectColorStep key="select-color" />;
            case 'analyzing':
                return <AnalyzingStep key="analyzing" />;
            case 'result':
                return <ResultStep key="result" />;
            case 'cosmetic-preference':
                return <CosmeticPreferenceStep key="cosmetic-preference" />;
            case 'cosmetics':
                return <CosmeticsStep key="cosmetics" />;
            case 'style-preference':
                return <StylePreferenceStep key="style-preference" />;
            case 'fashion-recommendations':
                return <FashionRecommendationsStep key="fashion-recommendations" />;
            default:
                return <WelcomeStep key="welcome" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-100">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 mb-2">
                        <Sparkles className="w-8 h-8 text-primary" />
                        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ColorMe
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        당신만의 퍼스널 컬러를 찾고 맞춤 추천을 받아보세요
                    </p>
                </motion.div>

                {/* Chat Container */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-6 min-h-[600px] flex flex-col">
                    <div className="flex-1 space-y-4 mb-6">
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6 text-sm text-muted-foreground"
                >
                    <p>AI 기반 퍼스널 컬러 분석 및 맞춤 추천 서비스</p>
                </motion.div>
            </div>
        </div>
    );
}

