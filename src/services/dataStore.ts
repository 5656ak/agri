import {
  FarmerProfile,
  Farm,
  Field,
  CropMaster,
  CropStage,
  FarmerCrop,
  WeatherData,
  WeatherAlert,
  AdminAdvisory,
  PestDisease,
  MandiPrice,
  GovernmentScheme,
  ExpenseItem,
  NotificationItem,
  AdminStats,
  LocationInfo
} from '../types';

import {
  DEFAULT_FARMER,
  DEFAULT_FARM,
  CROPS_MASTER,
  CROP_STAGES,
  DEFAULT_FARMER_CROPS,
  DEFAULT_WEATHER,
  WEATHER_ALERTS,
  ADMIN_ADVISORIES,
  PEST_DISEASES_DB,
  MANDI_PRICES,
  GOVERNMENT_SCHEMES,
  DEFAULT_EXPENSES,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  FARMER: 'kisansaathi_farmer',
  FARM: 'kisansaathi_farm',
  CROPS_MASTER: 'kisansaathi_crops_master',
  CROP_STAGES: 'kisansaathi_crop_stages',
  FARMER_CROPS: 'kisansaathi_farmer_crops',
  WEATHER: 'kisansaathi_weather',
  WEATHER_ALERTS: 'kisansaathi_weather_alerts',
  ADVISORIES: 'kisansaathi_advisories',
  PESTS: 'kisansaathi_pests',
  MANDI: 'kisansaathi_mandi',
  SCHEMES: 'kisansaathi_schemes',
  EXPENSES: 'kisansaathi_expenses',
  NOTIFICATIONS: 'kisansaathi_notifications'
};

type Listener = () => void;

class DataStore {
  private listeners: Set<Listener> = new Set();

  private farmer: FarmerProfile;
  private farm: Farm;
  private cropsMaster: CropMaster[];
  private cropStages: CropStage[];
  private farmerCrops: FarmerCrop[];
  private weather: WeatherData;
  private weatherAlerts: WeatherAlert[];
  private advisories: AdminAdvisory[];
  private pests: PestDisease[];
  private mandiPrices: MandiPrice[];
  private schemes: GovernmentScheme[];
  private expenses: ExpenseItem[];
  private notifications: NotificationItem[];

  constructor() {
    this.farmer = this.loadFromStorage(STORAGE_KEYS.FARMER, DEFAULT_FARMER);
    this.farm = this.loadFromStorage(STORAGE_KEYS.FARM, DEFAULT_FARM);
    this.cropsMaster = this.loadFromStorage(STORAGE_KEYS.CROPS_MASTER, CROPS_MASTER);
    this.cropStages = this.loadFromStorage(STORAGE_KEYS.CROP_STAGES, CROP_STAGES);
    this.farmerCrops = this.loadFromStorage(STORAGE_KEYS.FARMER_CROPS, DEFAULT_FARMER_CROPS);
    this.weather = this.loadFromStorage(STORAGE_KEYS.WEATHER, DEFAULT_WEATHER);
    this.weatherAlerts = this.loadFromStorage(STORAGE_KEYS.WEATHER_ALERTS, WEATHER_ALERTS);
    this.advisories = this.loadFromStorage(STORAGE_KEYS.ADVISORIES, ADMIN_ADVISORIES);
    this.pests = this.loadFromStorage(STORAGE_KEYS.PESTS, PEST_DISEASES_DB);
    this.mandiPrices = this.loadFromStorage(STORAGE_KEYS.MANDI, MANDI_PRICES);
    this.schemes = this.loadFromStorage(STORAGE_KEYS.SCHEMES, GOVERNMENT_SCHEMES);
    this.expenses = this.loadFromStorage(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
    this.notifications = this.loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);

    // Initial recalculation of crop ages & stages
    this.recalculateAllCropStages();
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(key);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch {
      // Storage unavailable or corrupted
    }
    return defaultValue;
  }

  private saveToStorage(key: string, value: any): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Ignore quota errors
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  // --- Farmer Profile & Location ---
  public getFarmerProfile(): FarmerProfile {
    return this.farmer;
  }

