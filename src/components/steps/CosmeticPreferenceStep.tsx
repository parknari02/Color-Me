import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../ChatMessage';
import { CosmeticPreferenceForm } from '../CosmeticPreferenceForm';
import { useApp } from '../../context/AppContext';

export function CosmeticPreferenceStep() {
    const { setCosmeticPreferences, setStep } = useApp();

    const handleSubmit = (preferences: string) => {
        setCosmeticPreferences(preferences);
        setStep('cosmetics');
    };

    const handleSkip = () => {
        setCosmeticPreferences('');
        setStep('cosmetics');
    };

    return (
        <>
            <ChatMessage type="user">
                <p>네, 추천받고 싶어요!</p>
            </ChatMessage>
            <ChatMessage type="bot" delay={0.2}>
                <p>좋아요! 더 정확한 추천을 위해 추가 조건을 알려주세요 😊</p>
            </ChatMessage>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <CosmeticPreferenceForm onSubmit={handleSubmit} onSkip={handleSkip} />
            </motion.div>
        </>
    );
}

