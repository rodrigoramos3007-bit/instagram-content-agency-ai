export type ContentFormat = 'post' | 'carousel' | 'reel' | 'story';
export type ContentObjective = 'vendas' | 'engajamento' | 'autoridade' | 'leads' | 'branding' | 'recrutamento';
export type ContentTone = 'emocional' | 'premium' | 'educativo' | 'direto' | 'inspirador' | 'profissional' | 'leve';
export type AudienceStage = 'frio' | 'morno' | 'quente';
export type BoldnessLevel = 'conservador' | 'equilibrado' | 'agressivo';
export type ContentStatus = 'rascunho' | 'pronto' | 'agendado' | 'publicado';

export interface ContentIdea {
  id: string;
  title: string;
  objective: ContentObjective;
  format: ContentFormat;
  hook: string;
  messageSummary: string;
  suggestedCTA: string;
  tone: ContentTone;
  audienceStage: AudienceStage;
  boldness: BoldnessLevel;
  isFavorite: boolean;
  createdAt: string;
}

export interface CarouselCard {
  id: string;
  order: number;
  title: string;
  text: string;
  visualSuggestion: string;
  style: string;
  imageUrl?: string;
}

export interface ReelScene {
  id: string;
  order: number;
  screenText: string;
  narration: string;
  visualSuggestion: string;
  durationSeconds: number;
}

export interface GeneratedContent {
  id: string;
  ideaId?: string;
  format: ContentFormat;
  title: string;
  headline: string;
  body: string;
  caption: string;
  cta: string;
  hashtags: string[];
  keywords: string[];
  shortVersion?: string;
  mediumVersion?: string;
  longVersion?: string;
  emotionalVersion?: string;
  professionalVersion?: string;
  adVersion?: string;
  imageUrl?: string;
  imagePrompt?: string;
  carouselCards?: CarouselCard[];
  reelScenes?: ReelScene[];
  reelHook?: string;
  reelEditingStyle?: string;
  status: ContentStatus;
  scheduledAt?: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HashtagSet {
  id: string;
  name: string;
  highCompetition: string[];
  mediumCompetition: string[];
  lowCompetition: string[];
  createdAt: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  format: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  format: ContentFormat;
  objective: ContentObjective;
  niche: string;
  style: string;
  preview: string;
  content: Partial<GeneratedContent>;
  tags: string[];
}
