import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
// 1. AuthProvider ko import karein (Rasta sahi check kar lena apne hisab se)
import { AuthProvider } from '@/context/AuthContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadGenAI - Real-time Lead Generation',
  description: 'AI-powered lead generation with real-time scraping, AI pitch generation, and intelligent lead filtering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-gray-100 antialiased`} suppressHydrationWarning>
        {/* 2. AuthProvider se baki sabko wrap karein */}
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
