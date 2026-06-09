import React from 'react';
import { Search } from 'lucide-react';

const TrendItem = ({ category, title, count }) => (
  <div className="flex flex-col py-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors -mx-4 px-4 rounded-xl">
    <span className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">{category}</span>
    <span className="text-base font-bold text-zinc-950 dark:text-zinc-50 mt-0.5">{title}</span>
    <span className="text-sm text-zinc-500 mt-1">{count} Updates</span>
  </div>
);

export function RightPanel() {
  return (
    <aside className="hidden xl:block w-[350px] pt-4 pl-8 h-[100dvh] sticky top-0">
      <div className="relative group mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-500 group-focus-within:text-zinc-950 dark:group-focus-within:text-zinc-50 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search OmniFlow..."
          className="w-full bg-zinc-100 dark:bg-zinc-900/50 text-zinc-950 dark:text-zinc-50 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-500 transition-all placeholder:text-zinc-500 border border-transparent dark:focus:border-zinc-800"
        />
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl p-5 mb-6 border border-transparent dark:border-zinc-800/50">
        <h2 className="text-xl font-extrabold tracking-tight mb-4 text-zinc-950 dark:text-zinc-50">Trending Tags</h2>
        <div className="flex flex-col gap-1">
          <TrendItem category="Systems" title="&AuthSystem" count="34" />
          <TrendItem category="Projects" title="#p:MobileApp" count="128" />
          <TrendItem category="Milestones" title="*m:Q3_Launch" count="45" />
          <TrendItem category="People" title="@u:SarahJ" count="89" />
        </div>
      </div>
      
      <div className="text-xs text-zinc-500 flex gap-3 flex-wrap px-2">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <span>© 2026 SymboFlow</span>
      </div>
    </aside>
  );
}
