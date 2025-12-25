import * as cheerio from "cheerio";
import { httpClient, parseCount, sanitizeUsername } from "@/lib/scraper-utils";
import type { FacebookProfile, FacebookPost } from "@/types/social";

const FACEBOOK_BASE_URL = "https://www.facebook.com";
const FACEBOOK_MOBILE_URL = "https://m.facebook.com";

export async function scrapeFacebookProfile(
  username: string
): Promise<FacebookProfile | null> {
  const cleanUsername = sanitizeUsername(username);

  try {
    // Try mobile Facebook first (less JS-heavy)
    const response = await httpClient.get(
      `${FACEBOOK_MOBILE_URL}/${cleanUsername}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    const html = response.data as string;

    // Try multiple extraction methods
    let profileData = extractFromMobileHtml(html, cleanUsername);

    if (!profileData) {
      // Try desktop version
      profileData = await scrapeDesktopFacebook(cleanUsername);
    }

    if (!profileData) {
      profileData = extractFromMetaTags(html, cleanUsername);
    }

    return profileData;
  } catch (error) {
    console.error("Facebook scraping error:", error);
    return null;
  }
}

function extractFromMobileHtml(
  html: string,
  username: string
): FacebookProfile | null {
  try {
    const $ = cheerio.load(html);

    // Mobile Facebook structure
    const name =
      $("title")
        .text()
        .replace(/\s*\|.*$/, "")
        .trim() || $("h1").first().text().trim();

    const profilePic =
      $('img[alt*="profile"]').attr("src") ||
      $("img.profpic").attr("src") ||
      $("img[data-src]").first().attr("data-src") ||
      "";

    const bio = $('div[data-sigil="timeline-cover-intro"]').text().trim();

    // Try to find follower count
    const pageText = $.text();
    const followersMatch = pageText.match(
      /([0-9,.]+[KMB]?)\s*(?:people follow this|followers?)/i
    );
    const friendsMatch = pageText.match(/([0-9,.]+[KMB]?)\s*friends?/i);

    if (name && name !== "Facebook") {
      return {
        username,
        name,
        bio,
        profilePicUrl: profilePic,
        coverPhotoUrl: $('img[data-sigil="cover-photo"]').attr("src"),
        followersCount: followersMatch
          ? parseCount(followersMatch[1])
          : undefined,
        friendsCount: friendsMatch ? parseCount(friendsMatch[1]) : undefined,
        isVerified: html.includes("verified") || html.includes("Verified"),
        posts: extractMobilePosts($),
      };
    }

    return null;
  } catch {
    return null;
  }
}

async function scrapeDesktopFacebook(
  username: string
): Promise<FacebookProfile | null> {
  try {
    const response = await httpClient.get(`${FACEBOOK_BASE_URL}/${username}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "datr=; sb=;", // Empty cookies to avoid login wall
      },
      maxRedirects: 5,
    });

    const html = response.data as string;
    const $ = cheerio.load(html);

    // Extract from structured data
    const ldJson = $('script[type="application/ld+json"]').html();
    if (ldJson) {
      try {
        const data = JSON.parse(ldJson);
        if (data["@type"] === "Person" || data["@type"] === "Organization") {
          return {
            username,
            name: data.name || username,
            bio: data.description || "",
            profilePicUrl: data.image?.url || data.image || "",
            isVerified: false,
            posts: [],
          };
        }
      } catch {}
    }

    // Fallback to meta tags
    return extractFromMetaTags(html, username);
  } catch {
    return null;
  }
}

function extractFromMetaTags(
  html: string,
  username: string
): FacebookProfile | null {
  try {
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr("content") || "";
    const description =
      $('meta[property="og:description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";

    if (title && title !== "Facebook") {
      // Parse followers from description
      const followersMatch = description.match(
        /([0-9,.]+[KMB]?)\s*(?:like|follow)/i
      );

      return {
        username,
        name: title,
        bio: description,
        profilePicUrl: image,
        followersCount: followersMatch
          ? parseCount(followersMatch[1])
          : undefined,
        isVerified:
          html.includes('"is_verified":true') || html.includes("verified-icon"),
        posts: [],
      };
    }

    return null;
  } catch {
    return null;
  }
}

function extractMobilePosts($: cheerio.CheerioAPI): FacebookPost[] {
  const posts: FacebookPost[] = [];

  try {
    // Mobile Facebook posts structure
    $('article, div[data-sigil="story-div"]')
      .slice(0, 6)
      .each((_, el) => {
        const $el = $(el);
        const content = $el.find('div[data-sigil="story-body"]').text().trim();
        const imageUrl = $el.find("img").first().attr("src");

        // Try to extract reaction count
        const reactionsText = $el
          .find('[data-sigil="reactions-sentence-container"]')
          .text();
        const likesMatch = reactionsText.match(/([0-9,.]+[KMB]?)/);

        const commentsText = $el.find('a[href*="comment"]').text();
        const commentsMatch = commentsText.match(/([0-9,.]+[KMB]?)/);

        const sharesText = $el.find('a[href*="share"]').text();
        const sharesMatch = sharesText.match(/([0-9,.]+[KMB]?)/);

        if (content || imageUrl) {
          posts.push({
            id: `post-${posts.length}`,
            content: content.slice(0, 500),
            imageUrl,
            likes: likesMatch ? parseCount(likesMatch[1]) : 0,
            comments: commentsMatch ? parseCount(commentsMatch[1]) : 0,
            shares: sharesMatch ? parseCount(sharesMatch[1]) : 0,
          });
        }
      });
  } catch {
    // Ignore errors in post extraction
  }

  return posts;
}
