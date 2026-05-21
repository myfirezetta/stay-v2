import { Globe, UserCircle2, CalendarDays } from 'lucide-react';
import type { ScreenType } from '../types';
import type { User } from 'firebase/auth';

export function Navigation({
  onNavigate,
  user,
}: {
  onNavigate: (screen: ScreenType) => void;
  user?: User | null;
}) {
  return (
    <header className="bg-surface border-b border-surface-container-highest shadow-[0px_4px_12px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-max-width mx-auto px-margin-desktop h-20">
        <div 
          className="font-headline-md text-headline-md text-primary tracking-tight cursor-pointer font-bold"
          onClick={() => onNavigate('home')}
        >
          LuxeStay
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate('home')} className="text-on-surface font-bold hover:text-primary transition-colors duration-200">Destinations</button>
          <button className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">Experiences</button>
          <button className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">Membership</button>
          <button onClick={() => onNavigate('concierge')} className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Concierge</button>
        </nav>
        <div className="flex items-center gap-4">
          {!user ? (
            <button className="text-body-sm font-semibold text-on-surface hover:opacity-80 transition-opacity bg-primary text-white px-6 py-2.5 rounded-lg active:scale-95" onClick={() => onNavigate('concierge')}>Sign In</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-on-surface hidden md:block">Hi, {user.displayName?.split(' ')[0]}</span>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all" />
              ) : (
                <UserCircle2 className="w-6 h-6 cursor-pointer hover:text-primary" />
              )}
            </div>
          )}
          <div className="hidden md:flex items-center gap-4 text-on-surface-variant ml-2">
            <Globe className="w-5 h-5 cursor-pointer hover:text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
