
import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onFileChange: (file: File) => void;
  imagePreview: string | null | undefined;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileChange, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type.startsWith('image/')) {
        onFileChange(files[0]);
      }
    }
  }, [onFileChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileChange(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className="cursor-pointer group"
      >
        {imagePreview ? (
          <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-transparent hover:border-brand-purple transition-all">
            <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover max-h-60" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-semibold">Change Image</span>
            </div>
          </div>
        ) : (
          <div className="w-full p-8 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center text-center text-gray-400 group-hover:border-brand-purple group-hover:text-brand-purple-light transition-all">
            <UploadIcon />
            <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">PNG, JPG, WEBP</p>
          </div>
        )}
      </label>
    </div>
  );
};
