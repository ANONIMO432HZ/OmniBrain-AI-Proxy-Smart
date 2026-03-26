async function test() {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hola, cuéntame una historia para probar el stream" })
  });

  console.log(`Status: ${response.status}`);
  if (!response.ok) {
    const text = await response.text();
    console.error(`Error: ${text}`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log(decoder.decode(value, { stream: true }));
  }
  console.log("Stream completado");
}

test().catch(console.error);
