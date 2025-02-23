import React, { useCallback, useState } from 'react';
// import { Upload, Loader2 } from 'lucide-react';
import { Upload } from 'lucide-react';
import { storage } from '@/lib/firebase'; 
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import LoadingIndicator from './loading-indicator';

interface FileUploadProps {
  onFileSelect: (file: File, uuid: string) => void;
  onUploadComplete?: (audioUrls?: Record<number, { audioUrl: string, duration: number, lastModified: Date }>) => void;
}

export const FileUpload: React.FC<FileUploadProps> =
({ onFileSelect, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const uuid = "ea43146d-40f5-45c8-86d0-91f0d2094fe4";
      onFileSelect(file, uuid);
      // uploadToFirebase(file, uuid);
    }
  };

  const uploadToFirebase = async (file: File, uuid: string) => {
    try {
      setIsUploading(true);

      // Generate a unique ID for the presentation
      const presentationId = uuid;
      
      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, `uploads/${presentationId}.pdf`);
      
      // Upload the file
      await uploadBytes(fileRef, file);
      
      setIsUploading(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      
      const file = event.dataTransfer.files?.[0];
      if (file && file.type === 'application/pdf') {
        const uuid = "ea43146d-40f5-45c8-86d0-91f0d2094fe4";
        onFileSelect(file, uuid);
        // uploadToFirebase(file, uuid);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <div className="flex flex-col items-center w-full gap-8 mt-18">
      <img 
        src="/logo3.png" 
        alt="Present AI Logo" 
        className="w-96 h-auto"
      />
      <div className="w-2/3 max-w-2xl">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-white border-dotted rounded-lg bg-transparent">
            <LoadingIndicator />
            <p className="mt-4 text-white text-sm">Uploading your presentation...</p>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-white border-dotted rounded-lg cursor-pointer bg-transparent hover:bg-white/5"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
          >
            <div className="flex flex-col items-center justify-center pt-4 pb-4">
              <Upload className="w-10 h-10 mb-3 text-white" />
              <p className="mb-2 text-sm text-white">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-white/80">PDF files only</p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};