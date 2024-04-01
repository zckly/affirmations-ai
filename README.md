# affirmations AI

## About

generating affirmations with AI

mobile support is being worked on
## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```diff
# Install dependencies
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Prisma schema to your database
# Can't run with Turbo as we need an interactive shell (see below why)
# Consequent runs you may simply do `pnpm db:push` from root.
pnpm -F db db:push
```

> When running the last command, `pnpm -F db db:push`, you'll get a warning for adding a unique constraint on the `schema-migrations` model. This is because Supabase doesn't include this by default, but Prisma requires each model to have at least one unique column. You can safely accept this warning and add the unique constraint on the table.

### Setting up Supabase

1. Go to [the Supabase dashboard](https://app.supabase.com/projects) and create a new project.
2. Under project settings, retrieve the environment variables `reference id`, `project url` & `anon public key` and paste them into [.env](./.env.example) and [apps/expo/.env](./apps/expo/.env.example) in the necessary places. You'll also need the database password you set when creating the project.
3. Under `Auth`, configure any auth provider(s) of your choice. This repo is using Github for Web and Apple for Mobile.

By default, Supabase exposes the `public` schema to the PostgREST API to allow the `supabase-js` client query the database directly from the client. However, since we route all our requests through the Next.js application (through tRPC), we don't want our client to have this access. To disable this, execute the following SQL query in the SQL Editor on your Supabase dashboard:

```sql
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;
```

![disable public access](https://user-images.githubusercontent.com/51714798/231810706-88b1db82-0cfd-485f-9043-ef12a53dc62f.png)

> Note: This means you also don't need to enable row-level security (RLS) on your database if you don't want to.

