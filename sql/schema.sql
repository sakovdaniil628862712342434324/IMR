/*
Author: Daniil Sakov
Inputs are a new Supabase project (empty public schema plus auth.users).
Processing creates profiles and movies, enables RLS, adds is_admin(), a trigger that inserts a profile on signup (first user is admin), and four sample movies.
Outputs are two tables ready for the Next.js app: authenticated users can read movies; only role admin can insert, update, or delete.
Run this once in the Supabase SQL Editor. Re-running drops the trigger/function names if you drop tables first.
*/

create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	email text,
	full_name text not null default '',
	role text not null default 'user' check (role in ('user', 'admin'))
);

create table if not exists public.movies (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	actors text[] not null default '{}',
	release_year int not null,
	created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.movies enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
	select count(*) into n from public.profiles;
	insert into public.profiles (id, email, full_name, role)
	values (
		new.id,
		new.email,
		coalesce(new.raw_user_meta_data->>'full_name', ''),
		case when n = 0 then 'admin' else 'user' end
	);
	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
	after insert on auth.users
	for each row execute procedure public.handle_new_user();

drop policy if exists "profiles select" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
drop policy if exists "movies select" on public.movies;
drop policy if exists "movies insert admin" on public.movies;
drop policy if exists "movies update admin" on public.movies;
drop policy if exists "movies delete admin" on public.movies;

create policy "profiles select" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "movies select" on public.movies for select to authenticated using (true);
create policy "movies insert admin" on public.movies for insert to authenticated with check (public.is_admin());
create policy "movies update admin" on public.movies for update to authenticated using (public.is_admin());
create policy "movies delete admin" on public.movies for delete to authenticated using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.movies to authenticated;
grant execute on function public.is_admin() to authenticated;

insert into public.movies (title, actors, release_year)
select * from (values
	('The Matrix', array['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss']::text[], 1999),
	('Inception', array['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Marion Cotillard']::text[], 2010),
	('Spirited Away', array['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki']::text[], 2001),
	('The Godfather', array['Marlon Brando', 'Al Pacino', 'James Caan']::text[], 1972)
) as s(title, actors, release_year)
where not exists (select 1 from public.movies limit 1);
