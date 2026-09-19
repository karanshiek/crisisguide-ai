import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Square, 
  AlertTriangle, 
  Plus, 
  Search, 
  Trash2, 
  Pin, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  PhoneCall, 
  ShieldAlert, 
  X,
  Sparkles
} from 'lucide-react';
import { ChatMessage, ChatSession, Language } from '../types';
import { QuickEmergencyBar } from './QuickEmergencyBar';

interface ChatViewProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onPinSession: (id: string) => void;
  currentMessages: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string) => Promise<void>;
  isGenerating: boolean;
  onStopGeneration: () => void;
  onRegenerate: () => void;
  onFeedback: (messageId: string, rating: 'helpful' | 'unhelpful') => void;
  language: Language;
  onSelectEmergency: (id: string, name: string) => void;
  onTriggerSOS: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onPinSession,
  currentMessages,
  onSendMessage,
  isGenerating,
  onStopGeneration,
  onRegenerate,
  onFeedback,
  language,
  onSelectEmergency,
  onTriggerSOS
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isGenerating]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge or type your query.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting symbols for cleaner voice reading
    const cleanText = text.replace(/[#*_`🚨⚠️-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aegis Emergency AI Advisory',
          text: content
        });
      } catch (e) {
        navigator.clipboard.writeText(content);
      }
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend && !selectedImageBase64) return;
    if (isGenerating) return;

    setInputText('');
    const img = selectedImageBase64 || undefined;
    setSelectedImageBase64(null);

    await onSendMessage(textToSend, img);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      
      {/* ChatGPT-Like Sidebar Drawer for Previous Conversations */}
      <aside className={`transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col z-30 shrink-0 ${
        isSidebarOpen ? 'w-64 sm:w-72' : 'w-0 -translate-x-full absolute md:relative md:w-0'
      } overflow-hidden`}>
        
        {/* Sidebar Header */}
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
          <button
            onClick={onNewSession}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-between shadow-xs transition-opacity"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Conversation
            </span>
            <span className="text-[10px] opacity-60 font-mono">⌘K</span>
          </button>

          {/* Search History */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              placeholder="Search chat history..."
              className="w-full text-xs pl-8 pr-2 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1">
            Recent Transcripts
          </div>

          {filteredSessions.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                activeSessionId === s.id
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                <MessageSquare className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                {editingTitleId === s.id ? (
                  <input
                    type="text"
                    value={editTitleText}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditTitleText(e.target.value)}
                    onBlur={() => {
                      if (editTitleText.trim()) onRenameSession(s.id, editTitleText.trim());
                      setEditingTitleId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (editTitleText.trim()) onRenameSession(s.id, editTitleText.trim());
                        setEditingTitleId(null);
                      }
                    }}
                    className="w-full text-xs p-0.5 bg-white dark:bg-zinc-700 border rounded"
                  />
                ) : (
                  <span className="truncate">{s.title}</span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTitleId(s.id);
                    setEditTitleText(s.title);
                  }}
                  className="p-1 hover:text-zinc-900 dark:hover:text-white rounded"
                  title="Rename title"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPinSession(s.id);
                  }}
                  className={`p-1 rounded ${s.isPinned ? 'text-amber-500' : 'hover:text-zinc-900'}`}
                  title="Pin conversation"
                >
                  <Pin className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(s.id);
                  }}
                  className="p-1 hover:text-red-600 rounded"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="text-center py-6 text-[11px] text-zinc-400">
              No matching records
            </div>
          )}
        </div>

        {/* Sidebar Footer Disclaimer */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-[10px] text-zinc-500 leading-tight">
          Aegis emergency AI retains local context to optimize follow-up triage.
        </div>
      </aside>

      {/* Main Conversation Stream */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Toggle Sidebar Button and Title Bar */}
        <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand chat history'}
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">
              {sessions.find(s => s.id === activeSessionId)?.title || 'Current Emergency Session'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400">
              {language.toUpperCase()}
            </span>
            <button
              onClick={onTriggerSOS}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-900"
            >
              <AlertTriangle className="w-3 h-3" />
              SOS
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Welcome Card if chat is new */}
          {currentMessages.length === 0 && (
            <div className="max-w-2xl mx-auto py-6 space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white mx-auto flex items-center justify-center shadow-md">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  How can I guide you to safety right now?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                  Type an emergency situation, ask medical first-aid questions, upload scene photos, or tap any priority button below.
                </p>
              </div>

              {/* Quick Emergency Buttons on Home */}
              <QuickEmergencyBar onSelectEmergency={onSelectEmergency} />

              {/* Sample Prompts */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Suggested Questions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Bhukamp aa raha hai, mai abhi kya karu? (Earthquake safety)',
                    'Someone collapsed and stopped breathing. How do I do CPR?',
                    'Flash flood water is rising near my door. What are my immediate steps?',
                    'What essential supplies should I pack in a 72-hour Go-Bag?',
                    'Smell of gas in the kitchen. Should I turn on the exhaust fan?'
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(prompt)}
                      className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages list */}
          {currentMessages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl mx-auto ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                    msg.isEmergency ? 'bg-red-600 text-white' : 'bg-emerald-700 text-white'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                )}

                <div className={`flex flex-col space-y-2 max-w-[88%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Attached image preview */}
                  {msg.imageBase64 && (
                    <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-w-xs shadow-sm">
                      <img
                        src={msg.imageBase64}
                        alt="User uploaded hazard"
                        className="w-full h-auto object-cover max-h-48"
                      />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs transition-colors ${
                    isUser
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-br-xs'
                      : msg.isEmergency
                      ? 'bg-red-50/80 dark:bg-red-950/40 border-2 border-red-500/80 text-zinc-900 dark:text-zinc-100 rounded-bl-xs'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-xs'
                  }`}>
                    
                    {/* Emergency Alert Tag */}
                    {!isUser && msg.isEmergency && (
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 mb-2 pb-1.5 border-b border-red-200 dark:border-red-900/60">
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                        🚨 Immediate Life-Safety Protocol
                      </div>
                    )}

                    {/* Content Markdown */}
                    <div className="prose prose-zinc dark:prose-invert max-w-none text-xs sm:text-sm space-y-2">
                      <ReactMarkdown>{msg.content || 'Generating response...'}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Message Action Utilities (Copy, TTS, Feedback) */}
                  {!isUser && (
                    <div className="flex items-center gap-1 px-1 text-zinc-400">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                          speakingId === msg.id ? 'text-emerald-600 animate-pulse' : 'hover:text-zinc-700'
                        }`}
                        title={speakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                      >
                        {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleShare(msg.content)}
                        className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 transition-colors"
                        title="Share guidance"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onFeedback(msg.id, 'helpful')}
                        className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600 transition-colors"
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onFeedback(msg.id, 'unhelpful')}
                        className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-600 transition-colors"
                        title="Not helpful or inaccurate"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Generating Indicator */}
          {isGenerating && (
            <div className="flex gap-3 max-w-3xl mx-auto items-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 animate-pulse">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-3xl text-xs text-zinc-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                Retrieving verified emergency protocol & synthesizing response...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md">
          <div className="max-w-3xl mx-auto space-y-2">
            
            {/* Selected Image Chip */}
            {selectedImageBase64 && (
              <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 max-w-max border border-zinc-200 dark:border-zinc-700">
                <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Hazard photo attached</span>
                <button
                  onClick={() => setSelectedImageBase64(null)}
                  className="text-zinc-400 hover:text-red-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Box */}
            <form onSubmit={handleFormSubmit} className="relative flex items-end gap-2 bg-zinc-100 dark:bg-zinc-800/90 p-2 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-xs focus-within:ring-2 focus-within:ring-emerald-600">
              
              {/* Image Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
                title="Attach scene hazard photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Describe your emergency situation, ask first aid steps, or plan prep..."
                className="flex-1 max-h-32 min-h-[40px] py-2 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-hidden"
              />

              {/* Voice Input Mic */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-full transition-all shrink-0 ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
                title={isListening ? 'Stop listening' : 'Speak into microphone (STT)'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send or Stop Generation */}
              {isGenerating ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  className="p-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-80 transition-opacity shrink-0"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedImageBase64}
                  className="p-2 rounded-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 text-white transition-opacity shrink-0 shadow-xs"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 px-2">
              <span>Aegis is an emergency decision-support AI. For immediate life threats, dial 112 / 911.</span>
              {currentMessages.length > 0 && (
                <button
                  onClick={onRegenerate}
                  className="hover:underline flex items-center gap-1 font-semibold text-zinc-500"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};
