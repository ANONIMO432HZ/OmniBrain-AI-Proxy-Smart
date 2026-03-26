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

  // Detectar formato deseado: native (landing/tests) vs openai (Claude Code / Continue / etc.)
  const nativeFormat = req.headers.get("X-Omnibrain-Format") === "native";

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
    : (messages && messages.length > 0 ? (messages[messages.length - 1]?.content || "Mensaje vacío") : "Mensaje vacío");


  try {
    await (db as any).insert(schema.messages).values({
      id: crypto.randomUUID(),
      conversationId,
      role: "user",
      content: userMessageContent,
    });
  } catch (err: any) {
    console.error(`[db] Error guardando prompt: ${err.message}`);
  }

  const model = body.model;
  console.log(`[chat][${requestId}] Solicitando chat al router dinámico... formato=${nativeFormat ? "native" : "openai"}`);

  // ID de completion para el formato OpenAI
  const completionId = `chatcmpl-${requestId.replaceAll("-", "").slice(0, 20)}`;
  const createdAt = Math.floor(Date.now() / 1000);

  try {
    const providerStream = await providerRouter.chat({
      model,
      messages,
      temperature: body.temperature,
      tools: body.tools,
      tool_choice: body.tool_choice,
      requestId, // Pasamos el ID para métricas delegadas
    });


    const encoder = new TextEncoder();
    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let chunkCount = 0;
        let responseChars = 0;
        let reasoningTokens: number | null = null;

        try {
          let fullResponse = ""; //  acumular respuesta

          let realProvider = "Router";
          let realModel = model || "auto";

          for await (const chunk of providerStream) {

            chunkCount += 1;

            // Primer chunk con metadatos del proveedor real
            if (chunk.provider) {
              realProvider = chunk.provider;
              realModel = chunk.model || realModel;

              if (nativeFormat) {
                controller.enqueue(
                  encoder.encode(sseEvent("meta", { requestId, provider: realProvider, model: realModel }))
                );
              }
              // En formato OpenAI NO enviamos un chunk de meta, la info va en el role chunk inicial
            }

            if (chunk.reasoning) {
              if (nativeFormat) {
                controller.enqueue(
                  encoder.encode(sseEvent("delta", { reasoning: chunk.reasoning })),
                );
              }
              // En formato OpenAI, razonamiento va en un campo custom dentro del delta
              else {
                const oaiChunk = {
                  id: completionId,
                  object: "chat.completion.chunk",
                  created: createdAt,
                  model: realModel,
                  choices: [{ index: 0, delta: { reasoning_content: chunk.reasoning }, finish_reason: null }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(oaiChunk)}\n\n`));
              }
            }

            if (chunk.content) {
              fullResponse += chunk.content;
              responseChars += chunk.content.length;

              if (nativeFormat) {
                controller.enqueue(
                  encoder.encode(sseEvent("delta", { content: chunk.content })),
                );
              } else {
                const oaiChunk = {
                  id: completionId,
                  object: "chat.completion.chunk",
                  created: createdAt,
                  model: realModel,
                  choices: [{ index: 0, delta: { content: chunk.content }, finish_reason: null }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(oaiChunk)}\n\n`));
              }
            }

            if (chunk.tool_calls) {
              if (nativeFormat) {
                controller.enqueue(
                  encoder.encode(sseEvent("delta", { tool_calls: chunk.tool_calls })),
                );
              } else {
                const oaiChunk = {
                  id: completionId,
                  object: "chat.completion.chunk",
                  created: createdAt,
                  model: realModel,
                  choices: [{ index: 0, delta: { tool_calls: chunk.tool_calls }, finish_reason: null }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(oaiChunk)}\n\n`));
              }
            }

            if (typeof chunk.reasoningTokens === "number") {
              reasoningTokens = chunk.reasoningTokens;
              if (nativeFormat) {
                controller.enqueue(
                  encoder.encode(sseEvent("usage", { reasoningTokens })),
                );
              }
            }
          }

          // 📊 Guardar Respuesta del Asistente en DB (Fase 2.2)
          try {
            await (db as any).insert(schema.messages).values({
               id: crypto.randomUUID(),
               conversationId,
               role: "assistant",
               content: fullResponse,
               model: realModel,
               provider: realProvider
            });
          } catch (err: any) {
            console.error(`[db] Error guardando respuesta: ${err.message}`);
          }

          // Señales de fin de stream
          if (nativeFormat) {
            controller.enqueue(
              encoder.encode(
                sseEvent("done", {
                  chunkCount,
                  responseChars,
                  elapsedMs: Date.now() - startedAt,
                }),
              ),
            );
          } else {
            // Chunk de fin con finish_reason="stop"
            const stopChunk = {
              id: completionId,
              object: "chat.completion.chunk",
              created: createdAt,
              model: realModel,
              choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(stopChunk)}\n\n`));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          }

          // 📊 Las métricas de éxito ya son guardadas por el providerRouter


          controller.close();
        } catch (streamError) {
          const streamErrorMessage = streamError instanceof Error ? streamError.message : "Error durante streaming";
          console.error(`[chat][${requestId}] Error durante streaming: ${streamErrorMessage}`);

          // 📊 Guardar Métricas de Error (Fase 3.2)
          try {
            await (db as any).insert(schema.providerMetrics).values({
              id: crypto.randomUUID(),
              provider: "Router",
              model: model || "auto",
              latencyMs: (Date.now() - startedAt).toString(),
              status: "500", // Error en stream
              requestId,
            });
          } catch (mErr: any) {
             console.error(`[db] Error guardando métricas de error: ${mErr.message}`);
          }

          if (nativeFormat) {
            controller.enqueue(
              encoder.encode(sseEvent("error", { error: streamErrorMessage })),
            );
          } else {
            // Errores en formato OpenAI – algunos clientes leen este patrón
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: { message: streamErrorMessage, type: "stream_error" } })}\n\n`)
            );
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          }
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
        // Exponer al cliente qué proveedor se usó (para debugging)
        "X-Omnibrain-Request-Id": requestId,
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
