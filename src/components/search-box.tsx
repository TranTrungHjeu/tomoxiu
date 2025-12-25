"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Instagram,
  Facebook,
  Music2,
  AtSign,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    gradient: "gradient-instagram",
    color:
      "hover:bg-pink-500/10 data-[state=on]:bg-pink-500 data-[state=on]:text-white",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    gradient: "gradient-facebook",
    color:
      "hover:bg-blue-500/10 data-[state=on]:bg-blue-500 data-[state=on]:text-white",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    gradient: "gradient-tiktok",
    color:
      "hover:bg-gray-500/10 data-[state=on]:bg-gray-800 data-[state=on]:text-white",
  },
  {
    id: "threads",
    name: "Threads",
    icon: AtSign,
    gradient: "gradient-threads",
    color:
      "hover:bg-gray-500/10 data-[state=on]:bg-gray-700 data-[state=on]:text-white",
  },
];

export function SearchBox() {
  const [username, setUsername] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
    <TooltipProvider delayDuration={0}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Platform selector */}
        <div className="flex justify-center mb-6">
          <ToggleGroup
            type="single"
            value={selectedPlatform}
            onValueChange={(value) => value && setSelectedPlatform(value)}
            className="bg-muted/50 p-1 rounded-full"
          >
            {platforms.map((platform) => (
              <Tooltip key={platform.id}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={platform.id}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                      platform.color
                    )}
                  >
                    <platform.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{platform.name}</span>
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tìm trên {platform.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative group">
            {/* Glow effect */}
            <motion.div
              animate={{
                opacity: isFocused ? 0.5 : 0.2,
                scale: isFocused ? 1.02 : 1,
              }}
              className={cn(
                "absolute -inset-1 rounded-2xl blur-xl transition-all duration-300",
                selectedPlatformData?.gradient
              )}
            />

            <div
              className={cn(
                "relative flex items-center gap-2 glass-card rounded-2xl p-2 transition-all duration-300",
                isFocused && "ring-2 ring-primary/50"
              )}
            >
              <div className="flex items-center gap-2 pl-4 text-muted-foreground">
                <Search className="h-5 w-5" />
                <span className="text-sm font-mono">@</span>
              </div>

              <Input
                type="text"
                placeholder="Nhập username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
              />

              <Button
                type="submit"
                disabled={!username.trim() || isLoading}
                size="lg"
                className={cn(
                  "rounded-xl px-6 font-medium transition-all gap-2",
                  selectedPlatformData?.gradient,
                  "text-white shadow-lg hover:shadow-xl hover:opacity-90"
                )}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <span>Tìm kiếm</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </form>

        {/* Quick suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mt-4"
        >
          <span className="text-xs text-muted-foreground">Thử với:</span>
          {["cristiano", "leomessi", "kyliejenner"].map((name) => (
            <button
              key={name}
              onClick={() => {
                setUsername(name);
                router.push(`/${selectedPlatform}/${name}`);
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              @{name}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
