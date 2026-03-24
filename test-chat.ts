async function test() {
  const isFailTest = process.argv.includes("--fail");
  const model = isFailTest ? "fail-first" : "default";

  console.log(`-> Enviando solicitud POST /chat (Modelo: ${model})...`);
  
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: "Hola, dime un chiste corto de programadores" }],
      tools: [
        {
          type: "function",
          function: { 
            name: "get_weather", 
            description: "Obtener clima de una ubicación" 
          }
        }
      ]
    })
  });

  if (!response.body) {
    console.error("No se pudo obtener el cuerpo de respuesta");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  console.log("<- Respuesta recibida:");
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    console.log(chunk);
  }
}

test();
