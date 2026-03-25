export const env = {
  OPENROUTER_API_KEY: Bun.env.OPENROUTER_API_KEY ?? "",
  GROQ_API_KEY: Bun.env.GROQ_API_KEY ?? "",
  CEREBRAS_API_KEY: Bun.env.CEREBRAS_API_KEY ?? "",
  ZAI_API_KEY: Bun.env.ZAI_API_KEY ?? "",
  LOCAL_API_KEY: Bun.env.LOCAL_API_KEY ?? "omnibrain-dev-token", // Token por defecto para el proxy
} as const;
