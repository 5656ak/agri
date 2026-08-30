import {
  FarmerProfile,
  Farm,
  CropMaster,
  CropStage,
  FarmingActivity,
  FarmerCrop,
  WeatherData,
  WeatherAlert,
  AdminAdvisory,
  PestDisease,
  MandiPrice,
  GovernmentScheme,
  ExpenseItem,
  NotificationItem
} from '../types';

export const DEFAULT_FARMER: FarmerProfile = {
  id: 'farmer-101',
  name: 'Ramesh Kumar (रमेश कुमार)',
  phone: '+91 98765 43210',
  email: 'ramesh.farmer@kisansaathi.in',
  location: {
    state: 'Jharkhand',
    district: 'Ranchi',
    block: 'Kanke',
    village: 'Sukhurhutu',
    pincode: '834006',
    latitude: 23.4357,
    longitude: 85.3218,
    formattedAddress: 'Ranchi, Jharkhand (राँची, झारखण्ड)'
  },
  totalLandAcres: 5.0,
  primaryLanguage: 'hi',
  onboardingCompleted: true,
  createdAt: '2026-06-01T08:00:00.000Z'
};

export const DEFAULT_FARM: Farm = {
  id: 'farm-1',
  farmerId: 'farmer-101',
  name: 'Ramesh Krishi Farm (रमेश कृषि प्रक्षेत्र)',
  location: DEFAULT_FARMER.location,
  totalAreaAcres: 5.0,
  fields: [
    {
      id: 'field-1',
      name: 'उत्तरी खेत (North Field - 1)',
      areaAcres: 2.5,
      soilType: 'Clay Loam (मटियारी दोमट)',
      irrigationType: 'Canal & Borewell (नहर व नलकूप)',
      currentCropId: 'crop-paddy'
    },
    {
      id: 'field-2',
      name: 'मध्यम खेत (Central Field - 2)',
      areaAcres: 1.5,
      soilType: 'Sandy Loam (बलुई दोमट)',
      irrigationType: 'Drip / Sprinkler (ड्रिप/फव्वारा)',
      currentCropId: 'crop-maize'
    },
    {
      id: 'field-3',
      name: 'दक्षिणी बाड़ी (South Field - 3)',
      areaAcres: 1.0,
      soilType: 'Red Sandy Soil (लाल बलुई मिट्टी)',
      irrigationType: 'Borewell (नलकूप)',
      currentCropId: 'crop-tomato'
    }
  ]
};

export const CROPS_MASTER: CropMaster[] = [
  {
    id: 'paddy',
    nameEn: 'Paddy / Rice',
    nameHi: 'धान (Paddy)',
    botanicalName: 'Oryza sativa',
    category: 'Cereal',
    season: 'Kharif',
    totalDurationDays: 135,
    varieties: ['Swarna (MTU 7029)', 'IR 64', 'Sahbhagi Dhan', 'Pusa Basmati 1121'],
    suitableSoils: ['Clay Loam', 'Alluvial Clay', 'Silt Loam'],
    icon: '🌾',
    dataStatus: 'VERIFIED'
  },
  {
    id: 'wheat',
    nameEn: 'Wheat',
    nameHi: 'गेहूं (Wheat)',
    botanicalName: 'Triticum aestivum',
    category: 'Cereal',
    season: 'Rabi',
    totalDurationDays: 125,
    varieties: ['HD 2967', 'HD 3086 (Pusa Gautami)', 'DBW 187 (Karan Vandana)', 'PBW 343'],
    suitableSoils: ['Alluvial Loam', 'Clay Loam', 'Sandy Loam'],
    icon: '🌾',
    dataStatus: 'VERIFIED'
  },
  {
    id: 'maize',
    nameEn: 'Maize / Corn',
    nameHi: 'मक्का (Maize)',
    botanicalName: 'Zea mays',
    category: 'Cereal',
    season: 'Kharif',
    totalDurationDays: 105,
    varieties: ['HQPM 1', 'DHM 117', 'Pusa HM 4', 'Bio 9681'],
    suitableSoils: ['Sandy Loam', 'Well-drained Alluvial Loam'],
    icon: '🌽',
    dataStatus: 'VERIFIED'
  },
  {
    id: 'mustard',
    nameEn: 'Mustard / Rapeseed',
    nameHi: 'सरसों / राई (Mustard)',
    botanicalName: 'Brassica juncea',
    category: 'Oilseed',
    season: 'Rabi',
    totalDurationDays: 115,
    varieties: ['Pusa Bold', 'Pusa Jai Kisan', 'RH 749', 'Giriraj (DRMRIJ 31)'],
    suitableSoils: ['Sandy Loam', 'Light Alluvial'],
    icon: '🌻',
    dataStatus: 'VERIFIED'
  },
  {
    id: 'cotton',
    nameEn: 'Cotton',
    nameHi: 'कपास (Cotton)',
    botanicalName: 'Gossypium hirsutum',
    category: 'Cash Crop',
    season: 'Kharif',
    totalDurationDays: 160,
    varieties: ['Bt Cotton RCH 659', 'Bollgard II', 'Suraj'],
    suitableSoils: ['Deep Black Cotton Soil (Vertisol)', 'Clay Loam'],
    icon: '🌱',
    dataStatus: 'VERIFIED'
  },
  {
    id: 'tomato',
    nameEn: 'Tomato',
    nameHi: 'टमाटर (Tomato)',
    botanicalName: 'Solanum lycopersicum',
    category: 'Vegetable',
    season: 'All-season',
    totalDurationDays: 120,
    varieties: ['Abhinav (Syngenta)', 'Arka Rakshak', 'Pusa Ruby', 'Himsona'],
    suitableSoils: ['Sandy Loam', 'Red Loam', 'Well-drained Clay Loam'],
    icon: '🍅',
    dataStatus: 'VERIFIED'
  },
  {
    id: 'potato',
    nameEn: 'Potato',
    nameHi: 'आलू (Potato)',
    botanicalName: 'Solanum tuberosum',
    category: 'Vegetable',
    season: 'Rabi',
    totalDurationDays: 95,
    varieties: ['Kufri Pukhraj', 'Kufri Jyoti', 'Kufri Chipsona-1', 'Kufri Khyati'],
    suitableSoils: ['Sandy Loam', 'Friable Loam with high organic matter'],
    icon: '🥔',
    dataStatus: 'VERIFIED'
  },
  {
    id: 'gram',
    nameEn: 'Chickpea / Gram',
    nameHi: 'चना (Gram / Chickpea)',
    botanicalName: 'Cicer arietinum',
    category: 'Pulse',
    season: 'Rabi',
    totalDurationDays: 110,
    varieties: ['JG 11', 'JAKI 9218', 'Pusa 372', 'Radhey'],
    suitableSoils: ['Clay Loam', 'Black Soil', 'Sandy Loam'],
    icon: '🌿',
    dataStatus: 'VERIFIED'
  }
];

