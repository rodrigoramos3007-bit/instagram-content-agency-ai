import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Globe, Instagram, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useAuthStore } from '@/store/authStore';
import { performBrandAnalysis, getMockDiagnostic } from '@/services/brandAnalyzer';
import { NICHES, COUNTRIES, BRAND_GOALS, CONTENT_TONES } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';
import type { Brand } from '@/types/brand';

const STEPS = ['Importação', 'Sua Marca', 'Analisando', 'Diagnóstico'];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [goals, setGoals] = useState<string[]>([]);
  const [preferredTone, setPreferredTone] = useState('profissional');
  const [niche, setNiche] = useState('');

  const { setBrand, setDiagnostic, setOnboarded } = useBrandStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  function toggleGoal(goal: string) {
    setGoals((g) => g.includes(goal) ? g.filter((x) => x !== goal) : [...g, goal]);
  }

  async function handleAnalyze() {
    if (!name || !description) {
      toast.error('Preencha o nome e descrição da marca');
      return;
    }
    setStep(2);
    setLoading(true);

    const brand: Brand = {
      id: generateId(),
      name,
      description,
      website: website || undefined,
      instagram: instagram || undefined,
      audience,
      country,
      goals,
      preferredTone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBrand(brand);

    try {
      const diagnostic = await performBrandAnalysis({ name, description, audience, website, instagram, country, goals, preferredTone });
      setDiagnostic(diagnostic);
    } catch {
      setDiagnostic(getMockDiagnostic(name));
    }
    setLoading(false);
    setStep(3);
  }

  function handleFinish() {
    setOnboarded(true);
    navigate('/');
    toast.success('Bem-vindo! Sua agência de conteúdo está pronta 🚀');
  }

  const { brand } = useBrandStore();
  const diagnostic = brand?.diagnostic;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-5 border-b border-brand-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <span className="font-bold text-white">Content Agency AI</span>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-3 py-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? 'bg-brand-primary text-white' : 'bg-brand-elevated text-brand-text-muted border border-brand-border'}`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-white' : 'text-brand-text-muted'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-12 h-px mx-1 ${i < step ? 'bg-brand-primary' : 'bg-brand-border'}`} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Vamos conhecer sua marca</h2>
                  <p className="text-brand-text-secondary">Importe dados automaticamente ou preencha manualmente</p>
                </div>

                <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-white flex items-center gap-2"><Globe size={18} className="text-brand-primary" />Site ou URL</h3>
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://seusite.com.br" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 transition-all" />
                </div>

                <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-white flex items-center gap-2"><Instagram size={18} className="text-brand-secondary" />Instagram</h3>
                  <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@suamarca" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 transition-all" />
                </div>

                <button onClick={() => setStep(1)} className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-all btn-glow flex items-center justify-center gap-2">
                  Continuar <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Dados da sua marca</h2>
                  <p className="text-brand-text-secondary">Quanto mais detalhes, mais preciso será o diagnóstico</p>
                </div>

                <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1.5">Nome da marca *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Studio Flores" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1.5">Descrição do negócio *</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="O que você faz, como ajuda seus clientes, qual é o diferencial..." rows={3} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 transition-all resize-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1.5">Público-alvo</label>
                    <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex: Mulheres 25-40 anos, empreendedoras, classe B/C" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-brand-text-secondary mb-1.5">País/Região</label>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/50 transition-all">
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-text-secondary mb-1.5">Tom de voz</label>
                      <select value={preferredTone} onChange={(e) => setPreferredTone(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/50 transition-all">
                        {CONTENT_TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
                  <label className="block text-sm font-medium text-brand-text-secondary mb-3">Objetivos principais</label>
                  <div className="flex flex-wrap gap-2">
                    {BRAND_GOALS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGoal(g)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${goals.includes(g) ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/50' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:border-brand-primary/30 hover:text-white'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-6 py-3 bg-brand-elevated border border-brand-border text-white rounded-xl hover:bg-brand-surface transition-all flex items-center gap-2">
                    <ChevronLeft size={18} /> Voltar
                  </button>
                  <button onClick={handleAnalyze} className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-all btn-glow flex items-center justify-center gap-2">
                    <Sparkles size={18} /> Analisar minha marca
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-brand-primary/20 flex items-center justify-center">
                    <Sparkles size={40} className="text-brand-primary animate-pulse" />
                  </div>
                  <div className="absolute -inset-3 rounded-[2rem] border-2 border-brand-primary/30 animate-ping" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Analisando sua marca...</h2>
                <p className="text-brand-text-secondary mb-8">Nossa IA está processando os dados para criar seu diagnóstico estratégico</p>
                <div className="space-y-2 max-w-xs mx-auto text-left">
                  {['Identificando nicho de atuação', 'Definindo tom de voz', 'Criando paleta de cores', 'Estruturando pilares editoriais'].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.5 }}
                      className="flex items-center gap-3 text-sm text-brand-text-secondary"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-brand-primary/50 border-t-brand-primary animate-spin" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && diagnostic && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-success/20 flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-brand-success" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Diagnóstico pronto!</h2>
                  <p className="text-brand-text-secondary">Aqui está o perfil estratégico da sua marca</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
                    <p className="text-xs text-brand-text-muted mb-1 uppercase tracking-wider">Nicho</p>
                    <p className="text-white font-semibold">{diagnostic.niche}</p>
                  </div>
                  <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
                    <p className="text-xs text-brand-text-muted mb-1 uppercase tracking-wider">Tom de Voz</p>
                    <p className="text-white font-semibold">{diagnostic.tone}</p>
                  </div>
                </div>

                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
                  <p className="text-xs text-brand-text-muted mb-3 uppercase tracking-wider">Paleta de Cores</p>
                  <div className="flex gap-3">
                    {Object.entries(diagnostic.colors).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div className="w-10 h-10 rounded-xl border border-white/10 mb-1.5" style={{ background: color }} />
                        <p className="text-[10px] text-brand-text-muted">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
                  <p className="text-xs text-brand-text-muted mb-3 uppercase tracking-wider">Pilares Editoriais</p>
                  <div className="space-y-2">
                    {diagnostic.editorialPillars.map((pillar) => (
                      <div key={pillar.name} className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: pillar.color }} />
                        <span className="text-sm text-white flex-1">{pillar.name}</span>
                        <span className="text-sm text-brand-text-muted">{pillar.percentage}%</span>
                        <div className="w-24 h-1.5 bg-brand-elevated rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pillar.percentage}%`, background: pillar.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
                  <p className="text-xs text-brand-text-muted mb-2 uppercase tracking-wider">Proposta de Valor</p>
                  <p className="text-white text-sm leading-relaxed">{diagnostic.valueProposition}</p>
                </div>

                <button onClick={handleFinish} className="w-full py-4 bg-gradient-brand text-white font-bold rounded-xl transition-all btn-glow text-lg flex items-center justify-center gap-2">
                  <Zap size={20} /> Acessar minha agência de conteúdo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
