import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Share2, 
  Download, 
  PackageCheck, 
  AlertCircle,
  Copy,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { EmergencyKitItem } from '../types';

interface EmergencyKitTrackerProps {
  items: EmergencyKitItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<EmergencyKitItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  compact?: boolean;
}

export const EmergencyKitTracker: React.FC<EmergencyKitTrackerProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  compact = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // New item form
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<EmergencyKitItem['category']>('water');
  const [itemQuantity, setItemQuantity] = useState('1 unit');
  const [itemImportance, setItemImportance] = useState<'critical' | 'recommended' | 'optional'>('critical');

  const totalCount = items.length;
  const packedCount = items.filter(i => i.isPacked).length;
  const readinessPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unpacked') return !item.isPacked;
    if (selectedCategory === 'critical') return item.importance === 'critical';
    return item.category === selectedCategory;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    onAddItem({
      name: itemName.trim(),
      category: itemCategory,
      quantity: itemQuantity.trim() || '1 unit',
      importance: itemImportance,
      essential: itemImportance === 'critical',
      packed: false,
      isPacked: false,
      notes: 'Custom emergency kit item'
    });

    setItemName('');
    setItemQuantity('1 unit');
    setShowAddModal(false);
  };

  const exportChecklistAsText = () => {
    const text = `=========================================
72-HOUR DISASTER EMERGENCY GO-BAG CHECKLIST
Readiness: ${packedCount}/${totalCount} items packed (${readinessPercent}%)
=========================================

${items.map(item => `[${item.isPacked ? 'X' : ' '}] ${item.name} (${item.quantity}) - [${item.importance.toUpperCase()}] - Cat: ${item.category}`).join('\n')}

=========================================
Preparedness Guideline: Keep in a waterproof, easily grabable backpack near your home exit.
=========================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Emergency Go-Bag Readiness
            </h3>
          </div>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {readinessPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              readinessPercent > 80
                ? 'bg-emerald-500'
                : readinessPercent > 40
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${readinessPercent}%` }}
          />
        </div>

        <div className="text-[11px] text-zinc-500 flex justify-between">
          <span>{packedCount} of {totalCount} essentials packed</span>
          <span>{items.filter(i => i.importance === 'critical' && !i.isPacked).length} critical missing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col space-y-5">
      
      {/* Header and Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              72-Hour Emergency Go-Bag Kit
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Essential survival supplies to sustain your household for at least 3 days
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {readinessPercent}%
            </div>
            <div className="text-[10px] uppercase font-bold text-zinc-400">
              {packedCount}/{totalCount} Items Ready
            </div>
          </div>
          <button
            onClick={exportChecklistAsText}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Checklist'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            readinessPercent > 80
              ? 'bg-emerald-500'
              : readinessPercent > 40
              ? 'bg-amber-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${readinessPercent}%` }}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'critical', label: '🚨 Critical Priority' },
          { id: 'unpacked', label: '⏳ Still Missing' },
          { id: 'water', label: '💧 Water' },
          { id: 'food', label: '🥫 Food' },
          { id: 'firstaid', label: '🩹 First Aid' },
          { id: 'communication', label: '📻 Radio & Power' },
          { id: 'tools', label: '🔦 Tools & Light' },
          { id: 'sanitation', label: '🧼 Sanitation' },
          { id: 'documents', label: '📄 Documents' },
          { id: 'special', label: '🍼 Special / Pets' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === tab.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 select-none ${
              item.isPacked
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-zinc-500 dark:text-zinc-400 line-through'
                : 'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/70 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0 text-emerald-600">
                {item.isPacked ? (
                  <CheckSquare className="w-4 h-4 fill-emerald-100 dark:fill-emerald-950" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div>
                <div className={`text-xs font-bold leading-tight ${item.isPacked ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {item.name}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1">
                  <span>Qty: {item.quantity}</span>
                  <span>•</span>
                  <span className={`uppercase font-bold ${
                    item.importance === 'critical' ? 'text-red-500' : 'text-zinc-400'
                  }`}>
                    {item.importance}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(item.id);
              }}
              className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 shrink-0"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleAddItem} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              Add Custom Kit Item
            </h4>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Item Name *</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Baby formula, Pet leash, Prescription eye drops"
                className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="water">Water</option>
                  <option value="food">Food</option>
                  <option value="firstaid">First Aid</option>
                  <option value="tools">Tools & Light</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="documents">Documents</option>
                  <option value="communication">Communication</option>
                  <option value="special">Special / Pets</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Importance</label>
                <select
                  value={itemImportance}
                  onChange={(e) => setItemImportance(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="critical">Critical</option>
                  <option value="recommended">Recommended</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Quantity / Dosage</label>
              <input
                type="text"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                placeholder="e.g. 3 packs / 10 days supply"
                className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
