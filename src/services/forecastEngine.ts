import { ForecastPoint, ForecastSummary, Order } from '../types';

export type ForecastHorizon = '30d' | '90d' | '6m' | '12m';

export function generateForecast(orders: Order[], horizon: ForecastHorizon = '90d'): ForecastSummary {
  // If user has no orders or fewer than 3 chronological orders with dates
  if (!orders || orders.length === 0) {
    return {
      canForecast: false,
      reason: 'No sales data detected. Upload your historical sales records to generate predictive revenue forecasts.',
      expectedRevenue: 0,
      expectedGrowth: 0,
      bestCase: 0,
      worstCase: 0,
      confidenceScore: 0,
      points: []
    };
  }

  // Filter valid dates
  const datedOrders = orders
    .filter(o => o.status !== 'Cancelled' && o.date && !isNaN(new Date(o.date).getTime()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate by month to check span
  const monthlyAgg: Record<string, { label: string; revenue: number; date: string }> = {};
  datedOrders.forEach(o => {
    const d = new Date(o.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    if (!monthlyAgg[key]) {
      monthlyAgg[key] = { label, revenue: 0, date: key };
    }
    monthlyAgg[key].revenue += Number(o.revenue) || 0;
  });

  const monthKeys = Object.keys(monthlyAgg).sort();

  if (monthKeys.length < 2 && datedOrders.length < 6) {
    return {
      canForecast: false,
      reason: 'Insufficient historical data. Forecasting requires at least 2 distinct monthly cycles or 6+ historical order intervals.',
      expectedRevenue: 0,
      expectedGrowth: 0,
      bestCase: 0,
      worstCase: 0,
      confidenceScore: 0,
      points: []
    };
  }

  // Build real historical points
  const historicalPoints: ForecastPoint[] = monthKeys.map(k => ({
    date: monthlyAgg[k].date,
    label: monthlyAgg[k].label,
    historicalRevenue: Math.round(monthlyAgg[k].revenue),
    forecastRevenue: Math.round(monthlyAgg[k].revenue),
    upperConfidence: Math.round(monthlyAgg[k].revenue),
    lowerConfidence: Math.round(monthlyAgg[k].revenue),
  }));

  // Simple weighted moving average / growth slope calculation from real points
  const lastRevenue = historicalPoints[historicalPoints.length - 1].historicalRevenue || 1000;
  const firstRevenue = historicalPoints[0].historicalRevenue || 1000;
  const rawGrowthRate = (lastRevenue - firstRevenue) / (firstRevenue || 1);
  const monthlySlope = Math.max(-0.2, Math.min(0.35, rawGrowthRate / (historicalPoints.length || 1)));

  // Generate future projection points
  const numSteps = horizon === '30d' ? 2 : horizon === '90d' ? 3 : horizon === '6m' ? 6 : 12;
  const futurePoints: ForecastPoint[] = [];

  let currentProjected = lastRevenue;
  let totalExpected = 0;

  for (let i = 1; i <= numSteps; i++) {
    currentProjected = Math.round(currentProjected * (1 + monthlySlope));
    const uncertaintyBand = 0.08 + (i * 0.03); // increases further in the future
    const upper = Math.round(currentProjected * (1 + uncertaintyBand));
    const lower = Math.round(currentProjected * (1 - uncertaintyBand));

    futurePoints.push({
      date: `Future+${i}`,
      label: `Month +${i}`,
      forecastRevenue: currentProjected,
      upperConfidence: upper,
      lowerConfidence: lower
    });

    totalExpected += currentProjected;
  }

  const expectedGrowth = Math.round(monthlySlope * 100 * 10) / 10;
  const bestCase = Math.round(totalExpected * 1.15);
  const worstCase = Math.round(totalExpected * 0.85);

  return {
    canForecast: true,
    expectedRevenue: totalExpected,
    expectedGrowth,
    bestCase,
    worstCase,
    confidenceScore: Math.min(94, Math.max(68, 70 + historicalPoints.length * 4)),
    points: [...historicalPoints, ...futurePoints]
  };
}
