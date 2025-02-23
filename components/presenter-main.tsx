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
import { filesAtom, presentationAtom, selectedFileIdAtom } from '../store/atoms';
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
  };

  const handlePrevious = () => {
    setPresentation(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1),
      isPlaying: false,
      slideProgress: 0
    }));
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
  };


  const toggleHandRaise = async () => {
    console.log("i am toggled");
    setPresentation(prev => {
      const newHandRaised = !prev.handRaised;
      return {
        ...prev,
        handRaised: newHandRaised,
        isPlaying: false,
        slideProgress: 0
      };
    });
    try {
      if (!presentation.handRaised) {
        // Start conversation when hand is raised
        await conversation.startSession({
          agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID as string
        });
      } else {
        // End conversation when hand is lowered
        console.log("the hand is lowered");
        await conversation.endSession();
      }
    } catch (error) {
      console.error('Error managing conversation:', error);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (presentation.isPlaying) {
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
  }, [presentation.isPlaying]);

  React.useEffect(() => {
    if (presentation.currentPage >= presentation.numPages) {
      setPresentation(prev => ({ ...prev, isPlaying: false }));
    }
  }, [presentation.currentPage, presentation.numPages]);

  React.useEffect(() => {
    resetPresentation();
  }, [selectedFileId]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (presentation.isProcessing && presentation.processingUuid) {
      timeout = setTimeout(() => {
        // After 20 seconds, stop processing
        setPresentation(prev => ({
          ...prev,
          isProcessing: false,
          processingUuid: null
        }));
      }, 20000); // Wait for 20 seconds
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [presentation.isProcessing, presentation.processingUuid]);

  // Original polling version
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
    
  //   if (presentation.isProcessing && presentation.processingUuid) {
  //     interval = setInterval(async () => {
  //       try {
  //         // Check for the combined audio file
  //         const audioRef = ref(storage, `presentations/${presentation.processingUuid}/audio/combined_audio.wav`);
  //         const exists = await getDownloadURL(audioRef).then(() => true).catch(() => false);
          
  //         if (exists) {
  //           // Audio file exists, stop processing
  //           setPresentation(prev => ({
  //             ...prev,
  //             isProcessing: false,
  //             processingUuid: null
  //           }));
            
  //           // Get the URL and update presentation state
  //           const audioUrl = await getDownloadURL(audioRef);
  //           handleUploadComplete({
  //             1: { audioUrl, duration: 0, lastModified: new Date() }
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Error checking for audio file:', error);
  //       }
  //     }, 5000); // Check every 5 seconds
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [presentation.isProcessing, presentation.processingUuid]);

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
                  isPlaying={presentation.isPlaying}
                  onEnded={handleNext}
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}