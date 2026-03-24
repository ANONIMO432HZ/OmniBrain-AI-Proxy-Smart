async function testReal() {
  console.log("-> Enviando solicitud POST /chat a una API Real (Groq/Llama)...");
  
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // Modelo real soportado en Groq
      messages: [{ role: "user", content: "Dime hola y di que eres real en 1 frase" }]
    })
  });

  if (!response.body) {
    console.error("No se pudo obtener el cuerpo de respuesta");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  console.log("<- Respuesta Real en Streaming:");
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    console.log(chunk);
  }
}

testReal();
