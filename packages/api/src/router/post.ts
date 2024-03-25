import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { desc, eq, schema } from "@acme/db";
import { CreatePostSchema } from "@acme/validators";

import { generateAffirmation } from "../ai/anthropic";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.post.findMany({
      with: { author: true },
      orderBy: desc(schema.post.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.post.findFirst({
        with: { author: true },
        where: eq(schema.post.id, input.id),
      });
    }),

  create: publicProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      // Get role from input and generate an affirmation

      console.log(input.title);
      const { title, affirmations } = await generateAffirmation({
        role: input.title,
      });
      // change to speech
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://affirmations-ai.vercel.app"}/api/speech`,
        {
          method: "POST",
          body: JSON.stringify({ lines: affirmations }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Something went wrong with the speech synthesis");
      }

      const { paths } = (await response.json()) as {
        paths: string[];
      };

      console.log({ paths });

      function getNameFromUser() {
        const meta = ctx.user?.user_metadata;
        if (meta && typeof meta.name === "string") return meta.name;
        if (meta && typeof meta.full_name === "string") return meta.full_name;
        if (meta && typeof meta.user_name === "string") return meta.user_name;
        return "Anonymous";
      }

      const authorId = await ctx.db.query.profile
        .findFirst({
          where: eq(schema.profile.id, ctx.user?.id ?? ""),
        })
        .then(async (profile) => {
          if (profile) return profile.id;
          const [newProfile] = await ctx.db
            .insert(schema.profile)
            .values({
              id: ctx.user?.id ?? "",
              name: getNameFromUser(),
              image: ctx.user?.user_metadata.avatar_url as string | undefined,
              email: ctx.user?.email,
            })
            .returning();

          return newProfile!.id;
        });

      const inserted = await ctx.db
        .insert(schema.post)
        .values({
          id: nanoid(),
          authorId: authorId ?? "",
          title,
          content: affirmations.join("\n"),
          audioPaths: paths.join("\n"),
        })
        .returning();

      if (inserted.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Something went wrong with inserting the post",
        });
      }

      console.log({ inserted });

      return inserted[0]?.id ?? "";
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.post.findFirst({
        where: eq(schema.post.id, input),
      });

      if (post?.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the author is allowed to delete the post",
        });
      }

      return ctx.db.delete(schema.post).where(eq(schema.post.id, input));
    }),
});
