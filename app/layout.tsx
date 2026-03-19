import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GEO Analyzer — AI Search Visibility Score",
  description:
    "Analyze any URL and get a detailed GEO/AEO score. Find out if ChatGPT, Perplexity, and Google AI Overviews can find and cite your content.",
  openGraph: {
    title: "GEO Analyzer — AI Search Visibility Score",
    description:
      "Analyze your website's visibility in AI search engines. Get a 0-100 GEO score with actionable recommendations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
