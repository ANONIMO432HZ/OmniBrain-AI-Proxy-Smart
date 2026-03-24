import { sql } from "bun";
import { ensureDatabaseReady } from "./init";

async function migrate() {
  console.log("Ejecutando migración...");
  await ensureDatabaseReady();

  console.log("Migración completada correctamente");
  await sql.close();
}

migrate().catch((err) => {
  console.error("Error en migración:", err);
  process.exit(1);
});
