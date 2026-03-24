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

    console.log(`[openrouter] Iniciando streaming para modelo: ${params.model || OPENROUTER_DEFAULT_MODEL}`);

    const response = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model || OPENROUTER_DEFAULT_MODEL,
        messages: params.messages,
        temperature: params.temperature,
        stream: true,
        tools: params.tools,
        tool_choice: params.tool_choice,
      }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter ${response.status}: ${errorText || "Respuesta no valida del proveedor"}`,
      );
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
            throw new Error(`OpenRouter Stream Error: ${event.error.message || JSON.stringify(event.error)}`);
          }

          const delta = event.choices?.[0]?.delta;
          const usage = event.usage;

          if (!delta && !usage) continue;

          const chunk: StreamChunk = {};

          if (delta?.content) {
            chunk.content = delta.content;
          }

          if (delta?.tool_calls) {
            chunk.tool_calls = delta.tool_calls;
          }

          const reasoningTokens =
            usage?.completion_tokens_details?.reasoning_tokens ??
            usage?.completionTokensDetails?.reasoningTokens;

          if (typeof reasoningTokens === "number") {
            chunk.reasoningTokens = reasoningTokens;
          }

          const finishReason = event.choices?.[0]?.finish_reason;
          if (finishReason) {
            chunk.finishReason = finishReason;
          }

          if (chunk.content !== undefined || chunk.tool_calls !== undefined || chunk.reasoningTokens !== undefined) {
            yield chunk;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};

console.log("[openrouter] Proveedor inicializado");
console.log(
  `[openrouter] API key ${
    openRouter.isAvailable() ? `detectada (${maskApiKey(env.OPENROUTER_API_KEY)})` : "no configurada"
  }`,
);
