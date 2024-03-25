import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { profile } from "./profile";

export const post = pgTable("post", {
  id: varchar("id", { length: 256 }).primaryKey(),
  title: varchar("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  audioPaths: text("audio_paths").notNull(),
  authorId: varchar("author_id", { length: 256 }).references(() => profile.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const postRelations = relations(post, ({ one }) => ({
  author: one(profile, { fields: [post.authorId], references: [profile.id] }),
}));
