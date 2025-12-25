import * as cheerio from "cheerio";
import { httpClient, parseCount, sanitizeUsername } from "@/lib/scraper-utils";
import type { ThreadsProfile, ThreadsPost } from "@/types/social";

const THREADS_BASE_URL = "https://www.threads.net";

export async function scrapeThreadsProfile(
  username: string
): Promise<ThreadsProfile | null> {
  const cleanUsername = sanitizeUsername(username);

  try {
    const response = await httpClient.get(
      `${THREADS_BASE_URL}/@${cleanUsername}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
        },
      }
    );

    const html = response.data as string;

    // Try multiple extraction methods
    let profileData = extractFromLoomState(html);

    if (!profileData) {
      profileData = extractFromMetaTags(html, cleanUsername);
    }

    return profileData;
  } catch (error) {
    console.error("Threads scraping error:", error);
    return null;
  }
}

function extractFromLoomState(html: string): ThreadsProfile | null {
  try {
    // Look for __lsd or data in script tags
    const dataMatch = html.match(
      /data-sjs>\s*({[\s\S]*?"user"[\s\S]*?})\s*<\/script>/
    );

    if (dataMatch) {
      const data = JSON.parse(dataMatch[1]);
      // Navigate to find user data
      const user = findUserInData(data);
      if (user) {
        return parseThreadsUser(user);
      }
    }

    // Alternative: Look for require("ServerJS")
    const serverJsMatch = html.match(
      /require\("ServerJS"\)[\s\S]*?({[\s\S]*?userData[\s\S]*?})/
    );
    if (serverJsMatch) {
      try {
        const data = JSON.parse(serverJsMatch[1]);
        const user = findUserInData(data);
        if (user) {
          return parseThreadsUser(user);
        }
      } catch {}
    }

    return null;
  } catch {
    return null;
  }
}

function findUserInData(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;

  const obj = data as Record<string, unknown>;

  // Check if this object has user properties
  if (obj.username && (obj.full_name || obj.biography || obj.profile_pic_url)) {
    return obj;
  }

  // Recursively search
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null) {
      const found = findUserInData(value);
      if (found) return found;
    }
  }

  return null;
}

function extractFromMetaTags(
  html: string,
  username: string
): ThreadsProfile | null {
  try {
    const $ = cheerio.load(html);

    const description =
      $('meta[property="og:description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const title = $('meta[property="og:title"]').attr("content") || "";

    // Parse followers from description
    // Format: "XXX followers"
    const followersMatch = description.match(/([0-9,.]+[KMB]?)\s*followers?/i);

    if (image || followersMatch) {
      // Extract name from title
      const nameMatch = title.match(/^(.+?)\s*\(@/);
      const fullName = nameMatch ? nameMatch[1].trim() : username;

      return {
        username,
        fullName,
        bio: "",
        profilePicUrl: image,
        followersCount: followersMatch ? parseCount(followersMatch[1]) : 0,
        isVerified:
          html.includes('"is_verified":true') || html.includes("verified"),
        threads: [],
      };
    }

    return null;
  } catch {
    return null;
  }
}

function parseThreadsUser(user: Record<string, unknown>): ThreadsProfile {
  return {
    username: (user.username as string) || "",
    fullName: (user.full_name as string) || (user.username as string) || "",
    bio: (user.biography as string) || (user.bio as string) || "",
    profilePicUrl:
      (user.profile_pic_url as string) ||
      (user.hd_profile_pic_url as string) ||
      "",
    followersCount: (user.follower_count as number) || 0,
    isVerified: (user.is_verified as boolean) || false,
    threads: parseThreadsPosts((user.threads as unknown[]) || []),
  };
}

function parseThreadsPosts(items: unknown[]): ThreadsPost[] {
  try {
    return items.slice(0, 12).map((item) => {
      const post = item as {
        id?: string;
        caption?: { text?: string };
        text_post_app_info?: { link_preview_attachment?: { url?: string } };
        like_count?: number;
        reply_count?: number;
        repost_count?: number;
        taken_at?: number;
        image_versions2?: { candidates?: Array<{ url: string }> };
      };

      return {
        id: post.id || "",
        content: post.caption?.text || "",
        imageUrl: post.image_versions2?.candidates?.[0]?.url,
        likes: post.like_count || 0,
        replies: post.reply_count || 0,
        reposts: post.repost_count || 0,
        timestamp: post.taken_at,
      };
    });
  } catch {
    return [];
  }
}
