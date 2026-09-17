-- BestIA : retours prives, a executer dans SQL Editor (role postgres).
-- Aucun retour existant n'est efface si ce script est relance.
begin;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category text not null check (category in ('suggestion', 'problem', 'general')),
  message text not null check (char_length(btrim(message)) between 10 and 3000),
  email text check (email is null or (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')),
  page_path text not null check (char_length(page_path) <= 300 and page_path like '/%'),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists feedback_user_created_idx on public.feedback(user_id, created_at desc);
alter table public.feedback enable row level security;
-- Les visiteurs n'ont aucun acces direct, meme a leurs propres messages.
revoke all on public.feedback from public, anon, authenticated;

create or replace function public.submit_feedback(
  p_category text, p_message text, p_email text, p_page_path text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;
  -- Serialise les envois d'une identite pour eviter de contourner la limite
  -- avec des requetes simultanees.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text, 0));
  if exists (
    select 1 from public.feedback
    where user_id = v_user and created_at > now() - interval '1 minute'
  ) or (
    select count(*) from public.feedback
    where user_id = v_user and created_at > now() - interval '24 hours'
  ) >= 5 then
    raise exception 'feedback_rate_limit' using errcode = 'P0001';
  end if;
  insert into public.feedback(user_id, category, message, email, page_path)
  values(v_user, p_category, btrim(p_message), nullif(btrim(p_email), ''), p_page_path);
end;
$$;

revoke all on function public.submit_feedback(text, text, text, text) from public;
grant execute on function public.submit_feedback(text, text, text, text) to authenticated;

commit;
