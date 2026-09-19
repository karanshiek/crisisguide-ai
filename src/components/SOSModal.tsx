import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  AlertTriangle, 
  PhoneCall, 
  Share2, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  MessageSquare, 
  Clock, 
  Copy, 
  ExternalLink 
} from 'lucide-react';
import { EmergencyContact } from '../types';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  userLocation: string | null;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  contacts,
  userLocation
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [customEmergencyMessage, setCustomEmergencyMessage] = useState(
    'EMERGENCY SOS: I am in immediate danger and need emergency rescue assistance. Please alert emergency responders and send help to my location.'
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [copied, setCopied] = useState(false);

  const countdownTimerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setIsCountingDown(true);
      setIsActivated(false);
      fetchGeoLocation();

      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            setIsCountingDown(false);
            setIsActivated(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isOpen]);

  const fetchGeoLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err.message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const cancelCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setIsCountingDown(false);
    setIsActivated(false);
    onClose();
  };

  if (!isOpen) return null;

  const locationString = coords 
    ? `Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)} (https://maps.google.com/?q=${coords.lat},${coords.lng})`
    : (userLocation || 'Location coordinates not shared / GPS pending');

  const fullBroadcastMessage = `${customEmergencyMessage}\n\n📍 My Location: ${locationString}\n⏰ Timestamp: ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(fullBroadcastMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🚨 EMERGENCY SOS ALERT',
          text: fullBroadcastMessage
        });
      } catch (e) {
        console.log('Share canceled or failed', e);
      }
    } else {
      handleCopyMessage();
    }
  };

  const officialHelplines = contacts.filter(c => c.isOfficial);
  const personalContacts = contacts.filter(c => !c.isOfficial);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-zinc-900 border-2 border-red-600 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Countdown State */}
        {isCountingDown && (
          <div className="p-8 text-center bg-red-600 text-white flex flex-col items-center justify-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-ping">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                SOS Trigger Activated
              </h2>
              <p className="text-red-100 text-sm mt-1">
                Broadcasting emergency dispatch options in {countdown} seconds...
              </p>
            </div>

            <div className="text-6xl font-black tabular-nums bg-white/10 w-24 h-24 rounded-2xl flex items-center justify-center shadow-inner border border-white/30">
              {countdown}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={cancelCountdown}
                className="bg-white text-red-700 hover:bg-red-50 font-black text-sm px-6 py-3 rounded-xl shadow-lg uppercase tracking-wider transition-all transform active:scale-95"
              >
                Cancel SOS Now
              </button>
              <button
                onClick={() => {
                  if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                  setIsCountingDown(false);
                  setIsActivated(true);
                }}
                className="bg-red-800 hover:bg-red-900 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all"
              >
                Skip Countdown
              </button>
            </div>
          </div>
        )}

        {/* SOS Activated State */}
        {!isCountingDown && (
          <div className="flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl tracking-tight uppercase">
                    SOS Assistance Panel
                  </h3>
                  <p className="text-xs text-red-100">
                    Direct dial & instant emergency broadcast links
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              
              {/* Mandatory Honest Platform Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-200">
                <strong>Platform Notice:</strong> For your safety, web browsers cannot autonomously dispatch police or dial telephone numbers silently without your confirmation. Tap the phone buttons below to initiate direct carrier calls to 112 / 911 or your family.
              </div>

              {/* Instant Call 112 / Universal Banner */}
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-black text-base text-red-700 dark:text-red-400 flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                    Primary Universal Emergency: 112
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Works 24/7 on all telecom operators, even with low balance or locked screens.
                  </p>
                </div>
                <a
                  href="tel:112"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-md text-center shrink-0 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call 112 Now
                </a>
              </div>

              {/* Location Details */}
              <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    Your Coordinates for First Responders:
                  </span>
                  {coords && (
                    <a
                      href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      View on Map <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="text-xs font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 break-all">
                  {isLocating ? 'Locating via GPS satellites...' : locationString}
                </div>
              </div>

              {/* Emergency Message & Share Buttons */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Custom Distress Message (Sent via SMS / WhatsApp):
                </label>
                <textarea
                  value={customEmergencyMessage}
                  onChange={(e) => setCustomEmergencyMessage(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={handleNativeShare}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Broadcast via WhatsApp / SMS
                  </button>

                  <button
                    onClick={handleCopyMessage}
                    className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 flex items-center gap-1.5"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                </div>
              </div>

              {/* Personal Emergency Contacts */}
              {personalContacts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                    Your Configured Family Contacts:
                  </h4>
                  <div className="space-y-2">
                    {personalContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800"
                      >
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{contact.name}</div>
                          <div className="text-[11px] text-zinc-500">{contact.role} • {contact.number}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${contact.number}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call
                          </a>
                          <a
                            href={`sms:${contact.number}?body=${encodeURIComponent(fullBroadcastMessage)}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> SMS
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 text-zinc-800 dark:text-zinc-200"
              >
                Close SOS Panel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
