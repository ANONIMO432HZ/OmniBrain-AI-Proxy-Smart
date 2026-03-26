export const landingPageHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OmniBrain API Tester</title>
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
      select,
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
        max-height: 500px;
        overflow-y: auto;
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

      @keyframes spin {
        to { transform: rotate(360deg); }
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
        <h1>OmniBrain API</h1>
        <p>Prueba el endpoint <code>POST /chat</code> desde esta página.</p>

        <form id="chat-form">
          <!-- 🔐 Autenticación Fase 2.1 -->
          <label for="local-api-key" style="display:flex; align-items:center; gap:6px;">
             <span>🔑 OmniBrain API Key Local</span>
             <span style="font-size:0.75rem; color:#94a3b8;">(Default: omnibrain-dev-token)</span>
          </label>
          <input type="password" id="local-api-key" placeholder="Ingresa tu pass local" value="{{DEFAULT_KEY}}" style="margin-bottom: 12px; background:#0e1218;" />

          <label for="model">Modelo (opcional)</label>
          <select id="model" name="model" style="background:#0e1218;">
            <optgroup label="🌐 ENRUTADO AUTOMÁTICO">
              <option value="">Auto Global (Garantizado - 4 Proveedores)</option>
              <option value="auto:openrouter">Auto OpenRouter (Usa solo OpenRouter)</option>
              <option value="auto:groq">Auto Groq (Usa solo Groq)</option>
              <option value="auto:cerebras">Auto Cerebras (Usa solo Cerebras)</option>
              <option value="auto:zai">Auto Z.AI (Usa solo Z.AI)</option>
            </optgroup>
            
            <optgroup label="🚀 MODELOS GROQ 2026">
              <option value="llama-4-scout-17b-16e-instruct">llama-4-scout-17b-16e-instruct (Llama 4 Nuevo)</option>
              <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (GPT OSS)</option>
              <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (GPT OSS Light)</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Llama 3.3)</option>
              <option value="qwen/qwen3-32b">qwen/qwen3-32b (Qwen 3)</option>
              <option value="moonshotai/kimi-k2-instruct">moonshotai/kimi-k2-instruct (Kimi K2)</option>
              <option value="groq/compound-mini">groq/compound-mini (Compound Agentic)</option>
              <option value="groq/compound">groq/compound (Compound Large)</option>
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Llama 8B Instant)</option>
            </optgroup>

            <optgroup label="📂 OPENROUTER FREE (Todos los Modelos)">
              <option value="google/gemma-3-12b-it:free">google/gemma-3-12b-it:free</option>
              <option value="google/gemma-3-4b-it:free">google/gemma-3-4b-it:free</option>
              <option value="google/gemma-3n-e2b-it:free">google/gemma-3n-e2b-it:free</option>
              <option value="google/gemma-3n-e4b-it:free">google/gemma-3n-e4b-it:free</option>
              <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free</option>
              <option value="google/gemini-2.0-pro-exp:free">google/gemini-2.0-pro-exp:free (Pro experimental)</option>
              <option value="deepseek/deepseek-chat:free">deepseek/deepseek-chat:free (V3)</option>
              <option value="deepseek/deepseek-r1:free">deepseek/deepseek-r1:free (R1)</option>
              <option value="meta-llama/llama-3.3-70b-instruct:free">meta-llama/llama-3.3-70b-instruct:free</option>
              <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small-3.1-24b-instruct:free</option>
              <option value="liquid/lfm-2.5-1.2b-instruct:free">liquid/lfm-2.5-1.2b-instruct:free</option>
              <option value="nousresearch/hermes-3-llama-3.1-405b:free">nousresearch/hermes-3-llama-3.1-405b:free</option>
              <option value="nvidia/llama-nemotron-embed-vl-1b-v2:free">nvidia/llama-nemotron-embed-vl-1b-v2:free</option>
              <option value="openrouter/free">openrouter/free (Auto Free)</option>
            </optgroup>

            <optgroup label="📂 CEREBRAS DIRECTO">
              <option value="llama3.1-8b">llama3.1-8b (Cerebras Llama)</option>
              <option value="qwen-3-235b-a22b-instruct-2507">qwen-3-235b-a22b-instruct-2507 (Cerebras Qwen)</option>
            </optgroup>

            <optgroup label="📂 Z.AI NATIVO">
              <option value="glm-4.7-flash">glm-4.7-flash (Gratis)</option>
            </optgroup>

            <optgroup label="🧪 PRUEBAS Y DIAGNÓSTICO">
              <option value="mock">Prueba: Mock Agent (Simulado)</option>
              <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
            </optgroup>
          </select>

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
          <button type="button" data-method="GET" data-path="/history" data-body="">GET /history (Historial)</button>
          <button type="button" data-method="DELETE" data-path="/history" data-body="">DELETE /history (Borrar Historial)</button>
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
        const localApiKey = document.getElementById("local-api-key").value.trim();

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
          const response = await fetch("/v1/chat/completions", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localApiKey,
              "X-Omnibrain-Format": "native"
            },
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

              if (eventName === "delta" && data.reasoning) {
                let reasoningBox = document.getElementById("reasoning-box");
                if (!reasoningBox) {
                  reasoningBox = document.createElement("details");
                  reasoningBox.id = "reasoning-box";
                  reasoningBox.style = "background: #1e2430; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #38bdf8; font-size: 0.9rem; color: #94a3b8;";
                  const summary = document.createElement("summary");
                  summary.style = "cursor: pointer; color: #38bdf8; font-weight: 600; outline:none; display:flex; align-items:center; gap:8px;";
                  summary.innerHTML = '<div class="spinner-thinking" style="width: 14px; height: 14px; border: 2px solid rgba(56,189,248,0.2); border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite;"></div><span>🤔 Pensando...</span>';
                  reasoningBox.appendChild(summary);
                  const contentDiv = document.createElement("div");
                  contentDiv.id = "reasoning-content";
                  contentDiv.style = "margin-top: 10px; font-style: italic; white-space: pre-wrap;";
                  reasoningBox.appendChild(contentDiv);
                  result.appendChild(reasoningBox);
                }
                document.getElementById("reasoning-content").textContent += data.reasoning;
              }

              if (eventName === "delta" && data.content) {
                const reasoningBox = document.getElementById("reasoning-box");
                if (reasoningBox) {
                   const spinner = reasoningBox.querySelector(".spinner-thinking");
                   if (spinner) spinner.style.display = "none"; // Ocultar spinner
                   const textSpan = reasoningBox.querySelector("summary span");
                   if (textSpan) textSpan.textContent = "🧠 Razonamiento completado (clic aquí para ver)";
                }

                let textNode = document.getElementById("text-content");
                if (!textNode) {
                  textNode = document.createElement("div");
                  textNode.id = "text-content";
                  textNode.style = "white-space: pre-wrap;";
                  result.appendChild(textNode);
                }
                textNode.textContent += data.content;
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
        const localApiKey = document.getElementById("local-api-key").value.trim();
        try {
          const response = await fetch(path, {
            method,
            headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localApiKey,
              "X-Omnibrain-Format": "native"
            },
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