export const CROP_STAGES: CropStage[] = [
  // Paddy Stages
  {
    id: 'paddy-stage-1',
    cropId: 'paddy',
    stageNumber: 1,
    stageNameEn: 'Nursery & Seed Treatment',
    stageNameHi: '1. बीज शोधन एवं नर्सरी तैयारी',
    dayStart: 0,
    dayEnd: 25,
    irrigationGuidanceEn: 'Keep nursery bed moist. Maintain 2-3 cm thin water layer after 5 days.',
    irrigationGuidanceHi: 'नर्सरी में हल्की नमी बनाए रखें। 5 दिन बाद 2-3 सेमी का हल्का पानी रखें।',
    fertilizerGuidanceEn: 'Apply FYM 1 kg/sq.m + 10g Urea per sq.m in nursery bed.',
    fertilizerGuidanceHi: 'नर्सरी में 1 किग्रा गोबर की खाद + 10 ग्राम यूरिया प्रति वर्ग मीटर डालें।',
    pestScoutingEn: 'Inspect for seed rot, damping off, and early shoot borer.',
    pestScoutingHi: 'सड़न, गलन व तना छेदक के शुरुआती लक्षणों की जांच करें।',
    criticalPrecautionsEn: 'Treat seeds with Carbendazim 2g/kg before sowing.',
    criticalPrecautionsHi: 'बुवाई से पूर्व बीज को कार्बेन्डाजिम 2 ग्राम/किग्रा से उपचारित अवश्य करें।'
  },
  {
    id: 'paddy-stage-2',
    cropId: 'paddy',
    stageNumber: 2,
    stageNameEn: 'Transplanting & Establishment',
    stageNameHi: '2. रोपाई एवं पौधा स्थापना',
    dayStart: 26,
    dayEnd: 40,
    irrigationGuidanceEn: 'Maintain 3-5 cm standing water layer for 7 days post-transplanting.',
    irrigationGuidanceHi: 'रोपाई के 7 दिनों तक खेत में 3-5 सेमी पानी स्थिर बनाए रखें।',
    fertilizerGuidanceEn: 'Basal dose: 100% DAP & MOP + 1/3rd Urea + Zinc Sulphate 25 kg/ha.',
    fertilizerGuidanceHi: 'बेसल डोज: पूरा DAP व MOP + 1/3 यूरिया + 25 किग्रा जिंक सल्फेट प्रति हेक्टेयर।',
    pestScoutingEn: 'Scout for seedling blight, golden apple snail, and whorl maggot.',
    pestScoutingHi: 'गाद मक्खी व जड़ गलन की निगरानी करें।',
    criticalPrecautionsEn: 'Transplant 2-3 seedlings per hill at 20x15 cm spacing.',
    criticalPrecautionsHi: '20x15 सेमी दूरी पर प्रति थान 2-3 पौधे ही लगाएं।'
  },
  {
    id: 'paddy-stage-3',
    cropId: 'paddy',
    stageNumber: 3,
    stageNameEn: 'Active Tillering (कल्ले फूटना)',
    stageNameHi: '3. कल्ले फूटना (Active Tillering)',
    dayStart: 41,
    dayEnd: 60,
    irrigationGuidanceEn: 'Critical stage! Maintain 3-4 cm water depth. Do not let soil crack.',
    irrigationGuidanceHi: 'अति-महत्वपूर्ण अवस्था! 3-4 सेमी पानी रखें। मिट्टी में दरार न पड़ने दें।',
    fertilizerGuidanceEn: 'Apply 1st Top-Dress: 1/3rd Urea (30-35 kg/acre) after weeding.',
    fertilizerGuidanceHi: 'पहली टॉप-ड्रेसिंग: निराई के बाद 1/3 यूरिया (30-35 किग्रा/एकड़) का छिड़काव करें।',
    pestScoutingEn: 'Scout for Yellow Stem Borer (dead hearts) and Leaf Folder.',
    pestScoutingHi: 'तना छेदक (डेड हार्ट) एवं पत्ती लपेटक कीट के जाले व पत्तियों की जांच करें।',
    criticalPrecautionsEn: 'Install Pheromone traps @ 5/acre for stem borer monitoring.',
    criticalPrecautionsHi: 'तना छेदक निगरानी हेतु 5 फेरोमोन ट्रैप प्रति एकड़ लगाएं।'
  },
  {
    id: 'paddy-stage-4',
    cropId: 'paddy',
    stageNumber: 4,
    stageNameEn: 'Panicle Initiation & Booting',
    stageNameHi: '4. गभोट व बाली निकलना (Panicle Initiation)',
    dayStart: 61,
    dayEnd: 85,
    irrigationGuidanceEn: 'Keep field continuously submerged with 5 cm water.',
    irrigationGuidanceHi: 'खेत में 5 सेमी पानी का स्तर लगातार बनाए रखें। पानी की कमी से दाने खाली रह जाएंगे।',
    fertilizerGuidanceEn: 'Apply 2nd Top-Dress: Remaining 1/3rd Urea + 0:0:50 foliar spray.',
    fertilizerGuidanceHi: 'अंतिम टॉप-ड्रेसिंग: शेष 1/3 यूरिया डालें व पोटेशियम सल्फेट का छिड़काव करें।',
    pestScoutingEn: 'Scout for Brown Plant Hopper (BPH) at base and Blast spots on leaf collar.',
    pestScoutingHi: 'पौधों के आधार पर भूरा माहू (BPH) व पत्तियों पर ब्लास्ट के नाव आकार के धब्बों की जांच करें।',
    criticalPrecautionsEn: 'Avoid excessive nitrogen to prevent Blast outbreaks.',
    criticalPrecautionsHi: 'ब्लास्ट रोग से बचाव हेतु यूरिया की अधिक मात्रा से बचें।'
  },
  {
    id: 'paddy-stage-5',
    cropId: 'paddy',
    stageNumber: 5,
    stageNameEn: 'Grain Filling & Maturity',
    stageNameHi: '5. दाना भराव एवं परिपक्वता',
    dayStart: 86,
    dayEnd: 135,
    irrigationGuidanceEn: 'Drain field completely 10-12 days prior to harvest.',
    irrigationGuidanceHi: 'कटाई से 10-12 दिन पहले खेत का पूरा पानी निकाल दें।',
    fertilizerGuidanceEn: 'No soil fertilizer application. Optional 1% Potassium spray.',
    fertilizerGuidanceHi: 'मिट्टी में कोई खाद न डालें।',
    pestScoutingEn: 'Monitor for Gandhi Bug (दुर्गंध कीट) during milk stage.',
    pestScoutingHi: 'दुधिया अवस्था में गांधी बग (बदबूदार कीड़े) की निगरानी करें।',
    criticalPrecautionsEn: 'Harvest when 80-85% grains turn golden brown.',
    criticalPrecautionsHi: 'जब 80-85% बालियां सुनहरी भूरी हो जाएं, तभी कटाई करें।'
  }
];

