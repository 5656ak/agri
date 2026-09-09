import { Customer, Order, Product, RegionCode, SalesChannel, ProductCategory } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'NEXA SoundPod Pro ANC Earbuds',
    sku: 'NEXA-AU-01',
    category: 'Consumer Electronics',
    unitPrice: 4999,
    unitCost: 2350,
    unitsSold: 940,
    revenue: 4699060,
    profit: 2489960,
    marginPct: 53.0,
    growthPct: 28.4,
    stockStatus: 'In Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 620000, units: 124, margin: 52 },
      { month: 'May', revenue: 710000, units: 142, margin: 53 },
      { month: 'Jun', revenue: 840000, units: 168, margin: 54 },
      { month: 'Jul', revenue: 990000, units: 198, margin: 53 },
      { month: 'Aug', revenue: 1140000, units: 228, margin: 53 },
      { month: 'Sep', revenue: 1399060, units: 280, margin: 53.5 },
    ],
    regionalDemand: [
      { region: 'West', percentage: 34, units: 320 },
      { region: 'South', percentage: 31, units: 291 },
      { region: 'North', percentage: 22, units: 207 },
      { region: 'East', percentage: 8, units: 75 },
      { region: 'Central', percentage: 5, units: 47 },
    ],
  },
  {
    id: 'prod-02',
    name: 'AuraFit Chrono Smartwatch GPS',
    sku: 'NEXA-WR-02',
    category: 'Smart Wearables',
    unitPrice: 6499,
    unitCost: 3100,
    unitsSold: 710,
    revenue: 4614290,
    profit: 2413290,
    marginPct: 52.3,
    growthPct: 34.2,
    stockStatus: 'In Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 520000, units: 80, margin: 51 },
      { month: 'May', revenue: 640000, units: 98, margin: 52 },
      { month: 'Jun', revenue: 780000, units: 120, margin: 52 },
      { month: 'Jul', revenue: 920000, units: 141, margin: 53 },
      { month: 'Aug', revenue: 1100000, units: 169, margin: 52 },
      { month: 'Sep', revenue: 1654290, units: 254, margin: 52.8 },
    ],
    regionalDemand: [
      { region: 'South', percentage: 38, units: 270 },
      { region: 'West', percentage: 29, units: 206 },
      { region: 'North', percentage: 21, units: 149 },
      { region: 'East', percentage: 7, units: 50 },
      { region: 'Central', percentage: 5, units: 35 },
    ],
  },
  {
    id: 'prod-03',
    name: 'ErgoPro Dual-Motor Standing Desk',
    sku: 'NEXA-DK-03',
    category: 'Ergonomic Workspace',
    unitPrice: 28999,
    unitCost: 16500,
    unitsSold: 215,
    revenue: 6234785,
    profit: 2687285,
    marginPct: 43.1,
    growthPct: 19.8,
    stockStatus: 'Low Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 870000, units: 30, margin: 42 },
      { month: 'May', revenue: 980000, units: 34, margin: 43 },
      { month: 'Jun', revenue: 1040000, units: 36, margin: 43 },
      { month: 'Jul', revenue: 1160000, units: 40, margin: 43 },
      { month: 'Aug', revenue: 1390000, units: 48, margin: 43 },
      { month: 'Sep', revenue: 1794785, units: 62, margin: 43.5 },
    ],
    regionalDemand: [
      { region: 'South', percentage: 42, units: 90 },
      { region: 'West', percentage: 28, units: 60 },
      { region: 'North', percentage: 20, units: 43 },
      { region: 'East', percentage: 6, units: 13 },
      { region: 'Central', percentage: 4, units: 9 },
    ],
  },
  {
    id: 'prod-04',
    name: 'Apex Lumbar Mesh Task Chair',
    sku: 'NEXA-CH-04',
    category: 'Ergonomic Workspace',
    unitPrice: 14499,
    unitCost: 7800,
    unitsSold: 360,
    revenue: 5219640,
    profit: 2411640,
    marginPct: 46.2,
    growthPct: 22.1,
    stockStatus: 'In Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 650000, units: 45, margin: 45 },
      { month: 'May', revenue: 750000, units: 52, margin: 46 },
      { month: 'Jun', revenue: 870000, units: 60, margin: 46 },
      { month: 'Jul', revenue: 1010000, units: 70, margin: 47 },
      { month: 'Aug', revenue: 1160000, units: 80, margin: 46 },
      { month: 'Sep', revenue: 1779640, units: 123, margin: 46.5 },
    ],
    regionalDemand: [
      { region: 'South', percentage: 36, units: 130 },
      { region: 'West', percentage: 32, units: 115 },
      { region: 'North', percentage: 20, units: 72 },
      { region: 'East', percentage: 8, units: 29 },
      { region: 'Central', percentage: 4, units: 14 },
    ],
  },
  {
    id: 'prod-05',
    name: 'Artisanal Malabar Coffee Beans (1kg)',
    sku: 'NEXA-CF-05',
    category: 'Gourmet & Beverage',
    unitPrice: 1299,
    unitCost: 480,
    unitsSold: 1280,
    revenue: 1662720,
    profit: 1048320,
    marginPct: 63.0,
    growthPct: 41.5,
    stockStatus: 'In Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 195000, units: 150, margin: 62 },
      { month: 'May', revenue: 234000, units: 180, margin: 63 },
      { month: 'Jun', revenue: 273000, units: 210, margin: 63 },
      { month: 'Jul', revenue: 325000, units: 250, margin: 63 },
      { month: 'Aug', revenue: 390000, units: 300, margin: 63 },
      { month: 'Sep', revenue: 545720, units: 420, margin: 63.5 },
    ],
    regionalDemand: [
      { region: 'West', percentage: 36, units: 461 },
      { region: 'South', percentage: 33, units: 422 },
      { region: 'North', percentage: 19, units: 243 },
      { region: 'East', percentage: 8, units: 102 },
      { region: 'Central', percentage: 4, units: 52 },
    ],
  },
  {
    id: 'prod-06',
    name: 'PureBotanics Himalayan Saffron Serum',
    sku: 'NEXA-SR-06',
    category: 'Wellness & Self-Care',
    unitPrice: 2199,
    unitCost: 650,
    unitsSold: 880,
    revenue: 1935120,
    profit: 1363120,
    marginPct: 70.4,
    growthPct: 48.0,
    stockStatus: 'In Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 220000, units: 100, margin: 70 },
      { month: 'May', revenue: 275000, units: 125, margin: 70 },
      { month: 'Jun', revenue: 330000, units: 150, margin: 71 },
      { month: 'Jul', revenue: 396000, units: 180, margin: 70 },
      { month: 'Aug', revenue: 484000, units: 220, margin: 71 },
      { month: 'Sep', revenue: 630120, units: 287, margin: 70.5 },
    ],
    regionalDemand: [
      { region: 'North', percentage: 35, units: 308 },
      { region: 'West', percentage: 32, units: 282 },
      { region: 'South', percentage: 22, units: 194 },
      { region: 'East', percentage: 7, units: 62 },
      { region: 'Central', percentage: 4, units: 34 },
    ],
  },
  {
    id: 'prod-07',
    name: 'StudioVision 4K Ultra-Wide Hub Monitor',
    sku: 'NEXA-MN-07',
    category: 'Consumer Electronics',
    unitPrice: 38499,
    unitCost: 25800,
    unitsSold: 98,
    revenue: 3772902,
    profit: 1244502,
    marginPct: 33.0,
    growthPct: 11.2,
    stockStatus: 'Low Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 460000, units: 12, margin: 32 },
      { month: 'May', revenue: 538000, units: 14, margin: 33 },
      { month: 'Jun', revenue: 615000, units: 16, margin: 33 },
      { month: 'Jul', revenue: 692000, units: 18, margin: 33 },
      { month: 'Aug', revenue: 808000, units: 21, margin: 33 },
      { month: 'Sep', revenue: 1059902, units: 28, margin: 33.2 },
    ],
    regionalDemand: [
      { region: 'South', percentage: 45, units: 44 },
      { region: 'West', percentage: 27, units: 26 },
      { region: 'North', percentage: 20, units: 20 },
      { region: 'East', percentage: 5, units: 5 },
      { region: 'Central', percentage: 3, units: 3 },
    ],
  },
  {
    id: 'prod-08',
    name: 'HydraPulse Smart Stainless Flask',
    sku: 'NEXA-FL-08',
    category: 'Smart Wearables',
    unitPrice: 2499,
    unitCost: 1100,
    unitsSold: 420,
    revenue: 1049580,
    profit: 587580,
    marginPct: 56.0,
    growthPct: 15.6,
    stockStatus: 'In Stock',
    historicalPerformance: [
      { month: 'Apr', revenue: 125000, units: 50, margin: 55 },
      { month: 'May', revenue: 150000, units: 60, margin: 56 },
      { month: 'Jun', revenue: 175000, units: 70, margin: 56 },
      { month: 'Jul', revenue: 200000, units: 80, margin: 56 },
      { month: 'Aug', revenue: 225000, units: 90, margin: 56 },
      { month: 'Sep', revenue: 374580, units: 150, margin: 56.2 },
    ],
    regionalDemand: [
      { region: 'West', percentage: 33, units: 139 },
      { region: 'South', percentage: 31, units: 130 },
      { region: 'North', percentage: 24, units: 101 },
      { region: 'East', percentage: 7, units: 29 },
      { region: 'Central', percentage: 5, units: 21 },
    ],
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@techverse.in',
    phone: '+91 98201 44520',
    city: 'Mumbai',
    state: 'Maharashtra',
    region: 'West',
    totalOrders: 9,
    totalSpent: 124500,
    aov: 13833,
    firstOrderDate: '2024-11-12',
    lastOrderDate: '2026-09-02',
    segment: 'VIP',
    status: 'Active'
  },
  {
    id: 'cust-02',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 98450 12890',
    city: 'Bengaluru',
    state: 'Karnataka',
    region: 'South',
    totalOrders: 6,
    totalSpent: 86990,
    aov: 14498,
    firstOrderDate: '2025-01-20',
    lastOrderDate: '2026-09-05',
    segment: 'VIP',
    status: 'Active'
  },
  {
    id: 'cust-03',
    name: 'Vikram Malhotra',
    email: 'v.malhotra@delhicap.com',
    phone: '+91 98110 99421',
    city: 'Gurugram',
    state: 'Haryana',
    region: 'North',
    totalOrders: 5,
    totalSpent: 72400,
    aov: 14480,
    firstOrderDate: '2025-02-14',
    lastOrderDate: '2026-08-28',
    segment: 'Loyal',
    status: 'Active'
  },
  {
    id: 'cust-04',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@cognizance.io',
    phone: '+91 94440 33812',
    city: 'Chennai',
    state: 'Tamil Nadu',
    region: 'South',
    totalOrders: 4,
    totalSpent: 48990,
    aov: 12247,
    firstOrderDate: '2025-03-04',
    lastOrderDate: '2026-09-01',
    segment: 'Loyal',
    status: 'Active'
  },
  {
    id: 'cust-05',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@fintechwave.co',
    phone: '+91 98220 77154',
    city: 'Pune',
    state: 'Maharashtra',
    region: 'West',
    totalOrders: 3,
    totalSpent: 36500,
    aov: 12166,
    firstOrderDate: '2025-04-10',
    lastOrderDate: '2026-07-22',
    segment: 'Regular',
    status: 'Active'
  },
  {
    id: 'cust-06',
    name: 'Sneha Patel',
    email: 'sneha.patel92@yahoo.com',
    phone: '+91 98790 55123',
    city: 'Ahmedabad',
    state: 'Gujarat',
    region: 'West',
    totalOrders: 2,
    totalSpent: 22998,
    aov: 11499,
    firstOrderDate: '2025-05-18',
    lastOrderDate: '2026-08-14',
    segment: 'Regular',
    status: 'Active'
  },
  {
    id: 'cust-07',
    name: 'Karthik Nair',
    email: 'karthik.n@infopark.org',
    phone: '+91 94470 88231',
    city: 'Kochi',
    state: 'Kerala',
    region: 'South',
    totalOrders: 3,
    totalSpent: 34800,
    aov: 11600,
    firstOrderDate: '2024-12-05',
    lastOrderDate: '2026-04-12',
    segment: 'At Risk',
    status: 'Active'
  },
  {
    id: 'cust-08',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@hitechcity.in',
    phone: '+91 98490 66324',
    city: 'Hyderabad',
    state: 'Telangana',
    region: 'South',
    totalOrders: 1,
    totalSpent: 28999,
    aov: 28999,
    firstOrderDate: '2026-09-04',
    lastOrderDate: '2026-09-04',
    segment: 'New',
    status: 'Active'
  },
  {
    id: 'cust-09',
    name: 'Aditya Joshi',
    email: 'aditya.joshi@noidahub.com',
    phone: '+91 98180 44901',
    city: 'Noida',
    state: 'Uttar Pradesh',
    region: 'North',
    totalOrders: 4,
    totalSpent: 54900,
    aov: 13725,
    firstOrderDate: '2025-02-28',
    lastOrderDate: '2026-09-03',
    segment: 'Loyal',
    status: 'Active'
  },
  {
    id: 'cust-10',
    name: 'Meera Sen',
    email: 'meera.sen@calcutta-art.org',
    phone: '+91 98300 22718',
    city: 'Kolkata',
    state: 'West Bengal',
    region: 'East',
    totalOrders: 3,
    totalSpent: 29800,
    aov: 9933,
    firstOrderDate: '2025-03-12',
    lastOrderDate: '2026-08-19',
    segment: 'Regular',
    status: 'Active'
  },
  {
    id: 'cust-11',
    name: 'Rajesh Singhania',
    email: 'rajesh.s@singhania-group.in',
    phone: '+91 97550 11982',
    city: 'Indore',
    state: 'Madhya Pradesh',
    region: 'Central',
    totalOrders: 2,
    totalSpent: 43498,
    aov: 21749,
    firstOrderDate: '2025-06-01',
    lastOrderDate: '2026-08-30',
    segment: 'Regular',
    status: 'Active'
  },
  {
    id: 'cust-12',
    name: 'Divya Nambiar',
    email: 'divya.nambiar@startupindia.net',
    phone: '+91 98451 99021',
    city: 'Bengaluru',
    state: 'Karnataka',
    region: 'South',
    totalOrders: 1,
    totalSpent: 4999,
    aov: 4999,
    firstOrderDate: '2026-09-07',
    lastOrderDate: '2026-09-07',
    segment: 'New',
    status: 'Active'
  }
];

