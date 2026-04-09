export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandFont {
  heading: string;
  body: string;
}

export interface EditorialPillar {
  name: string;
  percentage: number;
  color: string;
  description: string;
}

export interface BrandDiagnostic {
  niche: string;
  nicheIcon: string;
  audience: string;
  tone: string;
  toneScore: number; // 0=very formal, 100=very casual
  valueProposition: string;
  positioning: string;
  colors: BrandColors;
  fonts: BrandFont;
  editorialPillars: EditorialPillar[];
  postingFrequency: string;
  recommendedFormats: string[];
  visualStyles: string[];
  contentCategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  website?: string;
  instagram?: string;
  audience: string;
  country: string;
  goals: string[];
  preferredTone: string;
  apiKey?: string;
  diagnostic?: BrandDiagnostic;
  createdAt: string;
  updatedAt: string;
}
