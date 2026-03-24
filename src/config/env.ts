export const env = {
  OPENROUTER_API_KEY: Bun.env.OPENROUTER_API_KEY ?? "",
  GROQ_API_KEY: Bun.env.GROQ_API_KEY ?? "",
  CEREBRAS_API_KEY: Bun.env.CEREBRAS_API_KEY ?? "",
} as const;
