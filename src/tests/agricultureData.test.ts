import { describe, it, expect } from 'vitest';
import { validationService } from '../services/agriculture/validationService';
import { fertilizerService, FertilizerInput } from '../services/agriculture/fertilizerService';
import { cropService } from '../services/agriculture/cropService';
import { diseaseService } from '../services/agriculture/diseaseService';
import { chemicalService } from '../services/agriculture/chemicalService';
import { sourceService } from '../services/agriculture/sourceService';

describe('Agricultural Knowledge Base Integrity', () => {
  it('should pass complete structural and relational validation without errors', () => {
    const report = validationService.validateKnowledgeBase();
    if (!report.isValid) {
      console.error('Validation errors found:', report.errors);
    }
    expect(report.isValid).toBe(true);
    expect(report.totalErrors).toBe(0);
    expect(report.stats.cropsCount).toBe(8);
    expect(report.stats.diseasesCount).toBeGreaterThanOrEqual(30);
    expect(report.stats.stcrEquationsCount).toBeGreaterThanOrEqual(3);
    expect(report.stats.sourcesCount).toBeGreaterThanOrEqual(8);
  });

  it('should have 10-stage lifecycle datasets for all 8 crops', () => {
    const crops = cropService.getAllCrops();
    expect(crops.length).toBe(8);

    crops.forEach((c) => {
      const lifecycle = cropService.getCropLifecycle(c.crop_id);
      expect(lifecycle).not.toBeNull();
      expect(lifecycle?.lifecycle_stages.length).toBe(10);
      expect(lifecycle?.crop_id).toBe(c.crop_id);
    });
  });

  it('should return safe fallback display when a research source is missing or pending', () => {
    const safeDisplay = sourceService.getSafeSourceDisplay('NON_EXISTENT_SRC');
    expect(safeDisplay.institution).toBe('Research source verification pending.');
    expect(safeDisplay.verification_status).toBe('PENDING_VERIFICATION');
  });
});

