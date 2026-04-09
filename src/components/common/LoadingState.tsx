import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export function LoadingState({ message = 'Gerando conteúdo...', submessage }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center">
          <Sparkles size={28} className="text-brand-primary animate-pulse" />
        </div>
        <div className="absolute -inset-2 rounded-3xl border-2 border-brand-primary/30 animate-ping" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-white font-semibold text-lg">{message}</p>
        {submessage && <p className="text-brand-text-muted text-sm">{submessage}</p>}
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
