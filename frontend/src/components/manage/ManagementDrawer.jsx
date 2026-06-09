import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { EntityCreateModal } from './EntityCreateModal';

export function ManagementDrawer({ isOpen, onClose, currentUser, onSelectEntity }) {
  const [createModalType, setCreateModalType] = useState(null);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-zinc-950 shadow-2xl z-50 border-l border-zinc-100 dark:border-zinc-800/50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/50">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Manage Entities</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              {/* Simplified placeholder for management settings */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Core Taxonomies</h3>
                <div className="flex flex-col gap-2">
                  {['Projects', 'Tasks', 'Tickets', 'Systems'].map(entity => (
                    <div key={entity} className="flex gap-2">
                      <button 
                        onClick={() => onSelectEntity && onSelectEntity(entity)}
                        className="flex-1 text-left p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-zinc-800 dark:text-zinc-200 flex justify-between items-center group"
                      >
                        {entity}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">→</span>
                      </button>
                      <button 
                        onClick={() => setCreateModalType(entity)}
                        className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500 transition-all text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center"
                        title={`Create new ${entity.slice(0, -1)}`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">People & Teams</h3>
                <div className="flex flex-col gap-2">
                  {['Users', 'Groups', 'Departments'].map(entity => (
                    <div key={entity} className="flex gap-2">
                      <button 
                        onClick={() => onSelectEntity && onSelectEntity(entity)}
                        className="flex-1 text-left p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-zinc-800 dark:text-zinc-200 flex justify-between items-center group"
                      >
                        {entity}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">→</span>
                      </button>
                      <button 
                        onClick={() => setCreateModalType(entity)}
                        className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500 transition-all text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center"
                        title={`Create new ${entity.slice(0, -1)}`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>

          <EntityCreateModal 
            isOpen={!!createModalType} 
            entityType={createModalType} 
            onClose={() => setCreateModalType(null)} 
            currentUser={currentUser}
          />
        </>
      )}
    </AnimatePresence>
  );
}
