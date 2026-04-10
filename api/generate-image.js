export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const { prompt } = req.body;

  if (!apiKey) {
    return res.json({ url: 'https://picsum.photos/seed/' + Date.now() + '/1024/1024' });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Generate a professional Instagram post image: ' + prompt }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          const base64 = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return res.json({ url: 'data:' + mimeType + ';base64,' + base64 });
        }
      }
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Gemini error:', error);
    return res.json({ url: 'https://picsum.photos/seed/' + Date.now() + '/1024/1024' });
  }
}



