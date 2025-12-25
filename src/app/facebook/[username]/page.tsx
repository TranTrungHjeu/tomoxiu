import { ComingSoon } from "@/components/coming-soon";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `${username} - Facebook Profile | Stalker`,
  };
}

export default async function FacebookProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <ComingSoon platform="Facebook" username={username} />;
}
