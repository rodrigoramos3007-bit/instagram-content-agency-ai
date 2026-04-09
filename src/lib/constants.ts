import type { ContentFormat, ContentObjective, ContentTone, AudienceStage, BoldnessLevel } from '@/types/content';

export const CONTENT_FORMATS: { value: ContentFormat; label: string; icon: string; color: string }[] = [
  { value: 'post', label: 'Post Estático', icon: 'Image', color: 'bg-blue-500' },
  { value: 'carousel', label: 'Carrossel', icon: 'LayoutGrid', color: 'bg-purple-500' },
  { value: 'reel', label: 'Reel', icon: 'Play', color: 'bg-pink-500' },
  { value: 'story', label: 'Story', icon: 'Smartphone', color: 'bg-amber-500' },
];

export const CONTENT_OBJECTIVES: { value: ContentObjective; label: string; color: string }[] = [
  { value: 'vendas', label: 'Vendas', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'engajamento', label: 'Engajamento', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'autoridade', label: 'Autoridade', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'leads', label: 'Captação de Leads', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'branding', label: 'Branding', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { value: 'recrutamento', label: 'Recrutamento', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
];

export const CONTENT_TONES: { value: ContentTone; label: string }[] = [
  { value: 'emocional', label: 'Emocional' },
  { value: 'premium', label: 'Premium' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'direto', label: 'Direto ao Ponto' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'profissional', label: 'Profissional' },
  { value: 'leve', label: 'Leve e Descontraído' },
];

export const AUDIENCE_STAGES: { value: AudienceStage; label: string; description: string }[] = [
  { value: 'frio', label: 'Frio', description: 'Ainda não conhece a marca' },
  { value: 'morno', label: 'Morno', description: 'Já conhece, mas não comprou' },
  { value: 'quente', label: 'Quente', description: 'Já é cliente ou lead qualificado' },
];

export const BOLDNESS_LEVELS: { value: BoldnessLevel; label: string }[] = [
  { value: 'conservador', label: 'Conservador' },
  { value: 'equilibrado', label: 'Equilibrado' },
  { value: 'agressivo', label: 'Agressivo' },
];

export const VISUAL_STYLES = [
  { value: 'premium-clean', label: 'Premium Clean', description: 'Elegante, espaçado, sofisticado' },
  { value: 'corporate-modern', label: 'Corporativo Moderno', description: 'Profissional e contemporâneo' },
  { value: 'luxury-discrete', label: 'Luxo Discreto', description: 'Requinte sutil e exclusivo' },
  { value: 'elegant-feminine', label: 'Elegante Feminino', description: 'Delicado, sofisticado, refinado' },
  { value: 'minimalist', label: 'Minimalista', description: 'Clean, simples, focado' },
  { value: 'bold-vibrant', label: 'Ousado e Vibrante', description: 'Cores fortes, impactante' },
  { value: 'authority-pro', label: 'Autoridade Profissional', description: 'Sério, confiável, expert' },
  { value: 'lifestyle-aspirational', label: 'Lifestyle Aspiracional', description: 'Inspirador, desejável' },
  { value: 'editorial-sophisticated', label: 'Editorial Sofisticado', description: 'Artístico e refinado' },
  { value: 'social-proof', label: 'Social Proof', description: 'Resultados e depoimentos em destaque' },
  { value: 'storytelling-visual', label: 'Storytelling Visual', description: 'Narrativa visual envolvente' },
];

export const NICHES = [
  'Moda e Beleza', 'Saúde e Bem-estar', 'Fitness e Esporte', 'Alimentação e Gastronomia',
  'Tecnologia', 'Educação e Cursos', 'Finanças e Investimentos', 'Imóveis',
  'Marketing Digital', 'Consultoria e Coaching', 'Advocacia e Jurídico', 'Medicina e Saúde',
  'Arquitetura e Design', 'Fotografia', 'Música e Entretenimento', 'Viagens e Turismo',
  'Pet e Animais', 'Casamento e Eventos', 'Bebês e Maternidade', 'Sustentabilidade',
  'E-commerce', 'SaaS e Produto Digital', 'Serviços Locais', 'Marca Pessoal',
];

export const COUNTRIES = [
  'Brasil', 'Portugal', 'Estados Unidos', 'Argentina', 'México', 'Espanha',
  'Angola', 'Moçambique', 'Cabo Verde', 'Outro',
];

export const BRAND_GOALS = [
  'Aumentar vendas', 'Gerar leads', 'Construir autoridade', 'Aumentar seguidores',
  'Engajar audiência', 'Lançar produto', 'Construir marca pessoal', 'Recrutar talentos',
];

export const EDITORIAL_PILLARS = [
  { name: 'Educação', color: '#3B82F6', description: 'Conteúdo que ensina e informa' },
  { name: 'Autoridade', color: '#8B5CF6', description: 'Conteúdo que demonstra expertise' },
  { name: 'Vendas', color: '#10B981', description: 'Conteúdo que converte' },
  { name: 'Engajamento', color: '#EC4899', description: 'Conteúdo que gera interação' },
  { name: 'Relacionamento', color: '#F59E0B', description: 'Conteúdo que aproxima da audiência' },
  { name: 'Prova Social', color: '#EF4444', description: 'Depoimentos e resultados' },
];

export const IMAGE_FORMATS = [
  { value: '1:1', label: 'Quadrado (1:1)', width: 1080, height: 1080 },
  { value: '4:5', label: 'Vertical (4:5)', width: 1080, height: 1350 },
  { value: '9:16', label: 'Story (9:16)', width: 1080, height: 1920 },
  { value: '16:9', label: 'Horizontal (16:9)', width: 1920, height: 1080 },
];

export const REEL_DURATIONS = [
  { value: 'short', label: 'Curto (15–30s)', seconds: 30 },
  { value: 'medium', label: 'Médio (30–60s)', seconds: 60 },
  { value: 'long', label: 'Longo (60–90s)', seconds: 90 },
];
