export default async function handler(req, res) {
  // liberar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Pré-flight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { texto } = req.body || {};

    if (!texto || texto.trim().length < 5) {
      return res.status(400).json({ error: "Texto inválido" });
    }

    // resposta simples (pode trocar depois por IA real)
    return res.status(200).json({
      resposta: `✅ Análise recebida! Texto: "${texto.substring(0, 120)}"...`
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro no servidor" });
  }
}
