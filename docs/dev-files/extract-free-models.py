import os
import re

html_path = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\Models_ 'free' _ OpenRouter.html"
landing_path = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\routes\landing.ts"

if not os.path.exists(html_path):
    print(f"Error: No se encontró el archivo {html_path}")
    exit(1)

with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    html_content = f.read()

# Extraer IDs de modelo usando Regex en las URLs
# Ejemplo: href="https://openrouter.ai/liquid/lfm-2.5-1.2b-instruct:free"
matches = re.findall(r'href="https://openrouter\.ai/([^"]+)"', html_content)

# Filtrar sólo los que terminen en :free o sean openrouter/free
free_models = []
for m in matches:
    if m.endswith(":free") or m == "openrouter/free":
        # Evitar duplicados
        if m not in free_models:
            free_models.append(m)

# Ordenar alfabéticamente
free_models.sort()

# Generar el bloque HTML de <option>
options_html = ""
for model_id in free_models:
    # Formatear el nombre visible de forma más limpia
    visible_name = model_id.split('/')[-1] if '/' in model_id else model_id
    options_html += f'              <option value="{model_id}">{model_id}</option>\n'

print(f"Encontrados {len(free_models)} modelos gratuitos:")
for m in free_models:
    print(f" - {m}")

# ACTUALIZAR LANDING.TS
if os.path.exists(landing_path):
    with open(landing_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscamos el optgroup de OpenRouter
    target_start = """            <optgroup label="📂 OPENROUTER FREE">"""
    target_end = """            </optgroup>"""
    
    if target_start in content and target_end in content:
        start_idx = content.find(target_start)
        # Buscar el cierre </optgroup> posterior al start_idx
        end_idx = content.find(target_end, start_idx) + len(target_end)
        
        new_group = f"""            <optgroup label="📂 OPENROUTER FREE (Todos los Modelos)">
{options_html}            </optgroup>"""
        
        content = content[:start_idx] + new_group + content[end_idx:]
        
        with open(landing_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("\n[Éxito] Landing page actualizada con la lista completa de modelos Free.")
    else:
        print("\n[Error] No se encontró el optgroup label='📂 OPENROUTER FREE' en landing.ts")
