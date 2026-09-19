import { AlertItem, EmergencyContact, EmergencyKitItem, QuizQuestion } from '../types';

export interface DisasterGuide {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  category: string;
  immediateActions: string[];
  doNots: string[];
  ifYouAreSafe: string[];
  whenToGetHelp: string[];
  indoorGuidance: string[];
  outdoorGuidance: string[];
  vehicleGuidance: string[];
  statusCheckQuestion: string;
}

export const DISASTER_GUIDES: Record<string, DisasterGuide> = {
  fire: {
    id: 'fire',
    name: 'Fire Emergency',
    hindiName: 'आग / Fire Emergency',
    icon: '🔥',
    category: 'hazard',
    immediateActions: [
      'Raise alarm immediately — shout "FIRE!" and trigger the building alarm.',
      'Evacuate immediately via the nearest marked fire exit or stairs. NEVER use elevators.',
      'Stay low to the floor if there is smoke — crawl where air is cleanest and coolest.',
      'Check doors with the back of your hand before opening. If hot, DO NOT OPEN.',
      'Once outside, gather at the assembly point at least 150 feet away and call 101 / 112.'
    ],
    doNots: [
      'DO NOT use elevators under any circumstance.',
      'DO NOT re-enter the building for pets, phones, or valuables.',
      'DO NOT open a door if the handle or surface feels warm or smoke is seeping through.',
      'DO NOT hide in closets or under beds — firefighters need to locate you.'
    ],
    ifYouAreSafe: [
      'Account for all family members and colleagues at the designated meeting point.',
      'Report any missing or trapped individuals to arriving firefighters with exact location.',
      'Treat minor burns under cool, running water for at least 10–20 minutes. Do not apply ice or butter.'
    ],
    whenToGetHelp: [
      'Call emergency services (101 or 112) immediately even if the fire seems small.',
      'Request medical assistance for smoke inhalation, coughing, burns, or dizziness.'
    ],
    indoorGuidance: [
      'If trapped: seal doors with damp towels or clothing, open a window for ventilation, and wave a bright cloth to signal help.',
      'If your clothes catch fire: STOP, DROP to the ground, and ROLL back and forth to smother flames.'
    ],
    outdoorGuidance: [
      'Keep well clear of smoke plumes and burning structures.',
      'Keep access roads clear for fire trucks and emergency vehicles.'
    ],
    vehicleGuidance: [
      'Pull over safely away from buildings and trees, turn off ignition, and evacuate immediately.'
    ],
    statusCheckQuestion: 'Are you currently outside the building and in a safe area?'
  },
  earthquake: {
    id: 'earthquake',
    name: 'Earthquake',
    hindiName: 'भूकंप / Earthquake',
    icon: '🌍',
    category: 'natural',
    immediateActions: [
      'DROP to your hands and knees immediately so the tremor cannot knock you down.',
      'COVER your head and neck under a sturdy table, desk, or against an interior wall.',
      'HOLD ON to your shelter until all shaking completely stops (be prepared to move with it).',
      'Stay away from glass windows, heavy bookcases, chandeliers, and unanchored appliances.',
      'If in bed, stay there, protect your head with a firm pillow.'
    ],
    doNots: [
      'DO NOT run outside during the shaking — falling glass and masonry kill most victims.',
      'DO NOT stand under doorways — modern doorways are no stronger than the rest of the wall.',
      'DO NOT use elevators or light matches / candles due to possible severed gas lines.',
      'DO NOT rush through stairwells while shaking is active.'
    ],
    ifYouAreSafe: [
      'Check yourself and others for injuries; administer basic first aid.',
      'Inspect your home for severed gas pipes (smell of rotten eggs), electrical sparks, or water leaks. Shut off main valves if trained.',
      'Expect aftershocks. Each time shaking recurs, Drop, Cover, and Hold On.',
      'Tune into official battery-powered radio or civil defense broadcasts.'
    ],
    whenToGetHelp: [
      'If anyone is trapped under heavy debris, call 112 / search & rescue immediately.',
      'If you smell gas or see arcing electrical lines, evacuate immediately and notify authorities.'
    ],
    indoorGuidance: [
      'Stay indoors until shaking stops and you confirm exiting is structurally safe.'
    ],
    outdoorGuidance: [
      'Move to a clear open area away from tall buildings, power lines, streetlights, and overpasses.'
    ],
    vehicleGuidance: [
      'Safely pull over to the shoulder away from overpasses, bridges, power lines, and tall trees. Stay inside with the emergency brake engaged until shaking ceases.'
    ],
    statusCheckQuestion: 'Has the shaking stopped, and are you or anyone around you injured?'
  },
  flood: {
    id: 'flood',
    name: 'Flood & Flash Flood',
    hindiName: 'बाढ़ / Flood',
    icon: '🌊',
    category: 'water',
    immediateActions: [
      'Move to higher ground immediately. Do not wait for instructions if water is rising.',
      'Avoid walking or wading through moving water — as little as 6 inches of rapid water can sweep an adult off their feet.',
      'Turn Off main electrical power and gas switches before water reaches your premises if safe to do so.',
      'Stay off bridges over fast-moving water — bridges can collapse without warning.'
    ],
    doNots: [
      'DO NOT drive through flooded streets — "Turn Around, Don\'t Drown". 12 inches of water will float most sedans.',
      'DO NOT drink tap water without boiling or purifying — floodwaters heavily contaminate supply lines.',
      'DO NOT touch submerged electrical appliances or downed power lines.'
    ],
    ifYouAreSafe: [
      'Keep your emergency radio on for evacuation updates from NDMA / local civil authorities.',
      'Drink only bottled or boiled water; discard any food that touched floodwater.',
      'Watch out for snakes, spiders, and displaced animals seeking shelter indoors.'
    ],
    whenToGetHelp: [
      'If water levels are trapping you on an upper floor, call 112 / 1078 or local flood rescue.',
      'Signal rescue boats or helicopters using a bright sheet or mirror from your rooftop.'
    ],
    indoorGuidance: [
      'Move to the second floor or attic only if you have an exit to the roof. Never become trapped in a closed attic without roof egress.'
    ],
    outdoorGuidance: [
      'Climb to high ground; never camp or walk along drainage channels or riverbanks.'
    ],
    vehicleGuidance: [
      'If your car stalls in rising water, abandon it immediately and climb to high ground if you can safely exit.'
    ],
    statusCheckQuestion: 'What is the current water level around you, and do you have a path to higher ground?'
  },
  cyclone: {
    id: 'cyclone',
    name: 'Cyclone / Hurricane / Typhoon',
    hindiName: 'चक्रवात / Cyclone',
    icon: '🌀',
    category: 'weather',
    immediateActions: [
      'Move to a designated storm shelter or the most interior windowless room on the lowest floor.',
      'Secure or bring inside all outdoor furniture, loose tiles, garbage bins, and tin sheets.',
      'Close all hurricane shutters or board up glass windows; tape will NOT prevent breaking.',
      'Charge all phones, battery banks, and emergency flashlights before the grid fails.',
      'Store at least 3–5 days of clean drinking water in sealed vessels.'
    ],
    doNots: [
      'DO NOT venture outside during the "eye of the storm" when the wind briefly goes calm — extreme winds will suddenly return from the opposite direction.',
      'DO NOT stay in temporary tin-roof shacks or low-lying coastal surge zones.',
      'DO NOT touch fallen power lines or trees tangled with wires.'
    ],
    ifYouAreSafe: [
      'Remain sheltered until local civil defense or meteorological authorities declare the storm has passed.',
      'Inspect roof and walls cautiously for structural instability.',
      'Beware of secondary hazards: flash flooding, mudslides, and electrocution.'
    ],
    whenToGetHelp: [
      'Contact emergency rescue if roofs collapse or storm surge breaches your shelter.'
    ],
    indoorGuidance: ['Stay in interior bathrooms, hallways, or under reinforced stairwells.'],
    outdoorGuidance: ['Evacuate early if in an evacuation zone; do not delay.'],
    vehicleGuidance: ['Do not drive during peak gale force winds; flying debris will shatter windshields.'],
    statusCheckQuestion: 'Are you currently inside a reinforced masonry shelter away from glass windows?'
  },
  tsunami: {
    id: 'tsunami',
    name: 'Tsunami',
    hindiName: 'सुनामी / Tsunami',
    icon: '🌊',
    category: 'ocean',
    immediateActions: [
      'Move inland and climb to high ground (at least 100 feet above sea level or 2 miles inland) IMMEDIATELY.',
      'If you feel a strong earthquake near the coast or notice the ocean suddenly receding, DO NOT WAIT for an official siren — EVACUATE NOW.',
      'Stay away from the beach. Never go to the shore to watch a tsunami wave arrive.',
      'Remember: A tsunami is a series of waves, and subsequent waves are often much larger than the first.'
    ],
    doNots: [
      'DO NOT wait for visual confirmation of the wave.',
      'DO NOT return to the shore after the first wave recedes; destructive waves can continue for hours.',
      'DO NOT take elevators in coastal buildings unless evacuating vertically to 4th floor or higher in reinforced concrete structures.'
    ],
    ifYouAreSafe: [
      'Stay on high ground until official all-clear signals are given by disaster authorities.'
    ],
    whenToGetHelp: [
      'Coordinate with official search and rescue staging areas on designated safe hills.'
    ],
    indoorGuidance: ['Vertical evacuation: Use 4th floor or higher of engineered concrete hotels/buildings if high ground cannot be reached in time.'],
    outdoorGuidance: ['Sprint inland towards hills or high ridges.'],
    vehicleGuidance: ['Expect severe traffic gridlock. If roads stall, abandon vehicle and proceed on foot to high ground.'],
    statusCheckQuestion: 'How far inland or how high above sea level are you right now?'
  },
  landslide: {
    id: 'landslide',
    name: 'Landslide & Mudflow',
    hindiName: 'भूस्खलन / Landslide',
    icon: '⛰️',
    category: 'geological',
    immediateActions: [
      'Move quickly out of the direct path of the slide or debris flow to the nearest stable ridge.',
      'Listen for unusual sounds like trees cracking, boulders knocking together, or sudden muddy stream surges.',
      'If escape is impossible, curl into a tight ball and protect your head with your arms.'
    ],
    doNots: [
      'DO NOT cross rivers or channels where mud and debris are building up.',
      'DO NOT return to the slide area immediately — secondary slides frequently follow.'
    ],
    ifYouAreSafe: [
      'Check for injured or trapped persons near the slide perimeter without entering the slide path.',
      'Report broken utility lines and road blockages to civil authorities.'
    ],
    whenToGetHelp: ['Alert NDRF / disaster emergency teams (1078 or 112) immediately.'],
    indoorGuidance: ['Move to the second story or roof on the uphill side of the structure if trapped.'],
    outdoorGuidance: ['Run perpendicular to the slide path towards high, stable bedrock.'],
    vehicleGuidance: ['Watch for collapsed pavement, mud on roads, and falling rocks along cliff roads.'],
    statusCheckQuestion: 'Are you clear of the slope edge and debris flow path?'
  },
  lightning: {
    id: 'lightning',
    name: 'Lightning & Severe Storm',
    hindiName: 'आकाशीय बिजली / Lightning',
    icon: '⚡',
    category: 'weather',
    immediateActions: [
      '"When Thunder Roars, Go Indoors!" Seek shelter inside an enclosed building or metal-topped hardtop vehicle.',
      'Stay away from windows, doors, and corded phones.',
      'Unplug sensitive electronic devices before the storm hits.'
    ],
    doNots: [
      'DO NOT stand under tall, isolated trees or near metal poles/fences.',
      'DO NOT stay in open fields, golf courses, or on hilltops.',
      'DO NOT swim or stay in lakes, pools, or open water.',
      'DO NOT shower or use plumbing fixtures during intense lightning.'
    ],
    ifYouAreSafe: [
      'Wait 30 minutes after the last clap of thunder before heading back outside.',
      'If someone is struck by lightning, they carry NO electrical charge and are safe to touch — begin CPR immediately if unresponsive.'
    ],
    whenToGetHelp: ['Call 112 / ambulance immediately for lightning strike victims.'],
    indoorGuidance: ['Avoid corded electrical appliances, sinks, and concrete walls with rebar.'],
    outdoorGuidance: ['If caught in open with no shelter: crouch down on balls of your feet with heels touching, head between knees. Never lie flat.'],
    vehicleGuidance: ['Hardtop metal vehicles are safe (faraday cage effect). Avoid touching outer metal bodywork.'],
    statusCheckQuestion: 'Are you currently inside a fully enclosed building or metal-topped vehicle?'
  },
  chemical: {
    id: 'chemical',
    name: 'Chemical Hazard / Gas Leak',
    hindiName: 'रासायनिक रिसाव / Chemical Hazard',
    icon: '☣️',
    category: 'industrial',
    immediateActions: [
      'Move UPWIND and UPHILL immediately away from the source of the vapor cloud or spill.',
      'Cover your nose and mouth with a damp cloth or mask to filter airborne particulates.',
      'If instructed to shelter-in-place: close all windows, doors, and fireplace dampers; turn off HVAC, fans, and ventilation systems; seal gaps with plastic sheeting and duct tape.'
    ],
    doNots: [
      'DO NOT walk through spilled liquids or vapor plumes.',
      'DO NOT use open flames, lighters, or light switches if flammable gas is suspected.',
      'DO NOT consume uncovered food or water near the contaminated perimeter.'
    ],
    ifYouAreSafe: [
      'Remove contaminated outer clothing without pulling it over your face (cut if needed) and seal in a plastic bag.',
      'Gently wash skin and eyes with copious amounts of clean water for 15 minutes.'
    ],
    whenToGetHelp: ['Call 112 / Hazardous Materials (Hazmat) teams and Poison Control.'],
    indoorGuidance: ['Shelter in an above-ground interior room with the fewest windows (dense gases settle in basements).'],
    outdoorGuidance: ['Check wind flags or tree movement to travel crosswind and then upwind away from the plume.'],
    vehicleGuidance: ['Roll up windows, turn air vents to "Recirculate", and drive away perpendicular to wind direction.'],
    statusCheckQuestion: 'Are you experiencing any burning in your eyes, throat, or difficulty breathing?'
  },
  medical: {
    id: 'medical',
    name: 'Medical Emergency',
    hindiName: 'चिकित्सा आपातकाल / Medical Emergency',
    icon: '🏥',
    category: 'health',
    immediateActions: [
      'Ensure the scene is safe for you before approaching the patient.',
      'Check for responsiveness: tap shoulders firmly and shout "Are you okay?".',
      'Check breathing: look, listen, and feel for chest movement (5–10 seconds).',
      'If unresponsive and not breathing normally: call 112 / 102/108 immediately and begin CPR (hard and fast in the center of the chest at 100–120 bpm).'
    ],
    doNots: [
      'DO NOT move a person with suspected spine or neck trauma unless in imminent danger (e.g., burning car).',
      'DO NOT give food, water, or medicine to an unconscious or drowsy person.',
      'DO NOT remove deeply embedded objects from wounds (stabilize them in place).'
    ],
    ifYouAreSafe: [
      'Keep the patient warm, calm, and reassured while awaiting emergency medical technicians.'
    ],
    whenToGetHelp: [
      'Call 112 / 108 immediately for chest pain, difficulty breathing, severe bleeding, stroke symptoms (FAST: Face drooping, Arm weakness, Speech difficulty), or loss of consciousness.'
    ],
    indoorGuidance: ['Clear a pathway for ambulance stretchers; unlock outer doors and turn on porch lights.'],
    outdoorGuidance: ['Send a bystander to wave and guide the approaching ambulance.'],
    vehicleGuidance: ['Never transport an unstable trauma patient in an ordinary car if ambulance ETA is reasonable.'],
    statusCheckQuestion: 'Is the patient conscious and breathing normally right now?'
  },
  roadAccident: {
    id: 'roadAccident',
    name: 'Road Accident',
    hindiName: 'सड़क दुर्घटना / Road Accident',
    icon: '🚗',
    category: 'traffic',
    immediateActions: [
      'Protect the crash scene: turn on hazard flashers, set up warning triangles 50 meters back, and turn off ignitions of crashed cars.',
      'Call emergency services (112 / 108 / 100) with exact kilometer marker, highway number, or landmarks.',
      'Check for severe bleeding and apply firm, direct pressure with a clean cloth.'
    ],
    doNots: [
      'DO NOT remove helmets from motorcycle crash victims unless airway is completely blocked.',
      'DO NOT move injured victims from seats unless the car is on fire or sinking.',
      'DO NOT smoke or use open flames near crash sites due to spilled gasoline.'
    ],
    ifYouAreSafe: [
      'Keep traffic flowing away from the accident scene; prevent rubbernecking hazards.'
    ],
    whenToGetHelp: ['Call 112 immediately. Good Samaritan laws protect you when assisting in good faith.'],
    indoorGuidance: ['N/A'],
    outdoorGuidance: ['Stand behind roadside crash barriers, never on an active highway lane.'],
    vehicleGuidance: ['Keep seatbelts fastened until you verify no secondary collisions are incoming.'],
    statusCheckQuestion: 'Is anyone trapped inside the vehicle or suffering from severe bleeding?'
  },
  drowning: {
    id: 'drowning',
    name: 'Drowning Incident',
    hindiName: 'डूबना / Drowning Emergency',
    icon: '🌊',
    category: 'water',
    immediateActions: [
      'Remember: "Reach or Throw, Don\'t Go!" Use a long pole, branch, towel, or throw a life ring or buoyant object.',
      'Call 112 / lifeguards immediately.',
      'Once the victim is safely on land, check responsiveness and breathing.',
      'If not breathing: begin CPR immediately — give 2 rescue breaths followed by 30 chest compressions, repeating continuously.'
    ],
    doNots: [
      'DO NOT enter the water yourself unless you are trained in water rescue and have flotation gear — drowning victims will instinctively push rescuers under.',
      'DO NOT attempt the Heimlich maneuver / abdominal thrusts to "clear water" from lungs.'
    ],
    ifYouAreSafe: [
      'Remove wet clothing, wrap victim in dry blankets to prevent hypothermia, and monitor airway continuously.'
    ],
    whenToGetHelp: ['Every person pulled from near-drowning requires emergency hospital evaluation for secondary pulmonary edema ("dry drowning").'],
    indoorGuidance: ['Pool safety: immediately cut power to pool pumps/filters.'],
    outdoorGuidance: ['Stay tethered to shore during open-water rescue attempts.'],
    vehicleGuidance: ['If a vehicle enters water: unbuckle, open or shatter side windows immediately (use headrest metal prongs) before water pressure equalizes.'],
    statusCheckQuestion: 'Is the person out of the water, and are they breathing?'
  },
  sos: {
    id: 'sos',
    name: 'General SOS Alert',
    hindiName: 'सामान्य आपातकालीन सहायता / SOS',
    icon: '🆘',
    category: 'emergency',
    immediateActions: [
      'Assess immediate danger: if your life is threatened, dial 112 / 911 immediately.',
      'Share your live GPS coordinates or nearest identifiable landmark with trusted emergency contacts.',
      'Move to a defensible, visible, or sheltered location away from hazards.',
      'Keep your device battery in power-saving mode and avoid unnecessary calls.'
    ],
    doNots: [
      'DO NOT panic — focus on breathing deeply and executing step-by-step safety actions.',
      'DO NOT silence emergency broadcasts or ignore evacuation orders from authorities.'
    ],
    ifYouAreSafe: [
      'Maintain contact with your designated family emergency contact point.',
      'Check on vulnerable neighbors, children, and elderly if physically safe to do so.'
    ],
    whenToGetHelp: ['Trigger your SOS broadcast now to notify personal emergency contacts and access rapid helpline numbers.'],
    indoorGuidance: ['Secure doors and windows; have your Go-Bag ready at the exit.'],
    outdoorGuidance: ['Stay in well-lit, open areas away from unstable structures or flood zones.'],
    vehicleGuidance: ['Lock doors, keep hazard flashers engaged, and remain visible.'],
    statusCheckQuestion: 'Are you in immediate physical danger right now?'
  }
};

