import { cropService } from './cropService';
import { diseaseService } from './diseaseService';
import { fertilizerService } from './fertilizerService';
import { chemicalService } from './chemicalService';
import { sourceService } from './sourceService';
import { kvkService } from './kvkService';

export interface ValidationReport {
  isValid: boolean;
  totalErrors: number;
  totalWarnings: number;
  errors: string[];
  warnings: string[];
  stats: {
    cropsCount: number;
    diseasesCount: number;
    stcrEquationsCount: number;
    chemicalsCount: number;
    sourcesCount: number;
    kvkCount: number;
  };
}

export const validationService = {
  validateKnowledgeBase(): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    const crops = cropService.getAllCrops();
    const diseases = diseaseService.getAllDiseases();
    const equations = fertilizerService.getAllEquations();
    const chemicals = chemicalService.getAllChemicals();
    const sources = sourceService.getAllSources();
    const kvks = kvkService.getAllKvks();

    // 1. Validate Sources
    const sourceIds = new Set<string>();
    sources.forEach((s) => {
      if (!s.source_id) errors.push(`Source missing source_id`);
      if (sourceIds.has(s.source_id)) errors.push(`Duplicate source_id: ${s.source_id}`);
      sourceIds.add(s.source_id);

      if (!s.institution) errors.push(`Source ${s.source_id} missing institution`);
      if (!s.document_title) errors.push(`Source ${s.source_id} missing document_title`);
    });

    // 2. Validate Crops
    const cropIds = new Set<string>();
    crops.forEach((c) => {
      if (!c.crop_id) errors.push(`Crop missing crop_id`);
      if (cropIds.has(c.crop_id)) errors.push(`Duplicate crop_id: ${c.crop_id}`);
      cropIds.add(c.crop_id);

      if (!c.name_en || !c.name_hi) errors.push(`Crop ${c.crop_id} missing English/Hindi name`);

      c.source_ids.forEach((srcId) => {
        if (!sourceIds.has(srcId)) {
          errors.push(`Crop ${c.crop_id} references non-existent source: ${srcId}`);
        }
      });

      // Validate 10-stage lifecycle presence
      const lifecycle = cropService.getCropLifecycle(c.crop_id);
      if (!lifecycle) {
        errors.push(`Crop ${c.crop_id} missing complete 10-stage lifecycle dataset`);
      } else if (lifecycle.lifecycle_stages.length !== 10) {
        errors.push(`Crop ${c.crop_id} lifecycle has ${lifecycle.lifecycle_stages.length} stages instead of 10`);
      }
    });

    // 3. Validate Diseases
    const diseaseIds = new Set<string>();
    diseases.forEach((d) => {
      if (!d.disease_id) errors.push(`Disease missing disease_id`);
      if (diseaseIds.has(d.disease_id)) errors.push(`Duplicate disease_id: ${d.disease_id}`);
      diseaseIds.add(d.disease_id);

      if (!cropIds.has(d.crop_id.toLowerCase())) {
        errors.push(`Disease ${d.disease_id} references invalid crop_id: ${d.crop_id}`);
      }

      d.source_ids.forEach((srcId) => {
        if (!sourceIds.has(srcId)) {
          errors.push(`Disease ${d.disease_id} references non-existent source: ${srcId}`);
        }
      });

      if (d.verification_status === 'PENDING_VERIFICATION') {
        warnings.push(`Disease ${d.disease_id} (${d.disease_name_en}) is marked PENDING_VERIFICATION.`);
      }
    });

    // 4. Validate STCR Equations
    const equationIds = new Set<string>();
    equations.forEach((eq) => {
      if (!eq.equation_id) errors.push(`STCR equation missing equation_id`);
      if (equationIds.has(eq.equation_id)) errors.push(`Duplicate equation_id: ${eq.equation_id}`);
      equationIds.add(eq.equation_id);

      if (!cropIds.has(eq.crop_id.toLowerCase())) {
        errors.push(`STCR equation ${eq.equation_id} references invalid crop_id: ${eq.crop_id}`);
      }

      if (!sourceIds.has(eq.source_id)) {
        errors.push(`STCR equation ${eq.equation_id} references non-existent source: ${eq.source_id}`);
      }

      if (eq.target_yield_min >= eq.target_yield_max) {
        errors.push(`STCR equation ${eq.equation_id} has invalid yield bounds [${eq.target_yield_min}, ${eq.target_yield_max}]`);
      }
    });

    // 5. Validate Chemicals
    const chemicalIds = new Set<string>();
    chemicals.forEach((chem) => {
      if (!chem.chemical_id) errors.push(`Chemical missing chemical_id`);
      if (chemicalIds.has(chem.chemical_id)) errors.push(`Duplicate chemical_id: ${chem.chemical_id}`);
      chemicalIds.add(chem.chemical_id);

      if (!cropIds.has(chem.crop_id.toLowerCase())) {
        errors.push(`Chemical ${chem.chemical_id} references invalid crop_id: ${chem.crop_id}`);
      }

      if (!sourceIds.has(chem.source_id)) {
        errors.push(`Chemical ${chem.chemical_id} references non-existent source: ${chem.source_id}`);
      }

      chem.target_condition_ids.forEach((condId) => {
        if (!diseaseIds.has(condId)) {
          errors.push(`Chemical ${chem.chemical_id} references non-existent condition_id: ${condId}`);
        }
      });
    });

    // 6. Validate KVKs
    const kvkIds = new Set<string>();
    kvks.forEach((k) => {
      if (!k.kvk_id) errors.push(`KVK missing kvk_id`);
      if (kvkIds.has(k.kvk_id)) errors.push(`Duplicate kvk_id: ${k.kvk_id}`);
      kvkIds.add(k.kvk_id);

      if (!sourceIds.has(k.source_id)) {
        errors.push(`KVK ${k.kvk_id} references non-existent source: ${k.source_id}`);
      }
    });

    return {
      isValid: errors.length === 0,
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      errors,
      warnings,
      stats: {
        cropsCount: crops.length,
        diseasesCount: diseases.length,
        stcrEquationsCount: equations.length,
        chemicalsCount: chemicals.length,
        sourcesCount: sources.length,
        kvkCount: kvks.length
      }
    };
  }
};
