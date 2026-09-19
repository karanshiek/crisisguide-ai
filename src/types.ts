export type Language = 'en' | 'hi' | 'hinglish';

export type EmergencySeverity = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL' | 'EXTREME' | 'EXTREME_EMERGENCY' | 'INFORMATION';

export interface AlertItem {
  id: string;
  type: string;
  title: string;
  severity: EmergencySeverity;
  affectedArea?: string;
  region?: string;
  issuedAt: string | number;
  updatedAt?: string | number;
  source: string;
  recommendedAction: string;
  description?: string;
  url?: string;
}

export type RealtimeAlert = AlertItem;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isEmergency?: boolean;
  emergencyType?: string;
  detectedType?: string;
  actionSteps?: string[];
  imageUrl?: string;
  imageBase64?: string;
  hazardAnalysis?: {
    detectedHazards: string[];
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
    immediateAdvice: string;
    disclaimer: string;
  };
  suggestedFollowUps?: string[];
  feedback?: 'like' | 'dislike' | 'helpful' | 'unhelpful' | null;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
  language?: Language;
}

export type ChatSession = Conversation;

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  number: string;
  isOfficial: boolean;
  category: 'national' | 'police' | 'fire' | 'ambulance' | 'disaster' | 'poison' | 'utility' | 'family';
  description?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  bloodGroup?: string;
  allergies?: string;
  medications?: string;
  specialNeeds?: string;
}

export interface FamilyEmergencyPlan {
  primaryMeetingPoint: string;
  secondaryMeetingPoint: string;
  outOfAreaContact: string;
  outOfAreaContactPhone: string;
  evacuationRouteNotes: string;
  petPlan: string;
  childSafetyPlan: string;
  updatedAt: number;
}

export interface EmergencyKitItem {
  id: string;
  name: string;
  category: 'water' | 'food' | 'medical' | 'communication' | 'lighting' | 'safety' | 'documents' | 'special';
  essential: boolean;
  quantity?: string;
  packed: boolean;
  isPacked?: boolean;
  importance?: 'critical' | 'recommended' | 'optional';
  expiryDate?: string;
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; points: number }[];
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  assessment: string;
  recommendations: string[];
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge' | 'x-large';
  highContrast: boolean;
  reducedMotion?: boolean;
  autoSpeakEmergency?: boolean;
  handsFreeMode?: boolean;
  screenReaderOptimized?: boolean;
  textToSpeechAutoRead?: boolean;
}

export type AppTheme = 'light' | 'dark' | 'emergency-high-vis';

export interface AdminStats {
  totalChats: number;
  activeEmergenciesDetected: number;
  aiSuccessRate: number;
  averageResponseTimeMs: number;
  totalAlertsActive: number;
  verifiedSourcesCount: number;
}
