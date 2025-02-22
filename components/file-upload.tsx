import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === 'application/pdf') {
        onFileSelect(file);
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
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground">
          Drop your PDF here or click to upload
        </p>
        <p className="text-sm text-muted-foreground mt-2">Only PDF files are supported</p>
      </label>
    </div>
  );
};