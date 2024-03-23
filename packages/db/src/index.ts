import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as post from "./schema/post";
import * as profile from "./schema/profile";

export const schema = { ...post, ...profile };

export * from "drizzle-orm";

export const db = drizzle(sql, { schema });
