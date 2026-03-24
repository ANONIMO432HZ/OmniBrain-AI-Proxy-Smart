# 🧠 Capacidades y Skills del Sistema (Consolidado)

Este documento centraliza las capacidades lógicas (Skills) que el proxy **OmniBrain-API** ejecutará de forma autónoma para optimizar la interacción entre el Agente (Claude Code, OpenClaw) y los proveedores de IA.

---

## 📋 Resumen de Skills

| Skill | Descripción | Fase | Estado |
| :--- | :--- | :--- | :--- |
| **Circuit Breaker** (Fallback) | Desactiva temporalmente un proveedor si falla (429/500) y rota al siguiente. | Fase 1 | ⏳ Pendiente |
| **Tool Call Streaming Buffering** | Formatea y concatena chunks SSE para que el agente reciba `tool_calls` sin micro-errores. | Fase 1 | ⏳ Pendiente |
| **Context Trimming** | Recorta o resume el historial de mensajes de forma autónoma para no saturar la ventana de tokens. | Fase 2 | ⏳ Pendiente |
| **Auditoría y Logs Locales** | Guarda prompts y respuestas de herramientas en SQLite para auditar comportamientos. | Fase 2 | ⏳ Pendiente |
| **Smart Routing** | Elige el proveedor según la complejidad (Groq para ráfagas, OpenRouter para lógica pesada). | Fase 3 | ⏳ Pendiente |
| **Monitorización de Latencia** | Rastrea el rendimiento de cada proveedor para optimizar el enrutado en tiempo real. | Fase 3 | ⏳ Pendiente |

---

## 🔍 Detalle de Capacidades

### 1. Circuit Breaker & Fallback Dinámico
*   **Propósito**: Evitar que el agente falle si un proveedor como Groq o Cerebras alcanza un límite de tasa (`429`) o error de servidor (`500`).
*   **Comportamiento**:
    *   Detectar respuestas de error o timeouts.
    *   Marcar el proveedor como "Inactivo" por un periodo de tiempo.
    *   Reenrutar la solicitud de forma transparente a un proveedor de respaldo (ej. OpenRouter).
*   **Configuración**: `src/services/provider-router.ts`

### 2. Tool Call Streaming Buffering
*   **Propósito**: Asegurar que las llamadas a funciones se transmitan en el formato exacto que espera el framework del agente.
*   **Comportamiento**:
    *   Hacer de "amortiguador" (buffer) para unir fragmentos de JSON de `arguments` si el proveedor los envía fragmentados.
    *   Certificar que el formato de salida sea compatible con el estándar estricto de OpenAI.

### 3. Context Trimming (Gestión de Contexto)
*   **Propósito**: Evitar errores de "Max Tokens Exceeded" cuando el agente mantiene una sesión muy larga.
*   **Comportamiento**:
    *   Monitorear la cantidad de tokens aproximada en el historial.
    *   Si supera un umbral (ej. 80% del límite del modelo), recortar los mensajes más antiguos o generar un "resumen del contexto" que sirva de único mensaje inicial.

### 4. Auditoría y Trazabilidad (SQLite)
*   **Propósito**: Monitorear qué herramientas ejecuta el agente y con qué datos.
*   **Comportamiento**:
    *   Guardar en `messages` el payload de ejecución de herramientas.
    *   Identificar cada interacción con un `requestId` único.
    *   Permitir auditoría en caso de loops infinitos del agente.

### 5. Smart Routing (Enrutamiento Inteligente)
*   **Propósito**: Balancear el costo, la velocidad y la inteligencia.
*   **Comportamiento**:
    *   **Groq/Cerebras**: Prioritarios para respuestas rápidas de texto o llamadas a herramientas directas.
    *   **OpenRouter (Claude/o1)**: Invocado automáticamente si la tarea requiere razonamiento complejo o se detecta un prompt largo.

---

## 🛠️ Próximos Pasos para Implementación

1.  **Fase 1 (Actual)**: Implementar la lógica de **Circuit Breaker** en el enrutador y el formateo de **Tool Calls** en el SSE handler.
2.  **Fase 2**: Integrar los disparadores de base de datos para el rastreo y auditoría.
