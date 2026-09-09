import { AiInsight, AnalyticsKpis, Order } from '../types';
import { formatINR, formatPercent, computeCategoryBreakdown, computeRegionalBreakdown } from './analyticsEngine';
import { generateForecast } from './forecastEngine';

export interface AiQueryResult {
  query: string;
  explanation: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  keyMetricTrend: string;
  dataPoints: string[];
  suggestedAction: string;
  actionRoute?: string;
}

/**
 * Generate dynamic executive summary from real KPI computations and orders
 */
export function getExecutiveSummary(kpis: AnalyticsKpis, orders: Order[] = []): string {
  if (!kpis.hasData || orders.length === 0) {
    return 'Your workspace is currently awaiting business data. Ingest sales records via CSV/Excel or enter orders through the manual spreadsheet to unlock autonomous executive intelligence, anomaly detection, and growth recommendations.';
  }

  const categories = computeCategoryBreakdown(orders);
  const regions = computeRegionalBreakdown(orders);
  const topCategory = categories[0]?.category || 'Primary Category';
  const topCatShare = categories[0]?.sharePct || 0;
  const topRegion = regions[0]?.name || 'Primary Region';

  const revGrowthText = kpis.revenueGrowth >= 0 ? `+${kpis.revenueGrowth}%` : `${kpis.revenueGrowth}%`;
  const profitGrowthText = kpis.profitGrowth >= 0 ? `+${kpis.profitGrowth}%` : `${kpis.profitGrowth}%`;

  return `Current performance reflects ${kpis.totalRevenueFormatted} in gross revenue across ${kpis.orderCountFormatted} transactions with ${kpis.totalProfitFormatted} in net profit (${kpis.profitMargin}% margin). Revenue growth tracked at ${revGrowthText} with net profitability shifting by ${profitGrowthText}. ${topCategory} accounted for ${topCatShare}% of aggregate volume, with ${topRegion} leading geographic sales contribution.`;
}

/**
 * Generate AI insights dynamically based purely on the user's actual data.
 * Zero hardcoded fallback constants.
 */
export function getAiInsights(kpis: AnalyticsKpis, orders: Order[] = []): AiInsight[] {
  if (!kpis.hasData || orders.length === 0) {
    return [];
  }

  const insights: AiInsight[] = [];
  const categories = computeCategoryBreakdown(orders);
  const regions = computeRegionalBreakdown(orders);

  // 1. Top Category Velocity / Opportunity
  if (categories.length > 0) {
    const topCat = categories[0];
    insights.push({
      id: 'ins-top-cat',
      type: 'opportunity',
      title: `Dominant Category Volume: ${topCat.category}`,
      description: `${topCat.category} represents ${topCat.sharePct}% of your total revenue (${formatINR(topCat.revenue)}) across ${topCat.orders} orders with a ${topCat.marginPct}% profit margin.`,
      metric: `${topCat.sharePct}%`,
      metricChange: 'Share of Total Sales',
      impact: 'High',
      recommendation: `Scale high-velocity inventory allocation for ${topCat.category} and protect supplier supply lines.`,
      ctaLabel: 'Analyze Category Mix',
      actionTarget: 'products',
      category: 'Product Strategy',
      date: 'Generated Just Now'
    });
  }

  // 2. Margin Health Assessment
  if (kpis.profitMargin > 0) {
    const isHealthy = kpis.profitMargin >= 20;
    insights.push({
      id: 'ins-margin-health',
      type: isHealthy ? 'opportunity' : 'risk',
      title: isHealthy ? 'Healthy Net Operating Margin' : 'Margin Compression Detected',
      description: isHealthy
        ? `Your storewide profit margin of ${kpis.profitMargin}% delivers robust unit economics (${kpis.totalProfitFormatted} net profit on ${kpis.totalRevenueFormatted} revenue).`
        : `Storewide margin is currently ${kpis.profitMargin}%. Discounting, fulfillment costs, or high product costs may be compressing gross contribution.`,
      metric: `${kpis.profitMargin}%`,
      metricChange: 'Operating Margin',
      impact: isHealthy ? 'Medium' : 'High',
      recommendation: isHealthy
        ? 'Reinvest surplus gross profit into targeted customer acquisition channels.'
        : 'Review unit product costs, reduce excessive promotional discounting, and optimize shipping surcharge thresholds.',
      ctaLabel: 'Inspect Margin Structure',
      actionTarget: 'sales',
      category: 'Profitability',
      date: 'Generated Just Now'
    });
  }

  // 3. Regional Distribution / Anomaly
  if (regions.length > 1) {
    const topRegion = regions[0];
    const lowestRegion = regions[regions.length - 1];
    insights.push({
      id: 'ins-regional-variance',
      type: 'recommendation',
      title: `Geographic Expansion: ${topRegion.name}`,
      description: `${topRegion.name} generated the highest regional volume (${formatINR(topRegion.revenue)}), compared to ${lowestRegion.name} (${formatINR(lowestRegion.revenue)}).`,
      metric: formatINR(topRegion.revenue),
      metricChange: `${topRegion.marginPct}% Margin`,
      impact: 'Medium',
      recommendation: `Evaluate regional marketing campaigns in under-indexed regions like ${lowestRegion.name} while doubling down on fulfillment in ${topRegion.name}.`,
      ctaLabel: 'Review Regional Breakdown',
      actionTarget: 'regions',
      category: 'Geographic Strategy',
      date: 'Generated Just Now'
    });
  }

  // 4. Customer Basket & AOV Insight
  if (kpis.aov > 0) {
    insights.push({
      id: 'ins-aov-efficiency',
      type: 'opportunity',
      title: 'Average Basket Size & Value',
      description: `Your average transaction value stands at ${kpis.aovFormatted} across ${kpis.customerCountFormatted} unique customers.`,
      metric: kpis.aovFormatted,
      metricChange: 'Average Order Value',
      impact: 'Medium',
      recommendation: 'Implement cross-sell bundles and minimum spend free-shipping tiers to increase basket items per order.',
      ctaLabel: 'View Customer Cohorts',
      actionTarget: 'customers',
      category: 'Basket Economics',
      date: 'Generated Just Now'
    });
  }

  // 5. Predictive Trend Insight
  const forecast = generateForecast(orders, '30d');
  if (forecast.canForecast && forecast.expectedRevenue > 0) {
    insights.push({
      id: 'ins-predictive-runway',
      type: 'opportunity',
      title: '30-Day Revenue Projection',
      description: `Predictive autoregressive modeling projects next cycle revenue at ${formatINR(forecast.expectedRevenue)} with ${forecast.confidenceScore}% statistical confidence.`,
      metric: formatINR(forecast.expectedRevenue),
      metricChange: `${forecast.expectedGrowth >= 0 ? '+' : ''}${forecast.expectedGrowth}% MoM Projected`,
      impact: 'High',
      recommendation: 'Align procurement orders with forecasted demand bounds to avoid stockouts or capital lockup.',
      ctaLabel: 'View 90-Day Forecast',
      actionTarget: 'forecast',
      category: 'Predictive Runway',
      date: 'Generated Just Now'
    });
  }

  return insights;
}

