import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtisanConnect Ghana",
  description: "Find Trusted Artisans in Ghana",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
