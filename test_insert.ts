import { db, schema } from "./src/db/db";

async function main() {
  try {
    const id = crypto.randomUUID();
    console.log("Generando insert para ID:", id);
    await (db as any).insert(schema.messages).values({
      id: id,
      conversationId: "00000000-0000-0000-0000-000000000000",
      role: "user",
      content: "Mensaje de prueba manual " + Date.now(),
    });
    console.log("✅ [TEST] Insert Exitoso!");

    const rows = await (db as any).select().from(schema.messages);
    console.log("Filas Totales en DB:", rows.map((r: any) => ({ role: r.role, content: r.content })));
  } catch (err: any) {
    console.error("❌ [TEST] Fallo Insert:", err.message);
  }
}

main();
