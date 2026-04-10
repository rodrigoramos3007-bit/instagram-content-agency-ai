import axios from 'axios';
import type { Brand } from '@/types/brand';
import type { ContentFormat, ContentObjective, ContentTone, AudienceStage, BoldnessLevel } from '@/types/content';

const API_BASE = '/api';

interface GenerateOptions {
  prompt: string;
  maxTokens?: number;
}

export async function generateText(options: GenerateOptions): Promise<string> {
  const response = await axios.post(`${API_BASE}/generate`, {
    prompt: options.prompt,
    maxTokens: options.maxTokens || 2000,
  });
  return response.data.text;
}

export async function analyzeBrand(data: {
  name: string;
  description: string;
  audience: string;
  website?: string;
  instagram?: string;
  country: string;
  goals: string[];
  preferredTone: string;
}): Promise<string> {
  const response = await axios.post(`${API_BASE}/analyze-brand`, data);
  return response.data.text;
}

export function buildBrandContext(brand: Brand): string {
  const d = brand.diagnostic;
  return `
CONTEXTO DA MARCA:
- Nome: ${brand.name}
- Descrição: ${brand.description}
- Nicho: ${d?.niche || 'Não definido'}
- Público-alvo: ${brand.audience || d?.audience || 'Não definido'}
- Tom de voz: ${brand.preferredTone || d?.tone || 'profissional'}
- País/Região: ${brand.country}
- Objetivos: ${brand.goals.join(', ')}
- Proposta de valor: ${d?.valueProposition || 'Não definida'}
- Posicionamento: ${d?.positioning || 'Não definido'}
- Pilares editoriais: ${d?.editorialPillars?.map((p) => p.name).join(', ') || 'Não definidos'}
`.trim();
}

export async function generateIdeas(
  brand: Brand,
  filters: {
    objective: ContentObjective;
    format: ContentFormat;
    tone: ContentTone;
    audienceStage: AudienceStage;
    boldness: BoldnessLevel;
    count?: number;
  }
): Promise<string> {
  const brandCtx = buildBrandContext(brand);
  const prompt = `${brandCtx}

TAREFA: Gere ${filters.count || 6} ideias de conteúdo para Instagram com as seguintes características:
- Objetivo: ${filters.objective}
- Formato: ${filters.format}
- Tom: ${filters.tone}
- Estágio do público: ${filters.audienceStage}
- Nível de ousadia: ${filters.boldness}

Para cada ideia, retorne um JSON válido no seguinte formato (array):
[
  {
    "title": "Título criativo da ideia",
    "objective": "${filters.objective}",
    "format": "${filters.format}",
    "hook": "Gancho/hook inicial impactante",
    "messageSummary": "Resumo da mensagem principal",
    "suggestedCTA": "CTA sugerido",
    "tone": "${filters.tone}",
    "audienceStage": "${filters.audienceStage}",
        "boldness": "${filters.boldness}",
    "imagePrompt": "Prompt detalhado em inglês para gerar uma imagem profissional para Instagram que represente visualmente esta ideia. Inclua estilo, composição, cores, iluminação e elementos visuais. Use estilo flat design ou ilustração moderna, sem pessoas fotorrealistas."
  }
]

Responda APENAS com o JSON válido, sem texto adicional. Seja criativo, estratégico e alinhado ao nicho da marca.`;

  return generateText({ prompt, maxTokens: 3000 });
}

export async function generatePost(
  brand: Brand,
  idea: { title: string; hook: string; objective: string; tone: string },
  version: 'short' | 'medium' | 'long' | 'emotional' | 'professional' | 'ad' = 'medium'
): Promise<string> {
  const brandCtx = buildBrandContext(brand);
  const versionInstructions: Record<string, string> = {
    short: 'Versão curta: máximo 150 caracteres na legenda',
    medium: 'Versão média: legenda entre 150 e 400 caracteres',
    long: 'Versão longa: legenda completa entre 400 e 1000 caracteres com storytelling',
    emotional: 'Tom emocional: foque em emoção, conexão e identificação',
    professional: 'Tom profissional: foque em autoridade, dados e resultados',
    ad: 'Versão para anúncio pago: foque em conversão direta e urgência',
  };

  const prompt = `${brandCtx}

IDEIA DO POST:
- Título: ${idea.title}
- Hook: ${idea.hook}
- Objetivo: ${idea.objective}
- Tom: ${idea.tone}
- Instrução especial: ${versionInstructions[version]}

TAREFA: Crie um post completo para Instagram. Retorne JSON válido:
{
  "headline": "Headline principal impactante",
  "body": "Texto principal do post",
  "caption": "Legenda completa para Instagram",
  "cta": "Call to action",
  "hashtags": ["hashtag1", "hashtag2", ...até 30],
  "keywords": ["palavra1", "palavra2", ...até 10],
  "imagePrompt": "Prompt detalhado para geração de imagem DALL-E 3 que representa este post"
}

Responda APENAS com JSON válido. O conteúdo deve parecer humano, estratégico e alinhado à marca.`;

  return generateText({ prompt, maxTokens: 2500 });
}

