import { openRouter } from "./openrouter";
import { groqProvider } from "./groq";
import { cerebrasProvider } from "./cerebras";
import { zaiProvider } from "./zai";
import { mockProvider } from "./mock";
import { db, schema, saveIfSqlJs } from "../db/db";
import type { AIProvider, ChatParams, StreamChunk } from "../types/provider";


interface ProviderState {
  provider: AIProvider;
  inactiveUntil: number; // Timestamp hasta el cual está en cooldown
  failCount: number; // Conteo de fallos consecutivos
}


// Lista de proveedores REALES para el Circuit Breaker y Fallback
export const providers: ProviderState[] = [
  { provider: openRouter, inactiveUntil: 0, failCount: 0 },
  { provider: groqProvider, inactiveUntil: 0, failCount: 0 },
  { provider: cerebrasProvider, inactiveUntil: 0, failCount: 0 },
  { provider: zaiProvider, inactiveUntil: 0, failCount: 0 },
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



    // Identificar si estamos en enrutamiento global inteligente
    const isAutoGlobal = !params.model || params.model === "auto";
    if (isAutoGlobal) {
      console.log(`[router] Iniciando Smart Routing en modo Global.`);
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
    // PRIORIDAD PARA AUTO: Groq -> Cerebras -> Z.AI -> OpenRouter
    const sortedAvailable = [...available].sort((a, b) => {
      const idA = a.provider.id.toLowerCase();
      const idB = b.provider.id.toLowerCase();

      if (isAutoGlobal) {
        const priority = { "groq": 1, "cerebras": 2, "zai": 3, "openrouter": 4 };
        const pA = priority[idA as keyof typeof priority] || 99;
        const pB = priority[idB as keyof typeof priority] || 99;
        return pA - pB;
      }

      const m = params.model!.toLowerCase();

      // Priorizar OpenRouter para modelos free o google/
      const isOpenRouterModel = m.includes(":free") || m.includes("/free") || m.includes("google/");
      if (isOpenRouterModel && idA === "openrouter") return -1;
      if (isOpenRouterModel && idB === "openrouter") return 1;

      // Priorizar Groq para Llama 4 y Llama 3.3 versatile
      if ((m.includes("versatile") || m.includes("llama-4-scout")) && idA === "groq") return -1;
      if ((m.includes("versatile") || m.includes("llama-4-scout")) && idB === "groq") return 1;

      // Priorizar Cerebras para sus modelos específicos
      if ((m.startsWith("llama3.1-") || m.includes("qwen-3-235b")) && idA === "cerebras") return -1;
      if ((m.startsWith("llama3.1-") || m.includes("qwen-3-235b")) && idB === "cerebras") return 1;

      // Priorizar Z.AI para modelos GLM
      if (m.startsWith("glm-") && idA === "zai") return -1;
      if (m.startsWith("glm-") && idB === "zai") return 1;

      return 0; // Mantener orden por defecto
    });

    let lastError: Error | null = null;
    const failedProvidersDetails: string[] = [];

    for (const state of sortedAvailable) {
      let chunkCount = 0;
      const attemptStartedAt = Date.now();
      try {
        console.log(`[router] Intentando: ${state.provider.name} | Modelo: ${params.model || "auto"}`);
        
        const currentParams = { ...params };
        if (isAutoGlobal) {
          delete currentParams.model; // Permitir que cada proveedor use su mejor modelo por defecto
        }

        const stream = state.provider.chat(currentParams);
        let firstChunk = true;
        for await (const chunk of stream) {
          if (firstChunk) {
            chunk.provider = state.provider.name;
            chunk.model = params.model || "auto";
            firstChunk = false;
          }
          chunkCount++;
          yield chunk;
        }
        
        // BUGFIX: Si el proveedor completó el stream pero no arrojó absolutamente ningún chunk, asumimos que falló silenciosamente
        if (chunkCount === 0) {
           throw new Error(`El proveedor ${state.provider.name} cerró el stream sin arrojar contenido/tokens.`);
        }

        console.log(`[router] ${state.provider.name} completó el stream exitosamente.`);
        state.failCount = 0;
        
        // 📊 Guardar métrica de éxito
        try {
          await (db as any).insert(schema.providerMetrics).values({
            id: crypto.randomUUID(),
            provider: state.provider.name,
            model: params.model || "auto",
            latencyMs: (Date.now() - attemptStartedAt).toString(),
            status: "200",
            requestId: params.requestId,
          });
          saveIfSqlJs();
        } catch (dbErr) {
          console.error(`[db] Error guardando métrica éxito: ${dbErr}`);
        }

        return; 

      } catch (err: any) {
        const errMsg = err.message ? err.message : String(err);
        console.error(`[router] Error en ${state.provider.name}: ${errMsg}`);
        lastError = err;
        
        failedProvidersDetails.push(`🔴 [${state.provider.name}] -> ${errMsg}`);

        // Evitamos meter en cooldown si es un error de modelo no soportado (404 / 400)
        const isModelError = errMsg.includes("404") || errMsg.includes("model") || errMsg.includes("400") || errMsg.includes("not found") || errMsg.includes("sin arrojar contenido");
        
        if (!isModelError) {
          state.failCount++;
          if (state.failCount >= 3) {
            state.inactiveUntil = Date.now() + 300000; // 5 minutos de cooldown
            console.log(`[router] 💥 CRITICAL: ${state.provider.name} alcanzó 3 fallos. Enfriamiento por 5m.`);
          } else {
            console.log(`[router] ⚠️ Error en ${state.provider.name} (${state.failCount}/3).`);
          }
        } else {
          console.log(`[router] ${state.provider.name} no soporta este modelo o falló silenciosamente. Saltando sin cooldown.`);
        }

        // 📊 Guardar métrica de error por intento
        try {
          await (db as any).insert(schema.providerMetrics).values({
            id: crypto.randomUUID(),
            provider: state.provider.name,
            model: params.model || "auto",
            latencyMs: (Date.now() - attemptStartedAt).toString(),
            status: "500", // Error interno del proveedor
            requestId: params.requestId,
          });
          saveIfSqlJs();
        } catch (dbErr) {
          console.error(`[db] Error guardando métrica fallo: ${dbErr}`);
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
