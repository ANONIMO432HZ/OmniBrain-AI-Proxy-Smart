import { env } from "../src/config/env";

const ZAI_BASE_URL = "https://api.z.ai/api/paas/v4/chat/completions";

async function run() {
  console.log("--- TEST Z.AI RAW STREAM ---");
  
  const response = await fetch(ZAI_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ZAI_API_KEY}`,
      "Content-Type": "application/json",
      "Accept-Language": "en-US,en"
    },
    body: JSON.stringify({
      model: "glm-4.7-flash",
      messages: [{ role: "user", content: "Hola, cuéntame un chiste corto." }],
      stream: true,
    }),
  });

  console.log("Response Status:", response.status, response.statusText);
  
  if (!response.body) {
    console.error("No response body!");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log("\n--- STREAM FINALIZADO ---");
        break;
      }
      const chunk = decoder.decode(value);
      console.log(`[RAW CHUNK]:\n${chunk}`);
    }
  } catch (err) {
    console.error("Error durante lectura del stream:", err);
  }
}

run();
