export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Responda apenas: FUNCIONOU' }],
        max_tokens: 20,
      }),
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.json({ erro: error.message });
  }
}

