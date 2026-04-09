import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, Sparkles, Heart, Play, LayoutGrid, Image, Smartphone,
  Filter, ChevronRight, X, ArrowRight, RefreshCw
} from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { generateIdeas } from '@/services/openai';
import { CONTENT_OBJECTIVES, CONTENT_FORMATS, CONTENT_TONES, AUDIENCE_STAGES, BOLDNESS_LEVELS } from '@/lib/constants';
import { generateId, getObjectiveColor } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import type { ContentIdea, ContentFormat, ContentObjective, ContentTone, AudienceStage, BoldnessLevel } from '@/types/content';
import { toast } from 'sonner';

const formatIcons: Record<string, React.ReactNode> = {
  reel: <Play size={14} />,
  carousel: <LayoutGrid size={14} />,
  post: <Image size={14} />,
  story: <Smartphone size={14} />,
};

export function IdeaGeneratorPage() {
  const { brand } = useBrandStore();
  const { ideas, addIdea, updateIdea, favorites, toggleFavorite } = useContentStore();
  const navigate = useNavigate();

  const [objective, setObjective] = useState<ContentObjective>('engajamento');
  const [format, setFormat] = useState<ContentFormat>('carousel');
  const [tone, setTone] = useState<ContentTone>('profissional');
  const [audienceStage, setAudienceStage] = useState<AudienceStage>('morno');
  const [boldness, setBoldness] = useState<BoldnessLevel>('equilibrado');
  const [loading, setLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);

  async function handleGenerate() {
    if (!brand) {
      toast.error('Configure sua marca primeiro');
      return;
    }
    setLoading(true);
    try {
      const text = await generateIdeas(brand, { objective, format, tone, audienceStage, boldness, count: 6 });
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Invalid JSON');
      const raw = JSON.parse(jsonMatch[0]) as Omit<ContentIdea, 'id' | 'isFavorite' | 'createdAt'>[];
      raw.forEach((idea) => {
        addIdea({
          ...idea,
          id: generateId(),
          isFavorite: false,
          createdAt: new Date().toISOString(),
        });
      });
      toast.success(`${raw.length} novas ideias geradas!`);
    } catch {
      toast.error('Erro ao gerar ideias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleUseIdea(idea: ContentIdea, target: string) {
    // Store idea in sessionStorage so creator pages can pick it up
    sessionStorage.setItem('selectedIdea', JSON.stringify(idea));
    navigate(target);
  }

  const formatToRoute: Record<ContentFormat, string> = {
    carousel: '/carousel',
    reel: '/reels',
    post: '/posts',
    story: '/posts',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerador de Ideias</h1>
          <p className="text-brand-text-secondary text-sm mt-1">Ideias estratégicas personalizadas para sua marca</p>
        </div>
        <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />}>
          Gerar Ideias
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Filter size={15} className="text-brand-primary" />
              <span className="text-sm font-semibold text-white">Filtros de Conteúdo</span>
            </div>

            <div>
              <p className="text-xs text-brand-text-muted mb-2 uppercase tracking-wider">Objetivo</p>
              <div className="flex flex-wrap gap-2">
                {CONTENT_OBJECTIVES.map((obj) => (
                  <button
                    key={obj.value}
                    onClick={() => setObjective(obj.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${objective === obj.value ? obj.color : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:border-brand-primary/30 hover:text-white'}`}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-brand-text-muted mb-2 uppercase tracking-wider">Formato</p>
                <div className="flex flex-col gap-1.5">
                  {CONTENT_FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${format === f.value ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/40' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}
                    >
                      {formatIcons[f.value]} {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-brand-text-muted mb-2 uppercase tracking-wider">Tom</p>
                <div className="flex flex-col gap-1.5">
                  {CONTENT_TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${tone === t.value ? 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary/40' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-brand-text-muted mb-2 uppercase tracking-wider">Estágio</p>
                <div className="flex flex-col gap-1.5">
                  {AUDIENCE_STAGES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setAudienceStage(s.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${audienceStage === s.value ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}
                    >
                      {s.label}
                      <span className="block text-[10px] opacity-60 mt-0.5">{s.description}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-brand-text-muted mb-2 uppercase tracking-wider">Ousadia</p>
                <div className="flex flex-col gap-1.5">
                  {BOLDNESS_LEVELS.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setBoldness(b.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${boldness === b.value ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {ideas.map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card hover className="h-full flex flex-col" onClick={() => setSelectedIdea(idea)}>
                  <CardContent className="flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-white font-semibold text-sm leading-snug flex-1">{idea.title}</h3>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(idea.id); }}
                        className={`shrink-0 p-1.5 rounded-lg transition-all ${favorites.includes(idea.id) ? 'text-brand-secondary bg-brand-secondary/10' : 'text-brand-text-muted hover:text-brand-secondary'}`}
                      >
                        <Heart size={14} fill={favorites.includes(idea.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`tag-chip ${getObjectiveColor(idea.objective)}`}>{idea.objective}</span>
                      <span className="tag-chip bg-brand-primary/10 text-brand-primary border-brand-primary/20 flex items-center gap-1">
                        {formatIcons[idea.format]} {idea.format}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 mb-4">
                      <div>
                        <p className="text-[11px] text-brand-text-muted uppercase tracking-wider mb-0.5">Hook</p>
                        <p className="text-sm text-brand-text-secondary italic">"{idea.hook}"</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-brand-text-muted uppercase tracking-wider mb-0.5">Mensagem</p>
                        <p className="text-xs text-brand-text-secondary">{idea.messageSummary}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-brand-text-muted uppercase tracking-wider mb-0.5">CTA</p>
                        <p className="text-xs text-brand-primary font-medium">{idea.suggestedCTA}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleUseIdea(idea, formatToRoute[idea.format]); }}
                      className="w-full py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      Criar conteúdo <ArrowRight size={12} />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && ideas.length === 0 && (
        <div className="text-center py-16">
          <Lightbulb size={48} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">Pronto para criar conteúdo estratégico?</p>
          <p className="text-brand-text-muted mb-6">Ajuste os filtros e clique em "Gerar Ideias" para começar</p>
          <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />} size="lg">
            Gerar minhas primeiras ideias
          </Button>
        </div>
      )}

      {/* Idea Detail Drawer */}
      <AnimatePresence>
        {selectedIdea && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedIdea(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-elevated border-l border-brand-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-lg font-bold text-white pr-4">{selectedIdea.title}</h2>
                  <button onClick={() => setSelectedIdea(null)} className="p-2 rounded-xl hover:bg-brand-surface text-brand-text-muted hover:text-white transition-all">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">{selectedIdea.format}</Badge>
                    <span className={`tag-chip ${getObjectiveColor(selectedIdea.objective)}`}>{selectedIdea.objective}</span>
                    <Badge variant="default">{selectedIdea.tone}</Badge>
                    <Badge variant="gold">{selectedIdea.audienceStage}</Badge>
                  </div>

                  {[
                    { label: 'Hook / Gancho', value: selectedIdea.hook, italic: true },
                    { label: 'Resumo da Mensagem', value: selectedIdea.messageSummary },
                    { label: 'CTA Sugerido', value: selectedIdea.suggestedCTA },
                  ].map(({ label, value, italic }) => (
                    <div key={label} className="bg-brand-surface rounded-xl p-4">
                      <p className="text-[11px] text-brand-text-muted uppercase tracking-wider mb-2">{label}</p>
                      <p className={`text-white text-sm leading-relaxed ${italic ? 'italic' : ''}`}>{value}</p>
                    </div>
                  ))}

                  <div className="pt-2 space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => { handleUseIdea(selectedIdea, formatToRoute[selectedIdea.format]); setSelectedIdea(null); }}
                      rightIcon={<ChevronRight size={15} />}
                    >
                      Criar {selectedIdea.format === 'carousel' ? 'Carrossel' : selectedIdea.format === 'reel' ? 'Reel' : 'Post'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { toggleFavorite(selectedIdea.id); }}
                      leftIcon={<Heart size={15} fill={favorites.includes(selectedIdea.id) ? 'currentColor' : 'none'} />}
                    >
                      {favorites.includes(selectedIdea.id) ? 'Favoritado' : 'Favoritar ideia'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
