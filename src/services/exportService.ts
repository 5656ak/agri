import { Order } from '../types';

export function exportOrdersToCsv(orders: Order[], filename: string = 'nexa_analytics_sales_orders.csv') {
  if (!orders || orders.length === 0) return;

  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Customer Email',
    'Product Name',
    'Category',
    'Region',
    'Channel',
    'Quantity',
    'Unit Price (INR)',
    'Revenue (INR)',
    'Cost (INR)',
    'Profit (INR)',
    'Margin (%)',
    'Status'
  ];

  const rows = orders.map(o => [
    `"${o.orderNumber}"`,
    `"${o.date}"`,
    `"${o.customerName.replace(/"/g, '""')}"`,
    `"${o.customerEmail}"`,
    `"${o.productName.replace(/"/g, '""')}"`,
    `"${o.category}"`,
    `"${o.region}"`,
    `"${o.channel}"`,
    o.quantity,
    o.unitPrice,
    o.revenue,
    o.cost,
    o.profit,
    o.marginPct,
    `"${o.status}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportSummary(title: string, data: Record<string, any>) {
  const content = JSON.stringify({
    reportTitle: title,
    exportedAt: new Date().toISOString(),
    organization: 'NEXA Analytics Commercial Demo',
    ...data
  }, null, 2);

  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
