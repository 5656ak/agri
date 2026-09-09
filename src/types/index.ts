export type RegionCode = 'North' | 'South' | 'East' | 'West' | 'Central' | string;

export type SalesChannel = 'Website' | 'Marketplace' | 'Retail' | 'Social' | 'Other' | string;

export type ProductCategory = 
  | 'Consumer Electronics'
  | 'Smart Wearables'
  | 'Ergonomic Workspace'
  | 'Gourmet & Beverage'
  | 'Wellness & Self-Care'
  | string;

export type OrderStatus = 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';

export type CustomerSegment = 'VIP' | 'Loyal' | 'Regular' | 'At Risk' | 'New';

export type InsightType = 'opportunity' | 'warning' | 'risk' | 'recommendation';

export type TimeGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export type DateRangePreset = '7d' | '30d' | '90d' | '12m' | 'ytd' | 'all';

// User & Authentication Models
export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  avatar?: string;
  plan?: string;
}

export interface BusinessProfile {
  businessName: string;
  businessType: 'E-commerce' | 'Retail' | 'SaaS' | 'Restaurant' | 'Agency' | 'Manufacturing' | 'Services' | 'Other';
  industry: string;
  country: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | string;
  analysisGoals: string[];
}

export interface DatasetMetadata {
  id: string;
  name: string;
  sourceType: 'csv' | 'excel' | 'manual';
  rowCount: number;
  uploadedAt: string;
  updatedAt: string;
  fileSize?: string;
}

export interface DataValidationIssue {
  type: 'missing_date' | 'invalid_revenue' | 'invalid_cost' | 'missing_id' | 'duplicate_row';
  rowNumber: number;
  message: string;
}

export interface DataValidationReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  issues: DataValidationIssue[];
  detectedColumns: string[];
  missingRecommendedColumns: string[];
}

// Order & Analytics Models
export interface Order {
  id: string;
  orderNumber: string;
  date: string; // YYYY-MM-DD
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  region: RegionCode;
  state?: string;
  city?: string;
  channel: SalesChannel;
  quantity: number;
  unitPrice: number;
  revenue: number;
  cost: number;
  profit: number;
  marginPct: number;
  status: OrderStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  region?: RegionCode;
  totalOrders: number;
  totalSpent: number;
  aov: number;
  firstOrderDate: string;
  lastOrderDate: string;
  segment: CustomerSegment;
  status: 'Active' | 'Churned';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  unitPrice: number;
  unitCost: number;
  unitsSold: number;
  revenue: number;
  profit: number;
  marginPct: number;
  growthPct?: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  historicalPerformance?: {
    month: string;
    revenue: number;
    units: number;
    margin: number;
  }[];
  regionalDemand?: {
    region: RegionCode;
    percentage: number;
    units: number;
  }[];
}

export interface RegionMetric {
  id: RegionCode;
  name: string;
  revenue: number;
  orders: number;
  profit: number;
  marginPct: number;
  growthPct: number;
  customers: number;
  topCities: { city: string; revenue: number; share: number }[];
}

export interface ChannelMetric {
  channel: SalesChannel;
  revenue: number;
  orders: number;
  aov: number;
  sharePct: number;
}

export interface CategoryMetric {
  category: ProductCategory;
  revenue: number;
  orders: number;
  profit: number;
  marginPct: number;
  sharePct: number;
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  revenue: number;
  profit: number;
  orders: number;
  previousRevenue: number;
  previousProfit: number;
}

export interface ForecastPoint {
  date: string;
  label: string;
  historicalRevenue?: number;
  forecastRevenue: number;
  upperConfidence: number;
  lowerConfidence: number;
}

export interface ForecastSummary {
  canForecast: boolean;
  reason?: string;
  expectedRevenue: number;
  expectedGrowth: number;
  bestCase: number;
  worstCase: number;
  confidenceScore: number;
  points: ForecastPoint[];
}

export interface AiInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  metric: string;
  metricChange: string;
  impact: 'High' | 'Medium' | 'Low';
  recommendation: string;
  ctaLabel: string;
  actionTarget: string;
  category: string;
  date: string;
}

export interface BusinessReport {
  id: string;
  title: string;
  type: 'Weekly' | 'Monthly' | 'Quarterly' | 'Sales' | 'Customer' | 'Product';
  period: string;
  generatedDate: string;
  status: 'Ready' | 'Generating';
  size: string;
  summary: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: 'Growth Pro' | 'Enterprise AI' | 'Starter' | string;
  currency: string;
  membersCount: number;
  isCurrent: boolean;
}

export interface AnalyticsKpis {
  hasData: boolean;
  revenue: number;
  revenueGrowth: number;
  previousRevenue: number;

  profit: number;
  profitGrowth: number;
  previousProfit: number;

  orders: number;
  orderGrowth: number;
  previousOrders: number;

  customers: number;
  customerGrowth: number;
  previousCustomers: number;

  aov: number;
  aovGrowth: number;
  previousAov: number;

  profitMargin: number;
  totalRevenueFormatted: string;
  totalProfitFormatted: string;
  orderCountFormatted: string;
  customerCountFormatted: string;
  aovFormatted: string;
}

export interface FilterState {
  datePreset: DateRangePreset;
  compareWithPrevious: boolean;
  category: string;
  region: string;
  channel: string;
  searchQuery: string;
}

export interface ManualSpreadsheetRow {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  productName: string;
  category: string;
  region: string;
  channel: string;
  quantity: number;
  revenue: number;
  cost: number;
}
