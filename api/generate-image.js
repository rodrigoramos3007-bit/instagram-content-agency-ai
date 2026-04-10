export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { prompt, size, quality, headline, brandName } = req.body;

  if (!apiKey) {
    return res.json({ url: '', error: 'No API key' });
  }

  var finalPrompt = 'Create a professional Instagram post image ready to publish. ';
  if (headline) {
    finalPrompt += 'The image MUST include the following text written clearly and prominently on the image: "' + headline + '". ';
  }
  if (brandName) {
    finalPrompt += 'Include the brand name "' + brandName + '" at the bottom of the image. ';
  }
  finalPrompt += 'Design instructions: ' + prompt + '. ';
  finalPrompt += 'Style: Modern Instagram post graphic design, dark premium background with purple and pink gradient accents, bold clean typography, professional layout, text must be perfectly readable and centered, NO photorealistic people, use abstract shapes and icons, square 1:1 format, high contrast, visually striking and scroll-stopping. The text on the image must be in Portuguese.';

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: finalPrompt,
        size: size || '1024x1024',
        quality: quality || 'hd',
        n: 1,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return res.json({ url: data.data[0].url });
  } catch (error) {
    console.error('Image error:', error);
    return res.json({ url: '', error: error.message });
  }
}
