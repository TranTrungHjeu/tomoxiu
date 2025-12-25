import { httpClient, sanitizeUsername } from "@/lib/scraper-utils";
import type { TikTokProfile, TikTokVideo, TikTokStory } from "@/types/social";

// TikWM API - Free TikTok API service
const TIKWM_API_BASE = "https://www.tikwm.com/api";

export async function scrapeTikTokProfile(
  username: string
): Promise<TikTokProfile | null> {
  const cleanUsername = sanitizeUsername(username);

  try {
    // Method 1: Use TikWM API (most reliable)
    const profile = await fetchFromTikWM(cleanUsername);
    if (profile) return profile;

    // Method 2: Fallback to web scraping
    return await scrapeFromWeb(cleanUsername);
  } catch (error) {
    console.error("TikTok scraping error:", error);
    return null;
  }
}

async function fetchFromTikWM(username: string): Promise<TikTokProfile | null> {
  try {
    // Get user info from TikWM API
    const response = await httpClient.get(`${TIKWM_API_BASE}/user/info`, {
      params: { unique_id: username },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const data = response.data as TikWMUserResponse;

    if (data.code !== 0 || !data.data?.user) {
      console.log("TikWM API error:", data.msg);
      return null;
    }

    const { user, stats } = data.data;

    // Try to get posts (may fail due to rate limiting)
    let videos: TikTokVideo[] = [];
    let stories: TikTokStory[] = [];

    try {
      videos = await fetchVideosFromTikWM(user.secUid);
    } catch {
      // Videos fetch failed, continue without them
      console.log("Could not fetch videos from TikWM");
    }

    // Try to get stories
    try {
      stories = await fetchStoriesFromTikWM(username);
    } catch {
      console.log("Could not fetch stories from TikWM");
    }

    return {
      username: user.uniqueId || username,
      nickname: user.nickname || username,
      bio: user.signature || "",
      profilePicUrl:
        user.avatarLarger || user.avatarMedium || user.avatarThumb || "",
      followersCount: stats.followerCount || 0,
      followingCount: stats.followingCount || 0,
      likesCount: stats.heartCount || stats.heart || 0,
      videoCount: stats.videoCount || 0,
      isVerified: user.verified || false,
      videos,
      stories,
      reposts: [], // TikWM API doesn't support reposts yet
    };
  } catch (error) {
    console.error("TikWM API error:", error);
    return null;
  }
}

async function fetchVideosFromTikWM(secUid: string): Promise<TikTokVideo[]> {
  try {
    const response = await httpClient.get(`${TIKWM_API_BASE}/user/posts`, {
      params: { sec_uid: secUid, count: 12 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const data = response.data as TikWMPostsResponse;

    if (data.code !== 0 || !data.data?.videos) {
      return [];
    }

    return data.data.videos.map((video) => ({
      id: video.video_id || "",
      description: video.title || "",
      coverUrl: video.cover || video.origin_cover || "",
      videoUrl: video.play || "",
      likes: video.digg_count || 0,
      comments: video.comment_count || 0,
      shares: video.share_count || 0,
      views: video.play_count || 0,
      timestamp: video.create_time,
    }));
  } catch {
    return [];
  }
}

async function fetchStoriesFromTikWM(username: string): Promise<TikTokStory[]> {
  try {
    const response = await httpClient.get(`${TIKWM_API_BASE}/user/story`, {
      params: { unique_id: username },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const data = response.data as TikWMStoryResponse;

    if (data.code !== 0 || !data.data?.videos) {
      return [];
    }

    return data.data.videos.map((story) => {
      const hasImages = story.images && story.images.length > 0;
      const isPhoto = hasImages || story.duration === 0;

      return {
        id: story.video_id || "",
        coverUrl: story.cover || story.origin_cover || "",
        videoUrl: isPhoto ? undefined : story.play || "",
        images: hasImages ? story.images : undefined,
        duration: story.duration || 0,
        timestamp: story.create_time || 0,
        isPhoto,
        musicUrl: story.music || story.music_info?.play || undefined,
        musicTitle: story.music_info?.title || undefined,
      };
    });
  } catch {
    return [];
  }
}

async function scrapeFromWeb(username: string): Promise<TikTokProfile | null> {
  try {
    const response = await httpClient.get(
      `https://www.tiktok.com/@${username}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
      }
    );

    const html = response.data as string;

    // Try to extract from __UNIVERSAL_DATA_FOR_REHYDRATION__
    const universalMatch = html.match(
      /<script[^>]*id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
    );

    if (universalMatch) {
      try {
        const data = JSON.parse(universalMatch[1]);
        const defaultScope = data?.__DEFAULT_SCOPE__;
        const userDetail = defaultScope?.["webapp.user-detail"];

        if (userDetail?.userInfo) {
          const { user, stats } = userDetail.userInfo;

          return {
            username: user?.uniqueId || username,
            nickname: user?.nickname || username,
            bio: user?.signature || "",
            profilePicUrl: user?.avatarLarger || user?.avatarMedium || "",
            followersCount: stats?.followerCount || 0,
            followingCount: stats?.followingCount || 0,
            likesCount: stats?.heartCount || 0,
            videoCount: stats?.videoCount || 0,
            isVerified: user?.verified || false,
            videos: [],
            stories: [],
            reposts: [],
          };
        }
      } catch {
        // JSON parse failed
      }
    }

    // Extract from meta tags as last resort
    return extractFromMetaTags(html, username);
  } catch {
    return null;
  }
}

function extractFromMetaTags(
  html: string,
  username: string
): TikTokProfile | null {
  try {
    // Extract OG meta tags using regex
    const ogDescription =
      html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"/);
    const ogImage =
      html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/);
    const ogTitle =
      html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/);

    const description = ogDescription?.[1] || "";
    const image = ogImage?.[1] || "";
    const title = ogTitle?.[1] || "";

    // Parse stats from description
    // Format: "XXX Followers, XXX Following, XXX Likes"
    const statsMatch = description.match(
      /([0-9,.]+[KMB]?)\s*Followers?,?\s*([0-9,.]+[KMB]?)\s*Following,?\s*([0-9,.]+[KMB]?)\s*Likes?/i
    );

    // Extract nickname from title
    let nickname = username;
    const nicknameMatch = title.match(/^(.+?)\s*\(@/);
    if (nicknameMatch) {
      nickname = nicknameMatch[1].trim();
    }

    if (image || statsMatch) {
      return {
        username,
        nickname,
        bio: "",
        profilePicUrl: image,
        followersCount: statsMatch ? parseStatNumber(statsMatch[1]) : 0,
        followingCount: statsMatch ? parseStatNumber(statsMatch[2]) : 0,
        likesCount: statsMatch ? parseStatNumber(statsMatch[3]) : 0,
        videoCount: 0,
        isVerified: html.includes('"verified":true'),
        videos: [],
        stories: [],
        reposts: [],
      };
    }

    return null;
  } catch {
    return null;
  }
}

function parseStatNumber(str: string): number {
  if (!str) return 0;

  const cleanStr = str.replace(/,/g, "").toUpperCase();
  const multipliers: Record<string, number> = {
    K: 1000,
    M: 1000000,
    B: 1000000000,
  };

  for (const [suffix, multiplier] of Object.entries(multipliers)) {
    if (cleanStr.endsWith(suffix)) {
      return parseFloat(cleanStr.replace(suffix, "")) * multiplier;
    }
  }

  return parseInt(cleanStr, 10) || 0;
}

// Type definitions for TikWM API responses
interface TikWMUserResponse {
  code: number;
  msg: string;
  data: {
    user: {
      id: string;
      uniqueId: string;
      nickname: string;
      avatarThumb: string;
      avatarMedium: string;
      avatarLarger: string;
      signature: string;
      verified: boolean;
      secUid: string;
      privateAccount: boolean;
    };
    stats: {
      followingCount: number;
      followerCount: number;
      heartCount: number;
      heart: number;
      videoCount: number;
    };
  };
}

interface TikWMPostsResponse {
  code: number;
  msg: string;
  data: {
    videos: Array<{
      video_id: string;
      title: string;
      cover: string;
      origin_cover: string;
      play: string;
      digg_count: number;
      comment_count: number;
      share_count: number;
      play_count: number;
      create_time: number;
    }>;
  };
}

interface TikWMStoryResponse {
  code: number;
  msg: string;
  data: {
    videos: Array<{
      video_id: string;
      cover: string;
      origin_cover: string;
      play: string;
      duration: number;
      create_time: number;
      images?: string[];
      music?: string;
      music_info?: {
        id: string;
        title: string;
        play: string;
        cover: string;
        author: string;
        duration: number;
      };
    }>;
    cursor: string;
    hasMore: boolean;
  };
}
