import { Metadata } from 'next';
import React from 'react';

import { getApiKey } from '@/app/actions';
import { KeyProvider } from '@/components/key-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/jotaiprovider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'PDF Presenter',
  description: 'A modern PDF presentation tool with slide controls and hand-raising feature',
  keywords: ['PDF', 'presentation', 'slides', 'viewer'],
  authors: [{ name: 'PDF Presenter Team' }],
  openGraph: {
    title: 'PDF Presenter',
    description: 'A modern PDF presentation tool with slide controls and hand-raising feature',
    type: 'website',
    siteName: 'PDF Presenter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Presenter',
    description: 'A modern PDF presentation tool with slide controls and hand-raising feature',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
};

export default async function Layout({ children }: { children: React.ReactNode }) {

  const apiKeyResult = await getApiKey();
  const apiKey = apiKeyResult.ok ? apiKeyResult.value : null;

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <KeyProvider apiKey={apiKey}>
            <Providers>
              <div className="background-gradient min-h-screen w-full">
                <header className="relative flex h-[60px] shrink-0 items-center justify-center">
                </header>
                <div>
                  {children}
                </div>
              </div>
            </Providers>
          </KeyProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}