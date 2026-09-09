import { 
  Order, 
  AnalyticsKpis, 
  TimeSeriesPoint, 
  CategoryMetric, 
  RegionMetric, 
  ChannelMetric, 
  TimeGranularity, 
  DateRangePreset,
  RegionCode,
  ProductCategory
} from '../types';

/**
 * Formats numbers into Indian Numbering System (Lakhs / Crores) or standard currency
 */
export function formatINR(amount: number, compact: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';

  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (compact) {
    if (abs >= 10000000) {
      const cr = (abs / 10000000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${Number(cr)}Cr`;
    }
    if (abs >= 100000) {
      const l = (abs / 100000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${Number(l)}L`;
    }
    if (abs >= 1000) {
      const k = (abs / 1000).toFixed(1);
      return `${isNegative ? '-' : ''}₹${Number(k)}k`;
    }
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(abs);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatPercent(val: number, showSign: boolean = true): string {
  if (val === undefined || isNaN(val)) return '0.0%';
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

/**
 * Filter orders based on a date preset
 */
export function filterOrdersByPreset(orders: Order[], preset: DateRangePreset): Order[] {
  if (!orders || orders.length === 0) return [];
  if (preset === 'all') return orders;

  const validTimestamps = orders
    .map(o => new Date(o.date).getTime())
    .filter(t => !isNaN(t));

  if (validTimestamps.length === 0) return orders;

  const latestDateMs = Math.max(...validTimestamps);
  const refDate = new Date(latestDateMs);

  let daysToSubtract = 30;
  switch (preset) {
    case '7d':
      daysToSubtract = 7;
      break;
    case '30d':
      daysToSubtract = 30;
      break;
    case '90d':
      daysToSubtract = 90;
      break;
    case '12m':
      daysToSubtract = 365;
      break;
    case 'ytd': {
      const startOfYear = new Date(refDate.getFullYear(), 0, 1).getTime();
      return orders.filter(o => new Date(o.date).getTime() >= startOfYear);
    }
  }

  const cutoff = refDate.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000);
  return orders.filter(o => new Date(o.date).getTime() >= cutoff);
}

/**
 * Calculate KPIs strictly from actual user orders.
 * Returns zeroed values when user has no orders.
 */
export function calculateKpis(
  orders: Order[], 
  compareWithPrevious: boolean = true, 
  preset: DateRangePreset = 'all'
): AnalyticsKpis {
  if (!orders || orders.length === 0) {
    return {
      hasData: false,
      revenue: 0, revenueGrowth: 0, previousRevenue: 0,
      profit: 0, profitGrowth: 0, previousProfit: 0,
      orders: 0, orderGrowth: 0, previousOrders: 0,
      customers: 0, customerGrowth: 0, previousCustomers: 0,
      aov: 0, aovGrowth: 0, previousAov: 0,
      profitMargin: 0,
      totalRevenueFormatted: '₹0',
      totalProfitFormatted: '₹0',
      orderCountFormatted: '0',
      customerCountFormatted: '0',
      aovFormatted: '₹0'
    };
  }

  const activeOrders = preset === 'all' ? orders : filterOrdersByPreset(orders, preset);
  const currentOrders = activeOrders.length > 0 ? activeOrders : orders;

  const validOrders = currentOrders.filter(o => o.status !== 'Cancelled');
  const revenue = validOrders.reduce((sum, o) => sum + (Number(o.revenue) || 0), 0);
  const cost = validOrders.reduce((sum, o) => sum + (Number(o.cost) || 0), 0);
  const profit = validOrders.reduce((sum, o) => sum + (Number(o.profit) || (Number(o.revenue) - Number(o.cost))), 0);
  
  const orderCount = validOrders.length;
  const uniqueCustomers = new Set(
    validOrders.map(o => o.customerId || o.customerEmail || o.customerName)
  ).size;

  const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
  const profitMargin = revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0;

  // Comparison period calculation based on timestamps
  const timestamps = validOrders.map(o => new Date(o.date).getTime()).filter(t => !isNaN(t)).sort((a, b) => a - b);
  let revenueGrowth = 0;
  let profitGrowth = 0;
  let orderGrowth = 0;
  let customerGrowth = 0;
  let aovGrowth = 0;

  let prevRevenue = 0;
  let prevProfit = 0;
  let prevOrders = 0;
  let prevCustomers = 0;
  let prevAov = 0;

  if (timestamps.length >= 4) {
    const midpoint = timestamps[Math.floor(timestamps.length / 2)];
    const earlierOrders = validOrders.filter(o => new Date(o.date).getTime() < midpoint);
    const recentOrders = validOrders.filter(o => new Date(o.date).getTime() >= midpoint);

    if (earlierOrders.length > 0 && recentOrders.length > 0) {
      prevRevenue = earlierOrders.reduce((sum, o) => sum + (Number(o.revenue) || 0), 0);
      prevProfit = earlierOrders.reduce((sum, o) => sum + (Number(o.profit) || 0), 0);
      prevOrders = earlierOrders.length;
      prevCustomers = new Set(earlierOrders.map(o => o.customerId || o.customerName)).size;
      prevAov = prevOrders > 0 ? Math.round(prevRevenue / prevOrders) : 0;

      const recentRevenue = recentOrders.reduce((sum, o) => sum + (Number(o.revenue) || 0), 0);
      const recentProfit = recentOrders.reduce((sum, o) => sum + (Number(o.profit) || 0), 0);
      const recentAov = recentOrders.length > 0 ? Math.round(recentRevenue / recentOrders.length) : 0;
      const recentCustomers = new Set(recentOrders.map(o => o.customerId || o.customerName)).size;

      revenueGrowth = prevRevenue > 0 ? Number((((recentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)) : 0;
      profitGrowth = prevProfit > 0 ? Number((((recentProfit - prevProfit) / prevProfit) * 100).toFixed(1)) : 0;
      orderGrowth = prevOrders > 0 ? Number((((recentOrders.length - prevOrders) / prevOrders) * 100).toFixed(1)) : 0;
      customerGrowth = prevCustomers > 0 ? Number((((recentCustomers - prevCustomers) / prevCustomers) * 100).toFixed(1)) : 0;
      aovGrowth = prevAov > 0 ? Number((((recentAov - prevAov) / prevAov) * 100).toFixed(1)) : 0;
    }
  }

  return {
    hasData: true,
    revenue: Math.round(revenue),
    revenueGrowth,
    previousRevenue: Math.round(prevRevenue),

    profit: Math.round(profit),
    profitGrowth,
    previousProfit: Math.round(prevProfit),

    orders: orderCount,
    orderGrowth,
    previousOrders: prevOrders,

    customers: uniqueCustomers,
    customerGrowth,
    previousCustomers: prevCustomers,

    aov,
    aovGrowth,
    previousAov: prevAov,

    profitMargin,
    totalRevenueFormatted: formatINR(revenue),
    totalProfitFormatted: formatINR(profit),
    orderCountFormatted: formatNumber(orderCount),
    customerCountFormatted: formatNumber(uniqueCustomers),
    aovFormatted: formatINR(aov, false)
  };
}

/**
 * Generate time-series points dynamically from actual user orders.
 * Returns empty array if no orders exist.
 */
export function computeTimeSeries(orders: Order[], granularity: TimeGranularity = 'monthly'): TimeSeriesPoint[] {
  if (!orders || orders.length === 0) return [];

  const validOrders = orders.filter(o => o.status !== 'Cancelled' && o.date);
  if (validOrders.length === 0) return [];

  // Group orders by bucket key
  const buckets: Record<string, { label: string; revenue: number; profit: number; orders: number; date: string }> = {};

  validOrders.forEach(o => {
    const d = new Date(o.date);
    if (isNaN(d.getTime())) return;

    let key = '';
    let label = '';

    if (granularity === 'daily') {
      key = o.date;
      label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } else if (granularity === 'weekly') {
      const year = d.getFullYear();
      const week = Math.ceil((d.getDate()) / 7);
      key = `${year}-W${week}`;
      label = `Week ${week}`;
    } else if (granularity === 'quarterly') {
      const q = Math.floor(d.getMonth() / 3) + 1;
      key = `${d.getFullYear()}-Q${q}`;
      label = `Q${q} ${d.getFullYear()}`;
    } else {
      // Monthly default
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }

    if (!buckets[key]) {
      buckets[key] = { label, revenue: 0, profit: 0, orders: 0, date: key };
    }
    buckets[key].revenue += Number(o.revenue) || 0;
    buckets[key].profit += Number(o.profit) || (Number(o.revenue) - Number(o.cost)) || 0;
    buckets[key].orders += 1;
  });

  const sortedKeys = Object.keys(buckets).sort();
  if (sortedKeys.length === 0) return [];

  return sortedKeys.map((k, idx) => {
    const curr = buckets[k];
    const prev = idx > 0 ? buckets[sortedKeys[idx - 1]] : curr;

    return {
      date: curr.date,
      label: curr.label,
      revenue: Math.round(curr.revenue),
      profit: Math.round(curr.profit),
      orders: curr.orders,
      previousRevenue: Math.round(prev.revenue),
      previousProfit: Math.round(prev.profit)
    };
  });
}

/**
 * Compute breakdown by category strictly from user's data
 */
export function computeCategoryBreakdown(orders: Order[]): CategoryMetric[] {
  if (!orders || orders.length === 0) return [];

  const map: Record<string, { revenue: number; profit: number; orders: number }> = {};
  let grandTotal = 0;

  orders.filter(o => o.status !== 'Cancelled').forEach(o => {
    const cat = o.category || 'Uncategorized';
    if (!map[cat]) {
      map[cat] = { revenue: 0, profit: 0, orders: 0 };
    }
    const rev = Number(o.revenue) || 0;
    map[cat].revenue += rev;
    map[cat].profit += Number(o.profit) || (rev - (Number(o.cost) || 0));
    map[cat].orders += 1;
    grandTotal += rev;
  });

  return Object.keys(map).map(cat => {
    const item = map[cat];
    return {
      category: cat as ProductCategory,
      revenue: Math.round(item.revenue),
      orders: item.orders,
      profit: Math.round(item.profit),
      marginPct: item.revenue > 0 ? Number(((item.profit / item.revenue) * 100).toFixed(1)) : 0,
      sharePct: grandTotal > 0 ? Number(((item.revenue / grandTotal) * 100).toFixed(1)) : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

/**
 * Compute breakdown by region strictly from user's data
 */
export function computeRegionalBreakdown(orders: Order[]): RegionMetric[] {
  if (!orders || orders.length === 0) return [];

  const map: Record<string, { revenue: number; profit: number; orders: number; customers: Set<string>; cities: Record<string, number> }> = {};

  orders.filter(o => o.status !== 'Cancelled' && o.region).forEach(o => {
    const reg = o.region;
    if (!map[reg]) {
      map[reg] = { revenue: 0, profit: 0, orders: 0, customers: new Set(), cities: {} };
    }
    const rev = Number(o.revenue) || 0;
    map[reg].revenue += rev;
    map[reg].profit += Number(o.profit) || (rev - (Number(o.cost) || 0));
    map[reg].orders += 1;
    if (o.customerId || o.customerName) {
      map[reg].customers.add(o.customerId || o.customerName);
    }
    if (o.city) {
      map[reg].cities[o.city] = (map[reg].cities[o.city] || 0) + rev;
    }
  });

  return Object.keys(map).map(reg => {
    const item = map[reg];
    const topCities = Object.keys(item.cities).map(city => ({
      city,
      revenue: item.cities[city],
      share: item.revenue > 0 ? Number(((item.cities[city] / item.revenue) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.revenue - a.revenue);

    return {
      id: reg as RegionCode,
      name: `${reg} Territory`,
      revenue: Math.round(item.revenue),
      orders: item.orders,
      profit: Math.round(item.profit),
      marginPct: item.revenue > 0 ? Number(((item.profit / item.revenue) * 100).toFixed(1)) : 0,
      growthPct: 0,
      customers: item.customers.size,
      topCities
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

/**
 * Compute breakdown by channel strictly from user's data
 */
export function computeChannelBreakdown(orders: Order[]): ChannelMetric[] {
  if (!orders || orders.length === 0) return [];

  const map: Record<string, { revenue: number; orders: number }> = {};
  let totalRev = 0;

  orders.filter(o => o.status !== 'Cancelled').forEach(o => {
    const ch = o.channel || 'Direct';
    if (!map[ch]) {
      map[ch] = { revenue: 0, orders: 0 };
    }
    const rev = Number(o.revenue) || 0;
    map[ch].revenue += rev;
    map[ch].orders += 1;
    totalRev += rev;
  });

  return Object.keys(map).map(ch => {
    const item = map[ch];
    return {
      channel: ch,
      revenue: Math.round(item.revenue),
      orders: item.orders,
      aov: item.orders > 0 ? Math.round(item.revenue / item.orders) : 0,
      sharePct: totalRev > 0 ? Number(((item.revenue / totalRev) * 100).toFixed(1)) : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);
}
