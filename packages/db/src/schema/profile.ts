import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { post } from "./post";

export const profile = pgTable("profile", {
    id: varchar("id", { length: 256 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    image: varchar("image", { length: 256 }),
    email: varchar("email", { length: 256 }),
  });
  
  export const profileRelations = relations(profile, ({ many }) => ({
    posts: many(post),
  }));
  