import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { FloatingShapes } from "@/components/floating-shapes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stalker - Xem Profile Mạng Xã Hội",
  description:
    "Xem thông tin công khai từ Instagram, Facebook, TikTok, Threads mà không cần đăng nhập",
  keywords: [
    "instagram viewer",
    "facebook viewer",
    "tiktok viewer",
    "social media stalker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="stalker-theme">
          <FloatingShapes />
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
