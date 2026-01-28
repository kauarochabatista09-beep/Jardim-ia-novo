export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { imagemBase64 } = req.body || {};

    if (!imagemBase64) {
      return res.status(400).json({ error: "Envie a imagemBase64" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY não configurada na Vercel" });
    }

    const prompt = `
Você é um especialista em jardinagem e doenças de plantas.
Analise a imagem da planta e responda APENAS com JSON válido:

{
  "problema": "descreva o problema principal da planta",
  "solucao": "explique a solução em passos claros"
}
`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imagemBase64 } }
            ],
          },
        ],
        temperature: 0.3
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Erro ao chamar OpenAI", details: data });
    }

    const text = data?.choices?.[0]?.message?.content || "";

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      // fallback se a IA não devolver JSON perfeito
      return res.status(200).json({
        problema: "Não identificado",
        solucao: text
      });
    }

    return res.status(200).json({
      problema: json.problema || "Não identificado",
      solucao: json.solucao || "Sem solução"
    });
  } catch (e) {
    return res.status(500).json({ error: "Erro interno", details: String(e) });
  }
}
