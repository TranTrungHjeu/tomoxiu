"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  platform: string;
  username: string;
}

export function ComingSoon({ platform, username }: ComingSoonProps) {
  return (
    <div className="container mx-auto px-4 py-10">
      <Link
        href={`/${platform.toLowerCase()}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 mb-8"
        >
          <Construction className="h-12 w-12" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4">
          {platform} Viewer đang được phát triển
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Tính năng xem profile <strong>@{username}</strong> trên {platform} sẽ sớm được ra mắt.
          Hiện tại chỉ Instagram được hỗ trợ đầy đủ.
        </p>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/instagram">Thử Instagram</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
