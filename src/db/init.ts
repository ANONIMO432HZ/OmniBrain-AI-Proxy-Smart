import { sql } from "bun";

let initPromise: Promise<void> | null = null;

async function runSchemaSync() {
  const schema = await Bun.file(import.meta.dir + "/schema.sql").text();
  await sql.unsafe(schema);
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
