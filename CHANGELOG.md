# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a la convención [Semantic Versioning](https://semver.org/lang/es/).

## [0.2.0] - 2026-03-24

### Añadido

- **Multi-Key Load Balancing (Rotación)**: Soporte para múltiples API Keys separadas por comas (`GROQ_API_KEY=key1,key2`) con alternancia dinámica ante errores 429 (Rate Limit) en todos los proveedores.
- **Acordeón de Pensamiento unificado**: Extracción de `.reasoning_content` paralela al texto base, solventando carreras condicionales (`else if`).
- **Problemas Comunes y Soluciones**: Documento `docs/PROBLEMAS_COMUNES.md` de soporte rápido para troubleshooting.
- **Middleware de Autenticación (Fase 2.1)**: Protección del endpoint `/chat` mediante `Authorization: Bearer <TOKEN>` y panel de login de tokens en el Landing Page.
- **Soporte de Base de Datos Dual (Drizzle ORM)**: Integración de un puente condicional automático de esquemas entre SQLite y PostgreSQL utilizando los drivers nativos de Bun.
- **Autodetección Dokploy / Docker**: Constructor inteligente de tokens para tolerar inyecciones separadas de Postgres (`POSTGRES_HOST`, `POSTGRES_DB`) transparente para el usuario.
- **Persistencia de Mensajes Automática (Fase 2.2)**: Capacidad de insertar en segundo plano (asíncrono) el prompt de usuario y la respuesta del asistente en tablas SQLite/Postgres al finalizar el stream del chat.

### Cambiado

- **Ajuste de idleTimeout (60s)**: Elevación del margen de desconexión por inactividad de Bun en `index.ts` de 10s a 60s para soportar bloqueos de Deep Thinking streams.
- **Fallback en Auto Global**: Reparación del desvío de modelos obsoletos entre enrutadores que gatillaban fallas 404 en cascadas.
- **Nativo de Groq**: Modelización por defecto refinada a `"llama-3.1-8b-instant"`.

---

## [0.1.0] - 2026-03-23

### Añadido

- **Plan de Desarrollo**: Documento `PLAN_DE_DESARROLLO_AGENTE.md` redactado específicamente para dar soporte a Tool Calls y Agentes (Claude Code, OpenClaw).
- **Control de Versiones**: Inicialización de repositorio git local y conexión remota con el repositorio privado `ANONIMO432HZ/OmniBrain-API` en GitHub.
- **Evolución Backend**: Copiado de la arquitectura TypeScript/Bun heredada del respaldo `cubepath-bun-api-backup` que incluye los directorios `config/`, `db/`, `lib/`, `routes/`, `services/` y `index.ts`.

### Cambiado

- **Nombre Oficial**: Actualización de nombres de `cubepath-bun-api` a de **`OmniBrain-API`** en `package.json` y `README.md`.

### Eliminado

- **Historial Heredado**: Eliminación de la carpeta `.git` anterior para comenzar con un histórico limpio y ordenado de este agente.
- **Respaldo de Sistema**: Borrada la carpeta `cubepath-bun-api-backup` una vez migrados todos los activos al workspace principal.
