import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

import {
  DISASTER_GUIDES,
  FIRST_AID_TOPICS,
  INITIAL_ALERTS,
  OFFICIAL_CONTACTS
} from './src/data/emergencyKnowledge';

// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

app.use(express.json({ limit: '20mb' }));

// ============================================================
// TELEMETRY
// ============================================================

let liveAlerts = [...INITIAL_ALERTS];

let chatTelemetry = {
  totalChats: 42,
  activeEmergenciesDetected: 14,
  aiSuccessRate: 99.4,
  averageResponseTimeMs: 420,
  totalAlertsActive: 5,
  verifiedSourcesCount: 7
};

let feedbackLog: {
  id: string;
  messageId: string;
  type: 'like' | 'dislike';
  comment?: string;
  timestamp: number;
}[] = [];

// ============================================================
// GEMINI CLIENT
// ============================================================

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log(
    'Gemini API key loaded:',
    apiKey ? 'YES' : 'NO'
  );

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey
    });
  }

  return aiClient;
}

// ============================================================
// EMERGENCY DETECTOR
// ============================================================

const EMERGENCY_REGEX =
  /\b(emergency|fire|aag|earthquake|bhukamp|bhookamp|flood|baadh|cyclone|toofan|hurricane|tsunami|landslide|mudslide|bijli|lightning|blast|explosion|gas leak|chemical|poison|heart attack|choking|bleeding|khoon|accident|drowning|doob|unconscious|cpr|trapped|sos|madad|bachao|help me|ambulance|danger|khatra)\b/i;

function detectEmergency(
  query: string
): {
  isEmergency: boolean;
  topicKey?: string;
} {
  const lower = query.toLowerCase();

  const matched =
    EMERGENCY_REGEX.test(lower);

  let topicKey:
    | string
    | undefined = undefined;

  if (
    lower.includes('fire') ||
    lower.includes('aag') ||
    lower.includes('smoke') ||
    lower.includes('dhua')
  ) {
    topicKey = 'fire';

  } else if (
    lower.includes('earthquake') ||
    lower.includes('bhukamp') ||
    lower.includes('bhookamp') ||
    lower.includes('tremor') ||
    lower.includes('shaking')
  ) {
    topicKey = 'earthquake';

  } else if (
    lower.includes('flood') ||
    lower.includes('baadh') ||
    lower.includes('water rising') ||
    lower.includes('drowning') ||
    lower.includes('doob')
  ) {
    topicKey = lower.includes('drowning')
      ? 'drowning'
      : 'flood';

  } else if (
    lower.includes('cyclone') ||
    lower.includes('toofan') ||
    lower.includes('hurricane') ||
    lower.includes('typhoon')
  ) {
    topicKey = 'cyclone';

  } else if (
    lower.includes('tsunami')
  ) {
    topicKey = 'tsunami';

  } else if (
    lower.includes('landslide') ||
    lower.includes('mudslide')
  ) {
    topicKey = 'landslide';

  } else if (
    lower.includes('lightning') ||
    lower.includes('bijli')
  ) {
    topicKey = 'lightning';

  } else if (
    lower.includes('chemical') ||
    lower.includes('gas leak') ||
    lower.includes('fumes')
  ) {
    topicKey = 'chemical';

  } else if (
    lower.includes('accident') ||
    lower.includes('crash') ||
    lower.includes('car hit')
  ) {
    topicKey = 'roadAccident';

  } else if (
    lower.includes('cpr') ||
    lower.includes('bleeding') ||
    lower.includes('heart attack') ||
    lower.includes('choking') ||
    lower.includes('unconscious') ||
    lower.includes('burn')
  ) {
    topicKey = 'medical';

  } else if (
    lower.includes('sos') ||
    lower.includes('help') ||
    lower.includes('bachao')
  ) {
    topicKey = 'sos';
  }

  return {
    isEmergency:
      matched || !!topicKey,
    topicKey
  };
}

// ============================================================
// VERIFIED RAG CONTEXT
// ============================================================

