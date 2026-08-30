export type Language = 'hi' | 'en' | 'pa' | 'mr' | 'te' | 'bn';


export type NavigationTab =
  | 'home'
  | 'crops'
  | 'crop-detail'
  | 'scan'
  | 'weather'
  | 'irrigation'
  | 'fertilizer'
  | 'pests'
  | 'calendar'
  | 'market'
  | 'schemes'
  | 'farm'
  | 'expenses'
  | 'expert'
  | 'admin'
  | 'crop-doctor'
  | 'lifecycle'
  | 'kisan-mitra'
  | 'kvk-connect';


export type AdminSubTab =
  | 'dashboard'
  | 'crops'
  | 'stages'
  | 'advisories'
  | 'pests'
  | 'weather'
  | 'market'
  | 'schemes';

export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  state: string;
  district: string;
  block?: string;
  village?: string;
  pincode?: string;
  formattedAddress: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: LocationInfo;
  totalLandAcres: number;
  primaryLanguage: Language;
  avatarUrl?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Field {
  id: string;
  name: string;
  areaAcres: number;
  soilType: string;
  irrigationType: string;
  currentCropId?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  location: LocationInfo;
  totalAreaAcres: number;
  fields: Field[];
}

export interface CropMaster {
  id: string;
  nameEn: string;
  nameHi: string;
  botanicalName?: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Vegetable' | 'Oilseed' | 'Fruit';
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All-season';
  totalDurationDays: number;
  varieties: string[];
  suitableSoils: string[];
  icon: string;
  dataStatus: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
}

export interface CropStage {
  id: string;
  cropId: string;
  stageNumber: number;
  stageNameEn: string;
  stageNameHi: string;
  dayStart: number;
  dayEnd: number;
  irrigationGuidanceEn: string;
  irrigationGuidanceHi: string;
  fertilizerGuidanceEn: string;
  fertilizerGuidanceHi: string;
  pestScoutingEn: string;
  pestScoutingHi: string;
  criticalPrecautionsEn: string;
  criticalPrecautionsHi: string;
}

export interface FarmingActivity {
  id: string;
  cropId: string;
  stageId?: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  dueDay: number;
  category: 'Irrigation' | 'Fertilizer' | 'Pest' | 'Sowing' | 'Weeding' | 'Harvest';
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  completed?: boolean;
}

export interface FarmerCrop {
  id: string;
  farmerId: string;
  cropId: string;
  variety: string;
  fieldId: string;
  fieldName: string;
  areaAcres: number;
  sowingDate: string; // YYYY-MM-DD
  soilType: string;
  irrigationType: string;
  healthStatus: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';
  currentStageNumber?: number;
  currentStageName?: string;
  calculatedAgeDays?: number;
  activitiesCompleted?: string[];
}

export interface ActionRecommendation {
  id: string;
  type: 'IRRIGATION' | 'PEST' | 'FERTILIZER' | 'WEATHER' | 'ACTIVITY' | 'MARKET';
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  titleEn: string;
  titleHi: string;
  actionTextEn: string;
  actionTextHi: string;
  reasonEn: string;
  reasonHi: string;
  cropName?: string;
  targetTab?: NavigationTab;
  icon?: string;
}

export interface AdminAdvisory {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  actionEn: string;
  actionHi: string;
  cropId?: string;
  cropStage?: string;
  state: string;
  district?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  startDate: string;
  endDate: string;
  active: boolean;
  sourceInstitution: string;
}

export interface PestDisease {
  id: string;
  cropId: string;
  problemNameEn: string;
  problemNameHi: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest_Damage' | 'Nutrient_Deficiency';
  symptomsEn: string[];
  symptomsHi: string[];
  preventionEn: string[];
  preventionHi: string[];
  organicManagementEn: string[];
  organicManagementHi: string[];
  chemicalGuidanceEn: string;
  chemicalGuidanceHi: string;
  phiDays?: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  sourceInstitution: string;
}

export interface WeatherData {
  temperatureC: number;
  conditionEn: string;
  conditionHi: string;
  rainProbabilityPercent: number;
  humidityPercent: number;
  windSpeedKmh: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: {
    dayEn: string;
    dayHi: string;
    date: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    conditionEn: string;
    conditionHi: string;
    icon: string;
  }[];
  farmingDirectiveEn: string;
  farmingDirectiveHi: string;
}

export interface WeatherAlert {
  id: string;
  severity: 'WARNING' | 'ALERT' | 'INFO';
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  farmingActionEn: string;
  farmingActionHi: string;
  validUntil: string;
}

