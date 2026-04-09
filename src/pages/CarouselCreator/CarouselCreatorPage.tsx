import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Sparkles, Plus, Trash2, Copy, Download, Heart, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { generateCarousel } from '@/services/openai';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { generateId, copyToClipboard, downloadTextFile } from '@/lib/utils';
import { CONTENT_OBJECTIVES, CONTENT_TONES } from '@/lib/constants';
import type { CarouselCard, GeneratedContent } from '@/types/content';
import { toast } from 'sonner';

export function CarouselCreatorPage() {
  const { brand } = useBrandStore();
  const { addContent } = useContentStore();

  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('autoridade');
  const [tone, setTone] = useState('profissional');
  const [cardCount, setCardCount] = useState(7);
  const [cards, setCards] = useState<CarouselCard[]>([]);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [headline, setHeadline] = useState('');
  const [cta, setCta] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const idea = sessionStorage.getItem('selectedIdea');
    if (idea) {
      const parsed = JSON.parse(idea);
      setTopic(parsed.title);
      setTone(parsed.tone || 'profissional');
      setObjective(parsed.objective || 'autoridade');
      sessionStorage.removeItem('selectedIdea');
    }
  }, []);

  async function handleGenerate() {
    if (!brand) { toast.error('Configure sua marca primeiro'); return; }
    if (!topic) { toast.error('Informe o tema do carrossel'); return; }
    setLoading(true);
    try {
      const text = await generateCarousel(brand, { title: topic, hook: topic, objective, tone }, cardCount);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON');
      const data = JSON.parse(jsonMatch[0]);
      setHeadline(data.headline || '');
      setCaption(data.caption || '');
      setCta(data.cta || '');
      setHashtags(data.hashtags || []);
      setDesignNotes(data.designNotes || '');
      const parsedCards: CarouselCard[] = (data.cards || []).map((c: Partial<CarouselCard>, i: number) => ({
        id: generateId(),
        order: i,
        title: c.title || `Card ${i + 1}`,
        text: c.text || '',
        visualSuggestion: c.visualSuggestion || '',
        style: c.style || 'content',
      }));
      setCards(parsedCards);
      setPreviewIndex(0);
      toast.success('Carrossel criado!');
    } catch {
      toast.error('Erro ao gerar carrossel.');
    } finally {
      setLoading(false);
    }
  }

  function addCard() {
    const newCard: CarouselCard = {
      id: generateId(),
      order: cards.length,
      title: `Card ${cards.length + 1}`,
      text: '',
      visualSuggestion: '',
      style: 'content',
    };
    setCards([...cards, newCard]);
  }

  function removeCard(id: string) {
    if (cards.length <= 2) { toast.error('Mínimo de 2 cards'); return; }
    setCards(cards.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i })));
    if (previewIndex >= cards.length - 1) setPreviewIndex(cards.length - 2);
  }

  function updateCard(id: string, field: keyof CarouselCard, value: string) {
    setCards(cards.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }

  function handleSave() {
    const content: GeneratedContent = {
      id: generateId(),
      format: 'carousel',
      title: headline,
      headline,
      body: cards.map((c) => c.text).join('\n\n'),
      caption,
      cta,
      hashtags,
      keywords: [],
      carouselCards: cards,
      designNotes: designNotes,
      status: 'pronto',
      isFavorite: false,
      tags: [objective, tone],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as GeneratedContent;
    addContent(content);
    toast.success('Carrossel salvo!');
  }

  function handleExport() {
    const text = `CARROSSEL: ${headline}\n\n${cards.map((c, i) => `CARD ${i + 1}: ${c.title}\n${c.text}\n`).join('\n')}\nLEGENDA:\n${caption}\n\nCTA:\n${cta}\n\nHASHTAGS:\n${hashtags.join(' ')}`;
    downloadTextFile(text, `carousel-${Date.now()}.txt`);
  }

  const currentCard = cards[previewIndex];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Criador de Carrossel</h1>
          <p className="text-brand-text-secondary text-sm mt-1">Carrosseis estruturados e estratégicos para Instagram</p>
        </div>
        <div className="flex gap-2">
          {cards.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleExport} leftIcon={<Download size={14} />}>Exportar</Button>
              <Button variant="ghost" size="sm" onClick={handleSave} leftIcon={<Heart size={14} />}>Salvar</Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Config */}
      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tema do Carrossel</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: 5 dicas para crescer no Instagram" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50" />
            </div>
            <div className="w-36">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Cards</label>
              <select value={cardCount} onChange={(e) => setCardCount(Number(e.target.value))} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50">
                {[5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n} cards</option>)}
              </select>
            </div>
            <div className="w-36">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Objetivo</label>
              <select value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50">
                {CONTENT_OBJECTIVES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="w-36">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tom</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50">
                {CONTENT_TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />}>Gerar Carrossel</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState message="Criando seu carrossel..." submessage="Estruturando cada card com lógica narrativa" />
      ) : cards.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Card Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Editor de Cards ({cards.length})</h2>
              <Button size="sm" variant="outline" onClick={addCard} leftIcon={<Plus size={14} />}>Adicionar Card</Button>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-brand-surface border rounded-2xl p-4 cursor-pointer transition-all ${previewIndex === i ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-brand-border hover:border-brand-border/80'}`}
                  onClick={() => setPreviewIndex(i)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <GripVertical size={14} className="text-brand-text-muted cursor-grab" />
                    <span className="text-xs font-bold text-brand-primary">#{i + 1}</span>
                    <span className="text-xs text-brand-text-muted flex-1">{card.style === 'cover' ? '📌 Capa' : card.style === 'cta' ? '🎯 CTA Final' : '📄 Conteúdo'}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeCard(card.id); }} className="p-1 rounded hover:bg-red-500/10 text-brand-text-muted hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    value={card.title}
                    onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Título do card..."
                    className="w-full bg-brand-elevated border border-brand-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 mb-2"
                  />
                  <textarea
                    value={card.text}
                    onChange={(e) => updateCard(card.id, 'text', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Texto do card..."
                    rows={2}
                    className="w-full bg-brand-elevated border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none"
                  />
                </motion.div>
              ))}
            </div>

            {/* Caption & Hashtags */}
            <Card>
              <CardContent className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Configurações Gerais</h3>
                <div>
                  <label className="text-xs text-brand-text-muted mb-1 block">Legenda</label>
                  <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-brand-text-muted mb-1 block">CTA</label>
                  <input value={cta} onChange={(e) => setCta(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50" />
                </div>
                {designNotes && (
                  <div>
                    <label className="text-xs text-brand-text-muted mb-1 block">Observações de Design</label>
                    <p className="text-xs text-brand-text-secondary bg-brand-elevated rounded-xl p-3">{designNotes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => copyToClipboard(caption + '\n\n' + hashtags.join(' '))} leftIcon={<Copy size={13} />} variant="outline">Copiar legenda</Button>
                  <Button size="sm" onClick={() => copyToClipboard(hashtags.join(' '))} leftIcon={<Copy size={13} />} variant="ghost">Copiar hashtags</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <p className="text-xs text-brand-text-muted mb-4 uppercase tracking-wider">Preview do Carrossel</p>
            <div className="instagram-frame w-full max-w-[320px]">
              {currentCard && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="aspect-square bg-brand-elevated rounded-xl flex flex-col items-center justify-center p-6 text-center border border-brand-border mb-3" style={{ background: `linear-gradient(135deg, ${brand?.diagnostic?.colors?.primary || '#7C3AED'}22, ${brand?.diagnostic?.colors?.secondary || '#EC4899'}11)` }}>
                      <p className="text-xs text-brand-text-muted mb-2">Card {previewIndex + 1} / {cards.length}</p>
                      <p className="text-white font-bold text-sm mb-2 leading-snug">{currentCard.title}</p>
                      <p className="text-brand-text-secondary text-xs leading-relaxed">{currentCard.text}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
              <div className="flex items-center justify-between mt-2">
                <button onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))} disabled={previewIndex === 0} className="p-2 rounded-lg bg-brand-elevated text-brand-text-muted hover:text-white disabled:opacity-30 transition-all"><ChevronLeft size={16} /></button>
                <div className="flex gap-1.5">
                  {cards.map((_, i) => (
                    <button key={i} onClick={() => setPreviewIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === previewIndex ? 'bg-brand-primary w-4' : 'bg-brand-elevated'}`} />
                  ))}
                </div>
                <button onClick={() => setPreviewIndex(Math.min(cards.length - 1, previewIndex + 1))} disabled={previewIndex === cards.length - 1} className="p-2 rounded-lg bg-brand-elevated text-brand-text-muted hover:text-white disabled:opacity-30 transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <LayoutGrid size={48} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">Crie seu primeiro carrossel</p>
          <p className="text-brand-text-muted mb-6">Informe o tema e clique em "Gerar Carrossel"</p>
          <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />} size="lg">Gerar Carrossel</Button>
        </div>
      )}
    </div>
  );
}
