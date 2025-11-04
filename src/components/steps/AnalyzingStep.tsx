import React from 'react';
import { ChatMessage } from '../ChatMessage';
import { useApp } from '../../context/AppContext';

export function AnalyzingStep() {
    const { uploadedImage } = useApp();

    return (
        <>
            {uploadedImage && (
                <ChatMessage type="user">
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="max-w-full h-auto max-h-48 object-cover"
                        />
                    </div>
                </ChatMessage>
            )}
            <ChatMessage type="bot" delay={0.3}>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p>퍼스널 컬러를 분석하고 있어요...</p>
                </div>
            </ChatMessage>
        </>
    );
}

