import "dotenv/config";
import { readFile } from "node:fs/promises";
import { handleChatRoute } from "./src/routes/chat";
import { landingPageHtml } from "./src/routes/landing";
import { router } from "./src/lib/router";
import { ensureDatabaseReady } from "./src/db/init";
import { getHistory, deleteHistory } from "./src/routes/api/history";
import { getProviderStatus } from "./src/routes/api/status";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Omnibrain-Format",
};

// 🚀 Inicializar Base de Datos
await ensureDatabaseReady();

// 🛣️ Registro de Rutas
router.get("/", async () => {
  return new Response(landingPageHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
});

router.get("/health", async () => Response.json({ status: "ok" }));

router.get("/favicon.ico", async () => {
  try {
    const data = await readFile("./favicon.png");
    return new Response(data, {
      headers: { "Content-Type": "image/png" },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
});

// Rutas Legacy (Compatibilidad)
router.get("/history", getHistory);
router.delete("/history", deleteHistory);
router.post("/chat", (req) => handleChatRoute(req));

// Rutas API v1
router.get("/v1/models", async () => {
  const now = Math.floor(Date.now() / 1000);

  const models = [
    // ─── Auto Routing ──────────────────────────────────────────────────────────
    { id: "auto", owned_by: "omnibrain", description: "Auto Global (4 providers fallback)" },
    { id: "auto:openrouter", owned_by: "omnibrain" },
    { id: "auto:groq", owned_by: "omnibrain" },
    { id: "auto:cerebras", owned_by: "omnibrain" },
    { id: "auto:zai", owned_by: "omnibrain" },

    // ─── Groq ──────────────────────────────────────────────────────────────────
    { id: "llama-4-scout-17b-16e-instruct", owned_by: "groq" },
    { id: "llama-3.3-70b-versatile", owned_by: "groq" },
    { id: "llama-3.1-8b-instant", owned_by: "groq" },
    { id: "openai/gpt-oss-120b", owned_by: "groq" },
    { id: "openai/gpt-oss-20b", owned_by: "groq" },
    { id: "qwen/qwen3-32b", owned_by: "groq" },
    { id: "moonshotai/kimi-k2-instruct", owned_by: "groq" },
    { id: "groq/compound-mini", owned_by: "groq" },
    { id: "groq/compound", owned_by: "groq" },

    // ─── Cerebras ──────────────────────────────────────────────────────────────
    { id: "llama3.1-8b", owned_by: "cerebras" },
    { id: "qwen-3-235b-a22b-instruct-2507", owned_by: "cerebras" },

    // ─── OpenRouter FREE ───────────────────────────────────────────────────────
    { id: "openrouter/free", owned_by: "openrouter" },
    { id: "google/gemini-2.0-flash:free", owned_by: "openrouter" },
    { id: "google/gemini-2.0-pro-exp:free", owned_by: "openrouter" },
    { id: "google/gemma-3-12b-it:free", owned_by: "openrouter" },
    { id: "deepseek/deepseek-r1:free", owned_by: "openrouter" },
    { id: "deepseek/deepseek-chat:free", owned_by: "openrouter" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", owned_by: "openrouter" },
    { id: "mistralai/mistral-small-3.1-24b-instruct:free", owned_by: "openrouter" },

    // ─── Z.AI ──────────────────────────────────────────────────────────────────
    { id: "glm-4.7-flash", owned_by: "zai" },
  ].map((m) => ({
    id: m.id,
    object: "model",
    created: now,
    owned_by: m.owned_by,
  }));

  return Response.json({ object: "list", data: models });
});

router.get("/openapi.json", async () => {
  const { readFileSync } = await import("fs");
  const content = readFileSync("./openapi.json", "utf-8");
  return new Response(content, { headers: { "Content-Type": "application/json" } });
});

router.get("/v1/history", getHistory);
router.delete("/v1/history", deleteHistory);
router.get("/v1/status/providers", getProviderStatus);
router.post("/v1/chat/completions", (req) => handleChatRoute(req));

// ─── Manejador de requests compartido (compatible Bun y Node) ─────────────────
export const handleHttpRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  console.log(`[http][${requestId}] -> ${req.method} ${url.pathname}${url.search}`);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const matched = router.handle(req.method, url.pathname);

  if (matched) {
    try {
      const response = await matched.handler(req, matched.params);

      const responseHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(CORS_HEADERS)) {
        if (!responseHeaders.has(key)) {
          responseHeaders.set(key, value);
        }
      }
      responseHeaders.set("X-Omnibrain-Request-Id", requestId);

      const finalResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

      console.log(`[http][${requestId}] <- ${response.status} ${url.pathname} (${Date.now() - startedAt}ms)`);
      return finalResponse;
    } catch (err: any) {
      console.error(`[http][${requestId}] Error crítico en ruta ${url.pathname}:`, err);
      return Response.json(
        { error: "Internal Server Error", message: err.message, requestId },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }

  console.log(`[http][${requestId}] <- 404 ${url.pathname}`);
  return Response.json(
    { error: "Not Found", path: url.pathname, requestId },
    { status: 404, headers: CORS_HEADERS }
  );
};

// ─── Arranque del servidor ────────────────────────────────────────────────────
if (typeof Bun !== "undefined" ? import.meta.main : true) {
  const PORT = parseInt(process.env.PORT ?? "3000", 10);

  if (typeof Bun !== "undefined") {
    // ── Bun.serve (PC) ───────────────────────────────────────────────────────
    const server = Bun.serve({
      port: PORT,
      idleTimeout: 60,
      fetch: handleHttpRequest,
    });
    console.log(`API escuchando en http://localhost:${server.port} (Bun)`);
  } else {
    // ── http.createServer (Node.js / Termux) ─────────────────────────────────
    const { createServer } = await import("http");

    const server = createServer(async (nodeReq, nodeRes) => {
      // Construir URL completa para la Web API Request
      const url = `http://localhost:${PORT}${nodeReq.url ?? "/"}`;

      // Leer body del request de Node
      const bodyChunks: Buffer[] = [];
      for await (const chunk of nodeReq) {
        bodyChunks.push(chunk);
      }
      const bodyBuffer = bodyChunks.length > 0 ? Buffer.concat(bodyChunks) : null;

      // Crear Web API Request
      const headers = new Headers(nodeReq.headers as Record<string, string>);
      const webReq = new Request(url, {
        method: nodeReq.method ?? "GET",
        headers,
        body: bodyBuffer && bodyBuffer.length > 0 ? bodyBuffer : undefined,
        // @ts-ignore — Node 18+ necesita este flag para streams
        duplex: "half",
      });

      // Procesar con el handler unificado
      const webRes = await handleHttpRequest(webReq);

      // Pasar headers al response de Node
      nodeRes.writeHead(webRes.status, Object.fromEntries(webRes.headers.entries()));

      // Escribir body
      if (webRes.body) {
        const reader = webRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          nodeRes.write(value);
        }
      }

      nodeRes.end();
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`API escuchando en http://0.0.0.0:${PORT} (Node.js)`);
    });
  }
}