export const OFFICIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'c-112',
    name: 'National Emergency Helpline (India & EU)',
    role: 'All-in-One Police, Fire, Medical, Disaster',
    number: '112',
    isOfficial: true,
    category: 'national',
    description: 'Universal emergency number available 24/7 from any phone even without SIM.'
  },
  {
    id: 'c-100',
    name: 'Police Emergency',
    role: 'Law Enforcement & Security',
    number: '100',
    isOfficial: true,
    category: 'police',
    description: 'Immediate police response for criminal threats, public disorder, or accidents.'
  },
  {
    id: 'c-101',
    name: 'Fire & Rescue Service',
    role: 'Fire Extinguishment & Technical Rescue',
    number: '101',
    isOfficial: true,
    category: 'fire',
    description: 'Fire brigades, structural collapses, and hazmat response.'
  },
  {
    id: 'c-108',
    name: 'Emergency Medical Ambulance',
    role: 'Emergency Medical Technicians & Critical Care',
    number: '108',
    isOfficial: true,
    category: 'ambulance',
    description: 'Free emergency ambulance service across most Indian states.'
  },
  {
    id: 'c-102',
    name: 'Maternity & Child Ambulance',
    role: 'Maternal & Neonatal Transport',
    number: '102',
    isOfficial: true,
    category: 'ambulance',
    description: 'Dedicated maternal and infant emergency transfer.'
  },
  {
    id: 'c-1078',
    name: 'NDMA Disaster Control Room',
    role: 'National Disaster Management Authority',
    number: '1078',
    isOfficial: true,
    category: 'disaster',
    description: 'Central disaster response coordination and NDRF deployment.'
  },
  {
    id: 'c-1070',
    name: 'State Disaster Emergency Operation',
    role: 'State Disaster Relief Commission',
    number: '1070',
    isOfficial: true,
    category: 'disaster',
    description: 'State-level disaster relief and evacuation coordination.'
  },
  {
    id: 'c-1091',
    name: 'Women Helpline',
    role: 'Women in Distress & Crisis Support',
    number: '1091',
    isOfficial: true,
    category: 'police',
    description: '24/7 dedicated assistance for women in emergency situations.'
  },
  {
    id: 'c-1098',
    name: 'Childline Emergency',
    role: 'Children Rescue & Protection',
    number: '1098',
    isOfficial: true,
    category: 'police',
    description: 'Crisis care and emergency rescue for distressed children.'
  },
  {
    id: 'c-poison',
    name: 'National Poisons Information Centre (AIIMS)',
    role: 'Toxicology & Poison Overdose Guidance',
    number: '1800116117',
    isOfficial: true,
    category: 'poison',
    description: 'Toll-free poison management consultation.'
  },
  {
    id: 'c-911',
    name: 'US / International Standard Emergency',
    role: 'North American Emergency Dispatch',
    number: '911',
    isOfficial: true,
    category: 'national',
    description: 'United States & Canada nationwide emergency services.'
  }
];

