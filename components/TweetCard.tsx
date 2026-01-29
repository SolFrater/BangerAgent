
import React, { useState, useEffect } from 'react';

interface TweetCardProps {
  label: string;
  tweet: string;
  bulletPoints: string[];
  whyItWorks: string;
  isRecommended?: boolean;
  defaultView?: 'tweet' | 'bullets';
}

const TweetCard: React.FC<TweetCardProps> = ({ 
  label, 
  tweet, 
  bulletPoints, 
  whyItWorks, 
  isRecommended,
  defaultView = 'tweet'
}) => {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'tweet' | 'bullets'>(defaultView);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = view === 'tweet' ? tweet : bulletPoints.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleView = (e: React.MouseEvent, newView: 'tweet' | 'bullets') => {
    e.stopPropagation();
    setView(newView);
  };

  // NicheLens dynamic branding colors based on labels
  const getThemeColor = () => {
    const l = label.toLowerCase();
    if (l.includes('hook') || l.includes('optimize')) return { base: 'blue-500', hex: '#1d9bf0', shadow: 'rgba(29, 155, 240, 0.15)' };
    if (l.includes('reply') || l.includes('maximizing')) return { base: 'purple-500', hex: '#a855f7', shadow: 'rgba(168, 85, 247, 0.15)' };
    if (l.includes('identity') || l.includes('alpha')) return { base: 'emerald-500', hex: '#10b981', shadow: 'rgba(16, 185, 129, 0.15)' };
    return { base: 'zinc-400', hex: '#a1a1aa', shadow: 'rgba(255, 255, 255, 0.05)' };
  };

  const theme = getThemeColor();

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`relative group bg-[#0a0a0a] border ${
        isRecommended ? 'border-white/20 ring-1 ring-white/5' : 'border-white/5'
      } rounded-[2rem] p-8 transition-all duration-500 hover:border-${theme.base}/30 shadow-2xl overflow-hidden cursor-pointer selection:bg-white/10`}
      style={{
        boxShadow: isRecommended ? `0 20px 50px -12px ${theme.shadow}` : 'none'
      }}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 bg-${theme.base}/5 rounded-full blur-[80px] group-hover:bg-${theme.base}/10 transition-colors duration-700`} />
      
      {isRecommended && (
        <span className="absolute -top-3 left-10 bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_4px_15px_rgba(255,255,255,0.2)] z-10">
          Gold Standard
        </span>
      )}
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full bg-${theme.base} shadow-[0_0_8px_${theme.hex}] animate-pulse`} />
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest">{label}</h4>
          </div>
          
          <div className="flex gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-white/5 w-fit shadow-inner">
            <button 
              onClick={(e) => handleToggleView(e, 'tweet')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                view === 'tweet' 
                  ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]' 
                  : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              Post
            </button>
            <button 
              onClick={(e) => handleToggleView(e, 'bullets')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                view === 'bullets' 
                  ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]' 
                  : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              Skeleton
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg text-zinc-600 transition-all duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <button 
            onClick={handleCopy}
            className={`relative p-4 rounded-2xl bg-zinc-950 border transition-all duration-300 group/btn ${
              copied ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 hover:border-white/20'
            }`}
            title="Extract data"
          >
            <div className="relative">
              <div className={`transition-all duration-500 ${copied ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover/btn:text-white transition-colors">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              </div>
              <div className={`absolute inset-0 transition-all duration-500 ${copied ? 'scale-110 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
            </div>
            {copied && (
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-emerald-500 tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-top-2">
                Synced to Clip
              </span>
            )}
          </button>
        </div>
      </div>

      <div className={`relative bg-black/40 backdrop-blur-sm rounded-3xl p-8 mb-4 border border-white/5 transition-all duration-500 ${
        view === 'tweet' ? 'min-h-[160px]' : 'min-h-[200px]'
      }`}>
        {/* Visual Decoration */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-${theme.base} to-transparent opacity-20`} />
        
        {view === 'tweet' ? (
          <p className="font-medium text-lg sm:text-xl leading-[1.6] tracking-tight text-zinc-100 whitespace-pre-wrap">
            {tweet}
          </p>
        ) : (
          <ul className="space-y-6">
            {bulletPoints.map((point, i) => (
              <li key={i} className="flex gap-5 text-[15px] text-zinc-400 leading-relaxed group/li">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${theme.base} opacity-40 group-hover/li:opacity-100 transition-opacity`} />
                <span className="font-medium group-hover/li:text-zinc-200 transition-colors">{point}</span>
              </li>
            ))}
          </ul>
        )}

        {!isExpanded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Click for Protocol Strategy</span>
          </div>
        )}
      </div>

      {/* Expandable Strategy Section */}
      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="flex items-center gap-5 bg-white/[0.02] hover:bg-white/[0.05] rounded-[1.25rem] p-5 border border-white/5 transition-all duration-300 relative z-10 overflow-hidden group/strat mt-4">
            <div className={`p-2.5 rounded-xl bg-${theme.base}/10 text-${theme.base} border border-${theme.base}/20 transition-transform duration-500 group-hover/strat:scale-110`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v8"/><path d="m4.93 4.93 5.66 5.66"/><path d="M2 12h8"/><path d="m4.93 19.07 5.66-5.66"/><path d="M12 22v-8"/><path d="m19.07 19.07-5.66-5.66"/><path d="M22 12h-8"/><path d="m19.07 4.93-5.66 5.66"/>
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-white uppercase tracking-widest block opacity-60 group-hover/strat:opacity-100 transition-opacity">Protocol Strategy</span>
              <p className="text-[12px] text-zinc-500 leading-relaxed font-medium group-hover/strat:text-zinc-400 transition-colors">
                {whyItWorks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
