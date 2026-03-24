# 🛠️ Problemas Comunes y Soluciones (Troubleshooting)

Este documento recopila errores técnicos y bloqueos de infraestructura superados durante la estabilización del enrutado y el streaming inteligente de **OmniBrain-API**.

---

## 🚀 1. Error de Colisión de Puertos (EADDRINUSE)

**🚨 Síntoma:**
Al ejecutar `bun index.ts`, el proceso muere inmediatamente tras el texto `API escuchando en http://localhost:3000` con `exit code 1`.

**🔍 Causa:**
Otro proceso en segundo plano (o una ejecución fallida anterior de Bun que no se cerró elegantemente) está reteniendo el puerto `3000`.

**✅ Solución:**
Matar el proceso que ocupa el puerto antes de reiniciar:
- **Windows (PowerShell):** `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force`
- **Linux / Mac:** `kill -9 $(lsof -t -i:3000)`

---

## 🌐 2. Modelos 404 en Cascada Automática / `Auto Global`

**🚨 Síntoma:**
Al usar `Auto Global`, si el primer proveedor fallaba, el sistema lanzaba:
`[error] Todos los proveedores fallaron. Error del proveedor optimo: Groq 404: Model 'openrouter/free' not found`

**🔍 Causa:**
El `provider-router` inyectaba `"openrouter/free"` como modelo por defecto para arrancar. Si **OpenRouter** fallaba o estaba en cooldown, el enrutador arrastraba ese modelo a **Groq o Z.AI**, causándoles un error 404 a ellos porque no reconocen dicha nomenclatura.

**✅ Solución:**
Se ajustó el `provider-router.ts` con una bandera de memoria:
```typescript
const isAutoGlobal = !params.model; // Detectar si viene vacío de front
...
const currentParams = { ...params };
if (isAutoGlobal && state.provider.id !== "openrouter") {
  delete currentParams.model; // Remueve la herencia para forzar el Modelo Default Nativo
}
```

---

## 🧠 3. Cortes / Abortos en Streams Lentos (`Thinking`)

**🚨 Síntoma:**
Al llamar a modelos pesados con Razonamiento o CoT Inteligente, la UI devolvía `Network Error` y la terminal de Bun reflejaba:
`[Bun.serve]: request timed out after 10 seconds. Pass idleTimeout to configure.`

**🔍 Causa:**
Bun tiene por defecto un tiempo de inactividad (*idle timeout*) de **10 segundos**. Como los cálculos de razonamiento pueden tardar más de eso en pulsar el primer token del stream, Bun abortaba la conexión por "inactividad".

**✅ Solución:**
Se elevó el umbral de desconexión en [index.ts](file:///index.ts):
```typescript
const server = Bun.serve({
  port: 3000,
  idleTimeout: 60, // 60 segundos (1 minuto) de pulmón para razonamiento
  ...
```

---

## 🔄 4. Razonamiento Saltarín o Invisibles (`else if` Race Condition)

**🚨 Síntoma:**
El razonamiento del modelo de IA caía de forma aleatoria como texto plano en vez de agruparse en la caja de pensamiento desplegable.

**🔍 Causa:**
En los drivers (`groq.ts`, `zai.ts`), el parseador de eventos SSE estaba programado con un filtro excluyente:
```typescript
if (delta?.content) { ... }
else if (delta?.reasoning_content) { ... }
```
Si el API del proveedor devolvía la respuesta de texto (`content`) y su pensamiento (`reasoning_content`) **juntos en el mismo paquete de datos**, la condición `else if` ignoraba y descartaba el pensamiento.

**✅ Solución:**
Modificar los bloques condicionales para correr en paralelo sin exclusión:
```typescript
if (delta?.content) { ... }
if (delta?.reasoning_content) { ... }
```

## 🛑 5. Errores 404 en Cascada por Modelos Obsoletos (Groq)

**🚨 Síntoma:**
Al usar `Auto Global`, el enrutador saltaba de OpenRouter a **Groq**, pero este último arrojaba `Error 404: The model \`llama-3.1-8b\` does not exist`. Sin embargo, al seleccionar el modelo de Groq manualmente en la interfaz web, funcionaba perfectamente.

**🔍 Causa:**
El driver de Groq (`src/services/groq.ts`) tenía configurado el modelo `"llama-3.1-8b"` como default (`GROQ_DEFAULT_MODEL`), una nomenclatura obsoleta que la API de Groq ya había actualizado oficialmente a `"llama-3.1-8b-instant"`. Alborrando el enrutador el parámetro de modelo para que usaran su nativo, Groq invocaba el antiguo.

**✅ Solución:**
Actualizar la constante en `src/services/groq.ts`:
```typescript
const GROQ_DEFAULT_MODEL = "llama-3.1-8b-instant";
```

---

*Actualizado: 2026-03-24*
