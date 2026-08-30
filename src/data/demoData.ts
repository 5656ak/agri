import { DemoCrop, DemoTask, CropOption, LifecycleStage, KvkCenter, ResearchSource } from '../types';

export const SUPPORTED_CROPS: CropOption[] = [
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', season: 'Rabi', icon: '🌾' },
  { id: 'rice', nameEn: 'Rice / Paddy', nameHi: 'धान (चावल)', season: 'Kharif', icon: '🌾' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', season: 'Kharif', icon: '🌱' },
  { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', season: 'Rabi/Kharif', icon: '🍅' },
  { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', season: 'Rabi', icon: '🥔' },
  { id: 'mustard', nameEn: 'Mustard', nameHi: 'सरसों', season: 'Rabi', icon: '🌻' },
  { id: 'maize', nameEn: 'Maize', nameHi: 'मक्का', season: 'Kharif/Rabi', icon: '🌽' },
  { id: 'gram', nameEn: 'Gram / Chickpea', nameHi: 'चना', season: 'Rabi', icon: '🌿' }
];

export const DEMO_CROPS: DemoCrop[] = [
  {
    id: 'crop-1',
    nameEn: 'Wheat (HD-3086)',
    nameHi: 'गेहूं (HD-3086)',
    variety: 'Pusa Gautami (HD 3086)',
    sowingDate: '2026-11-10',
    daysSinceSowing: 45,
    currentStageEn: 'Vegetative / Tillering',
    currentStageHi: 'वानस्पतिक वृद्धि / कल्ले फूटना',
    stageProgressPercent: 45,
    healthStatus: 'HEALTHY',
    landAreaAcres: 2.5,
    soilHealthStatus: 'Soil Test Updated (N: Med, P: High, K: Med)'
  },
  {
    id: 'crop-2',
    nameEn: 'Tomato (Hybrid Pusa)',
    nameHi: 'टमाटर (संकर पूसा)',
    variety: 'Pusa Hybrid-4',
    sowingDate: '2026-12-01',
    daysSinceSowing: 24,
    currentStageEn: 'Active Vegetative',
    currentStageHi: 'वानस्पतिक वृद्धि',
    stageProgressPercent: 25,
    healthStatus: 'NEEDS_ATTENTION',
    landAreaAcres: 1.0,
    soilHealthStatus: 'Soil Test Pending'
  }
];

export const DEMO_TASKS: DemoTask[] = [
  {
    id: 'task-1',
    cropName: 'गेहूं (Wheat)',
    titleEn: 'First Top-Dressing of Nitrogen (Urea) at CRI / Tillering',
    titleHi: 'कल्ले फूटने की अवस्था पर यूरिया की पहली टॉप-ड्रेसिंग',
    category: 'FERTILIZER',
    dueDate: 'आज (Today)',
    priority: 'HIGH',
    completed: false
  },
  {
    id: 'task-2',
    cropName: 'गेहूं (Wheat)',
    titleEn: 'Field scouting for Yellow Rust (Stripe Rust) pustules',
    titleHi: 'पीला रतुआ (येलो रस्ट) के शुरुआती लक्षणों की निगरानी',
    category: 'SCOUTING',
    dueDate: 'कल (Tomorrow)',
    priority: 'MEDIUM',
    completed: false
  },
  {
    id: 'task-3',
    cropName: 'टमाटर (Tomato)',
    titleEn: 'Light furrow irrigation & check for leaf curl aphids',
    titleHi: 'हल्की सिंचाई और रस चूसक कीटों (माहू/सफेद मक्खी) की जांच',
    category: 'IRRIGATION',
    dueDate: '2 दिन में (In 2 days)',
    priority: 'HIGH',
    completed: false
  }
];

export const DEMO_10_STAGES: LifecycleStage[] = [
  {
    stageNumber: 1,
    titleEn: 'Seed Selection & Treatment',
    titleHi: '1. बीज चयन एवं उपचार',
    approxDays: 'Day 0',
    overviewEn: 'Certified disease-free seed selection and biological seed dressing.',
    overviewHi: 'प्रमाणित रोगमुक्त बीज का चयन और जैविक फफूंदनाशी से बीजोपचार।',
    keyActivities: [
      'Use certified seeds with >85% germination rate',
      'Seed treatment with Trichoderma viride or recommended bio-inoculant'
    ],
    irrigationGuidance: 'Pre-sowing irrigation (Rauni/Paleva) to ensure optimum field capacity.',
    nutrientGuidance: 'No direct chemical fertilizer at seed treatment; use Rhizobium/Azotobacter cultures.',
    pestMonitoring: 'Inspect seeds for stored grain pests, discolorations or fungal molds.',
    precautions: 'Do not mix chemical fungicides directly with live bio-fertilizer cultures without guidance.'
  },
  {
    stageNumber: 2,
    titleEn: 'Land Preparation & Soil Health',
    titleHi: '2. खेत की तैयारी एवं मृदा स्वास्थ्य',
    approxDays: 'Day 1 - 7',
    overviewEn: 'Deep summer ploughing, levelling, and basal FYM/manure incorporation.',
    overviewHi: 'गहरी जुताई, पाटा लगाकर समतलीकरण और गोबर की खाद (FYM) का समावेश।',
    keyActivities: [
      '2-3 ploughings followed by planking for fine tilth',
      'Incorporate well-rotted FYM or compost @ 10-15 tonnes/ha'
    ],
    irrigationGuidance: 'Ensure optimum field moisture before final seedbed preparation.',
    nutrientGuidance: 'Basal application of Phosphorus and Potassium based on Soil Health Card.',
    pestMonitoring: 'Check for soil-borne pathogens, termites and white grub larvae during ploughing.',
    precautions: 'Avoid un-decomposed raw cow dung as it invites termites and root grubs.'
  },
  {
    stageNumber: 3,
    titleEn: 'Sowing / Transplanting',
    titleHi: '3. बुवाई / रोपाई',
    approxDays: 'Day 1',
    overviewEn: 'Sowing at recommended depth, row-to-row spacing, and optimum seed rate.',
    overviewHi: 'उचित गहराई (3-5 सेमी), कतार से कतार की दूरी और बीज दर पर बुवाई।',
    keyActivities: [
      'Maintain 20-22.5 cm row-to-row spacing for wheat',
      'Use Seed-cum-Fertilizer drill for uniform placement'
    ],
    irrigationGuidance: 'Ensure adequate moisture line at 3-5 cm depth.',
    nutrientGuidance: 'Band placement of basal fertilizer 2-3 cm below seed level.',
    pestMonitoring: 'Monitor for birds and rodents picking surface seeds.',
    precautions: 'Do not sow deeper than 5 cm to avoid poor emergence.'
  },
  {
    stageNumber: 4,
    titleEn: 'Germination & Establishment',
    titleHi: '4. अंकुरण एवं प्रारंभिक अवस्था',
    approxDays: 'Day 7 - 15',
    overviewEn: 'Uniform seedling emergence and early root anchoring.',
    overviewHi: 'समान बीज अंकुरण और प्राथमिक जड़ों का विकास।',
    keyActivities: [
      'Check germination percentage in field quadrants',
      'Perform gap filling within 10-12 days if gaps exceed 15%'
    ],
    irrigationGuidance: 'Usually no irrigation needed if pre-sowing moisture was adequate.',
    nutrientGuidance: 'No top-dressing at this immediate seedling stage.',
    pestMonitoring: 'Scout for cutworms and surface grasshoppers damaging young shoots.',
    precautions: 'Prevent water stagnation which causes seed rot and damping-off.'
  },
  {
    stageNumber: 5,
    titleEn: 'Vegetative / Tillering Stage',
    titleHi: '5. वानस्पतिक वृद्धि / कल्ले फूटना',
    approxDays: 'Day 20 - 45',
    overviewEn: 'Crown root initiation (CRI) and active tillering branch production.',
    overviewHi: 'सीआरआई (CRI) जड़ें निकलना और अधिकतम कल्ले बनने की मुख्य अवस्था।',
    keyActivities: [
      'Critical irrigation at CRI (20-25 days after sowing)',
      '1st Top-dressing of Nitrogen (Urea) split'
    ],
    irrigationGuidance: 'First and most crucial irrigation; moisture stress causes severe yield loss.',
    nutrientGuidance: 'Apply 1/3rd of total Nitrogen requirement immediately after 1st irrigation.',
    pestMonitoring: 'Scout for early foliar blights, yellow rust pustules, and broadleaf weeds.',
    precautions: 'Do not apply urea on wet foliage to prevent fertilizer leaf burn.'
  },
  {
    stageNumber: 6,
    titleEn: 'Flowering & Panicle Initiation',
    titleHi: '6. फूल आना / बाली निकलना',
    approxDays: 'Day 50 - 75',
    overviewEn: 'Spikelet development, ear emergence, and pollen fertility.',
    overviewHi: 'बालियां निकलना और परागण की संवेदनशील अवस्था।',
    keyActivities: [
      'Ensure uninterrupted soil moisture during boot/heading stage',
      'Foliar micronutrient spray (e.g. Zinc, Boron) if deficiency is noted'
    ],
    irrigationGuidance: 'Maintain adequate moisture; avoid water stress during pollen formation.',
    nutrientGuidance: 'Final split of Nitrogen (if recommended by regional PoP) before heading.',
    pestMonitoring: 'Scout for aphids, head caterpillars, and ear-head bugs.',
    precautions: 'Avoid heavy spraying during peak morning pollination hours (8 AM - 11 AM).'
  },
  {
    stageNumber: 7,
    titleEn: 'Fruiting / Grain Filling Stage',
    titleHi: '7. फल / दाना भराव अवस्था',
    approxDays: 'Day 75 - 105',
    overviewEn: 'Milk and dough stage; translocation of starch into expanding grains.',
    overviewHi: 'दुग्धावस्था एवं दाना ठोस होने की अवस्था (दूधिया से दाना भराव)।',
    keyActivities: [
      'Irrigation at milk and soft dough stage during dry spells',
      'Monitor for terminal heat stress'
    ],
    irrigationGuidance: 'Light irrigation on calm, non-windy days to prevent crop lodging.',
    nutrientGuidance: 'Optional foliar spray of 0:0:50 (Potassium sulphate) @ 1% to boost grain weight.',
    pestMonitoring: 'Monitor for sucking pests, leaf blights, and grain rusts.',
    precautions: 'Never irrigate during high winds (>20 km/h) to avoid lodging.'
  },
  {
    stageNumber: 8,
    titleEn: 'Physiological Maturity',
    titleHi: '8. परिपक्वता अवस्था',
    approxDays: 'Day 105 - 125',
    overviewEn: 'Grains turn golden yellow, moisture decreases, and stalks dry.',
    overviewHi: 'पत्तियां व बालियां सुनहरी पीली होना, दाना कड़ा होना।',
    keyActivities: [
      'Stop all irrigations 10-15 days prior to planned harvest',
      'Inspect grain hardness and moisture content (15-20%)'
    ],
    irrigationGuidance: 'Strictly stop irrigation to facilitate uniform ripening.',
    nutrientGuidance: 'No fertilizer application.',
    pestMonitoring: 'Scout for late grain mold or rat infestations.',
    precautions: 'Ensure field is completely drained for combine or manual harvester entry.'
  },
  {
    stageNumber: 9,
    titleEn: 'Harvesting & Threshing',
    titleHi: '9. कटाई एवं गहाई',
    approxDays: 'Day 125 - 135',
    overviewEn: 'Timely harvesting to avoid shattering losses and proper threshing.',
    overviewHi: 'समय पर कटाई ताकि दाना झड़ने से नुकसान न हो, और स्वच्छ गहाई।',
    keyActivities: [
      'Harvest when grain moisture is around 14-16%',
      'Thresh at optimal cylinder speed to prevent grain crack'
    ],
    irrigationGuidance: 'Dry field conditions.',
    nutrientGuidance: 'In-situ crop residue management (e.g. Pusa Bio-decomposer spray on stubble).',
    pestMonitoring: 'Inspect harvested grain for foreign matter and damaged kernels.',
    precautions: 'Do not burn crop residue. Use bio-decomposers or happy seeders.'
  },
  {
    stageNumber: 10,
    titleEn: 'Post-Harvest & Safe Storage',
    titleHi: '10. कटाई उपरांत प्रबंधन एवं सुरक्षित भंडारण',
    approxDays: 'Post Harvest',
    overviewEn: 'Sun drying to <=12% moisture, hermetic storage, and mandi marketing.',
    overviewHi: 'धूप में सुखाकर नमी 10-12% करना, सुरक्षित कोठार/साइलो में भंडारण।',
    keyActivities: [
      'Sun dry grains for 2-3 days until moisture drops <=12%',
      'Clean and disinfect storage bins/godowns before loading'
    ],
    irrigationGuidance: 'N/A',
    nutrientGuidance: 'N/A',
    pestMonitoring: 'Regularly monitor storage for Khapra beetle, rice weevil, and moisture condensation.',
    precautions: 'Never store grains in damp bags or unventilated humid rooms.'
  }
];

export const DEMO_RESEARCH_SOURCE: ResearchSource = {
  institution: 'ICAR-Indian Institute of Wheat and Barley Research (IIWBR), Karnal',
  document: 'Wheat and Barley Package of Practices for Indo-Gangetic Plains',
  publicationYear: '2024 (DEMO DATA)',
  referenceId: 'DEMO-ICAR-IIWBR-2024-V1',
  sourceUrl: 'https://iiwbr.icar.gov.in',
  verificationStatus: 'DEMO_DATA'
};

export const DEMO_KVK_CENTERS: KvkCenter[] = [
  {
    id: 'kvk-1',
    name: 'Krishi Vigyan Kendra, NDRI Karnal (DEMO DATA)',
    district: 'Karnal',
    state: 'Haryana',
    hostOrganization: 'ICAR-National Dairy Research Institute',
    phone: '1800-180-1551 (Kisan Call Center)',
    email: 'kvk-karnal@demo.icar.gov.in',
    address: 'NDRI Campus, Karnal - 132001, Haryana'
  },
  {
    id: 'kvk-2',
    name: 'Krishi Vigyan Kendra, Ludhiana (DEMO DATA)',
    district: 'Ludhiana',
    state: 'Punjab',
    hostOrganization: 'Punjab Agricultural University (PAU)',
    phone: '1800-180-1551 (Kisan Call Center)',
    email: 'kvk-ludhiana@demo.pau.edu',
    address: 'PAU Campus, Ferozepur Road, Ludhiana - 141004, Punjab'
  },
  {
    id: 'kvk-3',
    name: 'Krishi Vigyan Kendra, Meerut (DEMO DATA)',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    hostOrganization: 'Sardar Vallabhbhai Patel University of Agriculture (SVPUAT)',
    phone: '1800-180-1551 (Kisan Call Center)',
    email: 'kvk-meerut@demo.svpuat.edu',
    address: 'SVPUAT Campus, Meerut - 250110, Uttar Pradesh'
  }
];
