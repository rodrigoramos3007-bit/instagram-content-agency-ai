const express = require('express');
const cors = require('cors');
const path = require('path');

// Try to load dotenv
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {
  // dotenv not available
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.OPENAI_API_KEY });
});

// Generate text via OpenAI
app.post('/api/generate', async (req, res) => {
  const { prompt, maxTokens = 2000 } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Return mock response for demo mode
    return res.json({ text: getMockResponse(prompt) });
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
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em marketing digital para Instagram, copywriter profissional e estrategista de conteúdo. Sempre gere conteúdo estratégico, humano e alinhado ao nicho da marca. Responda sempre em português brasileiro.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.json({ text: getMockResponse(prompt) });
  }
});

// Generate image via DALL-E 3
app.post('/api/generate-image', async (req, res) => {
  const { prompt, size = '1024x1024', quality = 'hd' } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({ url: `https://picsum.photos/seed/${Date.now()}/1024/1024` });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        size,
        quality,
        n: 1,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ url: data.data[0].url });
  } catch (error) {
    console.error('DALL-E error:', error);
    res.json({ url: `https://picsum.photos/seed/${Date.now()}/1024/1024` });
  }
});

// Analyze brand
app.post('/api/analyze-brand', async (req, res) => {
  const data = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({ text: JSON.stringify(getMockBrandDiagnostic(data.name)) });
  }

  // Forward to /api/generate with brand analysis prompt
  req.body = {
    prompt: `Analise esta marca e retorne diagnóstico estratégico em JSON: ${JSON.stringify(data)}`,
    maxTokens: 3000,
  };

  // Re-use the generate endpoint logic
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um estrategista sênior de marketing digital especializado em Instagram e branding. Analise marcas e retorne diagnósticos estratégicos em JSON.',
          },
          {
            role: 'user',
            content: `Analise a marca "${data.name}" com descrição: "${data.description}", público: "${data.audience}", país: "${data.country}", objetivos: "${data.goals?.join(', ')}", tom preferido: "${data.preferredTone}". Retorne diagnóstico completo em JSON com: niche, nicheIcon, audience, tone, toneScore(0-100), valueProposition, positioning, colors(primary/secondary/accent/background/text em hex), fonts(heading/body), editorialPillars(array com name/percentage/color/description, soma=100), postingFrequency, recommendedFormats, visualStyles, contentCategories.`,
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error.message);
    res.json({ text: result.choices[0].message.content });
  } catch (error) {
    console.error('Brand analysis error:', error);
    res.json({ text: JSON.stringify(getMockBrandDiagnostic(data.name)) });
  }
});

function getMockBrandDiagnostic(name = 'Minha Marca') {
  return {
    niche: 'Marketing Digital e Negócios',
    nicheIcon: 'TrendingUp',
    audience: 'Empreendedores e profissionais liberais entre 25-45 anos',
    tone: 'Profissional com toque inspirador',
    toneScore: 40,
    valueProposition: `${name} oferece soluções que transformam negócios`,
    positioning: 'Autoridade premium no segmento',
    colors: { primary: '#7C3AED', secondary: '#EC4899', accent: '#F59E0B', background: '#0A0A0F', text: '#F8FAFC' },
    fonts: { heading: 'Inter', body: 'Inter' },
    editorialPillars: [
      { name: 'Educação', percentage: 30, color: '#3B82F6', description: 'Conteúdo educativo' },
      { name: 'Autoridade', percentage: 25, color: '#8B5CF6', description: 'Cases e expertise' },
      { name: 'Engajamento', percentage: 20, color: '#EC4899', description: 'Conteúdo viral' },
      { name: 'Vendas', percentage: 15, color: '#10B981', description: 'Conversão' },
      { name: 'Relacionamento', percentage: 10, color: '#F59E0B', description: 'Conexão com audiência' },
    ],
    postingFrequency: '5-7 vezes por semana',
    recommendedFormats: ['carousel', 'reel', 'post'],
    visualStyles: ['Premium Clean', 'Autoridade Profissional'],
    contentCategories: ['Dicas práticas', 'Cases de sucesso', 'Bastidores'],
  };
}

