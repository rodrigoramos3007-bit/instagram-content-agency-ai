import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Palette, Type, Target, RefreshCw, Edit3, Check, Lightbulb } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { performBrandAnalysis, getMockDiagnostic } from '@/services/brandAnalyzer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { getFormatLabel } from '@/lib/utils';
import { toast } from 'sonner';

export function BrandDiagnosticPage() {
  const { brand, setDiagnostic } = useBrandStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const diagnostic = brand?.diagnostic;

  async function handleReanalyze() {
    if (!brand) return;
    setLoading(true);
    try {
      const newDiagnostic = await performBrandAnalysis({
        name: brand.name,
        description: brand.description,
        audience: brand.audience,
        website: brand.website,
        instagram: brand.instagram,
        country: brand.country,
        goals: brand.goals,
        preferredTone: brand.preferredTone,
      });
      setDiagnostic(newDiagnostic);
      toast.success('Diagnóstico atualizado!');
    } catch {
      setDiagnostic(getMockDiagnostic(brand.name));
      toast.error('Erro ao analisar. Usando diagnóstico padrão.');
    } finally {
      setLoading(false);
    }
  }

  if (!brand) {
    return (
      <EmptyState
        icon={Activity}
        title="Marca não configurada"
        description="Configure sua marca primeiro para ver o diagnóstico estratégico"
        action={{ label: 'Configurar marca', onClick: () => navigate('/onboarding') }}
      />
    );
  }

  if (loading) {
    return <LoadingState message="Reanalisando sua marca..." submessage="Isso pode levar alguns segundos" />;
  }

  if (!diagnostic) {
    return (
      <EmptyState
        icon={Activity}
        title="Diagnóstico não realizado"
        description="Execute a análise para ver o perfil estratégico da sua marca"
        action={{ label: 'Analisar agora', onClick: handleReanalyze }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Diagnóstico da Marca</h1>
          <p className="text-brand-text-secondary text-sm mt-1">{brand.name} — Análise estratégica completa</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/settings')} leftIcon={<Edit3 size={15} />}>
            Editar marca
          </Button>
          <Button onClick={handleReanalyze} leftIcon={<RefreshCw size={15} />} loading={loading}>
            Reanalisar
          </Button>
        </div>
      </motion.div>

      {/* Top summary cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Nicho', value: diagnostic.niche, icon: Target, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Frequência', value: diagnostic.postingFrequency, icon: TrendingUp, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
          { label: 'Tom de Voz', value: diagnostic.tone, icon: Activity, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
          { label: 'Tom Score', value: `${diagnostic.toneScore}/100`, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="p-5">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                <item.icon size={20} className={item.color} />
              </div>
              <p className="text-xs text-brand-text-muted mb-1">{item.label}</p>
              <p className="text-white font-semibold text-sm">{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Palette */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Palette size={16} className="text-brand-primary" /> Identidade Visual
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-brand-text-muted mb-2">Paleta de Cores</p>
                  <div className="flex gap-3">
                    {Object.entries(diagnostic.colors).map(([key, color]) => (
                      <div key={key} className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-xl border border-white/10 shadow-card" style={{ background: color }} />
                        <p className="text-[10px] text-brand-text-muted capitalize">{key}</p>
                        <p className="text-[10px] text-brand-text-muted font-mono">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-text-muted mb-2">Tipografia</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-brand-elevated rounded-xl p-3">
                      <p className="text-[10px] text-brand-text-muted mb-1">Títulos</p>
                      <p className="text-white font-bold text-sm" style={{ fontFamily: diagnostic.fonts.heading }}>{diagnostic.fonts.heading}</p>
                    </div>
                    <div className="bg-brand-elevated rounded-xl p-3">
                      <p className="text-[10px] text-brand-text-muted mb-1">Corpo</p>
                      <p className="text-white text-sm" style={{ fontFamily: diagnostic.fonts.body }}>{diagnostic.fonts.body}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-text-muted mb-2">Estilos Visuais Recomendados</p>
                  <div className="flex flex-wrap gap-2">
                    {diagnostic.visualStyles.map((s) => (
                      <Badge key={s} variant="primary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tom de Voz Meter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Type size={16} className="text-brand-primary" /> Posicionamento e Tom
              </h2>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs text-brand-text-muted mb-2">
                    <span>Formal / Sério</span>
                    <span>Casual / Leve</span>
                  </div>
                  <div className="relative h-3 bg-brand-elevated rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full" />
                    <div className="absolute inset-y-0 right-0 bg-brand-elevated rounded-r-full" style={{ width: `${100 - diagnostic.toneScore}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <div />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-brand-primary font-medium"
                      style={{ marginLeft: `${diagnostic.toneScore}%`, transform: 'translateX(-50%)' }}
                    >
                      ▲ {diagnostic.toneScore}
                    </motion.div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-text-muted mb-2">Proposta de Valor</p>
                  <p className="text-white text-sm leading-relaxed bg-brand-elevated rounded-xl p-3">{diagnostic.valueProposition}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-text-muted mb-2">Posicionamento</p>
                  <p className="text-white text-sm leading-relaxed bg-brand-elevated rounded-xl p-3">{diagnostic.positioning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Editorial Pillars */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent>
            <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <Lightbulb size={16} className="text-brand-primary" /> Pilares Editoriais
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {diagnostic.editorialPillars.map((pillar, i) => (
                <motion.div
                  key={pillar.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="bg-brand-elevated rounded-2xl p-4 border border-brand-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: pillar.color }} />
                      <span className="text-white font-semibold text-sm">{pillar.name}</span>
                    </div>
                    <span className="text-2xl font-bold" style={{ color: pillar.color }}>{pillar.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pillar.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: pillar.color }}
                    />
                  </div>
                  <p className="text-xs text-brand-text-muted">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content categories & formats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Check size={16} className="text-brand-success" /> Categorias de Conteúdo
            </h2>
            <div className="space-y-2">
              {diagnostic.contentCategories.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  {c}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-gold" /> Formatos Recomendados
            </h2>
            <div className="space-y-2">
              {diagnostic.recommendedFormats.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Badge variant="primary" className="text-xs">{getFormatLabel(f)}</Badge>
                  <span className="text-xs text-brand-text-muted">Ideal para seu nicho</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
