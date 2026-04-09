import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Image, Sparkles, Copy, Heart, Download, RefreshCw, Wand2,
  Hash, MessageSquare, Target, ChevronDown
} from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { generatePost } from '@/services/openai';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { copyToClipboard, generateId, downloadTextFile } from '@/lib/utils';
import { CONTENT_TONES, CONTENT_OBJECTIVES } from '@/lib/constants';
import type { GeneratedContent } from '@/types/content';
import { toast } from 'sonner';

type VersionKey = 'short' | 'medium' | 'long' | 'emotional' | 'professional' | 'ad';

export function PostCreatorPage() {
  const { brand } = useBrandStore();
  const { addContent, toggleFavorite, favorites } = useContentStore();

  const [loading, setLoading] = useState(false);
  const [activeVersion, setActiveVersion] = useState<VersionKey>('medium');
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [caption, setCaption] = useState('');
  const [cta, setCta] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [imagePrompt, setImagePrompt] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [selectedObjective, setSelectedObjective] = useState('engajamento');
  const [selectedTone, setSelectedTone] = useState('profissional');
  const [captionExpanded, setCaptionExpanded] = useState(false);

  // Load from idea if navigated from idea generator
  useEffect(() => {
    const idea = sessionStorage.getItem('selectedIdea');
    if (idea) {
      const parsed = JSON.parse(idea);
      setTopic(parsed.title);
      setSelectedTone(parsed.tone || 'profissional');
      setSelectedObjective(parsed.objective || 'engajamento');
      sessionStorage.removeItem('selectedIdea');
    }
  }, []);

  async function handleGenerate(version: VersionKey = activeVersion) {
    if (!brand) { toast.error('Configure sua marca primeiro'); return; }
    if (!topic) { toast.error('Informe o tema do post'); return; }
    setLoading(true);
    try {
      const text = await generatePost(brand, { title: topic, hook: topic, objective: selectedObjective, tone: selectedTone }, version);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON');
      const data = JSON.parse(jsonMatch[0]);
      setHeadline(data.headline || '');
      setBody(data.body || '');
      setCaption(data.caption || '');
      setCta(data.cta || '');
      setHashtags(data.hashtags || []);
      setImagePrompt(data.imagePrompt || '');
      setSavedId(null);
      toast.success('Post criado com sucesso!');
    } catch {
      toast.error('Erro ao gerar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    const content: GeneratedContent = {
      id: savedId || generateId(),
      format: 'post',
      title: headline,
      headline,
      body,
      caption,
      cta,
      hashtags,
      keywords: [],
      imagePrompt,
      status: 'pronto',
      isFavorite: false,
      tags: [selectedObjective, selectedTone],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addContent(content);
    setSavedId(content.id);
    toast.success('Post salvo na biblioteca!');
  }

  function handleCopy(text: string, label: string) {
    copyToClipboard(text);
    toast.success(`${label} copiado!`);
  }

  function handleExport() {
    const text = `HEADLINE:\n${headline}\n\nBODY:\n${body}\n\nLEGENDA:\n${caption}\n\nCTA:\n${cta}\n\nHASHTAGS:\n${hashtags.join(' ')}\n\nPROMPT DA IMAGEM:\n${imagePrompt}`;
    downloadTextFile(text, `post-${Date.now()}.txt`);
  }

  const hasContent = headline || caption;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Criador de Posts</h1>
          <p className="text-brand-text-secondary text-sm mt-1">Crie posts estáticos otimizados para Instagram</p>
        </div>
        <div className="flex gap-2">
          {hasContent && (
            <>
              <Button variant="outline" onClick={handleExport} leftIcon={<Download size={15} />} size="sm">Exportar</Button>
              <Button variant="ghost" onClick={handleSave} leftIcon={<Heart size={15} />} size="sm">Salvar</Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Config bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tema do Post</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Como dobrar vendas em 30 dias"
                  className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div className="w-44">
                <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Objetivo</label>
                <select value={selectedObjective} onChange={(e) => setSelectedObjective(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50">
                  {CONTENT_OBJECTIVES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="w-44">
                <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tom de Voz</label>
                <select value={selectedTone} onChange={(e) => setSelectedTone(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50">
                  {CONTENT_TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={() => handleGenerate(activeVersion)} loading={loading} leftIcon={<Sparkles size={16} />}>
                  Gerar Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {loading ? (
        <LoadingState message="Criando seu post..." submessage="Personalizando para sua marca" />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Editor */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            {/* Version selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-brand-text-muted">Versão:</span>
              {(['short', 'medium', 'long', 'emotional', 'professional', 'ad'] as VersionKey[]).map((v) => (
                <button
                  key={v}
                  onClick={() => { setActiveVersion(v); if (hasContent) handleGenerate(v); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${activeVersion === v ? 'bg-brand-primary text-white' : 'bg-brand-elevated text-brand-text-muted hover:text-white'}`}
                >
                  {v === 'short' ? 'Curta' : v === 'medium' ? 'Média' : v === 'long' ? 'Longa' : v === 'emotional' ? 'Emocional' : v === 'professional' ? 'Profissional' : 'Anúncio'}
                </button>
              ))}
            </div>

            {/* Headline */}
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-brand-text-muted uppercase tracking-wider flex items-center gap-1"><Wand2 size={12} /> Headline</label>
                  {headline && <button onClick={() => handleCopy(headline, 'Headline')} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><Copy size={13} /></button>}
                </div>
                <textarea
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Headline principal do post..."
                  rows={2}
                  className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none"
                />
              </CardContent>
            </Card>

            {/* Caption */}
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-brand-text-muted uppercase tracking-wider flex items-center gap-1"><MessageSquare size={12} /> Legenda Completa</label>
                  {caption && <button onClick={() => handleCopy(caption, 'Legenda')} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><Copy size={13} /></button>}
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Legenda completa para Instagram..."
                  rows={captionExpanded ? 12 : 5}
                  className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none transition-all"
                />
                <button onClick={() => setCaptionExpanded(!captionExpanded)} className="flex items-center gap-1 text-xs text-brand-text-muted hover:text-white transition-all">
                  <ChevronDown size={12} className={`transition-transform ${captionExpanded ? 'rotate-180' : ''}`} />
                  {captionExpanded ? 'Recolher' : 'Expandir'}
                </button>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-brand-text-muted uppercase tracking-wider flex items-center gap-1"><Target size={12} /> Call to Action</label>
                  {cta && <button onClick={() => handleCopy(cta, 'CTA')} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><Copy size={13} /></button>}
                </div>
                <input
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="CTA do post..."
                  className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50"
                />
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-brand-text-muted uppercase tracking-wider flex items-center gap-1"><Hash size={12} /> Hashtags</label>
                  {hashtags.length > 0 && <button onClick={() => handleCopy(hashtags.join(' '), 'Hashtags')} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><Copy size={13} /></button>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-lg border border-brand-primary/20">
                      {tag}
                      <button onClick={() => setHashtags(hashtags.filter((_, j) => j !== i))} className="hover:text-white ml-0.5"><XIcon size={10} /></button>
                    </span>
                  ))}
                  {hashtags.length === 0 && <p className="text-xs text-brand-text-muted">Gere o post para ver as hashtags</p>}
                </div>
              </CardContent>
            </Card>

            {/* Image Prompt */}
            {imagePrompt && (
              <Card>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-brand-text-muted uppercase tracking-wider flex items-center gap-1"><Image size={12} /> Prompt da Imagem</label>
                    <button onClick={() => handleCopy(imagePrompt, 'Prompt')} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><Copy size={13} /></button>
                  </div>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-xs text-white font-mono placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none"
                  />
                  <Button variant="secondary" size="sm" leftIcon={<Sparkles size={13} />} onClick={() => window.open('/images', '_blank')}>
                    Gerar imagem com IA
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Instagram Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col items-center">
            <p className="text-xs text-brand-text-muted mb-4 uppercase tracking-wider">Preview Instagram</p>
            <div className="instagram-frame w-full max-w-[340px]">
              {/* Post header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                  {brand?.name?.charAt(0) || 'M'}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{brand?.name || 'Minha Marca'}</p>
                  <p className="text-brand-text-muted text-[10px]">Agora mesmo</p>
                </div>
              </div>

              {/* Image placeholder */}
              <div className="aspect-square bg-brand-elevated rounded-xl mb-3 flex items-center justify-center border border-brand-border overflow-hidden">
                <div className="text-center">
                  <Image size={40} className="text-brand-text-muted mx-auto mb-2" />
                  {headline && <p className="text-white text-xs font-semibold px-4 text-center leading-snug">{headline}</p>}
                  {!headline && <p className="text-brand-text-muted text-xs">Imagem do post</p>}
                </div>
              </div>

              {/* Caption preview */}
              <div className="space-y-1.5">
                <p className="text-white text-xs leading-relaxed">
                  <span className="font-semibold">{brand?.instagram || '@suamarca'} </span>
                  {caption
                    ? (caption.length > 120 ? caption.slice(0, 120) + '... ' : caption)
                    : 'Legenda do post aparecerá aqui...'}
                  {caption && caption.length > 120 && <span className="text-brand-text-muted cursor-pointer">mais</span>}
                </p>
                {cta && <p className="text-brand-primary text-xs font-semibold">👉 {cta}</p>}
                {hashtags.length > 0 && (
                  <p className="text-blue-400 text-[10px] leading-relaxed">{hashtags.slice(0, 8).join(' ')}</p>
                )}
              </div>
            </div>

            {hasContent && (
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={handleSave} leftIcon={<Heart size={14} />}>Salvar</Button>
                <Button size="sm" variant="outline" onClick={() => handleGenerate(activeVersion)} leftIcon={<RefreshCw size={14} />}>Regenerar</Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

function XIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg>;
}
