import React from 'react';
import { Hand as HandRaised, ChevronLeft, ChevronRight, Play, Pause, Circle } from 'lucide-react';

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
}

export function PresentationControls({
  currentSlide,
  totalSlides,
  isPlaying,
  onPrevious,
  onNext,
  onPlayPause,
  onRaiseHand,
  handRaised,
  slideProgress,
}: PresentationControlsProps) {
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
              <div 
                className="p-2 rounded-r-full border-l border-border bg-red-600 text-white animate-pulse"
                title="Recording indicator (no functionality)"
              >
                <Circle className="w-6 h-6" />
              </div>
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
