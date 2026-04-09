import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb, Image, LayoutGrid, Play, Sparkles, TrendingUp,
  Heart, Calendar, ArrowRight, Zap, Clock, FileText
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { useCalendarStore } from '@/store/calendarStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, getFormatLabel, getFormatColor } from '@/lib/utils';

const quickActions = [
  { label: 'Gerar Ideia', to: '/ideas', icon: Lightbulb, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
  { label: 'Criar Post', to: '/posts', icon: Image, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Carrossel', to: '/carousel', icon: LayoutGrid, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
  { label: 'Criar Reel', to: '/reels', icon: Play, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
  { label: 'Imagem IA', to: '/images', icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Calendário', to: '/calendar', icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

export function DashboardPage() {
  const { user } = useAuthStore();
  const { brand } = useBrandStore();
  const { contents, ideas, images, favorites } = useContentStore();
  const { posts: calendarPosts } = useCalendarStore();
  const navigate = useNavigate();

  const diagnostic = brand?.diagnostic;
  const recentContents = contents.slice(0, 5);
  const upcomingPosts = calendarPosts
    .filter((p) => new Date(p.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const firstName = user?.name?.split(' ')[0] || 'Criador';

  const stats = [
    { label: 'Conteúdos Gerados', value: contents.length, icon: FileText, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { label: 'Ideias Salvas', value: ideas.length, icon: Lightbulb, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
    { label: 'Imagens Criadas', value: images.length, icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Favoritos', value: favorites.length, icon: Heart, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {firstName}! <span className="text-brand-text-muted text-xl">👋</span>
          </h1>
          <p className="text-brand-text-secondary mt-1">
            {brand ? (
              <>Sua agência para <span className="text-brand-primary font-medium">{brand.name}</span> está pronta</>
            ) : (
              'Configure sua marca para começar'
            )}
          </p>
        </div>
        <button
          onClick={() => navigate('/ideas')}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white font-semibold rounded-xl btn-glow transition-all"
        >
          <Zap size={16} /> Criar conteúdo agora
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <span className="text-brand-text-muted text-sm">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Zap size={16} className="text-brand-primary" /> Ações Rápidas
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickActions.map(({ label, to, icon: Icon, color, bg }) => (
                  <button
                    key={to}
                    onClick={() => navigate(to)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-brand-border hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className={color} />
                    </div>
                    <span className="text-xs text-brand-text-secondary group-hover:text-white transition-colors text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Brand Diagnostic Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-primary" /> Minha Marca
                </h2>
                <button
                  onClick={() => navigate('/diagnostic')}
                  className="text-xs text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
                >
                  Ver tudo <ArrowRight size={12} />
                </button>
              </div>
              {diagnostic ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-brand-text-muted mb-1">Nicho</p>
                    <p className="text-white font-medium text-sm">{diagnostic.niche}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-text-muted mb-2">Paleta de Cores</p>
                    <div className="flex gap-2">
                      {Object.values(diagnostic.colors).slice(0, 4).map((c, i) => (
                        <div key={i} className="w-7 h-7 rounded-lg border border-white/10" style={{ background: c }} title={c} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-brand-text-muted mb-2">Frequência</p>
                    <p className="text-white text-sm font-medium">{diagnostic.postingFrequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-text-muted mb-2">Formatos Recomendados</p>
                    <div className="flex flex-wrap gap-1.5">
                      {diagnostic.recommendedFormats.map((f) => (
                        <span key={f} className={`text-xs px-2 py-0.5 rounded-full ${getFormatColor(f)}`}>
                          {getFormatLabel(f)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-brand-text-muted text-sm mb-3">Diagnóstico não realizado</p>
                  <button
                    onClick={() => navigate('/diagnostic')}
                    className="text-brand-primary text-sm hover:underline"
                  >
                    Analisar minha marca
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Contents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Clock size={16} className="text-brand-primary" /> Conteúdos Recentes
                </h2>
                <button onClick={() => navigate('/export')} className="text-xs text-brand-primary hover:text-brand-primary-hover flex items-center gap-1">
                  Ver todos <ArrowRight size={12} />
                </button>
              </div>
              {recentContents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={32} className="text-brand-text-muted mx-auto mb-3" />
                  <p className="text-brand-text-muted text-sm">Nenhum conteúdo criado ainda</p>
                  <button onClick={() => navigate('/ideas')} className="text-brand-primary text-sm hover:underline mt-2 block mx-auto">
                    Criar primeiro conteúdo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentContents.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-elevated hover:bg-white/5 transition-all cursor-pointer">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getFormatColor(c.format)}`}>
                        {c.format.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate font-medium">{c.title || c.headline}</p>
                        <p className="text-xs text-brand-text-muted">{formatDate(c.createdAt)}</p>
                      </div>
                      <Badge variant={c.status === 'pronto' ? 'success' : c.status === 'agendado' ? 'primary' : 'default'} className="shrink-0 text-[10px]">
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Posts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-brand-primary" /> Próximos Posts
                </h2>
                <button onClick={() => navigate('/calendar')} className="text-xs text-brand-primary hover:text-brand-primary-hover flex items-center gap-1">
                  Calendário <ArrowRight size={12} />
                </button>
              </div>
              {upcomingPosts.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={32} className="text-brand-text-muted mx-auto mb-3" />
                  <p className="text-brand-text-muted text-sm">Nenhum post agendado</p>
                  <button onClick={() => navigate('/calendar')} className="text-brand-primary text-sm hover:underline mt-2 block mx-auto">
                    Abrir calendário
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingPosts.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-elevated">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate font-medium">{p.title}</p>
                        <p className="text-xs text-brand-text-muted">{formatDate(p.date)}</p>
                      </div>
                      <Badge variant="primary" className="text-[10px] shrink-0">{getFormatLabel(p.format)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pilars chart (editorial) */}
      {diagnostic?.editorialPillars && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <Lightbulb size={16} className="text-brand-primary" /> Pilares Editoriais Sugeridos
              </h2>
              <div className="space-y-3">
                {diagnostic.editorialPillars.map((pillar) => (
                  <div key={pillar.name} className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: pillar.color }} />
                    <span className="text-sm text-white w-28 shrink-0">{pillar.name}</span>
                    <div className="flex-1 h-2 bg-brand-elevated rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pillar.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ background: pillar.color }}
                      />
                    </div>
                    <span className="text-sm text-brand-text-muted w-10 text-right">{pillar.percentage}%</span>
                    <span className="text-xs text-brand-text-muted hidden lg:block flex-1">{pillar.description}</span>
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
