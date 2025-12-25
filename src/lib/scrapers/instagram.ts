import * as cheerio from "cheerio";
import { httpClient, parseCount, sanitizeUsername } from "@/lib/scraper-utils";
import type { InstagramProfile, InstagramPost } from "@/types/social";

const INSTAGRAM_BASE_URL = "https://www.instagram.com";

interface InstagramGraphQL {
  user?: {
    id: string;
    username: string;
    full_name: string;
    biography: string;
    profile_pic_url: string;
    profile_pic_url_hd?: string;
    edge_followed_by?: { count: number };
    edge_follow?: { count: number };
    edge_owner_to_timeline_media?: {
      count: number;
      edges: Array<{
        node: {
          id: string;
          shortcode: string;
          display_url: string;
          thumbnail_src?: string;
          edge_liked_by?: { count: number };
          edge_media_to_comment?: { count: number };
          is_video: boolean;
          video_url?: string;
          edge_media_to_caption?: {
            edges: Array<{ node: { text: string } }>;
          };
          taken_at_timestamp?: number;
        };
      }>;
    };
    is_verified: boolean;
    is_private: boolean;
    external_url?: string;
    category_name?: string;
  };
}

export async function scrapeInstagramProfile(
  username: string
): Promise<InstagramProfile | null> {
  const cleanUsername = sanitizeUsername(username);

  try {
    // Method 1: Try the web page
    const response = await httpClient.get(
      `${INSTAGRAM_BASE_URL}/${cleanUsername}/`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"iOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
        },
      }
    );

    const html = response.data as string;

    // Try to extract data from script tags
    let profileData = await extractFromSharedData(html);

    if (!profileData) {
      profileData = await extractFromAdditionalData(html);
    }

    if (!profileData) {
      profileData = await extractFromMetaTags(html, cleanUsername);
    }

    return profileData;
  } catch (error) {
    console.error("Instagram scraping error:", error);

    // Fallback: Try i.instagram.com API
    try {
      return await scrapeFromMobileApi(cleanUsername);
    } catch {
      return null;
    }
  }
}

