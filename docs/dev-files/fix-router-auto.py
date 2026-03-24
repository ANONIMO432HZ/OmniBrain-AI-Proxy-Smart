import os

filepath = r"c:\PROYECTOS\AI-SPACE\OmniBrain-API-AI\src\services\provider-router.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# El bloque roto:
#     const now = Date.now();
#     
# 
#     // ACCESO DIRECTO PARA PRUEBAS (Mock Agent)

target = """    const now = Date.now();
    
    // ACCESO DIRECTO PARA PRUEBAS (Mock Agent)"""

replacement = """    const now = Date.now();
    
    // Si no se especifica modelo, asignamos el general de OpenRouter
    if (!params.model) {
      console.log(`[router] Sin modelo especificado. Asignando 'openrouter/free' por defecto.`);
      params.model = "openrouter/free"; 
    }

    // ACCESO DIRECTO PARA PRUEBAS (Mock Agent)"""

if target in content:
    content = content.replace(target, replacement)
else:
    # Intento fallback
    target2 = """    const now = Date.now();


    // ACCESO DIRECTO PARA PRUEBAS (Mock Agent)"""
    content = content.replace(target2, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Router auto fallback restored to openrouter/free!")
