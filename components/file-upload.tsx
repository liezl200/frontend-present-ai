import React, { useCallback, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { storage } from '@/lib/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (jsonPath: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToFirebase = async (file: File) => {
    try {
      setIsUploading(true);
      onFileSelect(file);

      // Generate a unique ID for the presentation
      const presentationId = uuidv4();
      
      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, `uploads/${presentationId}.pdf`);
      
      // Upload the file
      await uploadBytes(fileRef, file);
      
      // Get the download URL (optional, if you need it)
      const downloadURL = await getDownloadURL(fileRef);
      
      // The JSON will be created by the Cloud Function and stored at this path
      const expectedJsonPath = `presentations/${presentationId}/content.json`;
      
      // Notify parent component
      onUploadComplete?.(expectedJsonPath);
      
      setIsUploading(false);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      // Handle error appropriately
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        console.log("pdf detected")
        uploadToFirebase(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      console.log("file detected")
      if (file && file.type === 'application/pdf') {
        console.log("pdf detected")
        uploadToFirebase(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors bg-card"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        {isUploading ? (
          <>
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
            <p className="text-lg font-medium text-foreground">
              Uploading... {uploadProgress}%
            </p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              Drop your PDF here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-2">Only PDF files are supported</p>
          </>
        )}
      </label>
    </div>
  );
};