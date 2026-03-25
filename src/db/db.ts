import { drizzle as drizzleSqlite } from "drizzle-orm/bun-sqlite";
import { drizzle as drizzlePostgres } from "drizzle-orm/bun-sql";
import { Database } from "bun:sqlite";
import { sql } from "bun";
import * as pgSchema from "./schema/postgres";
import * as sqliteSchema from "./schema/sqlite";

export let dbUrl = Bun.env.DATABASE_URL || "./data/api.db";

// 🚀 Soporte para Dokploy (Si Dokploy inyecta variables individuales de Postgres)
if (Bun.env.POSTGRES_HOST && Bun.env.POSTGRES_DB) {
  const user = Bun.env.POSTGRES_USER || "postgres";
  const pass = Bun.env.POSTGRES_PASSWORD || "";
  const host = Bun.env.POSTGRES_HOST;
  const port = Bun.env.POSTGRES_PORT || "5432";
  const dbName = Bun.env.POSTGRES_DB;
  dbUrl = `postgres://${user}:${pass}@${host}:${port}/${dbName}`;
}

export const isPostgres = dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://");

export const db = isPostgres 
  ? drizzlePostgres(sql, { schema: pgSchema })
  : drizzleSqlite(new Database(dbUrl), { schema: sqliteSchema });

export const schema = isPostgres ? pgSchema : sqliteSchema;

console.log(`[db] Conectado a base de datos en modo: ${isPostgres ? "PostgreSQL" : "SQLite"}`);
