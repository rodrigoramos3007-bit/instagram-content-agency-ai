import type { Brand, BrandDiagnostic } from '@/types/brand';
import { analyzeBrand, generateText } from './openai';

export async function performBrandAnalysis(data: {
  name: string;
  description: string;
  audience: string;
  website?: string;
  instagram?: string;
  country: string;
  goals: string[];
  preferredTone: string;
}): Promise<BrandDiagnostic> {
  const prompt = `
Você é um estrategista sênior de marketing digital especializado em Instagram.
Analise a seguinte marca e retorne um diagnóstico estratégico completo.

DADOS DA MARCA:
- Nome: ${data.name}
- Descrição: ${data.description}
- Público-alvo: ${data.audience}
- Website: ${data.website || 'Não informado'}
- Instagram: ${data.instagram || 'Não informado'}
- País: ${data.country}
- Objetivos: ${data.goals.join(', ')}
- Tom preferido: ${data.preferredTone}

Retorne APENAS um JSON válido com esta estrutura exata:
{
  "niche": "Nicho específico da marca",
  "nicheIcon": "Nome de um ícone Lucide React adequado (ex: ShoppingBag, Heart, Briefcase)",
  "audience": "Descrição detalhada do público-alvo",
  "tone": "Tom de voz ideal para a marca",
  "toneScore": 45,
  "valueProposition": "Proposta de valor única da marca",
  "positioning": "Posicionamento estratégico no mercado",
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX",
    "background": "#HEX",
    "text": "#HEX"
  },
  "fonts": {
    "heading": "Nome da fonte para títulos",
    "body": "Nome da fonte para corpo"
  },
  "editorialPillars": [
    { "name": "Nome do pilar", "percentage": 30, "color": "#HEX", "description": "Descrição" }
  ],
  "postingFrequency": "X vezes por semana",
  "recommendedFormats": ["carousel", "reel", "post"],
  "visualStyles": ["Premium Clean", "Autoridade Profissional"],
  "contentCategories": ["Educacional", "Cases de sucesso", "Dicas rápidas"]
}

toneScore: 0 = muito formal, 100 = muito casual.
editorialPillars deve ter de 4 a 6 pilares com soma de percentages = 100.
Responda APENAS com o JSON válido.`;

  const text = await generateText({ prompt, maxTokens: 3000 });
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]) as BrandDiagnostic;
  } catch {
    // Return mock diagnostic if parsing fails
    return getMockDiagnostic(data.name);
  }
}

export function getMockDiagnostic(brandName: string = 'Minha Marca'): BrandDiagnostic {
  return {
    niche: 'Marketing Digital e Negócios',
    nicheIcon: 'TrendingUp',
    audience: 'Empreendedores e profissionais liberais entre 25-45 anos que buscam crescimento profissional',
    tone: 'Profissional com toque inspirador',
    toneScore: 40,
    valueProposition: `${brandName} oferece soluções estratégicas que transformam negócios e geram resultados reais`,
    positioning: 'Autoridade premium no segmento, com foco em resultados práticos e mensuráveis',
    colors: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#0A0A0F',
      text: '#F8FAFC',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    editorialPillars: [
      { name: 'Educação', percentage: 30, color: '#3B82F6', description: 'Conteúdo que ensina e agrega valor' },
      { name: 'Autoridade', percentage: 25, color: '#8B5CF6', description: 'Cases, resultados e expertise' },
      { name: 'Engajamento', percentage: 20, color: '#EC4899', description: 'Conteúdo interativo e viral' },
      { name: 'Vendas', percentage: 15, color: '#10B981', description: 'Ofertas e conversão direta' },
      { name: 'Relacionamento', percentage: 10, color: '#F59E0B', description: 'Aproximação com a audiência' },
    ],
    postingFrequency: '5-7 vezes por semana',
    recommendedFormats: ['carousel', 'reel', 'post'],
    visualStyles: ['Premium Clean', 'Autoridade Profissional', 'Editorial Sofisticado'],
    contentCategories: [
      'Dicas práticas', 'Cases de sucesso', 'Bastidores', 'Depoimentos',
      'Tendências do mercado', 'Reflexões e motivação'
    ],
  };
}
