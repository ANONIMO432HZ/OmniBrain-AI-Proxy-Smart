---
description: Probar el streaming de Tool Calls en el Proxy para certificar que el agente no fallará
---

## 🧪 Workflow: Probar Tool Call Stream

Este workflow sirve para verificar que el proxy traduzca correctamente las peticiones de herramientas a los proveedores y devuelva la estructura `tool_calls` estándar de OpenAI.

### 1. Iniciar Servidor en Modo Debug
Ejecuta el servidor en background o en una terminal separada:

```bash
bun --hot index.ts
```

### 2. Ejecutar Prueba de Tool Call
Envía una petición con una función simulada (`get_weather`) para forzar al modelo a usarla.

```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEST_KEY" \
  -d '{
    "model": "groq-llama-3",
    "messages": [
      {"role": "user", "content": "¿A qué temperatura está el clima en Monterrey ahora?"}
    ],
    "tools": [{
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Obtener el clima de una ubicación",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string", "description": "Ciudad y estado"}
          },
          "required": ["location"]
        }
      }
    }]
  }'
```

---

### Verdificación de Éxito ✅
El endpoint debe responder con un listado JSON que incluya:
1.  `"finish_reason": "tool_calls"`
2.  Un objeto `tool_calls` con la función `get_weather` y el parámetro `location: "Monterrey"`.

Si la respuesta tiene este formato, el Agente podrá interpretar y ejecutar herramientas sin problemas.
