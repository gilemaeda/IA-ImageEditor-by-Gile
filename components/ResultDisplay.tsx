import React from 'react';
import { ImageIcon, AlertTriangleIcon, DownloadIcon, ShareIcon } from './icons';

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
  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement('a');
    link.href = editedImage;

    const mimeType = editedImage.substring(editedImage.indexOf(':') + 1, editedImage.indexOf(';'));
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `edited-image-${Date.now()}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!editedImage || !navigator.share) {
      alert("Sharing is not supported on your browser.");
      return;
    }

    try {
      const response = await fetch(editedImage);
      const blob = await response.blob();
      const mimeType = editedImage.substring(editedImage.indexOf(':') + 1, editedImage.indexOf(';'));
      const extension = mimeType.split('/')[1] || 'png';
      const file = new File([blob], `edited-image-${Date.now()}.${extension}`, { type: blob.type });

      await navigator.share({
        title: 'AI Edited Image',
        text: 'Check out this image I edited with AI!',
        files: [file],
      });
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        console.error("Error sharing image:", err);
        alert("An error occurred while trying to share the image.");
      }
    }
  };
  
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
            <img src={editedImage} alt="Edited" className="w-full h-auto object-contain rounded-lg max-h-[calc(70vh-4rem)]" />
            <div className="mt-4 flex items-center justify-center gap-4">
                <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 py-2 px-5 text-md font-semibold rounded-lg transition-all duration-300 shadow-md bg-brand-purple hover:bg-brand-purple-light text-white transform hover:-translate-y-0.5"
                >
                <DownloadIcon />
                Download
                </button>
                {navigator.share && (
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 py-2 px-5 text-md font-semibold rounded-lg transition-all duration-300 shadow-md bg-green-600 hover:bg-green-500 text-white transform hover:-translate-y-0.5"
                  >
                    <ShareIcon />
                    Share
                  </button>
                )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};