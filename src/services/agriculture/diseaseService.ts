import diseasesData from '../../data/agriculture/diseases/diseases.json';

export interface DiseaseRecord {
  disease_id: string;
  crop_id: string;
  disease_name_en: string;
  disease_name_hi: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest_Damage' | 'Nutrient_Deficiency' | 'Physiological_Disorder';
  pathogen: string | null;
  symptoms_en: string[];
  symptoms_hi: string[];
  differential_diagnosis: string | null;
  cultural_management: string[];
  biological_organic_management: string[];
  chemical_management_reference_ids: string[];
  source_ids: string[];
  verification_status: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
}

const diseases: DiseaseRecord[] = diseasesData as DiseaseRecord[];

export const diseaseService = {
  getAllDiseases(): DiseaseRecord[] {
    return diseases;
  },

  getDiseasesByCrop(cropId: string): DiseaseRecord[] {
    return diseases.filter((d) => d.crop_id.toLowerCase() === cropId.toLowerCase());
  },

  getDiseaseById(diseaseId: string): DiseaseRecord | null {
    const found = diseases.find((d) => d.disease_id.toLowerCase() === diseaseId.toLowerCase());
    return found || null;
  },

  getVerifiedDiseases(): DiseaseRecord[] {
    return diseases.filter((d) => d.verification_status === 'VERIFIED');
  }
};
