# 🧠 OmniBrain-API

Un enrutador inteligente y proxy de alto rendimiento para APIs de Inteligencia Artificial (AI), construido sobre **Bun** y **TypeScript**.

---

## 🚀 Características Principales

- 🔀 **Smart Routing (Auto Global)**: Algoritmo de cascada que salta de un proveedor a otro en caso de caídas (`429`, `5xx`, `404`) de forma transparente para el cliente.
- 🔑 **Multi-Key Load Balancing (Rotación)**: Capacidad de añadir múltiples API Keys separadas por comas (`key1,key2,key3`) por proveedor para sortear el agotamiento de cuotas diarias.
- 🧠 **Collapsible Thinking Stream**: Soporte nativo para extraer y colapsar razonamiento de modelos (CoT) en bloques desplegables interactivos sobre canales SSE.
- ⚡ **Extremadamente Rápido**: Respaldado por el runtime de Bun con soporte de Streams (`ReadableStream`) y baja latencia.

---

## 🛠️ Proveedores Soportados

| Proveedor      | Modelo Defecto (Fallback) | Soporta Thinking           |
| :------------- | :------------------------ | :------------------------- |
| **OpenRouter** | `openrouter/free`         | Sí (Detección SSE/Content) |
| **Groq**       | `llama-3.1-8b-instant`    | Sí (`reasoning_content`)   |
| **Cerebras**   | `llama3.1-8b`             | Sí (`reasoning_content`)   |
| **Z.AI**       | `glm-4.7-flash`           | Sí (`reasoning_content`)   |

---

## 🗄️ Soporte Dual de Base de Datos (Drizzle ORM)

El sistema conmuta dinámicamente entre **SQLite** y **PostgreSQL** según tu string de conexión `DATABASE_URL` sin tocar lógica de negocio:

- **🔌 SQLite (Local / Dev):** `DATABASE_URL=./data/api.db` (Por defecto)
  - Corre sobre el motor nativo de Bun. Ideal para desarrollo.
- **⚡ PostgreSQL (Producción):** `DATABASE_URL=postgres://usuario:pass@host:5432/db`
  - Escala a producción sobre el driver nativo de Bun para bases SQL.
- **🐳 Dokploy / Docker (Autodetección):** Si inyectas `POSTGRES_HOST` y `POSTGRES_DB` por separado, el backend construirá la url automáticamente ahorrando scripts de entrada.

---

## 🔌 Endpoints Disponibles

| Endpoint        | Método | Descripción | Autenticación |
| :-------------- | :----- | :---------- | :------------ |
| `/`             | `GET`  | Panel de Control / Landing Page interactiva para pruebas de API. | No |
| `/chat`         | `POST` | Abre un Stream SSE (`text/event-stream`) de chat con los proveedores. | Sí (`Bearer`) |
| `/history`      | `GET`  | Descarga el historial de auditoría de los prompts y respuestas en la DB. | Sí (`Bearer`) |

---

## ⚙️ Instalación y Uso

**1. Instalar Dependencias:**

```bash
bun install
```

**2. Configurar Entorno:**
Modifica o crea tu archivo `.env` basado en [.env.example](file:///.env.example):

```bash
OPENROUTER_API_KEY=key1,key2
GROQ_API_KEY=key4,key5
DATABASE_URL=./data/api.db
```

**3. Correr Servidor:**

```bash
bun run index.ts
```

La API estará escuchando en `http://localhost:3000`.

---

## 📜 Documentación Adicional

- [Problemas Comunes (Troubleshooting)](file:///docs/PROBLEMAS_COMUNES.md): Soluciones a cortes de stream, colisiones y cascadas 404.
- [Análisis de Proveedores](file:///docs/providers/analisis_documentacion.md): Métricas, límites y configuraciones.

---

_Desarrollado con ❤️ sobre Bun v1.3.11_
