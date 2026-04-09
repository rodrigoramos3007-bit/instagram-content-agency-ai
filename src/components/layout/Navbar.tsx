import { Bell, Search, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBrandStore } from '@/store/brandStore';
import { useLocation, useNavigate } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/diagnostic': 'Diagnóstico da Marca',
  '/ideas': 'Gerador de Ideias',
  '/posts': 'Criador de Posts',
  '/carousel': 'Criador de Carrossel',
  '/reels': 'Criador de Reels',
  '/captions': 'Gerador de Legendas',
  '/hashtags': 'Gerador de Hashtags',
  '/images': 'Gerador de Imagens',
  '/templates': 'Biblioteca de Templates',
  '/calendar': 'Calendário Editorial',
  '/export': 'Exportar / Publicar',
  '/settings': 'Configurações da Marca',
};

export function Navbar() {
  const { user } = useAuthStore();
  const { brand } = useBrandStore();
  const location = useLocation();
  const navigate = useNavigate();

  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-[72px] bg-brand-surface border-b border-brand-border flex items-center px-6 gap-4 shrink-0">
      {/* Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {brand && (
          <p className="text-xs text-brand-text-muted">{brand.name}</p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-brand-elevated border border-brand-border rounded-xl px-3 py-2 w-64">
        <Search size={14} className="text-brand-text-muted" />
        <input
          type="text"
          placeholder="Buscar conteúdos..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-brand-text-muted outline-none"
        />
      </div>

      {/* New Content */}
      <button
        onClick={() => navigate('/ideas')}
        className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium rounded-xl transition-colors btn-glow"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Novo Conteúdo</span>
      </button>

      {/* Notifications */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-brand-elevated border border-brand-border text-brand-text-secondary hover:text-white transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-secondary rounded-full"></span>
      </button>

      {/* User Avatar */}
      <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-sm font-bold cursor-pointer">
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    </header>
  );
}
