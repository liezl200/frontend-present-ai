'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/file-upload';
import { VideoControls } from '@/components/video-controls';

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [handRaised, setHandRaised] = useState(false);
  
  // Placeholder for total slides - this would come from backend processing
  const totalSlides = 10;

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    // Here you would typically upload the file to your backend
    console.log('Selected PDF file:', selectedFile.name);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleRewind = useCallback(() => {
    setCurrentSlide(1);
    setIsPlaying(false);
  }, []);

  const handleRaiseHand = useCallback(() => {
    setHandRaised(prev => !prev);
    // Here you would typically notify the backend about the hand raise
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-white">Interactive Presentation Viewer</h1>
        
        {!file ? (
          <div className="max-w-lg mx-auto">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-xl p-4 mb-4 aspect-video border border-gray-700">
              {/* This would be replaced with actual presentation viewer */}
              <div className="h-full flex items-center justify-center bg-gray-800">
                <p className="text-gray-300">
                  Presentation Viewer - Slide {currentSlide}
                  {handRaised && (
                    <span className="ml-2 text-blue-400">(Hand Raised)</span>
                  )}
                </p>
              </div>
            </div>
            
            <VideoControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onRewind={handleRewind}
              onRaiseHand={handleRaiseHand}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              handRaised={handRaised}
            />
          </div>
        )}
      </div>
    </div>
  );
}