
import React from 'react';

interface AnalysisCardProps {
  analysis: {
    drivers: string;
    friction: string;
    emotionalRegister: string;
    missingElements: string;
    socialRisk: string;
    costlyActionPotential: string;
  };
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 space-y-10 shadow-2xl animate-in slide-in-from-bottom-3 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
          <div className="p-2 bg-white/5 rounded-lg text-[#1d9bf0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          BangerAgent Intelligence
        </h3>
        <span className="text-[10px] bg-white text-black px-2.5 py-1 rounded-md font-black tracking-widest uppercase">Protocol v4.0.1</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">The Alpha Gap</h4>
          <p className="text-zinc-300 text-sm leading-relaxed font-medium">{analysis.drivers}</p>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Profile-Click Surface</h4>
          <p className="text-zinc-100 text-sm leading-relaxed border-l-2 border-[#1d9bf0] pl-4 font-bold">{analysis.costlyActionPotential}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Reading Velocity Friction</h4>
          <p className="text-zinc-400 text-sm leading-relaxed font-medium italic">"{analysis.friction}"</p>
        </div>
        
        <div className="space-y-3 p-5 bg-[#0e0a0a] border border-red-500/10 rounded-2xl group hover:border-red-500/20 transition-colors">
          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Shadow-Signal Protection
          </h4>
          <p className="text-zinc-300 text-sm leading-relaxed mt-1 font-medium">{analysis.socialRisk}</p>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-wrap gap-6">
        <div className="text-[9px] text-zinc-500 flex items-center gap-2 uppercase font-black tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1d9bf0] shadow-[0_0_8px_#1d9bf0]"></span>
          Pattern Fracture Active
        </div>
        <div className="text-[9px] text-zinc-500 flex items-center gap-2 uppercase font-black tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
          Cognitive Void Optimized
        </div>
        <div className="text-[9px] text-zinc-500 flex items-center gap-2 uppercase font-black tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          Blueprint Synchronized
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