export interface MandiPrice {
  id: string;
  cropId: string;
  cropNameEn: string;
  cropNameHi: string;
  mandiName: string;
  district: string;
  state: string;
  modalPricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  priceDeltaPercent: number; // e.g. +3.5%
  updatedDate: string;
  history: {
    date: string;
    price: number;
  }[];
}

export interface GovernmentScheme {
  id: string;
  nameEn: string;
  nameHi: string;
  shortDescEn: string;
  shortDescHi: string;
  benefitsEn: string;
  benefitsHi: string;
  eligibilityEn: string[];
  eligibilityHi: string[];
  documentsRequiredEn: string[];
  documentsRequiredHi: string[];
  stateApplicable: string; // 'All India' or specific state
  maxLandAcres?: number;
  officialUrl: string;
  category: 'Direct Benefit' | 'Insurance' | 'Subsidy' | 'Infrastructure' | 'Credit';
  active: boolean;
}

export interface ExpenseItem {
  id: string;
  farmerId: string;
  cropId?: string;
  cropName?: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticide' | 'Labour' | 'Machinery' | 'Diesel' | 'Irrigation' | 'Other';
  amount: number;
  date: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  type: 'WEATHER' | 'CROP' | 'PEST' | 'IRRIGATION' | 'MANDI' | 'SCHEME';
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  timestamp: string;
  read: boolean;
  targetTab?: NavigationTab;
}

export interface ExpertQuery {
  id: string;
  farmerId: string;
  farmerName: string;
  phone: string;
  cropName: string;
  question: string;
  imageUrl?: string;
  hasAudio: boolean;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
  expertResponse?: string;
}

export interface ScanResult {
  id: string;
  cropName: string;
  possibleIssueEn: string;
  possibleIssueHi: string;
  confidenceTier: 'HIGH' | 'MODERATE' | 'LOW';
  confidencePercentage: number;
  symptomsObservedEn: string[];
  symptomsObservedHi: string[];
  recommendedStepsEn: string[];
  recommendedStepsHi: string[];
  preventionEn: string[];
  preventionHi: string[];
  registeredChemicals?: string[];
  sourceCitations: string[];
  timestamp: string;
}

export interface AdminStats {
  totalFarmers: number;
  activeCrops: number;
  activeAdvisories: number;
  weatherAlerts: number;
  mandiRecords: number;
  schemesCount: number;
  pestRecords: number;
  expertQueriesPending: number;
}

// Backward compatibility interfaces
export interface DemoCrop {
  id: string;
  nameHi: string;
  nameEn: string;
  variety: string;
  sowingDate: string;
  daysSinceSowing?: number;
  ageDays?: number;
  currentStage?: string;
  currentStageHi?: string;
  currentStageEn?: string;
  stageProgressPercent?: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEEDS_ATTENTION';
  landArea?: string;
  landAreaAcres?: number;
  soilHealthStatus?: string;
}

export interface DemoTask {
  id: string;
  titleHi: string;
  titleEn: string;
  crop?: string;
  cropName?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'IRRIGATION' | 'FERTILIZER' | 'PEST_SCOUTING' | 'HARVEST' | 'SCOUTING';
  dueDate: string;
  completed: boolean;
}

export interface CropOption {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: string;
  season?: string;
}

export interface LifecycleStage {
  id?: string;
  stageNumber: number;
  titleHi: string;
  titleEn: string;
  dayRange?: string;
  approxDays?: string;
  overviewEn?: string;
  overviewHi?: string;
  keyActivities?: string[];
  irrigationGuidance?: string;
  nutrientGuidance?: string;
  pestMonitoring?: string;
  precautions?: string;
  descriptionHi?: string;
  descriptionEn?: string;
  farmingActionsHi?: string[];
  farmingActionsEn?: string[];
  fertilizerHi?: string;
  fertilizerEn?: string;
  irrigationHi?: string;
  irrigationEn?: string;
  pestWatchHi?: string;
  pestWatchEn?: string;
  status?: 'COMPLETED' | 'ACTIVE' | 'UPCOMING';
}

export interface KvkCenter {
  id: string;
  name?: string;
  nameHi?: string;
  nameEn?: string;
  district: string;
  state: string;
  phone?: string;
  email?: string;
  address?: string;
  institution?: string;
  hostOrganization?: string;
}

export interface ResearchSource {
  id?: string;
  title?: string;
  document?: string;
  institution: string;
  publicationDate?: string;
  publicationYear?: string | number;
  referenceId?: string;
  sourceUrl?: string;
  verificationStatus?: string;
  category?: string;
  url?: string;
}