export async function generateCarousel(
  brand: Brand,
  idea: { title: string; hook: string; objective: string; tone: string },
  cardCount: number = 7
): Promise<string> {
  const brandCtx = buildBrandContext(brand);
  const prompt = `${brandCtx}

IDEIA DO CARROSSEL:
- Título: ${idea.title}
- Hook: ${idea.hook}
- Objetivo: ${idea.objective}
- Tom: ${idea.tone}
- Quantidade de cards: ${cardCount}

TAREFA: Crie um carrossel completo para Instagram com ${cardCount} cards. Retorne JSON válido:
{
  "headline": "Headline principal do carrossel",
  "caption": "Legenda completa",
  "cta": "Call to action",
  "hashtags": ["hashtag1", ...até 30],
  "designNotes": "Observações de design e identidade visual",
  "cards": [
    {
      "order": 1,
      "title": "Capa - título impactante",
      "text": "Texto da capa",
      "visualSuggestion": "Descrição do visual sugerido",
      "style": "estilo do card"
    }
  ]
}

Card 1 = capa com headline forte. Último card = CTA.
Responda APENAS com JSON válido.`;

  return generateText({ prompt, maxTokens: 4000 });
}

export async function generateReel(
  brand: Brand,
  idea: { title: string; hook: string; objective: string; tone: string },
  duration: 'short' | 'medium' | 'long' = 'medium'
): Promise<string> {
  const brandCtx = buildBrandContext(brand);
  const durationMap = { short: '15-30 segundos', medium: '30-60 segundos', long: '60-90 segundos' };
  const prompt = `${brandCtx}

IDEIA DO REEL:
- Título: ${idea.title}
- Hook: ${idea.hook}
- Objetivo: ${idea.objective}
- Tom: ${idea.tone}
- Duração: ${durationMap[duration]}

TAREFA: Crie um roteiro completo para Reel do Instagram. Retorne JSON válido:
{
  "hook": "Hook inicial poderoso (primeiros 3 segundos)",
  "caption": "Legenda completa",
  "cta": "CTA final",
  "hashtags": ["hashtag1", ...até 30],
  "editingStyle": "Estilo de edição sugerido",
  "scenes": [
    {
      "order": 1,
      "screenText": "Texto que aparece na tela",
      "narration": "Sugestão de fala/narração",
      "visualSuggestion": "Sugestão de cena/visual",
      "durationSeconds": 5
    }
  ]
}

Responda APENAS com JSON válido. Roteiro dinâmico, envolvente e adaptado ao nicho.`;

  return generateText({ prompt, maxTokens: 4000 });
}

export async function generateCaption(
  brand: Brand,
  topic: string,
  tone: string
): Promise<string> {
  const brandCtx = buildBrandContext(brand);
  const prompt = `${brandCtx}

TEMA DO POST: ${topic}
TOM: ${tone}

TAREFA: Gere 3 versões de legenda para Instagram. Retorne JSON válido:
{
  "short": "Versão curta (até 150 caracteres)",
  "medium": "Versão média (150-400 caracteres)",
  "long": "Versão longa com storytelling (400-1000 caracteres)"
}

Responda APENAS com JSON válido. Legendas humanas, persuasivas e alinhadas ao nicho.`;

  return generateText({ prompt, maxTokens: 2000 });
}

export async function generateHashtags(
  brand: Brand,
  topic: string
): Promise<string> {
  const brandCtx = buildBrandContext(brand);
  const prompt = `${brandCtx}

TEMA: ${topic}

TAREFA: Gere 30 hashtags estratégicas para Instagram. Retorne JSON válido:
{
  "highCompetition": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "mediumCompetition": ["#hashtag1", ...15 hashtags],
  "lowCompetition": ["#hashtag1", ...10 hashtags de nicho específico]
}

Responda APENAS com JSON válido. Hashtags reais, relevantes e estratégicas para o nicho.`;

  return generateText({ prompt, maxTokens: 1500 });
}

export async function generateImagePrompt(
  brand: Brand,
  description: string,
  style: string,
  format: string
): Promise<string> {
  const brandCtx = buildBrandContext(brand);
  const d = brand.diagnostic;
  const colors = d?.colors ? `${d.colors.primary}, ${d.colors.secondary}` : 'cores da marca';
  const prompt = `${brandCtx}

DESCRIÇÃO DO CONTEÚDO: ${description}
ESTILO VISUAL: ${style}
FORMATO: ${format}
CORES DA MARCA: ${colors}

TAREFA: Crie um prompt detalhado para geração de imagem com DALL-E 3. Retorne JSON válido:
{
  "prompt": "Prompt completo e detalhado para DALL-E 3 em inglês, incluindo estilo, composição, cores, iluminação e elementos visuais específicos para Instagram"
}

O prompt deve ser altamente específico, profissional e gerar imagens de qualidade premium para Instagram.
Responda APENAS com JSON válido.`;

  return generateText({ prompt, maxTokens: 800 });
}
