import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Lightbulb, Image, LayoutGrid, Play, AlignLeft,
  Hash, Sparkles, BookTemplate, Calendar, Download, Settings,
  ChevronLeft, ChevronRight, LogOut, Zap, Activity
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useBrandStore } from '@/store/brandStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/diagnostic', icon: Activity, label: 'Diagnóstico da Marca' },
  { to: '/ideas', icon: Lightbulb, label: 'Gerador de Ideias' },
  { to: '/posts', icon: Image, label: 'Criador de Posts' },
  { to: '/carousel', icon: LayoutGrid, label: 'Criador de Carrossel' },
  { to: '/reels', icon: Play, label: 'Criador de Reels' },
  { to: '/captions', icon: AlignLeft, label: 'Gerador de Legendas' },
  { to: '/hashtags', icon: Hash, label: 'Gerador de Hashtags' },
  { to: '/images', icon: Sparkles, label: 'Gerador de Imagens' },
  { to: '/templates', icon: BookTemplate, label: 'Templates' },
  { to: '/calendar', icon: Calendar, label: 'Calendário Editorial' },
  { to: '/export', icon: Download, label: 'Exportar / Publicar' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const { brand } = useBrandStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-brand-surface border-r border-brand-border overflow-hidden shrink-0 z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-brand-border min-h-[72px]">
        <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-bold text-white leading-tight whitespace-nowrap">Content Agency</p>
              <p className="text-xs text-brand-text-secondary whitespace-nowrap">AI</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brand Info */}
      {brand && !sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: brand.diagnostic?.colors?.primary || '#7C3AED' }}
            >
              {brand.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{brand.name}</p>
              <p className="text-[10px] text-brand-text-muted truncate">{brand.diagnostic?.niche || 'Marca'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-brand-primary/20 text-white border border-brand-primary/30'
                    : 'text-brand-text-secondary hover:text-white hover:bg-white/5'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-brand-primary' : 'text-brand-text-muted group-hover:text-white'
                    )}
                  />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-brand-border p-2">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-brand-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all',
          )}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Sair
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-brand-elevated border border-brand-border rounded-full flex items-center justify-center text-brand-text-muted hover:text-white transition-colors z-10"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
