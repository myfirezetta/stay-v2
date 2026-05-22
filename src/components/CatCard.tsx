import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import type { Cat } from '../lib/mockData';

export function CatCard({ cat }: { cat: Cat }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
    >
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={cat.imageUrl} 
          alt={cat.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{cat.name}</h3>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full">
            Available
          </span>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 mb-4">{cat.behavior}</p>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {isExpanded ? "Show Less" : "Read More"}
          {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700"
            >
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Pros</h4>
                <ul className="space-y-1">
                  {cat.pros.map((pro, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Cons</h4>
                <ul className="space-y-1">
                  {cat.cons.map((con, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                      <X className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">History</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.history}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
