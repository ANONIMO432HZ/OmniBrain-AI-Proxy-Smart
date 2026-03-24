# Plan de desarrollo por fases: API unificada para servicios IA

Fecha: 2026-03-23
Proyecto base: `cubepath-bun-api-backup` (versión ideal) + ideas de `bun-ai-api` para fallback y balanceo.
Objetivo: API de prueba + integración con Claude Code para conectar Cerebras, Groq, OpenRouter en un solo endpoint.

---

## Fase 1: MVP para pruebas internas (3-5 días)

### 1. Estructura inicial

- Carpeta base: `cubepath-bun-api-backup`.
- Ruta principal: `src/routes/chat.ts` + `src/services/provider-router.ts`.
- DB mínima: tabla `users` + `conversations` + `messages` (ya existente).

### 2. Endpoint de chat unificado

- `POST /api/chat` (body: `model`, `provider`, `temperature`, `prompt`, `conversationId?`, `stream?`).
- `GET /health` activo.

### 3. Selección de proveedor

- Implementar `selectProvider()` con: `provider` explícito o rotación round-robin.
- Fallback: OpenRouter -> Cerebras -> Groq.

### 4. Streaming básico

- Soporte `stream: true` usando SSE o chunked response (según la plataforma Bun).
- Sin estado de sesión obligatorio.

### 5. Puntos técnicos de verificación (cuestionario)

1. ¿Qué proveedor quieres priorizar para pruebas iniciales?
2. ¿Se requiere autenticación (apiKey) o se usa acceso local?
3. ¿Debemos usar modo `gpt-4` / `gpt-3.5` de OpenRouter vs modelo propietario?

### 6. Criterios de éxito

- `/api/chat` responde con texto generado.
- Se puede invocar con `curl` y también desde Claude Code (Webhook HTTP).
- Health check OK.

---

## Fase 2: Integración de usuarios + historial + métricas (5-7 días)

### 1. Persistencia de mensajes

- Guardar cada prompt/response en `messages` + `conversationId`.
- Agregar API:
  - `GET /api/conversations/:id/messages`
  - `POST /api/conversations` + `PUT /api/conversations/:id`.

### 2. Autenticación ligera

- `Authorization: Bearer <token>` con `ENV_API_KEY` (backend dev).
- Rutas `/api/users` con CRUD.

### 3. Monitorización y métricas

- `GET /api/status/providers` (up/down, latencia).
- Logging en `src/lib/logging.ts` con `requestId`.

### 4. Configuración y tests de integración

- Documentar `.env.sample` (CEREBRAS_KEY, GROQ_KEY, OPENROUTER_KEY, DATABASE_URL).
- Tests e2e usando un script `bun test` (o AVA, dependencias existentes).

### 5. Cuestionario técnico

1. ¿Qué requisitos de seguridad (CORS, rate limiting, roles) son obligatorios?
2. ¿Se aceptan tokens de servicio con expiración/refresh?
3. ¿Necesitas soporte de multi-tenant (proyectos independientes)?

---

## Fase 3: Pruebas de carga + despliegue + refinamiento (7-10 días)

### 1. Rendimiento/concurrente

- Benchmarks con `wrk` (100-500 RPS) para `/api/chat` y `/api/users`.
- Ajustes de pool DB, timeouts provider.

### 2. Alta disponibilidad

- Health check avanzada + circuito abierto (circuit breaker) a proveedores
- Regla de fallback automática si dependencia no responde.

### 3. Integración Claude Code

- Documentación: cómo configurar Claude Code para consumir `/api/chat`.
- Ejemplo JSON de payload y manejo de streaming.

### 4. QA y entrega

- `{docs/usage.md}` con ejemplos curl + JS + Claude Code.
- Checklist final: endpoints + tests + cobertura + despliegue local.

### 5. Cuestionario técnico

1. ¿En qué entorno se planifica desplegar (Railway, Fly.io, Vercel, local)?
2. ¿Necesitas soporte SSL/TLS gestionado o nginx reverse proxy?
3. ¿Se requiere rollback automáticos con CI/CD?

---

## Artefactos entregables

- `docs/plans/2026-03-23-api-unificada-plan.md` (este documento)
- `README.md` con guías de arranque y `curl`
- `src/services/provider-router.ts` + `src/routes/api/chat.ts`
- tests e2e script

## Notas finales

- El plan usa `cubepath-bun-api-backup` como base real de código.
- `bun-ai-api` puede ser referencia para la capa de fallback/round robin.
- Revisión semanal sugerida con iteraciones cortas y ajustes tras feedback de Claude Code.
