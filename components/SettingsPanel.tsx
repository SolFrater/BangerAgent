import React, { useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isSupabaseConfigured: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, isSupabaseConfigured }) => {
  const [preferredModel] = useState('claude-3-5-sonnet');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Settings</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* AI Model Selection */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400 block mb-3">
              AI Model
            </label>
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm font-bold text-white">{preferredModel}</p>
              <p className="text-xs text-zinc-500 mt-1">Claude 3.5 Sonnet provides optimal balance of speed & quality</p>
            </div>
          </div>

          {/* API Status */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400 block mb-3">
              API Status
            </label>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-400">Claude API</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className={`p-4 ${isSupabaseConfigured ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-zinc-500/5 border border-zinc-500/20'} rounded-lg flex items-center justify-between`}>
                <span className={`text-sm font-bold ${isSupabaseConfigured ? 'text-blue-400' : 'text-zinc-500'}`}>
                  Supabase
                </span>
                <div className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-blue-500' : 'bg-zinc-600'} ${isSupabaseConfigured ? 'animate-pulse' : ''}`} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400 block mb-3">
              Preferences
            </label>
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm font-bold text-white">Email Notifications</span>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative w-12 h-7 rounded-full transition-colors ${notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          {/* Version Info */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">
              System Info
            </p>
            <div className="space-y-2 text-[10px] text-zinc-600">
              <div className="flex justify-between">
                <span>App Version</span>
                <span className="text-zinc-400">4.2.0</span>
              </div>
              <div className="flex justify-between">
                <span>Mode</span>
                <span className="text-zinc-400">{isSupabaseConfigured ? 'Cloud Sync' : 'Local Sandbox'}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage</span>
                <span className="text-zinc-400">{isSupabaseConfigured ? 'PostgreSQL' : 'LocalStorage'}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3.5 px-6 bg-white text-black rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-zinc-200 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
