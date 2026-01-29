
import React from 'react';
import { IdeaGenerationResult } from '../types';

interface IdeaGenerationResultsProps {
  result: IdeaGenerationResult;
}

const IdeaGenerationResults: React.FC<IdeaGenerationResultsProps> = ({ result }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]" />
        <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Content Blueprint</h2>
        <h3 className="text-3xl font-black text-white uppercase tracking-tight">{result.topic}</h3>
      </div>

      {/* Blog / Article Outline */}
      <div className="space-y-8">
        <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center font-bold">A</div>
          Deep Dive Architecture
        </h4>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 space-y-10">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Headline Alpha</h5>
            <p className="text-2xl font-black text-white tracking-tight leading-tight">{result.articleOutline.title}</p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-2">Magnetic Intro Hook</span>
              <p className="text-zinc-300 italic">"{result.articleOutline.introHook}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {result.articleOutline.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h6 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <span className="text-zinc-600">{idx + 1}.</span> {section.heading}
                </h6>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, pIdx) => (
                    <li key={pIdx} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-blue-500">•</span> {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X Thread Structure */}
      <div className="space-y-8">
        <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center font-bold">B</div>
          Viral Thread Narrative
        </h4>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 space-y-8">
          <div className="p-6 bg-zinc-950 rounded-2xl border border-purple-500/20 shadow-inner group">
             <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-4">The Pattern Interrupt (Tweet 1)</span>
             <p className="text-lg font-bold text-zinc-100 leading-relaxed">
               {result.threadStructure.hook}
             </p>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Thread Sequencing</h5>
            <div className="space-y-4">
              {result.threadStructure.tweets.map((tweet, idx) => (
                <div key={idx} className="flex gap-4 p-4 hover:bg-white/[0.02] transition-colors rounded-xl border border-transparent hover:border-white/5">
                  <span className="text-[10px] font-black text-zinc-700 mt-1">{idx + 2}/</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{tweet}</p>
                </div>
              ))}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Conversion CTA</span>
                 <p className="text-sm text-zinc-200 font-bold">{result.threadStructure.cta}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Poll Ideas */}
      <div className="space-y-8">
        <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center font-bold">C</div>
          Engagement Polls
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.pollIdeas.map((poll, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6 group hover:border-white/10 transition-all">
              <div className="space-y-4">
                <p className="text-sm font-bold text-white leading-snug">"{poll.question}"</p>
                <div className="space-y-2">
                  {poll.options.map((option, oIdx) => (
                    <div key={oIdx} className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[11px] text-zinc-400 font-medium">
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Engage Logic</span>
                <p className="text-[10px] text-zinc-500 italic leading-relaxed">{poll.strategy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaGenerationResults;
