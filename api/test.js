export default function handler(req, res) {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const keyStart = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) : 'nenhuma';
  res.json({ status: 'ok', apiKeyEncontrada: hasKey, inicio: keyStart });
}



