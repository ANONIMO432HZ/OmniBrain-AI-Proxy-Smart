import { openRouter } from "./openrouter";
import { groqProvider } from "./groq";
import { cerebrasProvider } from "./cerebras";
import { zaiProvider } from "./zai";
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
  { provider: zaiProvider, inactiveUntil: 0 },
];

export const providerRouter = {
  async *chat(params: ChatParams): AsyncGenerator<StreamChunk> {
    const now = Date.now();
    
    // SOPORTE PARA AUTO-DIRECCIONADO POR PROVEEDOR (auto:groq, auto:openrouter)
    let forceProvider: string | null = null;
    if (params.model && params.model.startsWith("auto:")) {
      forceProvider = params.model.split(":")[1] || null; // "groq", "openrouter", "cerebras"
      console.log(`[router] Forzando uso exclusivo del proveedor: ${forceProvider}`);
      
      // Asignar modelo por defecto para ese proveedor
      if (forceProvider === "groq") params.model = "llama-3.3-70b-versatile";
      if (forceProvider === "openrouter") params.model = "openrouter/free";
      if (forceProvider === "cerebras") params.model = "llama3.1-8b";
      if (forceProvider === "zai") params.model = "glm-4.7-flash";
    }

    const isAutoGlobal = !params.model;
    if (isAutoGlobal) {
      console.log(`[router] Sin modelo especificado. Asignando 'openrouter/free' por defecto.`);
      params.model = "openrouter/free"; 
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
      (p) => {
        const isAv = p.provider.isAvailable() && p.inactiveUntil <= now;
        if (!forceProvider) return isAv;
        return isAv && p.provider.id.toLowerCase() === forceProvider.toLowerCase();
      }
    );

    if (available.length === 0) {
      throw new Error("No hay proveedores disponibles o todos están en enfriamiento (cooldown).");
    }

    // ORDENAR PROVEEDORES SEGÚN EL MODELO (Smart Routing)
    const sortedAvailable = [...available].sort((a, b) => {
      const nameA = a.provider.name.toLowerCase();
      const nameB = b.provider.name.toLowerCase();
      const m = params.model!.toLowerCase();

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

      return 0; // Mantener orden por defecto
    });

    let lastError: Error | null = null;
    let firstError: Error | null = null; // Guardar el error del proveedor priorizado
    const failedProvidersDetails: string[] = [];

    for (const state of sortedAvailable) {
      let chunkCount = 0;
      try {
        console.log(`[router] Intentando proveedor Real: ${state.provider.name} para modelo ${params.model}`);
        
        const currentParams = { ...params };
        if (isAutoGlobal && state.provider.id !== "openrouter") {
          delete currentParams.model; // Permitir que el proveedor use su modelo por defecto nativo
        }

        const stream = state.provider.chat(currentParams);
        for await (const chunk of stream) {
          chunkCount++;
          yield chunk;
        }
        
        // BUGFIX: Si el proveedor completó el stream pero no arrojó absolutamente ningún chunk, asumimos que falló silenciosamente
        if (chunkCount === 0) {
           throw new Error(`El proveedor ${state.provider.name} cerró el stream sin arrojar contenido/tokens.`);
        }

        console.log(`[router] ${state.provider.name} completó el stream exitosamente.`);
        return; 

      } catch (err: any) {
        const errMsg = err.message ? err.message : String(err);
        console.error(`[router] Error en ${state.provider.name}: ${errMsg}`);
        lastError = err;
        if (!firstError) firstError = err; // Guardamos el primer error para feedback
        
        failedProvidersDetails.push(`🔴 [${state.provider.name}] -> ${errMsg}`);

        // Evitamos meter en cooldown si es un error de modelo no soportado (404 / 400)
        const isModelError = errMsg.includes("404") || errMsg.includes("model") || errMsg.includes("400") || errMsg.includes("not found") || errMsg.includes("sin arrojar contenido");
        
        if (!isModelError) {
          state.inactiveUntil = Date.now() + 60000;
          console.log(`[router] ${state.provider.name} puesto en cooldown por 60s debido a error de conexión/servidor.`);
        } else {
          console.log(`[router] ${state.provider.name} no soporta este modelo o falló silenciosamente. Saltando sin cooldown.`);
        }

        if (chunkCount > 0) {
          console.error(`[router] El proveedor falló mid-stream. No se puede re-enrutar de forma segura.`);
          throw err;
        }

        console.log(`[router] Intentando el siguiente proveedor disponible...`);
      }
    }

    throw new Error(`Todos los proveedores fallaron.\n\nDetalles:\n${failedProvidersDetails.join("\n")}`);
  }
};
