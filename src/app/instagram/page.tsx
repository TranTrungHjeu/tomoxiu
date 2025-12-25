"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InstagramPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/instagram/${username.replace("@", "").trim()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 text-white mb-6">
          <Instagram className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Instagram Viewer</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Xem profile, posts, stories và highlights công khai từ Instagram
        </p>
      </motion.div>

      {/* Search */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch}
        className="max-w-xl mx-auto"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
          <div className="relative flex items-center gap-2 bg-card border border-border rounded-xl p-2">
            <div className="flex items-center gap-2 pl-4 text-muted-foreground">
              <Search className="h-5 w-5" />
              <span>@</span>
            </div>
            <Input
              type="text"
              placeholder="Nhập Instagram username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              disabled={!username.trim()}
              className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-lg px-6"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Popular profiles placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16 text-center"
      >
        <h3 className="text-lg font-semibold mb-4">Thử tìm kiếm</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {["cristiano", "leomessi", "kyliejenner", "therock"].map((name) => (
            <Button
              key={name}
              variant="outline"
              size="sm"
              onClick={() => router.push(`/instagram/${name}`)}
              className="rounded-full"
            >
              @{name}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
