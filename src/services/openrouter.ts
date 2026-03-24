import { env } from "../config/env";
import type { AIProvider, ChatParams, StreamChunk } from "../types/provider";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_DEFAULT_MODEL = "openrouter/free";

function maskApiKey(apiKey: string): string {
  return apiKey.length > 10 ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : "***";
}

function decodeSseLine(rawLine: string): any | null {
  const line = rawLine.trim();
  if (!line.startsWith("data:")) return null;

  const payload = line.slice(5).trim();
  if (!payload || payload === "[DONE]") return null;

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export const openRouter: AIProvider = {
  name: "OpenRouter",
  id: "openrouter",
  isAvailable() {
    return env.OPENROUTER_API_KEY.trim().length > 0;
  },
  async *chat(params: ChatParams): AsyncGenerator<StreamChunk> {
    if (!this.isAvailable()) {
      throw new Error("OPENROUTER_API_KEY no configurada");
    }

    const keys = env.OPENROUTER_API_KEY.split(",").map((k) => k.trim()).filter(Boolean);
    let lastError: Error | null = null;
    const modelToSend = params.model || OPENROUTER_DEFAULT_MODEL;

    // Probar keys en rotación
    for (let i = 0; i < keys.length; i++) {
      const activeKey = keys[i] as string;
      console.log(`[openrouter] Intentando con Key ${i + 1}/${keys.length} (${maskApiKey(activeKey)})`);

      try {
        const response = await fetch(OPENROUTER_BASE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${activeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelToSend,
            messages: params.messages,
            temperature: params.temperature,
            stream: true,
            tools: params.tools,
            tool_choice: params.tool_choice,
          }),
        });

        if (!response.ok || !response.body) {
          const errorText = await response.text();
          const statusStr = String(response.status);
          const isRateLimit = statusStr === "429" || errorText.toLowerCase().includes("rate limit") || errorText.toLowerCase().includes("quota") || errorText.toLowerCase().includes("limit exceeded");

          if (isRateLimit && i < keys.length - 1) {
             console.log(`[openrouter] Key ${i + 1} agotada o rate-limited. Rotando a la siguiente disponible...`);
             continue; // Saltar a la siguiente key en el loop
          }
          throw new Error(`OpenRouter ${response.status}: ${errorText || "Respuesta no valida del proveedor"}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const event = decodeSseLine(line);
              if (!event) continue;

              // DETECTAR ERRORES EMBEBIDOS EN EL FLUJO SSE
              if (event.error) {
                const errorMsg = event.error.message || JSON.stringify(event.error);
                const isRateLimit = errorMsg.toLowerCase().includes("rate limit") || errorMsg.toLowerCase().includes("quota") || errorMsg.toLowerCase().includes("limit exceeded");
                
                if (isRateLimit && i < keys.length - 1) {
                     console.log(`[openrouter] Error SSE de Rate Limit detectado. Rotando key...`);
                     throw new Error(`SSE RateLimit: ${errorMsg}`); // Forzar catch para rotar key
                }
                throw new Error(`OpenRouter Stream Error: ${errorMsg}`);
              }

              const delta = event.choices?.[0]?.delta;
              const usage = event.usage;

              if (!delta && !usage) continue;

              const chunk: StreamChunk = {};

              if (delta?.content) {
                chunk.content = delta.content;
              }
              if (delta?.reasoning_content) {
                chunk.reasoning = delta.reasoning_content;
              }

              if (delta?.tool_calls) {
                chunk.tool_calls = delta.tool_calls;
              }

              const reasoningTokens = usage?.completion_tokens_details?.reasoning_tokens ?? usage?.completionTokensDetails?.reasoningTokens;

              if (typeof reasoningTokens === "number") {
                chunk.reasoningTokens = reasoningTokens;
              }

              const finishReason = event.choices?.[0]?.finish_reason;
              if (finishReason) {
                chunk.finishReason = finishReason;
              }

              if (chunk.content !== undefined || chunk.tool_calls !== undefined || chunk.reasoning !== undefined) {
                yield chunk;
              }
            }
          }
          return; // Finalizar Generator con éxito si completó el stream
        } finally {
          reader.releaseLock();
        }

      } catch (err: any) {
        console.error(`[openrouter] Error con Key ${i + 1}: ${err.message}`);
        lastError = err;
        
        // Si hay más keys y es un error antes de arrojar chunks (i < keys.length - 1) podemos saltar
        if (i < keys.length - 1 && !err.message.includes("404")) {
           console.log(`[openrouter] Error preliminar. Probando con siguiente key...`);
           continue; 
        }
        throw err; // Re-lanzar si es insalvable
      }
    }
    
    if (lastError) throw lastError;
  }
};

console.log("[openrouter] Proveedor inicializado");
