import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Key, Palette, Download, Upload } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NICHES, COUNTRIES, BRAND_GOALS, CONTENT_TONES } from '@/lib/constants';
import { downloadJSON } from '@/lib/utils';
import { toast } from 'sonner';

export function BrandSettingsPage() {
  const { brand, updateBrand, setDiagnostic } = useBrandStore();

  const [name, setName] = useState(brand?.name || '');
  const [description, setDescription] = useState(brand?.description || '');
  const [audience, setAudience] = useState(brand?.audience || '');
  const [website, setWebsite] = useState(brand?.website || '');
  const [instagram, setInstagram] = useState(brand?.instagram || '');
  const [country, setCountry] = useState(brand?.country || 'Brasil');
  const [goals, setGoals] = useState<string[]>(brand?.goals || []);
  const [preferredTone, setPreferredTone] = useState(brand?.preferredTone || 'profissional');
  const [apiKey, setApiKey] = useState(brand?.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const [primaryColor, setPrimaryColor] = useState(brand?.diagnostic?.colors?.primary || '#7C3AED');
  const [secondaryColor, setSecondaryColor] = useState(brand?.diagnostic?.colors?.secondary || '#EC4899');
  const [accentColor, setAccentColor] = useState(brand?.diagnostic?.colors?.accent || '#F59E0B');

  function toggleGoal(goal: string) {
    setGoals((g) => g.includes(goal) ? g.filter((x) => x !== goal) : [...g, goal]);
  }

  function handleSave() {
    updateBrand({
      name, description, audience,
      website: website || undefined,
      instagram: instagram || undefined,
      country,
      goals,
      preferredTone,
      apiKey: apiKey || undefined,
    });
    if (brand?.diagnostic) {
      setDiagnostic({
        ...brand.diagnostic,
        colors: { ...brand.diagnostic.colors, primary: primaryColor, secondary: secondaryColor, accent: accentColor },
      });
    }
    toast.success('Configurações salvas!');
  }

  function handleExport() {
    downloadJSON(brand, `brand-${brand?.name || 'config'}-${Date.now()}.json`);
    toast.success('Configurações exportadas!');
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.name) {
          updateBrand(data);
          toast.success('Configurações importadas!');
        } else {
          toast.error('Arquivo inválido');
        }
      } catch {
        toast.error('Erro ao importar arquivo');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações da Marca</h1>
          <p className="text-brand-text-secondary text-sm mt-1">Ajuste todos os dados e identidade da sua marca</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} leftIcon={<Download size={14} />}>Exportar</Button>
          <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-brand-border rounded-xl text-brand-text-secondary hover:text-white hover:border-brand-primary/40 bg-brand-elevated transition-all cursor-pointer">
              <Upload size={14} /> Importar
            </span>
          </label>
          <Button onClick={handleSave} leftIcon={<Save size={16} />}>Salvar</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="space-y-5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2"><Settings size={16} className="text-brand-primary" /> Dados da Marca</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-brand-text-muted mb-1.5 block">Nome da marca</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50" />
              </div>
              <div>
                <label className="text-xs text-brand-text-muted mb-1.5 block">Instagram</label>
                <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@suamarca" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50 placeholder:text-brand-text-muted" />
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-text-muted mb-1.5 block">Descrição do Negócio</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Descreva o que sua empresa faz, seus serviços, diferenciais..." className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/50 resize-none placeholder:text-brand-text-muted" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-brand-text-muted mb-1.5 block">Website</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50 placeholder:text-brand-text-muted" />
              </div>
              <div>
                <label className="text-xs text-brand-text-muted mb-1.5 block">País</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-text-muted mb-1.5 block">Público-alvo</label>
              <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="text-xs text-brand-text-muted mb-1.5 block">Tom de Voz Preferido</label>
              <select value={preferredTone} onChange={(e) => setPreferredTone(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                {CONTENT_TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-brand-text-muted mb-2 block">Objetivos</label>
              <div className="flex flex-wrap gap-2">
                {BRAND_GOALS.map((g) => (
                  <button key={g} onClick={() => toggleGoal(g)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${goals.includes(g) ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/50' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {brand?.diagnostic && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2"><Palette size={16} className="text-brand-primary" /> Identidade Visual</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Cor Primária', value: primaryColor, setter: setPrimaryColor },
                  { label: 'Cor Secundária', value: secondaryColor, setter: setSecondaryColor },
                  { label: 'Cor de Destaque', value: accentColor, setter: setAccentColor },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label className="text-xs text-brand-text-muted mb-2 block">{label}</label>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl border border-white/10 relative overflow-hidden cursor-pointer">
                        <input type="color" value={value} onChange={(e) => setter(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="absolute inset-0" style={{ background: value }} />
                      </div>
                      <input value={value} onChange={(e) => setter(e.target.value)} className="flex-1 bg-brand-elevated border border-brand-border rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-brand-primary/50" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Key size={16} className="text-brand-gold" /> API Key OpenAI
            </h2>
            <p className="text-xs text-brand-text-muted">Configure sua chave para ativar a geração de conteúdo real com GPT-4o e DALL·E 3</p>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 pr-24"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-text-muted hover:text-white transition-colors"
              >
                {showApiKey ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <p className="text-xs text-brand-text-muted">
              💡 Sem API key, o app funciona em modo demo com conteúdo de exemplo.
              Configure sua chave em <span className="text-brand-primary">.env</span> ou aqui para usar o GPT-4o real.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
