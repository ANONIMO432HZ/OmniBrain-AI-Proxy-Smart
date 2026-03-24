export const landingPageHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CubePath API Tester</title>
    <style>
      :root {
        color-scheme: light dark;
        --bg: #0f1115;
        --panel: #171a21;
        --text: #e7eaf0;
        --muted: #a5adbb;
        --accent: #6ea8fe;
        --border: #2b3240;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.45;
      }

      main {
        max-width: 980px;
        margin: 48px auto;
        padding: 0 20px;
        display: grid;
        gap: 18px;
      }

      .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 18px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 1.5rem;
      }

      p {
        margin: 0 0 16px;
        color: var(--muted);
      }

      label {
        display: block;
        margin: 12px 0 6px;
        font-size: 0.92rem;
        color: var(--muted);
      }

      input,
      textarea,
      button {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: #0e1218;
        color: var(--text);
        padding: 10px 12px;
        font: inherit;
      }

      textarea {
        min-height: 120px;
        resize: vertical;
      }

      button {
        margin-top: 14px;
        background: var(--accent);
        color: #081321;
        font-weight: 600;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.65;
        cursor: wait;
      }

      .result {
        margin-top: 16px;
        white-space: pre-wrap;
        word-break: break-word;
        border: 1px solid var(--border);
        border-radius: 10px;
        min-height: 160px;
        padding: 12px;
        background: #0b0f14;
      }

      .tiny {
        margin-top: 12px;
        font-size: 0.85rem;
        color: var(--muted);
      }

      .row {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 10px;
        align-items: center;
      }

      code {
        background: #10151d;
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 1px 6px;
      }

      .quick-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .quick-buttons button {
        width: auto;
        margin-top: 0;
        padding: 7px 10px;
        font-size: 0.85rem;
        background: #20283a;
        color: var(--text);
      }

      .stack {
        display: grid;
        gap: 10px;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="panel">
        <h1>CubePath API</h1>
        <p>Prueba el endpoint <code>POST /chat</code> desde esta página.</p>

        <form id="chat-form">
          <label for="model">Modelo (opcional)</label>
          <input id="model" name="model" placeholder="Auto por proveedor (round robin)" />

          <label for="message">Mensaje</label>
          <textarea id="message" name="message" placeholder="Escribe una pregunta..."></textarea>

          <button id="send" type="submit">Enviar</button>
        </form>

        <div id="result" class="result">Esperando mensaje...</div>
        <div id="meta" class="tiny"></div>
      </section>

      <section class="panel">
        <h1>REST rápido</h1>
        <p>Ejecuta cualquier endpoint REST y visualiza el resultado.</p>

        <form id="rest-form" class="stack">
          <div class="row">
            <label for="rest-method">Metodo</label>
            <select id="rest-method" name="method">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>

          <div>
            <label for="rest-path">Ruta</label>
            <input id="rest-path" name="path" placeholder="/api/users" value="/api/users" />
          </div>

          <div>
            <label for="rest-body">Body JSON (opcional para GET/DELETE)</label>
            <textarea id="rest-body" name="body" placeholder='{"username":"ana","email":"ana@mail.com"}'></textarea>
          </div>

          <button id="rest-send" type="submit">Ejecutar request</button>
        </form>

        <div class="quick-buttons">
          <button type="button" data-method="GET" data-path="/api/users" data-body="">GET /api/users</button>
          <button type="button" data-method="POST" data-path="/api/users" data-body='{"username":"demo","email":"demo@mail.com"}'>POST /api/users</button>
          <button type="button" data-method="GET" data-path="/api/conversations" data-body="">GET /api/conversations</button>
          <button type="button" data-method="POST" data-path="/api/conversations" data-body='{"user_id":"<uuid>","title":"Primera conversacion"}'>POST /api/conversations</button>
          <button type="button" data-method="GET" data-path="/api/messages/<uuid>" data-body="">GET /api/messages/:id</button>
        </div>

        <div id="rest-meta" class="tiny"></div>
        <div id="rest-result" class="result">Esperando request REST...</div>
      </section>
    </main>

    <script>
      const form = document.getElementById("chat-form");
      const send = document.getElementById("send");
      const result = document.getElementById("result");
      const meta = document.getElementById("meta");
      const restForm = document.getElementById("rest-form");
      const restSend = document.getElementById("rest-send");
      const restMethod = document.getElementById("rest-method");
      const restPath = document.getElementById("rest-path");
      const restBody = document.getElementById("rest-body");
      const restMeta = document.getElementById("rest-meta");
      const restResult = document.getElementById("rest-result");
      const quickButtons = document.querySelectorAll(".quick-buttons button");

      function setLoading(isLoading) {
        send.disabled = isLoading;
        send.textContent = isLoading ? "Enviando..." : "Enviar";
      }

      function setRestLoading(isLoading) {
        restSend.disabled = isLoading;
        restSend.textContent = isLoading ? "Ejecutando..." : "Ejecutar request";
      }

      function updateMeta(text) {
        meta.textContent = text;
      }

      function updateRestMeta(text) {
        restMeta.textContent = text;
      }

      function parseSseChunk(buffer, onEvent) {
        const blocks = buffer.split("\\n\\n");
        const completeBlocks = blocks.slice(0, -1);
        const rest = blocks[blocks.length - 1] ?? "";

        for (const block of completeBlocks) {
          const lines = block.split("\\n");
          let eventName = "message";
          let dataText = "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataText += line.slice(5).trim();
            }
          }

          if (!dataText) continue;

          try {
            onEvent(eventName, JSON.parse(dataText));
          } catch {
            onEvent("error", { error: "No se pudo parsear un evento SSE" });
          }
        }

        return rest;
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const model = document.getElementById("model").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!message) {
          result.textContent = "Escribe un mensaje para probar la API.";
          return;
        }

        result.textContent = "";
        updateMeta("Conectando...");
        setLoading(true);

        const payload = { message };
        if (model) payload.model = model;

        try {
          const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok || !response.body) {
            const text = await response.text();
            throw new Error(text || "La API devolvio un error");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let sseBuffer = "";

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            sseBuffer += decoder.decode(value, { stream: true });

            sseBuffer = parseSseChunk(sseBuffer, (eventName, data) => {
              if (eventName === "meta") {
                updateMeta(
                  "requestId: " +
                    (data.requestId ?? "-") +
                    " | provider: " +
                    (data.provider ?? "-") +
                    " | model: " +
                    (data.model || model || "(auto)"),
                );
              }

              if (eventName === "delta" && data.content) {
                result.textContent += data.content;
              }

              if (eventName === "usage" && data.reasoningTokens !== undefined) {
                updateMeta(meta.textContent + " | reasoningTokens: " + data.reasoningTokens);
              }

              if (eventName === "error") {
                result.textContent += "\\n\\n[error] " + (data.error ?? "Error de streaming");
                if (data.details) result.textContent += "\\n" + data.details;
              }

              if (eventName === "done") {
                updateMeta(
                  (meta.textContent || "") +
                    " | chunks: " +
                    (data.chunkCount ?? "-") +
                    " | " +
                    (data.elapsedMs ?? "-") +
                    "ms",
                );
              }
            });
          }
        } catch (error) {
          result.textContent =
            error instanceof Error ? error.message : "Error inesperado al llamar a /chat";
          updateMeta("Fallo al conectar");
        } finally {
          setLoading(false);
        }
      });

      quickButtons.forEach((button) => {
        button.addEventListener("click", () => {
          restMethod.value = button.dataset.method || "GET";
          restPath.value = button.dataset.path || "/api/users";
          restBody.value = button.dataset.body || "";
        });
      });

      restForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const method = restMethod.value;
        const path = restPath.value.trim();
        const bodyText = restBody.value.trim();

        if (!path.startsWith("/")) {
          restResult.textContent = "La ruta debe empezar por /";
          return;
        }

        let parsedBody;
        if (bodyText && method !== "GET" && method !== "DELETE") {
          try {
            parsedBody = JSON.parse(bodyText);
          } catch {
            restResult.textContent = "Body JSON invalido";
            return;
          }
        }

        setRestLoading(true);
        updateRestMeta("Conectando...");
        restResult.textContent = "";

        const startedAt = Date.now();
        try {
          const response = await fetch(path, {
            method,
            headers: { "Content-Type": "application/json" },
            body: parsedBody ? JSON.stringify(parsedBody) : undefined,
          });

          const elapsedMs = Date.now() - startedAt;
          const contentType = response.headers.get("content-type") || "";
          let body;

          if (contentType.includes("application/json")) {
            const json = await response.json();
            body = JSON.stringify(json, null, 2);
          } else {
            body = await response.text();
          }

          const headersObject = {};
          response.headers.forEach((value, key) => {
            headersObject[key] = value;
          });

          updateRestMeta(
            "Status " + response.status + " | " + elapsedMs + "ms",
          );
          restResult.textContent =
            "REQUEST\\n" +
            method +
            " " +
            path +
            "\\n\\nRESPONSE HEADERS\\n" +
            JSON.stringify(headersObject, null, 2) +
            "\\n\\nRESPONSE BODY\\n" +
            body;
        } catch (error) {
          restResult.textContent =
            error instanceof Error ? error.message : "Error al ejecutar la request";
          updateRestMeta("Fallo al conectar");
        } finally {
          setRestLoading(false);
        }
      });
    </script>
  </body>
</html>
`;
