import React, { useState, useEffect, useRef } from 'react';
import { FIRST_AID_TOPICS } from '../data/emergencyKnowledge';
import { 
  X, 
  HeartPulse, 
  AlertCircle, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  PhoneCall, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';

interface FirstAidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAIAboutFirstAid: (topicTitle: string) => void;
}

export const FirstAidModal: React.FC<FirstAidModalProps> = ({
  isOpen,
  onClose,
  onAskAIAboutFirstAid
}) => {
  const [selectedId, setSelectedId] = useState<string>('cpr');
  const [searchQuery, setSearchQuery] = useState('');
  
  // CPR Metronome state
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState<number>(110);
  const [beatToggle, setBeatToggle] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isMetronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      intervalRef.current = setInterval(() => {
        setBeatToggle((prev) => !prev);
        playBeep();
      }, intervalMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMetronomeActive, bpm]);

  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  if (!isOpen) return null;

  const topicsList = FIRST_AID_TOPICS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTopic = FIRST_AID_TOPICS.find(t => t.id === selectedId) || FIRST_AID_TOPICS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-xl">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                First-Aid & CPR Guidance Manual
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  Emergency Support
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Verified life-saving first-aid measures. Never replaces emergency physician care.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsMetronomeActive(false);
              onClose();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>Medical Disclaimer:</strong> This assistant provides emergency first-aid information only and does NOT replace medical diagnosis or emergency care. Call <strong>108 / 112</strong> immediately.
            </span>
          </div>
          <a
            href="tel:112"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1 rounded-lg shrink-0 ml-2 flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" />
            Dial 112
          </a>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Topic List */}
          <div className="w-full md:w-72 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search first-aid (bleeding, burns, CPR)..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {topicsList.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedId(topic.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedId === topic.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{topic.icon}</span>
                    <span className="truncate">{topic.title}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedId === topic.id
                      ? 'bg-rose-700 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}>
                    {topic.severity}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Topic Details */}
          <div className="flex-1 flex flex-col overflow-y-auto p-5 sm:p-6 bg-white dark:bg-zinc-900">
            
            {/* Topic Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5">
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <span>{currentTopic.icon}</span>
                  {currentTopic.title}
                </h3>
                <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                  Severity: {currentTopic.severity}
                </span>
              </div>
              <button
                onClick={() => {
                  onAskAIAboutFirstAid(currentTopic.title);
                  onClose();
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto"
              >
                <ShieldAlert className="w-4 h-4" />
                Ask AI Questions About This
              </button>
            </div>

            {/* Special CPR Interactive Rhythm Metronome Widget */}
            {currentTopic.id === 'cpr' && (
              <div className="mb-6 p-4 rounded-2xl bg-zinc-900 text-white border border-rose-500/50 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <Activity className="w-4 h-4 animate-pulse" />
                      CPR Compression Tempo Assistant (100–120 BPM)
                    </div>
                    <p className="text-xs text-zinc-300 mt-1">
                      Compress the chest to this rhythmic beat (approx 2 inches / 5 cm deep).
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Visual Beat Indicator */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-75 ${
                      beatToggle ? 'bg-rose-600 scale-110 shadow-lg shadow-rose-600/50' : 'bg-zinc-800 scale-95'
                    }`}>
                      <HeartPulse className="w-5 h-5 text-white" />
                    </div>

                    <button
                      onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                        isMetronomeActive
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      }`}
                    >
                      {isMetronomeActive ? (
                        <>
                          <Pause className="w-4 h-4" /> Stop Beat
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Start Audio Beat (110 BPM)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Action Steps:
              </h4>
              <ol className="space-y-3">
                {currentTopic.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* What NOT to do */}
            {currentTopic.doNots && currentTopic.doNots.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 mb-2">
                  ⚠️ Critical Warnings (What NOT To Do):
                </h4>
                <ul className="space-y-1.5">
                  {currentTopic.doNots.map((donot, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{donot}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
