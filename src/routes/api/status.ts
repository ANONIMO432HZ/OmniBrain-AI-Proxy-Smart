import { db, schema } from "../../db/db";
import { env } from "../../config/env";
import { sql, desc } from "drizzle-orm";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function getProviderStatus(req: Request) {
  // Opcional: Proteger con API KEY para evitar exposición de métricas internas
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${env.LOCAL_API_KEY}`) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }

  try {
    // Obtener las últimas 50 métricas
    const recentMetrics = await (db as any)
      .select()
      .from(schema.providerMetrics)
      .orderBy(desc(schema.providerMetrics.createdAt))
      .limit(50);

    // Calcular estadísticas por proveedor
    const stats: Record<string, any> = {};
    
    for (const m of recentMetrics) {
      if (!stats[m.provider]) {
        stats[m.provider] = {
          requests: 0,
          avgLatency: 0,
          successRate: 0,
          errors: 0,
          lastStatus: m.status
        };
      }
      
      stats[m.provider].requests++;
      if (m.status === "200") {
        stats[m.provider].successRate++;
        stats[m.provider].avgLatency += parseInt(m.latencyMs || "0");
      } else {
        stats[m.provider].errors++;
      }
    }

    // Finalizar promedios
    for (const p in stats) {
      const successes = stats[p].successRate;
      stats[p].avgLatency = successes > 0 ? Math.round(stats[p].avgLatency / successes) : 0;
      stats[p].successRate = Math.round((successes / stats[p].requests) * 100);
    }

    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      providers: stats,
      recent: recentMetrics.slice(0, 5)
    }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }
}