// Helper to generate 150+ realistic synthesized multi-channel orders spanning past 12 months
export function generateMockOrders(): Order[] {
  const orders: Order[] = [];
  const channels: SalesChannel[] = ['Website', 'Marketplace', 'Retail', 'Social', 'Other'];
  const channelWeights = [0.42, 0.28, 0.15, 0.10, 0.05];

  const statuses: { status: Order['status']; weight: number }[] = [
    { status: 'Delivered', weight: 0.84 },
    { status: 'Shipped', weight: 0.08 },
    { status: 'Processing', weight: 0.05 },
    { status: 'Cancelled', weight: 0.03 },
  ];

  // Specific high-profile recent orders for realism
  const seedDates = [
    '2026-09-08', '2026-09-07', '2026-09-06', '2026-09-05', '2026-09-04',
    '2026-09-03', '2026-09-02', '2026-09-01', '2026-08-31', '2026-08-30',
    '2026-08-28', '2026-08-26', '2026-08-24', '2026-08-22', '2026-08-20',
    '2026-08-18', '2026-08-15', '2026-08-12', '2026-08-10', '2026-08-05',
    '2026-07-28', '2026-07-22', '2026-07-18', '2026-07-12', '2026-07-04',
    '2026-06-29', '2026-06-22', '2026-06-15', '2026-06-08', '2026-06-02',
    '2026-05-28', '2026-05-20', '2026-05-14', '2026-05-08', '2026-05-01',
    '2026-04-26', '2026-04-18', '2026-04-11', '2026-04-03', '2026-03-28'
  ];

  let orderIndex = 3842;

  // Generate 160 realistic orders across customers and products
  for (let i = 0; i < 160; i++) {
    const cust = MOCK_CUSTOMERS[i % MOCK_CUSTOMERS.length];
    const prod = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length];
    
    // Pick date
    const date = seedDates[i % seedDates.length];

    // Pick channel
    const randChannel = Math.random();
    let cumulative = 0;
    let channel: SalesChannel = 'Website';
    for (let c = 0; c < channels.length; c++) {
      cumulative += channelWeights[c];
      if (randChannel <= cumulative) {
        channel = channels[c];
        break;
      }
    }

    // Pick status
    const randStatus = Math.random();
    let statusAccum = 0;
    let status: Order['status'] = 'Delivered';
    for (const s of statuses) {
      statusAccum += s.weight;
      if (randStatus <= statusAccum) {
        status = s.status;
        break;
      }
    }

    const quantity = (prod.unitPrice > 10000) ? 1 : Math.floor(Math.random() * 2) + 1;
    const revenue = prod.unitPrice * quantity;
    const cost = prod.unitCost * quantity;
    const profit = status === 'Cancelled' ? 0 : (revenue - cost);
    const marginPct = revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0;

    orders.push({
      id: `ord-${orderIndex}`,
      orderNumber: `NX-2026-${orderIndex}`,
      date,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      productId: prod.id,
      productName: prod.name,
      category: prod.category,
      region: cust.region || 'North',
      state: cust.state,
      city: cust.city,
      channel,
      quantity,
      unitPrice: prod.unitPrice,
      revenue,
      cost,
      profit,
      marginPct,
      status
    });

    orderIndex--;
  }

  return orders;
}

export const INITIAL_ORDERS: Order[] = generateMockOrders();
