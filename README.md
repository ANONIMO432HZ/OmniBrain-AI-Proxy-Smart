# 🧠 OmniBrain-AI-Proxy-Smart

Un enrutador inteligente y proxy de alto rendimiento para APIs de Inteligencia Artificial (IA), construido sobre **Bun** y **TypeScript**.

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🚀 Características Principales

*   **Smart Routing (Auto Global)**: Algoritmo de cascada que salta de un proveedor a otro en caso de caídas (`429`, `5xx`, `404`) de forma transparente para el cliente.

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

*   **🔌 SQLite (Local / Dev):** `DATABASE_URL=./data/api.db` (Por defecto)
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

El proyecto es compatible con arquitecturas x86 y ARM (32/64 bits).

### ⚡ Modo Bun (Recomendado para PC / Servidores)
Ideal para máximo rendimiento y baja latencia.
1.  **Clonar:** `git clone https://github.com/ANONIMO432HZ/OmniBrain-AI-Proxy-Smart.git && cd OmniBrain-AI-Proxy-Smart`
2.  **Instalar:** `bun install`
3.  **Configurar:** Copia el archivo `.env.example` a `.env` y añade tus API Keys.
4.  **Ejecutar:**

    ```bash
    bun start:bun
    ```

### 📱 Modo Node.js (Optimizado para Termux / Android)
Compatible con dispositivos ARM legacy (Android 7+).
1.  **Preparar Termux:** `pkg update && pkg install nodejs-lts git`
2.  **Clonar:** `git clone https://github.com/ANONIMO432HZ/OmniBrain-AI-Proxy-Smart.git && cd OmniBrain-AI-Proxy-Smart`
3.  **Instalar:** `npm install`
4.  **Ejecutar (Modo Automático):**

    ```bash
    chmod +x omni.sh && ./omni.sh setup-service
    ```
5.  **Ejecutar (Modo Manual):**

    ```bash
    ./omni.sh start
    ```

### 🛠️ Entornos Soportados
*   **Android**: 7.0 hasta 14.0+ (ARMv7/ARMv8) vía Termux.
*   **Servidores**: Ubuntu, Debian, Alpine (Docker).
*   **PC**: Windows (WSL2), macOS, Linux.

### 🔄 Gestión del Proxy (omni CLI)
Hemos desarrollado una herramienta dedicada para facilitar la gestión en Termux:

| Comando | Acción |
|---------|--------|
| `./omni.sh setup-service` | Configura el proxy como servicio (arranque automático) |
| `./omni.sh start` | Inicia el centro de opciones de arranque (Fondo/Manual) |
| `./omni.sh start:manual` | Fuerza la ejecución en primer plano (ideal para logs) |
| `./omni.sh stop` | Detiene el servidor y limpia procesos huérfanos |
| `./omni.sh restart` | Reinicia el sistema |
| `./omni.sh logs` | Visualiza los logs en tiempo real |
| `./omni.sh update` | Actualizar desde GitHub y reinstalar dependencias |
| `./omni.sh status` | Muestra el estado del servicio y la versión actual |
| `./omni.sh env` | Editar claves API (.env) rápidamente |
| `./omni.sh --version` | Mostrar versión instalada (`-v`) |
| `./omni.sh --help` | Mostrar menú de ayuda completo (`-h`) |

> [!IMPORTANT]
> **Backups Automáticos**: Cada vez que ejecutas un comando crítico (como `update`), el sistema genera un respaldo de seguridad en `~/omnibrain-backups/` para proteger tus llaves API y base de datos.

> [!TIP]
> Si reinicias tu móvil, simplemente abre Termux y el servicio arrancará solo si previamente ejecutaste `setup-service`. De lo contrario, usa `./omni.sh start`.
*(En PC con Bun: `bun start:bun`)*

---

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
