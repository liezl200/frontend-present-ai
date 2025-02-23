'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useAtom } from 'jotai';
import { filesAtom, selectedFileIdAtom } from '../store/atoms';
import { Menu, X, FileText, Upload } from 'lucide-react';
import PDFPresenter from '@/components/presenter-main';
import LoadingIndicator from '@/components/loading-indicator';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFPage() {
  const [files] = useAtom(filesAtom);
  const [selectedFileId, setSelectedFileId] = useAtom(selectedFileIdAtom);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleUploadClick = () => {
    setSidebarOpen(false);
    setSelectedFileId(null);
  };
  const selectedFile = files.find(f => f.id === selectedFileId);



  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-zinc-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-xl font-semibold text-white">Files</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <button
            onClick={handleUploadClick}
            className="w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600 rounded-md flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload New Presentation
          </button>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                  selectedFileId === file.id
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
            {files.length === 0 && (
              <div className="text-zinc-400 text-sm text-center py-4">
                No files uploaded yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-20 p-2 rounded-lg bg-zinc-900 text-white shadow-md hover:bg-zinc-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <PDFPresenter selectedFile={selectedFile?.file} />
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>

  );
}