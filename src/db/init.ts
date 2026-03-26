import { readFileSync } from "fs";
import { dbUrl, isPostgres, buildDb } from "./db";

let initPromise: Promise<void> | null = null;

async function runSchemaSync() {
  // ── Leer el archivo SQL (compatible Bun y Node) ───────────────────────────
  const schemaDir = new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
  const schemaFile = isPostgres
    ? `${schemaDir}/schema.sql`
    : `${schemaDir}/schema.sqlite.sql`;

  const schemaSql = readFileSync(schemaFile, "utf-8");

  if (isPostgres) {
    // ── PostgreSQL ──────────────────────────────────────────────────────────
    console.log("[db] Sincronizando esquema en PostgreSQL...");

    if (typeof Bun !== "undefined") {
      // Bun nativo
      const { sql } = await import("bun");
      await sql.unsafe(schemaSql);
      await sql.unsafe(`
        INSERT INTO users (id, username, email)
        VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin@omnibrain.local')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO conversations (id, user_id, title)
        VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Historial Global')
        ON CONFLICT (id) DO NOTHING;
      `);
    } else {
      // Node.js (postgres-js)
      const postgres = (await import("postgres")).default;
      const sql = postgres(dbUrl);
      await sql.unsafe(schemaSql);
      await sql.unsafe(`
        INSERT INTO users (id, username, email)
        VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin@omnibrain.local')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO conversations (id, user_id, title)
        VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Historial Global')
        ON CONFLICT (id) DO NOTHING;
      `);
      await sql.end();
    }
  } else {
    // ── SQLite ──────────────────────────────────────────────────────────────
    console.log("[db] Sincronizando esquema en SQLite...");

    if (typeof Bun !== "undefined") {
      // Bun nativo
      const { Database } = await import("bun:sqlite");
      const sqliteDb = new Database(dbUrl);
      sqliteDb.run(schemaSql);
      sqliteDb.run(`
        INSERT OR IGNORE INTO users (id, username, email)
        VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin@omnibrain.local');

        INSERT OR IGNORE INTO conversations (id, user_id, title)
        VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Historial Global');
      `);
      sqliteDb.close();
    } else {
      // Node.js (sql.js - WASM / No-Compile)
      const initSqlJs = (await import("sql.js")).default;
      const { readFileSync, existsSync, writeFileSync } = await import("fs");

      const SQL = await initSqlJs();
      let fileBuffer: Uint8Array | undefined;

      if (existsSync(dbUrl)) {
        fileBuffer = readFileSync(dbUrl);
      }

      const sqliteDb = new SQL.Database(fileBuffer);
      sqliteDb.run(schemaSql);
      sqliteDb.run(`
        INSERT OR IGNORE INTO users (id, username, email)
        VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin@omnibrain.local');

        INSERT OR IGNORE INTO conversations (id, user_id, title)
        VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Historial Global');
      `);

      // Persistir cambios a disco
      const data = sqliteDb.export();
      const buffer = Buffer.from(data);
      writeFileSync(dbUrl, buffer);
      sqliteDb.close();
      console.log(`[db] Schema sincronizado y guardado en ${dbUrl}`);
    }

  }
}

export function ensureDatabaseReady() {
  if (!initPromise) {
    initPromise = (async () => {
      console.log("[db] Verificando esquema...");
      await runSchemaSync(); // Sincronizar el esquema primero (disco -> WASM -> disco)
      await buildDb();       // Inicializar el singleton después (carga el disco actualizado)
      console.log("[db] Esquema listo");
    })();
  }

  return initPromise;
}
