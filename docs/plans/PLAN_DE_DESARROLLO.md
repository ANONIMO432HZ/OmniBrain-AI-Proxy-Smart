# Plan de Desarrollo - API Unificada de Servicios de IA

## Objetivo del Proyecto

Crear una API unificada que centralice múltiples proveedores de IA (OpenRouter, Groq, Cerebras) en un solo endpoint, diseñada específicamente para integración con herramientas de desarrollo como Claude Code.

---

## FASE 1: Fundación y Configuración

**Duración estimada:** 1-2 días
**Objetivo:** Preparar el proyecto base con estructura profesional

### Tareas Técnicas - Fase 1

1. **Estructura del proyecto**

   ```text
   src/
   ├── config/         # Variables de entorno y configuración
   ├── db/            # Base de datos SQLite
   ├── lib/           # Utilidades y helpers
   ├── routes/        # Endpoints HTTP
   │   └── api/       # API REST endpoints
   ├── services/      # Integraciones con proveedores
   ├── types/         # Definiciones TypeScript
   └── middleware/    # Middlewares (CORS, auth, logging)
   ```

2. **Configuración inicial**
   - [ ] Configurar `tsconfig.json` con strict mode
   - [ ] Configurar variables de entorno en `src/config/env.ts`
   - [ ] Configurar base de datos SQLite con `bun:sqlite`
   - [ ] Implementar sistema de migraciones

3. **Setup de dependencias**

   ```json
   {
     "dependencies": {
       "@openrouter/sdk": "^0.9.11",
       "groq-sdk": "^0.37.0",
       "@cerebras/cerebras_cloud_sdk": "^1.59.0"
     },
     "devDependencies": {
       "@types/bun": "latest",
       "typescript": "^5"
     }
   }
   ```

### Cuestionario Técnico - Fase 1

1. **Base de Datos**
   - ¿Qué datos necesitamos persistir? (conversaciones, mensajes, métricas, usuarios)
   - ¿Necesitamos soft-delete para mensajes/conversaciones?
   - ¿Implementamos paginación desde el inicio?

2. **Variables de Entorno**

   ```bash
   # Requeridas
   DATABASE_URL=./data/api.db

   # Proveedores (al menos uno)
   OPENROUTER_API_KEY=
   GROQ_API_KEY=
   CEREBRAS_API_KEY=

   # Configuración
   PORT=3000
   LOG_LEVEL=debug|info|warn|error
   ENABLE_CORS=true
   CORS_ORIGINS=*
   ```

3. **Logging**
   - ¿Qué nivel de detalle necesitamos para debug?
   - ¿Rotación de logs necesaria?
   - ¿Logs en formato JSON para producción?

### Checklist - Fase 1

- [ ] Estructura de carpetas creada
- [ ] Configuración de TypeScript lista
- [ ] Variables de entorno documentadas en `.env.example`
- [ ] Conexión a SQLite funciona
- [ ] Sistema de migraciones implementado
- [ ] Tests básicos pasan (`bun test`)

---

## FASE 2: Implementación de Servicios de IA

**Duración estimada:** 3-4 días
**Objetivo:** Integrar los tres proveedores de IA con interfaz unificada

### Tareas Técnicas - Fase 2

1. **Interfaz común para servicios**

   ```typescript
   // src/types/provider.ts
   export interface AIProvider {
     name: string;
     id: string;
     isAvailable(): boolean;
     chat(params: ChatParams): AsyncGenerator<StreamChunk>;
     listModels(): Promise<ModelInfo[]>;
   }

   export interface ChatParams {
     messages: ChatMessage[];
     model?: string;
     temperature?: number;
     maxTokens?: number;
   }

   export interface StreamChunk {
     content?: string;
     reasoningTokens?: number;
     finishReason?: string;
   }
   ```

2. **Implementación por proveedor**
   - [ ] **OpenRouter**: Usando SDK oficial
   - [ ] **Groq**: Implementación manual con fetch/SSE
   - [ ] **Cerebras**: Implementación manual con fetch/SSE

