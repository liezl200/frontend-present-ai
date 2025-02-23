'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingIndicator() {
  return (
    <div className="max-w-2xl mx-auto pt-10 px-8 text-center">
      <Loader2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
      <p className="text-lg font-medium text-foreground text-center">
        Loading your lecture...
      </p>
    </div>
  );
}