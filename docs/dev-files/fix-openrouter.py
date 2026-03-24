import os

filepath = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\services\openrouter.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# El bucle roto que dejó la herramienta:
#         const lines = buffer.split("\n");
#         buffer = lines.pop() ?? "";
# 
# 
#           const chunk: StreamChunk = {};

target = """        const lines = buffer.split("\\n");
        buffer = lines.pop() ?? "";

          const chunk: StreamChunk = {};"""

replacement = """        const lines = buffer.split("\\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const event = decodeSseLine(line);
          if (!event) continue;

          // DETECTAR ERRORES EMBEBIDOS EN EL FLUJO SSE
          if (event.error) {
            throw new Error(`OpenRouter Stream Error: ${event.error.message || JSON.stringify(event.error)}`);
          }

          const delta = event.choices?.[0]?.delta;
          const usage = event.usage;

          if (!delta && !usage) continue;

          const chunk: StreamChunk = {};"""

if target in content:
    content = content.replace(target, replacement)
    print("Coreccion OpenRouter aplicada satisfactoriamente.")
else:
    # Intento fallback si los saltos de línea varían
    alt_target = """        const lines = buffer.split("\\n");
        buffer = lines.pop() ?? "";


          const chunk: StreamChunk = {};"""
    if alt_target in content:
         content = content.replace(alt_target, replacement)
         print("Coreccion OpenRouter alt aplicada.")
    else:
         print("No se encontró el bloque roto para OpenRouter. Sobrescribiendo.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
