import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../ChatMessage';
import { Button } from '../common/button';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ResultStep() {
    const { personalColor, getPersonalColorName, setStep } = useApp();

    const handleNext = () => {
        setStep('cosmetic-preference');
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
            {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2 mt-6"
            >
                <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-primary to-pink-400"
                >
                    네, 추천받고 싶어요!
                    <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </motion.div> */}
            <div className="flex gap-3 justify-center flex-wrap mt-6">
                <Button
                    onClick={() => setStep('cosmetics')}
                    className="bg-gradient-to-r from-primary to-pink-400 hover:opacity-90"
                >
                    화장품 추천 받기
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </>
    );
}

