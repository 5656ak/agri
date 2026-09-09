import { Order, AnalyticsKpis } from '../types';
import { getExecutiveSummary, getAiInsights } from './aiInsightEngine';
import { computeCategoryBreakdown, computeRegionalBreakdown, formatINR } from './analyticsEngine';

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
    'Unit Price',
    'Revenue',
    'Cost',
    'Profit',
    'Margin (%)',
    'Status'
  ];

  const rows = orders.map(o => [
    `"${o.orderNumber}"`,
    `"${o.date}"`,
    `"${(o.customerName || '').replace(/"/g, '""')}"`,
    `"${o.customerEmail || ''}"`,
    `"${(o.productName || '').replace(/"/g, '""')}"`,
    `"${o.category || ''}"`,
    `"${o.region || ''}"`,
    `"${o.channel || ''}"`,
    o.quantity || 1,
    o.unitPrice || 0,
    o.revenue || 0,
    o.cost || 0,
    o.profit || 0,
    o.marginPct || 0,
    `"${o.status || 'Delivered'}"`
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

export function exportReportSummary(title: string, data: Record<string, any>, organizationName: string = 'My Business Workspace') {
  const content = JSON.stringify({
    reportTitle: title,
    exportedAt: new Date().toISOString(),
    organization: organizationName,
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

export interface PrintReportOptions {
  businessName: string;
  reportTitle: string;
  period: string;
  kpis: AnalyticsKpis;
  orders: Order[];
  includeForecast?: boolean;
  includeAiInsights?: boolean;
}

export function printExecutiveReport(options: PrintReportOptions) {
  const { businessName, reportTitle, period, kpis, orders, includeAiInsights = true } = options;

  const categories = computeCategoryBreakdown(orders);
  const regions = computeRegionalBreakdown(orders);
  const executiveSummary = getExecutiveSummary(kpis, orders);
  const aiInsights = includeAiInsights ? getAiInsights(kpis, orders) : [];

  // Top 5 products by revenue
  const productMap = new Map<string, { name: string; revenue: number; orders: number; profit: number }>();
  orders.forEach(o => {
    const key = o.productName || 'Unknown Product';
    const curr = productMap.get(key) || { name: key, revenue: 0, orders: 0, profit: 0 };
    curr.revenue += Number(o.revenue) || 0;
    curr.orders += 1;
    curr.profit += Number(o.profit) || (Number(o.revenue) - Number(o.cost));
    productMap.set(key, curr);
  });
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${businessName} - ${reportTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0F172A;
      background: #FFF;
      padding: 40px;
      line-height: 1.5;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 4px;
      background: #EEF2FF;
      color: #4F46E5;
      margin-bottom: 8px;
    }
    .title {
      font-size: 26px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.02em;
    }
    .meta {
      font-size: 13px;
      color: #64748B;
      margin-top: 4px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .kpi-card {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px;
      background: #F8FAFC;
    }
    .kpi-label {
      font-size: 11.5px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .kpi-value {
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 4px;
    }
    .kpi-sub {
      font-size: 11.5px;
      color: #10B981;
      font-weight: 600;
      margin-top: 4px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .executive-summary {
      background: #F8FAFC;
      border-left: 4px solid #4F46E5;
      padding: 16px 20px;
      border-radius: 4px;
      font-size: 13.5px;
      line-height: 1.6;
      color: #334155;
      margin-bottom: 32px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
      font-size: 13px;
    }
    th {
      text-align: left;
      padding: 10px 14px;
      background: #F1F5F9;
      color: #475569;
      font-weight: 600;
      border-bottom: 1px solid #CBD5E1;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid #E2E8F0;
      color: #334155;
    }
    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 32px;
    }
    .insight-item {
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 14px 16px;
      background: #FFF;
    }
    .insight-header {
      font-size: 13.5px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 4px;
    }
    .insight-desc {
      font-size: 12.5px;
      color: #475569;
      line-height: 1.5;
    }
    .insight-rec {
      font-size: 12px;
      color: #4F46E5;
      font-weight: 600;
      margin-top: 6px;
    }
    .footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94A3B8;
    }
    .btn-bar {
      margin-bottom: 24px;
      display: flex;
      gap: 12px;
    }
    .btn {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid #CBD5E1;
      background: #FFF;
    }
    .btn-primary {
      background: #4F46E5;
      color: #FFF;
      border-color: #4F46E5;
    }
  </style>
</head>
<body>
  <div class="no-print btn-bar">
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn" onclick="window.close()">Close Window</button>
  </div>

  <div class="header">
    <div>
      <span class="badge">NEXA Executive Dossier</span>
      <h1 class="title">${businessName}</h1>
      <div class="meta">${reportTitle} • Reporting Period: ${period}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 12px; font-weight: 700; color: #4F46E5;">NEXA Intelligence Engine</div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
      <div style="font-size: 11px; color: #94A3B8;">Status: Board-Ready</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Gross Revenue</div>
      <div class="kpi-value">${kpis.totalRevenueFormatted}</div>
      <div class="kpi-sub">${kpis.revenueGrowth >= 0 ? '+' : ''}${kpis.revenueGrowth}% Period Shift</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Net Profit</div>
      <div class="kpi-value">${kpis.totalProfitFormatted}</div>
      <div class="kpi-sub">${kpis.profitMargin}% Margin</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Completed Orders</div>
      <div class="kpi-value">${kpis.orderCountFormatted}</div>
      <div class="kpi-sub">${kpis.orderGrowth >= 0 ? '+' : ''}${kpis.orderGrowth}% Velocity</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Average Order Value</div>
      <div class="kpi-value">${kpis.aovFormatted}</div>
      <div class="kpi-sub">${kpis.customerCountFormatted} Unique Customers</div>
    </div>
  </div>

  <div class="section-title">Executive Briefing & Strategic Summary</div>
  <div class="executive-summary">
    ${executiveSummary}
  </div>

  <div class="section-title">Top Revenue Generating SKUs</div>
  <table>
    <thead>
      <tr>
        <th>Product Name</th>
        <th style="text-align: right;">Units Sold</th>
        <th style="text-align: right;">Gross Revenue</th>
        <th style="text-align: right;">Net Profit</th>
      </tr>
    </thead>
    <tbody>
      ${topProducts.map(p => `
        <tr>
          <td style="font-weight: 600;">${p.name}</td>
          <td style="text-align: right;">${p.orders}</td>
          <td style="text-align: right; font-weight: 600;">${formatINR(p.revenue)}</td>
          <td style="text-align: right; color: #10B981; font-weight: 600;">${formatINR(p.profit)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
    <div>
      <div class="section-title">Category Revenue Contribution</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th style="text-align: right;">Share</th>
            <th style="text-align: right;">Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${categories.slice(0, 4).map(c => `
            <tr>
              <td>${c.category}</td>
              <td style="text-align: right; font-weight: 600;">${c.sharePct}%</td>
              <td style="text-align: right;">${formatINR(c.revenue)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div>
      <div class="section-title">Geographic Territory Contribution</div>
      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th style="text-align: right;">Orders</th>
            <th style="text-align: right;">Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${regions.slice(0, 4).map(r => `
            <tr>
              <td>${r.name}</td>
              <td style="text-align: right;">${r.orders}</td>
              <td style="text-align: right; font-weight: 600;">${formatINR(r.revenue)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  ${aiInsights.length > 0 ? `
    <div class="section-title">AI Autonomous Strategic Directives</div>
    <div class="insights-list">
      ${aiInsights.slice(0, 3).map(ins => `
        <div class="insight-item">
          <div class="insight-header">${ins.title}</div>
          <div class="insight-desc">${ins.description}</div>
          <div class="insight-rec">→ Recommendation: ${ins.recommendation}</div>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <div class="footer">
    <div>CONFIDENTIAL — Generated strictly for ${businessName} internal executive use.</div>
    <div>Powered by NEXA Analytics AI Engine</div>
  </div>

  <script>
    window.onload = function() {
      // Auto-trigger print dialog after render
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // Fallback: download as standalone HTML report
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${businessName.toLowerCase().replace(/\s+/g, '_')}_${reportTitle.toLowerCase().replace(/\s+/g, '_')}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

