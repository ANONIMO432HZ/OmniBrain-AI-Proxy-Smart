import { env } from "./src/config/env";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const modelToSend = "meta-llama/llama-4-scout-17b-16e-instruct";

async function run() {
  console.log("--- RAW GROQ STREAM TEST ---");
  console.log("Modelo:", modelToSend);

  const response = await fetch(GROQ_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelToSend,
      messages: [{ role: "user", content: "Hola, ¿qué modelo eres?" }],
      stream: true,
    }),
  });

  console.log("HTTP Status:", response.status);
  console.log("Headers:", JSON.stringify([...response.headers.entries()]));

  if (!response.body) {
    console.error("No hay response body!");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunkStr = decoder.decode(value);
    console.log(">>> RAW CHUNK START >>>");
    console.log(chunkStr);
    console.log("<<< RAW CHUNK END <<<");
  }

  console.log("--- STREAM COMPLETADO ---");
}

run();
