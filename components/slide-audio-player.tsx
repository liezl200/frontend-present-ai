import React, { useEffect, useRef } from 'react';

interface SlideAudioPlayerProps {
  audioUrl?: string;
  isPlaying: boolean;
  onEnded: () => void;
}

export function SlideAudioPlayer({ audioUrl, isPlaying, onEnded }: SlideAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && audioUrl) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl || '';
    }
  }, [audioUrl]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
      {audioUrl ? (
        <audio
          ref={audioRef}
          onEnded={onEnded}
          controls
          autoPlay
          className="w-full"
        >
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p className="text-sm text-gray-400 text-center">No audio available for this slide</p>
      )}
    </div>
  );
}
