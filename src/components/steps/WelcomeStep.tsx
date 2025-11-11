import React from 'react';
import { ChatMessage } from '../ChatMessage';
import { Button } from '../common/button';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function WelcomeStep() {
    const { setStep } = useApp();

    const handleStart = () => {
        setStep('choose-method');
    };

    return (
        <>
            <ChatMessage type="bot" delay={0}>
                <p>안녕하세요! 👋</p>
                <p className="mt-2">
                    저는 당신의 퍼스널 컬러를 분석하고 맞춤형 뷰티 & 패션 아이템을 추천해드리는 AI 어시스턴트입니다.
                </p>
            </ChatMessage>
            <ChatMessage type="bot" delay={0.3}>
                <p>시작하시겠어요?</p>
            </ChatMessage>
            <div className="flex gap-3 justify-center flex-wrap mt-6">
                <Button
                    onClick={handleStart}
                    className="cursor-pointer bg-gradient-to-r from-primary to-pink-400 hover:opacity-90"
                >
                    시작하기
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </>
    );
}