export const DEFAULT_FARMER_CROPS: FarmerCrop[] = [
  {
    id: 'fc-1',
    farmerId: 'farmer-101',
    cropId: 'paddy',
    variety: 'Swarna (MTU 7029)',
    fieldId: 'field-1',
    fieldName: 'उत्तरी खेत (North Field - 1)',
    areaAcres: 2.5,
    sowingDate: '2026-07-15',
    soilType: 'Clay Loam (मटियारी दोमट)',
    irrigationType: 'Canal & Borewell',
    healthStatus: 'HEALTHY',
    currentStageNumber: 3,
    currentStageName: 'Active Tillering (कल्ले फूटने की अवस्था)',
    calculatedAgeDays: 46,
    activitiesCompleted: ['act-paddy-1', 'act-paddy-2']
  },
  {
    id: 'fc-2',
    farmerId: 'farmer-101',
    cropId: 'maize',
    variety: 'HQPM 1 (Quality Protein Maize)',
    fieldId: 'field-2',
    fieldName: 'मध्यम खेत (Central Field - 2)',
    areaAcres: 1.5,
    sowingDate: '2026-08-01',
    soilType: 'Sandy Loam (बलुई दोमट)',
    irrigationType: 'Drip / Sprinkler',
    healthStatus: 'HEALTHY',
    currentStageNumber: 2,
    currentStageName: 'Knee-High Vegetative Stage (घुटने बराबर अवस्था)',
    calculatedAgeDays: 29,
    activitiesCompleted: ['act-maize-1']
  },
  {
    id: 'fc-3',
    farmerId: 'farmer-101',
    cropId: 'tomato',
    variety: 'Abhinav Hybrid',
    fieldId: 'field-3',
    fieldName: 'दक्षिणी बाड़ी (South Field - 3)',
    areaAcres: 1.0,
    sowingDate: '2026-08-10',
    soilType: 'Red Sandy Soil (लाल बलुई मिट्टी)',
    irrigationType: 'Borewell',
    healthStatus: 'NEEDS_ATTENTION',
    currentStageNumber: 2,
    currentStageName: 'Vegetative & Early Flowering (फूल आना शुरू)',
    calculatedAgeDays: 20,
    activitiesCompleted: []
  }
];