describe('Deterministic STCR Fertilizer Engine Safety & Verification Gates', () => {
  const validWheatInput: FertilizerInput = {
    crop_id: 'wheat',
    state: 'Haryana',
    region: 'Karnal',
    soil_type: 'Alluvial Sandy Loam / Loam',
    area_acres: 2.5,
    growth_stage: 'first_topdress',
    target_yield_q_ha: 55,
    soil_N_kg_ha: 180,
    soil_P_kg_ha: 16,
    soil_K_kg_ha: 190,
    soil_pH: 7.4
  };

  it('1. should successfully compute verified fertilizer recommendation for valid verified input', () => {
    const result = fertilizerService.calculateFertilizerRecommendation(validWheatInput);
    expect(result.status).toBe('VERIFIED');
    expect(result.field_total_bags).toBeDefined();
    expect(result.field_total_bags?.urea_50kg_bags).toBeGreaterThan(0);
    expect(result.field_total_bags?.dap_50kg_bags).toBeGreaterThan(0);
    expect(result.field_total_bags?.mop_50kg_bags).toBeGreaterThan(0);
    expect(result.total_crop_requirement_kg_ha?.N).toBeGreaterThan(0);
    expect(result.equation_used?.source.source_id).toBe('SRC_ICAR_IISS');
    expect(result.traceability_breakdown).toBeDefined();
    expect(result.traceability_breakdown?.length).toBe(4);
  });

  it('2. should block calculation when crop has no STCR equation (Missing equation)', () => {
    const missingEqInput: FertilizerInput = {
      ...validWheatInput,
      crop_id: 'potato'
    };
    const result = fertilizerService.calculateFertilizerRecommendation(missingEqInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
    expect(result.message).toContain('Verified recommendation unavailable.');
    expect(result.missing_requirements?.[0]).toContain('No verified ICAR-IISS STCR target yield equation found');
  });

  it('3. should block calculation when equation is marked PENDING_VERIFICATION (Unverified equation)', () => {
    const unverifiedEqInput: FertilizerInput = {
      ...validWheatInput,
      crop_id: 'cotton',
      state: 'Maharashtra'
    };
    const result = fertilizerService.calculateFertilizerRecommendation(unverifiedEqInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
    expect(result.message).toContain('Verified recommendation unavailable.');
  });

  it('4. should block calculation for uncalibrated state (Wrong state)', () => {
    const wrongStateInput: FertilizerInput = {
      ...validWheatInput,
      state: 'Kerala'
    };
    const result = fertilizerService.calculateFertilizerRecommendation(wrongStateInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
    expect(result.message).toContain('Verified recommendation unavailable.');
  });

  it('5. should block calculation when soil type does not match calibrated model (Wrong soil type)', () => {
    const wrongSoilInput: FertilizerInput = {
      ...validWheatInput,
      soil_type: 'Laterite Deep Acidic Red Soil'
    };
    const result = fertilizerService.calculateFertilizerRecommendation(wrongSoilInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
  });

  it('6. should block calculation when target yield is below calibrated research bounds', () => {
    const yieldTooLowInput: FertilizerInput = {
      ...validWheatInput,
      target_yield_q_ha: 20 // Below min 40 Q/ha for irrigated alluvial wheat
    };
    const result = fertilizerService.calculateFertilizerRecommendation(yieldTooLowInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
    expect(result.missing_requirements?.[0]).toContain('outside the verified experimental research range');
  });

  it('7. should block calculation when target yield is above calibrated research bounds', () => {
    const yieldTooHighInput: FertilizerInput = {
      ...validWheatInput,
      target_yield_q_ha: 100 // Above max 65 Q/ha
    };
    const result = fertilizerService.calculateFertilizerRecommendation(yieldTooHighInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
    expect(result.missing_requirements?.[0]).toContain('outside the verified experimental research range');
  });

  it('8. should block calculation when Soil Nitrogen (N) is missing or negative', () => {
    const missingNInput: FertilizerInput = {
      ...validWheatInput,
      soil_N_kg_ha: -5
    };
    const result = fertilizerService.calculateFertilizerRecommendation(missingNInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
  });

  it('9. should block calculation when Soil Phosphorus (P) is missing or negative', () => {
    const missingPInput: FertilizerInput = {
      ...validWheatInput,
      soil_P_kg_ha: -1
    };
    const result = fertilizerService.calculateFertilizerRecommendation(missingPInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
  });

  it('10. should block calculation when Soil Potassium (K) is missing or negative', () => {
    const missingKInput: FertilizerInput = {
      ...validWheatInput,
      soil_K_kg_ha: -10
    };
    const result = fertilizerService.calculateFertilizerRecommendation(missingKInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
  });

  it('11. should block calculation when Soil pH is outside agronomical bounds (Missing/Invalid pH)', () => {
    const invalidPhInput: FertilizerInput = {
      ...validWheatInput,
      soil_pH: 2.0 // Toxic hyper-acidic, not supported without remediation
    };
    const result = fertilizerService.calculateFertilizerRecommendation(invalidPhInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
  });

  it('12. should block calculation for non-existent crop (Invalid crop)', () => {
    const invalidCropInput: FertilizerInput = {
      ...validWheatInput,
      crop_id: 'unknown_crop_xyz'
    };
    const result = fertilizerService.calculateFertilizerRecommendation(invalidCropInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
  });

  it('13. should block calculation for invalid growth stage', () => {
    const invalidStageInput: FertilizerInput = {
      ...validWheatInput,
      growth_stage: 'invalid_stage_xyz'
    };
    const result = fertilizerService.calculateFertilizerRecommendation(invalidStageInput);
    expect(result.status).toBe('VERIFICATION_REQUIRED');
  });

  it('14. should log an internal audit record without storing farmer PII', () => {
    fertilizerService.calculateFertilizerRecommendation(validWheatInput);
    const logs = fertilizerService.getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    const lastLog = logs[logs.length - 1];
    expect(lastLog.crop_id).toBe('wheat');
    expect(lastLog.state).toBe('Haryana');
    expect(lastLog.verification_status).toBe('VERIFIED');
    expect(lastLog.timestamp).toBeDefined();
  });
});

describe('Chemical & Pathology Safety Constraints', () => {
  it('should only return verified CIBRC chemical records for registered target pathologies', () => {
    const chemicals = chemicalService.getVerifiedChemicalsForCondition('wheat', 'DIS_WHEAT_YELLOW_RUST');
    expect(chemicals.length).toBeGreaterThan(0);
    chemicals.forEach((c) => {
      expect(c.verification_status).toBe('VERIFIED');
      expect(c.source_id).toBe('SRC_CIBRC');
      expect(c.dosage.per_acre).toBeDefined();
    });
  });

  it('should return empty list when no verified chemical is registered (zero AI invention)', () => {
    const unverifiedChemicals = chemicalService.getVerifiedChemicalsForCondition('cotton', 'DIS_GENERIC_PENDING_1');
    expect(unverifiedChemicals.length).toBe(0);
  });

  it('should accurately isolate pending verification diseases from verified diagnoses', () => {
    const pending = diseaseService.getDiseaseById('DIS_GENERIC_PENDING_1');
    expect(pending?.verification_status).toBe('PENDING_VERIFICATION');
    expect(pending?.symptoms_en[0]).toBe('Verified data pending');
  });
});
