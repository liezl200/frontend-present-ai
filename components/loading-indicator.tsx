'use client';

import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="fixed top-10 right-10 bg-white p-4 shadow-lg rounded-md flex items-center gap-2">
      <span className="animate-spin h-5 w-5 border-t-2 border-blue-500 border-solid rounded-full"></span>
      <p className="text-sm">Uploading...</p>
    </div>
  );
}