import { describe, it, expect, beforeEach } from 'vitest';
import { locationService, ALL_INDIAN_STATES_DISTRICTS } from '../services/locationService';
import { dataStore } from '../services/dataStore';

describe('Indian High-Accuracy Location Service & Geocoding', () => {
  beforeEach(() => {
    dataStore.resetToDefault();
  });

  it('should cover major Indian agricultural states and districts', () => {
    expect(ALL_INDIAN_STATES_DISTRICTS['Jharkhand']).toContain('Ranchi');
    expect(ALL_INDIAN_STATES_DISTRICTS['Bihar']).toContain('Patna');
    expect(ALL_INDIAN_STATES_DISTRICTS['Uttar Pradesh']).toContain('Varanasi');
    expect(ALL_INDIAN_STATES_DISTRICTS['Punjab']).toContain('Ludhiana');
    expect(ALL_INDIAN_STATES_DISTRICTS['Maharashtra']).toContain('Pune');
    expect(ALL_INDIAN_STATES_DISTRICTS['Gujarat']).toContain('Ahmedabad');
  });

  it('should accurately calculate spatial distance between two Indian coordinates via Haversine formula', () => {
    // Distance between Ranchi (23.3441, 85.3096) and Patna (25.5941, 85.1376) ~ 250 km
    const dist = locationService.calculateDistanceKm(23.3441, 85.3096, 25.5941, 85.1376);
    expect(dist).toBeGreaterThan(200);
    expect(dist).toBeLessThan(300);
  });

  it('should resolve nearest district centroid for coordinates in Jharkhand', () => {
    // Coordinate near Ranchi
    const match = locationService.findNearestDistrict(23.35, 85.32);
    expect(match.state).toBe('Jharkhand');
    expect(match.district).toBe('Ranchi');
    expect(match.distanceKm).toBeLessThan(10);
  });

  it('should resolve nearest district centroid for coordinates in Punjab', () => {
    // Coordinate near Ludhiana
    const match = locationService.findNearestDistrict(30.90, 75.85);
    expect(match.state).toBe('Punjab');
    expect(match.district).toBe('Ludhiana');
    expect(match.distanceKm).toBeLessThan(10);
  });

  it('should normalize state and district names properly', () => {
    const stateNorm = locationService.normalizeStateName('uttar pradesh');
    expect(stateNorm).toBe('Uttar Pradesh');

    const distNorm = locationService.normalizeDistrictName('ranchi district', 'Jharkhand');
    expect(distNorm).toBe('Ranchi');
  });

  it('should calibrate local micro-weather dynamically when location changes in dataStore', () => {
    dataStore.updateLocation({
      state: 'Punjab',
      district: 'Ludhiana',
      block: 'Ludhiana West',
      village: 'Gill',
      formattedAddress: 'Gill, Ludhiana, Punjab'
    });

    const weather = dataStore.getWeather();
    expect(weather.farmingDirectiveHi).toContain('Ludhiana');
    expect(weather.rainProbabilityPercent).toBe(15);
  });
});
