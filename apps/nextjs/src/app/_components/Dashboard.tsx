"use client";

import { Suspense } from "react";

import type { RouterOutputs } from "@acme/api";

import { Skeleton } from "~/components/ui/skeleton";
import Header from "./Header";
import { CreatePostForm, PostList } from "./posts";

export default function Dashboard({
  posts,
}: {
  posts: Promise<RouterOutputs["post"]["all"]>;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-2 mt-36 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="">affirmations ✨</span>
        </h1>
        <h3 className="mb-16 text-lg font-medium ">
          generate your perfect affirmation using AI
        </h3>
        <CreatePostForm />

        <div className="mt-36 w-full max-w-7xl">
          <Suspense
            fallback={
              <div className="grid w-full gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
              </div>
            }
          >
            <PostList posts={posts} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
