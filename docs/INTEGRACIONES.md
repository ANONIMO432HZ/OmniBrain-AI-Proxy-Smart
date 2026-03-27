# Guía de Integración: OmniBrain como Universal Proxy 🌐

OmniBrain-API está diseñado para funcionar como un reemplazo directo (drop-in) de proveedores oficiales de IA en herramientas de agentes e IDEs.

## 🚀 Conceptos Clave

* **Compatibilidad**: Soporta el estándar de OpenAI para streaming y listado de modelos.
* **Formato Dual**: Detecta automáticamente si la petición viene de una herramienta externa (formato OpenAI) o del dashboard interno (formato nativo).
* **Endpoint Universal**: `/v1/chat/completions` es la ruta estándar.

---

## 🦾 Integración con Claude Code

Claude Code puede usar OmniBrain-API para acceder a modelos de Groq, Cerebras u OpenRouter de forma resiliente.

### Configuración de Claude Code

Ejecuta los siguientes comandos en tu terminal para configurar Claude Code con OmniBrain local:

```bash
# Configurar el endpoint personalizado
claude config set api_url http://localhost:3000

# Configurar la API Key local (definida en tu .env como LOCAL_API_KEY)
# Por defecto es 'omnibrain-dev-token' si no la cambiaste
claude config set api_key omnibrain-dev-token

# Seleccionar un modelo del catálogo de OmniBrain
# Recomendado: 'auto' (Enrutado inteligente)
claude config set model auto
```

---

## 🛡️ Integración con OpenClaw (Termux / Android)

OpenClaw se beneficia del **Circuit Breaker** de OmniBrain para evitar interrupciones cuando un proveedor como Groq alcanza el Rate Limit. Está optimizado para correr junto a OmniBrain en el mismo dispositivo Android.

### Configuración con `openclaw onboard`

Si usas el asistente interactivo de OpenClaw:

1. **Model/auth provider**: Selecciona `Custom Provider`.
2. **API Base URL**: Ingresa `http://localhost:3000/v1`.
3. **API Key**: Selecciona `Paste API key now` e ingresa tu `LOCAL_API_KEY`.
4. **Endpoint compatibility**: Selecciona `OpenAI-compatible (/chat/completions)`.
5. **Model ID**: Ingresa `auto` (para usar el Smart Routing global).
6. **Endpoint ID**: Asigna un nombre (ej: `omnibrain-api`).

### Configuración Manual (`~/.openclaw/openclaw.json`)

Si prefieres editar el archivo directamente:

```json
{
  "gateway": {
    "url": "http://localhost:3000/v1",
    "auth": {
      "apiKey": "SU_CLAVE_AQUI"
    }
  },
  "model": {
    "id": "auto"
  }
}
```

---

## 💻 Integración con Continue (VS Code / JetBrains)

Para usar OmniBrain en tu barra lateral de Continue:

1. Abre tu `config.json` de Continue.
2. Agrega un nuevo modelo bajo el proveedor `openai`:

```json
{
  "models": [
    {
      "title": "OmniBrain (Auto)",
      "provider": "openai",
      "model": "auto",
      "apiKey": "omnibrain-dev-token",
      "apiBase": "http://localhost:3000/v1"
    }
  ]
}
```

---

## 🔍 Diagnóstico de Conexión

Puedes verificar que el proxy está exponiendo correctamente los modelos antes de configurar tu herramienta externa con:

```bash
curl http://localhost:3000/v1/models \
  -H "Authorization: Bearer omnibrain-dev-token"
```

Si recibes un JSON con `object: "list"`, la conexión está lista.

---

## Notas de Compatibilidad

* **Thinking Models**: OmniBrain extrae automáticamente el `reasoning_content` de modelos como DeepSeek R1 o Llama y lo inyecta en el stream de forma compatible para que las herramientas muestren los "pensamientos" del modelo.
* **Request IDs**: Cada petición de estas herramientas recibe un `X-Omnibrain-Request-Id` que puedes rastrear en la consola del servidor para depuración.
