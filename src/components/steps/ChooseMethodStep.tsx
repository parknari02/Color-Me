import React from 'react';
import { ChatMessage } from '../ChatMessage';
import { Button } from '../common/button';
import { useApp } from '../../context/AppContext';

export function ChooseMethodStep() {
    const { setStep } = useApp();

    const handleUpload = () => {
        setStep('upload');
    };

    const handleSelectColor = () => {
        setStep('select-color');
    };

    return (
        <>
            <ChatMessage type="user">
                <p>네, 시작할게요!</p>
            </ChatMessage>
            <ChatMessage type="bot" delay={0.2}>
                <p>좋아요! 어떤 방법으로 진행하시겠어요?</p>
            </ChatMessage>
            <div className="flex gap-3 justify-center flex-wrap mt-6">
                <Button
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-primary to-pink-400 hover:opacity-90"
                >
                    사진으로 분석하기
                </Button>
                <Button
                    onClick={handleSelectColor}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5"
                >
                    퍼스널 컬러 선택하기
                </Button>
            </div>
        </>
    );
}

