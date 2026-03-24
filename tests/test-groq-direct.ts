import { groqProvider } from "./src/services/groq";

async function run() {
  console.log("--- TEST GROQ DIRECT: llama-4-scout-17b-16e-instruct ---");
  try {
    const stream = groqProvider.chat({
      model: "llama-4-scout-17b-16e-instruct",
      messages: [{ role: "user", content: "Hola, ¿qué modelo eres?" }],
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta && chunk.choices[0].delta.content) {
        process.stdout.write(chunk.choices[0].delta.content);
      }
    }
    console.log("\n--- FIN DEL STREAM ---");
  } catch (err: any) {
    console.error("\n[Error en Test Directo]:", err.message || err);
    if (err.stack) console.error(err.stack);
  }
}

run();
