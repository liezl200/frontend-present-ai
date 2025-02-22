'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';

type InputPdfFileProps = {
  onFileSelected: (file: File) => void;
};

export function InputPdfFile({ onFileSelected }: InputPdfFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
      }
      onFileSelected(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Button type="button" onClick={handleButtonClick}>
        Select PDF File
      </Button>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}