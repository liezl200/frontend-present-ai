import React, { useState } from 'react';

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresentationSidebarProps {
  onSelectFile: (file: File) => void;
}

export default function PresentationSidebar({ onSelectFile }: PresentationSidebarProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFile = event.target.files[0];
      if (!newFile) return;

      // Prevent duplicate file names
      if (files.some((file) => file.name === newFile.name)) {
        alert("A file with this name already exists!");
        return;
      }

      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(newFile);
      onSelectFile(newFile);
    }
  };

  return (
    <div className="w-72 bg-gray-900 text-white h-full flex flex-col shadow-lg">
      {/* Logo + Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <img src="/logo3.png" alt="Presentable Logo" className="h-8" />
      </div>

      {/* Upload Button */}
      <div className="p-4">
        <input type="file" accept="application/pdf" className="hidden" id="fileInput" onChange={handleFileUpload} />
        <label htmlFor="fileInput" className="block">
          <Button variant="secondary" className="w-full flex items-center gap-2">
            <Upload size={16} />
            Upload PDF
          </Button>
        </label>
      </div>

      {/* Uploaded Presentations */}
      <div className="flex-1 overflow-y-auto p-4">
        {files.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-4">No presentations yet.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className={`p-2 rounded-md cursor-pointer text-sm ${
                  selectedFile === file ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
                onClick={() => {
                  setSelectedFile(file);
                  onSelectFile(file);
                }}
              >
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
