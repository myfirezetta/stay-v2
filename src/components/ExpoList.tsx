import { mockExpos } from '../lib/mockData';
import { Calendar, MapPin, Building2 } from 'lucide-react';

export function ExpoList() {
  return (
    <section className="py-16 bg-orange-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Upcoming Pet Expos
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join us at these community events to meet the cats in person and learn more about pet adoption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {mockExpos.map((expo) => (
            <div 
              key={expo.id}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{expo.name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-orange-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Date</p>
                    <p className="text-slate-600 dark:text-slate-400">{expo.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-orange-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Venue</p>
                    <p className="text-slate-600 dark:text-slate-400">{expo.venue}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Building2 className="w-5 h-5 text-orange-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Participating Shelters</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {expo.shelters.map((shelter, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full"
                        >
                          {shelter}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
