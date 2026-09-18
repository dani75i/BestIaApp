-- Ajouter les 10 nouveaux outils sans modifier les votes existants.
-- A executer dans Supabase > SQL Editor > Run.
begin;
insert into public.rating_tools (id) values
  ('deepl'), ('elevenlabs'), ('fireflies'), ('fathom'), ('notebooklm'),
  ('photoroom'), ('remove-bg'), ('adobe-podcast'), ('microsoft-copilot'), ('quillbot')
on conflict (id) do nothing;
commit;
