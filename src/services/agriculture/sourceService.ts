import sourcesData from '../../data/agriculture/sources/research_sources.json';

export interface ResearchSourceRecord {
  source_id: string;
  institution: string;
  document_title: string;
  publication_year: string | number | null;
  revision_year: string | number | null;
  source_type: string;
  official_url: string | null;
  verification_status: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
  notes?: string | null;
}

const sources: ResearchSourceRecord[] = sourcesData as ResearchSourceRecord[];

export const sourceService = {
  getAllSources(): ResearchSourceRecord[] {
    return sources;
  },

  getSourceById(sourceId: string): ResearchSourceRecord | null {
    const found = sources.find((s) => s.source_id === sourceId);
    return found || null;
  },

  getSafeSourceDisplay(sourceId?: string | null): ResearchSourceRecord {
    if (!sourceId) {
      return {
        source_id: 'UNKNOWN',
        institution: 'Research source verification pending.',
        document_title: 'Document verification in progress',
        publication_year: null,
        revision_year: null,
        source_type: 'PENDING',
        official_url: null,
        verification_status: 'PENDING_VERIFICATION'
      };
    }

    const found = this.getSourceById(sourceId);
    if (!found) {
      return {
        source_id: sourceId,
        institution: 'Research source verification pending.',
        document_title: 'Document verification in progress',
        publication_year: null,
        revision_year: null,
        source_type: 'PENDING',
        official_url: null,
        verification_status: 'PENDING_VERIFICATION'
      };
    }

    return found;
  },

  validateSourceId(sourceId: string): boolean {
    return sources.some((s) => s.source_id === sourceId);
  }
};
