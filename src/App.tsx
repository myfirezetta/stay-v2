/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { DetailsScreen } from './screens/DetailsScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { ConciergeScreen } from './screens/ConciergeScreen';
import { initAuth } from './lib/auth';
import { User } from 'firebase/auth';
import type { ScreenType } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth((user) => setUser(user), () => setUser(null));
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface">
      <Navigation onNavigate={setCurrentScreen} user={user} />
      
      <main className="flex-1">
        {currentScreen === 'home' && <HomeScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'details' && <DetailsScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'checkout' && <CheckoutScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'concierge' && <ConciergeScreen onNavigate={setCurrentScreen} user={user} />}
      </main>

      <Footer />
    </div>
  );
}
