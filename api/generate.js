export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { prompt, maxTokens = 2000 } = req.body;

  if (!apiKey) {
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
          { role: 'system', content: 'Você é um especialista em marketing digital para Instagram, copywriter profissional e estrategista de conteúdo. Sempre gere conteúdo estratégico, humano e alinhado ao nicho da marca. Responda sempre em português brasileiro.' },
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
}

function getMockResponse(prompt) {
  if (prompt.includes('ideias') || prompt.includes('ideas')) {
    return JSON.stringify([
      { title: '3 Erros que estão travando seu negócio no Instagram', objective: 'autoridade', format: 'carousel', hook: 'Você está cometendo esses erros e nem sabe...', messageSummary: 'Identificar os principais erros e como corrigi-los', suggestedCTA: 'Salva esse post para não esquecer!', tone: 'direto', audienceStage: 'morno', boldness: 'equilibrado' },
      { title: 'Como dobrei meu faturamento em 90 dias', objective: 'autoridade', format: 'reel', hook: 'Em 90 dias fui de R$5k para R$10k. Aqui está o que fiz:', messageSummary: 'Estratégia real de crescimento com passos práticos', suggestedCTA: 'Comenta QUERO para receber o passo a passo', tone: 'inspirador', audienceStage: 'frio', boldness: 'equilibrado' },
      { title: 'O segredo que os top criadores não contam', objective: 'engajamento', format: 'post', hook: 'Ninguém te conta isso sobre crescer no Instagram...', messageSummary: 'Revelar estratégia de consistência e posicionamento', suggestedCTA: 'Marca um amigo que precisa ver isso!', tone: 'emocional', audienceStage: 'frio', boldness: 'agressivo' },
    ]);
  }
  if (prompt.includes('carrossel') || prompt.includes('carousel')) {
    return JSON.stringify({ headline: 'O Guia Completo para Crescer no Instagram', caption: 'Salva esse carrossel! São as estratégias que mais usamos com nossos clientes. 🚀', cta: 'Salva e compartilha!', hashtags: ['#instagram', '#marketingdigital', '#crescimento', '#estrategia', '#conteudo'], designNotes: 'Fundo escuro com tipografia bold. Gradiente roxo.', cards: [{ order: 1, title: 'O Guia Completo para Crescer', text: 'Desliza para descobrir as 5 estratégias →', visualSuggestion: 'Fundo gradiente roxo', style: 'cover' }, { order: 2, title: '1. Consistência é rainha', text: 'Poste no mínimo 5x por semana.', visualSuggestion: 'Ícone de calendário', style: 'content' }, { order: 3, title: '2. Reels de manhã', text: 'Poste reels entre 7h e 9h.', visualSuggestion: 'Gráfico de horários', style: 'content' }, { order: 4, title: '3. Carrosseis geram salvamentos', text: 'Salvamentos são o sinal mais forte para o algoritmo.', visualSuggestion: 'Ícone de bookmark', style: 'content' }, { order: 5, title: '4. CTA em todo post', text: 'Sempre peça uma ação: curtir, salvar, comentar.', visualSuggestion: 'Setas apontando para botões', style: 'content' }, { order: 6, title: 'Pronto para aplicar?', text: 'Comenta CRESCER para material exclusivo! 🎁', visualSuggestion: 'Design de CTA com gradiente', style: 'cta' }] });
  }
  if (prompt.includes('reel') || prompt.includes('roteiro')) {
    return JSON.stringify({ hook: 'Para de errar isso no Instagram!', caption: 'Salva esse reel! 🚀', cta: 'Segue para mais dicas!', hashtags: ['#instagram', '#reels', '#dicas', '#marketingdigital'], editingStyle: 'Cortes rápidos, legendas animadas', scenes: [{ order: 1, screenText: 'Para de errar isso! 🚫', narration: 'Você sabe qual é o maior erro?', visualSuggestion: 'Close no rosto', durationSeconds: 3 }, { order: 2, screenText: 'Não ter consistência', narration: 'A maioria posta sem estratégia.', visualSuggestion: 'Tela dividida', durationSeconds: 5 }, { order: 3, screenText: 'O que fazer:', narration: 'Escolha 3 formatos e alterne.', visualSuggestion: 'Lista aparecendo', durationSeconds: 5 }, { order: 4, screenText: 'Resultado? +200% alcance', narration: 'Consistência = distribuição.', visualSuggestion: 'Gráfico subindo', durationSeconds: 5 }, { order: 5, screenText: 'Segue para mais! 🚀', narration: 'Me segue para estratégias diárias!', visualSuggestion: 'Botão de seguir', durationSeconds: 5 }] });
  }
  if (prompt.includes('legenda') || prompt.includes('caption')) {
    return JSON.stringify({ short: 'O segredo para crescer no Instagram: consistência + estratégia. Você está fazendo isso? 👇', medium: 'Depois de analisar centenas de perfis, descobri que o maior diferencial é simples: consistência E estratégia.\n\nNão basta postar todo dia. Você precisa postar com intenção.\n\nComenta: qual sua maior dificuldade? 👇', long: 'Deixa eu te contar um segredo...\n\nDepois de analisar mais de 500 perfis, vi um padrão claro.\n\nO que faz diferença é CONSISTÊNCIA ESTRATÉGICA:\n✅ Frequência definida\n✅ Pilares claros\n✅ Conhecer o público\n✅ Analisar dados\n✅ Adaptar estratégia\n\nQual seu maior desafio? Comenta! 👇' });
  }
  if (prompt.includes('hashtag')) {
    return JSON.stringify({ highCompetition: ['#marketingdigital', '#instagram', '#empreendedorismo', '#negócios', '#sucesso'], mediumCompetition: ['#marketingdeconteudo', '#crescimentoorgânico', '#instagramdicas', '#estrategiadigital', '#conteudodigital', '#marketingbrasil', '#empreendedor', '#negociosonline', '#vendasonline', '#digitalmarketing', '#socialmedia', '#branding', '#marketing2024', '#businesstips', '#growthhacking'], lowCompetition: ['#agenciadigital', '#criadorderconteudo', '#instagrammarketing2024', '#crescimentoinstagram', '#dicasdeinstagram', '#marketingstrategy', '#conteudoparainstagram', '#instagramtips', '#marketingderesultados', '#gestaoderedes'] });
  }
  return JSON.stringify({ headline: 'Transforme seu Instagram em máquina de resultados', body: '90% dos criadores abandonam antes de ver resultados.', caption: 'Transforme seu Instagram em uma máquina de resultados 🚀\n\n1️⃣ Defina seu nicho\n2️⃣ Crie pilares de conteúdo\n3️⃣ Poste com consistência\n4️⃣ Engaje com a audiência\n5️⃣ Analise semanalmente\n\nQual dessas você não aplica? 👇', cta: 'Salva e compartilha!', hashtags: ['#instagram', '#marketingdigital', '#crescimento', '#estrategia', '#conteudo'], keywords: ['instagram', 'marketing', 'crescimento'], imagePrompt: 'Professional Instagram post, dark background, purple gradient, bold typography, clean premium design' });
}
