export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.json({ status: 'ERROR', message: 'API key NAO encontrada' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Diga apenas: FUNCIONOU' }],
        max_tokens: 20,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return res.json({ status: 'ERRO_OPENAI', error: data.error });
    }
    
    return res.json({ status: 'OK', resposta: data.choices[0].message.content });
  } catch (error) {
    return res.json({ status: 'ERRO', message: error.message });
  }
}

