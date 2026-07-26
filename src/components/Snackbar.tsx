import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface SnackbarMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface SnackbarProps {
  snackbars: SnackbarMessage[];
  onDismiss: (id: string) => void;
}

export const SnackbarContainer: React.FC<SnackbarProps> = ({ snackbars, onDismiss }) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-sm w-[90%] pointer-events-none">
      <AnimatePresence>
        {snackbars.map((snack) => (
          <SnackbarItem key={snack.id} snack={snack} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const SnackbarItem: React.FC<{ snack: SnackbarMessage; onDismiss: (id: string) => void }> = ({
  snack,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(snack.id);
    }, snack.duration || 3500);

    return () => clearTimeout(timer);
  }, [snack, onDismiss]);

  const getIcon = () => {
    switch (snack.type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xl border border-zinc-800 dark:border-zinc-200 text-sm font-medium w-full"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {getIcon()}
        <span className="truncate">{snack.message}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {snack.actionLabel && snack.onAction && (
          <button
            onClick={() => {
              snack.onAction!();
              onDismiss(snack.id);
            }}
            className="text-purple-400 dark:text-purple-600 font-semibold px-2 py-1 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            {snack.actionLabel}
          </button>
        )}
        <button
          onClick={() => onDismiss(snack.id)}
          className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 dark:text-zinc-600 dark:hover:text-zinc-800 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
