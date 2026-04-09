import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getObjectiveColor(objective: string): string {
  const map: Record<string, string> = {
    vendas: 'bg-green-500/20 text-green-400 border-green-500/30',
    engajamento: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    autoridade: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    leads: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    branding: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    recrutamento: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };
  return map[objective] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export function getFormatColor(format: string): string {
  const map: Record<string, string> = {
    post: 'bg-blue-500/20 text-blue-400',
    carousel: 'bg-purple-500/20 text-purple-400',
    reel: 'bg-pink-500/20 text-pink-400',
    story: 'bg-amber-500/20 text-amber-400',
  };
  return map[format] || 'bg-gray-500/20 text-gray-400';
}

export function getFormatLabel(format: string): string {
  const map: Record<string, string> = {
    post: 'Post',
    carousel: 'Carrossel',
    reel: 'Reel',
    story: 'Story',
  };
  return map[format] || format;
}
