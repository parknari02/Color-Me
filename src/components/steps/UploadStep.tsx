import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../ChatMessage';
import { ImageUploader } from '../ImageUploader';
import { useApp } from '../../context/AppContext';

export function UploadStep() {
    const { setUploadedImage, setStep, setPersonalColor } = useApp();

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
            setStep('analyzing');
            setTimeout(() => {
                setPersonalColor('spring-bright');
                setStep('result');
            }, 2000);
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <ChatMessage type="user">
                <p>사진으로 분석해주세요</p>
            </ChatMessage>
            <ChatMessage type="bot" delay={0.2}>
                <p>얼굴이 잘 보이는 사진을 업로드해주세요.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    자연광에서 촬영한 사진이 가장 정확해요!
                </p>
            </ChatMessage>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <ImageUploader onUpload={handleImageUpload} />
            </motion.div>
        </>
    );
}

