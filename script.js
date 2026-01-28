async function enviarImagem() {
  const fileInput = document.getElementById("file");
  const resultado = document.getElementById("resultado");

  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert("Escolha uma imagem primeiro.");
    return;
  }

  const file = fileInput.files[0];

  resultado.innerHTML = "⏳ Analisando imagem...";

  const formData = new FormData();
  formData.append("imagem", file);

  try {
    const r = await fetch("/api/analisar", {
      method: "POST",
      body: formData,
    });

    const data = await r.json();

    if (!r.ok) {
      console.log("Erro API:", data);
      resultado.innerHTML = "❌ Erro: " + (data.error || "Falha na análise");
      return;
    }

    resultado.innerHTML = `
      <h2>Problema</h2>
      <p>${data.problema || "Não identificado"}</p>
      <h2>Solução</h2>
      <p>${data.solucao || "Não identificado"}</p>
    `;
  } catch (e) {
    console.log("Erro:", e);
    resultado.innerHTML = "❌ Erro ao enviar imagem.";
  }
}