export const DEFAULT_WEATHER: WeatherData = {
  temperatureC: 29,
  conditionEn: 'Partly Cloudy with Rain Chances',
  conditionHi: 'हल्के बादल व बारिश के आसार',
  rainProbabilityPercent: 65,
  humidityPercent: 74,
  windSpeedKmh: 14,
  uvIndex: 6,
  sunrise: '05:38 AM',
  sunset: '06:18 PM',
  farmingDirectiveEn: '🌧️ Heavy rain (65% chance) expected in next 24h — Do NOT irrigate or apply nitrogen today.',
  farmingDirectiveHi: '🌧️ अगले 24 घंटे में तेज बारिश (65% संभावना) है — आज खेत में सिंचाई व यूरिया का छिड़काव न करें।',
  forecast: [
    { dayEn: 'Today', dayHi: 'आज', date: '30 Aug', tempMax: 30, tempMin: 23, rainProb: 65, conditionEn: 'Scattered Rain', conditionHi: 'बारिश', icon: '🌧️' },
    { dayEn: 'Mon', dayHi: 'कल', date: '31 Aug', tempMax: 28, tempMin: 22, rainProb: 80, conditionEn: 'Heavy Thunderstorms', conditionHi: 'भारी बारिश', icon: '⛈️' },
    { dayEn: 'Tue', dayHi: 'मंगल', date: '01 Sep', tempMax: 31, tempMin: 23, rainProb: 40, conditionEn: 'Cloudy', conditionHi: 'बादल', icon: '⛅' },
    { dayEn: 'Wed', dayHi: 'बुध', date: '02 Sep', tempMax: 32, tempMin: 24, rainProb: 20, conditionEn: 'Sunny', conditionHi: 'धूप', icon: '☀️' },
    { dayEn: 'Thu', dayHi: 'गुरु', date: '03 Sep', tempMax: 33, tempMin: 24, rainProb: 15, conditionEn: 'Clear Sky', conditionHi: 'साफ मौसम', icon: '☀️' },
    { dayEn: 'Fri', dayHi: 'शुक्र', date: '04 Sep', tempMax: 32, tempMin: 23, rainProb: 30, conditionEn: 'Passing Showers', conditionHi: 'हल्की बौछार', icon: '🌦️' },
    { dayEn: 'Sat', dayHi: 'शनि', date: '05 Sep', tempMax: 31, tempMin: 23, rainProb: 25, conditionEn: 'Partly Cloudy', conditionHi: 'आंशिक बादल', icon: '⛅' }
  ]
};

export const WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: 'w-alert-1',
    severity: 'WARNING',
    titleEn: 'Thunderstorm & High Moisture Warning',
    titleHi: 'गरज-चमक एवं तेज बारिश की चेतावनी',
    descriptionEn: 'IMD Alert: Moderate to heavy rain expected across Ranchi, Ramgarh and Khunti districts.',
    descriptionHi: 'मौसम विभाग: रांची व आसपास के क्षेत्रों में तेज हवा व भारी बारिश की संभावना।',
    farmingActionEn: 'Ensure drainage channels are clear in vegetable beds. Postpone pesticide spraying.',
    farmingActionHi: 'सब्जियों के खेत में जल-निकासी नालियां साफ रखें। कीटनाशक छिड़काव स्थगित रखें।',
    validUntil: '31 Aug 2026, 11:59 PM'
  }
];

export const ADMIN_ADVISORIES: AdminAdvisory[] = [
  {
    id: 'adv-1',
    titleEn: 'Yellow Stem Borer Warning in Paddy (ICAR-CRURRS)',
    titleHi: 'धान में तना छेदक कीट की निगरानी सलाह (ICAR)',
    descriptionEn: 'Due to current high humidity (75%+) and warm temperatures, Yellow Stem Borer emergence is reported in tillering paddy.',
    descriptionHi: 'अधिक नमी एवं अनुकूल तापमान के कारण कल्ले फूटने वाली धान में तना छेदक के प्रकोप की संभावना है।',
    actionEn: 'Inspect for dead hearts. If threshold exceeds 5%, apply Cartap Hydrochloride 4G @ 7.5 kg/acre.',
    actionHi: 'खेत में मृत गोभ (Dead heart) की जांच करें। 5% से अधिक दिखने पर कारटाप हाइड्रोक्लोराइड 4G @ 7.5 किग्रा/एकड़ डालें।',
    cropId: 'paddy',
    cropStage: 'Active Tillering',
    state: 'Jharkhand',
    district: 'Ranchi',
    severity: 'WARNING',
    startDate: '2026-08-25',
    endDate: '2026-09-10',
    active: true,
    sourceInstitution: 'ICAR-Central Rainfed Upland Rice Research Station, Hazaribagh'
  },
  {
    id: 'adv-2',
    titleEn: 'Fall Armyworm (FAW) Alert in Maize',
    titleHi: 'मक्का में फॉल आर्मीवर्म कीट सतर्कता',
    descriptionEn: 'Inspect central whorl of knee-high maize for pinholes and sawdust-like frass.',
    descriptionHi: 'घुटने बराबर मक्का के पौधों के पोंगे (Whorl) में छेद व बुरादे जैसे मल की जांच करें।',
    actionEn: 'Apply Neem oil 1500 ppm @ 5 ml/litre or Emamectin Benzoate 5% SG @ 0.4 g/litre in central whorl.',
    actionHi: 'शुरुआती अवस्था में नीम तेल (1500 ppm) 5 मिली/लीटर या इमामेक्टिन बेंजोएट 0.4 ग्राम/लीटर का पोंगे में छिड़काव करें।',
    cropId: 'maize',
    cropStage: 'Vegetative',
    state: 'Jharkhand',
    severity: 'CRITICAL',
    startDate: '2026-08-20',
    endDate: '2026-09-15',
    active: true,
    sourceInstitution: 'Birsa Agricultural University (BAU), Ranchi'
  },
  {
    id: 'adv-3',
    titleEn: 'Tomato Early Blight Prevention',
    titleHi: 'टमाटर में अगेती झुलसा (Early Blight) से बचाव',
    descriptionEn: 'Continuous cloudy weather may trigger Alternaria solani fungal spots on lower leaves.',
    descriptionHi: 'बादल छाए रहने से टमाटर की निचली पत्तियों पर भूरे छल्लेदार धब्बे बन सकते हैं।',
    actionEn: 'Spray Mancozeb 75% WP @ 2.5 g/litre after rains subside.',
    actionHi: 'बारिश रुकने पर मैंकोजेब 75% WP @ 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।',
    cropId: 'tomato',
    cropStage: 'Vegetative & Early Flowering',
    state: 'Jharkhand',
    severity: 'INFO',
    startDate: '2026-08-28',
    endDate: '2026-09-08',
    active: true,
    sourceInstitution: 'ICAR-RCER, Farming System Research Centre for Hill and Plateau Region, Ranchi'
  }
];