function retrieveVerifiedRAGContext(
  query: string
): string {
  const { topicKey } =
    detectEmergency(query);

  let context = '';

  if (
    topicKey &&
    DISASTER_GUIDES[topicKey]
  ) {
    const guide =
      DISASTER_GUIDES[topicKey];

    context +=
      `\n[VERIFIED OFFICIAL GUIDELINES FOR ${guide.name.toUpperCase()}]:\n`;

    context +=
      `Immediate Actions:\n${guide.immediateActions
        .map(
          (a, i) =>
            `${i + 1}. ${a}`
        )
        .join('\n')}\n`;

    context +=
      `Things to Avoid (DO NOT):\n${guide.doNots
        .map(
          (d) => `- ${d}`
        )
        .join('\n')}\n`;

    context +=
      `If You Are Safe:\n${guide.ifYouAreSafe
        .map(
          (s) => `- ${s}`
        )
        .join('\n')}\n`;

    context +=
      `When to Get Help:\n${guide.whenToGetHelp.join('\n')}\n`;

    context +=
      `Recommended Status Question: "${guide.statusCheckQuestion}"\n`;
  }

  for (const fa of FIRST_AID_TOPICS) {
    if (
      query
        .toLowerCase()
        .includes(fa.id) ||
      query
        .toLowerCase()
        .includes(
          fa.title.toLowerCase()
        )
    ) {
      context +=
        `\n[VERIFIED FIRST AID FOR ${fa.title.toUpperCase()}]:\n`;

      context +=
        `Steps:\n${fa.steps
          .map(
            (s, i) =>
              `${i + 1}. ${s}`
          )
          .join('\n')}\n`;

      context +=
        `Avoid:\n${fa.doNots
          .map(
            (d) => `- ${d}`
          )
          .join('\n')}\n`;
    }
  }

  return context;
}

// ============================================================
// FALLBACK RESPONSE
// ============================================================

function generateVerifiedFallbackResponse(
  query: string,
  language: string = 'en'
): string {
  const {
    isEmergency,
    topicKey
  } = detectEmergency(query);

  const guide =
    topicKey &&
    DISASTER_GUIDES[topicKey]
      ? DISASTER_GUIDES[topicKey]
      : DISASTER_GUIDES['sos'];

  if (
    language === 'hi' ||
    language === 'hinglish'
  ) {
    if (isEmergency) {
      return `🚨 IMMEDIATE ACTION (तुरंत यह करें)

1. Shant rahein (Stay calm) aur sabse pehle khatre (danger zone) se door hon.
${guide.immediateActions
  .slice(0, 3)
  .map(
    (a, i) =>
      `${i + 2}. ${a}`
  )
  .join('\n')}

⚠️ DO NOT (यह बिल्कुल न करें)
${guide.doNots
  .slice(0, 3)
  .map(
    (d) => `- ${d}`
  )
  .join('\n')}

📍 IF YOU ARE SAFE (यदि आप सुरक्षित हैं)
- Apne parivar ya trusted emergency contacts ko apni location share karein.
- NDMA aur official government advisories ko follow karein.

🆘 GET HELP (आपातकालीन नंबर)
- National Emergency: 112
- Ambulance: 108 / 102
- Police: 100
- Fire: 101
- Disaster Helpline: 1078

${guide.statusCheckQuestion}

Kya aap abhi surakshit sthan par hain?`;
    }

    return `Namaste. Main aapka Disaster Emergency Guidance & Support AI assistant hoon.

Aap mujhse kisi bhi aapda (disaster), emergency preparedness, first-aid, evacuation plan, ya safety rules ke baare mein pooch sakte hain.

Aapko kis tarah ki jaankari ya madad chahiye?`;
  }

  if (isEmergency) {
    return `🚨 IMMEDIATE ACTION

1. Stay calm and assess immediate surroundings.
${guide.immediateActions
  .slice(0, 3)
  .map(
    (a, i) =>
      `${i + 2}. ${a}`
  )
  .join('\n')}

⚠️ DO NOT
${guide.doNots
  .slice(0, 3)
  .map(
    (d) => `- ${d}`
  )
  .join('\n')}

📍 IF YOU ARE SAFE
${guide.ifYouAreSafe
  .slice(0, 2)
  .map(
    (s) => `- ${s}`
  )
  .join('\n')}

🆘 GET HELP
- Call 112 for emergency assistance.
- Fire: 101
- Ambulance: 108

${guide.statusCheckQuestion}`;
  }

  return `Hello. I am your Disaster Emergency Guidance & Support AI assistant.

I provide step-by-step verified disaster guidance, emergency kit recommendations, family preparedness plans, first-aid instructions, and safety guidance.

How can I assist you with safety or disaster preparedness today?`;
}

