import { ComingSoon } from "@/components/coming-soon";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `@${username} - TikTok Profile | Stalker`,
  };
}

export default async function TikTokProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <ComingSoon platform="TikTok" username={username} />;
}
