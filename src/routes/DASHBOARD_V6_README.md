# 🧠 OmniBrain | Dashboard V6 (Respaldo Premium)

Este documento detalla el propósito, la arquitectura y las funcionalidades del **Dashboard Visual V6** desarrollado como un refactor moderno de la `Landing Page`. 

---

## 🎯 1. ¿Por qué y Para qué se Creó?

Durante el ciclo de desarrollo del proxy, se identificó la necesidad de **modernizar la experiencia de usuario (UI/UX)** para transformar una página de prueba estática en un panel de control interactivo de alto rendimiento.

*   **Objetivo Principal:** Dotar a OmniBrain de una interfaz modular, dividida en **pestañas independientes**, para separar las pruebas de Chat en Streaming de las tareas de auditoría de bases de datos y peticiones REST manuales.
*   **Decisión de Reversión:** Tras varias iteraciones de diseño, el flujo de desarrollo preliminar requería mantener el formato secuencial original (Shell/REST manual). Por ello, **se creó este respaldo** para no perder el progreso visual y permitir su despliegue instantáneo en fases de producción o despliegues dedicados al frontend.

---

## 🛠️ 2. Características Principales

El frontend contenido en `landing_dashboard_v6_readable.html` integra:

### 💬 Módulo de Chat Dinámico (SSE)
*   **Stream Output:** Renderizado progresivo de respuestas del Servidor Bun. Soluciona el Bug de Grid Swelling y Word-Break.
*   **Reasoning (Pensamiento):** Genera una caja desplegable (`<details>`) con animaciones micro (`Thinking Spinner`) para mostrar el CoT (Chain of Thought/Razonamiento) de los modelos capaces de Pensar en paralelo sin mezclarlo con la respuesta definitiva.
*   **Contador Meta:** Muestra `RequestId`, `ElapsedTime` y `Tokens` gastados.

### 📊 Auditoría Visual (CRUD)
*   **Sincronización SQLite (Drizzle):** Lista el historial de mensajes guardados por el proxy.
*   **Filtro Rápido:** Buscador en vivo para rastrear prompts del usuario o respuestas del Asistente.
*   **Botones de Acción:** Acceso a refrescar la vista y `Borrar Todo` el historial de auditoría de mensajes en un solo clic.

### 🔌 Cliente REST Integrado
*   Panel manual para testear cualquier endpoint del proxy (`GET`, `POST`, `PUT`, `DELETE`).
*   **Snippets Categorizados:** Incluye accesos rápidos para testear las Rutas SQL vs Postgres, ideal para pruebas de estrés.

### 🎚️ Switch de Vista Detallada
*   Permite alternar entre un menú de modelos Auto-Ruteados (Globales) y un menú desplegable agrupado internamente por proveedores (`Groq`, `OpenRouter`, `Cerebras`, `Z.AI`).

---

## 🚀 3. ¿Cómo Activar esta Interfaz en el Servidor?

Si en el futuro deseas re-activar este panel visual en la ruta raíz (`http://localhost:3000/`):

1.  Abre `src/routes/landing.ts`.
2.  Reemplaza el string de `landingPageHtml` por el contenido entero de `landing_dashboard_v6_readable.html`.
3.  Reinicia el servidor Bun para verlo cargado inmediatamente.

---
_Documentación generada por Antigravity AI el 2026-03-24_
