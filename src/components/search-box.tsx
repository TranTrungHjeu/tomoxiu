"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Instagram, Facebook, Music2, AtSign, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-orange-500" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-400" },
  { id: "tiktok", name: "TikTok", icon: Music2, color: "from-gray-900 to-gray-600" },
  { id: "threads", name: "Threads", icon: AtSign, color: "from-gray-800 to-gray-500" },
];

export function SearchBox() {
  const [username, setUsername] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    
    // Clean username (remove @ if present)
    const cleanUsername = username.replace("@", "").trim();
    
    // Navigate to platform page
    router.push(`/${selectedPlatform}/${cleanUsername}`);
  };

  const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Platform selector */}
      <div className="flex justify-center gap-2 mb-6">
        {platforms.map((platform) => (
          <motion.button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedPlatform === platform.id
                ? `bg-gradient-to-r ${platform.color} text-white shadow-lg`
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <platform.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{platform.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative group">
          {/* Glow effect */}
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${selectedPlatformData?.color} rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity`}
          />
          
          <div className="relative flex items-center gap-2 bg-card border border-border rounded-xl p-2 shadow-xl">
            <div className="flex items-center gap-2 pl-4 text-muted-foreground">
              <Search className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">@</span>
            </div>
            
            <Input
              type="text"
              placeholder="Nhập username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            
            <Button
              type="submit"
              disabled={!username.trim() || isLoading}
              className={`bg-gradient-to-r ${selectedPlatformData?.color} text-white rounded-lg px-6 py-2 hover:opacity-90 transition-opacity`}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="search"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Stalk
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </form>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground mt-4"
      >
        Nhập username để xem thông tin công khai • Không cần đăng nhập
      </motion.p>
    </motion.div>
  );
}
