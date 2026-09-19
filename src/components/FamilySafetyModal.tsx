import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Plus, 
  Trash2, 
  Save, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Heart, 
  Dog, 
  Baby, 
  FileText, 
  Download 
} from 'lucide-react';
import { FamilyEmergencyPlan, FamilyMember } from '../types';

interface FamilySafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
  onUpdateMembers: (members: FamilyMember[]) => void;
  familyPlan: FamilyEmergencyPlan;
  onUpdatePlan: (plan: FamilyEmergencyPlan) => void;
}

export const FamilySafetyModal: React.FC<FamilySafetyModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  onUpdateMembers,
  familyPlan,
  onUpdatePlan
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'plan'>('members');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New member form
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');

  // Plan state
  const [primaryMeetingPoint, setPrimaryMeetingPoint] = useState(familyPlan.primaryMeetingPoint || 'Neighborhood Community Center / Main Park');
  const [secondaryMeetingPoint, setSecondaryMeetingPoint] = useState(familyPlan.secondaryMeetingPoint || 'District Red Cross Shelter / Grandma\'s residence');
  const [outOfAreaContact, setOutOfAreaContact] = useState(familyPlan.outOfAreaContact || 'Uncle Ramesh (Out of state)');
  const [outOfAreaContactPhone, setOutOfAreaContactPhone] = useState(familyPlan.outOfAreaContactPhone || '+91 9123456780');
  const [evacuationRouteNotes, setEvacuationRouteNotes] = useState(familyPlan.evacuationRouteNotes || 'Exit via east garden gate, proceed on foot away from low-lying river canal to High Ground Ridge Road.');
  const [petPlan, setPetPlan] = useState(familyPlan.petPlan || 'Keep Bruno\'s harness, 3-day dry food, and vaccination certificate by front Go-Bag.');
  const [childSafetyPlan, setChildSafetyPlan] = useState(familyPlan.childSafetyPlan || 'Teach children our emergency phone numbers. Instruct school authorities to only release children to parents or verified out-of-area guardian.');

  if (!isOpen) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: FamilyMember = {
      id: `fm-${Date.now()}`,
      name: name.trim(),
      relation: relation.trim() || 'Family Member',
      phone: phone.trim(),
      bloodGroup: bloodGroup.trim(),
      allergies: allergies.trim(),
      medications: medications.trim(),
      specialNeeds: specialNeeds.trim()
    };

    onUpdateMembers([...familyMembers, newMember]);
    setName('');
    setRelation('');
    setPhone('');
    setBloodGroup('');
    setAllergies('');
    setMedications('');
    setSpecialNeeds('');
  };

  const handleDeleteMember = (id: string) => {
    onUpdateMembers(familyMembers.filter(m => m.id !== id));
  };

  const handleSavePlan = () => {
    onUpdatePlan({
      primaryMeetingPoint,
      secondaryMeetingPoint,
      outOfAreaContact,
      outOfAreaContactPhone,
      evacuationRouteNotes,
      petPlan,
      childSafetyPlan,
      updatedAt: Date.now()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const exportPlanAsText = () => {
    const text = `================================================
FAMILY EMERGENCY & DISASTER SAFETY PLAN
Updated: ${new Date().toLocaleDateString()}
================================================

1. HOUSEHOLD MEMBERS:
${familyMembers.map((m, i) => `
#${i + 1} ${m.name} (${m.relation})
   Phone: ${m.phone || 'N/A'}
   Blood Group: ${m.bloodGroup || 'N/A'}
   Allergies: ${m.allergies || 'None recorded'}
   Medications: ${m.medications || 'None recorded'}
   Accessibility: ${m.specialNeeds || 'Standard'}
`).join('')}

2. EMERGENCY MEETING POINTS:
- Primary (Immediate neighborhood): ${primaryMeetingPoint}
- Secondary (Regional / Out of neighborhood): ${secondaryMeetingPoint}

3. OUT-OF-AREA COMMUNICATION CONTACT:
- Name: ${outOfAreaContact}
- Phone: ${outOfAreaContactPhone}
(Note: Texts usually succeed during disasters when local calls fail)

4. EVACUATION ROUTE:
${evacuationRouteNotes}

5. CHILD SAFETY PLAN:
${childSafetyPlan}

6. PET & ANIMAL SAFETY PLAN:
${petPlan}

================================================
Official Universal Emergency Helpline: 112
================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Family-Emergency-Safety-Plan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Family Safety Profile & Disaster Plan
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Encrypted & Local
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Meeting points, medical vitals, out-of-area contact, and reunification protocol
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

        {/* Tab switch */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('members')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'members'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              Household Members ({familyMembers.length})
            </button>
            <button
              onClick={() => setActiveSubTab('plan')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'plan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              Emergency Reunification & Evacuation Plan
            </button>
          </div>

          <button
            onClick={exportPlanAsText}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Plan (.txt)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {activeSubTab === 'members' && (
            <div className="space-y-6">
              {/* Add Member Form */}
              <form onSubmit={handleAddMember} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Add Household Member
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">Relation</label>
                    <input
                      type="text"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      placeholder="e.g. Daughter / Spouse"
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">Blood Group</label>
                    <input
                      type="text"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder="e.g. O+ / B+"
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">Allergies (Voluntary)</label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin / Peanuts"
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">Essential Meds</label>
                    <input
                      type="text"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      placeholder="e.g. Insulin / Inhaler"
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">Mobility / Special Needs</label>
                    <input
                      type="text"
                      value={specialNeeds}
                      onChange={(e) => setSpecialNeeds(e.target.value)}
                      placeholder="e.g. Wheelchair / Hearing"
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Family Member
                  </button>
                </div>
              </form>

              {/* Members List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Registered Members:
                </h4>
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{member.name}</span>
                        <span className="text-xs text-zinc-500 font-medium">({member.relation})</span>
                        {member.bloodGroup && (
                          <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full">
                            Blood: {member.bloodGroup}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        {member.phone && <span>📞 {member.phone}</span>}
                        {member.medications && <span>💊 Meds: {member.medications}</span>}
                        {member.allergies && <span>⚠️ Allergies: {member.allergies}</span>}
                        {member.specialNeeds && <span>♿ Needs: {member.specialNeeds}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-zinc-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 self-end sm:self-auto"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {familyMembers.length === 0 && (
                  <div className="text-center py-8 text-xs text-zinc-400">
                    No household members added yet. Add family members above to prepare for rapid reunification.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'plan' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Primary Meeting Point (Near Home):
                  </label>
                  <input
                    type="text"
                    value={primaryMeetingPoint}
                    onChange={(e) => setPrimaryMeetingPoint(e.target.value)}
                    placeholder="e.g. Park entrance mailbox, Tree at corner"
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                  <span className="text-[10px] text-zinc-500">Immediate assembly point right outside the home during fire or localized evacuation.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Secondary Meeting Point (Outside Neighborhood):
                  </label>
                  <input
                    type="text"
                    value={secondaryMeetingPoint}
                    onChange={(e) => setSecondaryMeetingPoint(e.target.value)}
                    placeholder="e.g. Town Hall / Relative's house in adjacent town"
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                  <span className="text-[10px] text-zinc-500">If whole neighborhood is cordoned off due to flood or gas leak.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-purple-600" />
                    Designated Out-of-Area Family Contact:
                  </label>
                  <input
                    type="text"
                    value={outOfAreaContact}
                    onChange={(e) => setOutOfAreaContact(e.target.value)}
                    placeholder="e.g. Uncle Amit (Residing in Bengaluru)"
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Out-of-Area Contact Phone:
                  </label>
                  <input
                    type="tel"
                    value={outOfAreaContactPhone}
                    onChange={(e) => setOutOfAreaContactPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Home Evacuation Route & Hazard Isolation Notes:
                </label>
                <textarea
                  rows={2}
                  value={evacuationRouteNotes}
                  onChange={(e) => setEvacuationRouteNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Dog className="w-4 h-4 text-amber-600" />
                    Pet Evacuation Plan:
                  </label>
                  <textarea
                    rows={2}
                    value={petPlan}
                    onChange={(e) => setPetPlan(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-rose-500" />
                    Child Safety & School Protocol:
                  </label>
                  <textarea
                    rows={2}
                    value={childSafetyPlan}
                    onChange={(e) => setChildSafetyPlan(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {savedSuccess ? '✅ Changes saved successfully to secure local storage!' : 'All plans are stored locally on your device.'}
                </span>
                <button
                  onClick={handleSavePlan}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Emergency Plan
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sensitive medical and contact data never leaves your device unless shared by you.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
