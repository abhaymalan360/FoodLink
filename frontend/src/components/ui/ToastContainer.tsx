'use client';

import { useEffect, useState } from 'react';
import { useToastStore, ToastType } from '@/store/toastStore';
import { motion, AnimatePresence } from 'framer-motion';

const typeStyles: Record<ToastType, string> = {
  success: 'bg-teal-500 text-white shadow-teal-500/20',
  error: 'bg-red-500 text-white shadow-red-500/20',
  warning: 'bg-amber-500 text-white shadow-amber-500/20',
  info: 'bg-slate-800 text-white shadow-slate-800/20'
};

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`px-4 py-3 rounded-lg shadow-lg pointer-events-auto font-medium text-[14px] min-w-[280px] ${typeStyles[toast.type]}`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
