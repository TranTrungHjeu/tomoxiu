"use client";

import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Music2,
  AtSign,
  ArrowRight,
  Heart,
} from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { PlatformCard } from "@/components/platform-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const platforms = [
  {
    name: "Instagram",
    description: "Xem profile, posts, stories, reels và highlights công khai",
    icon: Instagram,
    href: "/instagram",
    gradient: "gradient-instagram",
    stats: "2M+ lượt xem",
  },
  {
    name: "Facebook",
    description: "Xem profile, bài đăng và ảnh công khai",
    icon: Facebook,
    href: "/facebook",
    gradient: "gradient-facebook",
    stats: "1.5M+ lượt xem",
  },
  {
    name: "TikTok",
    description: "Xem profile và video công khai",
    icon: Music2,
    href: "/tiktok",
    gradient: "gradient-tiktok",
    stats: "800K+ lượt xem",
  },
  {
    name: "Threads",
    description: "Xem profile và threads công khai",
    icon: AtSign,
    href: "/threads",
    gradient: "gradient-threads",
    stats: "500K+ lượt xem",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Social Media</span>
              <br />
              <span className="text-foreground">Profile Viewer</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Xem thông tin công khai từ Instagram, Facebook, TikTok, Threads
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SearchBox />
          </motion.div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Chọn nền tảng yêu thích
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Hỗ trợ các mạng xã hội phổ biến nhất với giao diện đẹp mắt và dễ
              sử dụng
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {platforms.map((platform, index) => (
              <motion.div key={platform.name} variants={itemVariants}>
                <PlatformCard {...platform} delay={0.1 * index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Bắt đầu ngay hôm nay
            </h2>
            <p className="text-muted-foreground mb-8">
              Nhập username và xem profile chỉ trong vài giây
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/instagram">
                  <Instagram className="h-5 w-5" />
                  Bắt đầu với Instagram
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/tiktok">
                  <Music2 className="h-5 w-5" />
                  Thử với TikTok
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in
            Vietnam
          </p>
        </div>
      </footer>
    </div>
  );
}
