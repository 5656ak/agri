export type Language = 'hi' | 'en';

export type NavigationTab = 
  | 'home'
  | 'dashboard'
  | 'crop-doctor'
  | 'fertilizer'
  | 'lifecycle'
  | 'kisan-mitra'
  | 'kvk-connect';

export interface ResearchSource {
  institution: string;
  document: string;
  publicationYear?: number | string;
  referenceId: string;
  sourceUrl?: string;
  verificationStatus: 'VERIFIED_ICAR' | 'VERIFIED_CIBRC' | 'VERIFIED_SAU' | 'DEMO_DATA';
}

export interface DemoCrop {
  id: string;
  nameEn: string;
  nameHi: string;
  variety: string;
  sowingDate: string;
  daysSinceSowing: number;
  currentStageEn: string;
  currentStageHi: string;
  stageProgressPercent: number;
  healthStatus: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';
  landAreaAcres: number;
  soilHealthStatus: string;
}

export interface DemoTask {
  id: string;
  cropName: string;
  titleEn: string;
  titleHi: string;
  category: 'IRRIGATION' | 'FERTILIZER' | 'SCOUTING' | 'HARVEST';
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
}

export interface CropOption {
  id: string;
  nameEn: string;
  nameHi: string;
  season: 'Rabi' | 'Kharif' | 'Zaid' | 'Rabi/Kharif' | 'Kharif/Rabi' | 'All-season';
  icon: string;
}

export interface LifecycleStage {
  stageNumber: number;
  titleEn: string;
  titleHi: string;
  approxDays: string;
  overviewEn: string;
  overviewHi: string;
  keyActivities: string[];
  irrigationGuidance: string;
  nutrientGuidance: string;
  pestMonitoring: string;
  precautions: string;
}

export interface KvkCenter {
  id: string;
  name: string;
  district: string;
  state: string;
  hostOrganization: string;
  phone: string;
  email: string;
  address: string;
}
