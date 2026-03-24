import { env } from "../config/env";
import type { AIProvider, ChatParams, StreamChunk } from "../types/provider";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_DEFAULT_MODEL = "llama-3.1-8b"; // Ajustado según plan de desarrollo

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

export const groqProvider: AIProvider = {
  name: "Groq",
  id: "groq",
  isAvailable() {
    return env.GROQ_API_KEY.trim().length > 0;
  },
  async *chat(params: ChatParams): AsyncGenerator<StreamChunk> {
    if (!this.isAvailable()) {
      throw new Error("GROQ_API_KEY no configurada");
    }

    let modelToSend = params.model || GROQ_DEFAULT_MODEL;

    // Corregir ID para Llama 4 si le falta el prefijo mandatorio de Groq
    if (modelToSend === "llama-4-scout-17b-16e-instruct") {
      modelToSend = "meta-llama/llama-4-scout-17b-16e-instruct";
    }

    console.log(`[groq] Iniciando streaming para modelo: ${modelToSend}`);

    const response = await fetch(GROQ_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
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
      throw new Error(`Groq ${response.status}: ${errorText || "Respuesta no valida del proveedor"}`);
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
          } else if (delta?.reasoning_content) {
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

console.log("[groq] Proveedor inicializado");
console.log(
  `[groq] API key ${
    groqProvider.isAvailable() ? `detectada (${maskApiKey(env.GROQ_API_KEY)})` : "no configurada"
  }`,
);
