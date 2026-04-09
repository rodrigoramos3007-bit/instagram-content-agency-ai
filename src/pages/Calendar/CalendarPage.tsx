import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ChevronLeft, ChevronRight, Plus, X, Grid3X3, List,
  Play, LayoutGrid, Image, Smartphone
} from 'lucide-react';
import { useCalendarStore } from '@/store/calendarStore';
import { useBrandStore } from '@/store/brandStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { generateId, formatDate } from '@/lib/utils';
import { CONTENT_FORMATS, CONTENT_OBJECTIVES, EDITORIAL_PILLARS } from '@/lib/constants';
import type { CalendarPost } from '@/types/calendar';
import type { ContentFormat, ContentObjective } from '@/types/content';
import { toast } from 'sonner';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  addMonths, subMonths, isSameDay, isSameMonth, isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatIcons: Record<string, React.ReactNode> = {
  reel: <Play size={10} />,
  carousel: <LayoutGrid size={10} />,
  post: <Image size={10} />,
  story: <Smartphone size={10} />,
};

function AddPostModal({ date, onClose, onAdd }: { date: Date; onClose: () => void; onAdd: (post: CalendarPost) => void }) {
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<ContentFormat>('post');
  const [objective, setObjective] = useState<ContentObjective>('engajamento');
  const [pillar, setPillar] = useState('Educação');
  const [time, setTime] = useState('12:00');
  const [notes, setNotes] = useState('');

  function handleAdd() {
    if (!title) { toast.error('Informe o título'); return; }
    const pillarObj = EDITORIAL_PILLARS.find((p) => p.name === pillar);
    onAdd({
      id: generateId(),
      title,
      format,
      objective,
      pillar,
      color: pillarObj?.color || '#7C3AED',
      date: date.toISOString().split('T')[0],
      time,
      status: 'rascunho',
      notes,
    });
    onClose();
    toast.success('Post adicionado ao calendário!');
  }

  return (
    <div className="p-6 space-y-4">
      <p className="text-sm text-brand-text-secondary">Adicionando post para: <span className="text-white font-medium">{formatDate(date)}</span></p>
      <div>
        <label className="text-xs text-brand-text-muted mb-1.5 block">Título do Post *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Dica de marketing semanal" className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-brand-text-muted mb-1.5 block">Formato</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as ContentFormat)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none">
            {CONTENT_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-brand-text-muted mb-1.5 block">Horário</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-brand-text-muted mb-1.5 block">Objetivo</label>
          <select value={objective} onChange={(e) => setObjective(e.target.value as ContentObjective)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none">
            {CONTENT_OBJECTIVES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-brand-text-muted mb-1.5 block">Pilar</label>
          <select value={pillar} onChange={(e) => setPillar(e.target.value)} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none">
            {EDITORIAL_PILLARS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-brand-text-muted mb-1.5 block">Observações</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notas sobre o post..." className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button onClick={handleAdd} className="flex-1">Adicionar</Button>
      </div>
    </div>
  );
}

export function CalendarPage() {
  const { posts, addPost, removePost, updatePost } = useCalendarStore();
  const { brand } = useBrandStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [view, setView] = useState<'month' | 'list'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDow = getDay(monthStart);
  const leadingDays = Array.from({ length: startDow }, (_, i) => i);

  function getPostsForDay(day: Date) {
    return posts.filter((p) => isSameDay(new Date(p.date + 'T00:00:00'), day));
  }

  function handleDayClick(day: Date) {
    setSelectedDate(day);
    setIsAddModalOpen(true);
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const upcomingPosts = posts
    .filter((p) => new Date(p.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendário Editorial</h1>
          <p className="text-brand-text-secondary text-sm mt-1">{posts.length} posts agendados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('month')} className={`p-2 rounded-xl border transition-all ${view === 'month' ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'border-brand-border text-brand-text-muted hover:text-white bg-brand-elevated'}`}>
            <Grid3X3 size={16} />
          </button>
          <button onClick={() => setView('list')} className={`p-2 rounded-xl border transition-all ${view === 'list' ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'border-brand-border text-brand-text-muted hover:text-white bg-brand-elevated'}`}>
            <List size={16} />
          </button>
          <Button leftIcon={<Plus size={16} />} onClick={() => { setSelectedDate(new Date()); setIsAddModalOpen(true); }}>
            Adicionar Post
          </Button>
        </div>
      </motion.div>

      {view === 'month' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-5">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-xl hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><ChevronLeft size={18} /></button>
                <h2 className="text-white font-semibold text-lg capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-xl hover:bg-brand-elevated text-brand-text-muted hover:text-white transition-all"><ChevronRight size={18} /></button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {dayNames.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-brand-text-muted py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {leadingDays.map((i) => <div key={`empty-${i}`} />)}
                {days.map((day) => {
                  const dayPosts = getPostsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const today = isToday(day);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day)}
                      className={`min-h-[80px] p-1.5 rounded-xl border text-left transition-all hover:border-brand-primary/40 ${today ? 'border-brand-primary/60 bg-brand-primary/10' : 'border-brand-border hover:bg-brand-elevated'}`}
                    >
                      <p className={`text-xs font-semibold mb-1 ${today ? 'text-brand-primary' : isCurrentMonth ? 'text-white' : 'text-brand-text-muted'}`}>
                        {format(day, 'd')}
                      </p>
                      <div className="space-y-0.5">
                        {dayPosts.slice(0, 2).map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-1 text-[9px] px-1 py-0.5 rounded-md truncate"
                            style={{ background: p.color + '20', color: p.color }}
                          >
                            {formatIcons[p.format]}
                            <span className="truncate">{p.title}</span>
                          </div>
                        ))}
                        {dayPosts.length > 2 && (
                          <p className="text-[9px] text-brand-text-muted pl-1">+{dayPosts.length - 2} mais</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-white mb-3">Pilares Editoriais</h3>
              <div className="flex flex-wrap gap-3">
                {EDITORIAL_PILLARS.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-xs text-brand-text-secondary">{p.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {upcomingPosts.length === 0 ? (
            <div className="text-center py-16">
              <Calendar size={48} className="text-brand-text-muted mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">Nenhum post agendado</p>
              <Button onClick={() => { setSelectedDate(new Date()); setIsAddModalOpen(true); }} leftIcon={<Plus size={16} />}>Adicionar primeiro post</Button>
            </div>
          ) : (
            upcomingPosts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-10 rounded-full shrink-0" style={{ background: p.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-brand-text-muted">{formatDate(p.date)} {p.time && `às ${p.time}`}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="primary" className="text-[10px]">{p.format}</Badge>
                        <Badge variant="default" className="text-[10px]">{p.pillar}</Badge>
                        <select
                          value={p.status}
                          onChange={(e) => updatePost(p.id, { status: e.target.value as CalendarPost['status'] })}
                          className="bg-brand-elevated border border-brand-border rounded-lg px-2 py-1 text-xs text-white outline-none"
                        >
                          <option value="rascunho">Rascunho</option>
                          <option value="pronto">Pronto</option>
                          <option value="agendado">Agendado</option>
                          <option value="publicado">Publicado</option>
                        </select>
                        <button onClick={() => removePost(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-brand-text-muted hover:text-red-400 transition-all">
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Post no Calendário" size="md">
        {selectedDate && (
          <AddPostModal
            date={selectedDate}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={addPost}
          />
        )}
      </Modal>
    </div>
  );
}
