import { handleChatRoute } from "./src/routes/chat";
import { landingPageHtml } from "./src/routes/landing";
import { router } from "./src/lib/router";
import { ensureDatabaseReady } from "./src/db/init";

import "./src/routes/api/users";
import "./src/routes/api/conversations";
import "./src/routes/api/messages";

await ensureDatabaseReady();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();

    console.log(
      `[http][${requestId}] -> ${req.method} ${url.pathname}${url.search}`,
    );

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method === "GET" && url.pathname === "/health") {
      console.log(`[http][${requestId}] <- 200 /health`);
      return Response.json({ status: "ok" });
    }

    if (req.method === "GET" && url.pathname === "/") {
      console.log(`[http][${requestId}] <- 200 /`);
      return new Response(landingPageHtml, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    if (req.method === "POST" && url.pathname === "/chat") {
      const response = await handleChatRoute(req, requestId);
      console.log(
        `[http][${requestId}] <- ${response.status} /chat (${Date.now() - startedAt}ms)`,
      );
      return response;
    }

    const matched = router.match(req.method, url.pathname);
    if (matched) {
      try {
        const response = await matched.handler(req, matched.params);
        const corsResponse = new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            ...CORS_HEADERS,
          },
        });
        console.log(
          `[http][${requestId}] <- ${response.status} ${url.pathname} (${Date.now() - startedAt}ms)`,
        );
        return corsResponse;
      } catch (err) {
        console.error(`[http][${requestId}] Error:`, err);
        return Response.json(
          { error: "Error interno del servidor" },
          { status: 500, headers: CORS_HEADERS },
        );
      }
    }

    console.log(`[http][${requestId}] <- 404 ${url.pathname}`);
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`API escuchando en http://localhost:${server.port}`);
