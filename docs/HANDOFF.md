# Handoff: OmniBrain-API → Node.js Refactor para Termux

## 🎯 Objetivo

Hacer correr **OmniBrain-API** en Node.js sobre Moto G6 (armv7l / Android 9 / Termux) junto con OpenClaw, sin romper Bun en PC.

---

## ✅ Lo que está COMPLETO (Recién actualizado)

1. **Acceso SSH**
   - Llave configurada: `C:\Users\UNKNOWN\.ssh\id_antigravity`
   - Conexión: `ssh -i C:\Users\UNKNOWN\.ssh\id_antigravity -p 8022 u0_a143@192.168.0.193`
   - Funciona correctamente.

2. **Código Refactorizado (PC — Bun sigue funcionando al 100%)**
   - Todos los archivos Bun-exclusivos fueron reemplazados por versiones dual-runtime:
   - `src/config/env.ts` (OK)
   - `src/db/db.ts` (Driver dual-runtime: dynamic import de `bun:sqlite` o `sql.js`)
   - `src/db/init.ts` (Init dual-runtime)
   - `index.ts` (Servidor dual-runtime)
   - `package.json` (Añadido `sql.js`, mejorado scripts)

3. **Reemplazo `better-sqlite3` por `sql.js` (Terminado):**
   - El driver dual-runtime en `src/db/db.ts` ahora usa `sql.js` para Node.js.
   - Implementada persistencia manual `saveIfSqlJs()` que escribe la memoria WASM a disco en cada operación CRUD (chat, historial, métricas).
   - `src/db/init.ts` actualizado para sincronizar el esquema antes de inicializar Drizzle.

4. **Verificación en Node.js (OK):**
   - El servidor arranca con `npm run start:node` y persiste correctamente los datos.
   - `package.json` actualizado con dependencias WASM-ready.

5. **Prueba final en Termux (Pendiente Ejecución):**
   - Código ya sincronizado vía SSH/SCP.
   - `npm install` ejecutado exitosamente en el dispositivo.

---

## 📋 Pasos Pendientes para el Siguiente Agente

1. **Probar servidor en Termux:**

   ```bash
   ssh -i C:\Users\UNKNOWN\.ssh\id_antigravity -p 8022 u0_a143@192.168.0.193
   cd ~/omnibrain-api-src
   node --import tsx/esm index.ts
   ```

2. **Probar API desde otra sesión o PC:**

   ```bash
   curl http://192.168.0.193:3000/health
   # Debería responder {"status":"ok"}
   ```

3. **Confirmar que OpenClaw y OmniBrain no colisionen en puertos:**
   - OpenClaw gateway: `18789`
   - OpenClaw ttyd: `7681`
   - OmniBrain-API: `3000` ← libre, sin conflicto.

4. **Configurar `.env` en Termux** con las API Keys necesarias (GROQ, OPENROUTER, etc.):

   ```bash
   cp ~/omnibrain-api-src/.env.example ~/omnibrain-api-src/.env
   nano ~/omnibrain-api-src/.env
   ```

---

## 🗂️ Archivos Clave del Proyecto

```
c:\PROYECTOS\SPACE-WORKFLOW\OmniBrain-API\
├── index.ts              ← Servidor dual-runtime (Bun.serve / http.createServer)
├── src/
│   ├── config/env.ts    ← process.env + dotenv (OK)
│   ├── db/
│   │   ├── db.ts        ← Driver dual-runtime (sql.js para Node)
│   │   └── init.ts      ← Init dual-runtime (schema sync primero)
│   └── routes/          ← Chat, api/history, api/status (actualizados con persistencia)
├── package.json         ← Scripts start:node / start:bun
└── REFACTOR_NODE_PLAN.md ← Plan original de referencia
```

---

## ⚙️ Contexto del Dispositivo

| Propiedad | Valor |
|---|---|
| Dispositivo | Moto G6 XT1925 |
| Arquitectura | armv7l (32-bit) |
| Kernel | Linux 3.18.120 (Android kernel antiguo) |
| Node.js | v24.14.1 (pkg install nodejs) |
| IP LAN | 192.168.0.193 |
| SSH Port | 8022 |
| OpenClaw | v2026.3.24 |
