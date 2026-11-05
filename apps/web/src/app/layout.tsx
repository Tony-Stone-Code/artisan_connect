import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CookieConsent } from '@/components/ui/CookieConsent';
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://artisan-connect-mvp.vercel.app');

export const viewport: Viewport = {
  themeColor: '#002B49',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | ArtisanConnect',
    default: 'ArtisanConnect - Find Trusted Professionals in Ghana',
  },
  description: 'The easiest way to find and hire verified plumbers, electricians, carpenters, and other skilled professionals across Ghana.',
  keywords: ['artisan', 'professional services', 'Ghana', 'plumber', 'electrician', 'carpenter', 'hire', 'escrow', 'trusted'],
  authors: [{ name: 'GammaCube' }],
  creator: 'GammaCube',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ArtisanConnect',
  },
  openGraph: {
    title: 'ArtisanConnect - Find Trusted Professionals',
    description: 'The easiest way to find and hire verified plumbers, electricians, carpenters, and other skilled professionals across Ghana.',
    url: siteUrl,
    siteName: 'ArtisanConnect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ArtisanConnect - Find Trusted Professionals in Ghana',
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtisanConnect - Find Trusted Professionals',
    description: 'Find and hire verified plumbers, electricians, carpenters across Ghana.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icons/icon-192.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.25.0/mapbox-gl.css" />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
