
import React from 'react';
import { ReplyResult } from '../types';
import TweetCard from './TweetCard';

interface ReplyResultsProps {
  result: ReplyResult;
  defaultView?: 'tweet' | 'bullets';
}

const ReplyResults: React.FC<ReplyResultsProps> = ({ result, defaultView }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-inner">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Context Node</h3>
        <p className="text-zinc-400 italic font-medium leading-relaxed">{result.sourceTweet}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Target Intent</h4>
          <p className="text-sm text-zinc-300 leading-relaxed">{result.analysis.intent}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Hook Surface</h4>
          <p className="text-sm text-zinc-300 leading-relaxed">{result.analysis.hookOpportunity}</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
          <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
             Weaponization Risk
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed">{result.analysis.socialRisk}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Optimized Feedback
        </h3>
        <div className="grid grid-cols-1 gap-8">
          {result.variations.map((v, idx) => (
            <TweetCard 
              key={idx}
              label={v.label}
              tweet={v.reply}
              bulletPoints={v.bulletPoints}
              whyItWorks={v.strategy}
              defaultView={defaultView}
            />
          ))}
        </div>
      </div>

      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center shadow-lg">
        <p className="text-[11px] text-zinc-500 italic tracking-wide">
          Social Note: High-cost actions (profile clicks) are prioritized over raw impressions. Engage naturally.
        </p>
      </div>
    </div>
  );
};

export default ReplyResults;
