import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../ChatMessage';
import { StylePreferenceForm } from '../StylePreferenceForm';
import { useApp } from '../../context/AppContext';

export function StylePreferenceStep() {
    const { setStylePreferences, setStep } = useApp();

    const handleSubmit = (preferences: { bodyType: string; style: string }) => {
        setStylePreferences(preferences);
        setStep('fashion-recommendations');
    };

    const handleSkip = () => {
        setStylePreferences(null);
        setStep('fashion-recommendations');
    };

    return (
        <>
            <ChatMessage type="user">
                <p>네, 패션 아이템도 추천받을래요!</p>
            </ChatMessage>
            <ChatMessage type="bot" delay={0.2}>
                <p>더 정확한 추천을 위해 스타일 정보를 입력해주세요.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    건너뛰기를 선택하면 퍼스널 컬러만으로 추천해드려요!
                </p>
            </ChatMessage>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <StylePreferenceForm onSubmit={handleSubmit} onSkip={handleSkip} />
            </motion.div>
        </>
    );
}

