import { env } from "../config/env";
import type { AIProvider, ChatParams, StreamChunk } from "../types/provider";

const ZAI_BASE_URL = "https://api.z.ai/api/paas/v4/chat/completions";
const ZAI_DEFAULT_MODEL = "glm-4.7-flash";

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

export const zaiProvider: AIProvider = {
  name: "Z.AI",
  id: "zai",
  isAvailable() {
    return env.ZAI_API_KEY.trim().length > 0;
  },
  async *chat(params: ChatParams): AsyncGenerator<StreamChunk> {
    if (!this.isAvailable()) {
      throw new Error("ZAI_API_KEY no configurada");
    }

    const modelToSend = params.model || ZAI_DEFAULT_MODEL;
    console.log(`[zai] Iniciando streaming para modelo: ${modelToSend}`);

    const response = await fetch(ZAI_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.ZAI_API_KEY}`,
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en"
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

    console.log(`[zai] Respuesta HTTP de Z.AI: ${response.status} ${response.statusText}`);

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      throw new Error(`Z.AI ${response.status}: ${errorText || "Respuesta no valida del proveedor"}`);
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

          const delta = event.choices?.[0]?.delta;
          const usage = event.usage;

          if (!delta && !usage) continue;

          const chunk: StreamChunk = {};

          if (delta?.content) {
            chunk.content = delta.content;
          }
          if (delta?.reasoning_content) {
            // Guardar en campo separado para que la UI lo oculte
            chunk.reasoning = delta.reasoning_content;
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

          if (chunk.content !== undefined || chunk.tool_calls !== undefined || chunk.reasoning !== undefined) {
            yield chunk;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};
