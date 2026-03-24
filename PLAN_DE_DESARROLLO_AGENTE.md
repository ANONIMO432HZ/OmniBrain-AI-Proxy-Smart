# OmniBrain-API - Plan de Desarrollo (Proxy para Agentes)

## Objetivo del Proyecto

Crear una API unificada y compatible con el estándar de **OpenAI** que centralice múltiples proveedores de IA (OpenRouter, Groq, Cerebras) en un solo endpoint local o privado. El enfoque principal es el **soporte nativo para Tool Calls (Function Calling)** y la optimización para herramientas de desarrollo como **Claude Code** u **OpenClaw**, asumiendo un entorno de **usuario único** (sin créditos ni rate limits complejos).

---

## Decisiones de Diseño (Simplificadas)

| Concepto | Decisión | Justificación |
| :--- | :--- | :--- |
| **Audiencia** | Usuario Único | Se descartan sistemas de créditos, límites de tasa y perfiles de múltiples clientes. |
| **Autenticación** | API Key Estática (`Bearer <TOKEN>`) | Suficiente para proteger el endpoint en hosting privado o local. |
| **Base de Datos** | SQLite (`bun:sqlite`) | Almacenamiento rápido de historial y logs para auditoría personal. |
| **Carga Crítica** | **Tool Calling** (Function Calling) | Esencial desde la **Fase 1** para que los agentes operen (leer archivos, ejecutar scripts). |

---

## 🚀 FASE 1: Fundación y Soporte para Herramientas (Tool Calls)
**Duración estimada:** 3 días
**Objetivo:** Crear el proxy que reciba comandos de texto y solicitudes de herramientas, enrutando a proveedores rápidos.

### Tareas Técnicas

1.  **Definición de Interfaces Unificadas**
    *   Soportar el parámetro `tools` (definiciones de funciones) y el retorno de `tool_calls` en el flujo de streaming.
    *   ```typescript
        // src/types/provider.ts
        export interface AIProvider {
          name: string;
          chat(params: ChatParams): AsyncGenerator<StreamChunk>;
        }

        export interface ChatParams {
          messages: ChatMessage[];
          model?: string;
          temperature?: number;
          tools?: any[]; // <-- Crítico para agentes
          stream?: boolean;
        }

        export interface StreamChunk {
          content?: string;
          tool_calls?: any[]; // <-- Para streaming de ejecución
          finishReason?: string;
        }
        ```

2.  **Endpoint Central `/v1/chat/completions`**
    *   Implementar compatibilidad estricta con el formato OpenAI (JSON Request y SSE Stream).
    *   Router que reciba el payload, detecte si hay `tools` y lo pase al proveedor.

3.  **Primeros Proveedores (Enfoque en Velocidad)**
    *   **Groq**: Ideal para inferencia rápida de tool calls con LLaMA 3.
    *   **Cerebras**: Máximo rendimiento en velocidad de tokens.
    *   **OpenRouter**: Respaldo para modelos pesados (Claude 3.5 Sonnet o GPT-4o) cuando la lógica compleja sea necesaria.

4.  **Sistema de Fallback Dinámico**
    *   Si Groq responde con un `429` (Rate Limit Global) o `500`, re-enrutar la solicitud de la herramienta a OpenRouter u otro proveedor disponible transparente para el Agente.

---

## ⚙️ FASE 2: Persistencia, Historial y Seguridad Ligera
**Duración estimada:** 2 días
**Objetivo:** Añadir rastreo de ejecuciones y protección del endpoint.

### Tareas Técnicas

1.  **Autenticación de Token Único**
    *   Middleware que valide `Authorization: Bearer ${process.env.API_KEY}`.
    *   Fácil de configurar en local o en un servidor privado.

2.  **Base de Datos de Historial (SQLite)**
    *   Tablas simplificadas: `conversations` y `messages`.
    *   Guardar los prompts del agente **y las respuestas de ejecución de herramientas** para poder auditar el comportamiento del agente si se "descontrola".

3.  **Logs de Ejecución**
    *   Rastreo de latencias: ¿Cuánto tardó Groq en responder la llamada de la herramienta?
    *   Archivo de logs rotativo para no saturar el disco.

---

## 🛠️ FASE 3: Calibración y Enlace con Claude Code / Agentes
**Duración estimada:** 2 días
**Objetivo:** Certificar que el agente interactúa con el sistema operativo a través del proxy sin micro-errores de parseo.

### Tareas Técnicas

1.  **Ajuste de Buffering en Streaming (SSE)**
    *   Asegurar que los chunks de `tool_calls` se concatenen y envíen en el formato exacto que espera el cliente (Claude Code u OpenClaw).
    *   Evitar retrasos (latencias de proxy) para no romper los Timeouts del agente.

2.  **Formateo de Errores**
    *   Si un proveedor falla en Tool Calling, devolver un formato JSON que el Agente entienda como "Intenta de nuevo" en lugar de crashear el proceso terminal.

3.  **Documentación de Conexión**
    *   Crear el archivo `USAGE_AGENTE.md` con:
        *   Cómo configurar los flags de Claude Code (ej. `--api-key`, `--base-url`).
        *   Cómo configurar los `.env` para OpenClaw apuntando a este endpoint.

---

## 📋 Cuestionario Técnico de Ajuste

1.  **Prioridad de Modelos**: ¿Prefieres que el enrutamiento por defecto use **Groq** por latencia instantánea o **OpenRouter (Claude 3.5 Sonnet)** para tareas de razonamiento extremo?
2.  **Manejo de Contexto**: ¿Se prefiere que el historial de base de datos local alimente el contexto o que el Agente siempre envíe el historial completo en cada Request (forma estándar)?

---

## 📦 Plan de Ejecución Inmediato

- [ ] Crear el archivo `.env` con las Keys Globales (Cerebras, Groq, OpenRouter).
- [ ] Implementar la interfaz `AIProvider` incluyendo el parámetro `tools`.
- [ ] Levantar el servidor Bun en un puerto local y testear una llamada `curl` con una definición de función ficticia para certificar el retorno de `tool_calls`.
