
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ 
  history, 
  isOpen, 
  onClose, 
  onSelect, 
  onDelete, 
  onClear 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-400">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Archive
          </h2>
          <button onClick={onClose} className="p-2.5 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 px-10 grayscale">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-6"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              <p className="text-sm font-black uppercase tracking-widest">No local cache found</p>
              <p className="text-xs mt-2">Saved interactions will persist here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${
                    item.type === 'post' ? 'bg-[#1d9bf0]/10 text-[#1d9bf0] border-[#1d9bf0]/20' : 
                    item.type === 'reply' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 italic font-medium">
                  "{item.input}"
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="absolute -top-1 -right-1 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-75 shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6 border-t border-white/10">
            <button 
              onClick={onClear}
              className="w-full py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20 rounded-xl"
            >
              Wipe Archive
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
