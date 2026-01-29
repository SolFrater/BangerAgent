
import React from 'react';
import { ProfileAuditResult } from '../types';

interface ProfileAuditResultsProps {
  result: ProfileAuditResult;
}

const ProfileAuditResults: React.FC<ProfileAuditResultsProps> = ({ result }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#18181b" strokeWidth="8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${result.overallScore * 2.83} 283`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{result.overallScore}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Score</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">Algorithm Health: @{result.handle}</h2>
          <p className="text-zinc-400">Based on your last 5 interactions. Your account is currently {result.overallScore > 70 ? 'thriving' : 'throttled'} in the fluid ranking cycle.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-sm text-zinc-300 flex gap-2">
                <span className="text-zinc-600">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            Weaknesses
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-zinc-300 flex gap-2">
                <span className="text-zinc-600">•</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
          Individual Post Breakdown
        </h3>
        <div className="space-y-6">
          {result.tweetAnalyses.map((ta, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 group hover:border-zinc-700 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Original Posting</span>
                <p className="text-sm text-zinc-400 italic">"{ta.original}"</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">The Critique</h4>
                <p className="text-sm text-zinc-200 leading-relaxed">{ta.critique}</p>
              </div>
              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Revised Viral Hook</h4>
                <p className="text-zinc-100 font-medium">"{ta.revisedHook}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 border border-blue-500/20 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="m9.05 9.05 4.24 4.24"/></svg>
          Improvement Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.improvementPlan.map((plan, i) => (
            <div key={i} className="flex gap-4 p-4 bg-black/40 rounded-xl border border-zinc-800">
              <span className="text-emerald-500 font-black text-lg">0{i+1}</span>
              <p className="text-sm text-zinc-300">{plan}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileAuditResults;
