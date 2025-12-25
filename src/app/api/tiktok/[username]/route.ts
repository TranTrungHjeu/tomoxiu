import { NextRequest, NextResponse } from "next/server";
import { scrapeTikTokProfile } from "@/lib/scrapers/tiktok";
import type { ApiResponse, TikTokProfile } from "@/types/social";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse<ApiResponse<TikTokProfile>>> {
  try {
    const { username } = await params;

    if (!username || username.length < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Username is required",
        },
        { status: 400 }
      );
    }

    const profile = await scrapeTikTokProfile(username);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: "Profile not found",
          message: "Không tìm thấy profile TikTok",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("TikTok API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profile",
        message: "Có lỗi xảy ra khi lấy thông tin profile",
      },
      { status: 500 }
    );
  }
}
