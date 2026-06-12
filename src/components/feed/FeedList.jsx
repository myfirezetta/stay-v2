import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FeedItem } from './FeedItem';

import { ArrowLeft } from 'lucide-react';

const socket = io('');

export function FeedList({ currentUser, focusedPostId, onClearFocus }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = () => {
      fetch('/api/feed', {
        headers: currentUser ? { 'X-User-Id': currentUser.id.toString() } : {}
      })
        .then(res => res.json())
        .then(data => {
          setFeed(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load feed", err);
          setLoading(false);
        });
    };

    // Fetch initial feed
    fetchFeed();

    // Listen for new feed items
    const handleNewFeed = (item) => {
      if (item.ParentId) {
        setFeed(prev => prev.map(post => {
          if (post.Id === item.ParentId) {
            return {
              ...post,
              replies: [...(post.replies || []), item]
            };
          }
          return post;
        }));
      } else {
        setFeed(prev => [item, ...prev]);
      }
    };

    const handleDeletedFeed = (id) => {
      setFeed(prev => prev.filter(item => item.Id !== parseInt(id, 10)));
    };

    const handleNewFeedLocal = (e) => handleNewFeed(e.detail);
    window.addEventListener('feed_added', handleNewFeedLocal);

    socket.on('feed_added', handleNewFeed);
    socket.on('feed_updated', (updatedItem) => {
      setFeed(prev => prev.map(item => item.Id === updatedItem.Id ? updatedItem : item));
    });
    socket.on('feed_deleted', handleDeletedFeed);

    return () => {
      window.removeEventListener('feed_added', handleNewFeedLocal);
      socket.off('feed_added', handleNewFeed);
      socket.off('feed_updated');
      socket.off('feed_deleted', handleDeletedFeed);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500 dark:text-zinc-500">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-24 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl"></div>
          <div className="h-24 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl"></div>
          <div className="h-24 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="p-12 text-center text-zinc-500 dark:text-zinc-500 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl opacity-50">✨</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">Welcome to SymboFlow</h3>
        <p>No activity yet. Start by posting an update.</p>
      </div>
    );
  }

  const displayFeed = focusedPostId ? feed.filter(item => item.Id === focusedPostId || (item.replies && item.replies.some(r => r.Id === focusedPostId))) : feed;

  return (
    <div className="flex flex-col pb-20">
      {focusedPostId && (
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <button 
            onClick={onClearFocus}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">Focused Conversation</span>
        </div>
      )}
      
      {displayFeed.length === 0 && focusedPostId && (
         <div className="p-8 text-center text-zinc-500">Post not found.</div>
      )}

      {displayFeed.map(item => (
        <FeedItem key={item.Id} item={item} />
      ))}
    </div>
  );
}
