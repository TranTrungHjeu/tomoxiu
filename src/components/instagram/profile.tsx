"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Instagram,
  Grid3X3,
  PlayCircle,
  Bookmark,
  Heart,
  MessageCircle,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Users,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface InstagramProfileProps {
  username: string;
}

// Fake data for demo
const generateFakeProfile = (username: string) => ({
  username,
  fullName: username.charAt(0).toUpperCase() + username.slice(1) + " Official",
  bio: "🌟 Content Creator | 📸 Photographer\n✨ Living my best life\n📍 Vietnam",
  profilePicUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
  followersCount: Math.floor(Math.random() * 1000000) + 10000,
  followingCount: Math.floor(Math.random() * 1000) + 100,
  postsCount: Math.floor(Math.random() * 500) + 50,
  isVerified: Math.random() > 0.7,
  isPrivate: false,
  externalUrl: "https://example.com",
  posts: Array.from({ length: 12 }, (_, i) => ({
    id: `post-${i}`,
    imageUrl: `https://picsum.photos/seed/${username}-${i}/400/400`,
    likes: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 500),
    isVideo: Math.random() > 0.8,
  })),
});

export function InstagramProfile({ username }: InstagramProfileProps) {
  const [profile, setProfile] = useState<ReturnType<typeof generateFakeProfile> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProfile(generateFakeProfile(username));
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [username]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Không tìm thấy profile</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Back button */}
      <Link
        href="/instagram"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-8 mb-10"
      >
        {/* Avatar */}
        <div className="flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-full blur opacity-75" />
            <Avatar className="relative h-32 w-32 md:h-40 md:w-40 border-4 border-background">
              <AvatarImage src={profile.profilePicUrl} alt={profile.username} />
              <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <h1 className="text-2xl font-semibold flex items-center justify-center md:justify-start gap-2">
              @{profile.username}
              {profile.isVerified && (
                <Badge className="bg-blue-500 text-white">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </Badge>
              )}
            </h1>
            <div className="flex gap-2 justify-center md:justify-start">
              <Button size="sm" variant="outline" className="rounded-full" asChild>
                <a
                  href={`https://instagram.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Mở Instagram
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold">{formatNumber(profile.postsCount)}</p>
              <p className="text-sm text-muted-foreground">Bài viết</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{formatNumber(profile.followersCount)}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{formatNumber(profile.followingCount)}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <p className="font-semibold">{profile.fullName}</p>
            <p className="text-sm whitespace-pre-line">{profile.bio}</p>
            {profile.externalUrl && (
              <a
                href={profile.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline"
              >
                <LinkIcon className="h-3 w-3" />
                {profile.externalUrl}
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-center border-b border-border bg-transparent p-0 mb-6">
          <TabsTrigger
            value="posts"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-6 py-3"
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Bài viết</span>
          </TabsTrigger>
          <TabsTrigger
            value="reels"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-6 py-3"
          >
            <PlayCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Reels</span>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-6 py-3"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-1 md:gap-4"
          >
            {profile.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-md"
              >
                <img
                  src={post.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                {post.isVideo && (
                  <div className="absolute top-2 right-2">
                    <PlayCircle className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="flex items-center gap-1">
                    <Heart className="h-5 w-5 fill-white" />
                    {formatNumber(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5 fill-white" />
                    {formatNumber(post.comments)}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="reels">
          <div className="text-center py-20 text-muted-foreground">
            <PlayCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Reels sẽ được hỗ trợ sớm</p>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-20 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Không thể xem bài viết đã lưu của người dùng khác</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Skeleton className="h-6 w-24 mb-8" />
      
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <Skeleton className="h-40 w-40 rounded-full mx-auto md:mx-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
          <div className="flex gap-8 justify-center md:justify-start">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-12 w-20" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}
