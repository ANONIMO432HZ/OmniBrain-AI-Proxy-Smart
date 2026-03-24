import { sql } from "bun";
import { router } from "../../lib/router";
import { json, error, parseQuery } from "../../lib/response";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_ROLES = new Set(["user", "assistant", "system"]);

router.get("/api/conversations/:conversationId/messages", async (req, params) => {
  const conversationId = params.conversationId!;
  if (!UUID_RE.test(conversationId))
    return error("conversationId inválido", 400);

  const { limit, offset, page } = parseQuery(req);

  const [exists] = await sql`
    SELECT id FROM conversations WHERE id = ${conversationId}
  `;
  if (!exists) return error("Conversación no encontrada", 404);

  const [messages, [{ count }]] = await Promise.all([
    sql`
      SELECT * FROM messages
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`
      SELECT COUNT(*)::int AS count FROM messages
      WHERE conversation_id = ${conversationId}
    `,
  ]);

  return json({
    data: messages,
    meta: { page, limit, total: count },
  });
});

router.post("/api/conversations/:conversationId/messages", async (req, params) => {
  const conversationId = params.conversationId!;
  if (!UUID_RE.test(conversationId))
    return error("conversationId inválido", 400);

  let body: {
    role?: string;
    content?: string;
    model?: string;
    provider?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return error("JSON inválido", 400);
  }

  const { role, content, model, provider } = body;

  if (!role || !VALID_ROLES.has(role))
    return error("role debe ser 'user', 'assistant' o 'system'", 400);
  if (!content?.trim()) return error("content es obligatorio", 400);

  const [exists] = await sql`
    SELECT id FROM conversations WHERE id = ${conversationId}
  `;
  if (!exists) return error("Conversación no encontrada", 404);

  const [message] = await sql`
    INSERT INTO messages (conversation_id, role, content, model, provider)
    VALUES (
      ${conversationId},
      ${role},
      ${content.trim()},
      ${model ?? null},
      ${provider ?? null}
    )
    RETURNING *
  `;

  await sql`
    UPDATE conversations SET updated_at = NOW()
    WHERE id = ${conversationId}
  `;

  return json({ data: message }, 201);
});

router.get("/api/messages/:id", async (_req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  const [message] = await sql`SELECT * FROM messages WHERE id = ${id}`;

  if (!message) return error("Mensaje no encontrado", 404);
  return json({ data: message });
});

router.delete("/api/messages/:id", async (_req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  const [message] = await sql`
    DELETE FROM messages WHERE id = ${id} RETURNING id, conversation_id
  `;

  if (!message) return error("Mensaje no encontrado", 404);

  await sql`
    UPDATE conversations SET updated_at = NOW()
    WHERE id = ${message.conversation_id}
  `;

  return json({ message: "Mensaje eliminado" });
});
