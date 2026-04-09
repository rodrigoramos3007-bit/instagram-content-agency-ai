import type { ContentFormat, ContentObjective } from './content';

export interface CalendarPost {
  id: string;
  contentId?: string;
  title: string;
  format: ContentFormat;
  objective: ContentObjective;
  pillar: string;
  color: string;
  date: string; // ISO date string
  time?: string;
  status: 'rascunho' | 'pronto' | 'agendado' | 'publicado';
  notes?: string;
}

export type CalendarView = 'month' | 'week';
