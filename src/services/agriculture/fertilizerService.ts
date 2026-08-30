import stcrData from '../../data/agriculture/fertilizers/stcr_equations.json';
import { cropService } from './cropService';
import { sourceService, ResearchSourceRecord } from './sourceService';

export interface STCREquationRecord {
  equation_id: string;
  crop_id: string;
  region_id: string;
  state_coverage: string[];
  soil_type: string;
  target_yield_min: number;
  target_yield_max: number;
  equation_N: {
    formula: string;
    a_coeff: number;
    b_coeff: number;
  };
  equation_P2O5: {
    formula: string;
    a_coeff: number;
    b_coeff: number;
  };
  equation_K2O: {
    formula: string;
    a_coeff: number;
    b_coeff: number;
  };
  stage_split: {
    basal: { n_ratio: number; p_ratio: number; k_ratio: number };
    first_topdress: { n_ratio: number; p_ratio: number; k_ratio: number };
    second_topdress?: { n_ratio: number; p_ratio: number; k_ratio: number };
  };
  micronutrient_guidance: string | null;
  source_id: string;
  verification_status: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
}

export interface FertilizerInput {
  crop_id: string;
  state: string;
  region?: string;
  soil_type?: string;
  area_acres: number;
  growth_stage: 'basal' | 'first_topdress' | 'second_topdress' | string;
  target_yield_q_ha: number;
  soil_N_kg_ha: number;
  soil_P_kg_ha: number;
  soil_K_kg_ha: number;
  soil_pH: number;
}

export interface CalculationTraceStep {
  step_number: number;
  title: string;
  description: string;
  formula_applied?: string;
  values?: Record<string, string | number>;
}

export interface CommercialBags {
  urea_50kg_bags: number;
  dap_50kg_bags: number;
  mop_50kg_bags: number;
  urea_kg: number;
  dap_kg: number;
  mop_kg: number;
}

export interface FertilizerAuditRecord {
  audit_id: string;
  timestamp: string;
  crop_id: string;
  state: string;
  region: string;
  soil_type: string;
  area_acres: number;
  soil_values: {
    N: number;
    P: number;
    K: number;
    pH: number;
  };
  target_yield_q_ha: number;
  equation_id: string | null;
  source_id: string | null;
  calculated_nutrients_kg_ha: {
    N: number;
    P2O5: number;
    K2O: number;
  } | null;
  verification_status: 'VERIFIED' | 'VERIFICATION_REQUIRED';
}

export interface FertilizerRecommendationResult {
  status: 'VERIFIED' | 'VERIFICATION_REQUIRED';
  message: string;
  missing_requirements?: string[];
  equation_used?: {
    id: string;
    source: ResearchSourceRecord;
    soil_type: string;
    target_yield_range: string;
    formula_N: string;
    formula_P: string;
    formula_K: string;
  };
  total_crop_requirement_kg_ha?: {
    N: number;
    P2O5: number;
    K2O: number;
  };
  field_total_nutrients_kg?: {
    N: number;
    P2O5: number;
    K2O: number;
  };
  field_total_bags?: CommercialBags;
  commercial_conversion_status?: 'VERIFIED_FORMULATION' | 'UNAVAILABLE';
  commercial_conversion_message?: string;
  current_stage_dose?: {
    stage_key: string;
    stage_name: string;
    pure_nutrients_kg: {
      N: number;
      P2O5: number;
      K2O: number;
    };
    urea_bags: number;
    dap_bags: number;
    mop_bags: number;
    instructions: string;
  };
  traceability_breakdown?: CalculationTraceStep[];
  micronutrient_advice?: string | null;
  safety_notice?: string;
}

const equations: STCREquationRecord[] = stcrData as STCREquationRecord[];
const auditLogs: FertilizerAuditRecord[] = [];

