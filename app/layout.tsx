import type { Metadata } from "next";
import "./globals.css";

import { Playfair_Display, Inter } from "next/font/google";

import Navbar from "@/components/navbar";
import Footer from "@/components/layout/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Locus",
  description: "AI Powered Real Estate Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navbar />

        <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
          <Footer />
        </div>

        <MobileBottomNav />
      </body>
    </html>
  );
}
