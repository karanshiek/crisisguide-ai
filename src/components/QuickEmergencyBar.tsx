import React from 'react';

interface QuickEmergencyBarProps {
  onSelectEmergency: (id: string, name: string) => void;
  compact?: boolean;
}

export const EMERGENCY_BUTTONS = [
  { id: 'sos', label: 'EMERGENCY HELP', icon: '🚨', bg: 'bg-red-600 hover:bg-red-700 text-white border-red-500' },
  { id: 'fire', label: 'FIRE', icon: '🔥', bg: 'bg-orange-600 hover:bg-orange-700 text-white border-orange-500' },
  { id: 'flood', label: 'FLOOD', icon: '🌊', bg: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' },
  { id: 'earthquake', label: 'EARTHQUAKE', icon: '🌍', bg: 'bg-amber-700 hover:bg-amber-800 text-white border-amber-600' },
  { id: 'cyclone', label: 'CYCLONE', icon: '🌀', bg: 'bg-teal-700 hover:bg-teal-800 text-white border-teal-600' },
  { id: 'landslide', label: 'LANDSLIDE', icon: '⛰️', bg: 'bg-stone-700 hover:bg-stone-800 text-white border-stone-600' },
  { id: 'lightning', label: 'LIGHTNING', icon: '⚡', bg: 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500' },
  { id: 'chemical', label: 'CHEMICAL HAZARD', icon: '☣️', bg: 'bg-purple-700 hover:bg-purple-800 text-white border-purple-600' },
  { id: 'medical', label: 'MEDICAL EMERGENCY', icon: '🏥', bg: 'bg-rose-700 hover:bg-rose-800 text-white border-rose-600' },
  { id: 'roadAccident', label: 'ROAD ACCIDENT', icon: '🚗', bg: 'bg-zinc-800 hover:bg-zinc-900 text-white border-zinc-700' },
  { id: 'drowning', label: 'DROWNING', icon: '🌊', bg: 'bg-sky-700 hover:bg-sky-800 text-white border-sky-600' },
  { id: 'sos', label: 'GENERAL SOS', icon: '🆘', bg: 'bg-red-700 hover:bg-red-800 text-white border-red-600' }
];

export const QuickEmergencyBar: React.FC<QuickEmergencyBarProps> = ({ onSelectEmergency, compact = false }) => {
  if (compact) {
    return (
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max px-1">
          {EMERGENCY_BUTTONS.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => onSelectEmergency(item.id, item.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95 border ${item.bg}`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="whitespace-nowrap tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
          Quick Emergency Response Triage
        </h3>
        <span className="text-[11px] text-zinc-500">Tap for instant verified safety protocol</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {EMERGENCY_BUTTONS.map((item, idx) => (
          <button
            key={`${item.id}-${idx}`}
            onClick={() => onSelectEmergency(item.id, item.label)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-extrabold text-xs sm:text-xs tracking-wider shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-left border ${item.bg}`}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <span className="truncate leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
