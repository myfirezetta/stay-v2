import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Compass, User, Settings, Layers, Moon, Sun, LogOut } from 'lucide-react';

const NavItem = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <div className="relative group w-full flex">
      <motion.button
        onClick={onClick}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-4 w-full px-4 py-3 rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50 ${
          isActive ? 'font-bold text-zinc-950 dark:text-zinc-50' : 'font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50'
        }`}
      >
        <Icon size={26} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-600 dark:text-zinc-400"} />
        <span className="text-xl tracking-tight hidden lg:block">{label}</span>
      </motion.button>
      
      {/* Tooltip for smaller screens */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 lg:hidden shadow-xl pointer-events-none">
        {label}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-zinc-900 dark:border-r-white"></div>
      </div>
    </div>
  );
};

export function Sidebar({ onManageClick, activeTab, onTabChange, onLogout, currentUser }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.removeAttribute('data-theme');
      setIsDark(false);
    }
  };

  return (
    <aside className="sticky top-0 h-[100dvh] flex flex-col pt-6 pb-6 pr-4 items-end lg:items-start lg:w-64 z-50">
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/30">
          S
        </div>
        <span className="font-bold text-2xl tracking-tighter hidden lg:block dark:text-zinc-50">SymboFlow</span>
      </div>

      <nav className="flex flex-col gap-2 w-auto lg:w-full">
        <NavItem icon={Home} label="Home" isActive={activeTab === 'Home'} onClick={() => onTabChange('Home')} />
        <NavItem icon={Compass} label="Explore" isActive={activeTab === 'Explore'} onClick={() => onTabChange('Explore')} />
        <NavItem icon={Layers} label="Manage" onClick={onManageClick} />
        <NavItem icon={isDark ? Sun : Moon} label="Theme" onClick={toggleTheme} />
        <NavItem icon={Settings} label="Settings" isActive={activeTab === 'Settings'} onClick={() => onTabChange('Settings')} />
      </nav>

      <div className="mt-auto pt-8 w-auto lg:w-full">
        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex flex-col items-center lg:items-start gap-3 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
              {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <div className="text-sm font-bold text-zinc-950 dark:text-zinc-50 truncate">{currentUser?.displayName || 'Unknown'}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{currentUser?.role || 'Member'}</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-3 p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden lg:block text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
