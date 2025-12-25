import { NextRequest, NextResponse } from "next/server";
import { scrapeInstagramProfile } from "@/lib/scrapers/instagram";
import type { ApiResponse, InstagramProfile } from "@/types/social";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse<ApiResponse<InstagramProfile>>> {
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

    const profile = await scrapeInstagramProfile(username);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: "Profile not found or is private",
          message: "Không tìm thấy profile hoặc tài khoản ở chế độ riêng tư",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Instagram API error:", error);
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
