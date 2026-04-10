export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { prompt, maxTokens = 2000 } = req.body;

  if (!apiKey) {
    return res.json({ text: '{"error":"no key"}' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um especialista em marketing digital para Instagram, copywriter profissional e estrategista de conteúdo. Sempre gere conteúdo estratégico, humano e alinhado ao nicho da marca. Responda sempre em português brasileiro.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return res.json({ text: data.choices[0].message.content });
  } catch (error) {
    return res.json({ text: JSON.stringify({ headline: 'Erro na API', body: error.message, caption: 'Erro: ' + error.message, cta: 'Tente novamente', hashtags: ['#erro'], keywords: ['erro'], imagePrompt: 'error' }) });
  }
}
