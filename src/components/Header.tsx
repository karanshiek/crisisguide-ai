import React from 'react';
import { 
  AlertTriangle, 
  Shield, 
  MessageSquare, 
  LayoutDashboard, 
  BookOpen, 
  HeartPulse, 
  PhoneCall, 
  Users, 
  Globe, 
  Sun, 
  Moon, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ShieldAlert,
  Settings
} from 'lucide-react';
import { AppTheme, Language } from '../types';

interface HeaderProps {
  activeTab: 'chat' | 'dashboard' | 'guides' | 'firstaid' | 'contacts' | 'family';
  setActiveTab: (tab: 'chat' | 'dashboard' | 'guides' | 'firstaid' | 'contacts' | 'family') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  isEmergencyActive: boolean;
  onTriggerSOS: () => void;
  isVoiceMuted: boolean;
  setIsVoiceMuted: (muted: boolean) => void;
  onOpenAccessibility: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  theme,
  setTheme,
  isEmergencyActive,
  onTriggerSOS,
  isVoiceMuted,
  setIsVoiceMuted,
  onOpenAccessibility,
  onOpenAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b transition-colors bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-800 backdrop-blur-md shadow-xs">
      {/* Emergency Mode Top Warning Banner if Emergency is active */}
      {isEmergencyActive && (
        <div className="bg-red-600 text-white px-4 py-1.5 text-xs sm:text-sm font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <Flame className="w-4 h-4 shrink-0" />
            <span className="truncate">
              EMERGENCY MODE ACTIVE: Follow immediate safety steps. If lives are in immediate danger, dial 112 / 911 immediately.
            </span>
          </div>
          <button 
            onClick={onTriggerSOS}
            className="bg-white text-red-700 hover:bg-red-50 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider shrink-0 ml-2"
          >
            Trigger SOS
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => setActiveTab('chat')}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm transition-transform hover:scale-105 ${
            isEmergencyActive 
              ? 'bg-red-600 text-white animate-emergency-pulse' 
              : 'bg-emerald-700 text-white'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                Aegis AI
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Disaster Ops
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-none">
              Emergency Guidance & Safety Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Chat
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'guides'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Disaster Guides
          </button>

          <button
            onClick={() => setActiveTab('firstaid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'firstaid'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            First Aid
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contacts'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
            Contacts
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'family'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            Family Plan
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector */}
          <div className="relative flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 ml-2 text-zinc-500 hidden sm:inline" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-medium text-zinc-800 dark:text-zinc-200 py-1 pl-1 pr-2 sm:px-2 rounded focus:outline-hidden cursor-pointer"
              title="Select AI response language"
            >
              <option value="en" className="dark:bg-zinc-800">English</option>
              <option value="hi" className="dark:bg-zinc-800">हिन्दी (Hindi)</option>
              <option value="hinglish" className="dark:bg-zinc-800">Hinglish</option>
            </select>
          </div>

          {/* Voice Mute Toggle */}
          <button
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={isVoiceMuted ? 'Speech muted. Click to enable TTS' : 'Speech enabled. Click to mute'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          </button>

          {/* Theme switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-white text-amber-500 shadow-xs' : 'text-zinc-500'}`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-zinc-700 text-indigo-400 shadow-xs' : 'text-zinc-500'}`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('emergency-high-vis')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'emergency-high-vis' ? 'bg-red-600 text-white shadow-xs' : 'text-zinc-500'}`}
              title="Emergency High-Visibility Red Theme"
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenAccessibility}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Accessibility Options (High Contrast, Large Text)"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Admin Dashboard */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors hidden sm:inline-flex"
            title="System Telemetry & Administration"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* SOS Primary Button */}
          <button
            onClick={onTriggerSOS}
            className="bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 animate-emergency-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-200 dark:border-zinc-800 py-1.5 bg-zinc-50 dark:bg-zinc-900">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded ${
            activeTab === 'chat' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded ${
            activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded ${
            activeTab === 'guides' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Guides
        </button>
        <button
          onClick={() => setActiveTab('firstaid')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded ${
            activeTab === 'firstaid' ? 'text-rose-600' : 'text-zinc-500'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          First Aid
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded ${
            activeTab === 'contacts' ? 'text-blue-600' : 'text-zinc-500'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          Contacts
        </button>
      </div>
    </header>
  );
};
