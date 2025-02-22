import React from 'react';
import { Play, Pause, RotateCcw, Hand } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  onRaiseHand: () => void;
  currentSlide: number;
  totalSlides: number;
  handRaised: boolean;
}

export function VideoControls({
  isPlaying,
  onPlayPause,
  onRewind,
  onRaiseHand,
  currentSlide,
  totalSlides,
  handRaised,
}: VideoControlsProps) {
  return (
    <div className="bg-gray-800 shadow-xl rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={onRewind}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={onRaiseHand}
            className={`p-2 rounded-full transition-colors ${
              handRaised ? 'bg-blue-900 text-blue-400' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Hand className="w-6 h-6" />
          </button>
        </div>
        <div className="text-gray-300">
          Slide {currentSlide} of {totalSlides}
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all"
          style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}