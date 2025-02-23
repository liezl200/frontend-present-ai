import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { audioPlaybackAtom } from '@/store/atoms';

interface SlideAudioPlayerProps {
  audioUrl?: string;
  isPlaying: boolean;
  onEnded: () => void;
}

export function SlideAudioPlayer({ audioUrl, isPlaying, onEnded }: SlideAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlayback, setAudioPlayback] = useAtom(audioPlaybackAtom);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && audioUrl && audioPlayback.shouldPlay) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setAudioPlayback(prev => ({ ...prev, isPlaying: true }));
      } else {
        audioRef.current.pause();
        setAudioPlayback(prev => ({ ...prev, isPlaying: false }));
      }
    }
  }, [isPlaying, audioUrl, audioPlayback.shouldPlay, setAudioPlayback]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl || '';
    }
  }, [audioUrl]);

  const handleEnded = () => {
    setAudioPlayback(prev => ({ ...prev, isPlaying: false }));
    onEnded();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
      {audioUrl ? (
        <audio
          ref={audioRef}
          onEnded={handleEnded}
          controls
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