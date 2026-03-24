# Análisis de Documentación de Proveedores (2026)

He revisado los archivos de documentación en `docs/providers/`. A continuación, se detallan los hallazgos clave, modelos descubiertos y recomendaciones para optimizar el sistema de enrutado.

---

## 🚀 1. Groq (`groq.md`)

**Hallazgos Clave:**

- **Sistema de Cuotas Continuo**: Groq usa un algoritmo de *Token Bucketing* (reposición continua). No hay un reinicio fijo a las 00:00.
- **Modelos 2026 Confirmados (LPU speed)**: Se valida la presencia de familias como **Llama 4 Scout** y **GPT OSS** (OpenAI open weight).
- **Parámetro Recomendado**: Recomiendan configurar `max_completion_tokens` de forma óptima para evitar sobre-estimar el consumo y activar el block de *Rate Limits* erróneamente.

### 📝 Modelos Groq vs Dashboard

| Modelo | Estado en Dashboard | Sugerencia |
| :--- | :--- | :--- |
| `meta-llama/llama-4-scout-17b-16e-instruct` | ✅ Agregado | - |
| `openai/gpt-oss-120b` y `20b` | ✅ Agregado | Modelos de razonamiento ultra-rápido |
| `groq/compound` y `groq/compound-mini` | ⚠️ Ausente | **Agregar**. Modelos dedicados a workflows compuestos de Groq. |
| `moonshotai/kimi-k2-instruct` | ✅ Agregado | - |

---

## ⚡ 2. Cerebras (`cerebras.md`)

**Hallazgos Clave:**

- Cerebras tiene soporte para inferencia masiva y rápida con un pipeline compatible con OpenAI.
- **Header dinámico**: Para auditoría de uso en streams, se pueden leer `x-ratelimit-remaining-tokens-minute` si se desea sincronizar un medidor visual en el dashboard sin sobrecosto.

### 📝 Modelos Cerebras vs Dashboard

| Modelo | Estado en Dashboard | Sugerencia |
| :--- | :--- | :--- |
| `llama3.1-8b` | ✅ Agregado | - |
| `qwen-3-235b-a22b-instruct-2507` | ✅ Agregado | - |
| `zai-glm-4.7` | ❌ Ausente | **Agregar**. Modelo de alta capacidad. |
| `gpt-oss-120b` | ⚠️ Duplicado | Cerebras también ofrece GPT OSS 120B. |

---

## 📂 3. OpenRouter (`openrouter.md`)

**Hallazgos Clave:**

- **Modelo de Fallback Interno**: OpenRouter soporta el paso de un array de modelos (`models: ["model1", "model2"]`) para hacer conmutación de error en sus servidores antes de devolver un error HTTP.
- **Sufijo `:free`**: Es el estándar mandatorio de OpenRouter para variantes gratuitas (ej. `meta-llama/llama-3.2-3b-instruct:free`).

---



## 💡 Recomendaciones de Actualización (Dashboard)

Para estar 100% alineados con las configs de los proveedores, se propone actualizar `landing.ts` con:

1. **Cerebras**: Añadir `<option value="zai-glm-4.7">` y opcionalmente el GPT-OSS local.
2. **Groq**: Añadir los modelos compuestos `groq/compound-mini` como opciones de IA asistida.

---

> [!TIP]
> Dado que Cerebras y Groq comparten el modelo `gpt-oss-120b`, el sistema de **Smart Routing** actual que prioriza el prefijo o el pool de fallbacks funcionará transparentemente.

---
