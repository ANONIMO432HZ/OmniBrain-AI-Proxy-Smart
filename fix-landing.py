import os

filepath = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\routes\landing.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# El bloque de formulario actual:
#         <form id="chat-form">
#
#           <label for="message">Mensaje</label>

target = """        <form id="chat-form">

          <label for="message">Mensaje</label>"""

replacement = """        <form id="chat-form">
          <label for="model">Modelo (opcional)</label>
          <select id="model" name="model">
            <option value="">Auto por proveedor (Round Robin / Default)</option>
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
            <option value="google/gemini-2.0-flash:free">google/gemini-2.0-flash:free (OpenRouter Free)</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">mistralai/mistral-small (OpenRouter Free)</option>
            <option value="llama3.1-8b">llama3.1-8b (Cerebras)</option>
            <option value="mock">Prueba: Mock Agent (Simulado)</option>
            <option value="fail-first">Prueba: Circuit Breaker (Forzado)</option>
          </select>

          <label for="message">Mensaje</label>"""

if target in content:
    content = content.replace(target, replacement)
else:
    # Intento con menos saltos de línea por si acaso
    target2 = """        <form id="chat-form">
          <label for="message">Mensaje</label>"""
    replacement2 = replacement
    content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.read = f.write(content)

print("Landing page updated successfully!")
