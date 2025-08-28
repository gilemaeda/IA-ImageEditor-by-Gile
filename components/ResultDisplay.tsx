
import React from 'react';
import { ImageIcon, AlertTriangleIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  editedImage: string | null;
  originalImage: string | null | undefined;
}

const ShimmerEffect: React.FC = () => (
    <div className="w-full h-full bg-brand-gray-700 rounded-lg animate-shimmer" style={{ background: 'linear-gradient(to right, #1f2937 8%, #374151 18%, #1f2937 33%)', backgroundSize: '1000px 100%' }}/>
);

const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <ImageIcon />
        <p className="mt-4 text-lg">Your generated image will appear here</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-red-400 bg-red-900/20 rounded-lg p-4">
        <AlertTriangleIcon />
        <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
        <p className="text-center mt-2">{message}</p>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, editedImage, originalImage }) => {
  return (
    <div className="w-full h-full flex-grow bg-brand-gray-900 rounded-lg flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
      {isLoading ? (
        <ShimmerEffect />
      ) : error ? (
        <ErrorState message={error} />
      ) : editedImage ? (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="w-full">
            <h3 className="font-bold text-center mb-2 text-gray-400">Original</h3>
            <img src={originalImage ?? ''} alt="Original" className="w-full h-auto object-contain rounded-lg max-h-[70vh]" />
          </div>
          <div className="w-full">
            <h3 className="font-bold text-center mb-2 text-brand-purple-light">Edited</h3>
            <img src={editedImage} alt="Edited" className="w-full h-auto object-contain rounded-lg max-h-[70vh]" />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};