  public updateFarmerProfile(updates: Partial<FarmerProfile>): void {
    this.farmer = { ...this.farmer, ...updates };
    this.saveToStorage(STORAGE_KEYS.FARMER, this.farmer);
    this.notify();
  }

  public updateLocation(location: LocationInfo): void {
    this.farmer.location = location;
    this.farm.location = location;

    // Dynamically calibrate micro-weather for the selected district
    const isPunjabHaryana = ['Punjab', 'Haryana'].includes(location.state);
    const isSouthIndia = ['Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Karnataka', 'Kerala'].includes(location.state);
    const isWestIndia = ['Rajasthan', 'Gujarat', 'Maharashtra'].includes(location.state);

    if (isPunjabHaryana) {
      this.weather.temperatureC = 30;
      this.weather.conditionHi = 'धूप व शुष्क (Sunny & Clear)';
      this.weather.conditionEn = 'Sunny & Dry';
      this.weather.rainProbabilityPercent = 15;
      this.weather.farmingDirectiveHi = `कल सुबह ${location.district} के खेतों में हल्की सिंचाई करें।`;
      this.weather.farmingDirectiveEn = `Irrigate vegetative plots tomorrow morning in ${location.district}.`;
    } else if (isSouthIndia) {
      this.weather.temperatureC = 27;
      this.weather.conditionHi = 'हल्की वर्षा (Scattered Rain)';
      this.weather.conditionEn = 'Scattered Rain';
      this.weather.rainProbabilityPercent = 70;
      this.weather.farmingDirectiveHi = `बारिश की संभावना के कारण आज ${location.district} में सिंचाई स्थगित रखें।`;
      this.weather.farmingDirectiveEn = `Rain expected in ${location.district}. Skip irrigation today.`;
    } else {
      this.weather.temperatureC = 28;
      this.weather.conditionHi = 'बादल व बूंदाबांदी (Overcast with Showers)';
      this.weather.conditionEn = 'Overcast with Showers';
      this.weather.rainProbabilityPercent = 65;
      this.weather.farmingDirectiveHi = `आज ${location.district} में 65% बारिश की संभावना है — आज सिंचाई न करें।`;
      this.weather.farmingDirectiveEn = `65% rain probability today in ${location.district} — Avoid irrigation today.`;
    }

    this.saveToStorage(STORAGE_KEYS.WEATHER, this.weather);
    this.saveToStorage(STORAGE_KEYS.FARMER, this.farmer);
    this.saveToStorage(STORAGE_KEYS.FARM, this.farm);
    this.notify();
  }


  // --- Farm & Fields ---
  public getFarm(): Farm {
    return this.farm;
  }

  public addField(field: Omit<Field, 'id'>): void {
    const newField: Field = {
      ...field,
      id: `field-${Date.now()}`
    };
    this.farm.fields.push(newField);
    this.farm.totalAreaAcres = this.farm.fields.reduce((sum, f) => sum + f.areaAcres, 0);
    this.saveToStorage(STORAGE_KEYS.FARM, this.farm);
    this.notify();
  }

  // --- Farmer Active Crops ---
  public getFarmerCrops(): FarmerCrop[] {
    return this.farmerCrops;
  }

  public getFarmerCropById(id: string): FarmerCrop | undefined {
    return this.farmerCrops.find((c) => c.id === id);
  }

  public addFarmerCrop(cropInput: {
    cropId: string;
    variety: string;
    fieldId: string;
    areaAcres: number;
    sowingDate: string;
    soilType: string;
    irrigationType: string;
  }): FarmerCrop {
    const field = this.farm.fields.find((f) => f.id === cropInput.fieldId);
    const fieldName = field ? field.name : 'Field Plot';

    const newCrop: FarmerCrop = {
      id: `fc-${Date.now()}`,
      farmerId: this.farmer.id,
      cropId: cropInput.cropId,
      variety: cropInput.variety,
      fieldId: cropInput.fieldId,
      fieldName: fieldName,
      areaAcres: cropInput.areaAcres,
      sowingDate: cropInput.sowingDate,
      soilType: cropInput.soilType,
      irrigationType: cropInput.irrigationType,
      healthStatus: 'HEALTHY',
      activitiesCompleted: []
    };

    // Calculate stage and age
    const calc = this.calculateCropAgeAndStage(newCrop.cropId, newCrop.sowingDate);
    newCrop.calculatedAgeDays = calc.ageDays;
    newCrop.currentStageNumber = calc.stageNumber;
    newCrop.currentStageName = calc.stageName;

    this.farmerCrops.unshift(newCrop);
    this.saveToStorage(STORAGE_KEYS.FARMER_CROPS, this.farmerCrops);
    this.notify();
    return newCrop;
  }

