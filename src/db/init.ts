import { sql } from "bun";
import { Database } from "bun:sqlite";
import { dbUrl, isPostgres } from "./db";

let initPromise: Promise<void> | null = null;

async function runSchemaSync() {
  const schemaFile = isPostgres
    ? import.meta.dir + "/schema.sql" // El original es Postgres
    : import.meta.dir + "/schema.sqlite.sql";

  const schema = await Bun.file(schemaFile).text();

  if (isPostgres) {
    console.log("[db] Sincronizando esquema en PostgreSQL...");
    await sql.unsafe(schema);

    // 🚀 Seeding Default global (Fase 2.2)
    await sql.unsafe(`
      INSERT INTO users (id, username, email) 
      VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin@omnibrain.local') 
      ON CONFLICT (id) DO NOTHING;
      
      INSERT INTO conversations (id, user_id, title) 
      VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Historial Global') 
      ON CONFLICT (id) DO NOTHING;
    `);
  } else {
    console.log("[db] Sincronizando esquema en SQLite...");
    // Para SQLite corremos el script directo en bun:sqlite para evitar dialect-blocks
    const sqliteDb = new Database(dbUrl);
    
    // Preparar y correr el batch (run() con varias sentencias puede fallar en bun:sqlite 
    // si no se divide, pero bun:sqlite .run() soporta comandos secuenciales con backticks o ejecutando bloque a bloque)
    // Para simplificar, bun:sqlite soporta ejecutar multi-statement divididos o ejecutados en un solo bloque si el script lo permite.
    sqliteDb.run(schema);

    // 🚀 Seeding Default global (Fase 2.2)
    sqliteDb.run(`
      INSERT OR IGNORE INTO users (id, username, email) 
      VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin@omnibrain.local');
      
      INSERT OR IGNORE INTO conversations (id, user_id, title) 
      VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Historial Global');
    `);

    sqliteDb.close();
  }
}

export function ensureDatabaseReady() {
  if (!initPromise) {
    initPromise = (async () => {
      console.log("[db] Verificando esquema...");
      await runSchemaSync();
      console.log("[db] Esquema listo");
    })();
  }

  return initPromise;
}
