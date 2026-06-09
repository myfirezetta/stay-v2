import React from 'react';

const badgeColors = {
  project: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200',
  task: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
  ticket: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  system: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  user: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
  group: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  dept: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
  milestone: 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
  date: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
  unknown: 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200'
};

const symbolMap = {
  '#': 'project',
  '@': 'user',
  '*': 'milestone',
  '!': 'ticket',
  '&': 'system'
};

export function Badge({ symbol, value, raw }) {
  // Infer type from symbol or explicit prefix
  let type = 'unknown';
  if (symbol && symbolMap[symbol]) {
    type = symbolMap[symbol];
  }
  
  // Refine type based on prefix if any
  if (value.toLowerCase().startsWith('t:')) type = 'task';
  if (value.toLowerCase().startsWith('tk:')) type = 'ticket';
  if (value.toLowerCase().startsWith('p:')) type = 'project';
  if (value.toLowerCase().startsWith('sys:')) type = 'system';
  if (value.toLowerCase().startsWith('u:')) type = 'user';
  if (value.toLowerCase().startsWith('g:')) type = 'group';
  if (value.toLowerCase().startsWith('d:')) type = 'dept';
  if (value.toLowerCase().startsWith('m:')) type = 'milestone';
  
  const displayValue = value.replace(/^[a-z]+:/i, '');

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-sm font-mono font-medium transition-colors cursor-pointer mx-1 ${badgeColors[type] || badgeColors.unknown}`}
      title={`Type: ${type}`}
    >
      <span className="opacity-60 mr-0.5 select-none">{symbol}</span>
      {displayValue}
    </span>
  );
}
