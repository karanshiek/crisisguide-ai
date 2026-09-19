import React from 'react';
import { 
  X, 
  Sliders, 
  Eye, 
  Type, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (settings: AccessibilitySettings) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Accessibility Preferences
              </h2>
              <p className="text-xs text-zinc-500">
                Adjust typography, contrast, and emergency legibility
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

        {/* Settings Body */}
        <div className="p-6 space-y-5">
          {/* Font Size */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-600" />
              Reading Font Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'x-large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ ...settings, fontSize: size })}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all flex items-center justify-center gap-1.5 ${
                    settings.fontSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {settings.fontSize === size && <Check className="w-3.5 h-3.5" />}
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                High-Contrast Mode
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Enhanced dark borders & stark contrast for smoke / outdoor sunlight
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => onUpdateSettings({ ...settings, highContrast: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Screen Reader Optimization */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Screen-Reader Aria Optimization
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Priority alert announcements for assistive technologies
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.screenReaderOptimized}
              onChange={(e) => onUpdateSettings({ ...settings, screenReaderOptimized: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Text-to-speech Auto Read */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Auto-Read Critical Warnings
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Automatically speak aloud immediate life-saving directives
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.textToSpeechAutoRead}
              onChange={(e) => onUpdateSettings({ ...settings, textToSpeechAutoRead: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
