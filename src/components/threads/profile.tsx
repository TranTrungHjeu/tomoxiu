"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  AtSign,
  Heart,
  MessageCircle,
  Repeat2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import type { ThreadsProfile as IThreadsProfile } from "@/types/social";

interface ThreadsProfileProps {
  username: string;
}

export function ThreadsProfile({ username }: ThreadsProfileProps) {
  const [profile, setProfile] = useState<IThreadsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/threads/${encodeURIComponent(username)}`
        );
        const data = await response.json();

        if (data.success && data.data) {
          setProfile(data.data);
        } else {
          setError(data.message || "Không tìm thấy profile");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Có lỗi xảy ra khi tải profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Link
          href="/threads"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không thể tải profile</AlertTitle>
          <AlertDescription>
            {error || "Không tìm thấy profile Threads"}
          </AlertDescription>
        </Alert>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Hãy thử lại hoặc kiểm tra tên người dùng
          </p>
          <Button asChild>
            <Link href="/threads">Tìm kiếm lại</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Back button */}
      <Link
        href="/threads"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 mb-8"
      >
        {/* Avatar */}
        <Avatar className="h-20 w-20 md:h-24 md:w-24">
          <AvatarImage src={profile.profilePicUrl} alt={profile.username} />
          <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold">{profile.fullName}</h1>
            {profile.isVerified && (
              <Badge className="bg-foreground text-background">
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mb-2">@{profile.username}</p>

          {profile.bio && (
            <p className="text-sm whitespace-pre-line mb-3">{profile.bio}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{formatNumber(profile.followersCount)} followers</span>
          </div>
        </div>
      </motion.div>

      {/* Open Threads button */}
      <Button variant="outline" className="w-full mb-8" asChild>
        <a
          href={`https://threads.net/@${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AtSign className="h-4 w-4 mr-2" />
          Mở trên Threads
          <ExternalLink className="h-3 w-3 ml-2" />
        </a>
      </Button>

      {/* Threads */}
      {profile.threads.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {profile.threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={profile.profilePicUrl}
                        alt={profile.username}
                      />
                      <AvatarFallback>
                        {profile.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {profile.username}
                        </span>
                        {profile.isVerified && (
                          <svg
                            className="h-4 w-4 text-foreground"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-line mb-3">
                        {thread.content}
                      </p>

                      {thread.imageUrl && (
                        <div className="relative max-h-80 w-full overflow-hidden rounded-lg mb-3">
                          <Image
                            src={thread.imageUrl}
                            alt=""
                            width={400}
                            height={320}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">
                            {formatNumber(thread.likes)}
                          </span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">
                            {formatNumber(thread.replies)}
                          </span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                          <Repeat2 className="h-4 w-4" />
                          <span className="text-sm">
                            {formatNumber(thread.reposts)}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <AtSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Không có threads nào</p>
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Skeleton className="h-6 w-24 mb-8" />

      <div className="flex items-start gap-4 mb-8">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-full mb-8" />

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
