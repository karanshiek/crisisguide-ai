import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  Info, 
  Search 
} from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
}

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onAddContact,
  onDeleteContact
}) => {
  const [filter, setFilter] = useState<'all' | 'official' | 'personal'>('all');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Contact form fields
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newCategory, setNewCategory] = useState<EmergencyContact['category']>('family');

  if (!isOpen) return null;

  const filtered = contacts.filter((c) => {
    if (filter === 'official' && !c.isOfficial) return false;
    if (filter === 'personal' && c.isOfficial) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.number.includes(q);
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNumber.trim()) return;

    onAddContact({
      name: newName.trim(),
      role: newRole.trim() || 'Personal Contact',
      number: newNumber.trim(),
      isOfficial: false,
      category: newCategory,
      description: 'User-created personal emergency contact'
    });

    setNewName('');
    setNewRole('');
    setNewNumber('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Emergency Contact Directory
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Dial Ready
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official emergency helplines & customized personal contacts
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

        {/* Filter bar & Actions */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              All Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setFilter('official')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'official'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              Official Helplines
            </button>
            <button
              onClick={() => setFilter('personal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'personal'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              Personal / Family
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Personal Contact
            </button>
          </div>
        </div>

        {/* Add Personal Contact Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900/60 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Dr. Rajesh / Mom"
                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">Role / Relationship</label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Family Physician / Neighbor"
                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs"
              >
                Save Contact
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold px-3 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Contacts Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                  contact.isOfficial
                    ? 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'
                    : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    contact.isOfficial 
                      ? 'bg-red-100 dark:bg-red-950 text-red-600' 
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                  }`}>
                    {contact.isOfficial ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{contact.name}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        contact.isOfficial
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {contact.isOfficial ? 'Official' : 'Personal'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{contact.role}</p>
                    <div className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1 font-mono tracking-wide">
                      {contact.number}
                    </div>
                    {contact.description && (
                      <p className="text-[11px] text-zinc-500 mt-1">{contact.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <a
                    href={`tel:${contact.number}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Dial
                  </a>
                  {!contact.isOfficial && (
                    <button
                      onClick={() => onDeleteContact(contact.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors self-end"
                      title="Delete contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-400 text-xs">
              No contacts found matching your query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Always confirm local service applicability. Universal Indian emergency number is 112.</span>
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
