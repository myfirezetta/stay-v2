import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Hash, AtSign, Calendar, Layers, Ticket } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('');

export function Composer({ parentId = null, onSuccess = null, compact = false, currentUser }) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [lookupData, setLookupData] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const textareaRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      setAutocomplete(null);
    }, 200);
  };

  useEffect(() => {
    const fetchLookup = () => {
      fetch('/api/lookup', {
        headers: currentUser ? { 'X-User-Id': currentUser.id.toString() } : {}
      })
        .then(res => res.json())
        .then(data => setLookupData(data))
        .catch(console.error);
    };

    fetchLookup();

    socket.on('db_updated', fetchLookup);
    return () => {
      socket.off('db_updated', fetchLookup);
    };
  }, []);

  const getAutocompleteItems = (symbol, prefix, query) => {
    if (!lookupData) return [];
    
    let items = [];
    if (symbol === '#') {
       if (!prefix || prefix === 'p:') items.push(...(lookupData.projects || []).map(p => ({...p, type: 'Project', prefix: '#p:'})));
       if (!prefix || prefix === 't:') items.push(...(lookupData.tasks || []).map(t => ({...t, type: 'Task', prefix: '#t:'})));
    } else if (symbol === '@') {
       if (!prefix || prefix === 'u:') items.push(...(lookupData.users || []).map(u => ({...u, type: 'User', prefix: '@u:'})));
       if (!prefix || prefix === 'g:') items.push(...(lookupData.groups || []).map(g => ({...g, type: 'Group', prefix: '@g:'})));
       if (!prefix || prefix === 'd:') items.push(...(lookupData.departments || []).map(d => ({...d, type: 'Dept', prefix: '@d:'})));
       if (!prefix || prefix === 'r:') items.push(...(lookupData.roles || []).map(r => ({...r, type: 'Role', prefix: '@r:'})));
    } else if (symbol === '*') {
       items = (lookupData.milestones || []).map(m => ({...m, type: 'Milestone', prefix: '*m:'}));
    } else if (symbol === '!') {
       items = (lookupData.tickets || []).map(t => ({...t, type: 'Ticket', prefix: '!tk:'}));
    } else if (symbol === '&') {
       items = (lookupData.systems || []).map(s => ({...s, type: 'System', prefix: '&sys:'}));
    }

    if (query) {
       items = items.filter(item => {
         const name = item.name || item.title || '';
         return name.toLowerCase().includes(query.toLowerCase());
       });
    }
    return items.slice(0, 5);
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setContent(val);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 60)}px`;
    }

    // Autocomplete Logic
    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    const match = lastWord.match(/^([#@*!&])([a-zA-Z]+:)?([\w]*)$/);
    if (match) {
      const symbol = match[1];
      const prefix = match[2];
      const query = match[3];
      const items = getAutocompleteItems(symbol, prefix, query);
      
      if (items.length > 0) {
        setAutocomplete({
          active: true,
          items,
          startIndex: cursor - lastWord.length,
          endIndex: cursor
        });
      } else {
        setAutocomplete(null);
      }
    } else {
      setAutocomplete(null);
    }
  };

  const handleSelectAutocomplete = (item) => {
    if (!autocomplete) return;
    const nameOrTitle = item.name || item.title || '';
    const safeName = nameOrTitle.replace(/\s+/g, '');
    
    const tag = `${item.prefix}${safeName}`;
    const before = content.slice(0, autocomplete.startIndex);
    const after = content.slice(autocomplete.endIndex);
    
    const newContent = before + tag + ' ' + after;
    setContent(newContent);
    setAutocomplete(null);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const insertSymbol = (symbol) => {
    const needsSpace = content.length > 0 && !content.endsWith(' ') && !content.endsWith('\n');
    const newContent = content + (needsSpace ? ' ' : '') + symbol;
    
    const mockEvent = {
      target: {
        value: newContent,
        selectionStart: newContent.length
      }
    };
    
    handleInput(mockEvent);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const parseTags = (text) => {
    const tags = [];
    const regex = /([#@*!&])(?:[p|t|tk|sys|u|g|d|m|d|date|deadline]:)?(\w+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      tags.push({ symbol: match[1], value: match[2] });
    }
    return tags;
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    const parsedTags = parseTags(content);
    fetch('/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, parsedTags, authorId: currentUser ? currentUser.id : 1, parentId })
    }).then(res => res.json()).then(data => {
      window.dispatchEvent(new CustomEvent('feed_added', { detail: data }));
    }).catch(console.error);
    
    setContent('');
    setAutocomplete(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
    }
    
    if (onSuccess) onSuccess();
  };

  return (
    <div className={`transition-colors relative ${isFocused ? 'bg-zinc-50 dark:bg-zinc-900/50' : 'bg-transparent'} ${compact ? 'p-3' : 'border-b border-zinc-100 dark:border-zinc-800/50 p-4'}`}>
      <div className="flex gap-4">
        {!compact && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm shadow-purple-500/20">
            U
          </div>
        )}
        <div className="flex-1 flex flex-col relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={compact ? "Write a reply..." : "Update the team or tag a project..."}
            className={`w-full bg-transparent resize-none outline-none text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 py-2 ${compact ? 'text-lg min-h-[40px]' : 'text-xl min-h-[60px]'}`}
          />

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {autocomplete && autocomplete.items.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {autocomplete.items.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.id || idx}`}
                    onMouseDown={(e) => { e.preventDefault(); handleSelectAutocomplete(item); }}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 last:border-0 flex flex-col"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider w-16">{item.type}</span>
                      <span className="font-semibold text-zinc-950 dark:text-zinc-50">{item.name || item.title}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100/50 dark:border-zinc-800/50">
            <div className="flex items-center gap-1 text-zinc-400">
              <button onClick={() => insertSymbol('#')} className="p-2 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors" title="Projects & Tasks (#)">
                <Hash size={18} />
              </button>
              <button onClick={() => insertSymbol('@')} className="p-2 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-full transition-colors" title="People & Groups (@)">
                <AtSign size={18} />
              </button>
              <button onClick={() => insertSymbol('*')} className="p-2 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-full transition-colors" title="Milestones (*)">
                <Calendar size={18} />
              </button>
              <button onClick={() => insertSymbol('&')} className="p-2 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-full transition-colors" title="Systems (&)">
                <Layers size={18} />
              </button>
              <button onClick={() => insertSymbol('!')} className="p-2 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors" title="Tickets (!)">
                <Ticket size={18} />
              </button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={`${compact ? 'px-4 py-1.5' : 'px-5 py-2'} bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full font-bold text-sm disabled:opacity-50 flex items-center gap-2 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200`}
            >
              {compact ? 'Reply' : 'Post'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
