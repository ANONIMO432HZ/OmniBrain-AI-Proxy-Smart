// ─── Dual-Runtime DB Layer ────────────────────────────────────────────────────
// Funciona en Bun (PC) y en Node.js (Termux / armv7l)
// Detección de runtime: Bun expone `globalThis.Bun`
import "dotenv/config";
import * as pgSchema from "./schema/postgres";
import * as sqliteSchema from "./schema/sqlite";

// ─── URL de Base de Datos ─────────────────────────────────────────────────────
export let dbUrl = process.env.DATABASE_URL || "./data/api.db";

// 🚀 Soporte para Dokploy (Si Dokploy inyecta variables individuales de Postgres)
if (process.env.POSTGRES_HOST && process.env.POSTGRES_DB) {
  const user = process.env.POSTGRES_USER || "postgres";
  const pass = process.env.POSTGRES_PASSWORD || "";
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT || "5432";
  const dbName = process.env.POSTGRES_DB;
  dbUrl = `postgres://${user}:${pass}@${host}:${port}/${dbName}`;
}

export const isPostgres =
  dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://");

// ─── Helpers de importación dinámica ──────────────────────────────────────────
// Usamos una función factory async para poder hacer dynamic import
// según el runtime. `createDb` es llamada desde init.ts ANTES de usar `db`.

let _db: any = null;
let _schema: any = null;

async function buildDb() {
  if (isPostgres) {
    // ── PostgreSQL ────────────────────────────────────────────────────────────
    if (typeof Bun !== "undefined") {
      // Bun nativo (bun:sql)
      const { drizzle } = await import("drizzle-orm/bun-sql");
      const { sql } = await import("bun");
      _db = drizzle(sql, { schema: pgSchema });
    } else {
      // Node.js (postgres-js)
      const postgres = (await import("postgres")).default;
      const { drizzle } = await import("drizzle-orm/postgres-js");
      const client = postgres(dbUrl);
      _db = drizzle(client, { schema: pgSchema });
    }
    _schema = pgSchema;
  } else {
    // ── SQLite ────────────────────────────────────────────────────────────────
    if (typeof Bun !== "undefined") {
      // Bun nativo (bun:sqlite)
      const { Database } = await import("bun:sqlite");
      const { drizzle } = await import("drizzle-orm/bun-sqlite");
      _db = drizzle(new Database(dbUrl), { schema: sqliteSchema });
    } else {
      // Node.js (sql.js - WASM / No-Compile)
      const initSqlJs = (await import("sql.js")).default;
      const { drizzle } = await import("drizzle-orm/sql-js");
      const { readFileSync, existsSync, writeFileSync } = await import("fs");

      const SQL = await initSqlJs();
      let fileBuffer: Uint8Array | undefined;

      if (existsSync(dbUrl)) {
        fileBuffer = readFileSync(dbUrl);
        console.log(`[db] Cargando base de datos desde ${dbUrl} (${fileBuffer.length} bytes)`);
      }

      const sqliteDb = new SQL.Database(fileBuffer);
      _db = drizzle(sqliteDb, { schema: sqliteSchema });

      // Añadimos método de persistencia manual al objeto db
      (_db as any).saveToDisk = () => {
        const data = sqliteDb.export();
        const buffer = Buffer.from(data);
        writeFileSync(dbUrl, buffer);
        console.log(`[db] Persistencia completada en ${dbUrl}`);
      };
    }

    _schema = sqliteSchema;
  }

  console.log(
    `[db] Conectado en modo: ${isPostgres ? "PostgreSQL" : "SQLite"} | runtime: ${typeof Bun !== "undefined" ? "Bun" : "Node.js"}`
  );
}

// ─── Export lazy ─────────────────────────────────────────────────────────────
// `db` y `schema` son proxies que redirigen al singleton real.
// Se garantiza que buildDb() fue llamado ANTES via ensureDatabaseReady() en init.ts.
export { buildDb };

export const getDb = () => {
  if (!_db) throw new Error("[db] La base de datos no está inicializada. Llama a ensureDatabaseReady() primero.");
  return _db;
};

export const getSchema = () => {
  if (!_schema) throw new Error("[db] El schema no está inicializado.");
  return _schema;
};

// Exportaciones compatibles con el código existente (chat.ts, history.ts, etc.)
export const db: any = new Proxy({} as any, {
  get(_target, prop) {
    const currentDb = getDb();
    return currentDb[prop as string];
  },
});

export const schema: any = new Proxy({} as any, {
  get(_target, prop) {
    return getSchema()[prop as string];
  },
});

/**
 * Persiste la base de datos a disco si estamos usando sql.js (in-memory)
 * Útil después de operaciones de escritura (insert, update, delete).
 */
export const saveIfSqlJs = () => {
  try {
    const currentDb = getDb();
    if (typeof currentDb.saveToDisk === "function") {
      currentDb.saveToDisk();
    }
  } catch (err) {
    // Silencioso si falla la persistencia opcional
    console.error(`[db] Error persistiendo sql.js: ${err}`);
  }
};
