import React, { useCallback, useState } from 'react';
// import { Upload, Loader2 } from 'lucide-react';
import { Upload } from 'lucide-react';
import { storage } from '@/lib/firebase'; 
import { ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (jsonPath: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> =
({ onFileSelect, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
      uploadToFirebase(file);
    }
  };

  const uploadToFirebase = async (file: File) => {
    try {
      setIsUploading(true);

      // Generate a unique ID for the presentation
      const presentationId = uuidv4();
      
      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, `uploads/${presentationId}.pdf`);
      
      // Upload the file
      await uploadBytes(fileRef, file);
            
      // The JSON will be created by the Cloud Function and stored at this path
      const expectedJsonPath = `presentations/${presentationId}/content.json`;
      
      // Notify parent component
      onUploadComplete?.(expectedJsonPath);
      
      setIsUploading(false);
      // setUploadProgress(100);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      // Handle error appropriately
    }
  };

  // const handleFileInput = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     console.log("file detected")
  //     if (file && file.type === 'application/pdf') {
  //       console.log("pdf detected")
  //       uploadToFirebase(file);
  //     }
  //   },
  //   [onFileSelect]
  // );

  return (
    <div className="flex flex-col items-center w-full gap-8 mt-18">
      <img 
        src="/logo3.png" 
        alt="Present AI Logo" 
        className="w-96 h-auto"
      />
      <div className="w-2/3 max-w-2xl">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-white border-dotted rounded-lg cursor-pointer bg-transparent hover:bg-white/5"
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
      </div>
    </div>
  );
};