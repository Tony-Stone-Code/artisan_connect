import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
  title: {
    template: '%s | ArtisanConnect',
    default: 'ArtisanConnect - Find Trusted Professionals in Ghana',
  },
  description: 'The easiest way to find and hire verified plumbers, electricians, carpenters, and other skilled professionals across Ghana.',
  openGraph: {
    title: 'ArtisanConnect - Find Trusted Professionals',
    description: 'The easiest way to find and hire verified plumbers, electricians, carpenters, and other skilled professionals across Ghana.',
    url: 'https://artisan-connect.netlify.app',
    siteName: 'ArtisanConnect',
    images: [
      {
        url: '/images/about_hero_1782323590841.png', // We will use one of our images as the OG image
        width: 1200,
        height: 630,
        alt: 'ArtisanConnect Preview',
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtisanConnect - Find Trusted Professionals',
    description: 'Find and hire verified plumbers, electricians, carpenters across Ghana.',
    images: ['/images/about_hero_1782323590841.png'],
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
        </ThemeProvider>
      </body>
    </html>
  );
}
