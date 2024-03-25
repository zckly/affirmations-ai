import { api } from "~/trpc/server";
import Dashboard from "./_components/Dashboard";

export const runtime = "edge";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  const posts = api.post.all();

  return (
    <main className="flex h-screen flex-col items-center">
      <Dashboard posts={posts} />
    </main>
  );
}
