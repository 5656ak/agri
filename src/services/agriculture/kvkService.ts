import kvkData from '../../data/agriculture/kvk/kvk_directory.json';

export interface KVKRecord {
  kvk_id: string;
  name: string;
  state: string;
  district: string;
  host_organization: string;
  phone: string;
  email: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  source_id: string;
  verification_status: 'VERIFIED' | 'DEMO' | 'PENDING_VERIFICATION';
}

const kvks: KVKRecord[] = kvkData as KVKRecord[];

export const kvkService = {
  getAllKvks(): KVKRecord[] {
    return kvks;
  },

  getKvksByState(state: string): KVKRecord[] {
    if (!state || state === 'All') return kvks;
    return kvks.filter((k) => k.state.toLowerCase() === state.toLowerCase());
  },

  searchKvks(query: string, state?: string): KVKRecord[] {
    let list = kvks;
    if (state && state !== 'All') {
      list = list.filter((k) => k.state.toLowerCase() === state.toLowerCase());
    }
    if (!query) return list;

    const q = query.toLowerCase();
    return list.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.district.toLowerCase().includes(q) ||
        k.host_organization.toLowerCase().includes(q)
    );
  }
};
