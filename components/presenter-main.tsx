import { useAtom } from 'jotai';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useConversation } from '@11labs/react';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { FileUpload } from './file-upload';
import { PresentationControls } from './presentation-controls';
import LoadingIndicator from './loading-indicator';
import { SlideAudioPlayer } from './slide-audio-player';
import { filesAtom, presentationAtom, selectedFileIdAtom, audioPlaybackAtom } from '../store/atoms';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFPresenterProps {
  selectedFile?: File | null;
}

export default function PDFPresenter({ selectedFile }: PDFPresenterProps) {
  const [files, setFiles] = useAtom(filesAtom);
  const [selectedFileId, setSelectedFileId] = useAtom(selectedFileIdAtom);
  const [presentation, setPresentation] = useAtom(presentationAtom);
  const [audioPlayback, setAudioPlayback] = useAtom(audioPlaybackAtom);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs'),
    onDisconnect: () => console.log('Disconnected from ElevenLabs'),
    onMessage: (message: unknown) => console.log('Message received:', message),
    onError: (error: Error) => console.error('ElevenLabs error:', error),
  });

  const handleFileUpload = (file: File, uuid: string) => {
    const newFile = {
      id: uuid,
      name: file.name,
      type: 'pdf' as const,
      file: file,
      lastModified: new Date()
    };
    setFiles(prev => [...prev, newFile]);
    setSelectedFileId(newFile.id);
    setPresentation(prev => ({
      ...prev,
      isProcessing: true,
      processingUuid: uuid
    }));
  };

  const handleUploadComplete = (audioUrls: Record<number, { audioUrl: string, duration: number, lastModified: Date }> = {}) => {
    setPresentation(prev => ({
      ...prev,
      slideAudios: audioUrls
    }));
  };

  const resetPresentation = () => {
    setPresentation(prev => ({
      ...prev,
      currentPage: 1,
      numPages: 0,
      isPlaying: false,
      slideProgress: 0,
      handRaised: false,
      error: null
    }));
    setAudioPlayback({ isPlaying: false, shouldPlay: false });
  };

  const handlePrevious = () => {
    setPresentation(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1),
      isPlaying: false,
      slideProgress: 0
    }));
    setAudioPlayback(prev => ({ ...prev, shouldPlay: false }));
  };

  const handleNext = () => {
    setPresentation(prev => ({
      ...prev,
      currentPage: Math.min(prev.numPages, prev.currentPage + 1),
      slideProgress: 0
    }));
  };

  const togglePlayPause = () => {
    setPresentation(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
      slideProgress: !prev.isPlaying ? 0 : prev.slideProgress
    }));
    setAudioPlayback(prev => ({ ...prev, shouldPlay: !prev.shouldPlay }));
  };

  const toggleHandRaise = async () => {
    const newHandRaised = !presentation.handRaised;
    
    setPresentation(prev => ({
      ...prev,
      handRaised: newHandRaised,
    }));
    
    // When raising hand, pause audio playback
    if (newHandRaised) {
      setAudioPlayback({ isPlaying: false, shouldPlay: false });
    }

    try {
      if (newHandRaised) {
        await conversation.startSession({
          agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID as string
        });
      } else {
        console.log("the hand is lowered");
        await conversation.endSession();
      }
    } catch (error) {
      console.error('Error managing conversation:', error);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (presentation.isPlaying && !presentation.handRaised) {
      interval = setInterval(() => {
        setPresentation(prev => {
          if (prev.slideProgress >= 100) {
            handleNext();
            return { ...prev, slideProgress: 0 };
          }
          return { ...prev, slideProgress: prev.slideProgress + 1 };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [presentation.isPlaying, presentation.handRaised]);

  React.useEffect(() => {
    if (presentation.currentPage >= presentation.numPages) {
      setPresentation(prev => ({ ...prev, isPlaying: false }));
      setAudioPlayback({ isPlaying: false, shouldPlay: false });
    }
  }, [presentation.currentPage, presentation.numPages]);

  React.useEffect(() => {
    resetPresentation();
  }, [selectedFileId]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (presentation.isProcessing && presentation.processingUuid) {
      timeout = setTimeout(() => {
        setPresentation(prev => ({
          ...prev,
          isProcessing: false,
          processingUuid: null
        }));
      }, 5000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [presentation.isProcessing, presentation.processingUuid]);

  return (
    <div>
      {presentation.isLoading && <LoadingIndicator />}
      {!selectedFile ? (
        <div className="max-w-2xl mx-auto pt-10">
          <FileUpload 
            onFileSelect={handleFileUpload} 
            onUploadComplete={handleUploadComplete}
          />
        </div>
      ) : presentation.isProcessing ? (
        <div className="flex flex-col items-center justify-center h-[75vh]">
          <LoadingIndicator />
          <p className="mt-4 text-white text-sm">Processing your presentation...</p>
        </div>
      ) : (
        <div className="h-[75vh]">
          <div className="p-4 h-[75vh] max-w-full">
            <Document
                file={selectedFile}
                onLoadSuccess={({ numPages }) => {
                    setPresentation(prev => ({
                      ...prev,
                      numPages,
                      isLoading: false,
                      error: null
                    }));
                  }}
                onLoadError={(error: Error) => {
                setPresentation(prev => ({
                    ...prev,
                    error: 'Failed to load PDF. Please try another file.',
                    isLoading: false
                  }));
                  console.error('PDF load error:', error);
                }}
                loading={<LoadingIndicator />}
                className="flex justify-center"
            >
                <Page
                    key={presentation.currentPage}
                    pageNumber={presentation.currentPage}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="max-h-[calc(100vh-200px)] w-auto shadow-lg"
                    loading={<LoadingIndicator />}
                />
            </Document>

            <div className="flex flex-col gap-2 relative">
                <PresentationControls
                  currentSlide={presentation.currentPage}
                  totalSlides={presentation.numPages}
                  isPlaying={presentation.isPlaying}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onPlayPause={togglePlayPause}
                  onRaiseHand={toggleHandRaise}
                  handRaised={presentation.handRaised}
                  slideProgress={presentation.slideProgress}
                />
                <SlideAudioPlayer
                  audioUrl={presentation.slideAudios[presentation.currentPage]?.audioUrl}
                  isPlaying={presentation.isPlaying && !presentation.handRaised}
                  onEnded={handleNext}
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}