
import React from 'react';
import { NicheAnalysisResult } from '../types';

interface NicheAnalysisResultsProps {
  result: NicheAnalysisResult;
  onArchitectContent?: (niche: string) => void;
}

const NicheAnalysisResults: React.FC<NicheAnalysisResultsProps> = ({ result, onArchitectContent }) => {
  // Logic for radial gauge
  const scoreColor = result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sticky Header Overlay (Appears on scroll) */}
      <div className="sticky top-16 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 mx-[-1.5rem] px-10 py-4 flex justify-between items-center hidden md:flex animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <h3 className="font-black text-white uppercase text-sm">{result.niche}</h3>
          <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-white/5 font-bold uppercase tracking-widest">{result.score}% Consistency</span>
        </div>
        {onArchitectContent && (
          <button 
            onClick={() => onArchitectContent(result.niche)}
            className="py-2 px-4 bg-white text-black rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
          >
            Forge Pillars
          </button>
        )}
      </div>

      {/* Main Header & Overview */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1d9bf0]/5 rounded-full blur-[80px]" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4 flex-1">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter tracking-tight">{result.niche}</h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-2xl">{result.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {result.voice.map((tag, i) => (
                <span key={i} className="px-4 py-1.5 bg-zinc-900 border border-white/5 rounded-full text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-6 shrink-0">
            {/* Radial Consistency Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 377} 377`}
                  transform="rotate(-90 70 70)"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{result.score}%</span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Consistency</span>
              </div>
            </div>

            {onArchitectContent && (
              <button 
                onClick={() => onArchitectContent(result.niche)}
                className="w-full py-3 px-6 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                Architect Pillars
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Pillars */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1d9bf0]/10 text-[#1d9bf0] rounded-lg flex items-center justify-center font-bold">1</div>
          Category Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.pillars.map((pillar, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl space-y-4 hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform">{pillar.icon}</span>
                <h4 className="text-lg font-black text-white uppercase tracking-tight">{pillar.text}</h4>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{pillar.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Niche Opportunities */}
      <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-10 space-y-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center font-bold">2</div>
          Expansion Horizons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {result.crossNiche.map((cross, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <h4 className="text-zinc-200 font-black uppercase text-sm">{cross.name}</h4>
                <span className="text-xs font-black text-purple-400">{cross.percentage}% OVERLAP</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${cross.percentage}%` }} />
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed italic">&ldquo;{cross.opportunity}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Hooks */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold">3</div>
          The Hook Blueprint (Pillars)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.hooks.map((hook, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-white/10 transition-all group">
              <div className="md:w-1/3 space-y-2">
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[9px] font-black uppercase tracking-widest">
                  {hook.category}
                </span>
                <p className="text-zinc-200 font-bold text-sm group-hover:text-white transition-colors">&ldquo;{hook.text}&rdquo;</p>
              </div>
              <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
                <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Methodology</h5>
                <p className="text-zinc-400 text-sm leading-relaxed">{hook.teaching}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Network & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center font-bold">4</div>
            Benchmark Network
          </h3>
          <div className="space-y-4">
            {result.creators.map((c, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-black text-xs text-zinc-500">@{c.handle[1]}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{c.handle}</span>
                    <span className="text-[10px] text-zinc-600 font-bold">{c.followers}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">{c.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center font-bold">5</div>
            Engagement Hijacking
          </h3>
          <div className="space-y-4">
            {result.engagementTargets.map((et, i) => (
              <div key={i} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-white">{et.handle}</span>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{et.postType}</span>
                </div>
                <ul className="space-y-2">
                  {et.advice.map((tip, j) => (
                    <li key={j} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-blue-500 font-black">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicheAnalysisResults;
