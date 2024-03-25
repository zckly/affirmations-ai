"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { RouterOutputs } from "@acme/api";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export function CreatePostForm() {
  const utils = api.useUtils();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("test");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: createPost, error } = api.post.create.useMutation({
    async onSuccess() {
      setTitle("");
      await utils.post.all.invalidate();
    },
  });

  return (
    <>
      <form
        className="z-50 flex w-full max-w-xl flex-col"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            setIsLoading(true);
            const newPostId = await createPost({
              title,
              content,
            });
            setTitle("");
            setContent("");
            router.push(`/session/${newPostId}`);

            await utils.post.all.invalidate();
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <Label htmlFor="role" className="pb-2 font-semibold">
          What you do
        </Label>
        <div className="flex w-full flex-row gap-2">
          <input
            id="role"
            className="mb-2 grow rounded border-2 border-gray-500 bg-gray-50 p-2 text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button
            disabled={isLoading || !title}
            type="submit"
            size="lg"
            className="h-11 px-4 font-bold"
          >
            {isLoading ? "..." : "=>"}
          </Button>
        </div>
        <Label className="mt-4 pb-2 font-semibold">Examples</Label>
        <div className="flex w-full flex-row flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("Software engineer at a big tech company");
            }}
          >
            Software engineer in big tech
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("Deep tech venture capitalist");
            }}
          >
            Deep tech venture capitalist
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("Freelance web designer for a clueless client");
            }}
          >
            Freelance web designer
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("Dentist");
            }}
          >
            Dentist
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("Registered nurse");
            }}
          >
            Registered nurse
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("Science teacher at a public middle school");
            }}
          >
            Middle school teacher
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("High school student");
            }}
          >
            High school student
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-gray-700"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setTitle("Brooklyn-based creative director");
            }}
          >
            Creative director
          </Button>
        </div>

        {error?.data?.zodError?.fieldErrors.title && (
          <span className="mb-2 text-red-500">
            {error.data.zodError.fieldErrors.title}
          </span>
        )}

        {error?.data?.code === "UNAUTHORIZED" && (
          <span className="mt-2 text-red-500">
            You must be logged in to post
          </span>
        )}
      </form>
    </>
  );
}

export function PostList(props: {
  posts: Promise<RouterOutputs["post"]["all"]>;
}) {
  // TODO: Make `useSuspenseQuery` work without having to pass a promise from RSC
  const initialData = use(props.posts);
  const { data: posts } = api.post.all.useQuery(undefined, {
    initialData,
  });

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No posts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const { post } = props;

  return (
    <div className="flex min-h-[200px] cursor-pointer flex-row rounded-lg border bg-white/10 p-4 transition-all hover:animate-pulse">
      <Link
        href={`/session/${post.id}`}
        className="flex h-full w-full flex-grow flex-col items-center justify-center px-4 py-8 text-center"
      >
        <h2 className="text-lg font-medium">{post.title}</h2>
      </Link>
    </div>
  );
}