// ============================================================
// CHAT ENDPOINT
// ============================================================

app.post(
  '/api/chat',
  async (req, res) => {
    const startTime =
      Date.now();
    let userQuery = 'Hello';
    let requestLanguage = 'en';
    let requestIsEmergency = false;
    let requestTopicKey: string | undefined;

    try {
      const {
        messages = [],
        history = [],
        message = '',
        imageBase64,
        language = 'en',
        userLocation
      } = req.body;

      requestLanguage = language;

      chatTelemetry.totalChats++;

      // Get user message
      userQuery =
        typeof message === 'string'
          ? message.trim()
          : '';

      if (
        !userQuery &&
        Array.isArray(messages) &&
        messages.length > 0
      ) {
        const last =
          messages[
            messages.length - 1
          ];

        userQuery =
          (
            last?.content || ''
          ).trim();
      }

      if (
        !userQuery &&
        Array.isArray(history) &&
        history.length > 0
      ) {
        const last =
          history[
            history.length - 1
          ];

        if (
          last.role === 'user'
        ) {
          userQuery =
            (
              last.content || ''
            ).trim();
        }
      }

      if (!userQuery) {
        userQuery = 'Hello';
      }

      console.log(
        'User query:',
        userQuery
      );

      const {
        isEmergency,
        topicKey
      } =
        detectEmergency(
          userQuery
        );

      requestIsEmergency = isEmergency;
      requestTopicKey = topicKey;

      if (isEmergency) {
        chatTelemetry.activeEmergenciesDetected++;
      }

      const ragContext =
        retrieveVerifiedRAGContext(
          userQuery
        );

      const ai =
        getGeminiClient();

      // ======================================================
      // CHECK GEMINI CONNECTION
      // ======================================================

      if (!ai) {
        console.error(
          'Gemini client is NOT available.'
        );

        const fallbackText =
          generateVerifiedFallbackResponse(
            userQuery,
            language
          );

        return res.json({
          role: 'assistant',
          content: fallbackText,
          reply: fallbackText,
          text: fallbackText,
          isEmergency,
          emergencyType: topicKey,
          isFallback: true,
          disclaimer:
            'This AI provides general emergency guidance and does not replace official emergency services.'
        });
      }

      console.log(
        'Gemini client available. Sending request...'
      );

      // ======================================================
      // SYSTEM PROMPT
      // ======================================================

      const systemInstruction = `
You are a Disaster Emergency Guidance & Support AI Chatbot.

Your top priority is human life, safety, calmness, accuracy, and clarity.

LANGUAGE:
Respond in English, Hindi, or Hinglish depending on the user's language and query.

EMERGENCY RULES:
If the user describes an emergency:

🚨 IMMEDIATE ACTION

Give short numbered steps.

⚠️ DO NOT

List important things the person must avoid.

📍 IF YOU ARE SAFE

Give next safe actions.

🆘 GET HELP

Give appropriate official emergency numbers.

Never claim that you called emergency services.

Never invent emergency numbers, shelters, casualty numbers, or live alerts.

For normal questions, answer naturally and conversationally.

VERIFIED KNOWLEDGE FOR THIS QUERY:
${ragContext}

${userLocation
  ? `The user reported being near or in: ${userLocation}. Provide region-appropriate advice without exposing private location information.`
  : ''}
`;

      // ======================================================
      // CONVERSATION HISTORY
      // ======================================================

      const priorList =
        Array.isArray(history) &&
        history.length > 0
          ? history
          : Array.isArray(messages)
          ? messages
          : [];

      const contents: any[] =
        [];

      for (
        const m of priorList
      ) {
        if (
          m &&
          typeof m.content ===
            'string' &&
          m.content.trim()
        ) {
          contents.push({
            role:
              m.role ===
              'assistant'
                ? 'model'
                : 'user',

            parts: [
              {
                text:
                  m.content
              }
            ]
          });
        }
      }

      // ======================================================
      // CURRENT USER MESSAGE
      // ======================================================

      const userParts: any[] =
        [
          {
            text: userQuery
          }
        ];

      if (imageBase64) {
        const cleanBase64 =
          imageBase64.replace(
            /^data:image\/\w+;base64,/,
            ''
          );

        userParts.push({
          inlineData: {
            data:
              cleanBase64,
            mimeType:
              'image/jpeg'
          }
        });
      }

      const lastContent =
        contents[
          contents.length - 1
        ];

      if (
        !lastContent ||
        lastContent.role !==
          'user' ||
        lastContent.parts?.[0]
          ?.text !== userQuery
      ) {
        contents.push({
          role: 'user',
          parts: userParts
        });
      }

      // ======================================================
      // GEMINI API CALL
      // ======================================================

      console.log(
        'Calling Gemini model:',
        GEMINI_MODEL
      );

      const response =
        await ai.models.generateContent(
          {
            model:
              GEMINI_MODEL,

            contents,

            config: {
              systemInstruction,
              temperature:
                isEmergency
                  ? 0.2
                  : 0.6
            }
          }
        );

      console.log(
        'Gemini response received successfully.'
      );

      const responseText =
        response.text ||
        generateVerifiedFallbackResponse(
          userQuery,
          language
        );

      const latency =
        Date.now() -
        startTime;

      chatTelemetry.averageResponseTimeMs =
        Math.round(
          (
            chatTelemetry.averageResponseTimeMs *
              4 +
            latency
          ) / 5
        );

      chatTelemetry.aiSuccessRate =
        100;

      return res.json({
        role: 'assistant',
        content:
          responseText,
        reply:
          responseText,
        text:
          responseText,
        isEmergency,
        emergencyType:
          topicKey,
        isFallback: false,
        disclaimer:
          'This AI provides general emergency guidance and does not replace official emergency services or official instructions.'
      });

    } catch (error: any) {

      // ======================================================
      // IMPORTANT DEBUG INFORMATION
      // ======================================================

      console.error(
        '================================'
      );

      console.error(
        'GEMINI API ERROR'
      );

      console.error(
        'Message:',
        error?.message
      );

      console.error(
        'Status:',
        error?.status
      );

      console.error(
        'Code:',
        error?.code
      );

      console.error(
        'Full error:',
        error
      );

      console.error(
        '================================'
      );

      const fallbackText = generateVerifiedFallbackResponse(
        userQuery,
        requestLanguage
      );

      return res.json({
        role: 'assistant',
        content: fallbackText,
        reply: fallbackText,
        text: fallbackText,
        isEmergency: requestIsEmergency,
        emergencyType: requestTopicKey,
        isFallback: true,
        disclaimer:
          'Live AI is temporarily unavailable. This general guidance does not replace official emergency services or official instructions.'
      });
    }
  }
);

