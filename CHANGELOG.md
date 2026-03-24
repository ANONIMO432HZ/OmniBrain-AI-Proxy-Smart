# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a la convención [Semantic Versioning](https://semver.org/lang/es/).

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