3. **Sistema de fallbacks**
   - [ ] Detectar cuando un proveedor falla
   - [ ] Rotar al siguiente proveedor disponible
   - [ ] Métricas de fallos por proveedor

### Cuestionario Técnico - Fase 2

1. **Gestión de errores**
   - ¿Retry automático si un proveedor falla? (cuántos intentos)
   - ¿Timeout por proveedor? (ej: 30s para Groq, 60s para OpenRouter)
   - ¿Cómo manejamos rate limits? (429, 503)

2. **Selección de modelos**
   - ¿Mapeamos modelos a proveedores automáticamente?
   - ¿Permitimos especificar proveedor explícitamente? (`provider:model`)
   - ¿Lista de modelos por defecto recomendados?

3. **Streaming SSE**
   - ¿Formato de eventos? (estándar SSE vs custom JSON)
   - ¿Heartbeat para mantener conexión viva?
   - ¿Manejo de reconexión del cliente?

### Checklist - Fase 2

- [ ] Interfaz AIProvider definida
- [ ] OpenRouter implementado y testeado
- [ ] Groq implementado y testeado
- [ ] Cerebras implementado y testeado
- [ ] Sistema de fallbacks funciona
- [ ] Cada servicio tiene tests unitarios
- [ ] Documentación de cada proveedor creada

---

## FASE 3: Endpoints REST y Router

**Duración estimada:** 2-3 días
**Objetivo:** Crear API REST completa con todas las funcionalidades

### Tareas Técnicas - Fase 3

1. **Endpoints core**

   ```text
   POST   /v1/chat/completions          # Chat principal
   GET    /v1/models                   # Lista modelos disponibles
   GET    /v1/providers                # Estado de proveedores
   GET    /v1/health                   # Health check

   POST   /v1/conversations            # Crear conversación
   GET    /v1/conversations/:id        # Obtener conversación
   DELETE /v1/conversations/:id        # Eliminar conversación
   GET    /v1/conversations/:id/messages  # Listar mensajes
   POST   /v1/conversations/:id/messages  # Agregar mensaje
   ```

2. **Router dinámico**
   - [ ] Implementar router con parámetros (`:id`)
   - [ ] Middleware de CORS
   - [ ] Middleware de logging de requests
   - [ ] Middleware de manejo de errores global

3. **Compatibilidad OpenAI**
   - [ ] Formatos de request/response compatibles con OpenAI
   - [ ] Streaming SSE compatible

### Cuestionario Técnico - Fase 3

1. **Versionado de API**
   - ¿Usamos versionado en URL (`/v1/`)?
   - ¿Headers `Accept-Version`?
   - ¿Cuántas versiones mantener activas?

2. **Paginación**
   - ¿Formato: offset/limit o cursor-based?
   - ¿Máximo de items por página?
   - ¿Incluir metadata (total, hasMore)?

3. **Autenticación** (Implementada en v0.4.0)
   - ¿API keys para usuarios?
   - ¿Rate limiting por API key?
   - ¿JWT para sesiones?

### Checklist - Fase 3

- [x] Endpoint `/v1/chat/completions` funciona
- [x] Endpoint `/v1/models` lista todos los modelos
- [x] Endpoint `/v1/status/providers` muestra estado (Observabilidad activa)
- [x] Endpoint `/v1/health` responde correctamente
- [x] CRUD de conversaciones funciona (Controladores v1)
- [x] Tests de integración pasan (Fase 3 validada)
- [x] Documentación de API (OpenAPI/Swagger en /openapi.json)

---

## FASE 4: Integración con Claude Code (EN PROGRESO)

**Duración estimada:** 2-3 días
**Objetivo:** Optimizar la API para uso específico con Claude Code

### Tareas Técnicas - Fase 4

1. **Mejoras para Claude Code**
   - [ ] Endpoint `/v1/claude/models` - Modelos recomendados para Claude
   - [x] Header `X-Omnibrain-Request-Id` para trazabilidad (Implementado en v0.3.0)
   - [ ] Formato de errores que Claude pueda parsear
   - [x] Metadata de reasoning tokens (Implementado en v0.3.0)

