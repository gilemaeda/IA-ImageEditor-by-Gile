
import React, { useState, useCallback } from 'react';
import { ImageFile } from './types';
import { editImage } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { MagicWandIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('A person looking at the Eiffel Tower in Paris, dramatic lighting.');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      const base64Data = previewUrl.split(',')[1];
      setImageFile({ file, previewUrl, base64Data });
      setEditedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError("Please upload an image and provide a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const mimeType = imageFile.file.type;
      const newImageBase64 = await editImage(imageFile.base64Data, mimeType, prompt);
      if (newImageBase64) {
        setEditedImage(`data:${mimeType};base64,${newImageBase64}`);
      } else {
        setError("The AI could not generate an image from the response. Please try a different prompt.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  const isGenerateDisabled = !imageFile || !prompt || isLoading;

  return (
    <div className="min-h-screen bg-brand-gray-900 text-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-col gap-6 animate-fade-in">
          <div className="bg-brand-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-brand-purple-light">1. Upload Image</h2>
            <ImageUploader onFileChange={handleFileChange} imagePreview={imageFile?.previewUrl} />
          </div>

          <div className="bg-brand-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-brand-purple-light">2. Describe Your Edit</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a cat wearing a wizard hat"
              className="w-full h-32 p-3 bg-brand-gray-700 border-2 border-brand-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 shadow-lg
              ${isGenerateDisabled
                ? 'bg-brand-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-brand-purple hover:bg-brand-purple-light text-white transform hover:-translate-y-1'
              }`}
          >
            <MagicWandIcon />
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="lg:w-2/3 bg-brand-gray-800 p-6 rounded-2xl shadow-lg flex-grow flex flex-col animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <h2 className="text-xl font-bold mb-4 text-brand-purple-light">3. See the Magic</h2>
          <ResultDisplay isLoading={isLoading} error={error} editedImage={editedImage} originalImage={imageFile?.previewUrl} />
        </div>
      </main>
    </div>
  );
};

export default App;
