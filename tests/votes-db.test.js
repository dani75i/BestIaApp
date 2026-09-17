import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { tools } from "../src/data/tools.js";

test("PostgreSQL protège les votes et préserve les données lors des mises à jour", async (t) => {
  const db = new PGlite();
  const sql = await readFile(
    new URL("../supabase/setup.sql", import.meta.url),
    "utf8",
  );
  const first = "11111111-1111-4111-8111-111111111111";
  const second = "22222222-2222-4222-8222-222222222222";
  const actor = async (id) => {
    await db.exec("reset role; set role authenticated;");
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [
      id,
    ]);
  };
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create schema auth;
      create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
    `);
    await db.exec(sql);

    await t.test(
      "le catalogue SQL correspond au catalogue de l’application",
      async () => {
        const { rows } = await db.query(
          "select id from public.rating_tools order by id",
        );
        assert.deepEqual(
          rows.map((row) => row.id),
          tools.map((tool) => tool.id).sort(),
        );
      },
    );
    await t.test(
      "un visiteur public voit les moyennes mais pas les votes individuels",
      async () => {
        await db.exec("set role anon");
        assert.deepEqual(
          (await db.query("select * from public.get_tool_ratings()")).rows,
          [],
        );
        await assert.rejects(db.query("select * from public.tool_votes"), {
          code: "42501",
        });
        await assert.rejects(
          db.query(
            "insert into public.tool_votes(tool_id, rating) values ('chatgpt', 5)",
          ),
          { code: "42501" },
        );
      },
    );
    await t.test(
      "deux visiteurs contribuent à une même moyenne sans votes en double",
      async () => {
        await actor(first);
        await db.query(
          "insert into public.tool_votes(tool_id,user_id,rating) values ('chatgpt',$1,3)",
          [first],
        );
        await db.query(
          "insert into public.tool_votes(tool_id,user_id,rating) values ('chatgpt',$1,4) on conflict (tool_id,user_id) do update set rating=excluded.rating",
          [first],
        );
        await actor(second);
        await db.query(
          "insert into public.tool_votes(tool_id,user_id,rating) values ('chatgpt',$1,5)",
          [second],
        );
        const { rows } = await db.query(
          "select * from public.get_tool_ratings()",
        );
        assert.equal(Number(rows[0].average_rating), 4.5);
        assert.equal(Number(rows[0].vote_count), 2);
      },
    );
    await t.test(
      "un visiteur ne peut ni lire ni modifier ni supprimer les votes des autres",
      async () => {
        await actor(second);
        assert.equal(
          (await db.query("select * from public.tool_votes")).rows.length,
          1,
        );
        assert.equal(
          (
            await db.query(
              "update public.tool_votes set rating=1 where user_id=$1 returning tool_id",
              [first],
            )
          ).rows.length,
          0,
        );
        assert.equal(
          (
            await db.query(
              "delete from public.tool_votes where user_id=$1 returning tool_id",
              [first],
            )
          ).rows.length,
          0,
        );
        await assert.rejects(
          db.query(
            "insert into public.tool_votes(tool_id,user_id,rating) values ('claude',$1,1)",
            [first],
          ),
          { code: "42501" },
        );
        await assert.rejects(
          db.query("update public.tool_votes set user_id=$1", [first]),
          { code: "42501" },
        );
      },
    );
    await t.test(
      "les notes hors limites et outils inconnus sont refusés côté base",
      async () => {
        await actor(second);
        await assert.rejects(
          db.query("update public.tool_votes set rating=6"),
          { code: "23514" },
        );
        await assert.rejects(
          db.query(
            "insert into public.tool_votes(tool_id,rating) values ('outil-inconnu',5)",
          ),
          { code: "23503" },
        );
        await assert.rejects(
          db.query(
            "insert into public.rating_tools(id) values ('outil-pirate')",
          ),
          { code: "42501" },
        );
      },
    );
    await t.test(
      "réexécuter l’installation conserve les votes existants",
      async () => {
        await db.exec("reset role");
        await db.exec(sql);
        assert.equal(
          Number(
            (await db.query("select * from public.get_tool_ratings()")).rows[0]
              .vote_count,
          ),
          2,
        );
      },
    );
    await t.test("supprimer son propre vote recalcule la moyenne", async () => {
      await actor(second);
      await db.query("delete from public.tool_votes where tool_id='chatgpt'");
      const { rows } = await db.query(
        "select * from public.get_tool_ratings()",
      );
      assert.equal(Number(rows[0].average_rating), 4);
      assert.equal(Number(rows[0].vote_count), 1);
    });
  } finally {
    await db.close();
  }
});
