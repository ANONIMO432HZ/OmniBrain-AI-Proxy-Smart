import os

filepath = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\routes\landing.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# El bloque de formulario actual que pusimos:
target = """          <select id="model" name="model">
            <option value="">Auto por proveedor (Round Robin / Default)</option>
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
            <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free (OpenRouter Free)</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small (OpenRouter Free)</option>
            <option value="llama3.1-8b">llama3.1-8b (Cerebras)</option>
            <option value="mock">Prueba: Mock Agent (Simulado)</option>
            <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
          </select>"""

replacement = """          <select id="model" name="model">
            <option value="">Auto por proveedor (Round Robin / Default)</option>
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
            <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free (OpenRouter Free)</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small (OpenRouter Free)</option>
            <option value="llama3.1-8b">llama3.1-8b (Cerebras Llama)</option>
            <option value="qwen-3-235b-a22b-instruct-2507">qwen-3-235b-a22b-instruct-2507 (Cerebras Qwen)</option>
            <option value="mock">Prueba: Mock Agent (Simulado)</option>
            <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
          </select>"""

if target in content:
    content = content.replace(target, replacement)
    print("Modificado target 1")
else:
    print("Target 1 no encontrado. Puede que no se guardara la select anterior.")
    # Intento de rescate si el select anterior no se guardó o falló el script anterior
    alt_target = """        <form id="chat-form">
          <label for="model">Modelo (opcional)</label>
          <select id="model" name="model">
            <option value="">Auto por proveedor (Round Robin / Default)</option>
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
            <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free (OpenRouter Free)</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small (OpenRouter Free)</option>
            <option value="llama3.1-8b">llama3.1-8b (Cerebras)</option>
            <option value="mock">Prueba: Mock Agent (Simulado)</option>
            <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
          </select>"""
    
    alt_replacement = """        <form id="chat-form">
          <label for="model">Modelo (opcional)</label>
          <select id="model" name="model">
            <option value="">Auto por proveedor (Round Robin / Default)</option>
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
            <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free (OpenRouter Free)</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small (OpenRouter Free)</option>
            <option value="llama3.1-8b">llama3.1-8b (Cerebras Llama)</option>
            <option value="qwen-3-235b-a22b-instruct-2507">qwen-3-235b-a22b-instruct-2507 (Cerebras Qwen)</option>
            <option value="mock">Prueba: Mock Agent (Simulado)</option>
            <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
          </select>"""
    if alt_target in content:
        content = content.replace(alt_target, alt_replacement)
        print("Modificado alt_target")
    else:
        print("Alt target tampoco encontrado. Haciendo Overwrite parcial.")
        # Como último recurso, buscaré <form id="chat-form"> y re-generaré el bloque interno por completo

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Landing page script full correct execution completed.")
