import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/Badge';
import { MessageSquare, Heart, Share, MoreHorizontal } from 'lucide-react';
import { Composer } from './Composer';

// A simple text formatter that replaces raw tags with Badge components
const FormattedContent = ({ content }) => {
  if (!content) return null;
  
  // Split by regex but keep delimiters so we can process them
  // Regex matches #p:Project, @u:User, !tk:123, &sys:Auth
  const regex = /([#@*!&])(?:[a-zA-Z]+:)?(\w+)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    // Push badge
    const symbol = match[1];
    const fullTag = match[0];
    const valueStr = fullTag.substring(1); // everything after the symbol
    
    parts.push(
      <Badge key={match.index} symbol={symbol} value={valueStr} raw={fullTag} />
    );
    
    lastIndex = regex.lastIndex;
  }
  
  // Push remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span className="whitespace-pre-wrap">{parts}</span>;
};

export function FeedItem({ item }) {
  const [isReplying, setIsReplying] = useState(false);
  const date = new Date(item.CreatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-zinc-100 dark:border-zinc-800/50 p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors flex flex-col gap-3"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold flex-shrink-0 mt-1">
          U
        </div>
        
        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-zinc-950 dark:text-zinc-50">User {item.AuthorId || 1}</span>
              <span className="text-zinc-500">· {date}</span>
            </div>
            <button className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
          
          {/* Body */}
          <div className="text-lg text-zinc-900 dark:text-zinc-100 leading-snug mb-3">
            <FormattedContent content={item.Content} />
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center gap-6 text-zinc-400">
            <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10">
                <MessageSquare size={18} />
              </div>
              <span className="text-sm font-medium">{item.replies?.length || 'Reply'}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-rose-500 dark:hover:text-rose-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10">
                <Heart size={18} />
              </div>
            </button>
            <button className="flex items-center gap-2 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10">
                <Share size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Reply Composer */}
      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-14 overflow-hidden"
          >
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Composer parentId={item.Id} compact={true} onSuccess={() => setIsReplying(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nested Replies */}
      {item.replies && item.replies.length > 0 && (
        <div className="pl-14 flex flex-col gap-4 mt-2">
          {item.replies.map((reply) => (
            <div key={reply.Id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                U
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">User {reply.AuthorId || 1}</span>
                  <span className="text-zinc-500">· {new Date(reply.CreatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="text-base text-zinc-900 dark:text-zinc-100 leading-snug">
                  <FormattedContent content={reply.Content} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.article>
  );
}
