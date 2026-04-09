import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, Sparkles, Copy, Heart, RefreshCw } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { generateCaption } from '@/services/openai';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { copyToClipboard } from '@/lib/utils';
import { CONTENT_TONES } from '@/lib/constants';
import { toast } from 'sonner';

export function CaptionGeneratorPage() {
  const { brand } = useBrandStore();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('profissional');
  const [captions, setCaptions] = useState<{ short: string; medium: string; long: string } | null>(null);

  async function handleGenerate() {
    if (!brand) { toast.error('Configure sua marca primeiro'); return; }
    if (!topic) { toast.error('Informe o tema da legenda'); return; }
    setLoading(true);
    try {
      const text = await generateCaption(brand, topic, tone);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON');
      setCaptions(JSON.parse(jsonMatch[0]));
      toast.success('Legendas geradas!');
    } catch {
      toast.error('Erro ao gerar legendas.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, label: string) {
    copyToClipboard(text);
    toast.success(`${label} copiada!`);
  }

  const versions = captions
    ? [
        { key: 'short', label: 'Versão Curta', sublabel: 'Até 150 caracteres', value: captions.short, color: 'text-brand-gold', bg: 'bg-brand-gold/10 border-brand-gold/20' },
        { key: 'medium', label: 'Versão Média', sublabel: '150–400 caracteres', value: captions.medium, color: 'text-brand-primary', bg: 'bg-brand-primary/10 border-brand-primary/20' },
        { key: 'long', label: 'Versão Longa', sublabel: '400+ caracteres com storytelling', value: captions.long, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10 border-brand-secondary/20' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Gerador de Legendas</h1>
        <p className="text-brand-text-secondary text-sm mt-1">Crie legendas persuasivas e alinhadas à sua marca</p>
      </motion.div>

      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tema ou Ideia</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} placeholder="Ex: 3 dicas para aumentar suas vendas" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50" />
            </div>
            <div className="w-44">
              <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Tom de Voz</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50">
                {CONTENT_TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />}>Gerar Legendas</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState message="Criando suas legendas..." submessage="Gerando 3 versões personalizadas" />
      ) : captions ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {versions.map((v, i) => (
            <motion.div key={v.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full flex flex-col">
                <CardContent className="flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-sm font-bold ${v.color}`}>{v.label}</p>
                      <p className="text-xs text-brand-text-muted">{v.sublabel}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleCopy(v.value, v.label)} className="p-1.5 rounded-lg hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><Copy size={14} /></button>
                    </div>
                  </div>
                  <div className={`flex-1 rounded-xl border p-4 ${v.bg}`}>
                    <textarea
                      value={v.value}
                      onChange={(e) => setCaptions({ ...captions, [v.key]: e.target.value })}
                      className="w-full bg-transparent text-sm text-white leading-relaxed outline-none resize-none h-full min-h-[120px]"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-brand-text-muted">{v.value.length} caracteres</span>
                    <Button size="sm" onClick={() => handleCopy(v.value, v.label)} leftIcon={<Copy size={13} />} variant="ghost">Copiar</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <AlignLeft size={48} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">Gere legendas estratégicas</p>
          <p className="text-brand-text-muted mb-6">Informe o tema e receba 3 versões otimizadas</p>
          <Button onClick={handleGenerate} loading={loading} leftIcon={<Sparkles size={16} />} size="lg">Gerar Legendas</Button>
        </div>
      )}

      {captions && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleGenerate} loading={loading} leftIcon={<RefreshCw size={15} />}>Gerar novas variações</Button>
        </div>
      )}
    </div>
  );
}
