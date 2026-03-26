// Carga .env en Node.js (no-op en Bun, que lo carga nativamente)
import "dotenv/config";

export const env = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? "",
  GROQ_API_KEY: process.env.GROQ_API_KEY ?? "",
  CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY ?? "",
  ZAI_API_KEY: process.env.ZAI_API_KEY ?? "",
  LOCAL_API_KEY: process.env.LOCAL_API_KEY ?? "omnibrain-dev-token",
} as const;
