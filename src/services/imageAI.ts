import axios from 'axios';

interface GenerateImageOptions {
  prompt: string;
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  headline?: string;
  brandName?: string;
}

export async function generateImage(options: GenerateImageOptions): Promise<string> {
  const response = await axios.post('/api/generate-image', {
    prompt: options.prompt,
    size: options.size || '1024x1024',
    quality: options.quality || 'hd',
    headline: options.headline || '',
    brandName: options.brandName || '',
  });
  return response.data.url;
}

export function formatToSize(format: string): '1024x1024' | '1024x1792' | '1792x1024' {
  const map: Record<string, '1024x1024' | '1024x1792' | '1792x1024'> = {
    '1:1': '1024x1024',
    '4:5': '1024x1024',
    '9:16': '1024x1792',
    '16:9': '1792x1024',
  };
  return map[format] || '1024x1024';
}

