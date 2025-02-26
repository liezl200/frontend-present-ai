'use client';

import { atom } from 'jotai';
export interface FileItem {
  id: string;
  name: string;
  type: 'pdf';
  file: File;
  lastModified: Date;
}
export interface SlideAudio {
  audioUrl: string;
  duration: number;
  lastModified: Date;
}
export interface PresentationState {
  currentPage: number;
  numPages: number;
  isPlaying: boolean;
  handRaised: boolean;
  slideProgress: number;
  isLoading: boolean;
  isProcessing: boolean;
  processingUuid: string | null;
  error: string | null;
  slideAudios: Record<number, SlideAudio>;  // Map slide numbers to their audio data
}
export const filesAtom = atom<FileItem[]>([]);
export const selectedFileIdAtom = atom<string | null>(null);
export const presentationAtom = atom<PresentationState>({
  currentPage: 1,
  numPages: 0,
  isPlaying: false,
  handRaised: false,
  slideProgress: 0,
  isLoading: false,
  isProcessing: false,
  processingUuid: null,
  error: null,
  slideAudios: {},
});