export const FIRST_AID_TOPICS = [
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    severity: 'Life-Threatening',
    icon: '🩸',
    steps: [
      'Call emergency medical services (112 / 108) immediately.',
      'Protect yourself: wear disposable gloves or use a clean plastic barrier.',
      'Apply direct, firm pressure on the wound using a sterile gauze pad or cleanest cloth available.',
      'Do NOT remove the cloth if it soaks through; place more pads on top and press harder.',
      'Maintain continuous pressure for at least 10–15 minutes without lifting to check.',
      'If bleeding from an arm or leg does not stop and you are trained, apply an emergency tourniquet 2–3 inches above the wound (never over a joint) and record the time applied.'
    ],
    doNots: [
      'Do not wash deep wounds with running water.',
      'Do not remove embedded objects (e.g., knives, glass) — pack pads around them to stabilize.',
      'Do not loosen a tourniquet once applied.'
    ]
  },
  {
    id: 'cpr',
    title: 'Adult CPR (Hands-Only & Full)',
    severity: 'Life-Threatening',
    icon: '🫀',
    steps: [
      'Verify patient is unresponsive and not breathing normally (gasping is NOT normal breathing).',
      'Call 112 / 108 and send someone to find an Automated External Defibrillator (AED).',
      'Place heel of one hand in the center of the chest (lower half of sternum), interlock your other hand on top.',
      'Keep arms straight, position shoulders directly over hands.',
      'Push HARD and FAST: compress chest 2 to 2.4 inches deep at a tempo of 100–120 beats per minute (to the rhythm of "Stayin\' Alive").',
      'Allow the chest to recoil fully between compressions without bouncing.',
      'Continue until professional medical personnel take over, an AED is ready, or the person clearly wakes up.'
    ],
    doNots: [
      'Do not interrupt compressions for more than 10 seconds.',
      'Do not hesitate: Hands-only CPR doubles or triples cardiac arrest survival rates.'
    ]
  },
  {
    id: 'burns',
    title: 'Burns & Scalds',
    severity: 'Urgent',
    icon: '🔥',
    steps: [
      'Cool the burn immediately with cool, running water for 10 to 20 minutes.',
      'Gently remove rings, watches, or restrictive clothing before swelling starts.',
      'Cover the burn loosely with clean cling film (plastic wrap) or a sterile non-stick bandage.',
      'Keep the patient warm with a clean blanket to prevent hypothermia.',
      'Seek immediate emergency care if the burn is larger than the palm, involves the face, hands, feet, or groin, or appears charred/white (3rd degree).'
    ],
    doNots: [
      'Do NOT apply ice, iced water, butter, oil, toothpaste, or turmeric powder.',
      'Do NOT break blisters or peel away clothing stuck to charred flesh.',
      'Do NOT use fluffy cotton wool dressings that can stick to the raw surface.'
    ]
  },
  {
    id: 'choking',
    title: 'Choking (Conscious Adult/Child)',
    severity: 'Life-Threatening',
    icon: '🗣️',
    steps: [
      'Ask: "Are you choking?". If they cannot speak, cough forcefully, or breathe, act immediately.',
      'Give 5 back blows: lean victim forward, support chest with one hand, strike firmly between shoulder blades with heel of hand.',
      'If back blows fail, give 5 abdominal thrusts (Heimlich maneuver): stand behind, wrap arms around waist, make a fist above the navel, grasp with other hand, pull sharply inward and upward.',
      'Alternate between 5 back blows and 5 abdominal thrusts until object is expelled or person loses consciousness.',
      'If victim becomes unconscious: lower carefully to floor, call 112, and start CPR compressions.'
    ],
    doNots: [
      'Do NOT slap the back if the person is coughing loudly — coughing is the most effective way to clear the airway.',
      'Do NOT do blind finger sweeps in the throat (may push object deeper).'
    ]
  },
  {
    id: 'heatstroke',
    title: 'Heat Stroke & Heat Exhaustion',
    severity: 'Urgent to Critical',
    icon: '☀️',
    steps: [
      'Heat Stroke is an acute emergency (confusion, core temp > 104°F/40°C, hot flushed dry or sweating skin, loss of consciousness).',
      'Call 112 / 108 immediately.',
      'Move person to a shaded, air-conditioned or ventilated area.',
      'Cool rapidly: immerse in cool water or place ice packs in armpits, neck, and groin.',
      'Mist skin with cool water and fan vigorously.',
      'If conscious and alert: give sips of cool water or electrolyte solution.'
    ],
    doNots: [
      'Do NOT give fluids if patient is drowsy, confused, or vomiting.',
      'Do NOT give fever-reducing medications like aspirin or paracetamol (they are ineffective for heat stroke and harm the liver/kidneys).'
    ]
  },
  {
    id: 'fractures',
    title: 'Fractures & Sprains',
    severity: 'Urgent',
    icon: '🦴',
    steps: [
      'Keep the injured limb still and supported in the position found.',
      'For open fractures (bone through skin): cover with sterile dressing and control bleeding with gentle pressure around wound.',
      'Immobilize the joint above and below the fracture with a rolled towel, cardboard splint, or sling.',
      'Apply an ice pack wrapped in a cloth for 15–20 minutes to reduce swelling.',
      'Transport to orthopedic emergency facility.'
    ],
    doNots: [
      'Do NOT attempt to push back protruding bone or straighten a deformed limb.',
      'Do NOT test the limb by having the person walk or bend it.'
    ]
  },
  {
    id: 'electric_shock',
    title: 'Electric Shock',
    severity: 'Life-Threatening',
    icon: '⚡',
    steps: [
      'DO NOT touch the victim until you have confirmed the electrical source is turned OFF.',
      'Switch off circuit breaker or pull power plug. If impossible, use dry non-conductive object (dry wooden broom, plastic pipe) to separate victim.',
      'Call 112 / ambulance.',
      'Once safe, check responsiveness and breathing; begin CPR if not breathing.',
      'Check for entry and exit burn marks; cover loosely with sterile dry dressings.'
    ],
    doNots: [
      'Never touch a person connected to high-voltage power lines — stay at least 30 feet away and call power utility.'
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning & Chemical Ingestion',
    severity: 'Urgent',
    icon: '🧪',
    steps: [
      'Call National Poison Control (1800-116-117 in India or 1-800-222-1222 in US) or 112 immediately.',
      'Keep the chemical container, bottle, or packaging ready to read ingredients to the doctor.',
      'If on skin or eyes, irrigate with clean running water for 15 minutes.',
      'If fumes inhaled, get victim to fresh air immediately.'
    ],
    doNots: [
      'Do NOT induce vomiting unless specifically ordered by poison control (corrosives like acids/bleach will re-burn esophagus on the way up).',
      'Do NOT give raw eggs, milk, or salt water.'
    ]
  }
];

