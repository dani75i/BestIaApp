-- BestIA : installation initiale des votes partages.
-- A executer dans Supabase > SQL Editor avec le role postgres.
-- Peut etre relance sans effacer les votes existants.
begin;

create table if not exists public.rating_tools (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

insert into public.rating_tools (id) values
  ('chatgpt'), ('claude'), ('gemini'), ('perplexity'), ('mistral-vibe'),
  ('github-copilot'), ('cursor'), ('bolt'), ('lovable'), ('jasper'),
  ('deepseek'), ('grammarly'), ('notion-ai'), ('midjourney'), ('adobe-firefly'),
  ('leonardo'), ('ideogram'), ('canva'), ('runway'), ('pika'),
  ('synthesia'), ('heygen'), ('descript'), ('suno'), ('udio'), ('aiva'),
  ('soundraw'), ('gamma'), ('beautiful-ai'), ('presentations-ai')
on conflict (id) do nothing;

create table if not exists public.tool_votes (
  tool_id text not null references public.rating_tools(id),
  user_id uuid not null default auth.uid(),
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (tool_id, user_id)
);

create index if not exists tool_votes_user_id_idx on public.tool_votes(user_id);

alter table public.rating_tools enable row level security;
alter table public.tool_votes enable row level security;

revoke all on public.rating_tools from public, anon, authenticated;
revoke all on public.tool_votes from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.rating_tools to anon, authenticated;
grant select, delete on public.tool_votes to authenticated;
grant insert (tool_id, user_id, rating) on public.tool_votes to authenticated;
grant update (tool_id, user_id, rating) on public.tool_votes to authenticated;

drop policy if exists bestia_tools_read on public.rating_tools;
create policy bestia_tools_read on public.rating_tools
  for select to anon, authenticated using (true);

drop policy if exists bestia_votes_read_own on public.tool_votes;
create policy bestia_votes_read_own on public.tool_votes
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists bestia_votes_insert_own on public.tool_votes;
create policy bestia_votes_insert_own on public.tool_votes
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists bestia_votes_update_own on public.tool_votes;
create policy bestia_votes_update_own on public.tool_votes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists bestia_votes_delete_own on public.tool_votes;
create policy bestia_votes_delete_own on public.tool_votes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Seuls la moyenne et le nombre de votes sont accessibles publiquement.
-- Aucun identifiant de visiteur ne sort de cette fonction.
create or replace function public.get_tool_ratings()
returns table (tool_id text, average_rating numeric, vote_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select v.tool_id, round(avg(v.rating)::numeric, 1), count(*)
  from public.tool_votes as v
  group by v.tool_id;
$$;

revoke all on function public.get_tool_ratings() from public;
grant execute on function public.get_tool_ratings() to anon, authenticated;

commit;