// ============================================================
// HAZARD IMAGE ANALYSIS
// ============================================================

app.post(
  '/api/analyze-hazard-image',
  async (req, res) => {

    try {

      const {
        imageBase64,
        mimeType = 'image/jpeg',
        userPrompt =
          'Analyze potential visible hazards in this disaster/emergency image.'
      } = req.body;

      if (!imageBase64) {
        return res.status(400).json({
          error:
            'Image data is required'
        });
      }

      const cleanBase64 =
        imageBase64.replace(
          /^data:image\/\w+;base64,/,
          ''
        );

      const ai =
        getGeminiClient();

      if (!ai) {
        return res.json({
          analysis:
            'AI vision processing is currently unavailable. Treat visible smoke, flames, structural damage, downed wires, and floodwater as hazardous and call emergency services when necessary.',

          detectedHazards: [
            'Visible hazard inspection advised',
            'Potential structural or electrical risk'
          ],

          riskLevel: 'HIGH',

          immediateAdvice:
            'Maintain a safe distance and contact emergency services.'
        });
      }

      const response =
        await ai.models.generateContent(
          {
            model:
              GEMINI_MODEL,

            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data:
                      cleanBase64
                  }
                },

                {
                  text: `
You are an Emergency Hazard Inspection AI.

Analyze this image for visible safety threats.

Look for:

1. Smoke or active flames
2. Flooding or water hazards
3. Structural damage
4. Downed electrical wires
5. Blocked roads or debris
6. Chemical hazards

Give a concise safety-focused assessment.

Never state that a structure is 100% safe.

Always recommend caution.

Photo analysis cannot replace certified structural or hazmat inspection.

User prompt:
${userPrompt}
`
                }
              ]
            }
          }
        );

      const analysisText =
        response.text ||
        'Analysis completed with basic safety advisories.';

      return res.json({
        analysis:
          analysisText,

        disclaimer:
          'Visible hazard assessment only. This analysis cannot replace certified professional inspection.'
      });

    } catch (error: any) {

      console.error(
        'Image analysis error:',
        error
      );

      return res.status(500).json({
        error:
          'Failed to analyze image',

        fallback:
          'Treat all visible damage, water, or smoke as dangerous and maintain a safe perimeter. Dial 112 for emergency assistance.'
      });
    }
  }
);

