/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  AppTheme, 
  Language, 
  ChatSession, 
  ChatMessage, 
  RealtimeAlert, 
  EmergencyKitItem, 
  EmergencyContact, 
  FamilyMember, 
  FamilyEmergencyPlan, 
  AccessibilitySettings 
} from './types';
import { 
  INITIAL_KIT_ITEMS, 
  OFFICIAL_CONTACTS, 
  INITIAL_ALERTS, 
  DISASTER_GUIDES 
} from './data/emergencyKnowledge';

import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { DashboardView } from './components/DashboardView';
import { DisasterGuidesModal } from './components/DisasterGuidesModal';
import { FirstAidModal } from './components/FirstAidModal';
import { SOSModal } from './components/SOSModal';
import { EmergencyContactsModal } from './components/EmergencyContactsModal';
import { FamilySafetyModal } from './components/FamilySafetyModal';
import { PlanGeneratorModal } from './components/PlanGeneratorModal';
import { QuizModal } from './components/QuizModal';
import { HazardVisionModal } from './components/HazardVisionModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { AdminModal } from './components/AdminModal';

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'guides' | 'firstaid' | 'contacts' | 'family'>('chat');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('aegis_lang') as Language) || 'en';
  });
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('aegis_theme') as AppTheme) || 'light';
  });
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('aegis_access');
    return saved ? JSON.parse(saved) : {
      highContrast: false,
      fontSize: 'normal',
      screenReaderOptimized: false,
      textToSpeechAutoRead: false
    };
  });
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);

  // Modals state
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [initialDisasterId, setInitialDisasterId] = useState('fire');
  const [isFirstAidOpen, setIsFirstAidOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [isPlanGenOpen, setIsPlanGenOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isHazardVisionOpen, setIsHazardVisionOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Chat Data & History
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('aegis_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const initialSessionId = `session-${Date.now()}`;
    return [{
      id: initialSessionId,
      title: 'Disaster Emergency Help',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    }];
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || `session-${Date.now()}`;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // User Geolocation
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Emergency Kit, Contacts, Family Plan, Alerts State
  const [kitItems, setKitItems] = useState<EmergencyKitItem[]>(() => {
    const saved = localStorage.getItem('aegis_kit');
    return saved ? JSON.parse(saved) : INITIAL_KIT_ITEMS;
  });

  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('aegis_contacts');
    return saved ? JSON.parse(saved) : OFFICIAL_CONTACTS;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('aegis_family_members');
    return saved ? JSON.parse(saved) : [];
  });

  const [familyPlan, setFamilyPlan] = useState<FamilyEmergencyPlan>(() => {
    const saved = localStorage.getItem('aegis_family_plan');
    return saved ? JSON.parse(saved) : {
      primaryMeetingPoint: 'Neighborhood Community Park Gate',
      secondaryMeetingPoint: 'District Sports Complex / Grandparents house',
      outOfAreaContact: 'Uncle Ramesh (Out of state)',
      outOfAreaContactPhone: '+91 9123456780',
      evacuationRouteNotes: 'Exit house via rear porch, head north towards high ground elevated bypass.',
      petPlan: 'Keep Bruno in transport carrier with 3-day dry kibble and collar tag.',
      childSafetyPlan: 'School releases children only to verified primary family contacts.'
    };
  });

  const [alerts, setAlerts] = useState<RealtimeAlert[]>(() => {
    const saved = localStorage.getItem('aegis_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [preparednessScore, setPreparednessScore] = useState<number>(() => {
    const saved = localStorage.getItem('aegis_quiz_score');
    return saved ? parseInt(saved, 10) : 75;
  });

  // Theme & Accessibility application
  useEffect(() => {
    localStorage.setItem('aegis_theme', theme);
    const root = document.documentElement;

    if (theme === 'dark' || theme === 'emergency-high-vis') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [theme, accessibility.highContrast]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aegis_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('aegis_access', JSON.stringify(accessibility));
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem('aegis_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('aegis_kit', JSON.stringify(kitItems));
  }, [kitItems]);

  useEffect(() => {
    localStorage.setItem('aegis_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('aegis_family_members', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('aegis_family_plan', JSON.stringify(familyPlan));
  }, [familyPlan]);

  useEffect(() => {
    localStorage.setItem('aegis_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Request location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.log('Location permission info:', err.message),
        { enableHighAccuracy: true, timeout: 7000 }
      );
    }
  }, []);

  // Fetch real-time alerts from server
  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const serverAlerts = Array.isArray(data) ? data : data?.alerts;
        if (Array.isArray(serverAlerts) && serverAlerts.length > 0) {
          setAlerts(serverAlerts);
        }
      })
      .catch(() => {
        // Keeps initial fallback alerts
      });
  }, []);

  // Active Session & Messages
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const currentMessages = currentSession?.messages || [];

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setActiveTab('chat');
  };

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Emergency Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setActiveTab('chat');
  };

  const handleDeleteSession = (id: string) => {
    const remaining = sessions.filter(s => s.id !== id);
    if (remaining.length === 0) {
      const fallbackId = `session-${Date.now()}`;
      const fallback: ChatSession = {
        id: fallbackId,
        title: 'Disaster Emergency Help',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      };
      setSessions([fallback]);
      setActiveSessionId(fallbackId);
    } else {
      setSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handlePinSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
  };

  // Sending Messages to AI Orchestrator
  const handleSendMessage = async (userText: string, imageBase64?: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
      imageBase64
    };

    // Auto-name conversation on first message
    const sessionTitle = currentMessages.length === 0 
      ? userText.slice(0, 35) + (userText.length > 35 ? '...' : '')
      : currentSession.title;

    const updatedMessages = [...currentMessages, userMsg];

    setSessions(prev => prev.map(s => 
      s.id === activeSessionId
        ? { ...s, title: sessionTitle, updatedAt: Date.now(), messages: updatedMessages }
        : s
    ));

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          message: userText,
          imageBase64,
          history: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          userLocation: userCoords ? `Lat: ${userCoords.lat.toFixed(4)}, Lng: ${userCoords.lng.toFixed(4)}` : null,
          language
        })
      });

      if (!response.ok) throw new Error('Network error from emergency orchestration');

      const data = await response.json();
      const replyContent = (data.content || data.reply || data.text || '').trim();

      const finalContent = replyContent || (data.isEmergency
        ? '🚨 Please prioritize your safety and move away from immediate danger. Call universal emergency 112 or local authorities immediately.'
        : 'Hello! I am your Disaster Emergency Guidance & Support AI assistant. How can I assist you with safety or disaster preparedness?');

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: finalContent,
        timestamp: Date.now(),
        isEmergency: !!data.isEmergency,
        detectedType: data.detectedType || data.emergencyType,
        actionSteps: data.actionSteps
      };

      if (data.isEmergency) {
        setIsEmergencyActive(true);
      }

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId
          ? { ...s, updatedAt: Date.now(), messages: [...updatedMessages, assistantMsg] }
          : s
      ));

      // Auto-read critical warning if accessibility enabled
      if (accessibility.textToSpeechAutoRead && data.isEmergency && !isVoiceMuted && 'speechSynthesis' in window) {
        const cleanSpeech = finalContent.replace(/[#*_`🚨⚠️-]/g, ' ');
        const utterance = new SpeechSynthesisUtterance(cleanSpeech.slice(0, 200));
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }

    } catch (err: any) {
      if (err.name === 'AbortError') return;

      // Local RAG Emergency Fallback
      const fallbackResult = generateLocalOfflineFallback(userText, language);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-offline`,
        role: 'assistant',
        content: fallbackResult.text,
        timestamp: Date.now(),
        isEmergency: fallbackResult.isEmergency
      };

      if (fallbackResult.isEmergency) {
        setIsEmergencyActive(true);
      }

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId
          ? { ...s, updatedAt: Date.now(), messages: [...updatedMessages, assistantMsg] }
          : s
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    const lastUserMsg = [...currentMessages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      await handleSendMessage(lastUserMsg.content, lastUserMsg.imageBase64);
    }
  };

  const handleFeedback = async (messageId: string, rating: 'helpful' | 'unhelpful') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          rating,
          type: rating === 'helpful' ? 'like' : 'dislike'
        })
      });
      // update state
      setSessions(prev => prev.map(s => ({
        ...s,
        messages: s.messages.map(m => m.id === messageId ? { ...m, feedback: rating } : m)
      })));
    } catch {}
  };

  // Quick Emergency Trigger from buttons
  const handleSelectEmergency = (id: string, name: string) => {
    setIsEmergencyActive(true);
    if (id === 'sos') {
      setIsSOSOpen(true);
      return;
    }

    setInitialDisasterId(id);
    setIsGuidesOpen(true);

    // Also send instant triage prompt to chat
    const triagePrompt = `EMERGENCY ALERT: I am facing a ${name} emergency right now. Give me immediate step-by-step survival instructions!`;
    handleSendMessage(triagePrompt);
    setActiveTab('chat');
  };

  // Kit Item management
  const handleToggleKitItem = (id: string) => {
    setKitItems(prev => prev.map(item => item.id === id ? { ...item, isPacked: !item.isPacked } : item));
  };

  const handleAddKitItem = (item: Omit<EmergencyKitItem, 'id'>) => {
    const newItem: EmergencyKitItem = { ...item, id: `kit-${Date.now()}` };
    setKitItems([newItem, ...kitItems]);
  };

  const handleDeleteKitItem = (id: string) => {
    setKitItems(kitItems.filter(i => i.id !== id));
  };

  // Contacts management
  const handleAddContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = { ...contact, id: `contact-${Date.now()}` };
    setContacts([newContact, ...contacts]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  // Admin Alert management
  const handleAddAdminAlert = (alertData: Omit<RealtimeAlert, 'id' | 'issuedAt'>) => {
    const newAlert: RealtimeAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      issuedAt: Date.now()
    };
    setAlerts([newAlert, ...alerts]);
  };

  const handleDeleteAdminAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  // Offline Fallback helper
  const generateLocalOfflineFallback = (query: string, lang: Language): { text: string; isEmergency: boolean } => {
    const q = query.toLowerCase();
    const isEmerg = /\b(emergency|fire|aag|earthquake|bhukamp|flood|baadh|cyclone|toofan|hurricane|tsunami|landslide|lightning|blast|gas leak|chemical|poison|heart attack|choking|bleeding|accident|drowning|cpr|trapped|sos|madad|bachao|help me|ambulance|danger|khatra)\b/i.test(q);

    if (q.includes('fire') || q.includes('aag') || q.includes('धुआं')) {
      return {
        isEmergency: true,
        text: `🚨 **IMMEDIATE ACTION (FIRE SAFETY - OFFLINE VERIFIED)**\n\n1. **Evacuate Immediately:** Do not stop to gather personal possessions.\n2. **Crawl Low Under Smoke:** Clean air is near the ground (within 30 cm).\n3. **Test Doors with Back of Hand:** If knob/door is hot, DO NOT open. Use secondary window or balcony exit.\n4. **Close Doors Behind You:** Isolates oxygen and slows flame spread.\n5. **Call Fire Brigade:** Dial **101** or universal **112** from outside.\n\n⚠️ **DO NOT USE ELEVATORS UNDER ANY CIRCUMSTANCES.**\n\nAre you in a safe outdoor location right now?`
      };
    }
    if (q.includes('earthquake') || q.includes('bhukamp') || q.includes('भूकंप')) {
      return {
        isEmergency: true,
        text: `🚨 **IMMEDIATE ACTION (EARTHQUAKE - OFFLINE VERIFIED)**\n\n1. **DROP:** Get down on hands and knees to prevent falling.\n2. **COVER:** Take cover under a heavy desk, table, or interior structural wall. Cover head and neck.\n3. **HOLD ON:** Hold firmly onto shelter until ground shaking completely stops.\n4. **Avoid Hazards:** Stay away from glass windows, exterior doors, and tall unanchored furniture.\n5. **If Outdoors:** Move into open ground away from electrical wires, brick parapets, and billboards.\n\n⚠️ **DO NOT RUN OUTSIDE WHILE SHAKING IS OCCURRING.**\n\nDial **112** for emergency medical or civil defense dispatch.`
      };
    }
    if (isEmerg) {
      return {
        isEmergency: true,
        text: `🚨 **OFFLINE EMERGENCY SAFETY PROTOCOL**\n\n1. **Prioritize Life Safety:** Move away from immediate hazards (fire, rising flood water, structural cracks, or electrical lines).\n2. **Summon First Responders:** Dial universal emergency **112** or ambulance **108**.\n3. **Account for Household Members:** Assemble at designated safe open ground.\n4. **Monitor Official Broadcasts:** Keep your phone battery conserved.\n\nAre you and those around you physically safe from danger right now?`
      };
    }

    if (lang === 'hi' || lang === 'hinglish') {
      return {
        isEmergency: false,
        text: `Namaste! Main aapka **Disaster Emergency Guidance & Support AI** assistant hoon.\n\nMain aapko nimnlikhit cheezon mein madad kar sakta hoon:\n- **Aapda Suraksha (Disaster Response):** Aag, Bhukamp, Baadh, Toofan aadi ke samay kya karein aur kya na karein.\n- **First-Aid aur CPR:** Ghayal vyakti ke liye jankari aur 110 BPM metronome.\n- **Emergency Kit Checklist:** 72 ghante ke survival bag ki taiyari.\n- **Family Evacuation Plan:** Parivar ke surakshit meeting points aur emergency contacts.\n\nAapko kis vishay par jankari chahiye?`
      };
    }

    return {
      isEmergency: false,
      text: `Hello! I am your **Disaster Emergency Guidance & Support AI** assistant.\n\nI can help you with:\n- **Emergency Response Protocols:** Step-by-step guidance for fire, earthquake, flood, cyclone, and other hazards.\n- **First-Aid & CPR:** Immediate life-saving steps, bleeding control, and CPR metronome.\n- **72-Hour Go-Bag Checklist:** Essential survival supplies and equipment.\n- **Family Safety Plans:** Evacuation routes, designated meeting points, and emergency contacts.\n\nHow can I help you with disaster preparedness or safety today?`
    };
  };

  // Font size multiplier class
  const fontSizeClass = accessibility.fontSize === 'x-large' 
    ? 'text-lg' 
    : accessibility.fontSize === 'large' 
    ? 'text-base' 
    : 'text-sm';

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' || theme === 'emergency-high-vis' ? 'dark' : ''} ${fontSizeClass}`}>
      
      {/* Top Header & Emergency Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'guides') setIsGuidesOpen(true);
          else if (tab === 'firstaid') setIsFirstAidOpen(true);
          else if (tab === 'contacts') setIsContactsOpen(true);
          else if (tab === 'family') setIsFamilyOpen(true);
          else setActiveTab(tab);
        }}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        isEmergencyActive={isEmergencyActive}
        onTriggerSOS={() => setIsSOSOpen(true)}
        isVoiceMuted={isVoiceMuted}
        setIsVoiceMuted={setIsVoiceMuted}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {activeTab === 'chat' && (
          <ChatView
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
            onPinSession={handlePinSession}
            currentMessages={currentMessages}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            onStopGeneration={handleStopGeneration}
            onRegenerate={handleRegenerate}
            onFeedback={handleFeedback}
            language={language}
            onSelectEmergency={handleSelectEmergency}
            onTriggerSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            alerts={alerts}
            kitItems={kitItems}
            onToggleKitItem={handleToggleKitItem}
            onAddKitItem={handleAddKitItem}
            onDeleteKitItem={handleDeleteKitItem}
            familyPlan={familyPlan}
            preparednessScore={preparednessScore}
            onSelectEmergency={handleSelectEmergency}
            onOpenFirstAid={() => setIsFirstAidOpen(true)}
            onOpenGuides={(id) => {
              if (id) setInitialDisasterId(id);
              setIsGuidesOpen(true);
            }}
            onOpenFamily={() => setIsFamilyOpen(true)}
            onOpenPlanGen={() => setIsPlanGenOpen(true)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenHazardVision={() => setIsHazardVisionOpen(true)}
            onOpenSOS={() => setIsSOSOpen(true)}
            onOpenContacts={() => setIsContactsOpen(true)}
            userCoords={userCoords}
          />
        )}
      </div>

      {/* Modals */}
      <DisasterGuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
        initialDisasterId={initialDisasterId}
        onAskAIAboutDisaster={(disasterName) => {
          handleSendMessage(`I need more specific instructions and safety advice for: ${disasterName}`);
          setActiveTab('chat');
        }}
      />

      <FirstAidModal
        isOpen={isFirstAidOpen}
        onClose={() => setIsFirstAidOpen(false)}
        onAskAIAboutFirstAid={(topic) => {
          handleSendMessage(`First Aid Question: How do I properly treat or manage ${topic}?`);
          setActiveTab('chat');
        }}
      />

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        contacts={contacts}
        userLocation={userCoords ? `Lat: ${userCoords.lat.toFixed(4)}, Lng: ${userCoords.lng.toFixed(4)}` : null}
      />

      <EmergencyContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        contacts={contacts}
        onAddContact={handleAddContact}
        onDeleteContact={handleDeleteContact}
      />

      <FamilySafetyModal
        isOpen={isFamilyOpen}
        onClose={() => setIsFamilyOpen(false)}
        familyMembers={familyMembers}
        onUpdateMembers={setFamilyMembers}
        familyPlan={familyPlan}
        onUpdatePlan={setFamilyPlan}
      />

      <PlanGeneratorModal
        isOpen={isPlanGenOpen}
        onClose={() => setIsPlanGenOpen(false)}
        language={language}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onUpdatePreparednessScore={(score) => setPreparednessScore(score)}
      />

      <HazardVisionModal
        isOpen={isHazardVisionOpen}
        onClose={() => setIsHazardVisionOpen(false)}
        language={language}
      />

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibility}
        onUpdateSettings={setAccessibility}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        alerts={alerts}
        onAddAlert={handleAddAdminAlert}
        onDeleteAlert={handleDeleteAdminAlert}
      />

    </div>
  );
}