export const PEST_DISEASES_DB: PestDisease[] = [
  {
    id: 'pest-paddy-1',
    cropId: 'paddy',
    problemNameEn: 'Yellow Stem Borer (Scirpophaga incertulas)',
    problemNameHi: 'धान का तना छेदक (Yellow Stem Borer)',
    category: 'Pest_Damage',
    symptomsEn: [
      'Central leaf drying up in vegetative stage (Dead Heart)',
      'White empty panicles at flowering stage (White Ear)',
      'Larva boring into stem base with small holes'
    ],
    symptomsHi: [
      'कल्ले निकलते समय बीच की गोभ सूख जाना (डेड हार्ट)',
      'बाली निकलते समय बालियों का सफेद व खोखला होना (व्हाइट ईयर)',
      'तने के निचले भाग में कीड़े के छेद'
    ],
    preventionEn: [
      'Clip seedling leaf tips before transplanting to destroy egg masses',
      'Avoid excessive nitrogenous fertilizer application',
      'Install sex pheromone traps @ 5 per acre'
    ],
    preventionHi: [
      'रोपाई से पहले पौध की पत्तियों के ऊपरी सिरे काट दें',
      'यूरिया की संतुलित मात्रा ही डालें, अधिक यूरिया से बचें',
      '5 फेरोमोन ट्रैप प्रति एकड़ लगाएं'
    ],
    organicManagementEn: [
      'Release Trichogramma japonicum egg parasitoids @ 40,000/acre twice',
      'Spray Neem seed kernel extract (NSKE 5%) @ 50 ml/litre'
    ],
    organicManagementHi: [
      'ट्राइकोग्रामा जैपोनिकम परजीवी कार्ड 40,000 प्रति एकड़ लगाएं',
      'नीम बीज का अर्क (NSKE 5%) 50 मिली/लीटर का छिड़काव करें'
    ],
    chemicalGuidanceEn: 'Cartap Hydrochloride 4G @ 7.5 kg/acre broadcast or Chlorantraniliprole 18.5% SC @ 60 ml/acre spray.',
    chemicalGuidanceHi: 'कारटाप हाइड्रोक्लोराइड 4G @ 7.5 किग्रा/एकड़ बिखेरें या कोराजन (Chlorantraniliprole) 60 मिली/एकड़ छिड़कें।',
    phiDays: 21,
    severity: 'HIGH',
    sourceInstitution: 'CIB&RC Registered Uses & ICAR-IIWBR / IIRR'
  },
  {
    id: 'pest-paddy-2',
    cropId: 'paddy',
    problemNameEn: 'Paddy Leaf Blast (Pyricularia oryzae)',
    problemNameHi: 'धान का ब्लास्ट रोग (झुलसा)',
    category: 'Fungal',
    symptomsEn: [
      'Spindle/diamond-shaped spots with grey centres and brownish borders',
      'Spots coalesce causing entire leaf desiccation',
      'Black lesion at flag leaf collar (Collar rot)'
    ],
    symptomsHi: [
      'पत्तियों पर नाव या आंख के आकार के धब्बे, जिनका केंद्र राख जैसा और किनारा भूरा होता है',
      'धब्बे मिलकर पूरी पत्ती को सुखा देते हैं',
      'बाली के जोड़ पर काला घेरा (गर्दन तोड़ रोग)'
    ],
    preventionEn: [
      'Seed treatment with Tricyclazole 75% WP @ 2g/kg',
      'Avoid high density planting; maintain spacing',
      'Split nitrogen fertilizer into 3 balanced applications'
    ],
    preventionHi: [
      'ट्राइसाइक्लाजोल 75% WP @ 2 ग्राम/किग्रा से बीज उपचार करें',
      'उचित दूरी रखें, घनी बुवाई न करें',
      'यूरिया को 3 बराबर भागों में बांटकर ही डालें'
    ],
    organicManagementEn: [
      'Spray Pseudomonas fluorescens @ 10 g/litre',
      'Apply Trichoderma viride 2.5 kg/ha mixed in enriched FYM'
    ],
    organicManagementHi: [
      'स्यूडोमोनास फ्लोरेसेंस 10 ग्राम/लीटर का छिड़काव करें',
      'ट्राइकोडर्मा विरिडी 2.5 किग्रा/हेक्टेयर गोबर की खाद में मिलाकर खेत में डालें'
    ],
    chemicalGuidanceEn: 'Tricyclazole 75% WP @ 120 g/acre or Isoprothiolane 40% EC @ 300 ml/acre.',
    chemicalGuidanceHi: 'ट्राइसाइक्लाजोल 75% WP @ 120 ग्राम/एकड़ या इसोप्रोथियोलेन 40% EC @ 300 मिली/एकड़ पानी में घोलकर छिड़कें।',
    phiDays: 30,
    severity: 'HIGH',
    sourceInstitution: 'ICAR-IIRR Hyderabad & CIB&RC Registry'
  },
  {
    id: 'pest-maize-1',
    cropId: 'maize',
    problemNameEn: 'Fall Armyworm (Spodoptera frugiperda)',
    problemNameHi: 'मक्का का फॉल आर्मीवर्म कीट',
    category: 'Pest_Damage',
    symptomsEn: [
      'Shot-hole damage on unfurling leaves',
      'Copious sawdust-like fecal frass inside central whorl',
      'Larva with 4 dark spots arranged in square on 8th segment'
    ],
    symptomsHi: [
      'खुलती हुई पत्तियों पर गोल छेद व छलनी जैसा दिखना',
      'मक्का के पोंगे के अंदर लकड़ी के बुरादे जैसा मल भरा होना',
      'लार्वा की पूंछ के पास 4 काले बिंदुओं का वर्गाकार निशान'
    ],
    preventionEn: [
      'Early synchronous sowing of maize in the region',
      'Intercrop with cowpea or pulses to conserve natural predators',
      'Erect bird perches @ 10/acre'
    ],
    preventionHi: [
      'क्षेत्र के सभी किसान समय पर एक साथ बुवाई करें',
      'लोबिया या दलहन के साथ अंतर-फसल लगाएं',
      'खेत में 10 पक्षी मचान (Bird perches) प्रति एकड़ लगाएं'
    ],
    organicManagementEn: [
      'Apply sand + wood ash (9:1) into central whorls',
      'Spray Bacillus thuringiensis (Bt) kurstaki @ 2 g/litre'
    ],
    organicManagementHi: [
      'रेत व लकड़ी की राख (9:1) को पौधों के पोंगे में चुटकी भर डालें',
      'बैसिलस थुरिंजिएंसिस (Bt) 2 ग्राम/लीटर का छिड़काव करें'
    ],
    chemicalGuidanceEn: 'Emamectin Benzoate 5% SG @ 80 g/acre or Chlorantraniliprole 18.5% SC @ 80 ml/acre targeting central whorl.',
    chemicalGuidanceHi: 'इमामेक्टिन बेंजोएट 5% SG @ 80 ग्राम/एकड़ या कोराजन 80 मिली/एकड़ सीधे पोंगे के अंदर डालें।',
    phiDays: 14,
    severity: 'HIGH',
    sourceInstitution: 'ICAR-IIMR Ludhiana / BAU Ranchi'
  }
];

