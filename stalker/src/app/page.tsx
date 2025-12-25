"use client";

import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Music2,
  AtSign,
  Eye,
  Shield,
  Zap,
} from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { PlatformCard } from "@/components/platform-card";

const platforms = [
  {
    name: "Instagram",
    description: "Xem profile, posts, stories, reels và highlights công khai",
    icon: Instagram,
    href: "/instagram",
    gradient: "bg-gradient-to-br from-pink-500 via-red-500 to-orange-500",
  },
  {
    name: "Facebook",
    description: "Xem profile, bài đăng và ảnh công khai",
    icon: Facebook,
    href: "/facebook",
    gradient: "bg-gradient-to-br from-blue-600 to-blue-400",
  },
  {
    name: "TikTok",
    description: "Xem profile và video công khai",
    icon: Music2,
    href: "/tiktok",
    gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600",
  },
  {
    name: "Threads",
    description: "Xem profile và threads công khai",
    icon: AtSign,
    href: "/threads",
    gradient: "bg-gradient-to-br from-gray-800 to-gray-500",
  },
];

const features = [
  {
    icon: Eye,
    title: "Không cần đăng nhập",
    description: "Xem thông tin công khai mà không cần tài khoản",
  },
  {
    icon: Shield,
    title: "Riêng tư & An toàn",
    description: "Chỉ xem dữ liệu công khai, không vi phạm quyền riêng tư",
  },
  {
    icon: Zap,
    title: "Nhanh chóng",
    description: "Kết quả tức thì với caching thông minh",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Social Media
              </span>
              <br />
              <span className="text-foreground">Profile Viewer</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Xem thông tin công khai từ Instagram, Facebook, TikTok, Threads
              <br className="hidden md:block" />
              <span className="text-violet-500 font-medium">
                mà không cần đăng nhập
              </span>
            </p>
          </motion.div>
        </div>

        {/* Search Box */}
        <SearchBox />
      </section>

      {/* Platforms Section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-10"
        >
          Chọn nền tảng
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {platforms.map((platform, index) => (
            <PlatformCard
              key={platform.name}
              {...platform}
              delay={0.1 * index}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Stalker. Chỉ xem thông tin công khai.</p>
        </div>
      </footer>
    </div>
  );
}
