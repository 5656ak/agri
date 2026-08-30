import { describe, it, expect, beforeEach } from 'vitest';
import { dataStore } from '../services/dataStore';
import { recommendationEngine } from '../services/recommendationEngine';
import { translations, getTranslation } from '../i18n/translations';

describe('KisanSaathi DataStore & CRUD Operations', () => {
  beforeEach(() => {
    dataStore.resetToDefault();
  });

  it('should load default farmer profile and farm structure correctly', () => {
    const farmer = dataStore.getFarmerProfile();
    const farm = dataStore.getFarm();
    expect(farmer.name).toContain('Ramesh Kumar');
    expect(farmer.location.district).toBe('Ranchi');
    expect(farm.fields.length).toBe(3);
    expect(farm.totalAreaAcres).toBe(5.0);
  });

  it('should accurately calculate crop age and stage from sowing date', () => {
    const calc = dataStore.calculateCropAgeAndStage('paddy', '2026-07-15');
    expect(calc.ageDays).toBeGreaterThanOrEqual(0);
    expect(calc.stageNumber).toBeGreaterThanOrEqual(1);
    expect(calc.stageName).toBeDefined();
  });

  it('should add a new crop and update active crops list', () => {
    const initialCount = dataStore.getFarmerCrops().length;
    const newCrop = dataStore.addFarmerCrop({
      cropId: 'mustard',
      variety: 'Pusa Bold',
      fieldId: 'field-2',
      areaAcres: 1.5,
      sowingDate: '2026-10-15',
      soilType: 'Sandy Loam',
      irrigationType: 'Sprinkler'
    });

    expect(newCrop.id).toBeDefined();
    expect(dataStore.getFarmerCrops().length).toBe(initialCount + 1);
    expect(dataStore.getFarmerCropById(newCrop.id)?.variety).toBe('Pusa Bold');
  });

  it('should add a new expense and calculate financial profit analytics', () => {
    const initialExpCount = dataStore.getExpenses().length;
    dataStore.addExpense({
      category: 'Fertilizer',
      amount: 3200,
      cropName: 'धान (Paddy)',
      notes: 'Urea & Zinc test expense',
      date: '2026-08-30'
    });

    expect(dataStore.getExpenses().length).toBe(initialExpCount + 1);
    const summary = dataStore.getFinancialSummary();
    expect(summary.totalExpense).toBeGreaterThan(0);
    expect(summary.estimatedRevenue).toBeGreaterThan(summary.totalExpense);
    expect(summary.projectedProfit).toBeGreaterThan(0);
    expect(summary.categoryBreakdown.length).toBeGreaterThan(0);
  });

  it('should allow admin to broadcast advisories and reflect in active advisories', () => {
    const initialAdvCount = dataStore.getAdvisories().length;
    dataStore.saveAdvisory({
      id: 'adv-test-101',
      titleHi: 'धान में ब्लास्ट रोग सतर्कता',
      titleEn: 'Blast Disease Alert in Paddy',
      descriptionHi: 'नमी बढ़ने पर ब्लास्ट का खतरा',
      descriptionEn: 'High risk of blast due to humidity',
      actionHi: 'ट्राइसाइक्लाजोल का छिड़काव करें',
      actionEn: 'Spray Tricyclazole',
      cropId: 'paddy',
      state: 'Jharkhand',
      severity: 'CRITICAL',
      startDate: '2026-08-30',
      endDate: '2026-09-30',
      active: true,
      sourceInstitution: 'ICAR-IIRR'
    });

    expect(dataStore.getAdvisories().length).toBe(initialAdvCount + 1);
    const active = dataStore.getActiveAdvisoriesForFarmer();
    const found = active.find((a) => a.id === 'adv-test-101');
    expect(found).toBeDefined();
    expect(found?.severity).toBe('CRITICAL');
  });
});

describe('Dynamic Recommendation Engine ("Don\'t just show data. Tell the farmer what to do")', () => {
  beforeEach(() => {
    dataStore.resetToDefault();
  });

  it('should generate action directives based on high rain probability', () => {
    // Default weather has 65% rain probability
    const recs = recommendationEngine.getTodayRecommendations('hi');
    expect(recs.length).toBeGreaterThanOrEqual(1);

    const irrigationRec = recs.find((r) => r.type === 'IRRIGATION');
    expect(irrigationRec).toBeDefined();
    expect(irrigationRec?.titleHi).toContain('सिंचाई की आवश्यकता नहीं है');
    expect(irrigationRec?.reasonHi).toContain('प्राकृतिक वर्षा');
  });

  it('should prioritize active regional admin advisories in daily advice', () => {
    const recs = recommendationEngine.getTodayRecommendations('hi');
    const pestRec = recs.find((r) => r.type === 'PEST');
    expect(pestRec).toBeDefined();
  });

  it('should support bilingual translation toggling', () => {
    const hindiTrans = getTranslation('hi');
    const englishTrans = getTranslation('en');

    expect(hindiTrans.appName).toBe('KisanSaathi');
    expect(hindiTrans.greeting).toContain('नमस्ते');
    expect(englishTrans.greeting).toContain('Namaste');
    expect(hindiTrans.todayAdviceTitle).toContain('आज आपके खेत में');
    expect(englishTrans.todayAdviceTitle).toContain('Today in Your Field');
  });
});
