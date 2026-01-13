import '@/app/styles/globals.css';
import { inter, geistSans, geistMono } from '@/app/styles/fonts';

import type { Metadata } from 'next';

import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import { getDomain } from '@/lib/server-utils';
import { ThemeProvider } from '@/lib/context/theme';

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getDomain();

  return {
    title: domain?.title,
    description: domain?.description,
    icons: {
      shortcut: `/-/${domain?.host}/favicon.ico`,
      apple: `/-/${domain?.host}/apple-touch-icon.png`,
      other: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          url: `/-/${domain?.host}/favicon-96x96.png`,
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: `/-/${domain?.host}/favicon.svg`,
        },
      ],
    },
    appleWebApp: {
      title: domain?.title,
      statusBarStyle: 'black-translucent',
      capable: true,
    },
    manifest: `/-/${domain?.host}/site.webmanifest`,
    other: {
      'color-scheme': 'dark light',
    },
  };
}

export const viewport = {
  initialScale: 1,
  width: 'device-width',
  height: 'device-height',
  maximumScale: 1,
  minimumScale: 1,
  userScalable: 'no',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const domain = await getDomain();
  return (
    <html lang="en">
      <ThemeProvider>
        <body
          className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex flex-col min-h-screen">
            <div className="flex flex-col items-center justify-center flex-grow w-full mx-auto px-4">
              {!domain ? (
                <div className="w-4/12 mx-auto mb-8">
                  <span className="text-xl font-semibold text-muted-foreground">
                    ... uh ... yeah ... this is awkward ...
                  </span>
                </div>
              ) : (
                children
              )}
            </div>
            <footer className="container border-t-2 w-full mx-auto px-0 sm:px-4 py-4 flex justify-end items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">
                  an ion spark by ion Consulting LLC ©{' '}
                  {new Date().getFullYear()}
                </span>
                <span className="text-muted">|</span>
                <Link
                  href="/-/privacy"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </div>
            </footer>
          </div>
          <Analytics />
        </body>
      </ThemeProvider>
    </html>
  );
}
