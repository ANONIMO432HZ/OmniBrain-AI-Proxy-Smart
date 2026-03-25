export type RouteHandler = (
  req: Request,
  params: Record<string, string>,
) => Promise<Response> | Response;

interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

class Router {
  private routes: Route[] = [];

  private add(method: string, path: string, handler: RouteHandler) {
    const paramNames: string[] = [];
    const pattern = new RegExp(
      "^" +
        path.replace(/:(\w+)/g, (_, name) => {
          paramNames.push(name);
          return "([^/]+)";
        }) +
        "$",
    );
    this.routes.push({ method, pattern, paramNames, handler });
  }

  get(path: string, handler: RouteHandler) {
    this.add("GET", path, handler);
  }

  post(path: string, handler: RouteHandler) {
    this.add("POST", path, handler);
  }

  put(path: string, handler: RouteHandler) {
    this.add("PUT", path, handler);
  }

  delete(path: string, handler: RouteHandler) {
    this.add("DELETE", path, handler);
  }

  handle(method: string, pathname: string): { handler: RouteHandler; params: Record<string, string> } | null {
    // Normalizar pathname (quitar slash final si no es la raíz)
    const normalizedPath = pathname.length > 1 && pathname.endsWith("/") 
      ? pathname.slice(0, -1) 
      : pathname;

    for (const route of this.routes) {
      if (route.method !== method) continue;
      const match = normalizedPath.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1]!;
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }
}

export const router = new Router();