export const fertilizerService = {
  getAllEquations(): STCREquationRecord[] {
    return equations;
  },

  getAuditLogs(): FertilizerAuditRecord[] {
    return [...auditLogs];
  },

  findVerifiedEquation(cropId: string, state: string, soilType?: string): STCREquationRecord | null {
    if (!cropId || !state) return null;

    const match = equations.find((eq) => {
      // Must be strictly verified
      if (eq.verification_status !== 'VERIFIED') return false;
      if (eq.crop_id.toLowerCase() !== cropId.toLowerCase()) return false;

      // State match check
      const stateMatch = eq.state_coverage.some(
        (st) => st.toLowerCase().includes(state.toLowerCase()) || state.toLowerCase().includes(st.toLowerCase())
      );
      if (!stateMatch) return false;

      // Optional soil type check if explicitly specified
      if (soilType && soilType !== 'Default' && soilType !== 'Any') {
        const soilMatch = eq.soil_type.toLowerCase().includes(soilType.toLowerCase()) ||
                          soilType.toLowerCase().includes(eq.soil_type.toLowerCase());
        if (!soilMatch) return false;
      }

      return true;
    });

    return match || null;
  },

  calculateFertilizerRecommendation(input: FertilizerInput): FertilizerRecommendationResult {
    const missing: string[] = [];

    // 1. Crop exists check
    const cropMaster = cropService.getCropById(input.crop_id);
    if (!cropMaster) {
      missing.push(`Invalid or unsupported crop identifier: "${input.crop_id}".`);
    }

    // 2. State/Region check
    if (!input.state || input.state.trim() === '') {
      missing.push('State selection is mandatory for agro-climatic calibration.');
    }

    // 3. Soil values validity check (strictly non-null and non-negative)
    if (input.soil_N_kg_ha == null || isNaN(input.soil_N_kg_ha) || input.soil_N_kg_ha < 0) {
      missing.push('Valid non-negative Available Soil Nitrogen (N in kg/ha) is required.');
    }
    if (input.soil_P_kg_ha == null || isNaN(input.soil_P_kg_ha) || input.soil_P_kg_ha < 0) {
      missing.push('Valid non-negative Available Soil Phosphorus (P in kg/ha) is required.');
    }
    if (input.soil_K_kg_ha == null || isNaN(input.soil_K_kg_ha) || input.soil_K_kg_ha < 0) {
      missing.push('Valid non-negative Available Soil Potassium (K in kg/ha) is required.');
    }
    if (input.soil_pH == null || isNaN(input.soil_pH) || input.soil_pH < 3.5 || input.soil_pH > 10.5) {
      missing.push('Valid Soil pH (between 3.5 and 10.5) is required.');
    }

    // 4. Area check
    if (!input.area_acres || isNaN(input.area_acres) || input.area_acres <= 0) {
      missing.push('Cultivated field area in acres must be greater than 0.');
    }

    // 5. Target yield check
    if (!input.target_yield_q_ha || isNaN(input.target_yield_q_ha) || input.target_yield_q_ha <= 0) {
      missing.push('Realistic target yield (in Quintals/hectare) is required.');
    }

    // 6. Growth stage check
    const validStages = ['basal', 'first_topdress', 'second_topdress', 'tillering', 'flowering', 'jointing'];
    const isStageValid = validStages.some((s) => input.growth_stage?.toLowerCase().includes(s));
    if (!input.growth_stage || !isStageValid) {
      missing.push(`Invalid growth stage identifier: "${input.growth_stage}".`);
    }

    // If initial validation fails, log audit and return early
    if (missing.length > 0) {
      this.recordAuditLog(input, null, null, 'VERIFICATION_REQUIRED');
      return {
        status: 'VERIFICATION_REQUIRED',
        message: 'Verified recommendation unavailable. Please consult your nearest KVK/agricultural expert.',
        missing_requirements: missing
      };
    }

    // 7. Find strictly verified STCR equation
    const equation = this.findVerifiedEquation(input.crop_id, input.state, input.soil_type);
    if (!equation) {
      const reason = `No verified ICAR-IISS STCR target yield equation found for crop "${input.crop_id}" in state "${input.state}"${input.soil_type ? ` with soil "${input.soil_type}"` : ''}.`;
      this.recordAuditLog(input, null, null, 'VERIFICATION_REQUIRED');
      return {
        status: 'VERIFICATION_REQUIRED',
        message: 'Verified recommendation unavailable. Please consult your nearest KVK/agricultural expert.',
        missing_requirements: [reason]
      };
    }

    // 8. Check Target Yield experimental domain bounds
    if (
      input.target_yield_q_ha < equation.target_yield_min ||
      input.target_yield_q_ha > equation.target_yield_max
    ) {
      const reason = `Target yield (${input.target_yield_q_ha} Q/ha) is outside the verified experimental research range (${equation.target_yield_min} - ${equation.target_yield_max} Q/ha) for equation ${equation.equation_id}.`;
      this.recordAuditLog(input, equation.equation_id, null, 'VERIFICATION_REQUIRED');
      return {
        status: 'VERIFICATION_REQUIRED',
        message: 'Verified recommendation unavailable. Please consult your nearest KVK/agricultural expert.',
        missing_requirements: [reason]
      };
    }

    // Deterministic Calculation Pipeline (No LLM in math)
    const T = input.target_yield_q_ha;
    const SN = input.soil_N_kg_ha;
    const SP = input.soil_P_kg_ha;
    const SK = input.soil_K_kg_ha;

    // Step A: Pure Nutrient in kg/ha
    const fn_kg_ha = Math.max(0, equation.equation_N.a_coeff * T - equation.equation_N.b_coeff * SN);
    const fp_kg_ha = Math.max(0, equation.equation_P2O5.a_coeff * T - equation.equation_P2O5.b_coeff * SP);
    const fk_kg_ha = Math.max(0, equation.equation_K2O.a_coeff * T - equation.equation_K2O.b_coeff * SK);

    // Step B: Field Area Conversion (1 Hectare = 2.47105 Acres)
    const area_ha = input.area_acres / 2.47105;
    const total_N_field = fn_kg_ha * area_ha;
    const total_P_field = fp_kg_ha * area_ha;
    const total_K_field = fk_kg_ha * area_ha;

    // Step C: Commercial Fertilizer Formulation Conversion (Urea 46% N, DAP 18:46:0, MOP 60% K2O)
    // DAP satisfies P2O5 requirement (46% P2O5)
    const dap_kg = total_P_field / 0.46;
    const dap_bags = parseFloat((dap_kg / 50).toFixed(2));
    const n_from_dap = dap_kg * 0.18;

    // Remaining Nitrogen for Urea (46% N)
    const balance_n = Math.max(0, total_N_field - n_from_dap);
    const urea_kg = balance_n / 0.46;
    const urea_bags = parseFloat((urea_kg / 50).toFixed(2));

    // MOP satisfies K2O requirement (60% K2O)
    const mop_kg = total_K_field / 0.60;
    const mop_bags = parseFloat((mop_kg / 50).toFixed(2));

    // Step D: Stage Split Distribution
    let stageKey: 'basal' | 'first_topdress' | 'second_topdress' = 'basal';
    if (input.growth_stage.toLowerCase().includes('first') || input.growth_stage.toLowerCase().includes('tillering')) {
      stageKey = 'first_topdress';
    } else if (input.growth_stage.toLowerCase().includes('second') || input.growth_stage.toLowerCase().includes('flowering')) {
      stageKey = 'second_topdress';
    }

    const split = equation.stage_split[stageKey] || equation.stage_split.basal;
    const stage_urea_bags = parseFloat((urea_bags * split.n_ratio).toFixed(2));
    const stage_dap_bags = parseFloat((dap_bags * split.p_ratio).toFixed(2));
    const stage_mop_bags = parseFloat((mop_bags * split.k_ratio).toFixed(2));

    const stage_pure_n = parseFloat((total_N_field * split.n_ratio).toFixed(1));
    const stage_pure_p = parseFloat((total_P_field * split.p_ratio).toFixed(1));
    const stage_pure_k = parseFloat((total_K_field * split.k_ratio).toFixed(1));

    // Traceability Steps
    const traceSteps: CalculationTraceStep[] = [
      {
        step_number: 1,
        title: 'Target Yield & Soil Status Verification',
        description: `Target Yield ${T} Q/ha verified within validated research range (${equation.target_yield_min}-${equation.target_yield_max} Q/ha).`,
        values: { 'Target Yield (T)': `${T} Q/ha`, 'Soil N': `${SN} kg/ha`, 'Soil P': `${SP} kg/ha`, 'Soil K': `${SK} kg/ha`, 'Soil pH': input.soil_pH }
      },
      {
        step_number: 2,
        title: 'STCR Equation Nutrient Modeling',
        description: 'Applied ICAR-IISS calibrated soil test crop response equations.',
        formula_applied: `FN = ${equation.equation_N.a_coeff} * T - ${equation.equation_N.b_coeff} * SN | FP = ${equation.equation_P2O5.a_coeff} * T - ${equation.equation_P2O5.b_coeff} * SP | FK = ${equation.equation_K2O.a_coeff} * T - ${equation.equation_K2O.b_coeff} * SK`,
        values: { 'Req. Nitrogen (N)': `${fn_kg_ha.toFixed(1)} kg/ha`, 'Req. Phosphorus (P2O5)': `${fp_kg_ha.toFixed(1)} kg/ha`, 'Req. Potassium (K2O)': `${fk_kg_ha.toFixed(1)} kg/ha` }
      },
      {
        step_number: 3,
        title: 'Farmer Farm Size Scaling',
        description: `Scaled 1 ha rates to farmer cultivated area (${input.area_acres} Acres = ${area_ha.toFixed(2)} Hectares).`,
        values: { 'Total Field N': `${total_N_field.toFixed(1)} kg`, 'Total Field P2O5': `${total_P_field.toFixed(1)} kg`, 'Total Field K2O': `${total_K_field.toFixed(1)} kg` }
      },
      {
        step_number: 4,
        title: 'Commercial Formulation & Stage Split',
        description: `Formulation conversion into standard 50kg bags (DAP: 18-46-0, Urea: 46-0-0, MOP: 0-0-60) at stage: ${stageKey}.`,
        values: { 'Stage Urea Bags': stage_urea_bags, 'Stage DAP Bags': stage_dap_bags, 'Stage MOP Bags': stage_mop_bags }
      }
    ];

    const sourceRecord = sourceService.getSafeSourceDisplay(equation.source_id);

    // Record audit log
    this.recordAuditLog(
      input,
      equation.equation_id,
      { N: fn_kg_ha, P2O5: fp_kg_ha, K2O: fk_kg_ha },
      'VERIFIED'
    );

    return {
      status: 'VERIFIED',
      message: 'Verified ICAR-IISS STCR recommendation successfully computed.',
      equation_used: {
        id: equation.equation_id,
        source: sourceRecord,
        soil_type: equation.soil_type,
        target_yield_range: `${equation.target_yield_min} - ${equation.target_yield_max} Q/ha`,
        formula_N: equation.equation_N.formula,
        formula_P: equation.equation_P2O5.formula,
        formula_K: equation.equation_K2O.formula
      },
      total_crop_requirement_kg_ha: {
        N: parseFloat(fn_kg_ha.toFixed(1)),
        P2O5: parseFloat(fp_kg_ha.toFixed(1)),
        K2O: parseFloat(fk_kg_ha.toFixed(1))
      },
      field_total_nutrients_kg: {
        N: parseFloat(total_N_field.toFixed(1)),
        P2O5: parseFloat(total_P_field.toFixed(1)),
        K2O: parseFloat(total_K_field.toFixed(1))
      },
      field_total_bags: {
        urea_50kg_bags: urea_bags,
        dap_50kg_bags: dap_bags,
        mop_50kg_bags: mop_bags,
        urea_kg: parseFloat(urea_kg.toFixed(1)),
        dap_kg: parseFloat(dap_kg.toFixed(1)),
        mop_kg: parseFloat(mop_kg.toFixed(1))
      },
      commercial_conversion_status: 'VERIFIED_FORMULATION',
      commercial_conversion_message: 'Commercial conversion verified using standard registered formulations (Urea 46% N, DAP 18:46:0, MOP 60% K2O).',
      current_stage_dose: {
        stage_key: stageKey,
        stage_name: stageKey === 'basal'
          ? '1. बुवाई के समय (Basal Dressing)'
          : stageKey === 'first_topdress'
          ? '2. पहली टॉप-ड्रेसिंग (1st Top-Dress at CRI/Tillering)'
          : '3. दूसरी टॉप-ड्रेसिंग (2nd Top-Dress at Jointing/Panicle)',
        pure_nutrients_kg: {
          N: stage_pure_n,
          P2O5: stage_pure_p,
          K2O: stage_pure_k
        },
        urea_bags: stage_urea_bags,
        dap_bags: stage_dap_bags,
        mop_bags: stage_mop_bags,
        instructions: stageKey === 'basal'
          ? 'बेसल डोज के रूप में पूरा DAP व MOP तथा 1/3 यूरिया बुवाई से पहले खेत में मिलाएं।'
          : 'पहली सिंचाई (CRI/टिलरिंग) के तुरंत बाद यूरिया की संतुलित मात्रा का छिड़काव करें।'
      },
      traceability_breakdown: traceSteps,
      micronutrient_advice: equation.micronutrient_guidance,
      safety_notice: 'यह सलाह मिट्टी जांच और सत्यापित ICAR-IISS STCR डेटा पर आधारित है।'
    };
  },

  recordAuditLog(
    input: FertilizerInput,
    equationId: string | null,
    nutrients: { N: number; P2O5: number; K2O: number } | null,
    status: 'VERIFIED' | 'VERIFICATION_REQUIRED'
  ) {
    const auditRecord: FertilizerAuditRecord = {
      audit_id: `AUDIT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      crop_id: input.crop_id || 'unknown',
      state: input.state || 'unknown',
      region: input.region || 'default',
      soil_type: input.soil_type || 'default',
      area_acres: input.area_acres || 0,
      soil_values: {
        N: input.soil_N_kg_ha || 0,
        P: input.soil_P_kg_ha || 0,
        K: input.soil_K_kg_ha || 0,
        pH: input.soil_pH || 0
      },
      target_yield_q_ha: input.target_yield_q_ha || 0,
      equation_id: equationId,
      source_id: 'SRC_ICAR_IISS',
      calculated_nutrients_kg_ha: nutrients,
      verification_status: status
    };

    auditLogs.push(auditRecord);
    // Keep max 100 in-memory logs
    if (auditLogs.length > 100) {
      auditLogs.shift();
    }
  }
};
