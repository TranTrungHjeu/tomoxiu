"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Music2,
  Heart,
  MessageCircle,
  Play,
  ExternalLink,
  AlertCircle,
  Eye,
  Pause,
  Volume2,
  VolumeX,
  X,
  Download,
  Share2,
  Repeat2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type {
  TikTokProfile as ITikTokProfile,
  TikTokVideo,
  TikTokStory,
} from "@/types/social";

interface TikTokProfileProps {
  username: string;
}

export function TikTokProfile({ username }: TikTokProfileProps) {
  const [profile, setProfile] = useState<ITikTokProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<TikTokVideo | null>(null);
  const [selectedStory, setSelectedStory] = useState<TikTokStory | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"videos" | "reposts">("videos");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/tiktok/${encodeURIComponent(username)}`
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
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Link
          href="/tiktok"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không thể tải profile</AlertTitle>
          <AlertDescription>
            {error || "Không tìm thấy profile TikTok"}
          </AlertDescription>
        </Alert>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Hãy thử lại hoặc kiểm tra tên người dùng
          </p>
          <Button asChild>
            <Link href="/tiktok">Tìm kiếm lại</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Back button */}
      <Link
        href="/tiktok"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-10"
      >
        {/* Avatar with Story Ring */}
        <div className="relative mb-4">
          <div
            className={`absolute -inset-1 rounded-full blur opacity-75 ${
              profile.stories && profile.stories.length > 0
                ? "bg-linear-to-br from-pink-500 via-red-500 to-yellow-500 animate-pulse"
                : "bg-linear-to-br from-pink-500 via-purple-500 to-cyan-500"
            }`}
          />
          <div
            className={`relative ${
              profile.stories && profile.stories.length > 0
                ? "cursor-pointer"
                : ""
            }`}
            onClick={() => {
              if (profile.stories && profile.stories.length > 0) {
                setStoryIndex(0);
                setSelectedStory(profile.stories[0]);
              }
            }}
          >
            {profile.stories && profile.stories.length > 0 && (
              <div className="absolute -inset-1 rounded-full border-2 border-pink-500 animate-pulse" />
            )}
            <Avatar className="relative h-32 w-32 md:h-40 md:w-40 border-4 border-background">
              <AvatarImage src={profile.profilePicUrl} alt={profile.username} />
              <AvatarFallback>
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          {profile.stories && profile.stories.length > 0 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {profile.stories.length} Story
            </div>
          )}
        </div>

        {/* Username */}
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-semibold">@{profile.username}</h1>
          {profile.isVerified && (
            <Badge className="bg-cyan-500 text-white">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </Badge>
          )}
        </div>

        {/* Nickname */}
        <p className="text-lg text-muted-foreground mb-4">{profile.nickname}</p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-xl font-bold">
              {formatNumber(profile.followingCount)}
            </p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">
              {formatNumber(profile.followersCount)}
            </p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">
              {formatNumber(profile.likesCount)}
            </p>
            <p className="text-sm text-muted-foreground">Likes</p>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm whitespace-pre-line max-w-md mb-6">
            {profile.bio}
          </p>
        )}

        {/* Open TikTok button */}
        <Button variant="outline" className="rounded-full" asChild>
          <a
            href={`https://tiktok.com/@${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Music2 className="h-4 w-4 mr-2" />
            Mở TikTok
            <ExternalLink className="h-3 w-3 ml-2" />
          </a>
        </Button>
      </motion.div>

      {/* Stories Section */}
      {profile.stories && profile.stories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Play className="h-5 w-5 text-pink-500" />
            Stories ({profile.stories.length})
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 px-2 -mx-2 scrollbar-hide">
            {profile.stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setStoryIndex(index);
                  setSelectedStory(story);
                }}
                className="shrink-0 cursor-pointer group"
              >
                <div className="relative p-1">
                  <div className="absolute inset-0 bg-linear-to-br from-pink-500 via-red-500 to-yellow-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-24 h-40 rounded-lg overflow-hidden bg-muted border-2 border-background">
                    {story.coverUrl ? (
                      <Image
                        src={story.coverUrl}
                        alt={`Story ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-500 to-purple-600">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {formatTimeAgo(story.timestamp)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs for Videos and Reposts */}
      <div className="mb-4 flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === "videos"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Play className="h-4 w-4" />
          Videos ({profile.videoCount})
          {activeTab === "videos" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("reposts")}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === "reposts"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Repeat2 className="h-4 w-4" />
          Reposts ({profile.reposts?.length || 0})
          {activeTab === "reposts" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
          )}
        </button>
      </div>

      {/* Videos Tab */}
      {activeTab === "videos" && (
        <>
          {profile.videos.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {profile.videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index}
                  username={profile.username}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-8">
              <Alert className="max-w-lg mx-auto mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Videos không khả dụng</AlertTitle>
                <AlertDescription>
                  Không thể tải danh sách video. Hãy thử lại sau hoặc xem trực tiếp
                  trên TikTok.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button asChild size="lg">
                  <a
                    href={`https://tiktok.com/@${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Music2 className="h-4 w-4 mr-2" />
                    Xem trên TikTok
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reposts Tab */}
      {activeTab === "reposts" && (
        <>
          {profile.reposts && profile.reposts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {profile.reposts.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index}
                  username={profile.username}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-8">
              <Alert className="max-w-lg mx-auto mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Reposts chưa khả dụng</AlertTitle>
                <AlertDescription>
                  Tính năng xem reposts đang được phát triển. Hãy xem trực tiếp trên TikTok.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button asChild size="lg">
                  <a
                    href={`https://tiktok.com/@${profile.username}?tab=reposts`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Repeat2 className="h-4 w-4 mr-2" />
                    Xem Reposts trên TikTok
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          username={profile.username}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Story Player Modal */}
      {selectedStory && profile.stories && (
        <StoryPlayerModal
          story={selectedStory}
          stories={profile.stories}
          currentIndex={storyIndex}
          username={profile.username}
          onClose={() => setSelectedStory(null)}
          onNext={() => {
            if (storyIndex < profile.stories!.length - 1) {
              setStoryIndex(storyIndex + 1);
              setSelectedStory(profile.stories![storyIndex + 1]);
            } else {
              setSelectedStory(null);
            }
          }}
          onPrev={() => {
            if (storyIndex > 0) {
              setStoryIndex(storyIndex - 1);
              setSelectedStory(profile.stories![storyIndex - 1]);
            }
          }}
        />
      )}
    </div>
  );
}

// Video Card Component
interface VideoCardProps {
  video: TikTokVideo;
  index: number;
  username: string;
  onClick: () => void;
}

function VideoCard({ video, index, onClick }: VideoCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="relative aspect-9/16 group cursor-pointer overflow-hidden rounded-lg bg-muted"
    >
      {video.coverUrl && (
        <Image
          src={video.coverUrl}
          alt=""
          fill
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

      {/* Play icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-14 w-14 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
          <Play className="h-7 w-7 text-white fill-white" />
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {formatNumber(video.likes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {formatNumber(video.comments)}
          </span>
        </div>
        {video.views > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Eye className="h-3 w-3" />
            {formatNumber(video.views)} views
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Video Player Modal Component
interface VideoPlayerModalProps {
  video: TikTokVideo;
  username: string;
  onClose: () => void;
}

function VideoPlayerModal({ video, username, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  useEffect(() => {
    // Auto play when modal opens
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
        setIsPlaying(false);
      });
    }

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(prog);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleDownload = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Video Container */}
        <div className="relative aspect-9/16 rounded-xl overflow-hidden bg-black">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain"
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              poster={video.coverUrl}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Video không khả dụng</p>
            </div>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && video.videoUrl && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Play className="h-10 w-10 text-white fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {video.videoUrl && (
            <div
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {video.videoUrl && (
              <>
                <button
                  onClick={toggleMute}
                  className="h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <Download className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-4 text-white">
          <p className="text-sm line-clamp-2 mb-3">{video.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {formatNumber(video.likes)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {formatNumber(video.comments)}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                {formatNumber(video.shares)}
              </span>
            </div>

            <a
              href={`https://tiktok.com/@${username}/video/${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-white flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              TikTok
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Skeleton className="h-6 w-24 mb-8" />

      <div className="flex flex-col items-center mb-10">
        <Skeleton className="h-40 w-40 rounded-full mb-4" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex gap-8">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-9/16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Format time ago for stories
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000; // Convert to milliseconds

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return "Hơn 1 ngày trước";
}

// Story Player Modal Component
interface StoryPlayerModalProps {
  story: TikTokStory;
  stories: TikTokStory[];
  currentIndex: number;
  username: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function StoryPlayerModal({
  story,
  stories,
  currentIndex,
  username,
  onClose,
  onNext,
  onPrev,
}: StoryPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const photoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const imageIndexRef = useRef(0);

  // For photo stories with music - play audio
  useEffect(() => {
    if (story.isPhoto && story.musicUrl && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked
      });
    }
  }, [story]);

  // For photo stories - auto advance with timer
  useEffect(() => {
    if (story.isPhoto) {
      // Reset refs
      progressRef.current = 0;
      imageIndexRef.current = 0;
      
      const imageCount = story.images?.length || 1;
      const durationPerImage = 5000; // 5 seconds per image
      const updateInterval = 50; // Update every 50ms
      
      let elapsed = 0;
      const totalDuration = durationPerImage * imageCount;
      
      photoTimerRef.current = setInterval(() => {
        elapsed += updateInterval;
        const newProgress = (elapsed / totalDuration) * 100;
        
        // Only update state when value changes significantly
        if (Math.abs(newProgress - progressRef.current) > 1) {
          progressRef.current = newProgress;
          setProgress(newProgress);
        }
        
        // Update current image index
        const newImageIndex = Math.min(
          Math.floor(elapsed / durationPerImage),
          imageCount - 1
        );
        if (newImageIndex !== imageIndexRef.current) {
          imageIndexRef.current = newImageIndex;
          setCurrentImageIndex(newImageIndex);
        }
        
        if (elapsed >= totalDuration) {
          onNext();
        }
      }, updateInterval);
      
      return () => {
        if (photoTimerRef.current) {
          clearInterval(photoTimerRef.current);
        }
      };
    }
  }, [story, onNext]);

  // For video stories
  useEffect(() => {
    if (story.isPhoto) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
    };

    const handleEnded = () => {
      onNext();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // Auto play
    video.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [story, onNext]);

  const togglePlay = useCallback(() => {
    if (story.isPhoto) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [story.isPhoto, isPlaying]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    // Mute video if exists
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
    // Mute audio for photo stories with music
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case " ":
          e.preventDefault();
          togglePlay();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, togglePlay]);

  const handleDownload = async () => {
    try {
      let downloadUrl: string;
      let filename: string;
      
      if (story.isPhoto && story.images && story.images.length > 0) {
        downloadUrl = story.images[currentImageIndex] || story.coverUrl;
        filename = `tiktok_story_${username}_${story.id}_${currentImageIndex + 1}.jpg`;
      } else if (story.videoUrl) {
        downloadUrl = story.videoUrl;
        filename = `tiktok_story_${username}_${story.id}.mp4`;
      } else {
        return;
      }
      
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      const fallbackUrl = story.isPhoto 
        ? (story.images?.[currentImageIndex] || story.coverUrl)
        : story.videoUrl;
      if (fallbackUrl) window.open(fallbackUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md h-[85vh] max-h-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Story Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-100 ${
                  index < currentIndex
                    ? "w-full"
                    : index === currentIndex
                    ? ""
                    : "w-0"
                }`}
                style={{
                  width:
                    index === currentIndex
                      ? `${progress}%`
                      : index < currentIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-sm">
              @{username}
            </span>
            <span className="text-white/60 text-xs">
              {formatTimeAgo(story.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(!story.isPhoto || story.musicUrl) && (
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-white" />
                ) : (
                  <Volume2 className="h-5 w-5 text-white" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Audio for photo stories with music */}
        {story.isPhoto && story.musicUrl && (
          <audio
            ref={audioRef}
            src={story.musicUrl}
            autoPlay
            loop
            muted={isMuted}
            className="hidden"
          />
        )}

        {/* Music info badge */}
        {story.isPhoto && story.musicTitle && (
          <div className="absolute bottom-24 left-4 z-20 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
            <Music2 className="h-4 w-4 text-white animate-pulse" />
            <span className="text-white text-xs truncate max-w-40">
              {story.musicTitle}
            </span>
          </div>
        )}

        {/* Photo Story */}
        {story.isPhoto && story.images && story.images.length > 0 && (
          <div className="w-full h-full flex items-center justify-center bg-black rounded-2xl overflow-hidden">
            <Image
              src={story.images[currentImageIndex] || story.coverUrl}
              alt={`Story photo ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
            {story.images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1">
                {story.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Story */}
        {!story.isPhoto && story.videoUrl && (
          <>
            <video
              ref={videoRef}
              src={story.videoUrl}
              className="w-full h-full object-contain bg-black rounded-2xl"
              playsInline
              autoPlay
              muted={isMuted}
              onClick={togglePlay}
            />

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-20 w-20 rounded-full bg-black/50 flex items-center justify-center">
                  <Pause className="h-10 w-10 text-white" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation Areas */}
        <div
          className="absolute left-0 top-1/4 bottom-1/4 w-1/3 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        />
        <div
          className="absolute right-0 top-1/4 bottom-1/4 w-1/3 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        />

        {/* Download Button */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors"
          >
            <Download className="h-4 w-4" />
            Tải Story
          </button>
        </div>
      </div>
    </motion.div>
  );
}
