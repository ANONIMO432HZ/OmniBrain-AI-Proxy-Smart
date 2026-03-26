import { providerRouter } from "../src/services/provider-router";

async function run() {
  console.log("--- TEST ROUTER DIRECT: glm-4.7-flash ---");
  try {
    const stream = providerRouter.chat({
      model: "glm-4.7-flash",
      messages: [{ role: "user", content: "Hola, ¿qué modelo eres?" }],
    });

    for await (const chunk of stream) {
      if (chunk.content) {
        process.stdout.write(chunk.content);
      }
    }
    console.log("\n--- FIN DEL STREAM ---");
  } catch (err: any) {
    console.error("\n[Error en Router Directo]:", err.message || err);
    if (err.stack) console.error(err.stack);
  }
}

run();
