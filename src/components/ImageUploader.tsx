import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Camera } from 'lucide-react';
import { Button } from './common/button';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDragging
        ? 'border-primary bg-primary/5 scale-105'
        : 'border-primary/30 bg-white hover:border-primary/50'
        }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-foreground mb-2">사진을 업로드해주세요</p>
          <p className="text-sm text-muted-foreground">
            드래그하거나 클릭하여 이미지 선택
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-pink-400 hover:opacity-90">
          <Upload className="w-4 h-4 mr-2" />
          파일 선택
        </Button>
      </div>
    </motion.div>
  );
}
