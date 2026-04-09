import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Sparkles, Copy, Save, RefreshCw, TrendingUp, Target, Tag } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { generateHashtags } from '@/services/openai';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { copyToClipboard, generateId } from '@/lib/utils';
import { toast } from 'sonner';
import type { HashtagSet } from '@/types/content';

export function HashtagGeneratorPage() {
  const { brand } = useBrandStore();
  const { hashtagSets, addHashtagSet } = useContentStore();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<{ highCompetition: string[]; mediumCompetition: string[]; lowCompetition: string[] } | null>(null);

  async function handleGenerate() {
    if (!brand) { toast.error('Configure sua marca primeiro'); return; }
    if (!topic) { toast.error('Informe o tema'); return; }
    setLoading(true);
    try {
      const text = await generateHashtags(brand, topic);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON');
      setResult(JSON.parse(jsonMatch[0]));
      toast.success('Hashtags geradas!');
    } catch {
      toast.error('Erro ao gerar hashtags.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAll() {
    if (!result) return;
    const all = [...result.highCompetition, ...result.mediumCompetition, ...result.lowCompetition];
    copyToClipboard(all.join(' '));
    toast.success('Todas as hashtags copiadas!');
  }

  function handleSave() {
    if (!result) return;
    const set: HashtagSet = {
      id: generateId(),
      name: topic,
      ...result,
      createdAt: new Date().toISOString(),
    };
    addHashtagSet(set);
    toast.success('Conjunto salvo!');
  }

  const groups = result
    ? [
        { label: 'Alta Concorrência', icon: TrendingUp, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', tags: result.highCompetition, description: 'Hashtags populares com muita concorrência' },
        { label: 'Média Concorrência', icon: Target, color: 'text-brand-gold', bg: 'bg-brand-gold/10 border-brand-gold/20', tags: result.mediumCompetition, description: 'Equilíbrio entre alcance e competição' },
        { label: 'Nicho / Baixa', icon: Tag, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', tags: result.lowCompetition, description: 'Altamente específicas para seu nicho' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Gerador de Hashtags</h1>
        <p className="text-brand-text-secondary text-sm mt-1">30 hashtags estratégicas segmentadas por concorrência</p>
      </motion.div>

      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tema do Conteúdo</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} placeholder="Ex: marketing digital para pequenas empresas" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50" />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />}>Gerar Hashtags</Button>
              {result && (
                <>
                  <Button variant="outline" onClick={handleCopyAll} leftIcon={<Copy size={15} />}>Copiar Todas</Button>
                  <Button variant="ghost" onClick={handleSave} leftIcon={<Save size={15} />}>Salvar</Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState message="Gerando hashtags estratégicas..." submessage="Analisando concorrência e relevância" />
      ) : result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {groups.map((group, i) => (
            <motion.div key={group.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full">
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <group.icon size={16} className={group.color} />
                      <div>
                        <p className={`text-sm font-bold ${group.color}`}>{group.label}</p>
                        <p className="text-xs text-brand-text-muted">{group.tags.length} hashtags</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { copyToClipboard(group.tags.join(' ')); toast.success('Grupo copiado!'); }}
                      className="p-1.5 rounded-lg hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-brand-text-muted mb-3">{group.description}</p>
                  <div className={`rounded-xl border p-3 ${group.bg}`}>
                    <div className="flex flex-wrap gap-1.5">
                      {group.tags.map((tag, j) => (
                        <button
                          key={j}
                          onClick={() => { copyToClipboard(tag); toast.success('Hashtag copiada!'); }}
                          className={`text-xs px-2 py-1 rounded-full ${group.bg} ${group.color} border border-current/20 hover:opacity-80 transition-all cursor-pointer`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Hash size={48} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">Gere suas hashtags estratégicas</p>
          <p className="text-brand-text-muted mb-6">Receba 30 hashtags segmentadas por nível de concorrência</p>
          <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />} size="lg">Gerar Hashtags</Button>
        </div>
      )}

      {/* Saved Sets */}
      {hashtagSets.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-white mb-4">Conjuntos Salvos</h2>
              <div className="space-y-2">
                {hashtagSets.map((set) => (
                  <div key={set.id} className="flex items-center justify-between p-3 bg-brand-elevated rounded-xl">
                    <span className="text-sm text-white">{set.name}</span>
                    <div className="flex gap-2">
                      <span className="text-xs text-brand-text-muted">{set.highCompetition.length + set.mediumCompetition.length + set.lowCompetition.length} hashtags</span>
                      <button
                        onClick={() => { copyToClipboard([...set.highCompetition, ...set.mediumCompetition, ...set.lowCompetition].join(' ')); toast.success('Copiado!'); }}
                        className="text-brand-text-muted hover:text-white transition-all"
                      ><Copy size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
