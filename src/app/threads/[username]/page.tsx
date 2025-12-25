import { ComingSoon } from "@/components/coming-soon";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `@${username} - Threads Profile | Stalker`,
  };
}

export default async function ThreadsProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <ComingSoon platform="Threads" username={username} />;
}