  public deleteFarmerCrop(id: string): void {
    this.farmerCrops = this.farmerCrops.filter((c) => c.id !== id);
    this.saveToStorage(STORAGE_KEYS.FARMER_CROPS, this.farmerCrops);
    this.notify();
  }

  public toggleCropActivity(cropId: string, activityId: string): void {
    const crop = this.farmerCrops.find((c) => c.id === cropId);
    if (!crop) return;
    if (!crop.activitiesCompleted) crop.activitiesCompleted = [];

    if (crop.activitiesCompleted.includes(activityId)) {
      crop.activitiesCompleted = crop.activitiesCompleted.filter((a) => a !== activityId);
    } else {
      crop.activitiesCompleted.push(activityId);
    }
    this.saveToStorage(STORAGE_KEYS.FARMER_CROPS, this.farmerCrops);
    this.notify();
  }

  public calculateCropAgeAndStage(cropId: string, sowingDateStr: string): {
    ageDays: number;
    stageNumber: number;
    stageName: string;
  } {
    const sowing = new Date(sowingDateStr);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - sowing.getTime());
    const ageDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const stages = this.cropStages.filter((s) => s.cropId === cropId);
    if (stages.length === 0) {
      return {
        ageDays,
        stageNumber: 1,
        stageName: 'Vegetative Growth (वृद्धि अवस्था)'
      };
    }

    const currentStage = stages.find((s) => ageDays >= s.dayStart && ageDays <= s.dayEnd) || stages[stages.length - 1];

