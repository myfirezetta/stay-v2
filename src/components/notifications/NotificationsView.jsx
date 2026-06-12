import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, Inbox } from 'lucide-react';

export function NotificationsView({ currentUser, notifications, onMarkAsRead, onMarkAllAsRead, onNavigate }) {
  return (
    <div className="flex flex-col h-full bg-white/40 dark:bg-zinc-950/40">
      <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/50">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            Notifications
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Stay updated with your mentions and assignments</p>
        </div>
        
        {notifications.some(n => !n.IsRead) && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">You're all caught up!</p>
            <p className="text-sm">No new notifications at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            <AnimatePresence>
              {notifications.map(notif => (
                <motion.div
                  key={notif.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => {
                    if (!notif.IsRead) onMarkAsRead(notif.Id);
                    onNavigate(notif.Link);
                  }}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                    notif.IsRead
                      ? 'bg-white/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800'
                      : 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20 shadow-sm'
                  }`}
                >
                  {!notif.IsRead && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                  <h3 className={`text-sm font-medium ${notif.IsRead ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {notif.Title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {notif.Content}
                  </p>
                  <div className="mt-3 text-xs text-zinc-400 flex items-center gap-2">
                    {new Date(notif.CreatedAt).toLocaleString()}
                    {!notif.IsRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notif.Id);
                        }}
                        className="ml-auto opacity-0 group-hover:opacity-100 text-indigo-600 dark:text-indigo-400 hover:underline transition-opacity"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
