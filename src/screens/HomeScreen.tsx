import { Search, Shield, Clock, Sparkles } from 'lucide-react';
import type { ScreenType } from '../types';

export function HomeScreen({
  onNavigate,
}: {
  onNavigate: (screen: ScreenType) => void;
}) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-c6a4d14d8379?auto=format&fit=crop&w=2000&q=80")' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-max-width mx-auto px-margin-desktop text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 tracking-tight drop-shadow-lg">
            Refined Sanctuary for the Discerning Explorer
          </h1>
          
          {/* Search Bar */}
          <div className="bg-white rounded-full p-2 flex flex-col md:flex-row items-center max-w-4xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex-1 px-8 py-3 text-left w-full border-b md:border-b-0 md:border-r border-outline-variant">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-on-surface">Location</label>
              <input type="text" placeholder="Where are you traveling?" className="w-full mt-1 text-sm outline-none text-on-surface placeholder:text-on-surface-variant font-medium bg-transparent" />
            </div>
            <div className="flex-1 px-8 py-3 text-left w-full border-b md:border-b-0 md:border-r border-outline-variant">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-on-surface">Dates</label>
              <input type="text" placeholder="Oct 12 — Oct 19" className="w-full mt-1 text-sm outline-none text-on-surface placeholder:text-on-surface-variant font-medium bg-transparent" />
            </div>
            <div className="flex-1 px-8 py-3 text-left w-full">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-on-surface">Guests</label>
              <input type="text" placeholder="2 Adults, 1 Room" className="w-full mt-1 text-sm outline-none text-on-surface placeholder:text-on-surface-variant font-medium bg-transparent" />
            </div>
            <button 
              className="bg-primary text-white p-4 md:px-8 md:py-4 rounded-full hover:brightness-110 transition-all mt-4 md:mt-0 w-full md:w-auto flex justify-center active:scale-95"
              onClick={() => onNavigate('details')}
            >
              <Search className="w-5 h-5 md:mr-2" />
              <span className="md:hidden font-bold">Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-24 max-w-max-width mx-auto px-margin-desktop w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Curated Collections</h2>
            <p className="text-on-surface-variant text-lg">Hand-picked sanctuaries that redefine luxury through excellence.</p>
          </div>
          <button className="hidden md:flex items-center font-bold hover:text-primary transition-colors">
            View all <span className="ml-1">→</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="col-span-1 md:col-span-2 group cursor-pointer" onClick={() => onNavigate('details')}>
            <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-4 relative">
              <img src="https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80" alt="Positano" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Positano Private Estate</h3>
                <p className="text-on-surface-variant mb-1">Amalfi Coast, Italy • Iconic Stay</p>
                <p className="font-bold"><span className="text-lg">$4,200</span> <span className="font-normal text-on-surface-variant">night</span></p>
              </div>
              <div className="flex items-center gap-1 font-semibold">
                <span>★</span> 4.91
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            {/* Card 2 */}
            <div className="group cursor-pointer">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt="Zermatt" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">Swiss Alpine Loft</h3>
                  <p className="text-sm text-on-surface-variant mb-1">Zermatt, Switzerland</p>
                  <p className="font-bold"><span className="text-lg">$1,850</span> <span className="text-sm font-normal text-on-surface-variant">night</span></p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <span>★</span> 4.85
                </div>
              </div>
            </div>
            
             {/* Card 3 */}
            <div className="group cursor-pointer">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" alt="Santorini" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">Oia Horizon Suite</h3>
                  <p className="text-sm text-on-surface-variant mb-1">Santorini, Greece</p>
                  <p className="font-bold"><span className="text-lg">$2,400</span> <span className="text-sm font-normal text-on-surface-variant">night</span></p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <span>★</span> 4.95
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-outline-variant max-w-max-width mx-auto w-full" />

      {/* The LuxeStay Standard */}
      <section className="py-24 max-w-max-width mx-auto px-margin-desktop w-full text-center">
        <h2 className="text-3xl font-bold mb-16 tracking-tight">The LuxeStay Standard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div>
            <Shield className="w-8 h-8 text-primary mb-6" />
            <h3 className="font-bold text-xl mb-3">Vetted Exclusivity</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Every property undergoes a rigorous 200-point inspection to ensure absolute perfection.
            </p>
          </div>
          <div>
            <Clock className="w-8 h-8 text-primary mb-6" />
            <h3 className="font-bold text-xl mb-3">24/7 Lifestyle Manager</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Dedicated managers handling logistics and local secret-access experiences for every stay.
            </p>
          </div>
          <div>
            <Sparkles className="w-8 h-8 text-primary mb-6" />
            <h3 className="font-bold text-xl mb-3">Atmospheric Curation</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Environments curated to foster deep rest, inspiration, and meaningful connection.
            </p>
          </div>
        </div>
      </section>

      {/* Ready for your next sanctuary? */}
      <section className="py-24 px-margin-desktop">
        <div 
          className="max-w-max-width mx-auto rounded-3xl overflow-hidden relative py-32 px-8 text-center flex flex-col items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=2000&q=80")' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 w-full">
            <h2 className="text-4xl font-bold text-white mb-10 tracking-tight">Ready for your next sanctuary?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-on-surface font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
                Become a Member
              </button>
              <button className="bg-transparent text-white border border-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
                Speak with Concierge
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