    return {
      ageDays,
      stageNumber: currentStage.stageNumber,
      stageName: `${currentStage.stageNameHi} (${currentStage.stageNameEn})`
    };
  }

  public recalculateAllCropStages(): void {
    this.farmerCrops.forEach((c) => {
      const calc = this.calculateCropAgeAndStage(c.cropId, c.sowingDate);
      c.calculatedAgeDays = calc.ageDays;
      c.currentStageNumber = calc.stageNumber;
      c.currentStageName = calc.stageName;
    });
    this.saveToStorage(STORAGE_KEYS.FARMER_CROPS, this.farmerCrops);
  }

  // --- Weather & Alerts ---
  public getWeather(): WeatherData {
    return this.weather;
  }

  public getWeatherAlerts(): WeatherAlert[] {
    return this.weatherAlerts;
  }

  public updateWeatherDirective(directiveEn: string, directiveHi: string): void {
    this.weather.farmingDirectiveEn = directiveEn;
    this.weather.farmingDirectiveHi = directiveHi;
    this.saveToStorage(STORAGE_KEYS.WEATHER, this.weather);
    this.notify();
  }

  // --- Admin Master Crops ---
  public getMasterCrops(): CropMaster[] {
    return this.cropsMaster;
  }

  public getMasterCropById(id: string): CropMaster | undefined {
    return this.cropsMaster.find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  public saveMasterCrop(crop: CropMaster): void {
    const idx = this.cropsMaster.findIndex((c) => c.id === crop.id);
    if (idx >= 0) {
      this.cropsMaster[idx] = crop;
    } else {
      this.cropsMaster.push(crop);
    }
    this.saveToStorage(STORAGE_KEYS.CROPS_MASTER, this.cropsMaster);
    this.notify();
  }

  public deleteMasterCrop(id: string): void {
    this.cropsMaster = this.cropsMaster.filter((c) => c.id !== id);
    this.saveToStorage(STORAGE_KEYS.CROPS_MASTER, this.cropsMaster);
    this.notify();
  }

  // --- Admin Crop Stages ---
  public getCropStages(cropId?: string): CropStage[] {
    if (cropId) {
      return this.cropStages.filter((s) => s.cropId === cropId);
    }
    return this.cropStages;
  }

  public saveCropStage(stage: CropStage): void {
    const idx = this.cropStages.findIndex((s) => s.id === stage.id);
    if (idx >= 0) {
      this.cropStages[idx] = stage;
    } else {
      this.cropStages.push(stage);
    }
    this.saveToStorage(STORAGE_KEYS.CROP_STAGES, this.cropStages);
    this.recalculateAllCropStages();
    this.notify();
  }

  // --- Admin Advisories ---
  public getAdvisories(): AdminAdvisory[] {
    return this.advisories;
  }

  public getActiveAdvisoriesForFarmer(): AdminAdvisory[] {
    const state = this.farmer.location.state;
    const farmerCropIds = new Set(this.farmerCrops.map((c) => c.cropId));

    return this.advisories.filter((adv) => {
      if (!adv.active) return false;
      // Match state if specified
      if (adv.state && adv.state !== 'All India' && !adv.state.toLowerCase().includes(state.toLowerCase()) && !state.toLowerCase().includes(adv.state.toLowerCase())) {
        return false;
      }
      // Match crop if cropId specified
      if (adv.cropId && !farmerCropIds.has(adv.cropId)) {
        return false;
      }
      return true;
    });
  }

  public saveAdvisory(advisory: AdminAdvisory): void {
    const idx = this.advisories.findIndex((a) => a.id === advisory.id);
    if (idx >= 0) {
      this.advisories[idx] = advisory;
    } else {
      this.advisories.unshift(advisory);
    }
    this.saveToStorage(STORAGE_KEYS.ADVISORIES, this.advisories);
    this.notify();
  }

  public toggleAdvisoryActive(id: string): void {
    const adv = this.advisories.find((a) => a.id === id);
    if (adv) {
      adv.active = !adv.active;
      this.saveToStorage(STORAGE_KEYS.ADVISORIES, this.advisories);
      this.notify();
    }
  }

  public deleteAdvisory(id: string): void {
    this.advisories = this.advisories.filter((a) => a.id !== id);
    this.saveToStorage(STORAGE_KEYS.ADVISORIES, this.advisories);
    this.notify();
  }

  // --- Pest & Diseases ---
  public getPestDiseases(cropId?: string): PestDisease[] {
    if (cropId) {
      return this.pests.filter((p) => p.cropId === cropId);
    }
    return this.pests;
  }

  public savePestDisease(pest: PestDisease): void {
    const idx = this.pests.findIndex((p) => p.id === pest.id);
    if (idx >= 0) {
      this.pests[idx] = pest;
    } else {
      this.pests.unshift(pest);
    }
    this.saveToStorage(STORAGE_KEYS.PESTS, this.pests);
    this.notify();
  }

  public deletePestDisease(id: string): void {
    this.pests = this.pests.filter((p) => p.id !== id);
    this.saveToStorage(STORAGE_KEYS.PESTS, this.pests);
    this.notify();
  }

  // --- Mandi Prices ---
  public getMandiPrices(): MandiPrice[] {
    return this.mandiPrices;
  }

  public saveMandiPrice(item: MandiPrice): void {
    const idx = this.mandiPrices.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      this.mandiPrices[idx] = item;
    } else {
      this.mandiPrices.unshift(item);
    }
    this.saveToStorage(STORAGE_KEYS.MANDI, this.mandiPrices);
    this.notify();
  }

  public deleteMandiPrice(id: string): void {
    this.mandiPrices = this.mandiPrices.filter((m) => m.id !== id);
    this.saveToStorage(STORAGE_KEYS.MANDI, this.mandiPrices);
    this.notify();
  }

  // --- Government Schemes ---
  public getGovernmentSchemes(): GovernmentScheme[] {
    return this.schemes;
  }

  public getEligibleSchemesForFarmer(): GovernmentScheme[] {
    const land = this.farmer.totalLandAcres;
    const state = this.farmer.location.state;

    return this.schemes.filter((s) => {
      if (!s.active) return false;
      if (s.stateApplicable !== 'All India' && !s.stateApplicable.toLowerCase().includes(state.toLowerCase())) {
        return false;
      }
      if (s.maxLandAcres && land > s.maxLandAcres) {
        return false;
      }
      return true;
    });
  }

  public saveGovernmentScheme(scheme: GovernmentScheme): void {
    const idx = this.schemes.findIndex((s) => s.id === scheme.id);
    if (idx >= 0) {
      this.schemes[idx] = scheme;
    } else {
      this.schemes.unshift(scheme);
    }
    this.saveToStorage(STORAGE_KEYS.SCHEMES, this.schemes);
    this.notify();
  }

  public deleteGovernmentScheme(id: string): void {
    this.schemes = this.schemes.filter((s) => s.id !== id);
    this.saveToStorage(STORAGE_KEYS.SCHEMES, this.schemes);
    this.notify();
  }

  // --- Expenses & Profit ---
  public getExpenses(): ExpenseItem[] {
    return this.expenses;
  }

  public addExpense(item: Omit<ExpenseItem, 'id' | 'farmerId'>): ExpenseItem {
    const newExp: ExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`,
      farmerId: this.farmer.id
    };
    this.expenses.unshift(newExp);
    this.saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);
    this.notify();
    return newExp;
  }

  public deleteExpense(id: string): void {
    this.expenses = this.expenses.filter((e) => e.id !== id);
    this.saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);
    this.notify();
  }

  public getFinancialSummary(): {
    totalExpense: number;
    estimatedRevenue: number;
    projectedProfit: number;
    categoryBreakdown: { category: string; amount: number; percentage: number }[];
  } {
    const totalExpense = this.expenses.reduce((sum, e) => sum + e.amount, 0);

    // Realistic estimated revenue based on farmer active crops and acreage
    let estimatedRevenue = 0;
    this.farmerCrops.forEach((c) => {
      if (c.cropId === 'paddy') estimatedRevenue += c.areaAcres * 22 * 2320; // 22 Q/acre @ ₹2,320
      else if (c.cropId === 'maize') estimatedRevenue += c.areaAcres * 20 * 2150; // 20 Q/acre @ ₹2,150
      else if (c.cropId === 'tomato') estimatedRevenue += c.areaAcres * 60 * 1200; // 60 Q/acre @ ₹1,200
      else estimatedRevenue += c.areaAcres * 30000;
    });

    if (estimatedRevenue === 0) estimatedRevenue = 50000;
    const projectedProfit = Math.max(0, estimatedRevenue - totalExpense);

    // Group by category
    const catMap: Record<string, number> = {};
    this.expenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });

    const categoryBreakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    }));

    return {
      totalExpense,
      estimatedRevenue,
      projectedProfit,
      categoryBreakdown
    };
  }

  // --- Notifications ---
  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public markAllNotificationsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
      this.notify();
    }
  }

  // --- Admin Statistics ---
  public getAdminStats(): AdminStats {
    return {
      totalFarmers: 14820,
      activeCrops: this.farmerCrops.length + 8450,
      activeAdvisories: this.advisories.filter((a) => a.active).length,
      weatherAlerts: this.weatherAlerts.length,
      mandiRecords: this.mandiPrices.length,
      schemesCount: this.schemes.filter((s) => s.active).length,
      pestRecords: this.pests.length,
      expertQueriesPending: 14
    };
  }

  // Reset to Factory Default
  public resetToDefault(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.clear();
      } catch {
        // ignore
      }
    }
    this.farmer = DEFAULT_FARMER;
    this.farm = DEFAULT_FARM;
    this.cropsMaster = CROPS_MASTER;
    this.cropStages = CROP_STAGES;
    this.farmerCrops = DEFAULT_FARMER_CROPS;
    this.weather = DEFAULT_WEATHER;
    this.weatherAlerts = WEATHER_ALERTS;
    this.advisories = ADMIN_ADVISORIES;
    this.pests = PEST_DISEASES_DB;
    this.mandiPrices = MANDI_PRICES;
    this.schemes = GOVERNMENT_SCHEMES;
    this.expenses = DEFAULT_EXPENSES;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.recalculateAllCropStages();
    this.notify();
  }

}

export const dataStore = new DataStore();
