
import React, { useState, useCallback, useEffect } from 'react';
import { AppMode, OptimizationState, HistoryItem, UserState, OptimizationResult, ReplyResult, ProfileAuditResult, NicheAnalysisResult, IdeaGenerationResult } from './types';
import { analyzeContent, generateAsset } from './services/apiClient';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import OptimizationResults from './components/OptimizationResults';
import ReplyResults from './components/ReplyResults';
import ProfileAuditResults from './components/ProfileAuditResults';
import NicheAnalysisResults from './components/NicheAnalysisResults';
import IdeaGenerationResults from './components/IdeaGenerationResults';
import HistoryDrawer from './components/HistoryDrawer';
import HowToUse from './components/HowToUse';

const STORAGE_KEY = 'nichelens_history_v1';
const USER_KEY = 'nichelens_user_v1';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  // Fix: The local AppMode needs to handle the 'guide' UI state correctly.
  const [mode, setMode] = useState<AppMode | 'guide'>('guide');
  const [outputPreference, setOutputPreference] = useState<'tweet' | 'bullets'>('tweet');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [user, setUser] = useState<UserState>({ isLoggedIn: false });
  const [state, setState] = useState<OptimizationState>({
    loading: false,
    generatingImage: false,
    generatedImage: null,
    result: null,
    replyResult: null,
    auditResult: null,
    nicheResult: null,
    ideaResult: null,
    error: null,
  });

  // Load user session on mount (Cloud or Local)
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          handleUserSession(session.user);
        } else {
          loadLocalSession();
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          handleUserSession(session.user);
        } else {
          setUser({ isLoggedIn: false });
          setHistory([]);
        }
      });
      return () => subscription.unsubscribe();
    } else {
      loadLocalSession();
    }
  }, []);

  const loadLocalSession = () => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.isLoggedIn) setUser(parsedUser);
    }
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  };

  const handleUserSession = (supabaseUser: any) => {
    const userState: UserState = {
      isLoggedIn: true,
      id: supabaseUser.id,
      handle: supabaseUser.user_metadata?.user_name || supabaseUser.email?.split('@')[0],
      name: supabaseUser.user_metadata?.full_name || 'Niche Creator',
      profileImage: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${supabaseUser.id}`
    };
    setUser(userState);
    fetchHistory(supabaseUser.id);
  };

  const fetchHistory = async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (!error && data) {
      setHistory(data.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp).getTime()
      })));
    }
  };

  const handleLogin = async () => {
    setIsAuthenticating(true);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: { redirectTo: window.location.origin }
      });
      if (error) {
        setState(s => ({ ...s, error: 'OAuth handshake failed. Check Supabase config.' }));
      }
    } else {
      // Mock login for Sandbox Mode
      setTimeout(() => {
        const mockUser: UserState = {
          isLoggedIn: true,
          id: 'sandbox-user',
          handle: 'sandbox_alpha',
          name: 'Sandbox Creator',
          profileImage: 'https://api.dicebear.com/7.x/shapes/svg?seed=sandbox'
        };
        setUser(mockUser);
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        setIsAuthenticating(false);
      }, 1000);
      return;
    }
    setIsAuthenticating(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      setUser({ isLoggedIn: false });
      localStorage.removeItem(USER_KEY);
    }
  };

  const addToHistory = async (type: string, originalInput: string, result: any) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 15),
      type: type as any,
      input: originalInput,
      result,
      timestamp: Date.now()
    };

    if (isSupabaseConfigured && supabase && user.id) {
      const { data, error } = await supabase
        .from('history')
        .insert([{
          user_id: user.id,
          type,
          input: originalInput,
          result,
          timestamp: new Date().toISOString()
        }])
        .select();

      if (!error && data) {
        setHistory(prev => [{
          ...data[0],
          timestamp: new Date(data[0].timestamp).getTime()
        }, ...prev]);
      }
    } else {
      // Local Sandbox Storage
      const updatedHistory = [newItem, ...history].slice(0, 30);
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  };

  const handleAction = useCallback(async () => {
    if (mode === 'guide') return;
    if (!input.trim() && mode !== 'audit' && mode !== 'niche') return;

    setState(prev => ({ 
      ...prev,
      loading: true, 
      generatingImage: false,
      generatedImage: null,
      result: null,
      replyResult: null,
      auditResult: null,
      nicheResult: null,
      ideaResult: null,
      error: null 
    }));

    try {
      // Fix: Cast mode to AppMode for the API client call
      const result = await analyzeContent(mode as AppMode, input, user.handle);
      
      setState(prev => {
        const nextState = { ...prev, loading: false };
        if (mode === 'post') nextState.result = result as OptimizationResult;
        else if (mode === 'reply') nextState.replyResult = result as ReplyResult;
        else if (mode === 'audit') nextState.auditResult = result as ProfileAuditResult;
        else if (mode === 'niche') nextState.nicheResult = result as NicheAnalysisResult;
        else if (mode === 'ideate') nextState.ideaResult = result as IdeaGenerationResult;
        return nextState;
      });

      await addToHistory(mode, input, result);
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, [input, mode, user, history]);

  const handleGenerateImage = async (prompt: string) => {
    setState(prev => ({ ...prev, generatingImage: true, error: null }));
    try {
      const imageUrl = await generateAsset(prompt);
      setState(prev => ({ ...prev, generatingImage: false, generatedImage: imageUrl }));
    } catch (err: any) {
      setState(prev => ({ ...prev, generatingImage: false, error: err.message }));
    }
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setMode(item.type);
    setInput(item.input);
    setState({
      loading: false,
      generatingImage: false,
      generatedImage: null,
      result: item.type === 'post' ? item.result as any : null,
      replyResult: item.type === 'reply' ? item.result as any : null,
      auditResult: item.type === 'audit' ? item.result as any : null,
      nicheResult: item.type === 'niche' ? item.result as any : null,
      ideaResult: item.type === 'ideate' ? item.result as any : null,
      error: null
    });
    setIsHistoryOpen(false);
  };

  const architectFromNiche = (niche: string) => {
    setMode('ideate');
    setInput(`Pillar content strategy for: ${niche}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] selection:bg-[#1d9bf0]/20 selection:text-[#1d9bf0]">
      <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setMode('guide')}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-black fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">NicheLens</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsHistoryOpen(true)} className="p-2.5 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10" title={isSupabaseConfigured ? "Cloud Archive" : "Local Archive"}>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></svg>
                {user.isLoggedIn && <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-black animate-pulse ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-blue-500'}`} />}
              </div>
            </button>

            {user.isLoggedIn ? (
              <div className="flex items-center gap-3 pl-5 border-l border-white/10">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[11px] font-black text-white">{user.name}</span>
                  <span className="text-[9px] text-[#1d9bf0] font-bold uppercase tracking-widest">@{user.handle}</span>
                </div>
                <img src={user.profileImage} alt="Profile" className="w-9 h-9 rounded-full border border-white/20 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                <button onClick={handleLogout} className="p-2 text-zinc-600 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} disabled={isAuthenticating} className="flex items-center gap-2.5 px-6 py-2.5 bg-white text-black rounded-full text-[12px] font-black hover:bg-[#e4e4e7] transition-all disabled:opacity-70">
                {isAuthenticating ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : isSupabaseConfigured ? 'Authorize X' : 'Sandbox Mode'}
              </button>
            )}
          </div>
        </div>
      </nav>

      <HistoryDrawer 
        history={history} 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelect={selectHistoryItem} 
        onDelete={async (id) => {
          if (supabase) {
            await supabase.from('history').delete().eq('id', id);
          }
          const updatedHistory = history.filter(i => i.id !== id);
          setHistory(updatedHistory);
          if (!supabase) localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        }} 
        onClear={async () => {
          if (confirm('Clear archive?')) {
            if (supabase && user.id) {
              await supabase.from('history').delete().eq('user_id', user.id);
            }
            setHistory([]);
            if (!supabase) localStorage.removeItem(STORAGE_KEY);
          }
        }} 
      />

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <div className="flex flex-wrap justify-center gap-1.5 p-1.5 bg-[#0a0a0a] rounded-2xl border border-white/5 w-fit mx-auto shadow-2xl">
          <button onClick={() => setMode('guide')} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'guide' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>The Manual</button>
          <button onClick={() => setMode('niche')} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'niche' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>01 Map</button>
          <button onClick={() => setMode('ideate')} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'ideate' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>02 Architect</button>
          <button onClick={() => setMode('post')} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'post' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>03 Forge</button>
          <button onClick={() => setMode('audit')} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'audit' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>04 Audit</button>
          <button onClick={() => setMode('reply')} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${mode === 'reply' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Reply</button>
        </div>

        {(mode !== 'guide') && (
          <div className="relative group animate-in slide-in-from-bottom-2 duration-500">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'post' ? "Paste your thesis or raw angle..." : 
                mode === 'reply' ? "Drop target tweet..." :
                mode === 'ideate' ? "Define the topic..." :
                "Paste multiple tweets separated by '---' for full mapping..."
              }
              className="w-full h-44 bg-[#0a0a0a] border border-white/10 rounded-2xl p-7 text-lg text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none shadow-inner"
              disabled={state.loading}
            />
            <div className="absolute bottom-5 right-5 flex items-center gap-4">
              {!user.isLoggedIn && mode !== 'guide' && (
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest hidden sm:block">
                  {isSupabaseConfigured ? 'Login to Sync History' : 'LocalStorage Sandbox Mode'}
                </span>
              )}
              <button
                onClick={handleAction}
                disabled={state.loading || (!input.trim() && mode !== 'audit' && mode !== 'niche')}
                className={`flex items-center gap-2 px-7 py-3 rounded-full font-black text-[13px] uppercase tracking-wide transition-all shadow-xl ${state.loading ? 'bg-zinc-900 text-zinc-700' : 'bg-white text-black hover:bg-zinc-200 active:scale-95'}`}
              >
                {state.loading ? 'Syncing...' : 'Launch Protocol'}
              </button>
            </div>
          </div>
        )}

        {mode === 'guide' && <HowToUse />}

        <div className="min-h-[200px]">
          {state.loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-pulse">
              <div className="relative w-16 h-16 border-4 border-white/10 rounded-full border-t-white animate-spin"></div>
              <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.4em]">Syncing with {isSupabaseConfigured ? 'Cloud' : 'Fluid'} Hierarchy</p>
            </div>
          )}
          {state.error && (
            <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-center text-sm font-bold animate-in shake duration-500">
              {state.error}
            </div>
          )}
          {state.result && <OptimizationResults result={state.result} defaultView={outputPreference} onGenerateImage={handleGenerateImage} generatingImage={state.generatingImage} generatedImage={state.generatedImage} />}
          {state.replyResult && <ReplyResults result={state.replyResult} defaultView={outputPreference} />}
          {state.auditResult && <ProfileAuditResults result={state.auditResult} />}
          {state.nicheResult && <NicheAnalysisResults result={state.nicheResult} onArchitectContent={architectFromNiche} />}
          {state.ideaResult && <IdeaGenerationResults result={state.ideaResult} />}
        </div>
      </main>

      <footer className="border-t border-white/5 py-16 mt-20 opacity-30 text-center space-y-5">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">NicheLens Protocol v4.2.0-{isSupabaseConfigured ? 'CLOUD' : 'LOCAL'}</p>
        <div className="flex justify-center items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-blue-500'}`} />
           <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{isSupabaseConfigured ? 'Cloud Sync Online' : 'Local Sandbox Mode'}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
