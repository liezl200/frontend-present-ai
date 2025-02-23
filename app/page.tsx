'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { FileUpload } from '@/components/file-upload';
import { PresentationControls } from '@/components/presentation-controls';
import { useConversation } from '@11labs/react';
import LoadingIndicator from '@/components/loading-indicator';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFPresenter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs'),
    onDisconnect: () => console.log('Disconnected from ElevenLabs'),
    onMessage: (message: unknown) => console.log('Message received:', message),
    onError: (error: Error) => console.error('ElevenLabs error:', error),
  });

  const resetPresentation = useCallback(() => {
    setPdfFile(null);
    setCurrentPage(1);
    setNumPages(0);
    setIsPlaying(false);
    setSlideProgress(0);
    setHandRaised(false);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setIsLoading(true);
    setTimeout(() => {
      setPdfFile(file);
      setCurrentPage(1);
      setIsPlaying(false);
      setSlideProgress(0);
      setIsLoading(false);
    }, 5000);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    setIsPlaying(false);
    setSlideProgress(0);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
    setSlideProgress(0);
  }, [numPages]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      setSlideProgress(0);
    }
  }, [isPlaying]);

  const toggleHandRaise = useCallback(async () => {
    console.log("i am toggled")
    setHandRaised((prev) => !prev);
    setIsPlaying(false);
    setSlideProgress(0);

    try {
      if (!handRaised) {
        // Start conversation when hand is raised
        await conversation.startSession({"agentId": process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID as string});
      } else {
        // End conversation when hand is lowered
        console.log("the hand is lowered");
        await conversation.endSession();
      }
    } catch (error) {
      console.error('Error managing conversation:', error);
    }
  }, [handRaised, conversation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSlideProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  useEffect(() => {
    if (currentPage >= numPages) {
      setIsPlaying(false);
    }
  }, [currentPage, numPages]);

  return (
    <div className="h-[75vh] bg-background">
      {isLoading && <LoadingIndicator />}
      {!pdfFile ? (
        <div className="max-w-2xl mx-auto pt-10 px-8">
          <div className="flex justify-center items-center shadow-lg pt-[8vh] pb-[5vh]">
            <img src="/logo3.png" alt="image" className="max-w-4/5 max-h-full rounded-lg" />
          </div>
          <FileUpload onFileSelect={handleFileSelect} />
          {/* <div className="absolute top-0 left-0 pl-[4.5vw] pt-[2.5vh] z-20">
            <button onClick={resetPresentation}
            className = "cursor-pointer">
              <img src="/logo3.png"
                    alt="image"
                    className="max-h-7 rounded-full shadow-md hover:scale-105 transition-transform duration-200" />
            </button>
          </div> */}
        </div>
      ) : (
        <div className="p-4 h-[75vh] max-w-full">
          <div className="absolute top-0 right-0 pr-[4.5vw] pt-[1.8vh] z-50">
            <button
              onClick={resetPresentation}
              className="px-4 py-2 text-sm font-medium text-black bg-primary hover:bg-primary/90 rounded-md cursor-pointer"
            >
              Upload New Presentation
            </button>
          </div>
          {/* <div className="absolute top-0 left-0 pl-[4.5vw] pt-[2.5vh] z-20">
            <button onClick={resetPresentation}
            className = "cursor-pointer">
              <img src="/logo3.png"
                    alt="image"
                    className="max-h-7 rounded-full shadow-md hover:scale-105 transition-transform duration-200" />
            </button>
          </div> */}
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex justify-center"
          >
            <Page
              key={currentPage}
              pageNumber={currentPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          <div className="flex flex-col gap-2 relative">
            <PresentationControls
              currentSlide={currentPage}
              totalSlides={numPages}
              isPlaying={isPlaying}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onPlayPause={togglePlayPause}
              onRaiseHand={toggleHandRaise}
              handRaised={handRaised}
              slideProgress={slideProgress}
            />
          </div>
        </div>
      )}
    </div>
  );
}