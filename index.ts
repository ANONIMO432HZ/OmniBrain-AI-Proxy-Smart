import { handleChatRoute } from "./src/routes/chat";
import { landingPageHtml } from "./src/routes/landing";
import { router } from "./src/lib/router";
import { ensureDatabaseReady } from "./src/db/init";
import { getHistory, deleteHistory } from "./src/routes/api/history";
import { getProviderStatus } from "./src/routes/api/status";


const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// 🚀 Inicializar Base de Datos (Fase 2.2)
await ensureDatabaseReady();

// 🛣️ Registro de Rutas (Fase 3.1)
router.get("/", async () => {
  return new Response(landingPageHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
});

router.get("/health", async () => Response.json({ status: "ok" }));

// Rutas Legacy (Compatibilidad)
router.get("/history", getHistory);
router.delete("/history", deleteHistory);
router.post("/chat", (req) => handleChatRoute(req));

// Rutas API v1 (Estandarización Fase 3.1)
router.get("/v1/models", async () => Response.json({ object: "list", data: [] })); 
router.get("/openapi.json", async () => {
  const file = Bun.file("./openapi.json");
  return new Response(file, { headers: { "Content-Type": "application/json" } });
});
router.get("/v1/history", getHistory);

router.delete("/v1/history", deleteHistory);
router.get("/v1/status/providers", getProviderStatus);
router.post("/v1/chat/completions", (req) => handleChatRoute(req));


// ⚠️ Comentados temporalmente para evitar carga de Postgres nativo (Fase 2.2)
// import "./src/routes/api/users";
// import "./src/routes/api/conversations";
// import "./src/routes/api/messages";

if (import.meta.main) {
  const server = Bun.serve({
    port: 3000,
    idleTimeout: 60,
    async fetch(req) {
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
          
          // Asegurar que la respuesta tenga los headers CORS y Trazabilidad
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
    },
  });

  console.log(`API escuchando en http://localhost:${server.port}`);
}

export const handleHttpRequest = async (req: Request) => {
  const url = new URL(req.url);
  const matched = router.handle(req.method, url.pathname);
  if (!matched) return new Response("Not Found", { status: 404 });
  return matched.handler(req, matched.params);
};

