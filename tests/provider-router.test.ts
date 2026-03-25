/**
 * Tests de Resiliencia del ProviderRouter
 * 
 * NOTA TÉCNICA: No usamos `mock.module` para el db aquí porque Bun cachea los módulos
 * entre archivos de test. En su lugar, probamos la lógica de resiliencia directamente
 * simulando el comportamiento del router sin tocar el módulo real.
 * La cobertura real de la integración con DB se hace en e2e.test.ts.
 */
import { expect, test, describe } from "bun:test";
import type { AIProvider, ChatParams, StreamChunk } from "../src/types/provider";

// ============================================================================
// IMPLEMENTACIÓN LOCAL DEL CIRCUIT BREAKER (espejo simplificado del router real)
// para probar la lógica sin efectos secundarios de módulos
// ============================================================================
interface ProviderState {
  provider: AIProvider;
  inactiveUntil: number;
  failCount: number;
}

async function* testRouter(
  providers: ProviderState[],
  params: ChatParams
): AsyncGenerator<StreamChunk> {
  const now = Date.now();
  const available = providers.filter(p => p.provider.isAvailable() && p.inactiveUntil <= now);

  if (available.length === 0) throw new Error("No hay proveedores disponibles");

  let lastError: Error | null = null;

  for (const state of available) {
    let chunkCount = 0;
    try {
      const stream = state.provider.chat(params);
      let firstChunk = true;
      for await (const chunk of stream) {
        if (firstChunk) {
          chunk.provider = state.provider.name;
          firstChunk = false;
        }
        chunkCount++;
        yield chunk;
      }
      if (chunkCount === 0) throw new Error(`${state.provider.name}: stream vacío`);
      state.failCount = 0;
      return;
    } catch (err: any) {
      lastError = err;
      const isModelError = err.message.includes("404") || err.message.includes("model");
      if (!isModelError) {
        state.failCount++;
        if (state.failCount >= 3) {
          state.inactiveUntil = Date.now() + 300000;
        }
      }
      if (chunkCount > 0) throw err;
    }
  }

  throw new Error(`Todos los proveedores fallaron: ${lastError?.message}`);
}

// ============================================================================
// TESTS
// ============================================================================

describe("Resiliencia del Router (Circuit Breaker Logic)", () => {
  test("debe rotar al segundo proveedor si el primero falla con 429", async () => {
    const provider1: AIProvider = {
      name: "FailProvider", id: "fail",
      isAvailable: () => true,
      async *chat() { throw new Error("429 Rate Limit"); }
    };
    const provider2: AIProvider = {
      name: "SuccessProvider", id: "success",
      isAvailable: () => true,
      async *chat() { yield { content: "Respuesta exitosa" }; }
    };

    const providers: ProviderState[] = [
      { provider: provider1, inactiveUntil: 0, failCount: 0 },
      { provider: provider2, inactiveUntil: 0, failCount: 0 }
    ];

    const chunks: StreamChunk[] = [];
    for await (const chunk of testRouter(providers, { messages: [] })) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]!.provider).toBe("SuccessProvider");
    expect(chunks[0]!.content).toBe("Respuesta exitosa");
  });

  test("debe incrementar failCount y activar cooldown tras 3 fallos", async () => {
    const failingProvider: AIProvider = {
      name: "ConstantFail", id: "const-fail",
      isAvailable: () => true,
      async *chat() { throw new Error("500 Internal Server Error"); }
    };

    const providers: ProviderState[] = [
      { provider: failingProvider, inactiveUntil: 0, failCount: 0 }
    ];

    // Intentos 1, 2, 3
    for (let i = 0; i < 3; i++) {
      try { for await (const _ of testRouter(providers, { messages: [] })) {} } catch {}
    }

    expect(providers[0]!.failCount).toBe(3);
    expect(providers[0]!.inactiveUntil).toBeGreaterThan(Date.now());
  });

  test("no debe incrementar failCount si el error es de modelo no soportado (404)", async () => {
    const modelErrorProvider: AIProvider = {
      name: "ModelNotFound", id: "mnf",
      isAvailable: () => true,
      async *chat() { throw new Error("404 model not found"); }
    };

    const providers: ProviderState[] = [
      { provider: modelErrorProvider, inactiveUntil: 0, failCount: 0 }
    ];

    try { for await (const _ of testRouter(providers, { messages: [] })) {} } catch {}

    // failCount NO debe incrementarse para errores de modelo
    expect(providers[0]!.failCount).toBe(0);
    expect(providers[0]!.inactiveUntil).toBe(0);
  });

  test("debe saltar proveedores en cooldown", async () => {
    const cooldownProvider: AIProvider = {
      name: "Cooldown", id: "cooldown",
      isAvailable: () => true,
      async *chat() { yield { content: "No debería llegar aquí" }; }
    };
    const healthyProvider: AIProvider = {
      name: "Healthy", id: "healthy",
      isAvailable: () => true,
      async *chat() { yield { content: "OK desde provider sano" }; }
    };

    const providers: ProviderState[] = [
      { provider: cooldownProvider, inactiveUntil: Date.now() + 10000, failCount: 3 },
      { provider: healthyProvider, inactiveUntil: 0, failCount: 0 }
    ];

    const chunks: StreamChunk[] = [];
    for await (const chunk of testRouter(providers, { messages: [] })) {
      chunks.push(chunk);
    }

    expect(chunks[0]!.provider).toBe("Healthy");
  });

  test("debe lanzar error si todos los proveedores están en cooldown", async () => {
    const providers: ProviderState[] = [
      { provider: { name: "P1", id: "p1", isAvailable: () => true, async *chat() { yield {}; } }, inactiveUntil: Date.now() + 10000, failCount: 3 },
      { provider: { name: "P2", id: "p2", isAvailable: () => true, async *chat() { yield {}; } }, inactiveUntil: Date.now() + 10000, failCount: 3 }
    ];

    let threw = false;
    try { for await (const _ of testRouter(providers, { messages: [] })) {} } catch { threw = true; }
    expect(threw).toBe(true);
  });
});
