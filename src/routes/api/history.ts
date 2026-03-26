import { db, schema, saveIfSqlJs } from "../../db/db";
import { env } from "../../config/env";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function checkAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  return authHeader === `Bearer ${env.LOCAL_API_KEY}`;
}

export async function getHistory(req: Request) {
  if (!checkAuth(req)) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }

  try {
    const results = await (db as any).select().from(schema.messages);
    return new Response(JSON.stringify({ messages: results }), {
      status: 200,
      headers: { 
        ...CORS_HEADERS, 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate" 
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }
}

export async function deleteHistory(req: Request) {
  if (!checkAuth(req)) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }

  try {
    await (db as any).delete(schema.messages).execute();
    saveIfSqlJs();
    return new Response(JSON.stringify({ success: true, message: "Historial eliminado" }), {
      status: 200,
      headers: { 
        ...CORS_HEADERS, 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate" 
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }
}
