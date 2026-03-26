import { expect, test, describe, mock, beforeEach, afterEach } from "bun:test";

// Mocking dependencies BEFORE importing index/routes
mock.module("../src/db/db", () => ({
  db: {
    insert: () => ({ values: () => Promise.resolve() })
  },
  schema: {
    messages: {},
    providerMetrics: {}
  }
}));

mock.module("../src/config/env", () => ({
  env: {
    LOCAL_API_KEY: "test-key"
  }
}));

// Mock del router de proveedores para evitar llamadas reales
const mockChat = mock();
mock.module("../src/services/provider-router", () => ({
  providerRouter: {
    chat: mockChat
  }
}));

import { handleHttpRequest } from "../index";

describe("E2E API v1", () => {
  test("GET /health debe retornar ok", async () => {
    const res = await handleHttpRequest(new Request("http://localhost/health"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.status).toBe("ok");
  });

  test("POST /v1/chat/completions debe fallar sin API Key (401)", async () => {
    const res = await handleHttpRequest(new Request("http://localhost/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({ message: "hola" })
    }));
    expect(res.status).toBe(401);
  });

  test("POST /v1/chat/completions debe fallar con body vacío (400)", async () => {
    const res = await handleHttpRequest(new Request("http://localhost/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer test-key" },
      body: JSON.stringify({})
    }));
    expect(res.status).toBe(400);
  });

  test("POST /v1/chat/completions debe iniciar stream exitoso (formato native)", async () => {
    // Setup mock stream
    async function* fakeStream() {
      yield { provider: "Mock", content: "Hola", model: "test" };
      yield { content: " mundo" };
    }
    mockChat.mockImplementation(() => fakeStream());

    const res = await handleHttpRequest(new Request("http://localhost/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer test-key",
        "Content-Type": "application/json",
        "X-Omnibrain-Format": "native",  // 👈 Forzar formato native SSE
      },
      body: JSON.stringify({ message: "hola" })
    }));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/event-stream");

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }
    }

    expect(result).toContain("event: meta");
    expect(result).toContain("event: delta");
    expect(result).toContain('"content":"Hola"');
    expect(result).toContain('"content":" mundo"');
    expect(result).toContain("event: done");
  });

  test("POST /v1/chat/completions debe iniciar stream exitoso (formato openai)", async () => {
    async function* fakeStream() {
      yield { provider: "Mock", content: "Hola", model: "test" };
      yield { content: " mundo" };
    }
    mockChat.mockImplementation(() => fakeStream());

    const res = await handleHttpRequest(new Request("http://localhost/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer test-key",
        "Content-Type": "application/json",
        // Sin X-Omnibrain-Format → formato OpenAI por defecto
      },
      body: JSON.stringify({ message: "hola" })
    }));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/event-stream");

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }
    }

    expect(result).toContain("chat.completion.chunk");
    expect(result).toContain('"content":"Hola"');
    expect(result).toContain('"content":" mundo"');
    expect(result).toContain("[DONE]");
  });
});