export const MANDI_PRICES: MandiPrice[] = [
  {
    id: 'mp-1',
    cropId: 'paddy',
    cropNameEn: 'Paddy (Common / Dhan)',
    cropNameHi: 'धान (सामान्य - Swarna)',
    mandiName: 'Pandra Market Yard (पण्डरा कृषि बाजार)',
    district: 'Ranchi',
    state: 'Jharkhand',
    modalPricePerQuintal: 2320,
    minPrice: 2200,
    maxPrice: 2450,
    priceDeltaPercent: 3.5,
    updatedDate: '30 Aug 2026',
    history: [
      { date: '10 Aug', price: 2180 },
      { date: '15 Aug', price: 2220 },
      { date: '20 Aug', price: 2250 },
      { date: '25 Aug', price: 2290 },
      { date: '30 Aug', price: 2320 }
    ]
  },
  {
    id: 'mp-2',
    cropId: 'maize',
    cropNameEn: 'Maize (Yellow / Makka)',
    cropNameHi: 'मक्का (पीला - Yellow Maize)',
    mandiName: 'Pandra Market Yard',
    district: 'Ranchi',
    state: 'Jharkhand',
    modalPricePerQuintal: 2150,
    minPrice: 2000,
    maxPrice: 2280,
    priceDeltaPercent: 1.8,
    updatedDate: '30 Aug 2026',
    history: [
      { date: '10 Aug', price: 2080 },
      { date: '15 Aug', price: 2100 },
      { date: '20 Aug', price: 2110 },
      { date: '25 Aug', price: 2130 },
      { date: '30 Aug', price: 2150 }
    ]
  },
  {
    id: 'mp-3',
    cropId: 'tomato',
    cropNameEn: 'Tomato (Hybrid)',
    cropNameHi: 'टमाटर (हाइब्रिड)',
    mandiName: 'Daily Vegetable Market, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    modalPricePerQuintal: 3800,
    minPrice: 3400,
    maxPrice: 4200,
    priceDeltaPercent: 8.5,
    updatedDate: '30 Aug 2026',
    history: [
      { date: '10 Aug', price: 3100 },
      { date: '15 Aug', price: 3300 },
      { date: '20 Aug', price: 3450 },
      { date: '25 Aug', price: 3600 },
      { date: '30 Aug', price: 3800 }
    ]
  },
  {
    id: 'mp-4',
    cropId: 'wheat',
    cropNameEn: 'Wheat (Sharbati / Mill Quality)',
    cropNameHi: 'गेहूं (मिल क्वालिटी)',
    mandiName: 'Karnal Grain Market',
    district: 'Karnal',
    state: 'Haryana',
    modalPricePerQuintal: 2575,
    minPrice: 2450,
    maxPrice: 2680,
    priceDeltaPercent: 2.2,
    updatedDate: '30 Aug 2026',
    history: [
      { date: '10 Aug', price: 2500 },
      { date: '15 Aug', price: 2520 },
      { date: '20 Aug', price: 2540 },
      { date: '25 Aug', price: 2560 },
      { date: '30 Aug', price: 2575 }
    ]
  },
  {
    id: 'mp-5',
    cropId: 'mustard',
    cropNameEn: 'Mustard (Oil Content 42%)',
    cropNameHi: 'सरसों (42% तेल मात्रा)',
    mandiName: 'Alwar Mandi',
    district: 'Alwar',
    state: 'Rajasthan',
    modalPricePerQuintal: 5650,
    minPrice: 5400,
    maxPrice: 5850,
    priceDeltaPercent: 4.1,
    updatedDate: '30 Aug 2026',
    history: [
      { date: '10 Aug', price: 5350 },
      { date: '15 Aug', price: 5420 },
      { date: '20 Aug', price: 5500 },
      { date: '25 Aug', price: 5580 },
      { date: '30 Aug', price: 5650 }
    ]
  }
];

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'scheme-pm-kisan',
    nameEn: 'PM-Kisan Samman Nidhi Yojana',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
    shortDescEn: 'Direct income support of ₹6,000 per year in 3 equal installments of ₹2,000 to eligible farmer families.',
    shortDescHi: 'पात्र किसान परिवारों को प्रतिवर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता (₹2,000 की 3 किस्तों में)।',
    benefitsEn: '₹6,000 per annum credited directly into bank account via DBT.',
    benefitsHi: '₹6,000 प्रतिवर्ष सीधे आधार लिंक्ड बैंक खाते में डीबीटी (DBT) द्वारा।',
    eligibilityEn: [
      'All landholding farmer families with cultivable land in their names',
      'e-KYC and Aadhaar-Bank account seeding is mandatory',
      'Institutional landholders and high income taxpayers are excluded'
    ],
    eligibilityHi: [
      'सभी भू-स्वामी किसान परिवार जिनके नाम कृषि योग्य भूमि दर्ज है',
      'ई-केवाईसी (e-KYC) एवं आधार बैंक खाता लिंकिंग अनिवार्य',
      'संवैधानिक पदधारक एवं आयकरदाता अपात्र हैं'
    ],
    documentsRequiredEn: ['Aadhaar Card', 'Land Khatiyan / Jamabandi (भू-अभिलेख)', 'Bank Passbook copy', 'Active Mobile Number'],
    documentsRequiredHi: ['आधार कार्ड', 'जमीन का खतियान / रसीद / जमाबंदी', 'बैंक पासबुक', 'आधार लिंक मोबाइल नंबर'],
    stateApplicable: 'All India',
    officialUrl: 'https://pmkisan.gov.in',
    category: 'Direct Benefit',
    active: true
  },
  {
    id: 'scheme-pmfby',
    nameEn: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    shortDescEn: 'Comprehensive crop insurance coverage against non-preventable natural risks (drought, flood, unseasonal rain, pests).',
    shortDescHi: 'प्राकृतिक आपदाओं (सूखा, बाढ़, ओलावृष्टि, कीट रोग) से फसल नुकसान पर व्यापक बीमा सुरक्षा।',
    benefitsEn: 'Farmers pay only 2% premium for Kharif, 1.5% for Rabi, and 5% for horticultural crops; government pays the rest.',
    benefitsHi: 'खरीफ हेतु मात्र 2%, रबी हेतु 1.5% एवं बागवानी हेतु 5% प्रीमियम दर; शेष प्रीमियम सरकार वहन करती है।',
    eligibilityEn: [
      'All farmers cultivating notified crops in notified areas',
      'Both loanee and non-loanee farmers eligible'
    ],
    eligibilityHi: [
      'अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाले सभी किसान',
      'ऋणी एवं गैर-ऋणी दोनों किसान पात्र हैं'
    ],
    documentsRequiredEn: ['Land Record (ROR / LPC)', 'Sowing Certificate / Declaration (बुवाई प्रमाण पत्र)', 'Bank Passbook', 'Aadhaar Card'],
    documentsRequiredHi: ['जमीन की रसीद / एलपीसी (LPC)', 'पटवारी/मुखिया से बुवाई प्रमाण पत्र', 'बैंक पासबुक', 'आधार कार्ड'],
    stateApplicable: 'All India',
    officialUrl: 'https://pmfby.gov.in',
    category: 'Insurance',
    active: true
  },
  {
    id: 'scheme-smam',
    nameEn: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    nameHi: 'कृषि यंत्रीकरण उप-अभियान (कृषि यंत्र अनुदान)',
    shortDescEn: '40% to 80% subsidy on agricultural machinery like Rotavator, Power Tiller, Multi-crop Thresher, and Tractors.',
    shortDescHi: 'रोटावेटर, पावर टिलर, थ्रेशर, रीपर एवं कस्टम हायरिंग सेंटर हेतु 40% से 80% तक का सरकारी अनुदान।',
    benefitsEn: 'Direct subsidy on purchase of approved mechanized farm implements.',
    benefitsHi: 'पंजीकृत कृषि यंत्रों की खरीद पर 40-80% तक की सीधी सब्सिडी।',
    eligibilityEn: [
      'Small and marginal farmers, SC/ST, and women farmers given preference',
      'Should not have availed subsidy on same equipment in last 3 years'
    ],
    eligibilityHi: [
      'लघु एवं सीमांत, महिला व अनुसूचित जाति/जनजाति किसानों को प्राथमिकता',
      'पिछले 3 वर्षों में उसी यंत्र पर अनुदान न लिया हो'
    ],
    documentsRequiredEn: ['Aadhaar Card', 'Land Ownership Records', 'Bank Details', 'Tractor RC (if tractor-drawn implement)'],
    documentsRequiredHi: ['आधार कार्ड', 'जमीन की रसीद', 'बैंक पासबुक', 'ट्रैक्टर आरसी (यदि ट्रैक्टर चालित यंत्र है)'],
    stateApplicable: 'All India',
    officialUrl: 'https://agrimachinery.nic.in',
    category: 'Subsidy',
    active: true
  },
  {
    id: 'scheme-soil-health',
    nameEn: 'Soil Health Card Scheme',
    nameHi: 'मृदा स्वास्थ्य कार्ड योजना (Soil Health Card)',
    shortDescEn: 'Free soil testing across 12 vital parameters and customized nutrient recommendations to optimize fertilizer costs.',
    shortDescHi: '12 प्रमुख मानकों पर मिट्टी की निःशुल्क जांच एवं फसलवार संतुलित खाद की आधिकारिक सिफारिश।',
    benefitsEn: 'Detailed test report of N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, and Organic Carbon.',
    benefitsHi: 'नाइट्रोजन, फास्फोरस, पोटाश, सल्फर, जिंक व pH की सटीक जांच व बचत गाइड।',
    eligibilityEn: ['All farmers across all Indian states with cultivable plots'],
    eligibilityHi: ['सभी किसान जिनके पास कृषि योग्य भूमि है'],
    documentsRequiredEn: ['Aadhaar Card', 'Khata / Khasra Plot Details'],
    documentsRequiredHi: ['आधार कार्ड', 'खेत का खाता/खसरा नंबर'],
    stateApplicable: 'All India',
    officialUrl: 'https://soilhealth.dac.gov.in',
    category: 'Infrastructure',
    active: true
  }
];

