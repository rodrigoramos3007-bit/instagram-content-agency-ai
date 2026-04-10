export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { prompt, size, quality } = req.body;

  if (!apiKey) {
    return res.json({ url: 'https://picsum.photos/seed/' + Date.now() + '/1024/1024' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        size: size || '1024x1024',
        quality: quality || 'hd',
        n: 1,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return res.json({ url: data.data[0].url });
  } catch (error) {
    return res.json({ url: 'https://picsum.photos/seed/' + Date.now() + '/1024/1024' });
  }
}


