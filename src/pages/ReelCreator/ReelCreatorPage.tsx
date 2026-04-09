import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Plus, Trash2, Copy, Download, Heart, Clock } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { generateReel } from '@/services/openai';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { generateId, copyToClipboard, downloadTextFile } from '@/lib/utils';
import { CONTENT_OBJECTIVES, CONTENT_TONES } from '@/lib/constants';
import type { ReelScene, GeneratedContent } from '@/types/content';
import { toast } from 'sonner';

type Duration = 'short' | 'medium' | 'long';

export function ReelCreatorPage() {
  const { brand } = useBrandStore();
  const { addContent } = useContentStore();

  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('engajamento');
  const [tone, setTone] = useState('direto');
  const [duration, setDuration] = useState<Duration>('medium');
  const [hook, setHook] = useState('');
  const [scenes, setScenes] = useState<ReelScene[]>([]);
  const [caption, setCaption] = useState('');
  const [cta, setCta] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [editingStyle, setEditingStyle] = useState('');

  useEffect(() => {
    const idea = sessionStorage.getItem('selectedIdea');
    if (idea) {
      const parsed = JSON.parse(idea);
      setTopic(parsed.title);
      setTone(parsed.tone || 'direto');
      setObjective(parsed.objective || 'engajamento');
      sessionStorage.removeItem('selectedIdea');
    }
  }, []);

  const totalDuration = scenes.reduce((sum, s) => sum + s.durationSeconds, 0);

  async function handleGenerate() {
    if (!brand) { toast.error('Configure sua marca primeiro'); return; }
    if (!topic) { toast.error('Informe o tema do reel'); return; }
    setLoading(true);
    try {
      const text = await generateReel(brand, { title: topic, hook: topic, objective, tone }, duration);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON');
      const data = JSON.parse(jsonMatch[0]);
      setHook(data.hook || '');
      setCaption(data.caption || '');
      setCta(data.cta || '');
      setHashtags(data.hashtags || []);
      setEditingStyle(data.editingStyle || '');
      const parsedScenes: ReelScene[] = (data.scenes || []).map((s: Partial<ReelScene>, i: number) => ({
        id: generateId(),
        order: i,
        screenText: s.screenText || '',
        narration: s.narration || '',
        visualSuggestion: s.visualSuggestion || '',
        durationSeconds: s.durationSeconds || 5,
      }));
      setScenes(parsedScenes);
      toast.success('Roteiro de reel criado!');
    } catch {
      toast.error('Erro ao gerar reel.');
    } finally {
      setLoading(false);
    }
  }

  function updateScene(id: string, field: keyof ReelScene, value: string | number) {
    setScenes(scenes.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  function addScene() {
    setScenes([...scenes, { id: generateId(), order: scenes.length, screenText: '', narration: '', visualSuggestion: '', durationSeconds: 5 }]);
  }

  function removeScene(id: string) {
    if (scenes.length <= 2) { toast.error('Mínimo de 2 cenas'); return; }
    setScenes(scenes.filter((s) => s.id !== id));
  }

  function handleSave() {
    const content: GeneratedContent = {
      id: generateId(),
      format: 'reel',
      title: topic,
      headline: hook,
      body: scenes.map((s) => `[CENA ${s.order + 1}]\nTela: ${s.screenText}\nFala: ${s.narration}\nVisual: ${s.visualSuggestion}`).join('\n\n'),
      caption,
      cta,
      hashtags,
      keywords: [],
      reelScenes: scenes,
      reelHook: hook,
      reelEditingStyle: editingStyle,
      status: 'pronto',
      isFavorite: false,
      tags: [objective, tone, duration],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as GeneratedContent;
    addContent(content);
    toast.success('Roteiro salvo!');
  }

  function handleExport() {
    const text = `REEL: ${topic}\n\nHOOK:\n${hook}\n\n${scenes.map((s, i) => `CENA ${i + 1} (${s.durationSeconds}s):\nTela: ${s.screenText}\nFala: ${s.narration}\nVisual: ${s.visualSuggestion}`).join('\n\n')}\n\nCTA:\n${cta}\n\nLEGENDA:\n${caption}\n\nESTILO DE EDIÇÃO:\n${editingStyle}`;
    downloadTextFile(text, `reel-${Date.now()}.txt`);
  }

  const hasContent = hook || scenes.length > 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Criador de Reels</h1>
          <p className="text-brand-text-secondary text-sm mt-1">Roteiros completos e estratégicos para Reels</p>
        </div>
        <div className="flex gap-2">
          {hasContent && (
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
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tema do Reel</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: O segredo que ninguém te conta sobre vendas" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50" />
            </div>
            <div className="w-36">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Duração</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value as Duration)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50">
                <option value="short">Curto (15-30s)</option>
                <option value="medium">Médio (30-60s)</option>
                <option value="long">Longo (60-90s)</option>
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
              <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />}>Gerar Roteiro</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState message="Criando seu roteiro de reel..." submessage="Estruturando cenas e falas" />
      ) : hasContent ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Scenes */}
          <div className="xl:col-span-2 space-y-4">
            {/* Hook */}
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                    <Play size={12} className="text-brand-secondary" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Hook Inicial (0–3 segundos)</h3>
                </div>
                <textarea
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  placeholder="Hook impactante..."
                  rows={2}
                  className="w-full bg-brand-elevated border border-brand-primary/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none font-semibold"
                />
              </CardContent>
            </Card>

            {/* Scenes list */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-white">Cenas ({scenes.length})</h3>
                <div className="flex items-center gap-1.5 text-sm text-brand-text-muted">
                  <Clock size={14} />
                  <span>{totalDuration}s total</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={addScene} leftIcon={<Plus size={14} />}>Adicionar Cena</Button>
            </div>

            <div className="space-y-3">
              {scenes.map((scene, i) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-brand-surface border border-brand-border rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold">{i + 1}</div>
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-brand-text-muted">Duração:</label>
                        <input
                          type="number"
                          value={scene.durationSeconds}
                          onChange={(e) => updateScene(scene.id, 'durationSeconds', Number(e.target.value))}
                          min={1}
                          max={30}
                          className="w-14 bg-brand-elevated border border-brand-border rounded-lg px-2 py-1 text-xs text-white text-center outline-none"
                        />
                        <span className="text-xs text-brand-text-muted">s</span>
                      </div>
                    </div>
                    <button onClick={() => removeScene(scene.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-brand-text-muted hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-brand-text-muted mb-1 block uppercase tracking-wider">Texto na Tela</label>
                      <textarea value={scene.screenText} onChange={(e) => updateScene(scene.id, 'screenText', e.target.value)} rows={2} className="w-full bg-brand-elevated border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none" placeholder="Texto..." />
                    </div>
                    <div>
                      <label className="text-[11px] text-brand-text-muted mb-1 block uppercase tracking-wider">Fala / Narração</label>
                      <textarea value={scene.narration} onChange={(e) => updateScene(scene.id, 'narration', e.target.value)} rows={2} className="w-full bg-brand-elevated border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none" placeholder="Fala..." />
                    </div>
                    <div>
                      <label className="text-[11px] text-brand-text-muted mb-1 block uppercase tracking-wider">Visual / Cena</label>
                      <textarea value={scene.visualSuggestion} onChange={(e) => updateScene(scene.id, 'visualSuggestion', e.target.value)} rows={2} className="w-full bg-brand-elevated border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none" placeholder="Visual..." />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {editingStyle && (
              <Card>
                <CardContent>
                  <h3 className="text-sm font-semibold text-white mb-2">Estilo de Edição</h3>
                  <p className="text-brand-text-secondary text-xs leading-relaxed">{editingStyle}</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="space-y-3">
                <h3 className="text-sm font-semibold text-white">CTA Final</h3>
                <input value={cta} onChange={(e) => setCta(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-brand-primary/50" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Legenda</h3>
                  <button onClick={() => copyToClipboard(caption)} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white"><Copy size={13} /></button>
                </div>
                <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={5} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-primary/50 resize-none" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Hashtags</h3>
                  <button onClick={() => copyToClipboard(hashtags.join(' '))} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white"><Copy size={13} /></button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {hashtags.map((h, i) => <span key={i} className="text-[10px] px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full">{h}</span>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <Play size={48} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">Crie seu roteiro de reel</p>
          <p className="text-brand-text-muted mb-6">Informe o tema e gere um roteiro completo com cenas e falas</p>
          <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />} size="lg">Gerar Roteiro</Button>
        </div>
      )}
    </div>
  );
}
