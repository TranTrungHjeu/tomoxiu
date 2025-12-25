import { FacebookProfile } from "@/components/facebook/profile";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `${username} - Facebook Profile`,
  };
}

export default async function FacebookProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <FacebookProfile username={username} />;
}
