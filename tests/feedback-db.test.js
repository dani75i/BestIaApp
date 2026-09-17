import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("les retours restent privés et les envois répétitifs sont limités", async () => {
  const db = new PGlite();
  const sql = await readFile(
    new URL("../supabase/feedback.sql", import.meta.url),
    "utf8",
  );
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema public, auth to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;`);
    await db.exec(sql);
    await db.exec("set role anon");
    await assert.rejects(db.query("select * from public.feedback"), {
      code: "42501",
    });
    await assert.rejects(
      db.query(
        "select public.submit_feedback('general','Un retour public valide',null,'/')",
      ),
      { code: "42501" },
    );
    await db.exec(
      "reset role; set role authenticated; select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111', false)",
    );
    await assert.rejects(
      db.query("select public.submit_feedback('general','court',null,'/')"),
      { code: "23514" },
    );
    await assert.rejects(
      db.query(
        "select public.submit_feedback('general','Un message suffisamment long','invalide','/')",
      ),
      { code: "23514" },
    );
    await db.query(
      "select public.submit_feedback('suggestion','Ajouter davantage de filtres','visiteur@example.com','/outil/claude')",
    );
    await assert.rejects(db.query("select * from public.feedback"), {
      code: "42501",
    });
    await assert.rejects(db.query("update public.feedback set status='done'"), {
      code: "42501",
    });
    await assert.rejects(db.query("delete from public.feedback"), {
      code: "42501",
    });
    await assert.rejects(
      db.query(
        "select public.submit_feedback('general','Un deuxième retour immédiatement',null,'/')",
      ),
      /feedback_rate_limit/,
    );
    await db.exec("reset role");
    const row = (await db.query("select * from public.feedback")).rows[0];
    assert.equal(row.category, "suggestion");
    assert.equal(row.email, "visiteur@example.com");
    assert.equal(row.status, "new");
    // A later installation must leave existing feedback intact.
    await db.exec(sql);
    assert.equal(
      (await db.query("select * from public.feedback")).rows.length,
      1,
    );
    await db.exec(
      "update public.feedback set created_at=now()-interval '2 minutes'",
    );
    await db.exec("set role authenticated");
    await db.query(
      "select public.submit_feedback('problem','Le filtre ne fonctionne pas',null,'/')",
    );
    await db.exec("reset role");
    assert.equal(
      (await db.query("select * from public.feedback")).rows.length,
      2,
    );
  } finally {
    await db.close();
  }
});
