import { InstagramProfile } from "@/components/instagram/profile";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `@${username} - Instagram Profile | Stalker`,
    description: `Xem profile Instagram công khai của @${username}`,
  };
}

export default async function InstagramProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <InstagramProfile username={username} />;
}
