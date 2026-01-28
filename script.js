async function analisarPlanta() {
  const botao = document.getElementById("btnAnalisar");
  const resultado = document.getElementById("resultado");
  const texto = document.getElementById("textoPlanta")?.value || "";

  // trava só o botão
  botao.disabled = true;
  botao.innerText = "Analisando...";

  resultado.innerText = "⏳ Analisando...";

  try {
    const res = await fetch("/api/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto })
    });

    const data = await res.json();

    if (!res.ok) {
      resultado.innerText = "Erro: " + (data.error || "Falha ao analisar.");
      return;
    }

    resultado.innerText = data.resposta || "Sem resposta.";
  } catch (e) {
    resultado.innerText = "Erro de conexão.";
  } finally {
    // destrava o botão e libera a tela
    botao.disabled = false;
    botao.innerText = "Analisar";
  }
}
