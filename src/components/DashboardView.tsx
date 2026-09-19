import React from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  HeartPulse, 
  Users, 
  Sparkles, 
  HelpCircle, 
  Camera, 
  PhoneCall, 
  ExternalLink, 
  Activity, 
  ChevronRight, 
  Bell, 
  Flame, 
  CheckCircle2, 
  PackageCheck,
  Compass
} from 'lucide-react';
import { RealtimeAlert, EmergencyKitItem, FamilyEmergencyPlan } from '../types';
import { QuickEmergencyBar } from './QuickEmergencyBar';
import { EmergencyKitTracker } from './EmergencyKitTracker';

interface DashboardViewProps {
  alerts: RealtimeAlert[];
  kitItems: EmergencyKitItem[];
  onToggleKitItem: (id: string) => void;
  onAddKitItem: (item: Omit<EmergencyKitItem, 'id'>) => void;
  onDeleteKitItem: (id: string) => void;
  familyPlan: FamilyEmergencyPlan;
  preparednessScore: number;
  onSelectEmergency: (id: string, name: string) => void;
  onOpenFirstAid: () => void;
  onOpenGuides: (disasterId?: string) => void;
  onOpenFamily: () => void;
  onOpenPlanGen: () => void;
  onOpenQuiz: () => void;
  onOpenHazardVision: () => void;
  onOpenSOS: () => void;
  onOpenContacts: () => void;
  userCoords: { lat: number; lng: number } | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  alerts,
  kitItems,
  onToggleKitItem,
  onAddKitItem,
  onDeleteKitItem,
  familyPlan,
  preparednessScore,
  onSelectEmergency,
  onOpenFirstAid,
  onOpenGuides,
  onOpenFamily,
  onOpenPlanGen,
  onOpenQuiz,
  onOpenHazardVision,
  onOpenSOS,
  onOpenContacts,
  userCoords
}) => {
  const packedItems = kitItems.filter(i => i.isPacked).length;
  const totalItems = kitItems.length;
  const kitPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  // Calculate composite preparedness score
  const computedScore = Math.round(
    (kitPercentage * 0.45) + 
    (familyPlan.primaryMeetingPoint ? 25 : 0) + 
    (preparednessScore * 0.3)
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Real-time Alerts Banner Section */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-red-600 animate-pulse" />
              Active Early Warnings & Official Bulletins
            </h3>
            <span className="text-[11px] text-zinc-500">{alerts.length} Active Feeds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all ${
                  alert.severity === 'CRITICAL' || alert.severity === 'EXTREME_EMERGENCY'
                    ? 'bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-900/60'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    alert.severity === 'CRITICAL' || alert.severity === 'EXTREME_EMERGENCY'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {alert.severity}: {alert.type}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Region: {alert.region}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{alert.title}</h4>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                  {alert.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 font-medium">Source: {alert.source}</span>
                  <span className="font-bold text-red-600 dark:text-red-400">Action: {alert.recommendedAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Emergency Action Buttons */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-3xl">
        <QuickEmergencyBar onSelectEmergency={onSelectEmergency} />
      </div>

      {/* Readiness & Essential Capabilities Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Readiness Index Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Preparedness Index
              </span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {computedScore >= 70 ? 'Resilient' : 'Action Required'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50">
                {computedScore}
              </span>
              <span className="text-sm text-zinc-400 font-bold">/ 100</span>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-emerald-500 h-full transition-all duration-700"
                style={{ width: `${computedScore}%` }}
              />
            </div>

            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Go-Bag Supplies ({kitPercentage}%)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{packedItems}/{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reunification Meeting Points</span>
                <span className="font-bold text-emerald-600">{familyPlan.primaryMeetingPoint ? 'Configured' : 'Missing'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Survival Instinct Quiz</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{preparednessScore}%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
            <button
              onClick={onOpenQuiz}
              className="flex-1 text-xs font-bold py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Take Quiz
            </button>
            <button
              onClick={onOpenPlanGen}
              className="flex-1 text-xs font-bold py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Plan Gen
            </button>
          </div>
        </div>

        {/* CPR & Urgent Medical Quick Widget */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-rose-600">
                <HeartPulse className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Urgent First-Aid
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Interactive</span>
            </div>

            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Cardiac & Acute Injury Guides
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Step-by-step guidance for severe hemorrhage, airway choking, burns, fractures, and audio-assisted CPR tempo.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs">
              <div className="font-bold text-rose-800 dark:text-rose-300">CPR Quick Metronome</div>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                Target tempo: 100–120 compressions/minute.
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
            <button
              onClick={onOpenFirstAid}
              className="w-full text-xs font-bold py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Activity className="w-3.5 h-3.5" /> Launch First-Aid Library
            </button>
          </div>
        </div>

        {/* Hazard Vision AI Inspection Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-orange-600">
                <Camera className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Hazard Vision AI
                </span>
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950 px-1.5 py-0.5 rounded">
                Gemini Vision
              </span>
            </div>

            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Structural & Environmental Triage
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Upload photos of cracked masonry, suspicious smoke, flood depths, or downed power lines for rapid safety perimeter assessment.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-xs">
              <div className="font-bold text-orange-800 dark:text-orange-300">Safe Distance Advisory</div>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                Maintain 100m distance from damaged structures and active wires.
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
            <button
              onClick={onOpenHazardVision}
              className="w-full text-xs font-bold py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" /> Inspect Scene Hazard
            </button>
          </div>
        </div>

      </div>

      {/* Emergency Go-Bag Checklist Component */}
      <EmergencyKitTracker
        items={kitItems}
        onToggleItem={onToggleKitItem}
        onAddItem={onAddKitItem}
        onDeleteItem={onDeleteKitItem}
      />

      {/* Nearby Emergency Facilities & Geo Assistance */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              Nearby Emergency Services Navigation
            </h4>
            <p className="text-xs text-zinc-500">
              Direct live mapping links to essential emergency infrastructure near your location
            </p>
          </div>
          {userCoords && (
            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              GPS: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Hospitals & Trauma', query: 'emergency hospital trauma center', icon: '🏥' },
            { label: 'Fire Stations', query: 'fire brigade fire station', icon: '🚒' },
            { label: 'Police Stations', query: 'police station police post', icon: '🚓' },
            { label: 'Relief Shelters', query: 'disaster relief shelter community hall', icon: '⛺' }
          ].map((facility, idx) => {
            const mapsUrl = userCoords 
              ? `https://www.google.com/maps/search/${encodeURIComponent(facility.query)}/@${userCoords.lat},${userCoords.lng},14z`
              : `https://www.google.com/maps/search/${encodeURIComponent(facility.query)}`;

            return (
              <a
                key={idx}
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 transition-all flex flex-col justify-between group"
              >
                <div className="text-2xl mb-1">{facility.icon}</div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                    {facility.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                    Find on Google Maps <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
};
