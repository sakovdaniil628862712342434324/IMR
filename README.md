# IMR (Internet Movies Rental) Company
Portal to view and update the IMR movie database. By Daniil Sakov & Deema Lashtabeha.

> **Stack:** Next.js 14 (Pages Router) + React + Supabase (Auth + Postgres).

## What it does
- Movies list: title, actors, release year.
- Sign up / log in (Supabase Auth).
- **Admin** (first account created): add, edit, delete movies.
- **User** (later accounts): view only.
- Validation on title, actors, and year before any insert or update.
- Static navbar + footer with company contact info.

## Database (Supabase)
1. Create a project at [supabase.com](https://supabase.com).
2. Authentication → Providers → Email: turn **off** “Confirm email” (otherwise signup cannot log in until a mail link).
3. SQL Editor → paste and run `sql/schema.sql` (tables, RLS, trigger, sample movies).
4. Settings → API → copy Project URL and anon public key.

> Tables: `profiles`, `movies`.

## Run
Create `.env.local` in this folder:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key 
```

Run:

```
npm install
npm run dev
```

Open http://localhost:3000

> Note: First person to **Sign up** becomes admin. Everyone after is a regular user. Promote someone in SQL:

```
update public.profiles set role = 'admin' where email = 'them@example.com';
```

Demo logins:

- Admin: `admin@imr.movies` / `adminadmin`
- User: `user@imr.movies` / `useruser`

## Deploy (GitHub Pages)
GitHub Pages has no Node server. The Action runs `next build` (`output: "export"`) and publishes `out/`.

1. Upload the repo.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. In Supabase: **Authentication → URL Configuration** → Site URL and Redirect URLs = that Pages URL (and `http://localhost:3000` for local).