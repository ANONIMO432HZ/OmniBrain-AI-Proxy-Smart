import { openRouter } from "../src/services/openrouter";
import { groqProvider } from "../src/services/groq";
import { cerebrasProvider } from "../src/services/cerebras";
import { zaiProvider } from "../src/services/zai";

const providers = [
  { provider: openRouter },
  { provider: groqProvider },
  { provider: cerebrasProvider },
  { provider: zaiProvider },
];

function testSort(model: string) {
  const m = model.toLowerCase();
  
  const sorted = [...providers].sort((a, b) => {
    const nameA = a.provider.name.toLowerCase();
    const nameB = b.provider.name.toLowerCase();

    // Priorizar OpenRouter para modelos free o google/
    const isOpenRouterModel = m.includes(":free") || m.includes("/free") || m.includes("google/");
    
    if (isOpenRouterModel && nameA === "openrouter") return -1;
    if (isOpenRouterModel && nameB === "openrouter") return 1;

    // Priorizar Groq para Llama 4 y Llama 3.3 versatile
    if ((m.includes("versatile") || m.includes("llama-4-scout")) && nameA === "groq") return -1;
    if ((m.includes("versatile") || m.includes("llama-4-scout")) && nameB === "groq") return 1;

    // Priorizar Cerebras para sus modelos específicos
    if ((m.startsWith("llama3.1-") || m.includes("qwen-3-235b")) && nameA === "cerebras") return -1;
    if ((m.startsWith("llama3.1-") || m.includes("qwen-3-235b")) && nameB === "cerebras") return 1;

    // Priorizar Z.AI para modelos GLM
    if (m.startsWith("glm-") && nameA === "z.ai") return -1;
    if (m.startsWith("glm-") && nameB === "z.ai") return 1;

    return 0;
  });

  console.log(`\n--- ORDEN PARA [${model}] ---`);
  sorted.forEach((p, i) => console.log(`${i+1}. ${p.provider.name}`));
}

testSort("glm-4.7-flash");
testSort("llama-4-scout-17b-16e-instruct");
testSort("openrouter/free");
testSort("google/gemini-2.0");
