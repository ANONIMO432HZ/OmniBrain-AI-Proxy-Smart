import os

landing_path = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\routes\landing.ts"
router_path = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\services\provider-router.ts"

# 1. ACTUALIZAR LANDING.TS (Dashboard Dropdown)
if os.path.exists(landing_path):
    with open(landing_path, 'r', encoding='utf-8') as f:
        content = f.read()

    target = """          <select id="model" name="model">
            <option value="">Auto por proveedor (Round Robin / Default)</option>
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
            <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free (OpenRouter Free)</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small (OpenRouter Free)</option>
            <option value="llama3.1-8b">llama3.1-8b (Cerebras Llama)</option>
            <option value="qwen-3-235b-a22b-instruct-2507">qwen-3-235b-a22b-instruct-2507 (Cerebras Qwen)</option>
            <option value="mock">Prueba: Mock Agent (Simulado)</option>
            <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
          </select>"""

    replacement = """          <select id="model" name="model">
            <option value="">Auto por proveedor (Round Robin / Default)</option>
            
            <!-- MODELOS 2026 -->
            <option value="llama-4-scout-17b-16e-instruct">llama-4-scout-17b-16e-instruct (Llama 4 - Nuevo)</option>
            <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (GPT OSS - Razonamiento)</option>
            <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (GPT OSS Light - Veloz)</option>
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Llama 3.3)</option>
            <option value="qwen/qwen3-32b">qwen/qwen3-32b (Qwen 3 - Código)</option>
            <option value="moonshotai/kimi-k2-instruct">moonshotai/kimi-k2-instruct (Kimi K2)</option>

            <!-- OpenRouter Free -->
            <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free (OpenRouter Free)</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small (OpenRouter Free)</option>

            <!-- Cerebras -->
            <option value="llama3.1-8b">llama3.1-8b (Cerebras Llama)</option>
            <option value="qwen-3-235b-a22b-instruct-2507">qwen-3-235b-a22b-instruct-2507 (Cerebras Qwen)</option>

            <option value="mock">Prueba: Mock Agent (Simulado)</option>
            <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
          </select>"""

    if target in content:
        content = content.replace(target, replacement)
        with open(landing_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Landing page actualizada con modelos 2026.")
    else:
        print("No se encontró el target en landing.ts!")

# 2. ACTUALIZAR PROVIDER-ROUTER.TS (Smart Routing Llama-4)
if os.path.exists(router_path):
    with open(router_path, 'r', encoding='utf-8') as f:
        content = f.read()

    target_router = """      // Priorizar Groq para modelos 'versatile'
      if (m.includes("versatile") && nameA === "groq") return -1;
      if (m.includes("versatile") && nameB === "groq") return 1;"""

    replacement_router = """      // Priorizar Groq para Llama 4 y Llama 3.3 versatile
      if ((m.includes("versatile") || m.includes("llama-4-scout")) && nameA === "groq") return -1;
      if ((m.includes("versatile") || m.includes("llama-4-scout")) && nameB === "groq") return 1;"""

    if target_router in content:
        content = content.replace(target_router, replacement_router)
        with open(router_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Router actualizado para priorizar Llama 4 en Groq.")
    else:
        print("No se encontró el target en provider-router.ts")
