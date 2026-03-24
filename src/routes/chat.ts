import {
  hasOpenRouterKey,
  streamFromOpenRouter,
  type ChatMessage,
} from "../services/openrouter";
import { hasGroqKey, streamFromGroq } from "../services/groq";
import { hasCerebrasKey, streamFromCerebras } from "../services/cerebras";

type ChatRequestBody = {
  message?: string;
  messages?: ChatMessage[];
  model?: string;
};

type ProviderName = "openrouter" | "groq" | "cerebras";

type ChatProvider = {
  name: ProviderName;
  hasKey: () => boolean;
  stream: (params: {
    messages: ChatMessage[];
    model?: string;
  }) => Promise<AsyncGenerator<{ content?: string; reasoningTokens?: number }>>;
};

const chatProviders: ChatProvider[] = [
  {
    name: "openrouter",
    hasKey: hasOpenRouterKey,
    stream: streamFromOpenRouter,
  },
  {
    name: "groq",
    hasKey: hasGroqKey,
    stream: streamFromGroq,
  },
  {
    name: "cerebras",
    hasKey: hasCerebrasKey,
    stream: streamFromCerebras,
  },
];

let providerCursor = 0;

function pickProviderRoundRobin(): ChatProvider | null {
  const enabledProviders = chatProviders.filter((provider) => provider.hasKey());
  if (enabledProviders.length === 0) {
    return null;
  }

  const selected = enabledProviders[providerCursor % enabledProviders.length];
  if (!selected) {
    return null;
  }

  providerCursor = (providerCursor + 1) % enabledProviders.length;
  return selected;
}

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function normalizeMessages(body: ChatRequestBody): ChatMessage[] | null {
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    return body.messages;
  }

  if (typeof body.message === "string" && body.message.trim().length > 0) {
    return [{ role: "user", content: body.message.trim() }];
  }

  return null;
}

export async function handleChatRoute(
  req: Request,
  requestId = crypto.randomUUID(),
): Promise<Response> {
  const startedAt = Date.now();
  console.log(`[chat][${requestId}] Entrando en handleChatRoute`);
  console.log(`[chat][${requestId}] Method=${req.method} URL=${req.url}`);

  let body: ChatRequestBody;

  try {
    console.log(`[chat][${requestId}] Parseando JSON del body`);
    body = (await req.json()) as ChatRequestBody;
    console.log(`[chat][${requestId}] Body parseado correctamente`);
    console.log(`[chat][${requestId}] Campos recibidos:`, Object.keys(body));
  } catch {
    console.error(`[chat][${requestId}] Error parseando JSON del body`);
    return Response.json(
      { error: "Body JSON invalido. Envia { message } o { messages }." },
      { status: 400 },
    );
  }

  console.log(`[chat][${requestId}] Normalizando mensajes`);
  const messages = normalizeMessages(body);

  if (!messages) {
    console.error(
      `[chat][${requestId}] No hay message/messages validos en el body`,
    );
    return Response.json(
      {
        error:
          "Solicitud invalida. Debes enviar { message: string } o { messages: [{ role, content }] }.",
      },
      { status: 400 },
    );
  }

  const selectedProvider = pickProviderRoundRobin();

  if (!selectedProvider) {
    console.error(`[chat][${requestId}] No hay proveedores de chat configurados`);
    return Response.json(
      {
        error:
          "No hay proveedores configurados. Define OPENROUTER_API_KEY, GROQ_API_KEY o CEREBRAS_API_KEY.",
      },
      { status: 500 },
    );
  }

  const model = body.model;
  console.log(`[chat][${requestId}] Proveedor seleccionado: ${selectedProvider.name}`);
  console.log(`[chat][${requestId}] Modelo solicitado: ${model ?? "(auto por proveedor)"}`);
  console.log(`[chat][${requestId}] Numero de mensajes: ${messages.length}`);
  console.log(
    `[chat][${requestId}] Preview primer mensaje:`,
    messages[0]
      ? {
          role: messages[0].role,
          contentPreview: messages[0].content.slice(0, 120),
        }
      : null,
  );

  try {
    console.log(
      `[chat][${requestId}] Solicitando stream al proveedor ${selectedProvider.name}...`,
    );
    const providerStream = await selectedProvider.stream({
      model,
      messages,
    });
    console.log(`[chat][${requestId}] Stream recibido, abriendo SSE al cliente`);

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let chunkCount = 0;
        let responseChars = 0;
        let reasoningTokens: number | null = null;

        controller.enqueue(
          encoder.encode(
            sseEvent("meta", {
              requestId,
              model,
              provider: selectedProvider.name,
            }),
          ),
        );

        try {
          for await (const chunk of providerStream) {
            chunkCount += 1;

            const content = chunk.content;
            if (content) {
              responseChars += content.length;
              controller.enqueue(
                encoder.encode(
                  sseEvent("delta", {
                    content,
                  }),
                ),
              );
              console.log(
                `[chat][${requestId}] Chunk #${chunkCount}: +${content.length} chars`,
              );
            }

            if (typeof chunk.reasoningTokens === "number") {
              reasoningTokens = chunk.reasoningTokens;
              controller.enqueue(
                encoder.encode(
                  sseEvent("usage", {
                    reasoningTokens,
                  }),
                ),
              );
              console.log(
                `[chat][${requestId}] reasoningTokens actualizado: ${reasoningTokens}`,
              );
            }
          }

          controller.enqueue(
            encoder.encode(
              sseEvent("done", {
                chunkCount,
                responseChars,
                elapsedMs: Date.now() - startedAt,
              }),
            ),
          );
          controller.close();
          console.log(
            `[chat][${requestId}] Stream completado: chunks=${chunkCount}, responseChars=${responseChars}, totalMs=${Date.now() - startedAt}`,
          );
        } catch (streamError) {
          const streamErrorMessage =
            streamError instanceof Error
              ? streamError.message
              : "Error inesperado durante streaming";

          console.error(
            `[chat][${requestId}] Error durante streaming: ${streamErrorMessage}`,
          );
          controller.enqueue(
            encoder.encode(
              sseEvent("error", {
                error: `Fallo durante el stream de ${selectedProvider.name}`,
                details: streamErrorMessage,
              }),
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Error inesperado llamando a ${selectedProvider.name}`;
    console.error(
      `[chat][${requestId}] Error llamando a ${selectedProvider.name} tras ${Date.now() - startedAt}ms: ${message}`,
    );

    return Response.json(
      {
        error: `No se pudo completar el chat con ${selectedProvider.name}.`,
        details: message,
      },
      { status: 502 },
    );
  }
}
