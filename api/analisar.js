export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { texto } = req.body || {};
    if (!texto || texto.trim().length < 5) {
      return res.status(400).json({ error: "Escreva um texto maior para análise." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY não configurada na Vercel." });
    }

    const prompt = `
Você é um especialista em jardinagem e paisagismo.
Analise o texto do usuário e responda em português, organizado em tópicos:

1) Diagnóstico do problema
2) Causas mais prováveis
3) O que fazer agora (passo a passo)
4) Materiais/itens necessários
5) Cuidados e prevenção
6) Resumo final curto

Texto do usuário:
${texto}
`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um especialista em jardinagem." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Erro ao chamar a OpenAI", details: data });
    }

    const resposta = data?.choices?.[0]?.message?.content || "Sem resposta.";
    return res.status(200).json({ resposta });
  } catch (err) {
    return res.status(500).json({ error: "Erro no servidor", details: String(err) });
  }
}
