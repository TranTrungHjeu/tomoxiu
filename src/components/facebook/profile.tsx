"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Facebook,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  AlertCircle,
  Users,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import type { FacebookProfile as IFacebookProfile } from "@/types/social";

interface FacebookProfileProps {
  username: string;
}

export function FacebookProfile({ username }: FacebookProfileProps) {
  const [profile, setProfile] = useState<IFacebookProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/facebook/${encodeURIComponent(username)}`
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
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Link
          href="/facebook"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không thể tải profile</AlertTitle>
          <AlertDescription>
            {error ||
              "Không tìm thấy profile Facebook hoặc profile ở chế độ riêng tư"}
          </AlertDescription>
        </Alert>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Facebook có bảo mật cao. Một số profile có thể không truy cập được.
          </p>
          <Button asChild>
            <Link href="/facebook">Tìm kiếm lại</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Back button */}
      <Link
        href="/facebook"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      {/* Cover Photo */}
      {profile.coverPhotoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6 bg-muted"
        >
          <Image
            src={profile.coverPhotoUrl}
            alt="Cover"
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>
      )}

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8"
      >
        {/* Avatar */}
        <div className="relative -mt-16 md:-mt-20">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
            <AvatarImage src={profile.profilePicUrl} alt={profile.name} />
            <AvatarFallback>{profile.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            {profile.isVerified && (
              <Badge className="bg-blue-500 text-white w-fit mx-auto md:mx-0">
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

          {profile.category && (
            <p className="text-sm text-muted-foreground mb-2">
              {profile.category}
            </p>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
            {profile.followersCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {formatNumber(profile.followersCount)} followers
              </span>
            )}
            {profile.friendsCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {formatNumber(profile.friendsCount)} friends
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
            )}
          </div>

          {profile.bio && (
            <p className="text-sm whitespace-pre-line mb-4">{profile.bio}</p>
          )}

          <Button variant="outline" className="rounded-full" asChild>
            <a
              href={`https://facebook.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Mở Facebook
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Posts */}
      {profile.posts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Bài viết gần đây</h2>
          {profile.posts.map((post, index) => (
            <motion.div
              key={post.id}
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
                        alt={profile.name}
                      />
                      <AvatarFallback>
                        {profile.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{profile.name}</p>

                      {post.content && (
                        <p className="text-sm whitespace-pre-line my-3">
                          {post.content}
                        </p>
                      )}

                      {post.imageUrl && (
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                          <Image
                            src={post.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1 text-sm">
                          <Heart className="h-4 w-4" />
                          {formatNumber(post.likes)}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <MessageCircle className="h-4 w-4" />
                          {formatNumber(post.comments)}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Share2 className="h-4 w-4" />
                          {formatNumber(post.shares)}
                        </span>
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
          <Facebook className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Không có bài viết công khai</p>
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Skeleton className="h-6 w-24 mb-8" />
      <Skeleton className="h-64 w-full rounded-xl mb-6" />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <Skeleton className="h-40 w-40 rounded-full -mt-20" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