export const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    farmerId: 'farmer-101',
    cropId: 'paddy',
    cropName: 'धान (Paddy - Swarna)',
    category: 'Seeds',
    amount: 2400,
    date: '2026-07-10',
    notes: '25 kg certified Swarna seeds from block cooperative'
  },
  {
    id: 'exp-2',
    farmerId: 'farmer-101',
    cropId: 'paddy',
    cropName: 'धान (Paddy)',
    category: 'Machinery',
    amount: 4500,
    date: '2026-07-14',
    notes: 'Tractor puddling & levelling (2.5 acres)'
  },
  {
    id: 'exp-3',
    farmerId: 'farmer-101',
    cropId: 'paddy',
    cropName: 'धान (Paddy)',
    category: 'Labour',
    amount: 6000,
    date: '2026-07-16',
    notes: 'Transplanting labour charges'
  },
  {
    id: 'exp-4',
    farmerId: 'farmer-101',
    cropId: 'paddy',
    cropName: 'धान (Paddy)',
    category: 'Fertilizer',
    amount: 3800,
    date: '2026-07-20',
    notes: '2 bags DAP + 1 bag MOP + Zinc'
  },
  {
    id: 'exp-5',
    farmerId: 'farmer-101',
    cropId: 'maize',
    cropName: 'मक्का (Maize)',
    category: 'Seeds',
    amount: 1800,
    date: '2026-07-28',
    notes: 'HQPM 1 Hybrid Maize seed (8 kg)'
  },
  {
    id: 'exp-6',
    farmerId: 'farmer-101',
    cropId: 'tomato',
    cropName: 'टमाटर (Tomato)',
    category: 'Seeds',
    amount: 1500,
    date: '2026-08-05',
    notes: 'Abhinav Hybrid seedling tray (1000 plants)'
  },
  {
    id: 'exp-7',
    farmerId: 'farmer-101',
    cropId: 'tomato',
    cropName: 'टमाटर (Tomato)',
    category: 'Fertilizer',
    amount: 2500,
    date: '2026-08-15',
    notes: 'Water soluble 19:19:19 & Micronutrient spray'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'WEATHER',
    titleEn: 'Rainfall Alert for Ranchi',
    titleHi: 'रांची में भारी बारिश का अलर्ट',
    messageEn: '65% rain probability today. Do NOT irrigate or top-dress urea.',
    messageHi: 'आज 65% बारिश की संभावना है। आज सिंचाई या यूरिया न डालें।',
    timestamp: '10 Mins Ago',
    read: false,
    targetTab: 'weather'
  },
  {
    id: 'notif-2',
    type: 'PEST',
    titleEn: 'Stem Borer Warning in Paddy',
    titleHi: 'धान में तना छेदक का प्रकोप अलर्ट',
    messageEn: 'Scout central shoot for dead hearts in your 2.5 acre Swarna plot.',
    messageHi: 'अपने 2.5 एकड़ धान के खेत में मृत गोभ (Dead heart) की तुरंत जांच करें।',
    timestamp: '2 Hours Ago',
    read: false,
    targetTab: 'pests'
  },
  {
    id: 'notif-3',
    type: 'MANDI',
    titleEn: 'Tomato Prices Surged +8.5%',
    titleHi: 'टमाटर के मंडी भाव में +8.5% की तेजी',
    messageEn: 'Pandra Market Yard rate reached ₹3,800 / Quintal.',
    messageHi: 'पण्डरा कृषि बाजार में टमाटर का भाव ₹3,800 / क्विंटल पहुंच गया।',
    timestamp: '1 Day Ago',
    read: true,
    targetTab: 'market'
  },
  {
    id: 'notif-4',
    type: 'SCHEME',
    titleEn: 'PM-Kisan 18th Installment Update',
    titleHi: 'PM-किसान 18वीं किस्त की जानकारी',
    messageEn: 'Check e-KYC status to ensure uninterrupted ₹2,000 credit.',
    messageHi: 'किस्त बिना रुकावट पाने के लिए अपना e-KYC स्टेटस चेक करें।',
    timestamp: '2 Days Ago',
    read: true,
    targetTab: 'schemes'
  }
];
