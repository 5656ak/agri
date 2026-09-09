import { describe, it, expect } from 'vitest';
import { 
  formatINR, 
  formatPercent, 
  calculateKpis, 
  computeTimeSeries,
  computeCategoryBreakdown,
  computeRegionalBreakdown,
  computeChannelBreakdown
} from '../services/analyticsEngine';
import { generateForecast } from '../services/forecastEngine';
import { executeAiQuery, getAiInsights, getExecutiveSummary } from '../services/aiInsightEngine';
import { calculatePasswordStrength, validateEmail } from '../services/authService';
import { Order } from '../types';

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-101',
    date: '2026-07-15',
    customerId: 'cust-1',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav@example.com',
    productId: 'p-1',
    productName: 'NEXA SoundPod Pro',
    category: 'Consumer Electronics',
    region: 'North',
    channel: 'Direct Website',
    quantity: 2,
    unitPrice: 2499,
    revenue: 4998,
    cost: 2400,
    profit: 2598,
    marginPct: 52.0,
    status: 'Delivered'
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-102',
    date: '2026-08-10',
    customerId: 'cust-2',
    customerName: 'Meera Rao',
    customerEmail: 'meera@example.com',
    productId: 'p-2',
    productName: 'ErgoChair Pro',
    category: 'Office & Workspace',
    region: 'West',
    channel: 'Direct Website',
    quantity: 1,
    unitPrice: 15000,
    revenue: 15000,
    cost: 9000,
    profit: 6000,
    marginPct: 40.0,
    status: 'Delivered'
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-103',
    date: '2026-08-20',
    customerId: 'cust-1',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav@example.com',
    productId: 'p-3',
    productName: 'Artisanal Coffee Beans',
    category: 'Gourmet Food',
    region: 'North',
    channel: 'Marketplace',
    quantity: 3,
    unitPrice: 800,
    revenue: 2400,
    cost: 1200,
    profit: 1200,
    marginPct: 50.0,
    status: 'Delivered'
  },
  {
    id: 'ord-4',
    orderNumber: 'ORD-104',
    date: '2026-09-01',
    customerId: 'cust-3',
    customerName: 'Rohan Gupta',
    customerEmail: 'rohan@example.com',
    productId: 'p-1',
    productName: 'NEXA SoundPod Pro',
    category: 'Consumer Electronics',
    region: 'South',
    channel: 'Direct Website',
    quantity: 1,
    unitPrice: 2499,
    revenue: 2499,
    cost: 1200,
    profit: 1299,
    marginPct: 52.0,
    status: 'Delivered'
  },
  {
    id: 'ord-5',
    orderNumber: 'ORD-105',
    date: '2026-09-05',
    customerId: 'cust-4',
    customerName: 'Kavita Sen',
    customerEmail: 'kavita@example.com',
    productId: 'p-4',
    productName: 'AuraFit Watch',
    category: 'Consumer Electronics',
    region: 'East',
    channel: 'Social Commerce',
    quantity: 1,
    unitPrice: 5999,
    revenue: 5999,
    cost: 3200,
    profit: 2799,
    marginPct: 46.7,
    status: 'Delivered'
  },
  {
    id: 'ord-6',
    orderNumber: 'ORD-106',
    date: '2026-09-08',
    customerId: 'cust-2',
    customerName: 'Meera Rao',
    customerEmail: 'meera@example.com',
    productId: 'p-3',
    productName: 'Artisanal Coffee Beans',
    category: 'Gourmet Food',
    region: 'West',
    channel: 'Direct Website',
    quantity: 2,
    unitPrice: 800,
    revenue: 1600,
    cost: 800,
    profit: 800,
    marginPct: 50.0,
    status: 'Delivered'
  }
];

describe('NEXA Formatting Helpers', () => {
  it('formats INR numbers correctly in compact Indian notation', () => {
    expect(formatINR(2480000)).toBe('₹24.8L');
    expect(formatINR(642000)).toBe('₹6.42L');
    expect(formatINR(12400000)).toBe('₹1.24Cr');
    expect(formatINR(6450, false)).toBe('₹6,450');
    expect(formatINR(0)).toBe('₹0');
  });

  it('formats percentages with proper sign indicators', () => {
    expect(formatPercent(18.6)).toBe('+18.6%');
    expect(formatPercent(-7.2)).toBe('-7.2%');
    expect(formatPercent(0)).toBe('0.0%');
  });
});

