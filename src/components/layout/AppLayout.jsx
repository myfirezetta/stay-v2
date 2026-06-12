import React from 'react';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';

export function AppLayout({ children, onManageClick, activeTab, onTabChange, onLogout, currentUser, unreadNotifications = 0 }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-pink-50/80 dark:from-zinc-950 dark:via-zinc-950 dark:to-purple-950/20 text-zinc-950 dark:text-zinc-50 transition-colors duration-500">
      <div className="max-w-[1300px] mx-auto flex justify-center lg:justify-between px-2 sm:px-4 lg:px-8">
        
        {/* Left Sidebar */}
        <Sidebar onManageClick={onManageClick} activeTab={activeTab} onTabChange={onTabChange} onLogout={onLogout} currentUser={currentUser} unreadNotifications={unreadNotifications} />

        {/* Main Feed Column */}
        <main className="w-full flex-1 max-w-[800px] border-x border-zinc-100 dark:border-zinc-800/50 min-h-[100dvh] flex flex-col relative bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
          {children}
        </main>

        {/* Right Panel */}
        <RightPanel />
        
      </div>
    </div>
  );
}
