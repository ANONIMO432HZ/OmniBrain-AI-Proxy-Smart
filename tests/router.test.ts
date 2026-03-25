import { expect, test, describe } from "bun:test";
import { Router } from "../src/lib/router";

describe("Router", () => {
  test("debe registrar y coincidir una ruta básica", () => {
    const router = new Router();
    const handler = () => new Response("ok");
    router.get("/test", handler);

    const match = router.handle("GET", "/test");
    expect(match).not.toBeNull();
    expect(match?.handler).toBe(handler);
  });

  test("debe extraer parámetros dinámicos", () => {
    const router = new Router();
    const handler = () => new Response("ok");
    router.get("/users/:id", handler);

    const match = router.handle("GET", "/users/123");
    expect(match).not.toBeNull();
    expect(match?.params.id).toBe("123");
  });

  test("debe normalizar slashes finales", () => {
    const router = new Router();
    const handler = () => new Response("ok");
    router.get("/v1/chat", handler);

    const match = router.handle("GET", "/v1/chat/");
    expect(match).not.toBeNull();
    expect(match?.handler).toBe(handler);
  });

  test("debe retornar null para rutas inexistentes", () => {
    const router = new Router();
    router.get("/v1/chat", () => new Response("ok"));

    const match = router.handle("GET", "/v404");
    expect(match).toBeNull();
  });

  test("debe distinguir por método HTTP", () => {
    const router = new Router();
    router.get("/item", () => new Response("get"));
    router.post("/item", () => new Response("post"));

    const getMatch = router.handle("GET", "/item");
    const postMatch = router.handle("POST", "/item");

    expect(getMatch).not.toBeNull();
    expect(postMatch).not.toBeNull();
    // No podemos comparar handlers directamente si son anónimos, pero handle() los separa
    expect(getMatch?.handler).not.toBe(postMatch?.handler);
  });
});
