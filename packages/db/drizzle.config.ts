import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  driver: "pg",
  dbCredentials: { connectionString: process.env.POSTGRES_URL! },
} satisfies Config;
