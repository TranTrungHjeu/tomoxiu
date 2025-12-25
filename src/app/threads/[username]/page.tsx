import { ThreadsProfile } from "@/components/threads/profile";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `@${username} - Threads Profile`,
  };
}

export default async function ThreadsProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <ThreadsProfile username={username} />;
}