2. **Landing page interactiva**
   - [ ] UI para probar la API
   - [ ] Selector de modelos
   - [ ] Visualizador de streaming

3. **CLI/Tooling**
   - [ ] Script para testear la API desde terminal
   - [ ] Comando `bun run test:integration`

### Cuestionario Técnico - Fase 4

1. **Modelos prioritarios**
   - ¿Qué modelos son imprescindibles para Claude Code?
   - ¿Priorizar Groq (rápido) vs Cerebras (razonamiento)?
   - ¿Modelos gratis vs pagos?

2. **Optimizaciones**
   - ¿Connection pooling para proveedores?
   - ¿Cache de modelos disponibles?
   - ¿Warm-up de conexiones?

3. **Observabilidad**
   - ¿Métricas de latency por proveedor?
   - ¿Contador de tokens usados?
   - ¿Dashboard simple de estadísticas?

### Checklist - Fase 4

- [ ] Landing page funcional
- [ ] Endpoint específico para Claude Code
- [ ] Tests de integración con Claude
- [ ] Documentación de uso con Claude Code
- [ ] Script de testing CLI funciona

---

## FASE 5: Testing y Calidad (COMPLETADA)

**Estado:** ✅ Finalizada con 14 tests exitosos.

### Tareas Técnicas - Fase 5

1. **Tests unitarios**
   - [x] Tests para cada servicio de IA (mocks en suite de integración)
   - [x] Tests para router (Unitarios en `router.test.ts`)
   - [x] Tests para utilidades

2. **Tests de integración**
   - [x] Test de flujo completo de chat (E2E)
   - [x] Test de fallbacks (Resiliencia en `provider-router.test.ts`)
   - [x] Test de manejo de errores (429, 5xx, 404)

3. **Tests E2E**
   - [x] Test de la API completa (v1 endpoints)
   - [x] Test de streaming SSE (Delta events)
   - [x] Test de persistencia de datos (Audit trail en DB)

### Checklist - Fase 5

- [x] Tests unitarios > 80% cobertura
- [x] Tests de integración pasan (14/14)
- [x] Aislamiento de tests de resiliencia (Sin side-effects de caché)
- [x] Documentación de testing completa en README

---

## FASE 6: Deployment y Producción (COMPLETADA)

**Estado:** ✅ Sistema listo para despliegue productivo.

### Tareas Técnicas - Fase 6

1. **Dockerización**
   - [x] Dockerfile optimizado para Bun (Multi-stage + Alpine)
   - [x] docker-compose.yml con persistencia
   - [x] Soporte para `bun.lock` (Bun 1.2+)

2. **Configuración de producción**
   - [x] Variables de entorno mapeadas en Compose
   - [x] Healthcheck nativo (`bun --eval fetch`)
   - [x] Persistencia automática en `/data`

3. **Monitoreo**
   - [x] Health checks configurados en Docker
   - [x] Métricas en tiempo real en `/v1/status/providers`

### Checklist - Fase 6

- [x] Docker funciona localmente y en CI
- [x] Imagen ultra-ligera (Alpine)
- [x] Healthcheck no depende de herramientas externas (curl/wget)
- [x] Persistencia verificada

---

## Decisiones Técnicas Clave

### Arquitectura Principal

| Decisión | Opción recomendada | Justificación |
| :--- | :--- | :--- |
| Runtime | Bun | Rápido, moderno, built-in SQLite, SSE |
| Base de datos | SQLite (bun:sqlite) | Suficiente para MVP, sin deps externas |
| Router | Custom | Ligero, entendible, extensible |
| Streaming | SSE | Estándar, compatible con fetch API |
| Auth | API Keys simples | Para empezar, fácil de implementar |

### Stack Tecnológico

```yaml
Runtime: Bun v1.3+
Lenguaje: TypeScript 5.x
Database: SQLite (bun:sqlite)
Testing: bun:test (built-in)
Linting: biome (o biome.json)
Deploy: Docker + Fly.io/Railway
```

