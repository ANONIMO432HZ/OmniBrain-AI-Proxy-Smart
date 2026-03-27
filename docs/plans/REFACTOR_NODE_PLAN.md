# OmniBrain-API: Refactor Node.js Compatible para Termux

## Objetivo

Hacer que OmniBrain-API pueda correr en Node.js (`tsx`) sobre el Moto G6 (armv7l / Termux) **sin romper el funcionamiento actual con Bun en PC**. La estrategia es reemplazar las APIs exclusivas de Bun por equivalentes estándar de Node, manteniendo paridad funcional total.

## Diagnóstico: APIs de Bun a reemplazar

| Archivo | API Bun | Reemplazo Node |
|---|---|---|
| `src/config/env.ts` | `Bun.env.*` | `process.env.*` |
| `src/db/db.ts` | `import { Database } from "bun:sqlite"` | `import Database from "better-sqlite3"` |
| `src/db/db.ts` | `import { sql } from "bun"` | `import postgres from "postgres"` |
| `src/db/db.ts` | `drizzle-orm/bun-sqlite` | `drizzle-orm/better-sqlite3` |
| `src/db/db.ts` | `drizzle-orm/bun-sql` | `drizzle-orm/postgres-js` |
| `src/db/init.ts` | `Bun.file(path).text()` | `readFileSync(path, "utf-8")` |
| `src/db/init.ts` | `import { sql } from "bun"` | `import postgres from "postgres"` |
| `src/db/init.ts` | `new Database` de `bun:sqlite` | `new Database` de `better-sqlite3` |
| `index.ts` | `Bun.serve(...)` | `http.createServer(...)` condicional |

## Phases

### Phase 1 — `package.json`

- Añadir `better-sqlite3`, `postgres`, `dotenv`, `tsx`
- Añadir `@types/better-sqlite3` en devDependencies
- Añadir script `start:node`

### Phase 2 — `src/config/env.ts`

- `Bun.env.*` → `process.env.*`
- Añadir `import "dotenv/config"` al inicio

### Phase 3 — `src/db/db.ts`

- Driver dual-runtime: Bun usa drivers actuales, Node usa `better-sqlite3`/`postgres`

### Phase 4 — `src/db/init.ts`

- `Bun.file().text()` → `readFileSync()`
- Driver de init dual-runtime

### Phase 5 — `index.ts`

- `Bun.serve` → bloque condicional Bun/Node con `http.createServer`

## Verification

1. `bun test` en PC — sin regresiones. ✅
2. `npm run start:node` en PC — health check OK. ✅
3. Deploy vía SSH → Termux — Servidor levantado y persistencia verificada. ✅
4. Favicon y Icono de Sistema — Configurado y servido en Node/Bun. ✅

---

## 🛠️ Implementación Técnica Final (Resumen)

Para superar el bloqueo de compilación de `better-sqlite3` en los kernels antiguos de Android (ARMv7), se implementó **`sql.js` (WebAssembly)** como motor de base de datos para Node.js.

### Puntos clave

- **Persistencia Reactiva**: Drizzle actualiza la memoria WASM y una función `saveIfSqlJs()` sincroniza el blob a `./data/api.db` tras cada `INSERT`/`DELETE`.
- **Modo Dual**: El sistema detecta automáticamente si corre sobre Bun o Node y ajusta el driver de Drizzle en caliente.
- **CORS para Móviles**: Se habilitaron encabezados específicos para permitir que el Tester web funcione desde navegadores móviles contra el servidor en Termux.
