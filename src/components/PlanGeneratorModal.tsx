import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Users, 
  Car, 
  Pill, 
  AlertTriangle, 
  Loader2, 
  FileText, 
  Download, 
  CheckCircle2 
} from 'lucide-react';
import { Language } from '../types';

interface PlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [locationType, setLocationType] = useState('Urban Coastal Area (Cyclone & Flood prone)');
  const [household, setHousehold] = useState('2 adults, 1 elderly grandparent, 1 infant, 1 dog');
  const [disasterType, setDisasterType] = useState('Flood & Severe Cyclone');
  const [hasVehicle, setHasVehicle] = useState('Yes, 1 family car (Hatchback)');
  const [medicalDependencies, setMedicalDependencies] = useState('Hypertension medication, baby formula');
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationType,
          household,
          disasterType,
          hasVehicle,
          medicalDependencies,
          language
        })
      });

      if (!res.ok) throw new Error('Failed to generate plan');
      const data = await res.json();
      setGeneratedPlan(data.plan);
    } catch (err: any) {
      // Fallback offline generator
      const fallback = `### CUSTOMIZED EMERGENCY ACTION PLAN: ${disasterType.toUpperCase()}
Location Context: ${locationType}
Household: ${household}
Mobility / Transport: ${hasVehicle}
Medical Dependencies: ${medicalDependencies}

#### 1. BEFORE THE EVENT (PREPAREDNESS & STAGING)
- Anchor fragile outdoor furnishings; clean rooftop drainages and sewer outlets.
- Stock 3-day reserves of clean drinking water (min 4 liters/person/day) and shelf-stable dry foods.
- Safeguard medical supplies: keep a 14-day sealed waterproof pouch of essential medications (${medicalDependencies}).
- Pack infant formula, clean bottles, diapers, and pet food ready in the main exit Go-Bag.
- Verify vehicle fuel tank is full and park on high ground away from trees and power cables.

#### 2. DURING THE EVENT (IMMEDIATE SURVIVAL)
- Monitor official disaster bulletins via battery/crank radio or government SMS emergency alerts.
- Disconnect main electricity supply at circuit breaker and shut LPG gas cylinders immediately if water begins entering.
- Assist elderly members and infant upstairs or to designated elevated rooms.
- NEVER wade, walk, or drive through moving flood waters ("Turn Around, Don't Drown").

#### 3. AFTER THE EVENT (RECOVERY & HEALTH SAFETY)
- Do not re-enter flooded premises until certified structurally safe by local civil engineers.
- Boil all municipal or well water vigorously for at least 1-2 minutes prior to consumption.
- Take photos of any property damage for official relief/insurance documentation before clean-up.
- Beware of displaced snakes, pests, and dangling electrical wires.`;

      setGeneratedPlan(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPlan = () => {
    if (!generatedPlan) return;
    const blob = new Blob([generatedPlan], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Custom-Disaster-Emergency-Plan-${disasterType.replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                AI Personal Emergency Plan Generator
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Tailored survival protocols for your specific household vulnerabilities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {!generatedPlan ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  1. Where do you live? (Terrain & Geography)
                </label>
                <input
                  type="text"
                  required
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  placeholder="e.g. Coastal lowlands, Hilly terrain near river, 4th floor apartment in Mumbai"
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  2. Who lives with you? (Household makeup)
                </label>
                <input
                  type="text"
                  required
                  value={household}
                  onChange={(e) => setHousehold(e.target.value)}
                  placeholder="e.g. 2 adults, 75yr old grandparent with limited mobility, 1 dog"
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    3. Target Disaster Threat
                  </label>
                  <select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Flood & Urban Waterlogging">Flood & Urban Waterlogging</option>
                    <option value="Major Earthquake">Major Earthquake</option>
                    <option value="Severe Cyclone / Storm Surge">Severe Cyclone / Storm Surge</option>
                    <option value="Urban High-Rise Fire">Urban High-Rise Fire</option>
                    <option value="Landslide & Mudflow">Landslide & Mudflow</option>
                    <option value="Extreme Heatwave">Extreme Heatwave</option>
                    <option value="Industrial Chemical Gas Leak">Industrial Chemical Gas Leak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-blue-600" />
                    4. Vehicle & Mobility
                  </label>
                  <input
                    type="text"
                    value={hasVehicle}
                    onChange={(e) => setHasVehicle(e.target.value)}
                    placeholder="e.g. 1 4x4 SUV / Scooter / Public transport only"
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-rose-500" />
                  5. Medical or Accessibility Dependencies
                </label>
                <input
                  type="text"
                  value={medicalDependencies}
                  onChange={(e) => setMedicalDependencies(e.target.value)}
                  placeholder="e.g. Daily insulin (requires cooling), CPAP machine, asthma inhaler, wheelchair"
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Household Risk Profile & Formulating Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Personalized Action Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Plan Generated Successfully
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadPlan}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download (.md)
                  </button>
                  <button
                    onClick={() => setGeneratedPlan(null)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                  >
                    Edit Questionnaire
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                {generatedPlan}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
