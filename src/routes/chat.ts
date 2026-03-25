import { providerRouter } from "../services/provider-router";
import type { ChatMessage, ToolDefinition } from "../types/provider";
import { env } from "../config/env";
import { db, schema } from "../db/db";

type ChatRequestBody = {
  message?: string;
  messages?: ChatMessage[];
  model?: string;
  temperature?: number;
  tools?: ToolDefinition[];
  tool_choice?: any;
};

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

  // 🔐 Validar Autenticación (Fase 2.1)
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${env.LOCAL_API_KEY}`) {
    console.warn(`[chat][${requestId}] Acceso no autorizado`);
    return Response.json({ error: "No autorizado. API Key local de OmniBrain no válida." }, { status: 401 });
  }

  let body: ChatRequestBody;

  try {
    body = (await req.json()) as ChatRequestBody;
    console.log(`[chat][${requestId}] Body parseado correctamente`);
  } catch {
    console.error(`[chat][${requestId}] Error parseando JSON del body`);
    return Response.json(
      { error: "Body JSON invalido. Envia { message } o { messages }." },
      { status: 400 },
    );
  }

  const messages = normalizeMessages(body);

  if (!messages) {
    console.error(`[chat][${requestId}] No hay message/messages validos en el body`);
    return Response.json(
      { error: "Solicitud invalida. Debes enviar { message: string } o { messages }." },
      { status: 400 },
    );
  }

  // 🚀 Guardar Mensaje del Usuario en DB (Fase 2.2)
  const conversationId = "00000000-0000-0000-0000-000000000000"; // Global Default
  const userMessageContent = typeof body.message === "string" && body.message.trim().length > 0 
    ? body.message 
    : (messages && messages.length > 0 ? messages[messages.length - 1].content : "Mensaje vacío");

  (db as any).insert(schema.messages).values({
    id: crypto.randomUUID(),
    conversationId,
    role: "user",
    content: userMessageContent,
  }).catch((err: any) => console.error(`[db] Error guardando prompt: ${err.message}`));

  const model = body.model;
  console.log(`[chat][${requestId}] Solicitando chat al router dinámico...`);

  try {
    const providerStream = await providerRouter.chat({
      model,
      messages,
      temperature: body.temperature,
      tools: body.tools,
      tool_choice: body.tool_choice,
    });

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let chunkCount = 0;
        let responseChars = 0;
        let reasoningTokens: number | null = null;

        // Se envía evento de meta inicial
        controller.enqueue(
          encoder.encode(
            sseEvent("meta", {
              requestId,
              model,
              provider: "Router", // El router maneja varios internamente
            }),
          ),
        );

        try {
          let fullResponse = ""; //  acumular respuesta

          for await (const chunk of providerStream) {
            chunkCount += 1;

            if (chunk.content) {
              fullResponse += chunk.content;
              responseChars += chunk.content.length;
              controller.enqueue(
                encoder.encode(sseEvent("delta", { content: chunk.content })),
              );
            }

            if (chunk.reasoning) {
              controller.enqueue(
                encoder.encode(sseEvent("delta", { reasoning: chunk.reasoning })),
              );
            }

            if (chunk.tool_calls) {
              controller.enqueue(
                encoder.encode(sseEvent("delta", { tool_calls: chunk.tool_calls })),
              );
            }

            if (typeof chunk.reasoningTokens === "number") {
              reasoningTokens = chunk.reasoningTokens;
              controller.enqueue(
                encoder.encode(sseEvent("usage", { reasoningTokens })),
              );
            }
          }

          // 🚀 Guardar Respuesta del Asistente en DB (Fase 2.2)
          (db as any).insert(schema.messages).values({
             id: crypto.randomUUID(),
             conversationId,
             role: "assistant",
             content: fullResponse,
             model: model || "auto",
             provider: "Router"
          }).catch((err: any) => console.error(`[db] Error guardando respuesta: ${err.message}`));

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
        } catch (streamError) {
          const streamErrorMessage = streamError instanceof Error ? streamError.message : "Error durante streaming";
          console.error(`[chat][${requestId}] Error durante streaming: ${streamErrorMessage}`);
          controller.enqueue(
            encoder.encode(sseEvent("error", { error: streamErrorMessage })),
          );
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error llamando al router";
    console.error(`[chat][${requestId}] Error: ${message}`);
    return Response.json(
      { error: "No se pudo completar el chat con ningún proveedor.", details: message },
      { status: 502 },
    );
  }
}
