function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function enviarImagem() {
  const fileInput = document.getElementById("file");
  const resultado = document.getElementById("resultado");
  const btn = document.getElementById("btnAnalisar");

  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert("Escolha uma imagem primeiro.");
    return;
  }

  const file = fileInput.files[0];

  // trava só o botão
  if (btn) {
    btn.disabled = true;
    btn.innerText = "Analisando...";
  }

  resultado.innerHTML = "⏳ Analisando imagem...";

  try {
    const imagemBase64 = await toBase64(file);

    const r = await fetch("/api/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagemBase64 })
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
    console.log(e);
    resultado.innerHTML = "❌ Erro ao analisar. Veja o Console.";
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Analisar Planta";
    }
  }
}
