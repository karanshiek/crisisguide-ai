import React, { useState } from 'react';
import { DISASTER_GUIDES } from '../data/emergencyKnowledge';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Home, 
  Trees, 
  Car, 
  PhoneCall, 
  ShieldAlert, 
  Search 
} from 'lucide-react';

interface DisasterGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDisasterId?: string;
  onAskAIAboutDisaster: (disasterName: string) => void;
}

export const DisasterGuidesModal: React.FC<DisasterGuidesModalProps> = ({
  isOpen,
  onClose,
  initialDisasterId = 'fire',
  onAskAIAboutDisaster
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialDisasterId);
  const [searchQuery, setSearchQuery] = useState('');
  const [subTab, setSubTab] = useState<'immediate' | 'indoor' | 'outdoor' | 'vehicle' | 'donots'>('immediate');

  if (!isOpen) return null;

  const guidesList = Object.values(DISASTER_GUIDES).filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.hindiName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentGuide = DISASTER_GUIDES[selectedId] || DISASTER_GUIDES['fire'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center text-xl">
              {currentGuide.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Disaster Safety Intelligence Manual
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Offline Verified
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official NDMA, FEMA, and civil defense life-saving protocols
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar list of disasters */}
          <div className="w-full md:w-72 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search disasters / आपदा..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {guidesList.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => {
                    setSelectedId(guide.id);
                    setSubTab('immediate');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedId === guide.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{guide.icon}</span>
                    <div className="truncate">
                      <div className="truncate">{guide.name}</div>
                      <div className={`text-[10px] truncate ${selectedId === guide.id ? 'text-red-100' : 'text-zinc-400'}`}>
                        {guide.hindiName}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Guide Details */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900">
            
            {/* Guide Header & Tabs */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <span>{currentGuide.icon}</span>
                    {currentGuide.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{currentGuide.hindiName}</p>
                </div>
                <button
                  onClick={() => {
                    onAskAIAboutDisaster(currentGuide.name);
                    onClose();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Ask AI Follow-Up About This
                </button>
              </div>

              {/* Subtabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSubTab('immediate')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    subTab === 'immediate'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  🚨 Immediate Action
                </button>
                <button
                  onClick={() => setSubTab('donots')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    subTab === 'donots'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  ⚠️ What NOT to Do
                </button>
                <button
                  onClick={() => setSubTab('indoor')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    subTab === 'indoor'
                      ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  Indoor Guide
                </button>
                <button
                  onClick={() => setSubTab('outdoor')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    subTab === 'outdoor'
                      ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Trees className="w-3.5 h-3.5" />
                  Outdoor Guide
                </button>
                <button
                  onClick={() => setSubTab('vehicle')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    subTab === 'vehicle'
                      ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  Vehicle Guide
                </button>
              </div>
            </div>

            {/* Subtab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {subTab === 'immediate' && (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Immediate Life-Safety Steps (Do These Now)
                    </h4>
                    <ol className="space-y-2">
                      {currentGuide.immediateActions.map((action, i) => (
                        <li key={i} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                            {i + 1}
                          </span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Once You Are Physically Safe
                    </h4>
                    <ul className="space-y-2">
                      {currentGuide.ifYouAreSafe.map((item, i) => (
                        <li key={i} className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                          <span className="text-emerald-600 shrink-0 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <PhoneCall className="w-4 h-4" />
                      When to Contact Emergency Services
                    </h4>
                    <ul className="space-y-1.5">
                      {currentGuide.whenToGetHelp.map((item, i) => (
                        <li key={i} className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {subTab === 'donots' && (
                <div className="space-y-4">
                  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 mb-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Critical Prohibitions (Never Do These)
                    </h4>
                    <ul className="space-y-2.5">
                      {currentGuide.doNots.map((donot, i) => (
                        <li key={i} className="text-sm font-medium text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>{donot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {subTab === 'indoor' && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Indoor Safety Protocols
                  </h4>
                  <ul className="space-y-2">
                    {currentGuide.indoorGuidance.map((tip, i) => (
                      <li key={i} className="text-sm text-zinc-800 dark:text-zinc-200 flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {subTab === 'outdoor' && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                    <Trees className="w-4 h-4" />
                    Outdoor Safety Protocols
                  </h4>
                  <ul className="space-y-2">
                    {currentGuide.outdoorGuidance.map((tip, i) => (
                      <li key={i} className="text-sm text-zinc-800 dark:text-zinc-200 flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {subTab === 'vehicle' && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Vehicle & In-Transit Protocols
                  </h4>
                  <ul className="space-y-2">
                    {currentGuide.vehicleGuidance.map((tip, i) => (
                      <li key={i} className="text-sm text-zinc-800 dark:text-zinc-200 flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Status Footer */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs text-zinc-500 flex items-center justify-between">
              <span>Guidance status check: {currentGuide.statusCheckQuestion}</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">National Emergency: 112 / 108</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
