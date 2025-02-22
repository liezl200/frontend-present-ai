'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { FileUpload } from '@/components/file-upload';
import { PresentationControls } from '@/components/presentation-controls';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFPresenter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleFileSelect = useCallback((file: File) => {
    setPdfFile(file);
    setCurrentPage(1);
    setIsPlaying(false);
    setSlideProgress(0);
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

  const toggleHandRaise = useCallback(() => {
    setHandRaised((prev) => !prev);
    setIsPlaying(false);
    setSlideProgress(0);
    if (isRecording) {
      setIsRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }
  }, [isRecording]);

  const toggleRecording = useCallback(async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          // Create a temporary link to download the audio
          const link = document.createElement('a');
          link.href = audioUrl;
          link.download = `recording-slide-${currentPage}.webm`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
          stream.getTracks().forEach(track => track.stop());
          URL.revokeObjectURL(audioUrl);
          chunksRef.current = [];
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Could not access microphone. Please check your browser permissions.');
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  }, [isRecording, currentPage]);

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
    <div className="min-h-screen bg-background">
      {!pdfFile ? (
        <div className="max-w-2xl mx-auto pt-20 px-8">
          <FileUpload onFileSelect={handleFileSelect} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-card rounded-lg shadow-lg p-8 mb-20 relative">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              <Page
                key={currentPage}
                pageNumber={currentPage}
                className="max-w-full h-auto"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
          
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
            isRecording={isRecording}
            onToggleRecording={toggleRecording}
          />
        </div>
      )}
    </div>
  );
}