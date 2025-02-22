import React from 'react';
import { Hand as HandRaised, ChevronLeft, ChevronRight, Play, Pause, Mic, MicOff } from 'lucide-react';

interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onRaiseHand: () => void;
  handRaised: boolean;
  slideProgress: number;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  currentSlide,
  totalSlides,
  isPlaying,
  onPrevious,
  onNext,
  onPlayPause,
  onRaiseHand,
  handRaised,
  slideProgress,
  isRecording,
  onToggleRecording,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card shadow-lg">
      <div className="h-1 bg-secondary">
        <div 
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${slideProgress}%` }}
        />
      </div>
      <div className="max-w-3xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full hover:bg-secondary text-foreground"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={onRaiseHand}
              className={`p-2 rounded-l-full ${
                handRaised
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-foreground'
              }`}
            >
              <HandRaised className="w-6 h-6" />
            </button>
            {handRaised && (
              <button
                onClick={onToggleRecording}
                className={`p-2 rounded-r-full border-l border-border ${
                  isRecording
                    ? 'bg-destructive text-destructive-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onPrevious}
            className="p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
            disabled={currentSlide === 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm font-medium text-foreground">
            {currentSlide} / {totalSlides}
          </span>
          <button
            onClick={onNext}
            className="p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
            disabled={currentSlide === totalSlides}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};