export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Generate a simple test image of a blue circle' }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );

    const data = await response.json();
    return res.json({ status: 'test', data: data });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
}


