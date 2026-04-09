import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Trash2, Calendar, FileText, Heart, Filter } from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { copyToClipboard, downloadTextFile, formatDate, getFormatColor, getFormatLabel, getObjectiveColor } from '@/lib/utils';
import { toast } from 'sonner';
import type { GeneratedContent } from '@/types/content';

export function ExportPage() {
  const { contents, removeContent, updateContent, toggleFavorite, favorites } = useContentStore();
  const [filter, setFilter] = useState<'all' | 'rascunho' | 'pronto' | 'agendado' | 'publicado'>('all');
  const [formatFilter, setFormatFilter] = useState('');

  const filtered = contents.filter((c) => {
    const matchStatus = filter === 'all' || c.status === filter;
    const matchFormat = !formatFilter || c.format === formatFilter;
    return matchStatus && matchFormat;
  });

  function handleCopyCaption(c: GeneratedContent) {
    copyToClipboard(c.caption);
    toast.success('Legenda copiada!');
  }

  function handleCopyHashtags(c: GeneratedContent) {
    copyToClipboard(c.hashtags.join(' '));
    toast.success('Hashtags copiadas!');
  }

  function handleExportText(c: GeneratedContent) {
    let text = `TÍTULO: ${c.headline}\n\nLEGENDA:\n${c.caption}\n\nCTA:\n${c.cta}\n\nHASHTAGS:\n${c.hashtags.join(' ')}`;
    if (c.carouselCards) {
      text += `\n\n--- CARDS DO CARROSSEL ---\n${c.carouselCards.map((card, i) => `Card ${i + 1}: ${card.title}\n${card.text}`).join('\n\n')}`;
    }
    if (c.reelScenes) {
      text += `\n\n--- ROTEIRO DO REEL ---\nHook: ${c.reelHook}\n\n${c.reelScenes.map((s, i) => `Cena ${i + 1} (${s.durationSeconds}s):\nTela: ${s.screenText}\nFala: ${s.narration}`).join('\n\n')}`;
    }
    downloadTextFile(text, `conteudo-${c.id}.txt`);
    toast.success('Arquivo exportado!');
  }

  function handleStatusChange(id: string, status: GeneratedContent['status']) {
    updateContent(id, { status });
    toast.success('Status atualizado!');
  }

  const statusColors: Record<string, string> = {
    rascunho: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    pronto: 'bg-green-500/20 text-green-400 border-green-500/30',
    agendado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    publicado: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Exportar / Publicar</h1>
          <p className="text-brand-text-secondary text-sm mt-1">{contents.length} conteúdos na biblioteca</p>
        </div>
      </motion.div>

      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={14} className="text-brand-text-muted" />
            <div className="flex gap-2 flex-wrap">
              {(['all', 'rascunho', 'pronto', 'agendado', 'publicado'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === s ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/40' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}
                >
                  {s === 'all' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
                  {s !== 'all' && <span className="ml-1.5 text-[10px] opacity-60">({contents.filter((c) => c.status === s).length})</span>}
                </button>
              ))}
            </div>
            <select value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)} className="ml-auto bg-brand-elevated border border-brand-border rounded-xl px-3 py-1.5 text-sm text-white outline-none">
              <option value="">Todos os formatos</option>
              <option value="post">Posts</option>
              <option value="carousel">Carrosseis</option>
              <option value="reel">Reels</option>
              <option value="story">Stories</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum conteúdo encontrado"
          description="Crie conteúdos nos módulos de Post, Carrossel ou Reel para vê-los aqui"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((content, i) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${getFormatColor(content.format)}`}>
                      {content.format.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-white font-semibold text-sm">{content.headline || content.title}</p>
                        <span className={`tag-chip text-[10px] ${getFormatColor(content.format)}`}>{getFormatLabel(content.format)}</span>
                        <select
                          value={content.status}
                          onChange={(e) => handleStatusChange(content.id, e.target.value as GeneratedContent['status'])}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-[10px] px-2 py-0.5 rounded-full border bg-transparent outline-none cursor-pointer ${statusColors[content.status]}`}
                        >
                          <option value="rascunho">Rascunho</option>
                          <option value="pronto">Pronto</option>
                          <option value="agendado">Agendado</option>
                          <option value="publicado">Publicado</option>
                        </select>
                      </div>
                      <p className="text-xs text-brand-text-muted mb-2">{formatDate(content.createdAt)}</p>
                      {content.caption && (
                        <p className="text-xs text-brand-text-secondary line-clamp-2">{content.caption.slice(0, 100)}...</p>
                      )}
                      {content.carouselCards && (
                        <p className="text-xs text-brand-text-muted mt-1">{content.carouselCards.length} cards</p>
                      )}
                      {content.reelScenes && (
                        <p className="text-xs text-brand-text-muted mt-1">{content.reelScenes.length} cenas • {content.reelScenes.reduce((s, sc) => s + sc.durationSeconds, 0)}s total</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      <button onClick={() => handleCopyCaption(content)} className="p-1.5 rounded-lg hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all" title="Copiar legenda">
                        <Copy size={14} />
                      </button>
                      <button onClick={() => toggleFavorite(content.id)} className="p-1.5 rounded-lg hover:bg-brand-elevated transition-all" title="Favoritar">
                        <Heart size={14} className={favorites.includes(content.id) ? 'text-brand-secondary fill-brand-secondary' : 'text-brand-text-muted hover:text-brand-secondary'} />
                      </button>
                      <button onClick={() => handleExportText(content)} className="p-1.5 rounded-lg hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all" title="Exportar">
                        <Download size={14} />
                      </button>
                      <button onClick={() => { if (confirm('Remover este conteúdo?')) removeContent(content.id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-brand-text-muted hover:text-red-400 transition-all" title="Remover">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