/**
 * Execute AI Natural Language Query strictly against the user's active dataset
 */
export function executeAiQuery(userQuery: string, kpis?: AnalyticsKpis, orders: Order[] = []): AiQueryResult {
  if (!kpis || !kpis.hasData || orders.length === 0) {
    return {
      query: userQuery,
      explanation: 'No transaction data is available in your workspace yet. Please upload a CSV/Excel file or add orders via the manual spreadsheet to enable AI intelligence queries.',
      keyMetricLabel: 'Dataset Status',
      keyMetricValue: '0 Orders',
      keyMetricTrend: 'Awaiting Ingestion',
      dataPoints: [
        'No sales records currently loaded for this business workspace',
        'Upload your sales transactions to query revenue, margins, customer behavior, and forecasts',
        'NEXA processes data entirely inside your authenticated workspace'
      ],
      suggestedAction: 'Import your sales dataset or enter records manually',
      actionRoute: 'data-sources'
    };
  }

  const queryLower = userQuery.toLowerCase();
  const categories = computeCategoryBreakdown(orders);
  const regions = computeRegionalBreakdown(orders);

  // Revenue & Growth Queries
  if (queryLower.includes('why') || queryLower.includes('revenue') || queryLower.includes('growth') || queryLower.includes('sales')) {
    const topCat = categories[0]?.category || 'Primary Category';
    return {
      query: userQuery,
      explanation: `Current gross revenue is ${kpis.totalRevenueFormatted} (${kpis.orderCountFormatted} total orders) with a period-over-period growth of ${formatPercent(kpis.revenueGrowth)}. The largest sales driver is ${topCat} which accounts for ${categories[0]?.sharePct || 0}% of all sales.`,
      keyMetricLabel: 'Total Revenue',
      keyMetricValue: kpis.totalRevenueFormatted,
      keyMetricTrend: `${formatPercent(kpis.revenueGrowth)} Period Growth`,
      dataPoints: [
        `Processed ${kpis.orderCountFormatted} valid orders from ${kpis.customerCountFormatted} customers`,
        `Average basket size is ${kpis.aovFormatted}`,
        `${topCat} generated ${formatINR(categories[0]?.revenue || 0)} in revenue`
      ],
      suggestedAction: 'Inspect detailed category and product sales breakdown',
      actionRoute: 'products'
    };
  }

  // Margin & Profit Queries
  if (queryLower.includes('margin') || queryLower.includes('profit') || queryLower.includes('cost')) {
    const highestMarginCat = [...categories].sort((a, b) => b.marginPct - a.marginPct)[0];
    return {
      query: userQuery,
      explanation: `Storewide net profit is ${kpis.totalProfitFormatted} representing a blended profit margin of ${kpis.profitMargin}%. The category with the highest relative margin is ${highestMarginCat?.category || 'N/A'} at ${highestMarginCat?.marginPct || 0}% margin.`,
      keyMetricLabel: 'Operating Margin',
      keyMetricValue: `${kpis.profitMargin}%`,
      keyMetricTrend: `${kpis.totalProfitFormatted} Net Profit`,
      dataPoints: [
        `Total gross revenue: ${kpis.totalRevenueFormatted}`,
        `Highest margin category: ${highestMarginCat?.category} (${highestMarginCat?.marginPct}%)`,
        `Net profit growth: ${formatPercent(kpis.profitGrowth)}`
      ],
      suggestedAction: 'View full product catalog unit economics',
      actionRoute: 'products'
    };
  }

  // Regional Queries
  if (queryLower.includes('region') || queryLower.includes('city') || queryLower.includes('underperform') || queryLower.includes('territory')) {
    if (regions.length === 0) {
      return {
        query: userQuery,
        explanation: 'Your dataset currently does not contain regional or territory fields (e.g. Region or City column).',
        keyMetricLabel: 'Regional Data',
        keyMetricValue: 'Not specified in dataset',
        keyMetricTrend: 'Optional Field',
        dataPoints: [
          'Add a "Region" column (e.g. North, South, East, West, Central) to your orders to unlock regional mapping'
        ],
        suggestedAction: 'Review order columns in Data Sources',
        actionRoute: 'data-sources'
      };
    }

    const topRegion = regions[0];
    const lowestRegion = regions[regions.length - 1];
    return {
      query: userQuery,
      explanation: `${topRegion.name} leads your sales volume with ${formatINR(topRegion.revenue)} across ${topRegion.orders} orders (${topRegion.marginPct}% margin). Conversely, ${lowestRegion.name} has the lowest volume at ${formatINR(lowestRegion.revenue)}.`,
      keyMetricLabel: 'Leading Region',
      keyMetricValue: `${topRegion.name} (${formatINR(topRegion.revenue)})`,
      keyMetricTrend: `${topRegion.orders} Orders`,
      dataPoints: [
        `Top territory: ${topRegion.name} (${formatINR(topRegion.revenue)})`,
        `Lowest territory: ${lowestRegion.name} (${formatINR(lowestRegion.revenue)})`,
        `Active regional territories: ${regions.length}`
      ],
      suggestedAction: 'Evaluate regional logistics and territory performance',
      actionRoute: 'regions'
    };
  }

  // Forecast / Future Queries
  if (queryLower.includes('predict') || queryLower.includes('forecast') || queryLower.includes('future') || queryLower.includes('next month')) {
    const forecast = generateForecast(orders, '30d');
    if (!forecast.canForecast) {
      return {
        query: userQuery,
        explanation: `Unable to project revenue: ${forecast.reason}`,
        keyMetricLabel: 'Forecast Status',
        keyMetricValue: 'Needs More History',
        keyMetricTrend: 'Min 2 monthly cycles needed',
        dataPoints: [
          'Forecasting requires historical order dates across multiple months',
          'Add past month records to train the auto-ARIMA predictive algorithm'
        ],
        suggestedAction: 'Add historical sales data',
        actionRoute: 'manual-entry'
      };
    }

    return {
      query: userQuery,
      explanation: `Based on your ${orders.length} historical orders, next month's projected revenue is ${formatINR(forecast.expectedRevenue)} (${formatPercent(forecast.expectedGrowth)} projected growth) with a statistical confidence score of ${forecast.confidenceScore}%.`,
      keyMetricLabel: 'Next Month Projected Revenue',
      keyMetricValue: formatINR(forecast.expectedRevenue),
      keyMetricTrend: `${forecast.confidenceScore}% Confidence`,
      dataPoints: [
        `Expected projection: ${formatINR(forecast.expectedRevenue)}`,
        `High / Bull case: ${formatINR(forecast.bestCase)}`,
        `Conservative floor: ${formatINR(forecast.worstCase)}`
      ],
      suggestedAction: 'Open full multi-horizon interactive forecast model',
      actionRoute: 'forecast'
    };
  }

  // Default dynamic response
  return {
    query: userQuery,
    explanation: `Analyzing ${orders.length} transaction records for your business: Current period revenue is ${kpis.totalRevenueFormatted} with ${kpis.totalProfitFormatted} profit (${kpis.profitMargin}% margin) across ${kpis.customerCountFormatted} customers.`,
    keyMetricLabel: 'Current Revenue',
    keyMetricValue: kpis.totalRevenueFormatted,
    keyMetricTrend: `${formatPercent(kpis.revenueGrowth)} Growth`,
    dataPoints: [
      `Transactions recorded: ${kpis.orderCountFormatted}`,
      `Storewide average order value: ${kpis.aovFormatted}`,
      `Dominant product category: ${categories[0]?.category || 'N/A'}`
    ],
    suggestedAction: 'Review AI-generated business insights',
    actionRoute: 'ai-insights'
  };
}