function getMockResponse(prompt) {
  // Return plausible mock JSON based on prompt content
  if (prompt.includes('ideias') || prompt.includes('ideas')) {
    return JSON.stringify([
      {
        title: '3 Erros que estão travando seu negócio no Instagram',
        objective: 'autoridade',
        format: 'carousel',
        hook: 'Você está cometendo esses erros e nem sabe...',
        messageSummary: 'Identificar os principais erros e como corrigi-los',
        suggestedCTA: 'Salva esse post para não esquecer!',
        tone: 'direto',
        audienceStage: 'morno',
        boldness: 'equilibrado',
      },
      {
        title: 'Como dobrei meu faturamento em 90 dias',
        objective: 'autoridade',
        format: 'reel',
        hook: 'Em 90 dias fui de R$5k para R$10k. Aqui está o que fiz:',
        messageSummary: 'Estratégia real de crescimento com passos práticos',
        suggestedCTA: 'Comenta QUERO abaixo para receber o passo a passo',
        tone: 'inspirador',
        audienceStage: 'frio',
        boldness: 'equilibrado',
      },
      {
        title: 'O segredo que os top criadores de conteúdo não contam',
        objective: 'engajamento',
        format: 'post',
        hook: 'Ninguém te conta isso sobre crescer no Instagram...',
        messageSummary: 'Revelar estratégia de consistência e posicionamento',
        suggestedCTA: 'Marca um amigo que precisa ver isso!',
        tone: 'emocional',
        audienceStage: 'frio',
        boldness: 'agressivo',
      },
    ]);
  }

  if (prompt.includes('carrossel') || prompt.includes('carousel')) {
    return JSON.stringify({
      headline: 'O Guia Completo para Crescer no Instagram em 2024',
      caption: 'Salva esse carrossel! São as estratégias que mais usamos com nossos clientes. 🚀\n\nQual dessas dicas você já aplica? Comenta abaixo! 👇',
      cta: 'Salva e compartilha com quem precisa!',
      hashtags: ['#instagram', '#marketingdigital', '#crescimento', '#estrategia', '#conteudo'],
      designNotes: 'Use fundo escuro com tipografia bold. Gradiente roxo para destaques.',
      cards: [
        { order: 1, title: 'O Guia Completo para Crescer no Instagram', text: 'Desliza para descobrir as 5 estratégias que realmente funcionam →', visualSuggestion: 'Fundo gradiente roxo com tipografia grande e bold', style: 'cover' },
        { order: 2, title: '1. Consistência é rainha', text: 'Poste no mínimo 5x por semana. O algoritmo favorece quem aparece todos os dias.', visualSuggestion: 'Ícone de calendário com checkmarks', style: 'content' },
        { order: 3, title: '2. Reels no início do dia', text: 'Poste reels entre 7h e 9h para pegar o pico de audiência matinal.', visualSuggestion: 'Gráfico de horários com destaque no período da manhã', style: 'content' },
        { order: 4, title: '3. Carrosseis geram salvamentos', text: 'Salvamentos são o sinal mais forte para o algoritmo. Carrosseis educativos são perfeitos.', visualSuggestion: 'Ícone de bookmark com número crescendo', style: 'content' },
        { order: 5, title: '4. CTA em todo post', text: 'Sempre peça uma ação: curtir, salvar, comentar ou compartilhar.', visualSuggestion: 'Setas apontando para botões de engajamento', style: 'content' },
        { order: 6, title: '5. Analise seus dados semanalmente', text: 'Sem análise, você está voando às cegas. Veja o que funciona e dobre a aposta.', visualSuggestion: 'Dashboard de métricas simplificado', style: 'content' },
        { order: 7, title: 'Pronto para aplicar?', text: 'Comenta CRESCER abaixo e vou te mandar um material exclusivo! 🎁', visualSuggestion: 'Design de CTA com gradiente e emoji', style: 'cta' },
      ],
    });
  }

  if (prompt.includes('reel') || prompt.includes('roteiro')) {
    return JSON.stringify({
      hook: 'Para de errar isso no Instagram! (95% das pessoas fazem isso errado)',
      caption: 'Salva esse reel! Essas dicas mudaram meu perfil completamente 🚀\n\nQual foi a dica que mais te surpreendeu? Comenta abaixo! 👇',
      cta: 'Segue para mais dicas como essa todo dia!',
      hashtags: ['#instagram', '#reels', '#dicas', '#marketingdigital', '#crescimento'],
      editingStyle: 'Cortes rápidos, legendas animadas, música eletrônica motivacional, efeito zoom no início',
      scenes: [
        { order: 1, screenText: 'Para de errar isso no Instagram! 🚫', narration: 'Você sabe qual é o maior erro de quem não cresce no Instagram?', visualSuggestion: 'Close no rosto, expressão impactada', durationSeconds: 3 },
        { order: 2, screenText: 'É não ter consistência de formato', narration: 'A maioria das pessoas posta qualquer coisa, sem estratégia nenhuma.', visualSuggestion: 'Tela dividida mostrando perfil bagunçado vs organizado', durationSeconds: 5 },
        { order: 3, screenText: 'O que fazer em vez disso:', narration: 'Escolha 3 formatos que você domina e alterne entre eles na semana.', visualSuggestion: 'Lista aparecendo: Reel, Carrossel, Post', durationSeconds: 5 },
        { order: 4, screenText: 'Resultado? +200% de alcance', narration: 'Quando você mantém consistência, o algoritmo te distribui muito mais.', visualSuggestion: 'Gráfico subindo com fundo verde', durationSeconds: 5 },
        { order: 5, screenText: 'Segue para mais dicas! 🚀', narration: 'Me segue aqui para receber estratégias todos os dias!', visualSuggestion: 'Mão apontando para botão de seguir', durationSeconds: 5 },
      ],
    });
  }

  if (prompt.includes('legenda') || prompt.includes('caption')) {
    return JSON.stringify({
      short: 'O segredo para crescer no Instagram é simples: consistência + estratégia. Você está fazendo isso? 👇',
      medium: 'Depois de analisar centenas de perfis, descobri que o maior diferencial dos criadores que crescem rápido é simples: eles são consistentes E estratégicos.\n\nNão basta postar todo dia. Você precisa postar com intenção. Qual é o objetivo de cada post?\n\nComenta abaixo: qual é sua maior dificuldade no Instagram? 👇',
      long: 'Deixa eu te contar um segredo que levei meses para descobrir...\n\nDepois de analisar mais de 500 perfis do Instagram, vi um padrão claro nos que crescem de forma consistente.\n\nNão é o número de seguidores que importa. Não é ter equipamento caro. Não é nem ter muito tempo disponível.\n\nO que realmente faz diferença é a CONSISTÊNCIA ESTRATÉGICA.\n\nIsso significa:\n✅ Postar com frequência definida\n✅ Ter pilares de conteúdo claros\n✅ Conhecer profundamente quem é seu público\n✅ Analisar os dados semanalmente\n✅ Adaptar a estratégia com base nos resultados\n\nSimples? Parece. Mas a maioria das pessoas desiste antes de ver os resultados.\n\nQual é o seu maior desafio no Instagram agora? Me conta nos comentários, vou responder todos! 👇\n\n#marketingdigital #instagram #crescimentoorgânico #estratégia',
    });
  }

  if (prompt.includes('hashtag')) {
    return JSON.stringify({
      highCompetition: ['#marketingdigital', '#instagram', '#empreendedorismo', '#negócios', '#sucesso'],
      mediumCompetition: ['#marketingdeconteudo', '#crescimentoorgânico', '#instagramdicas', '#estrategiadigital', '#conteudodigital', '#marketingbrasil', '#empreendedor', '#negociosonline', '#vendasonline', '#digitalmarketing'],
      lowCompetition: ['#agenciadigital', '#criadorderconteudo', '#instagrammarketing2024', '#crescimentoinstagram', '#dicasdeinstagram', '#marketingstrategy', '#conteudoparainstagram', '#instagramtips', '#marketingderesultados', '#gestaoderedes'],
    });
  }

  // Default post response
  return JSON.stringify({
    headline: 'Transforme seu Instagram em uma máquina de resultados',
    body: 'Você sabia que 90% dos criadores de conteúdo abandonam o Instagram antes de ver resultados? Não seja um deles.',
    caption: 'Transforme seu Instagram em uma máquina de resultados 🚀\n\nDepois de trabalhar com centenas de marcas, aprendi que o sucesso no Instagram não é sorte — é estratégia.\n\nE hoje quero compartilhar com você o framework que mais funciona:\n\n1️⃣ Defina seu nicho com precisão\n2️⃣ Crie pilares de conteúdo claros\n3️⃣ Poste com consistência de formato\n4️⃣ Engaje ativamente com sua audiência\n5️⃣ Analise e otimize semanalmente\n\nQual dessas etapas você ainda não aplica? Me conta nos comentários! 👇',
    cta: 'Salva esse post e compartilha com alguém que precisa!',
    hashtags: ['#instagram', '#marketingdigital', '#crescimento', '#estrategia', '#conteudo', '#empreendedorismo', '#negócios', '#dicas'],
    keywords: ['instagram', 'marketing digital', 'crescimento', 'estratégia', 'conteúdo'],
    imagePrompt: 'Professional Instagram post image, modern dark background with purple gradient, bold typography, clean and premium design, digital marketing concept, Brazilian entrepreneur, high quality photography style',
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API Key: ${process.env.OPENAI_API_KEY ? 'Configurada ✅' : 'Não configurada (modo demo) ⚠️'}`);
});
