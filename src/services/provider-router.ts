import { openRouter } from "./openrouter";
import { groqProvider } from "./groq";
import { cerebrasProvider } from "./cerebras";
import { mockProvider } from "./mock";
import type { AIProvider, ChatParams, StreamChunk } from "../types/provider";

interface ProviderState {
  provider: AIProvider;
  inactiveUntil: number; // Timestamp hasta el cual está en cooldown
}

// Lista de proveedores REALES para el Circuit Breaker y Fallback
const providers: ProviderState[] = [
  { provider: openRouter, inactiveUntil: 0 },
  { provider: groqProvider, inactiveUntil: 0 },
  { provider: cerebrasProvider, inactiveUntil: 0 },
];

export const providerRouter = {
  async *chat(params: ChatParams): AsyncGenerator<StreamChunk> {
    const now = Date.now();
    
    // Si no se especifica modelo, asignamos uno real por defecto para el waterfall
    if (!params.model) {
      console.log(`[router] Sin modelo especificado. Asignando 'llama-3.3-70b-versatile' por defecto.`);
      params.model = "llama-3.3-70b-versatile"; 
    }

    // ACCESO DIRECTO PARA PRUEBAS (Mock Agent)
    if (params.model === "fail-first" || params.model === "default" || params.model === "mock") {
      console.log(`[router] Ejecutando atajo para pruebas con MockAgent (Modelo: ${params.model})`);
      const stream = mockProvider.chat(params);
      for await (const chunk of stream) {
        yield chunk;
      }
      return;
    }

    // Filtrar proveedores reales que estén disponibles y fuera de cooldown
    const available = providers.filter(
      (p) => p.provider.isAvailable() && p.inactiveUntil <= now
    );

    if (available.length === 0) {
      throw new Error("No hay proveedores disponibles o todos están en enfriamiento (cooldown).");
    }

    let lastError: Error | null = null;

    for (const state of available) {
      let chunkCount = 0;
      try {
        console.log(`[router] Intentando proveedor Real: ${state.provider.name}`);
        
        const stream = state.provider.chat(params);
        for await (const chunk of stream) {
          chunkCount++;
          yield chunk;
        }
        
        console.log(`[router] ${state.provider.name} completó el stream exitosamente.`);
        return; 

      } catch (err: any) {
        console.error(`[router] Error en ${state.provider.name}: ${err.message}`);
        lastError = err;
        
        state.inactiveUntil = Date.now() + 60000;
        console.log(`[router] ${state.provider.name} puesto en cooldown por 60s.`);

        if (chunkCount > 0) {
          console.error(`[router] El proveedor falló mid-stream. No se puede re-enrutar de forma segura.`);
          throw err;
        }

        console.log(`[router] Intentando el siguiente proveedor disponible...`);
      }
    }

    throw new Error(`Todos los proveedores fallaron. Último error: ${lastError?.message}`);
  }
};
