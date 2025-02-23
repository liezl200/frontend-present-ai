import type { Metadata } from 'next';
import { getApiKey } from '@/app/actions';
import { AppSidebar } from '@/components/app-sidebar';
import { KeyProvider } from '@/components/key-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Card } from '@/components/ui/card';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

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
          <KeyProvider apiKey={apiKey}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="background-gradient">
                <header className="relative flex h-[60px] shrink-0 items-center justify-center">
                  <SidebarTrigger className="absolute left-3" />
                </header>
                <div>
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </KeyProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}