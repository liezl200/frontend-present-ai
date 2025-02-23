'use client';

import { atom } from 'jotai';
export interface FileItem {
  id: string;
  name: string;
  type: 'pdf';
  file: File;
  lastModified: Date;
}
export interface PresentationState {
  currentPage: number;
  numPages: number;
  isPlaying: boolean;
  handRaised: boolean;
  slideProgress: number;
  isLoading: boolean;
  error: string | null;
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
  error: null,
});