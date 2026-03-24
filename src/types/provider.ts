export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ToolCallFunction {
  name: string;
  arguments: string; // Cadena JSON: '{"locacion": "Santiago"}'
}

export interface ToolCall {
  id: string;
  type: "function";
  function: ToolCallFunction;
}

export interface ChatMessage {
  role: ChatRole;
  content: string | null;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string; // Para respuestas de herramientas
}

export interface FunctionDefinition {
  name: string;
  description?: string;
  parameters?: Record<string, any>;
}

export interface ToolDefinition {
  type: "function";
  function: FunctionDefinition;
}

export interface ChatParams {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: ToolDefinition[]; // <-- Crítico para agentes
  tool_choice?: "none" | "auto" | { type: "function"; function: { name: string } };
}

export interface StreamChunk {
  content?: string;
  reasoning?: string; // Textos de razonamiento (pensamientos)
  tool_calls?: ToolCall[]; // Para streaming de ejecuciones
  finishReason?: string;
  reasoningTokens?: number;
}

export interface AIProvider {
  name: string;
  id: string;
  isAvailable(): boolean;
  chat(params: ChatParams): AsyncGenerator<StreamChunk>;
}
