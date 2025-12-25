import { TikTokProfile } from "@/components/tiktok/profile";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `@${username} - TikTok Profile`,
  };
}

export default async function TikTokProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <TikTokProfile username={username} />;
}
