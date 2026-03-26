# 🧠 OmniBrain-AI-Proxy-Smart

Un enrutador inteligente y proxy de alto rendimiento para APIs de Inteligencia Artificial (IA), construido sobre **Bun** y **TypeScript**.

---

## 🚀 Características Principales

* 🔀 **Smart Routing (Auto Global)**: Algoritmo de cascada que salta de un proveedor a otro en caso de caídas (`429`, `5xx`, `404`) de forma transparente para el cliente.
* 🛡️ **Resiliencia (Circuit Breaker)**: Protección avanzada que desactiva automáticamente proveedores inestables tras 3 fallos consecutivos con 5 minutos de "enfriamiento".
* 📈 **Observabilidad en Tiempo Real**: Métricas detalladas por proveedor (latencia, tasa de éxito, errores) almacenadas en DB y consultables vía API.
* 🔑 **Multi-Key Load Balancing (Rotación)**: Capacidad de añadir múltiples API Keys separadas por comas (`key1,key2,key3`) por proveedor para sortear el agotamiento de cuotas diarias.
* 🧠 **Thinking & Reasoning Support**: Soporte nativo para extraer razonamiento (CoT) y tokens de razonamiento (`reasoning_tokens`) para compatibilidad con Claude Code y otros agentes avanzados.
* ⚡ **Extremadamente Rápido**: Respaldado por el runtime de Bun con soporte de Streams (`ReadableStream`) y baja latencia.
*   📱 **Compatibilidad Termux (Node.js)**: Optimizado para correr en dispositivos móviles (Android/Termux ARMv7) utilizando una capa de base de datos Dual-Runtime (WASM) para máxima portabilidad.

---

## 🛠️ Proveedores Soportados

| Proveedor | Modelo Defecto (Fallback) | Soporta Thinking |
| :--- | :--- | :--- |
| **OpenRouter** | `openrouter/free` | Sí (Detección SSE/Content) |
| **Groq** | `llama-3.1-8b-instant` | Sí (`reasoning_content`) |
| **Cerebras** | `llama3.1-8b` | Sí (`reasoning_content`) |
| **Z.AI** | `glm-4.7-flash` | Sí (`reasoning_content`) |

---

## 🗄️ Soporte Dual de Base de Datos (Drizzle ORM)

El sistema conmuta dinámicamente entre **SQLite** y **PostgreSQL** según tu string de conexión `DATABASE_URL` sin tocar lógica de negocio:

* **🔌 SQLite (Local / Dev):** `DATABASE_URL=./data/api.db` (Por defecto)
  *   **Dual-Runtime:** Utiliza `bun:sqlite` en Bun (PC) y `sql.js` (WASM) en Node.js (Android/Termux).
  *   **Persistencia Manual:** En modo Node.js, implementa sincronización automática a disco tras cada escritura para evitar pérdida de datos en el driver WASM.
* **⚡ PostgreSQL (Producción):** `DATABASE_URL=postgres://usuario:pass@host:5432/db`
  * Escala a producción sobre el driver nativo de Bun para bases SQL.
* **🐳 Dokploy / Docker (Autodetección):** Si inyectas `POSTGRES_HOST` y `POSTGRES_DB` por separado, el backend construirá la url automáticamente ahorrando scripts de entrada.

---

## 🔌 Endpoints Disponibles (v1)

| Endpoint | Método | Descripción | Autenticación |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Panel de Control / Landing Page interactiva para pruebas de API. | No |
| `/v1/chat/completions` | `POST` | Abre un Stream SSE (`text/event-stream`) estándar de chat. | Sí (`Bearer`) |
| `/v1/history` | `GET` | Descarga el historial de auditoría de los prompts y respuestas. | Sí (`Bearer`) |
| `/v1/status/providers` | `GET` | Consulta las métricas de rendimiento y salud de los proveedores. | Sí (`Bearer`) |
| `/openapi.json` | `GET` | Especificación OpenAPI 3.0 para integración con clientes externos. | No |

---

## ⚙️ Instalación y Uso

1. **Instalar Dependencias:**

   ```bash
   bun install
   ```

2. **Configurar Entorno:**
   Modifica o crea tu archivo `.env` basado en [.env.example](file:///.env.example):

   ```bash
   OPENROUTER_API_KEY=key1,key2
   GROQ_API_KEY=key4,key5
   LOCAL_API_KEY=tu-token-seguro
   DATABASE_URL=./data/api.db
   ```

3. **Correr Servidor:**

   ```bash
   bun run index.ts
   ```

La API estará escuchando en `http://localhost:3000`.

---

## 🧪 Pruebas y Calidad

El proyecto cuenta con una robusta suite de tests automatizados:

```bash
bun test
```

Cubre 14 escenarios críticos incluyendo:

* **Resiliencia**: Validación de saltos de proveedores y lógica de Circuit Breaker. ✅
* **E2E**: Flujo completo de chat con streaming SSE y validación de seguridad (Bearer Token). ✅
* **Core**: Correctitud del enrutador dinámico y parámetros. ✅

---

## 🐳 Despliegue con Docker (Producción)

El proyecto está listo para producción con una imagen optimizada basada en Alpine:

1. **Levantar Stack:**

   ```bash
   docker-compose up -d
   ```

2. **Salud del Sistema:** Docker monitorea automáticamente la API mediante un healthcheck nativo que verifica la disponibilidad del servicio cada 30 segundos.

3. **Persistencia:** La base de datos SQLite se guarda automáticamente en el volumen `./data`.

---

## 📜 Documentación Adicional

* [Guía de Integración (Claude Code, OpenClaw, Continue)](file:///docs/INTEGRACIONES.md): Paso a paso para usar OmniBrain como proxy universal.
* [Problemas Comunes (Troubleshooting)](file:///docs/PROBLEMAS_COMUNES.md): Soluciones a cortes de stream, colisiones y cascadas 404.
* [Análisis de Proveedores](file:///docs/providers/analisis_documentacion.md): Métricas, límites y configuraciones.
* [Dashboard Premium (V6)](file:///src/routes/DASHBOARD_V6_README.md): Instrucciones para activar el panel visual avanzado.

---

_Desarrollado con ❤️ sobre Bun v1.3.11_
