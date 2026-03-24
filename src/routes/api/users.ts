import { sql } from "bun";
import { router } from "../../lib/router";
import { json, error, parseQuery } from "../../lib/response";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get("/api/users", async (req) => {
  const { limit, offset, page } = parseQuery(req);

  const [users, [{ count }]] = await Promise.all([
    sql`SELECT * FROM users ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    sql`SELECT COUNT(*)::int AS count FROM users`,
  ]);

  return json({
    data: users,
    meta: { page, limit, total: count },
  });
});

router.get("/api/users/:id", async (_req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;

  if (!user) return error("Usuario no encontrado", 404);
  return json({ data: user });
});

router.post("/api/users", async (req) => {
  let body: { username?: string; email?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return error("JSON inválido", 400);
  }

  const { username, email } = body;
  if (!username?.trim()) return error("username es obligatorio", 400);
  if (!email?.trim()) return error("email es obligatorio", 400);

  try {
    const [user] = await sql`
      INSERT INTO users (username, email)
      VALUES (${username.trim()}, ${email.trim()})
      RETURNING *
    `;
    return json({ data: user }, 201);
  } catch (err: any) {
    if (err.code === "23505") {
      return error("username o email ya existe", 409);
    }
    throw err;
  }
});

router.put("/api/users/:id", async (req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  let body: { username?: string; email?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return error("JSON inválido", 400);
  }

  const { username, email } = body;
  if (!username?.trim() && !email?.trim()) {
    return error("Proporciona al menos username o email", 400);
  }

  try {
    const [user] = await sql`
      UPDATE users
      SET
        username = COALESCE(${username?.trim() ?? null}, username),
        email = COALESCE(${email?.trim() ?? null}, email),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!user) return error("Usuario no encontrado", 404);
    return json({ data: user });
  } catch (err: any) {
    if (err.code === "23505") {
      return error("username o email ya existe", 409);
    }
    throw err;
  }
});

router.delete("/api/users/:id", async (_req, params) => {
  const id = params.id!;
  if (!UUID_RE.test(id)) return error("ID inválido", 400);

  const [user] = await sql`
    DELETE FROM users WHERE id = ${id} RETURNING id
  `;

  if (!user) return error("Usuario no encontrado", 404);
  return json({ message: "Usuario eliminado" });
});
