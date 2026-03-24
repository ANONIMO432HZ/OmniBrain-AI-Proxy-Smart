import { env } from "../config/env";
import type { ChatMessage, ProviderStreamChunk } from "./openrouter";

const CEREBRAS_BASE_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_DEFAULT_MODEL = "llama3.1-8b";

function maskApiKey(apiKey: string): string {
  return apiKey.length > 10 ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : "***";
}

function decodeSseLine(rawLine: string): unknown | null {
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

export function hasCerebrasKey(): boolean {
  return env.CEREBRAS_API_KEY.trim().length > 0;
}

console.log("[cerebras] Proveedor inicializado");
console.log(
  `[cerebras] API key ${
    hasCerebrasKey() ? `detectada (${maskApiKey(env.CEREBRAS_API_KEY)})` : "no configurada"
  }`,
);

export async function streamFromCerebras(params: {
  messages: ChatMessage[];
  model?: string;
}): Promise<AsyncGenerator<ProviderStreamChunk>> {
  if (!hasCerebrasKey()) {
    throw new Error("CEREBRAS_API_KEY no configurada");
  }

  const response = await fetch(CEREBRAS_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CEREBRAS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CEREBRAS_DEFAULT_MODEL,
      messages: params.messages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text();
    throw new Error(
      `Cerebras ${response.status}: ${errorText || "Respuesta no valida del proveedor"}`,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  async function* iterate(): AsyncGenerator<ProviderStreamChunk> {
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const event = decodeSseLine(line) as
          | {
              choices?: Array<{ delta?: { content?: string } }>;
              usage?: {
                completion_tokens_details?: { reasoning_tokens?: number };
                completionTokensDetails?: { reasoningTokens?: number };
              };
            }
          | null;

        if (!event) continue;

        const content = event.choices?.[0]?.delta?.content;
        const reasoningTokens =
          event.usage?.completion_tokens_details?.reasoning_tokens ??
          event.usage?.completionTokensDetails?.reasoningTokens;

        if (content) {
          yield { content };
        }

        if (typeof reasoningTokens === "number") {
          yield { reasoningTokens };
        }
      }
    }
  }

  return iterate();
}
