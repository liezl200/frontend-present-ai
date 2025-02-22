'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type InputPdfFileProps = {
  onFileSelected: (file: File) => void;
};

export function InputPdfFile({ onFileSelected }: InputPdfFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
      }
      onFileSelected(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
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

      {/* Display the selected PDF */}
      {pdfUrl && (
        <div className="mt-4">
          <iframe src={pdfUrl} width="100%" height="500px" />
        </div>
      )}
    </div>
  );
}
