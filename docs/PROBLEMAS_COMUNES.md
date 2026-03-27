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
Bun tiene por defecto un tiempo de inactividad (_idle timeout_) de **10 segundos**. Como los cálculos de razonamiento pueden tardar más de eso en pulsar el primer token del stream, Bun abortaba la conexión por "inactividad".

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

---

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

## 💾 6. Pérdida o Cortes de Mensajes en Streaming (Condición de Carrera)

**🚨 Síntoma:**
Al consultar el historial (`/history`), se listan los primeros mensajes del sistema pero las preguntas nuevas no se guardan en la base de datos a pesar de que el stream termina con éxito.

**🔍 Causa:**
Las operaciones de inserción `db.insert(schema.messages)` se ejecutaban en segundo plano sin `await` para dar velocidad. Cuando el `ReadableStream` emitía su token final y ejecutaba `controller.close()`, el recolector de basura de JS en Bun a veces abortaba la promesa de fondo antes de consolidar la escritura en disco (SQLite).

**✅ Solución:**
Forzar el uso de `await` en ambos momentos del ciclo de vida del chat en `src/routes/chat.ts`:

1. Esperar la inserción de la pregunta del usuario antes de llamar al router.
2. Esperar la inserción de la respuesta del asistente dentro del bucle del stream antes de cerrar el controlador (`controller.close()`).

---

## 🌐 7. `/history` Congelado o No Actualizado (Caché del Navegador)

**🚨 Síntoma:**
Incluso con las inserciones funcionando, al dar clic en `GET /history` la respuesta se queda estática y la cabecera `date:` devuelve una hora atrasada.

**🔍 Causa:**
Navegadores (Chrome/Brave/Firefox) habilitan una caché agresiva para peticiones `GET` repetitivas a la misma URL si el servidor no especifica lo contrario. El navegador responde de su memoria local.

**✅ Solución:**
Añadir cabeceras restrictivas anticaché en la respuesta del endpoint en `index.ts`:

```typescript
return Response.json(
  { messages: results }, 
  { 
    headers: { 
      ...CORS_HEADERS, 
      "Cache-Control": "no-cache, no-store, must-revalidate" 
    } 
  }
);
```

---

## 🐚 8. Error de CLI: `local: can only be used in a function`

**🚨 Síntoma:**
Al intentar ejecutar `omni start` u otros comandos, la terminal de Termux devuelve:
`/data/data/com.termux/files/usr/bin/omni: line 124: local: can only be used in a function`

**🔍 Causa:**
En Bash, la palabra clave `local` se utiliza para declarar variables con ámbito restringido, pero **solo es válida dentro de una función**. El CLI original tenía lógica directamente en bloques `case` fuera de funciones, lo que causaba un error de sintaxis fatal en algunas versiones de Bash/Dash.

**✅ Solución:**
Refactorizar el script `omni.sh` para encapsular toda la lógica de comandos en funciones dedicadas (`cmd_start`, `cmd_stop`, etc.) y llamarlas desde el punto de entrada principal. Esto permite el uso correcto de `local` y mejora la legibilidad.

---

## 🐙 9. Bloqueo de `omni update` (Git Merge Conflict)

**🚨 Síntoma:**
Al ejecutar `omni update`, el proceso se detiene con el error:
`error: Your local changes to the following files would be overwritten by merge: omni.sh`
`Please commit your changes or stash them before you merge. Aborting`

**🔍 Causa:**
El sistema de actualización intenta realizar un `git pull` para obtener el código más reciente. Si el script `omni.sh` ha sido modificado localmente (por ejemplo, automáticamente por el conversor de finales de línea CRLF), Git bloquea la descarga para evitar perder los cambios locales.

**✅ Solución:**
Se implementó una lógica de **Auto-Stash** en el comando `update`:
1. El script ejecuta `git stash` para guardar temporalmente los cambios locales.
2. Realiza el `git pull` con éxito.
3. Ejecuta `git stash pop` para volver a aplicar los cambios locales sobre la nueva versión descargada.

---

## 📂 10. Error: `fatal: not a git repository` al actualizar

**🚨 Síntoma:**
Al ejecutar `omni update` desde fuera de la carpeta del proyecto (e.g., desde el home `~`), el proceso falla con:
`fatal: not a git repository (or any parent up to mount point /)`

**🔍 Causa:**
Git requiere ejecutarse dentro de un repositorio o sus carpetas hijas. Aunque el script reside en la carpeta correcta, si el usuario lo invoca desde otra ubicación (gracias al enlace simbólico en `/bin`), el shell mantiene el directorio actual del usuario, donde no existe una configuración de Git.

**✅ Solución:**
Se añadió una instrucción de cambio de directorio forzado al inicio de `omni.sh`:

```bash
PROJECT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
cd "$PROJECT_DIR"
```

Esto garantiza que todos los comandos posteriores (`git fetch`, `npm install`, `nohup`) siempre se ejecuten en la raíz del proyecto, sin importar desde dónde se invoque el comando `omni`.

---

## 🔐 11. Seguridad: Cómo se maneja la Key Local en el Tester

**🚨 Síntoma:**
Al abrir el Dashboard (`http://localhost:3000`), el campo de la API Key se rellena solo (visto como puntos `•••••`), pero si miras el "Código fuente de la página" (`Ctrl+U`), el campo aparece vacío: `<input type="password" id="local-api-key" ... />`.

**🔍 Causa:**
Hemos implementado un sistema de **Ingesta Silenciosa**. El servidor no inyecta tu clave directamente en el HTML (lo cual sería un riesgo si compartes capturas de pantalla o código). En su lugar, un script de JavaScript consulta un endpoint seguro (`/v1/config/default-key`) tras bambalinas y rellena el campo en la memoria del navegador.

**✅ Solución:**
1. No necesitas hacer nada, el sistema se auto-rellena para tu comodidad.
2. Si deseas cambiarla, simplemente escribe la nueva clave sobre el campo.
3. El valor solo es visible en el Inspector de Elementos si lo cambias manualmente a `type="text"`, lo cual es el comportamiento estándar de seguridad de navegadores.

---

_Última actualización: 2026-03-27 por Antigravity AI (Omni v1.2.2)_
