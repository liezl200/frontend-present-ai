import type { Metadata } from 'next';
import { getApiKey } from '@/app/actions';
import { PresentableLogo } from '@/components/logo';
import { KeyProvider } from '@/components/key-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ElevenLabs Next.js Playground',
    template: '%s | ElevenLabs Next.js',
  },
  metadataBase: new URL('https://elevenlabs-playground.vercel.app'),
  description: 'A Next.JS playground to explore ElevenLabs capabilities.',
  openGraph: {
    title: 'ElevenLabs Next.js Playground',
    description: 'A playground to explore ElevenLabs capabilities.',
    images: [`/api/og?title=ElevenLabs Next.js Playground`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
          <AuthProvider>
            <KeyProvider apiKey={apiKey}>
              <div className="background-gradient">
                <header className="relative flex h-[60px] shrink-0 items-center px-6 border-b border-border">
                  <Link href="/" className="flex items-center">
                  </Link>
                </header>
                <div className="px-4">
                  <div className="mx-auto w-9/10 h-[75vh] space-y-3 px-2 lg:px-8">
                    <Card className="border-gradient rounded-lg p-px shadow-lg">
                      <div className="bg-card rounded-lg">{children}</div>
                    </Card>
                  </div>
                </div>
              </div>
            </KeyProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}