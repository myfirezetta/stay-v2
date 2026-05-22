import { ThemeToggle } from './components/ThemeToggle';
import { CatGallery } from './components/CatGallery';
import { ExpoList } from './components/ExpoList';
import { AdoptionForm } from './components/AdoptionForm';
import { HeroVideo } from './components/HeroVideo';
import { ScrollToTop } from './components/ScrollToTop';
import { PawPrint } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center transform rotate-3 relative">
              <PawPrint className="w-5 h-5 text-white fill-white absolute -top-1 -left-1" />
              <PawPrint className="w-6 h-6 text-white fill-white" />
              <PawPrint className="w-4 h-4 text-white fill-white absolute -bottom-1 -right-1" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ADOPT ME</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden min-h-[600px] flex items-center justify-center">
        <HeroVideo />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Find your new <span className="text-orange-500">best friend.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every cat deserves a loving home. We connect wonderful families with incredible felines ready for a second chance.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
            >
              Meet the Cats
            </button>
            <button 
              onClick={() => document.getElementById('expos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              View Expos
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <main>
        <div id="gallery">
          <CatGallery />
        </div>
        
        <div id="expos">
          <ExpoList />
        </div>
        
        <div id="adopt">
          <AdoptionForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <PawPrint className="w-5 h-5 text-orange-500" />
            <PawPrint className="w-4 h-4 text-orange-400 -mt-2" />
            <span className="font-semibold text-slate-900 dark:text-white ml-2">ADOPT ME</span>
          </div>
          <p>© {new Date().getFullYear()} ADOPT ME Adoption Center. All rights reserved.</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}

export default App;