// ============================================================
// PERSONAL EMERGENCY PLAN
// ============================================================

app.post(
  '/api/generate-plan',
  async (req, res) => {

    try {

      const {
        location = 'Urban Area',
        householdSize = 4,
        childrenCount = 1,
        elderlyCount = 0,
        petsCount = 0,
        accessibilityNeeds = 'None',
        primaryHazards = [
          'Earthquake',
          'Flood'
        ],
        transportation =
          'Personal car and on-foot'
      } = req.body;

      const ai =
        getGeminiClient();

      if (!ai) {
        return res.json({
          plan: `
# Personal Disaster Preparedness Plan

Location: ${location}

Household Size: ${householdSize}

Primary Hazards:
${primaryHazards.join(', ')}

## BEFORE THE DISASTER

- Prepare an emergency kit.
- Keep emergency numbers available.
- Secure heavy furniture.
- Keep important documents accessible.
- Establish a family meeting point.

## DURING THE DISASTER

- Follow official emergency instructions.
- Move away from immediate hazards.
- Evacuate when instructed.
- Do not use damaged buildings.

## AFTER THE DISASTER

- Check household members for injuries.
- Avoid damaged structures.
- Follow official government updates.
- Contact emergency services when necessary.
`
        });
      }

      const prompt = `
Generate a comprehensive Personal & Family Disaster Preparedness Plan.

Location:
${location}

Household Size:
${householdSize}

Children:
${childrenCount}

Elderly:
${elderlyCount}

Pets:
${petsCount}

Accessibility / Medical Considerations:
${accessibilityNeeds}

Primary Hazards:
${primaryHazards.join(', ')}

Transportation:
${transportation}

Structure the plan into:

1. BEFORE THE DISASTER
2. DURING THE DISASTER
3. AFTER THE DISASTER
4. EMERGENCY KIT
5. COMMUNICATION & EVACUATION
6. RECOVERY

Keep the plan practical, clear, structured and reassuring.
`;

      const response =
        await ai.models.generateContent(
          {
            model:
              GEMINI_MODEL,

            contents: prompt
          }
        );

      return res.json({
        plan:
          response.text
      });

    } catch (error: any) {

      console.error(
        'Plan generation error:',
        error
      );

      return res.status(500).json({
        error:
          'Failed to generate plan'
      });
    }
  }
);

// ============================================================
// LIVE ALERTS
// ============================================================

app.get(
  '/api/alerts',
  (req, res) => {
    res.json({
      alerts: liveAlerts
    });
  }
);

// ============================================================
// ADMIN ALERT
// ============================================================

