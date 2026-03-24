import { sql } from "bun";
import { router } from "../../lib/router";
import { json, error, parseQuery } from "../../lib/response";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get("/api/conversations", async (req) => {
  const { limit, offset, page, searchParams } = parseQuery(req);
  const userId = searchParams.get("user_id");

  if (userId && !UUID_RE.test(userId)) return error("user_id inválido", 400);

  const [conversations, [{ count }]] = userId
    ? await Promise.all([
        sql`
          SELECT c.*, u.username
          FROM conversations c
          JOIN users u ON u.id = c.user_id
          WHERE c.user_id = ${userId}
          ORDER BY c.updated_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
        sql`SELECT COUNT(*)::int AS count FROM conversations WHERE user_id = ${userId}`,
      ])
    : await Promise.all([
        sql`
          SELECT c.*, u.username
          FROM conversations c
          JOIN users u ON u.id = c.user_id
          ORDER BY c.updated_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
        sql`SELECT COUNT(*)::int AS count FROM conversations`,
      ]);

  return json({
    data: conversations,
    meta: { page, limit, total: count },
  });
});

router.get("/api/conversations/:id", async (_req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  const [conversation] = await sql`
    SELECT c.*, u.username,
      (SELECT COUNT(*)::int FROM messages WHERE conversation_id = c.id) AS message_count
    FROM conversations c
    JOIN users u ON u.id = c.user_id
    WHERE c.id = ${id}
  `;

  if (!conversation) return error("Conversación no encontrada", 404);
  return json({ data: conversation });
});

router.post("/api/conversations", async (req) => {
  let body: { user_id?: string; title?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return error("JSON inválido", 400);
  }

  const { user_id, title } = body;
  if (!user_id) return error("user_id es obligatorio", 400);
  if (!UUID_RE.test(user_id)) return error("user_id inválido", 400);

  const [userExists] = await sql`SELECT id FROM users WHERE id = ${user_id}`;
  if (!userExists) return error("Usuario no encontrado", 404);

  const [conversation] = await sql`
    INSERT INTO conversations (user_id, title)
    VALUES (${user_id}, ${title?.trim() || "Nueva conversación"})
    RETURNING *
  `;

  return json({ data: conversation }, 201);
});

router.put("/api/conversations/:id", async (req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  let body: { title?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return error("JSON inválido", 400);
  }

  const { title } = body;
  if (!title?.trim()) return error("title es obligatorio", 400);

  const [conversation] = await sql`
    UPDATE conversations
    SET title = ${title.trim()}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  if (!conversation) return error("Conversación no encontrada", 404);
  return json({ data: conversation });
});

router.delete("/api/conversations/:id", async (_req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  const [conversation] = await sql`
    DELETE FROM conversations WHERE id = ${id} RETURNING id
  `;

  if (!conversation) return error("Conversación no encontrada", 404);
  return json({ message: "Conversación eliminada (y sus mensajes)" });
});
