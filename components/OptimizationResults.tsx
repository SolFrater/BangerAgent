
import React from 'react';
import { OptimizationResult } from '../types';
import AnalysisCard from './AnalysisCard';
import TweetCard from './TweetCard';
import ReplyTargetsCard from './ReplyTargetsCard';

interface OptimizationResultsProps {
  result: OptimizationResult;
  defaultView?: 'tweet' | 'bullets';
  onGenerateImage: (prompt: string) => void;
  generatingImage: boolean;
  generatedImage: string | null;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({ 
  result, 
  defaultView, 
  onGenerateImage,
  generatingImage,
  generatedImage 
}) => {
  const recommendedTweet = result.optimizedVersions.find(v => 
    v.label.includes(result.recommended.versionLabel) || result.recommended.versionLabel.includes(v.label)
  )?.tweet || result.optimizedVersions[0].tweet;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Input Metadata</h3>
        <p className="text-zinc-300 italic font-medium leading-relaxed">{result.original}</p>
      </div>

      <AnalysisCard analysis={result.analysis} />

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Variations Engine
        </h3>
        <div className="grid grid-cols-1 gap-8">
          {result.optimizedVersions.map((v, idx) => (
            <TweetCard 
              key={idx}
              label={v.label}
              tweet={v.tweet}
              bulletPoints={v.bulletPoints}
              whyItWorks={v.whyItWorks}
              defaultView={defaultView}
              isRecommended={v.label.includes(result.recommended.versionLabel) || result.recommended.versionLabel.includes(v.label)}
            />
          ))}
        </div>
      </div>

      <ReplyTargetsCard targets={result.replyTargets} />

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-12">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
          Distribution Protocol
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10 h-fit text-blue-400 border border-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Temporal Window</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{result.postingStrategy.timeFraming}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-purple-500/10 h-fit text-purple-400 border border-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Network Expansion</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{result.postingStrategy.threadPotential}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 h-fit text-indigo-400 border border-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Visual Asset Hook</h4>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">{result.postingStrategy.mediaRecommendation}</p>
                <button 
                  onClick={() => onGenerateImage(recommendedTweet)}
                  disabled={generatingImage}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {generatingImage ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Forging...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                      Generate AI Asset
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-green-500/10 h-fit text-green-400 border border-green-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Retainment Loop</h4>
                {/* Fixed the incorrect property access: followUpPlays is correctly nested under postingStrategy */}
                <p className="text-sm text-zinc-300 leading-relaxed">{result.postingStrategy.followUpPlays}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Image Section */}
        {generatedImage && (
          <div className="pt-10 border-t border-white/5 animate-in zoom-in-95 duration-700">
            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 text-center">Engineered Visual Asset</h4>
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-video">
                <img src={generatedImage} alt="AI Generated Asset" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-6 right-6 flex gap-2">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = 'nichelens-asset.png';
                      link.click();
                    }}
                    className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl border border-white/10 transition-all"
                    title="Download Asset"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center mt-6 text-[11px] text-zinc-500 font-medium italic">High-impact media significantly increases scroll-stop probability (P_stop).</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationResults;
