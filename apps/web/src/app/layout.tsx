import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CookieConsent } from '@/components/ui/CookieConsent';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://artisan-connect.netlify.app'),
  title: {
    template: '%s | ArtisanConnect',
    default: 'ArtisanConnect - Find Trusted Professionals in Ghana',
  },
  description: 'The easiest way to find and hire verified plumbers, electricians, carpenters, and other skilled professionals across Ghana.',
  keywords: ['artisan', 'professional services', 'Ghana', 'plumber', 'electrician', 'carpenter', 'hire', 'escrow', 'trusted'],
  authors: [{ name: 'GammaCube' }],
  creator: 'GammaCube',
  openGraph: {
    title: 'ArtisanConnect - Find Trusted Professionals',
    description: 'The easiest way to find and hire verified plumbers, electricians, carpenters, and other skilled professionals across Ghana.',
    url: 'https://artisan-connect.netlify.app',
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
      { url: '/icon.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
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
      <body className={`${inter.variable} ${outfit.variable} min-h-full flex flex-col transition-colors duration-300`}>
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