export const DEFAULT_EMERGENCY_KIT_ITEMS: EmergencyKitItem[] = [
  // Water
  { id: 'k-w1', name: 'Water (1 gallon / 4 liters per person per day for 3 days)', category: 'water', essential: true, quantity: '12 Liters', packed: false },
  { id: 'k-w2', name: 'Water purification tablets or gravity filter', category: 'water', essential: true, quantity: '1 pack', packed: false },
  // Food
  { id: 'k-f1', name: 'Non-perishable food (canned items, energy bars, roasted nuts)', category: 'food', essential: true, quantity: '3 days supply', packed: false },
  { id: 'k-f2', name: 'Manual can opener and durable utensils', category: 'food', essential: true, quantity: '1 set', packed: false },
  { id: 'k-f3', name: 'Baby food and formula (if infants present)', category: 'food', essential: false, quantity: '3 days', packed: false },
  // Medical
  { id: 'k-m1', name: 'Comprehensive First-Aid Kit (bandages, antiseptics, scissors, tape)', category: 'medical', essential: true, quantity: '1 kit', packed: false },
  { id: 'k-m2', name: 'Prescription medications (7-day supply for chronic conditions)', category: 'medical', essential: true, quantity: '7-day supply', packed: false },
  { id: 'k-m3', name: 'Pain relievers, ORS sachets, antidiarrheals, antihistamines', category: 'medical', essential: true, quantity: '1 pouch', packed: false },
  // Communication
  { id: 'k-c1', name: 'Battery-powered or hand-crank emergency radio', category: 'communication', essential: true, quantity: '1 unit', packed: false },
  { id: 'k-c2', name: 'Cell phone chargers and pre-charged high-capacity power bank', category: 'communication', essential: true, quantity: '20,000 mAh', packed: false },
  { id: 'k-c3', name: 'Loud emergency whistle (to signal rescuers)', category: 'communication', essential: true, quantity: '2 pcs', packed: false },
  // Lighting
  { id: 'k-l1', name: 'Waterproof LED flashlight and headlamp', category: 'lighting', essential: true, quantity: '2 pcs', packed: false },
  { id: 'k-l2', name: 'Extra AA/AAA batteries sealed in ziploc', category: 'lighting', essential: true, quantity: '12 pcs', packed: false },
  { id: 'k-l3', name: 'Chemical light sticks / glow sticks', category: 'lighting', essential: false, quantity: '4 pcs', packed: false },
  // Safety
  { id: 'k-s1', name: 'N95 or surgical masks (for dust, smoke, airborne debris)', category: 'safety', essential: true, quantity: '10 pcs', packed: false },
  { id: 'k-s2', name: 'Heavy-duty work gloves and safety goggles', category: 'safety', essential: true, quantity: '2 pairs', packed: false },
  { id: 'k-s3', name: 'Multi-tool or swiss army knife and duct tape', category: 'safety', essential: true, quantity: '1 set', packed: false },
  { id: 'k-s4', name: 'Mylar thermal emergency space blankets', category: 'safety', essential: true, quantity: '4 pcs', packed: false },
  // Documents
  { id: 'k-d1', name: 'Waterproof pouch with ID cards, passport copies, Aadhaar/SSN', category: 'documents', essential: true, quantity: '1 pouch', packed: false },
  { id: 'k-d2', name: 'Home/Health insurance policy copies & emergency contact list', category: 'documents', essential: true, quantity: '1 packet', packed: false },
  { id: 'k-d3', name: 'Emergency cash in small denominations (ATMs lose power)', category: 'documents', essential: true, quantity: 'Small bills', packed: false }
];

