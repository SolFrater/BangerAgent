
import React from 'react';

const ProtocolSection: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  color: string; 
  benefit: string; 
  mechanics: string[]; 
  proTip: string;
}> = ({ title, icon, color, benefit, mechanics, proTip }) => (
  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 hover:border-white/10 transition-all group relative overflow-hidden">
    <div className={`absolute -top-24 -right-24 w-64 h-64 bg-${color}/5 rounded-full blur-[80px] group-hover:bg-${color}/10 transition-all duration-700`} />
    
    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
      <div className={`w-16 h-16 shrink-0 bg-${color}/10 text-${color} rounded-2xl flex items-center justify-center border border-${color}/20 shadow-lg`}>
        {icon}
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h3>
          <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full bg-${color}`}></span>
            Primary Benefit: <span className="text-zinc-100">{benefit}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Core Mechanics</h4>
            <ul className="space-y-3">
              {mechanics.map((m, i) => (
                <li key={i} className="text-xs text-zinc-500 flex gap-3 leading-relaxed">
                  <span className={`text-${color} font-black`}>[0{i+1}]</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Pro Protocol</h4>
            <p className="text-xs text-zinc-500 italic leading-relaxed">
              "{proTip}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HowToUse: React.FC = () => {
  return (
    <div className="space-y-20 animate-in fade-in duration-1000">
      {/* Documentation Header */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-[#ff6b00] uppercase tracking-[0.4em]">
          BangerAgent Manual v4.0
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase">The <span className="bg-gradient-to-r from-[#ff6b00] to-[#ff2d55] bg-clip-text text-transparent">BangerAgent</span> Protocol</h1>
        <p className="text-zinc-500 text-lg font-medium leading-relaxed">
          BangerAgent is not a "writing assistant." It is a <span className="text-white">distribution engine</span> designed to engineer outcomes within the fluid ranking systems of the X algorithm.
        </p>
      </div>

      {/* Deep Dive Sections */}
      <div className="space-y-8">
        <ProtocolSection 
          title="01 Map (Category Blueprint)"
          color="emerald-500"
          benefit="Niche Dominance & Peer Benchmarking"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-4-4"/></svg>}
          mechanics={[
            "Identifies your 4 core content pillars based on past performance.",
            "Calculates 'Cross-Niche' opportunities to expand your reach.",
            "Benchmarks your account against the 'Gold Standard' in your space.",
            "Maps out which accounts you should be 'Hijacking' for maximum growth."
          ]}
          proTip="Look for niches with >30% overlap. These are your easiest 'Expansion Zones' where you can gain followers without losing your core identity."
        />

        <ProtocolSection 
          title="02 Architect (Pillar Strategy)"
          color="amber-500"
          benefit="Multi-Platform Authority & Continuity"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 18V5a3 3 0 0 1 6 0v13"/><path d="M3 13a9 9 0 0 1 18 0"/><path d="M12 13V2"/></svg>}
          mechanics={[
            "Transforms a single topic into a full Article Outline.",
            "Sequences a 7-tweet viral thread with a high-conversion CTA.",
            "Designs 3 'Engagement Polls' to spike your algorithmic visibility.",
            "Ensures 'Information Density' across all content formats."
          ]}
          proTip="Start with the Ideate protocol on Monday. Build your pillars, then use Optimize to refine the daily posts that support those pillars."
        />

        <ProtocolSection 
          title="03 Forge (Post Optimization)"
          color="blue-500"
          benefit="Maximum Click-Through & Dwell Time"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
          mechanics={[
            "Applies 'Pattern Fracture' to strip away generic bot-like hooks.",
            "Creates a 'Cognitive Gap' in the first 7 words to stop the scroll.",
            "Formats text with deliberate white space to pull readers downward.",
            "Generates 3 distinct variations tailored for Hooks, Replies, or Identity."
          ]}
          proTip="Use Version 3 (Identity) for long-term brand building. It signals authority and makes your content highly repost-worthy for peers."
        />

        <ProtocolSection 
          title="04 Audit (Health Pulse)"
          color="white"
          benefit="Shadow-Signal Detection & Recovery"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m4.93 19.07 14.14-14.14"/></svg>}
          mechanics={[
            "Scans your last 5 tweets for 'Shadow Signals' (bot patterns).",
            "Identifies 'Hook Degradation' where your style has become predictable.",
            "Provides a 4-step recovery roadmap to boost your account's trust score.",
            "Analyzes the 'Social Risk' of your current content mix."
          ]}
          proTip="If your impressions are down 50%+, run an Audit immediately. You've likely triggered a 'low-effort' signal that needs a hook purge."
        />
      </div>

      {/* Tactical Summary */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 md:p-16 space-y-12">
        <h3 className="text-3xl font-black text-white text-center uppercase tracking-tight">The 30-Day Growth Loop</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Map', desc: 'Identify your pillars using Niche Map.' },
            { label: 'Architect', desc: 'Use Ideate to build your 30-day pipeline.' },
            { label: 'Forge', desc: 'Optimize every post to force scroll-stops.' },
            { label: 'Audit', desc: 'Check health weekly to prevent throttling.' }
          ].map((step, i) => (
            <div key={i} className="space-y-4 text-center">
              <div className="text-zinc-700 font-black text-5xl mb-2">0{i+1}</div>
              <h4 className="text-white font-black uppercase text-sm">{step.label}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Footer */}
      <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl text-center space-y-4">
        <div className="text-red-500 mx-auto w-12 h-12 flex items-center justify-center bg-red-500/10 rounded-xl mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h4 className="text-zinc-100 font-black uppercase text-sm tracking-[0.2em]">Final Intelligence Note</h4>
        <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
          The algorithm prioritizes <span className="text-white font-bold italic">Costly Actions</span> (Profile Clicks, Bookmarks) over <span className="text-white font-bold italic">Cheap Actions</span> (Likes). Use BangerAgent to engineer the cost, and the reach will follow.
        </p>
      </div>
    </div>
  );
};

export default HowToUse;
