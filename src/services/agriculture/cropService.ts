import cropsData from '../../data/agriculture/crops/crops.json';
import wheatLifecycle from '../../data/agriculture/crops/wheat.json';
import riceLifecycle from '../../data/agriculture/crops/rice.json';
import cottonLifecycle from '../../data/agriculture/crops/cotton.json';
import tomatoLifecycle from '../../data/agriculture/crops/tomato.json';
import potatoLifecycle from '../../data/agriculture/crops/potato.json';
import mustardLifecycle from '../../data/agriculture/crops/mustard.json';
import maizeLifecycle from '../../data/agriculture/crops/maize.json';
import gramLifecycle from '../../data/agriculture/crops/gram.json';

export interface CropMasterRecord {
  crop_id: string;
  name_en: string;
  name_hi: string;
  botanical_name: string | null;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Vegetable' | 'Oilseed';
  season: 'Rabi' | 'Kharif' | 'Zaid' | 'Rabi/Kharif' | 'Kharif/Rabi' | 'All-season';
  typical_duration: {
    min_days: number;
    max_days: number;
  };
  supported_states: string[];
  source_ids: string[];
  data_status: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
}

export interface LifecycleStageRecord {
  stage_number: number;
  stage_name_en: string;
  stage_name_hi: string;
  duration_days: string;
  irrigation_guidance: string;
  nutrient_guidance: string;
  pest_disease_scouting: string;
  precautions: string;
  source_ids: string[];
}

export interface CropLifecycleData {
  crop_id: string;
  crop_name_en: string;
  crop_name_hi: string;
  data_status: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
  source_ids: string[];
  lifecycle_stages: LifecycleStageRecord[];
}

const crops: CropMasterRecord[] = cropsData as CropMasterRecord[];

const lifecycleMap: Record<string, CropLifecycleData> = {
  wheat: wheatLifecycle as CropLifecycleData,
  rice: riceLifecycle as CropLifecycleData,
  cotton: cottonLifecycle as CropLifecycleData,
  tomato: tomatoLifecycle as CropLifecycleData,
  potato: potatoLifecycle as CropLifecycleData,
  mustard: mustardLifecycle as CropLifecycleData,
  maize: maizeLifecycle as CropLifecycleData,
  gram: gramLifecycle as CropLifecycleData
};

export const cropService = {
  getAllCrops(): CropMasterRecord[] {
    return crops;
  },

  getCropById(cropId: string): CropMasterRecord | null {
    const found = crops.find((c) => c.crop_id.toLowerCase() === cropId.toLowerCase());
    return found || null;
  },

  getCropLifecycle(cropId: string): CropLifecycleData | null {
    const found = lifecycleMap[cropId.toLowerCase()];
    return found || null;
  },

  getCropStage(cropId: string, stageNumber: number): LifecycleStageRecord | null {
    const lifecycle = this.getCropLifecycle(cropId);
    if (!lifecycle) return null;
    const stage = lifecycle.lifecycle_stages.find((s) => s.stage_number === stageNumber);
    return stage || null;
  }
};
