
import React from 'react';
import { ReplyTarget } from '../types';

interface ReplyTargetsCardProps {
  targets: ReplyTarget[];
}

const ReplyTargetsCard: React.FC<ReplyTargetsCardProps> = ({ targets }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Small': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Mid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Big': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Strategic Reply Targets
        </h3>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Visibility Multipliers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targets.map((target, idx) => (
          <div key={idx} className="group p-4 rounded-xl bg-black border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-start justify-between mb-2">
              <a 
                href={`https://x.com/${target.handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="space-y-0.5 hover:opacity-80 transition-opacity"
              >
                <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                  {target.name}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 group-hover:text-blue-400 transition-colors"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </h4>
                <p className="text-xs text-zinc-500 font-mono">@{target.handle.replace('@', '')}</p>
              </a>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getCategoryColor(target.category)}`}>
                {target.category}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              &ldquo;{target.whyReply}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReplyTargetsCard;
