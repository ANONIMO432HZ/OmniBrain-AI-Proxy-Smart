import os
import re

html_path = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\Models_ 'free' _ OpenRouter.html"

if not os.path.exists(html_path):
    print(f"Error: No se encontró el archivo {html_path}")
    exit(1)

with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Patrón más generoso: busca cualquier cosa que parezca "proveedor/modelo:free"
# Puede estar en un href, o en un JSON {"id": "meta-llama/llama-3-8b-instruct:free"}
matches = re.findall(r'([^"\'\s]+\/[^"\'\s]+:free)', content)

# También buscar links de la forma "https://openrouter.ai/modelo:free"
free_models = []
for m in matches:
    # Limpiar posibles residuos si capturó de más
    m_clean = m.strip().replace('\\', '')
    # openrouter.ai/ suele prefijar en los links
    if 'openrouter.ai/' in m_clean:
        m_clean = m_clean.split('openrouter.ai/')[-1]
    if m_clean not in free_models:
        free_models.append(m_clean)

print(f"--- Encontrados {len(free_models)} coincidencias ---")
for f in sorted(free_models):
    print(f" - {f}")

# Además, si existe JSON __NEXT_DATA__, buscaríamos ahí explícitamente
next_match = re.search(r'<script id="__NEXT_DATA__" type="application/json">([^<]+)</script>', content)
if next_match:
    print("\n--- Analizando __NEXT_DATA__ ---")
    import json
    try:
        data = json.loads(next_match.group(1))
        # Recorrer el JSON buscando modelos donde "isFree" o similar esté en true, o que el ID termine en :free
        def find_models(obj):
            founded = []
            if isinstance(obj, dict):
                if 'id' in obj and (str(obj['id']).endswith(':free') or str(obj['id']) == 'openrouter/free'):
                    founded.append(obj['id'])
                for k, v in obj.items():
                    founded.extend(find_models(v))
            elif isinstance(obj, list):
                for item in obj:
                    founded.extend(find_models(item))
            return founded
            
        json_models = list(set(find_models(data)))
        print(f"Encontrados en __NEXT_DATA__: {len(json_models)}")
        for jm in sorted(json_models):
             print(f" * {jm}")
    except Exception as e:
        print("Error parseando JSON:", e)