async function extractFromSharedData(
  html: string
): Promise<InstagramProfile | null> {
  try {
    // Look for window._sharedData
    const sharedDataMatch = html.match(
      /window\._sharedData\s*=\s*({.+?});<\/script>/
    );
    if (sharedDataMatch) {
      const data = JSON.parse(sharedDataMatch[1]);
      const user = data?.entry_data?.ProfilePage?.[0]?.graphql?.user;
      if (user) {
        return parseGraphQLUser(user);
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function extractFromAdditionalData(
  html: string
): Promise<InstagramProfile | null> {
  try {
    // Look for __additionalDataLoaded
    const additionalMatch = html.match(
      /__additionalDataLoaded\s*\([^,]+,\s*({.+?})\s*\);/
    );
    if (additionalMatch) {
      const data = JSON.parse(additionalMatch[1]);
      const user = data?.graphql?.user || data?.user;
      if (user) {
        return parseGraphQLUser(user);
      }
    }

    // Look for require("PolarisQueryPreloader")
    const preloaderMatch = html.match(
      /PolarisQueryPreloader[\s\S]*?profilePage[\s\S]*?({[\s\S]*?user[\s\S]*?})/
    );
    if (preloaderMatch) {
      try {
        const jsonStr = preloaderMatch[1].replace(/\\"/g, '"');
        const data = JSON.parse(jsonStr);
        if (data?.user) {
          return parseGraphQLUser(data.user);
        }
      } catch {}
    }

    return null;
  } catch {
    return null;
  }
}

async function extractFromMetaTags(
  html: string,
  username: string
): Promise<InstagramProfile | null> {
  try {
    const $ = cheerio.load(html);

    // Extract from meta tags
    const description =
      $('meta[property="og:description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const title = $('meta[property="og:title"]').attr("content") || "";

    // Parse followers, following, posts from description
    // Format: "1.5M Followers, 100 Following, 500 Posts - description"
    const statsMatch = description.match(
      /([0-9,.]+[KMB]?)\s*Followers?,?\s*([0-9,.]+[KMB]?)\s*Following,?\s*([0-9,.]+[KMB]?)\s*Posts?/i
    );

    if (statsMatch || image) {
      const followersCount = statsMatch ? parseCount(statsMatch[1]) : 0;
      const followingCount = statsMatch ? parseCount(statsMatch[2]) : 0;
      const postsCount = statsMatch ? parseCount(statsMatch[3]) : 0;

      // Extract name from title (format: "Name (@username)")
      const nameMatch = title.match(/^(.+?)\s*\(@/);
      const fullName = nameMatch ? nameMatch[1].trim() : username;

      // Extract bio (after the stats)
      const bioMatch = description.match(/Posts?\s*[-–—]\s*(.+)/i);
      const bio = bioMatch ? bioMatch[1].trim() : "";

      return {
        username,
        fullName,
        bio,
        profilePicUrl: image,
        profilePicUrlHD: image,
        followersCount,
        followingCount,
        postsCount,
        isVerified: html.includes("is_verified") && html.includes(":true"),
        isPrivate: html.includes('"is_private":true'),
        externalUrl: undefined,
        posts: [],
      };
    }

    return null;
  } catch {
    return null;
  }
}

async function scrapeFromMobileApi(
  username: string
): Promise<InstagramProfile | null> {
  try {
    // Try i.instagram.com (mobile web)
    const response = await httpClient.get(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        headers: {
          "User-Agent": "Instagram 219.0.0.12.117 Android",
          "X-IG-App-ID": "936619743392459",
        },
      }
    );

    const user = response.data?.data?.user;
    if (user) {
      return {
        username: user.username,
        fullName: user.full_name || username,
        bio: user.biography || "",
        profilePicUrl: user.profile_pic_url,
        profilePicUrlHD: user.profile_pic_url_hd || user.profile_pic_url,
        followersCount: user.edge_followed_by?.count || 0,
        followingCount: user.edge_follow?.count || 0,
        postsCount: user.edge_owner_to_timeline_media?.count || 0,
        isVerified: user.is_verified || false,
        isPrivate: user.is_private || false,
        externalUrl: user.external_url,
        category: user.category_name,
        posts: parseGraphQLPosts(
          user.edge_owner_to_timeline_media?.edges || []
        ),
      };
    }

    return null;
  } catch {
    return null;
  }
}

function parseGraphQLUser(
  user: InstagramGraphQL["user"]
): InstagramProfile | null {
  if (!user) return null;

  return {
    username: user.username,
    fullName: user.full_name || user.username,
    bio: user.biography || "",
    profilePicUrl: user.profile_pic_url,
    profilePicUrlHD: user.profile_pic_url_hd || user.profile_pic_url,
    followersCount: user.edge_followed_by?.count || 0,
    followingCount: user.edge_follow?.count || 0,
    postsCount: user.edge_owner_to_timeline_media?.count || 0,
    isVerified: user.is_verified || false,
    isPrivate: user.is_private || false,
    externalUrl: user.external_url,
    category: user.category_name,
    posts: parseGraphQLPosts(user.edge_owner_to_timeline_media?.edges || []),
  };
}

interface GraphQLEdge {
  node: {
    id: string;
    shortcode: string;
    display_url: string;
    thumbnail_src?: string;
    edge_liked_by?: { count: number };
    edge_media_to_comment?: { count: number };
    is_video: boolean;
    video_url?: string;
    edge_media_to_caption?: {
      edges: Array<{ node: { text: string } }>;
    };
    taken_at_timestamp?: number;
  };
}

function parseGraphQLPosts(edges: GraphQLEdge[]): InstagramPost[] {
  return edges.slice(0, 12).map((edge) => ({
    id: edge.node.id,
    shortcode: edge.node.shortcode,
    imageUrl: edge.node.display_url,
    thumbnailUrl: edge.node.thumbnail_src,
    likes: edge.node.edge_liked_by?.count || 0,
    comments: edge.node.edge_media_to_comment?.count || 0,
    isVideo: edge.node.is_video,
    videoUrl: edge.node.video_url,
    caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text,
    timestamp: edge.node.taken_at_timestamp,
  }));
}
