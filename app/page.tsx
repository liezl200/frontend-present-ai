'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';

import { AudioPlayer } from '@/components/audio-player';
import { InputSoundEffect } from '@/components/input-sound-effect';
import { InputPdfFile } from '@/components/input-pdf-file';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { GeneratedSoundEffect } from '@/types';

export default function Page() {
  const [soundEffects, setSoundEffects] = useState<GeneratedSoundEffect[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<GeneratedSoundEffect | null>(null);
  const [autoplay, setAutoplay] = useState(true);

  const handlePendingSoundEffect = (prompt: string) => {
    const pendingEffect: GeneratedSoundEffect = {
      id: crypto.randomUUID(),
      prompt,
      audioBase64: '',
      createdAt: new Date(),
      status: 'loading',
    };
    setSoundEffects((prev) => [pendingEffect, ...prev]);
    setSelectedEffect(pendingEffect);
    return pendingEffect.id;
  };

  const updatePendingEffect = (id: string, effect: GeneratedSoundEffect) => {
    setSoundEffects((prev) =>
      prev.map((item) => (item.id === id ? { ...effect, status: 'complete' as const } : item))
    );
    setSelectedEffect((current) =>
      current?.id === id ? { ...effect, status: 'complete' as const } : current
    );
  };

  return (
    <div>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Hello!</h1>
        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto max-w-4xl">
            <InputPdfFile onFileSelected={(file) => console.log('Selected PDF file:', file)} />
          </div>
        </div>
      </div>

    </div>
  );
}
