import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Camera, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert, 
  Image as ImageIcon 
} from 'lucide-react';
import { Language } from '../types';

interface HazardVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const HazardVisionModal: React.FC<HazardVisionModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/analyze-hazard-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          prompt: 'Assess this image for physical hazards, structural damage, water or fire risks, and provide immediate safety steps.',
          language
        })
      });

      if (!res.ok) throw new Error('Hazard analysis service error');
      const data = await res.json();
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setErrorMsg('Could not complete live AI hazard analysis. Using local inspection protocol: Immediately treat damaged buildings, flood waters, or smoke as high hazard. Maintain a minimum safe distance of at least 100 meters.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Hazard Vision Inspection
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                  Multimodal AI
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Visual assessment of flames, flood currents, structural cracks, or downed lines
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

        {/* Safety Warning Banner */}
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/60 px-4 py-2 text-xs text-red-800 dark:text-red-300 flex items-center gap-2 font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>LIFE SAFETY FIRST: Never endanger your physical safety or pause evacuation just to take a photo. Only inspect scenes from a verified safe perimeter.</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/20 transition-all flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block">
                  Click or drag image to inspect hazard
                </span>
                <span className="text-xs text-zinc-500 mt-1 block">
                  Upload photos of cracked masonry, flooded roadways, fire smoke, or fallen lines
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-64 flex items-center justify-center bg-zinc-950">
                <img
                  src={selectedImage}
                  alt="Hazard capture"
                  className="w-full h-full object-contain max-h-64"
                />
                <button
                  onClick={resetAll}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!analysisResult && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning Scene for Structural & Life Hazards...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      Run AI Hazard & Safety Analysis
                    </>
                  )}
                </button>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-900 dark:text-amber-200">
                  {errorMsg}
                </div>
              )}

              {analysisResult && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Visual Hazard Assessment Completed
                    </span>
                    <button
                      onClick={resetAll}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Inspect Another Photo
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {analysisResult}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
