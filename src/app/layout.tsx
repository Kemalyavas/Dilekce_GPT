import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DilekçeGPT - Türkiye'nin Dilekçe Asistanı | AI Destekli Hukuki Dilekçe",
  description: "AI destekli dilekçe oluşturma platformu. Trafik cezası itiraz, vergi borcu, iş başvurusu ve daha fazlası için profesyonel dilekçeler 2 dakikada hazır!",
  keywords: "dilekçe, trafik cezası itiraz, vergi borcu, hukuki dilekçe, ai dilekçe, otomatik dilekçe",
  authors: [{ name: "DilekçeGPT" }],
  creator: "DilekçeGPT",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://dilekcegpt.com",
    siteName: "DilekçeGPT",
    title: "DilekçeGPT - AI Destekli Dilekçe Asistanı",
    description: "Profesyonel dilekçelerinizi 2 dakikada oluşturun. Avukat masraflarından tasarruf edin!",
  },
  twitter: {
    card: "summary_large_image",
    title: "DilekçeGPT - AI Destekli Dilekçe Asistanı",
    description: "Profesyonel dilekçelerinizi 2 dakikada oluşturun!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}