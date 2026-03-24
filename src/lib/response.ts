export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function parseQuery(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)),
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset, searchParams: url.searchParams };
}
