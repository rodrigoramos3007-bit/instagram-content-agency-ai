import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBrandStore } from '@/store/brandStore';
import { generateId } from '@/lib/utils';

export function LoginPage() {
  const [email, setEmail] = useState('demo@contentai.com');
  const [password, setPassword] = useState('demo123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { isOnboarded } = useBrandStore();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login({ id: generateId(), name: email.split('@')[0], email });
    setLoading(false);
    navigate(isOnboarded ? '/' : '/onboarding');
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-brand-bg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-tight">Content Agency</p>
              <p className="text-xs text-brand-text-muted">AI — Instagram Marketing</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-brand-text-secondary">Acesse sua agência de conteúdo inteligente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-secondary mb-1.5">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-all btn-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-brand-border" />
              <span className="text-xs text-brand-text-muted">ou</span>
              <div className="flex-1 h-px bg-brand-border" />
            </div>

            <button
              type="button"
              className="w-full py-3 bg-brand-surface border border-brand-border hover:border-brand-primary/40 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3"
            >
              <Chrome size={18} />
              Continuar com Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-text-muted">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-brand-primary hover:text-brand-primary-hover font-medium transition-colors">
              Criar conta grátis
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-brand-text-muted">
            Demo: demo@contentai.com / demo123
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-primary/20 via-brand-bg to-brand-secondary/10 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent" />
        <div className="relative z-10 text-center px-8 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-brand flex items-center justify-center mx-auto mb-8 shadow-glow-primary">
              <Zap size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Sua agência de<br />
              <span className="gradient-text">conteúdo inteligente</span>
            </h2>
            <p className="text-brand-text-secondary text-lg leading-relaxed">
              Crie posts, carrosseis, reels e estratégias completas para Instagram com o poder da IA — em minutos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Conteúdos', value: '10k+' },
              { label: 'Formatos', value: '14' },
              { label: 'Marcas', value: '2.5k' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-brand-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
