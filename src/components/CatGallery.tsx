import { CatCard } from './CatCard';
import { mockCats } from '../lib/mockData';

export function CatGallery() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Meet Our Furry Friends
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            These adorable cats are looking for their forever homes. Browse their profiles and find your perfect match.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {mockCats.map(cat => (
            <div key={cat.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] flex">
              <div className="w-full">
                <CatCard cat={cat} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
