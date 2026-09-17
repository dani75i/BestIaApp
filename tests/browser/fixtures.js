import { test as base, expect } from "@playwright/test";

// Isolate every browser test from the production database, including auth.
export function createVotesBackend() {
  const votes = new Map();
  const users = new Map();
  let sequence = 0;
  const backend = {
    failReads: false,
    failWrites: false,
    feedback: [],
    feedbackError: null,
    async install(context) {
      await context.route(
        "https://ixsdrzjrubkxmikopkmx.supabase.co/**",
        async (route) => {
          const request = route.request();
          const url = new URL(request.url());
          const method = request.method();
          const token = request.headers().authorization?.replace("Bearer ", "");
          const session = users.get(token);
          const respond = (body, status = 200) =>
            route.fulfill({
              status,
              contentType: "application/json",
              body: JSON.stringify(body),
            });
          if (method === "OPTIONS") return respond({});
          if (url.pathname === "/auth/v1/signup") {
            sequence++;
            const id = `00000000-0000-4000-8000-${String(sequence).padStart(12, "0")}`;
            const expires = Math.floor(Date.now() / 1000) + 3600;
            const jwt = `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, role: "authenticated", exp: expires, is_anonymous: true })).toString("base64url")}.test`;
            const created = {
              access_token: jwt,
              token_type: "bearer",
              expires_in: 3600,
              expires_at: expires,
              refresh_token: `refresh-${id}`,
              user: {
                id,
                aud: "authenticated",
                role: "authenticated",
                is_anonymous: true,
                created_at: new Date().toISOString(),
                app_metadata: {},
                user_metadata: {},
              },
            };
            users.set(jwt, created);
            return respond(created);
          }
          if (url.pathname === "/auth/v1/token") {
            const existing = [...users.values()].find(
              (value) =>
                value.refresh_token === request.postDataJSON().refresh_token,
            );
            return respond(
              existing || { error: "invalid_grant" },
              existing ? 200 : 400,
            );
          }
          if (url.pathname === "/auth/v1/user")
            return respond(session?.user || {}, session ? 200 : 401);
          if (url.pathname === "/rest/v1/rpc/get_tool_ratings") {
            if (backend.failReads)
              return respond({ message: "Unavailable", code: "TEST" }, 503);
            const grouped = new Map();
            for (const vote of votes.values()) {
              const group = grouped.get(vote.tool_id) || [];
              group.push(vote.rating);
              grouped.set(vote.tool_id, group);
            }
            return respond(
              [...grouped].map(([tool_id, ratings]) => ({
                tool_id,
                average_rating:
                  ratings.reduce((a, b) => a + b, 0) / ratings.length,
                vote_count: ratings.length,
              })),
            );
          }
          if (url.pathname === "/rest/v1/rpc/submit_feedback") {
            if (!session) return respond({ message: "Unauthorized" }, 401);
            if (backend.feedbackError)
              return respond({ message: backend.feedbackError }, 400);
            if (backend.failWrites)
              return respond({ message: "Unavailable" }, 503);
            backend.feedback.push(request.postDataJSON());
            return respond(null);
          }
          if (url.pathname === "/rest/v1/tool_votes") {
            if (!session) return respond({ message: "Unauthorized" }, 401);
            if (method === "GET")
              return respond(
                [...votes.values()].filter(
                  (vote) => vote.user_id === session.user.id,
                ),
              );
            if (backend.failWrites)
              return respond({ message: "Unavailable" }, 503);
            if (method === "POST") {
              const data = request.postDataJSON();
              if (data.user_id !== session.user.id)
                return respond({ message: "Forbidden" }, 403);
              votes.set(`${data.tool_id}:${data.user_id}`, data);
              return respond({ tool_id: data.tool_id, rating: data.rating });
            }
            if (method === "DELETE") {
              votes.delete(
                `${url.searchParams.get("tool_id")?.replace("eq.", "")}:${session.user.id}`,
              );
              return respond(null);
            }
          }
          return respond(
            { message: `Unmocked endpoint ${method} ${url.pathname}` },
            500,
          );
        },
      );
    },
  };
  return backend;
}

export const test = base.extend({
  backend: [
    async ({ context }, use) => {
      const backend = createVotesBackend();
      await backend.install(context);
      await use(backend);
    },
    { auto: true },
  ],
});
export { expect };
