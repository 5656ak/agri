import chemicalsData from '../../data/agriculture/chemicals/cibrc_chemicals.json';

export interface ChemicalRecord {
  chemical_id: string;
  active_ingredient: string;
  formulation: string;
  crop_id: string;
  target_condition_ids: string[];
  dosage: {
    per_acre: string;
    per_hectare: string;
  };
  dilution: string;
  application_method: string;
  phi_waiting_period_days: number;
  safety_precautions: string[];
  source_id: string;
  verification_status: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
  last_verified_date: string;
}

const chemicals: ChemicalRecord[] = chemicalsData as ChemicalRecord[];

export const chemicalService = {
  getAllChemicals(): ChemicalRecord[] {
    return chemicals;
  },

  getChemicalById(chemicalId: string): ChemicalRecord | null {
    const found = chemicals.find((c) => c.chemical_id === chemicalId);
    return found || null;
  },

  getVerifiedChemicalsForCondition(cropId: string, conditionId: string): ChemicalRecord[] {
    return chemicals.filter(
      (c) =>
        c.verification_status === 'VERIFIED' &&
        c.crop_id.toLowerCase() === cropId.toLowerCase() &&
        c.target_condition_ids.includes(conditionId)
    );
  }
};
