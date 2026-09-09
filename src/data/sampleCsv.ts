export const SAMPLE_CSV_DATA = `Order ID,Date,Customer,Product,Category,Region,Channel,Quantity,Revenue,Cost,Status
NX-9901,2026-09-08,Aditya Joshi,NEXA SoundPod Pro ANC Earbuds,Consumer Electronics,North,Website,2,9998,4700,Delivered
NX-9902,2026-09-08,Priya Sharma,AuraFit Chrono Smartwatch GPS,Smart Wearables,South,Marketplace,1,6499,3100,Delivered
NX-9903,2026-09-07,Aarav Mehta,ErgoPro Dual-Motor Standing Desk,Ergonomic Workspace,West,Website,1,28999,16500,Delivered
NX-9904,2026-09-07,Sneha Patel,PureBotanics Himalayan Saffron Serum,Wellness & Self-Care,West,Social,2,4398,1300,Delivered
NX-9905,2026-09-06,Vikram Malhotra,Apex Lumbar Mesh Task Chair,Ergonomic Workspace,North,Retail,1,14499,7800,Delivered
NX-9906,2026-09-06,Ananya Iyer,Artisanal Malabar Coffee Beans (1kg),Gourmet & Beverage,South,Website,3,3897,1440,Delivered
NX-9907,2026-09-05,Kavita Reddy,StudioVision 4K Ultra-Wide Hub Monitor,Consumer Electronics,South,Marketplace,1,38499,25800,Delivered
NX-9908,2026-09-05,Rohan Deshmukh,HydraPulse Smart Stainless Flask,Smart Wearables,West,Website,2,4998,2200,Delivered
NX-9909,2026-09-04,Rajesh Singhania,NEXA SoundPod Pro ANC Earbuds,Consumer Electronics,Central,Retail,1,4999,2350,Delivered
NX-9910,2026-09-04,Meera Sen,PureBotanics Himalayan Saffron Serum,Wellness & Self-Care,East,Social,1,2199,650,Delivered`;

export function downloadSampleCsv() {
  const blob = new Blob([SAMPLE_CSV_DATA], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'nexa_analytics_sample_sales_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