export const PREPAREDNESS_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the correct immediate action when an earthquake starts while you are indoors?',
    options: [
      { text: 'Run as fast as possible outside down the stairwell.', points: 0 },
      { text: 'Drop, Cover under a sturdy desk/table, and Hold On.', points: 20 },
      { text: 'Stand immediately beneath the nearest doorway.', points: 5 },
      { text: 'Open the windows to equalize air pressure.', points: 0 }
    ],
    explanation: 'Drop, Cover, and Hold On protects you from falling light fixtures, ceilings, and shattering glass, which cause the vast majority of earthquake injuries.'
  },
  {
    id: 'q2',
    question: 'How much clean drinking water should be stored in an emergency kit per person?',
    options: [
      { text: 'At least 1 gallon (4 liters) per person per day for at least 3 days.', points: 20 },
      { text: 'Half a liter per person per day.', points: 0 },
      { text: 'Only whatever fits in a single standard water bottle.', points: 5 },
      { text: 'Water is not needed since tap water will work in floods.', points: 0 }
    ],
    explanation: 'Disaster management agencies (NDMA/FEMA) universally recommend 1 gallon (4 liters) per person per day for hydration and basic sanitation for at least 72 hours.'
  },
  {
    id: 'q3',
    question: 'What should you do if your car encounters a flooded roadway with rising water?',
    options: [
      { text: 'Drive quickly through before water rises higher.', points: 0 },
      { text: 'Turn Around, Don\'t Drown: back up safely and find an alternate high route.', points: 20 },
      { text: 'Get out and push the vehicle through the puddle.', points: 0 },
      { text: 'Follow the car in front of you closely.', points: 5 }
    ],
    explanation: 'Just 12 inches of moving water can float most passenger cars, and unseen roadbed collapse under floodwaters causes hundreds of vehicular drownings.'
  },
  {
    id: 'q4',
    question: 'Does your family have a designated out-of-area emergency contact and secondary meeting point?',
    options: [
      { text: 'Yes, both are recorded, memorized, and shared with everyone.', points: 20 },
      { text: 'We have a vague idea of meeting at home, but no out-of-area contact.', points: 10 },
      { text: 'No, we will just call each other\'s mobile phones if anything happens.', points: 0 }
    ],
    explanation: 'Local cell towers usually become overloaded during disasters, while long-distance text messages to an out-of-area contact typically go through.'
  },
  {
    id: 'q5',
    question: 'Do you know where the main electrical breaker switch and gas shutoff valves are located in your home?',
    options: [
      { text: 'Yes, and all adult household members know how to shut them off.', points: 20 },
      { text: 'I know roughly where they are, but have never turned them off.', points: 10 },
      { text: 'No, I have no idea where the shutoffs are located.', points: 0 }
    ],
    explanation: 'Broken gas lines cause catastrophic post-disaster fires. Knowing how to immediately isolate gas and electric lines saves homes and lives.'
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-001',
    type: 'Cyclone Warning',
    title: 'Severe Cyclonic Storm "VARUN" Approaching Coastal Bay',
    severity: 'CRITICAL',
    affectedArea: 'Coastal Districts (Srikakulam to Paradip / 150km corridor)',
    issuedAt: '2026-09-14 06:30 IST',
    updatedAt: '2026-09-14 07:15 IST',
    source: 'India Meteorological Department (IMD) / Cyclone Warning Division',
    recommendedAction: 'Total suspension of fishing operations. Residents in kutcha houses move to Cyclone Shelters immediately. Secure roofs and windows.'
  },
  {
    id: 'alt-002',
    type: 'Earthquake Notification',
    title: 'M 5.8 Moderate Earthquake Detected in Himalayan Foothills',
    severity: 'WARNING',
    affectedArea: 'Uttarkashi / Chamoli Region (Depth: 10 km)',
    issuedAt: '2026-09-14 05:40 IST',
    updatedAt: '2026-09-14 06:10 IST',
    source: 'National Center for Seismology (NCS) / USGS Global Network',
    recommendedAction: 'Inspect structures for major wall cracks before re-entering. Expect aftershocks throughout the next 48 hours. Drop, Cover, Hold On if tremors reoccur.'
  },
  {
    id: 'alt-003',
    type: 'Flash Flood Alert',
    title: 'River Gauge Crossing Danger Mark (Discharge 1.2 Lakh Cusecs)',
    severity: 'CRITICAL',
    affectedArea: 'Low-lying riparian belts along Godavari & Krishna basins',
    issuedAt: '2026-09-14 04:00 IST',
    updatedAt: '2026-09-14 07:00 IST',
    source: 'Central Water Commission (CWC) / State Disaster Management Authority',
    recommendedAction: 'Immediate vertical or high-ground evacuation for villages within 500m of riverbanks. Never attempt to cross culverts or submerged causeways.'
  },
  {
    id: 'alt-004',
    type: 'Extreme Heat & Heatwave Watch',
    title: 'Severe Heatwave Advisory (Peak Temp Expected 44°C–46°C)',
    severity: 'WATCH',
    affectedArea: 'Vidarbha, Central Plain & Marathwada zones',
    issuedAt: '2026-09-14 07:00 IST',
    updatedAt: '2026-09-14 07:00 IST',
    source: 'State Disaster Management Authority & National Weather Service',
    recommendedAction: 'Avoid strenuous outdoor exposure between 12:00 PM and 4:00 PM. Drink buttermilk, ORS, and water frequently. Watch for signs of heat exhaustion.'
  },
  {
    id: 'alt-005',
    type: 'Air Quality & Industrial Advisory',
    title: 'AQI Exceeding 380 (Very Poor / Severe Dust & Industrial haze)',
    severity: 'INFO',
    affectedArea: 'Metropolitan Industrial Corridor',
    issuedAt: '2026-09-14 06:00 IST',
    updatedAt: '2026-09-14 06:00 IST',
    source: 'Central Pollution Control Board (CPCB)',
    recommendedAction: 'Persons with asthma or heart conditions avoid morning outdoor exercise. Wear N95 masks outdoors.'
  }
];

export const INITIAL_KIT_ITEMS = DEFAULT_EMERGENCY_KIT_ITEMS;
export const PREPAREDNESS_QUIZZES = PREPAREDNESS_QUIZ;