describe('Zero-Data / Empty Workspace Guarantees', () => {
  it('returns safe zeroed KPIs when dataset is empty', () => {
    const kpis = calculateKpis([]);
    expect(kpis.hasData).toBe(false);
    expect(kpis.revenue).toBe(0);
    expect(kpis.profit).toBe(0);
    expect(kpis.orders).toBe(0);
    expect(kpis.customers).toBe(0);
    expect(kpis.aov).toBe(0);
    expect(kpis.profitMargin).toBe(0);
    expect(kpis.totalRevenueFormatted).toBe('₹0');
  });

  it('returns empty time-series and breakdown arrays when orders is empty', () => {
    expect(computeTimeSeries([])).toEqual([]);
    expect(computeCategoryBreakdown([])).toEqual([]);
    expect(computeRegionalBreakdown([])).toEqual([]);
    expect(computeChannelBreakdown([])).toEqual([]);
  });

  it('safely declines forecast when orders is empty', () => {
    const forecast = generateForecast([]);
    expect(forecast.canForecast).toBe(false);
    expect(forecast.expectedRevenue).toBe(0);
    expect(forecast.points).toEqual([]);
  });

  it('returns zero-data AI message and empty insights array when no orders exist', () => {
    const kpis = calculateKpis([]);
    const insights = getAiInsights(kpis, []);
    expect(insights).toEqual([]);

    const summary = getExecutiveSummary(kpis, []);
    expect(summary).toContain('awaiting business data');

    const queryRes = executeAiQuery('What is my revenue?', kpis, []);
    expect(queryRes.keyMetricValue).toBe('0 Orders');
  });
});

describe('Active Dataset Dynamic Analytics Calculations', () => {
  it('calculates accurate aggregate KPIs strictly from order items', () => {
    const kpis = calculateKpis(SAMPLE_ORDERS);
    expect(kpis.hasData).toBe(true);
    expect(kpis.orders).toBe(6);
    expect(kpis.customers).toBe(4); // 4 unique customers: Aarav, Meera, Rohan, Kavita

    const totalRev = SAMPLE_ORDERS.reduce((s, o) => s + o.revenue, 0);
    const totalProfit = SAMPLE_ORDERS.reduce((s, o) => s + o.profit, 0);

    expect(kpis.revenue).toBe(totalRev);
    expect(kpis.profit).toBe(totalProfit);
    expect(kpis.aov).toBe(Math.round(totalRev / 6));
  });

  it('computes dynamic time series from real order dates', () => {
    const series = computeTimeSeries(SAMPLE_ORDERS, 'monthly');
    expect(series.length).toBeGreaterThan(0);
    const totalSeriesRev = series.reduce((s, p) => s + p.revenue, 0);
    const expectedRev = SAMPLE_ORDERS.reduce((s, o) => s + o.revenue, 0);
    expect(totalSeriesRev).toBe(expectedRev);
  });

  it('computes category breakdown with accurate percentage share', () => {
    const categories = computeCategoryBreakdown(SAMPLE_ORDERS);
    expect(categories.length).toBe(3); // Consumer Electronics, Office & Workspace, Gourmet Food

    const totalShare = categories.reduce((s, c) => s + c.sharePct, 0);
    expect(Math.round(totalShare)).toBe(100);
  });

  it('generates multi-horizon forecast when historical requirements are met', () => {
    const forecast = generateForecast(SAMPLE_ORDERS, '30d');
    expect(forecast.canForecast).toBe(true);
    expect(forecast.expectedRevenue).toBeGreaterThan(0);
    expect(forecast.bestCase).toBeGreaterThanOrEqual(forecast.expectedRevenue);
    expect(forecast.worstCase).toBeLessThanOrEqual(forecast.expectedRevenue);
    expect(forecast.confidenceScore).toBeGreaterThan(50);
  });

  it('answers dynamic AI natural language queries with real calculated figures', () => {
    const kpis = calculateKpis(SAMPLE_ORDERS);
    const res = executeAiQuery('What was my total revenue and growth?', kpis, SAMPLE_ORDERS);
    expect(res.keyMetricValue).toBe(kpis.totalRevenueFormatted);
    expect(res.dataPoints.length).toBeGreaterThan(0);
    expect(res.actionRoute).toBe('products');
  });
});

describe('NEXA Auth & Security Utilities', () => {
  it('correctly evaluates password strength', () => {
    const weak = calculatePasswordStrength('pass');
    expect(weak.score).toBeLessThanOrEqual(2);

    const strong = calculatePasswordStrength('SuperP@ssw0rd2026!');
    expect(strong.score).toBeGreaterThanOrEqual(4);
    expect(strong.hasUppercase).toBe(true);
    expect(strong.hasNumber).toBe(true);
    expect(strong.hasSpecial).toBe(true);
  });

  it('validates email formats accurately', () => {
    expect(validateEmail('founder@company.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});
