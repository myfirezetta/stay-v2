import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { googleSignIn, getAccessToken, logout } from '../lib/auth';
import type { ScreenType } from '../types';
import { ChevronRight, Calendar as CalendarIcon, LogOut, ArrowRight, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink: string;
}

export function ConciergeScreen({
  onNavigate,
  user,
}: {
  onNavigate: (screen: ScreenType) => void;
  user?: User | null;
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchEvents = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token available. Please sign in again.");

      const timeMin = new Date().toISOString();
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=10&orderBy=startTime&singleEvents=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch calendar: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setEvents(data.items || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await googleSignIn();
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setEvents([]);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-max-width mx-auto px-margin-desktop py-20 flex flex-col items-center min-h-[60vh] justify-center">
        <h1 className="text-4xl font-bold mb-6 tracking-tight text-center">Your Personal Concierge</h1>
        <p className="text-on-surface-variant text-lg mb-12 text-center max-w-md">
          Sign in to connect your Google Calendar. We'll find the perfect dates for your next sanctuary based on your availability.
        </p>
        
        {error && <div className="mb-6 text-error font-medium">{error}</div>}

        <button 
          className="gsi-material-button border border-outline/30 rounded shadow-sm hover:bg-surface-container-low transition-colors"
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper flex items-center px-4 py-3 bg-white hover:bg-gray-50 transition-colors rounded">
            <div className="gsi-material-button-icon mr-3">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="font-semibold text-on-surface">Sign in with Google</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Concierge Dashboard</h1>
          <p className="text-on-surface-variant flex items-center gap-2 mt-2">
            Welcome back, {user.displayName}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upcoming Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" /> 
              Upcoming Schedule
            </h2>
            <button 
              onClick={fetchEvents} 
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant py-8">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p className="font-medium">Syncing with Google Calendar...</p>
              </div>
            ) : error ? (
              <div className="text-error bg-error-container p-4 rounded-xl">
                <p className="font-semibold">Unable to map your schedule.</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-outline mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Your schedule is open</h3>
                <p className="text-on-surface-variant text-sm mt-1">We couldn't find any upcoming events.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const dateStr = event.start.dateTime || event.start.date || '';
                  const formattedDate = dateStr ? format(parseISO(dateStr), "MMM d, h:mm a") : 'TBD';
                  const isAllDay = !event.start.dateTime;
                  
                  return (
                    <div key={event.id} className="flex gap-4 p-4 rounded-xl border border-surface-container-highest hover:border-outline-variant transition-colors group">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-xs font-bold text-primary uppercase tracking-wide">
                          {dateStr ? format(parseISO(dateStr), "MMM") : ''}
                        </div>
                        <div className="text-2xl font-bold text-on-surface">
                          {dateStr ? format(parseISO(dateStr), "d") : ''}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-on-surface text-lg group-hover:text-primary transition-colors">{event.summary || '(No title)'}</h4>
                        <p className="text-sm text-on-surface-variant flex items-center gap-2 mt-1">
                          {isAllDay ? 'All day' : formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Concierge Recommendations */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <h2 className="text-xl font-semibold mb-6">Concierge Recommendation</h2>
            
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant">
              <h3 className="font-bold text-lg mb-2">Weekend Escape</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Based on your calendar, you have a clear schedule next weekend. It's the perfect time to book The Azure Estate.
              </p>
              
              <div className="rounded-xl overflow-hidden mb-6 relative group cursor-pointer" onClick={() => onNavigate('details')}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbVva7e_KyAsSlOzKSTNDsKys_Nv_93IaYAcK_U2apB4_WV8oooPnn22LYfhCoSqCwB3ifR7Pr_kHnXavJ3rHKFRKToaFjkvqIV_rntNOwucw7Zo7IoPjE7iYjcRYuJ57Ibg49GzU-4rSQy7NffV7sQTk9VBEXoBZPnDRKYSMVAZkWTRd7I7BICWsWe_IY53-uc2iwhly_XaRt0bmiKPY3tO3_5-Fwssy7X9VaanljSZjRIy3KTRyTXl8TgtraW7fs7tEYY2kuEr91" 
                  alt="The Azure Estate" 
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold">The Azure Estate</p>
                  <p className="text-xs opacity-90">Amalfi Coast, Italy</p>
                </div>
              </div>
              
              <button 
                onClick={() => onNavigate('details')}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                View Property <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-6 flex items-start gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-2xl">✨</span>
              <p className="text-sm font-medium text-on-surface">
                Our concierge service actively monitors your availability to suggest exclusive experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
