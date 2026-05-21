export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-surface-container-highest">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-max-width mx-auto px-margin-desktop py-12">
        <div className="mb-8 md:mb-0">
          <span className="font-bold text-lg text-on-surface">LuxeStay</span>
          <p className="text-sm text-on-surface-variant mt-2">© 2024 LuxeStay Global Holdings. Designed for the discerning traveler.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Privacy Policy</a>
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Terms of Service</a>
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Sustainability</a>
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Careers</a>
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Investor Relations</a>
        </div>
      </div>
    </footer>
  );
}
