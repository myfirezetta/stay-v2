import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

export function SearchableSelect({ value, onChange, options, placeholder, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className="flex items-center justify-between w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-indigo-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!selectedOption ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-950 dark:text-zinc-50'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[80] w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60">
          <div className="flex items-center gap-2 p-2 border-b border-zinc-100 dark:border-zinc-800">
            <Search size={14} className="text-zinc-400 shrink-0 ml-1" />
            <input 
              type="text" 
              autoFocus
              className="w-full bg-transparent border-none focus:outline-none text-sm text-zinc-950 dark:text-zinc-50 py-1" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-sm text-zinc-500">No results found</div>
            ) : (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.value}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-sm ${value === opt.value ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                  onClick={() => {
                    onChange({ target: { name, value: opt.value } });
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <Check size={14} className="shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
