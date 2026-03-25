# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a la convención [Semantic Versioning](https://semver.org/lang/es/).

## [0.4.0] - 2026-03-25

### Añadido

- **Fase 5 (Testing & Calidad)**: Suite completa de 14 tests automatizados (`bun test`) cubriendo Unit (Router), Integración (Resiliencia) y E2E (v1 API).
- **Fase 6 (Despliegue & Producción)**: Dockerización completa con imagen multi-etapa optimizada (Alpine) y orquestación con `docker-compose.yml`.
- **Healthcheck Nativo**: Implementación de verificación de salud en el contenedor usando `bun --eval fetch` para evitar dependencias externas como `curl`.
- **Persistencia Automatizada**: Configuración de volúmenes Docker para asegurar la integridad de la base de datos SQLite en `/data`.

### Corregido

- **Audit Bugfix (History)**: Reparación del endpoint `DELETE /v1/history` que fallaba al intentar usar métodos no soportados por Drizzle ORM.
- **Audit Bugfix (Testing)**: Aislamiento total de los tests de resiliencia para evitar interferencias por caché de módulos de Bun.
- **Audit Bugfix (Docker)**: Soporte para `bun.lock` (Bun 1.2+) en el proceso de construcción de imagen.

---

## [0.3.0] - 2026-03-25

### Añadido (Modernización)

- **Dynamic v1 Router (Fase 3.1)**: Refactorización completa del servidor para usar un enrutador basado en clases, permitiendo una expansión modular y rutas versionadas bajo `/v1/`.
- **Observabilidad Centrada en el Intento (Fase 3.2)**: Registro granular de métricas por cada intento de proveedor en la cadena de fallback. Nuevo endpoint `/v1/status/providers`.
- **Resiliencia Pro (Circuit Breaker) (Fase 3.3)**: Implementación de umbral de 3 fallos consecutivos para desactivación automática de proveedores (cooldown de 5 minutos).
- **Estandarización y Trazabilidad (Fase 3.4)**: Inyección de `X-Omnibrain-Request-Id` y servidor de especificación `openapi.json`.
- **Soporte de Razonamiento Extendido**: Propagación de `reasoning_tokens` y metadatos de proveedor en el primer chunk del stream para herramientas como Claude Code.

### Cambiado (Arquitectura)

- **Refactorización de Controladores**: Estandarización del uso del constructor `Response` global en lugar de `Response.json` nativo para compatibilidad en sub-rutas.
- **Optimización de Streaming**: Reubicación de la lógica de métricas al enrutador para evitar pérdida de datos en fallos tempranos.

### Corregido (Estabilidad)

- **Memory Leak Prevention**: Gestión mejorada de contextos de base de datos y cierre de streams.
- **Linting & Types**: Eliminación de advertencias de tipado en `chat.ts` y scripts de prueba.

---

## [0.2.0] - 2026-03-24

### Añadido (Escalabilidad)

- **Multi-Key Load Balancing (Rotación)**: Soporte para múltiples API Keys separadas por comas (`GROQ_API_KEY=key1,key2`) con alternancia dinámica ante errores 429 (Rate Limit) en todos los proveedores.
- **Acordeón de Pensamiento unificado**: Extracción de `.reasoning_content` paralela al texto base, solventando carreras condicionales (`else if`).
- **Problemas Comunes y Soluciones**: Documento `docs/PROBLEMAS_COMUNES.md` de soporte rápido para troubleshooting.
- **Middleware de Autenticación (Fase 2.1)**: Protección del endpoint `/chat` mediante `Authorization: Bearer <TOKEN>` y panel de login de tokens en el Landing Page.
- **Soporte de Base de Datos Dual (Drizzle ORM)**: Integración de un puente condicional automático de esquemas entre SQLite y PostgreSQL utilizando los drivers nativos de Bun.
- **Autodetección Dokploy / Docker**: Constructor inteligente de tokens para tolerar inyecciones separadas de Postgres (`POSTGRES_HOST`, `POSTGRES_DB`) transparente para el usuario.
- **Persistencia de Mensajes Automática (Fase 2.2)**: Capacidad de insertar con `await` el prompt de usuario y la respuesta del asistente en tablas SQLite/Postgres para asegurar el guardado antes de cerrar el Stream.
- **Endpoint `/history` Anticaché**: Integración de ruta `GET /history` con bloqueo estricto de caché para auditoría de base de datos directa desde la Landing.

### Cambiado (Configuración)

- **Ajuste de idleTimeout (60s)**: Elevación del margen de desconexión por inactividad de Bun en `index.ts` de 10s a 60s para soportar bloqueos de Deep Thinking streams.
- **Fallback en Auto Global**: Reparación del desvío de modelos obsoletos entre enrutadores que gatillaban fallas 404 en cascadas.
- **Nativo de Groq**: Modelización por defecto refinada a `"llama-3.1-8b-instant"`.
- **Puertos de Endpoints Antiguos**: Comentados endpoints antiguos (`/api/*`) que gatillaban errores `PostgresError: Connection closed` al correr en bases SQLite locales.

---

## [0.1.0] - 2026-03-23

### Añadido (Inicial)

- **Plan de Desarrollo**: Documento `PLAN_DE_DESARROLLO_AGENTE.md` redactado específicamente para dar soporte a Tool Calls y Agentes (Claude Code, OpenClaw).
- **Control de Versiones**: Inicialización de repositorio git local y conexión remota con el repositorio privado `ANONIMO432HZ/OmniBrain-API` en GitHub.
- **Evolución Backend**: Copiado de la arquitectura TypeScript/Bun heredada del respaldo `cubepath-bun-api-backup` que incluye los directorios `config/`, `db/`, `lib/`, `routes/`, `services/` y `index.ts`.

### Cambiado (Naming)

- **Nombre Oficial**: Actualización de nombres de `cubepath-bun-api` a de **`OmniBrain-API`** en `package.json` y `README.md`.

### Eliminado (Limpieza)

- **Historial Heredado**: Eliminación de la carpeta `.git` anterior para comenzar con un histórico limpio y ordenado de este agente.
- **Respaldo de Sistema**: Borrada la carpeta `cubepath-bun-api-backup` una vez migrados todos los activos al workspace principal.
