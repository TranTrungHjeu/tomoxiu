"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg"
          >
            <Eye className="h-5 w-5" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Stalker
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/instagram"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Instagram
          </Link>
          <Link
            href="/facebook"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Facebook
          </Link>
          <Link
            href="/tiktok"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            TikTok
          </Link>
          <Link
            href="/threads"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Threads
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </motion.header>
  );
}
