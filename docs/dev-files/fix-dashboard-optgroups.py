import os

router_path = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\services\provider-router.ts"
landing_path = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\routes\landing.ts"

# 1. ACTUALIZAR PROVIDER-ROUTER.TS
if os.path.exists(router_path):
    with open(router_path, 'r', encoding='utf-8') as f:
        content = f.read()

    target = """    // Si no se especifica modelo, asignamos el general de OpenRouter (Comportamiento Original)
    if (!params.model) {
      console.log(`[router] Sin modelo especificado. Asignando 'openrouter/free' por defecto.`);
      params.model = "openrouter/free"; 
    }"""

    replacement = """    // SOPORTE PARA AUTO-DIRECCIONADO POR PROVEEDOR (auto:groq, auto:openrouter)
    let forceProvider: string | null = null;
    if (params.model && params.model.startsWith("auto:")) {
      forceProvider = params.model.split(":")[1]; // "groq", "openrouter", "cerebras"
      console.log(`[router] Forzando uso exclusivo del proveedor: ${forceProvider}`);
      
      // Asignar modelo por defecto para ese proveedor
      if (forceProvider === "groq") params.model = "llama-3.3-70b-versatile";
      if (forceProvider === "openrouter") params.model = "openrouter/free";
      if (forceProvider === "cerebras") params.model = "llama3.1-8b";
    }

    // Si no se especifica modelo, asignamos el general de OpenRouter (Comportamiento Original)
    if (!params.model) {
      console.log(`[router] Sin modelo especificado. Asignando 'openrouter/free' por defecto.`);
      params.model = "openrouter/free"; 
    }"""

    if target in content:
        content = content.replace(target, replacement)
    
    # Inyección de filtrado
    target_filter = """    // Filtrar proveedores reales que estén disponibles y fuera de cooldown
    const available = providers.filter(
      (p) => p.provider.isAvailable() && p.inactiveUntil <= now
    );"""

    replacement_filter = """    // Filtrar proveedores reales que estén disponibles y fuera de cooldown
    const available = providers.filter(
      (p) => {
        const isAv = p.provider.isAvailable() && p.inactiveUntil <= now;
        if (!forceProvider) return isAv;
        return isAv && p.provider.id.toLowerCase() === forceProvider.toLowerCase();
      }
    );"""

    if target_filter in content:
        content = content.replace(target_filter, replacement_filter)
        with open(router_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Router actualizado con soporte auto:provider.")
    else:
        print("No se encontró el bloque de filtro en router.ts")


# 2. ACTUALIZAR LANDING.TS (Dashboard Dropdown)
if os.path.exists(landing_path):
    with open(landing_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscamos el bloque <select> completo
    target_start = """          <select id="model" name="model">"""
    target_end = """          </select>"""
    
    if target_start in content and target_end in content:
        start_idx = content.find(target_start)
        # Buscar el cierre </select> posterior al start_idx
        end_idx = content.find(target_end, start_idx) + len(target_end)
        
        # Generar el bloque nuevo utilizando <optgroup> para Premium UX
        new_select = """          <select id="model" name="model" style="background:#0e1218;">
            <optgroup label="🌐 ENRUTADO AUTOMÁTICO">
              <option value="">Auto Global (Garantizado - 3 Proveedores)</option>
              <option value="auto:openrouter">Auto OpenRouter (Usa solo OpenRouter)</option>
              <option value="auto:groq">Auto Groq (Usa solo Groq)</option>
              <option value="auto:cerebras">Auto Cerebras (Usa solo Cerebras)</option>
            </optgroup>
            
            <optgroup label="🚀 MODELOS GROQ 2026">
              <option value="llama-4-scout-17b-16e-instruct">llama-4-scout-17b-16e-instruct (Llama 4 Nuevo)</option>
              <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (GPT OSS)</option>
              <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (GPT OSS Light)</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Llama 3.3)</option>
              <option value="qwen/qwen3-32b">qwen/qwen3-32b (Qwen 3)</option>
              <option value="moonshotai/kimi-k2-instruct">moonshotai/kimi-k2-instruct (Kimi K2)</option>
            </optgroup>

            <optgroup label="📂 OPENROUTER FREE">
              <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free</option>
              <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small</option>
            </optgroup>

            <optgroup label="📂 CEREBRAS DIRECTO">
              <option value="llama3.1-8b">llama3.1-8b (Cerebras Llama)</option>
              <option value="qwen-3-235b-a22b-instruct-2507">qwen-3-235b-a22b-instruct-2507 (Cerebras Qwen)</option>
            </optgroup>

            <optgroup label="🧪 PRUEBAS Y DIAGNÓSTICO">
              <option value="mock">Prueba: Mock Agent (Simulado)</option>
              <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
            </optgroup>
          </select>"""
        
        content = content[:start_idx] + new_select + content[end_idx:]
        
        with open(landing_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Landing page actualizada con OptGroups.")
    else:
        print("No se pudo encontrar el select para OptGroup en landing.ts")
