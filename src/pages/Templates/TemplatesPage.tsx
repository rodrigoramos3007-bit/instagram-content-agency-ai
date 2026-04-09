import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookTemplate, Search, Filter, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CONTENT_FORMATS, CONTENT_OBJECTIVES } from '@/lib/constants';
import { getObjectiveColor, getFormatColor, getFormatLabel } from '@/lib/utils';

const TEMPLATES = [
  { id: '1', name: 'Carrossel Educativo', format: 'carousel', objective: 'autoridade', niche: 'Todos', style: 'Premium Clean', preview: 'Compartilhe conhecimento de forma visual e estruturada', tags: ['educação', 'autoridade'] },
  { id: '2', name: 'Reel de Antes e Depois', format: 'reel', objective: 'vendas', niche: 'Todos', style: 'Social Proof', preview: 'Mostre transformações e resultados de clientes', tags: ['prova social', 'vendas'] },
  { id: '3', name: 'Post de Dica Rápida', format: 'post', objective: 'engajamento', niche: 'Todos', style: 'Minimalista', preview: 'Uma dica poderosa em formato simples e direto', tags: ['dica', 'engajamento'] },
  { id: '4', name: 'Story de CTA Direto', format: 'story', objective: 'vendas', niche: 'Todos', style: 'Bold Vibrant', preview: 'Story otimizado para conversão com urgência', tags: ['vendas', 'urgência'] },
  { id: '5', name: 'Carrossel de Erros Comuns', format: 'carousel', objective: 'engajamento', niche: 'Todos', style: 'Autoridade Profissional', preview: 'Liste os principais erros do seu nicho e como evitá-los', tags: ['erros', 'educação'] },
  { id: '6', name: 'Reel Depoimento', format: 'reel', objective: 'autoridade', niche: 'Todos', style: 'Social Proof', preview: 'Apresente depoimentos reais de forma envolvente', tags: ['depoimento', 'prova social'] },
  { id: '7', name: 'Post Motivacional', format: 'post', objective: 'branding', niche: 'Todos', style: 'Lifestyle Aspiracional', preview: 'Frase poderosa alinhada aos valores da marca', tags: ['motivação', 'branding'] },
  { id: '8', name: 'Carrossel Passo a Passo', format: 'carousel', objective: 'autoridade', niche: 'Todos', style: 'Premium Clean', preview: 'Tutorial visual em cards sequenciais', tags: ['tutorial', 'educação'] },
  { id: '9', name: 'Reel Lista Rápida', format: 'reel', objective: 'engajamento', niche: 'Todos', style: 'Ousado Vibrante', preview: 'Lista com X itens em formato reel dinâmico', tags: ['lista', 'viral'] },
  { id: '10', name: 'Post de Oferta', format: 'post', objective: 'vendas', niche: 'Todos', style: 'Bold Vibrant', preview: 'Post de oferta com urgência e benefícios claros', tags: ['oferta', 'vendas'] },
  { id: '11', name: 'Carrossel de Bastidores', format: 'carousel', objective: 'branding', niche: 'Todos', style: 'Storytelling Visual', preview: 'Mostre o dia a dia e os bastidores da marca', tags: ['bastidores', 'humanização'] },
  { id: '12', name: 'Story de Enquete', format: 'story', objective: 'engajamento', niche: 'Todos', style: 'Leve e Descontraído', preview: 'Story interativo com enquete para engajar audiência', tags: ['enquete', 'engajamento'] },
];

export function TemplatesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterFormat, setFilterFormat] = useState('');
  const [filterObjective, setFilterObjective] = useState('');

  const filtered = TEMPLATES.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some((tag) => tag.includes(search.toLowerCase()));
    const matchFormat = !filterFormat || t.format === filterFormat;
    const matchObjective = !filterObjective || t.objective === filterObjective;
    return matchSearch && matchFormat && matchObjective;
  });

  function useTemplate(template: typeof TEMPLATES[0]) {
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    const routes: Record<string, string> = { carousel: '/carousel', reel: '/reels', post: '/posts', story: '/posts' };
    navigate(routes[template.format] || '/posts');
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Biblioteca de Templates</h1>
        <p className="text-brand-text-secondary text-sm mt-1">{TEMPLATES.length} templates prontos para usar</p>
      </motion.div>

      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar templates..."
                className="w-full bg-brand-elevated border border-brand-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-brand-text-muted" />
              <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Todos os formatos</option>
                {CONTENT_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <select value={filterObjective} onChange={(e) => setFilterObjective(e.target.value)} className="bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Todos os objetivos</option>
                {CONTENT_OBJECTIVES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {(filterFormat || filterObjective || search) && (
                <button onClick={() => { setFilterFormat(''); setFilterObjective(''); setSearch(''); }} className="px-3 py-2.5 rounded-xl text-xs text-brand-text-muted hover:text-white bg-brand-elevated border border-brand-border hover:border-brand-primary/30 transition-all">
                  Limpar
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card hover className="h-full flex flex-col group">
              <CardContent className="flex flex-col flex-1">
                <div className="aspect-square mb-4 rounded-xl bg-gradient-to-br from-brand-elevated to-brand-bg border border-brand-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-brand opacity-10 group-hover:opacity-20 transition-all" />
                  <div className="text-center z-10 px-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-primary/20 flex items-center justify-center mx-auto mb-2">
                      <BookTemplate size={20} className="text-brand-primary" />
                    </div>
                    <p className="text-white text-xs font-semibold leading-snug">{template.name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`tag-chip text-[10px] ${getFormatColor(template.format)}`}>
                    {getFormatLabel(template.format)}
                  </span>
                  <span className={`tag-chip text-[10px] ${getObjectiveColor(template.objective)}`}>
                    {template.objective}
                  </span>
                </div>

                <p className="text-xs text-brand-text-secondary mb-1 flex-1 leading-relaxed">{template.preview}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-brand-elevated text-brand-text-muted rounded-md">{tag}</span>
                  ))}
                </div>

                <button
                  onClick={() => useTemplate(template)}
                  className="w-full py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap size={12} /> Usar template
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookTemplate size={48} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">Nenhum template encontrado</p>
          <Button variant="outline" onClick={() => { setSearch(''); setFilterFormat(''); setFilterObjective(''); }}>Limpar filtros</Button>
        </div>
      )}
    </div>
  );
}
