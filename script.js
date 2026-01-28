async function enviarImagem() {
  const input = document.getElementById("file");
  const resultado = document.getElementById("resultado");

  if (!input || !input.files || input.files.length === 0) {
    alert("Escolha uma imagem primeiro!");
    return;
  }

  resultado.innerHTML = `<p>⏳ Analisando... aguarde</p>`;

  try {
    const file = input.files[0];

    const base64 = await toBase64(file);

    const r = await fetch("/api/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagemBase64: base64 }),
    });

    const data = await r.json();

    if (!r.ok) {
      resultado.innerHTML = `<p style="color:red;">Erro: ${data.error || "Erro desconhecido"}</p>`;
      return;
    }

    resultado.innerHTML = `
      <h2>Problema</h2>
      <p>${data.problema || "Não identificado"}</p>

      <h2>Solução</h2>
      <p>${data.solucao || "Sem solução"}</p>
    `;
  } catch (e) {
    resultado.innerHTML = `<p style="color:red;">Falha: ${String(e)}</p>`;
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
