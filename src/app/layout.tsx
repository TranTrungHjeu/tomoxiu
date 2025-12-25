import type { Metadata, Viewport } from "next";
import { Lexend, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f11" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://tomoxiu.com"
  ),
  title: {
    default: "Tomoxiu",
    template: "%s | Tomoxiu",
  },
  description:
    "Xem thông tin công khai từ Instagram, Facebook, TikTok, Threads mà không cần đăng nhập. Nhanh chóng, an toàn và miễn phí.",
  keywords: [
    "instagram viewer",
    "facebook viewer",
    "tiktok viewer",
    "threads viewer",
    "social media stalker",
    "xem profile instagram",
    "xem profile facebook",
  ],
  authors: [{ name: "Tomoxiu Team" }],
  creator: "Tomoxiu",
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Tomoxiu",
    title: "Tomoxiu",
    description:
      "Xem thông tin công khai từ các mạng xã hội mà không cần đăng nhập",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tomoxiu",
    description:
      "Xem thông tin công khai từ các mạng xã hội mà không cần đăng nhập",
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
    <html lang="vi" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${lexend.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="stalker-theme">
          {/* Background decorations */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/2 size-250 rounded-full bg-linear-to-br from-primary/20 via-transparent to-transparent blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/2 size-250 rounded-full bg-linear-to-tr from-primary/10 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
