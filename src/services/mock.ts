import type { AIProvider, ChatParams, StreamChunk } from "../types/provider";

export const mockProvider: AIProvider = {
  name: "MockAgent",
  id: "mock",
  isAvailable() {
    return true; // Siempre disponible para tests
  },
  async *chat(params: ChatParams): AsyncGenerator<StreamChunk> {
    if (params.model === "fail-first") {
      console.log("[mock] Lanzando error simulado para probar Fallback");
      throw new Error("Error simulado de proveedor (Rate Limit / 500)");
    }



    console.log(`[mock] Simulando respuesta para modelo: ${params.model || "mock-model"}`);

    if (params.tools && params.tools.length > 0) {
      // Usamos el operador ! porque la condición length > 0 garantiza que el índice 0 existe
      const toolName = params.tools[0]!.function.name;

      // Simular razonamiento previo a la llamada
      yield { content: "Pensando en qué herramienta usar..." };
      await new Promise((r) => setTimeout(r, 500));
      
      yield { content: "\nDecido llamar a la función: " };
      await new Promise((r) => setTimeout(r, 500));

      // Simular chunks de tool_calls
      yield {
        tool_calls: [
          {
            id: "call_abc123",
            type: "function",
            function: {
              name: toolName,
              arguments: "{\"loc"
            }
          }
        ]
      };
      
      await new Promise((r) => setTimeout(r, 300));

      yield {
        tool_calls: [
          {
            id: "call_abc123",
            type: "function",
            function: {
              name: toolName,
              arguments: "ation\":\"Santiago\"}"
            }
          }
        ],
        finishReason: "tool_calls"
      };
      
    } else {
      yield { content: "Hola, soy el AIProvider Mock. Veo que no has enviado herramientas." };
      yield { content: "\nPara testear tool_calls, añade el parámetro `tools` en tu request JSON." };
    }
  }
};
