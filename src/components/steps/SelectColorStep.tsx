import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../ChatMessage';
import { PersonalColorSelector } from '../PersonalColorSelector';
import { useApp } from '../../context/AppContext';

export function SelectColorStep() {
    const { setPersonalColor, setStep } = useApp();

    const handleColorSelect = (color: string) => {
        setPersonalColor(color);
        setStep('result');
    };

    return (
        <>
            <ChatMessage type="user">
                <p>이미 알고 있어요</p>
            </ChatMessage>
            <ChatMessage type="bot" delay={0.2}>
                <p>알고 계신 퍼스널 컬러를 선택해주세요!</p>
            </ChatMessage>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <PersonalColorSelector onSelect={handleColorSelect} />
            </motion.div>
        </>
    );
}

