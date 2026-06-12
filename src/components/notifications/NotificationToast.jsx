import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';

export function NotificationToast({ toast, onClose, onNavigate }) {
  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-sm cursor-pointer hover:border-indigo-500/50 transition-colors"
        onClick={() => {
          onNavigate(toast.Link);
          onClose();
        }}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{toast.Title}</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{toast.Content}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