### Modelos Recomendados por Proveedor

| Proveedor | Modelo rápido | Modelo razonamiento | Modelo balanceado |
| :--- | :--- | :--- | :--- |
| Groq | `llama-3.1-8b` | `deepseek-r1-distill` | `mixtral-8x7b` |
| Cerebras | `llama-3.1-8b` | `deepseek-r1` | `llama-3.3-70b` |
| OpenRouter | `google/gemma-2b` | `deepseek/deepseek-r1` | `anthropic/claude-3.5-sonnet` |

---

## Roadmap Post-MVP

### Versión 1.1

- [ ] Autenticación JWT
- [ ] Rate limiting por usuario
- [ ] Cache de respuestas frecuentes
- [ ] Webhooks para eventos

### Versión 1.2

- [ ] Soporte para imágenes (multimodal)
- [ ] Soporte para function calling
- [ ] Métricas avanzadas (tokens, costos)
- [ ] Dashboard administrativo

### Versión 2.0

- [ ] Soporte para embeddings
- [ ] RAG (Retrieval Augmented Generation)
- [ ] Fine-tuning de modelos
- [ ] Colaboración en tiempo real

---

## Recursos y Referencias

### Documentación de APIs

- [OpenRouter API](https://openrouter.ai/docs)
- [Groq API](https://console.groq.com/docs)
- [Cerebras API](https://docs.cerebras.ai/)
- [OpenAI API](https://platform.openai.com/docs) (para compatibilidad)

### Recursos Bun

- [Bun Documentation](https://bun.sh/docs)
- [bun:sqlite](https://bun.sh/docs/api/sqlite)
- [Bun.serve](https://bun.sh/docs/api/http)

### Mejores Prácticas

- [REST API Design](https://restfulapi.net/)
- [SSE Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [OpenAPI Specification](https://swagger.io/specification/)

---

## Notas de Implementación

### Convenciones de Código

1. **Nombres de archivos**: kebab-case (ej: `chat-handler.ts`)
2. **Nombres de funciones**: camelCase
3. **Nombres de clases**: PascalCase
4. **Constantes**: UPPER_SNAKE_CASE
5. **Interfaces**: Prefijo I opcional (ej: `AIProvider` o `IAIProvider`)

### Estructura de Commits

```text
type(scope): descripción

type: feat|fix|docs|style|refactor|test|chore
scope: provider|routes|db|config|test

ejemplos:
- feat(provider): agregar soporte para Groq
- fix(routes): corregir manejo de CORS
- docs(readme): actualizar instrucciones de instalación
```

### Logs y Debugging

```typescript
// Formato estándar de logs
console.log(`[${timestamp}][${level}][${context}] ${message}`);

// Ejemplos:
console.log(`[2024-01-15T10:30:00Z][INFO][openrouter] Inicializando cliente`);
console.log(
  `[2024-01-15T10:30:01Z][DEBUG][chat][req-123] Usando proveedor: groq`,
);
console.error(
  `[2024-01-15T10:30:02Z][ERROR][chat][req-123] Timeout en proveedor`,
);
```

---

## Checklist Final Pre-Lanzamiento

### Funcionalidad

- [ ] Todos los proveedores responden correctamente
- [ ] Streaming funciona sin interrupciones
- [ ] Fallbacks operan automáticamente
- [ ] Persistencia de conversaciones funciona

### Performance

- [ ] Response time < 500ms para modelos rápidos
- [ ] Memory usage estable (sin leaks)
- [ ] Concurrency: soporta 10+ requests simultáneos

### Seguridad

- [ ] API keys validadas
- [ ] Sin exposición de secrets en logs
- [ ] CORS configurado correctamente
- [ ] Validación de inputs

### Documentación Final

- [ ] README completo
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Guía de contribución
- [ ] Changelog inicial

---

**Última actualización:** 2026-03-25
**Versión del documento:** 1.1
**Autor:** Antigravity AI
