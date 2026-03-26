import { providerRouter } from "./src/services/provider-router";

async function run() {
  console.log("--- PROBANDO ROUTER CON LLAMA 4 ---");
  try {
    const stream = providerRouter.chat({
      model: "llama-4-scout-17b-16e-instruct",
      messages: [{ role: "user", content: "hola" }],
      temperature: 0.7
    });

    for await (const chunk of stream) {
      if (chunk.content) process.stdout.write(chunk.content);
    }
    console.log("\n--- EXITO ---");
  } catch (err: any) {
    console.error("\n[Error Capturado por Test]:", err.message || err);
    if (err.stack) console.error(err.stack);
  }
}

run();