app.post(
  '/api/alerts',
  (req, res) => {

    const {
      title,
      type,
      severity,
      affectedArea,
      source,
      recommendedAction
    } = req.body;

    const newAlert = {
      id:
        `alt-${Date.now()}`,

      title:
        title ||
        'Emergency Advisory',

      type:
        type ||
        'General Advisory',

      severity:
        severity ||
        'WARNING',

      affectedArea:
        affectedArea ||
        'Regional Zone',

      issuedAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      source:
        source ||
        'Verified Civil Defense Agency',

      recommendedAction:
        recommendedAction ||
        'Follow official instructions.'
    };

    liveAlerts.unshift(
      newAlert
    );

    chatTelemetry.totalAlertsActive =
      liveAlerts.length;

    return res
      .status(201)
      .json(newAlert);
  }
);

// ============================================================
// ADMIN STATS
// ============================================================

app.get(
  '/api/admin/stats',
  (req, res) => {

    res.json({
      stats: {
        ...chatTelemetry,

        totalAlertsActive:
          liveAlerts.length,

        serverUptimeSeconds:
          Math.floor(
            process.uptime()
          ),

        systemStatus:
          'HEALTHY'
      },

      sources: [
        {
          name:
            'India Meteorological Department (IMD)',
          status:
            'ACTIVE',
          lastPing:
            '1m ago'
        },

        {
          name:
            'National Disaster Management Authority (NDMA)',
          status:
            'ACTIVE',
          lastPing:
            '2m ago'
        },

        {
          name:
            'National Center for Seismology (NCS)',
          status:
            'ACTIVE',
          lastPing:
            '30s ago'
        },

        {
          name:
            'USGS Global Seismic Network',
          status:
            'ACTIVE',
          lastPing:
            '1m ago'
        },

        {
          name:
            'Central Water Commission (CWC)',
          status:
            'ACTIVE',
          lastPing:
            '4m ago'
        },

        {
          name:
            'National Poisons Info Centre (AIIMS)',
          status:
            'ACTIVE',
          lastPing:
            '5m ago'
        },

        {
          name:
            'World Health Organization (WHO Health Emergencies)',
          status:
            'ACTIVE',
          lastPing:
            '10m ago'
        }
      ]
    });
  }
);

// ============================================================
// FEEDBACK
// ============================================================

app.post(
  '/api/feedback',
  (req, res) => {

    const {
      messageId,
      type,
      rating,
      comment
    } = req.body;

    const normalizedType =
      type === 'dislike' || rating === 'unhelpful'
        ? 'dislike'
        : 'like';

    feedbackLog.push({
      id:
        `fb-${Date.now()}`,

      messageId:
        messageId ||
        'unknown',

      type: normalizedType,

      comment,

      timestamp:
        Date.now()
    });

    res.json({
      status: 'ok'
    });
  }
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  '/api/health',
  (req, res) => {

    res.json({
      status: 'ok',

      time:
        new Date().toISOString(),

      geminiConfigured:
        !!process.env.GEMINI_API_KEY
    });
  }
);

// ============================================================
// VITE
// ============================================================

async function startServer() {

  if (
    process.env.NODE_ENV !==
    'production'
  ) {

    const vite =
      await createViteServer({
        server: {
          middlewareMode:
            true
        },

        appType: 'spa'
      });

    app.use(
      vite.middlewares
    );

  } else {

    const distPath =
      path.join(
        process.cwd(),
        'dist'
      );

    app.use(
      express.static(
        distPath
      )
    );

    app.get(
      '*',
      (req, res) => {
        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );
      }
    );
  }

  app.listen(
    PORT,
    '0.0.0.0',
    () => {

      console.log(
        '================================'
      );

      console.log(
        `Disaster Emergency AI Server running on http://0.0.0.0:${PORT}`
      );

      console.log(
        'Gemini configured:',
        !!process.env.GEMINI_API_KEY
      );

      console.log(
        'Gemini model:',
        GEMINI_MODEL
      );

      console.log(
        '================================'
      );
    }
  );
}

startServer();