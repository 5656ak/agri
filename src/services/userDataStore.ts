import { Order, DatasetMetadata } from '../types';

const USER_DATA_PREFIX = 'nexa_user_orders_';
const USER_DATASETS_PREFIX = 'nexa_user_datasets_';

export function getUserOrders(userId: string): Order[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserOrders(
  userId: string, 
  orders: Order[], 
  datasetName: string = 'Uploaded Dataset',
  sourceType: 'csv' | 'excel' | 'manual' = 'csv'
): void {
  if (!userId) return;
  localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(orders));

  // Update datasets index
  const datasets = getUserDatasets(userId);
  const newDataset: DatasetMetadata = {
    id: `ds_${Date.now()}`,
    name: datasetName,
    sourceType,
    rowCount: orders.length,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fileSize: `${Math.round(JSON.stringify(orders).length / 1024)} KB`
  };

  // Replace or append
  const updatedDatasets = [newDataset, ...datasets.filter(d => d.name !== datasetName)];
  localStorage.setItem(`${USER_DATASETS_PREFIX}${userId}`, JSON.stringify(updatedDatasets));
}

export function getUserDatasets(userId: string): DatasetMetadata[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${USER_DATASETS_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function deleteUserDataset(userId: string, datasetId: string): Order[] {
  if (!userId) return [];
  const datasets = getUserDatasets(userId);
  const remaining = datasets.filter(d => d.id !== datasetId);
  localStorage.setItem(`${USER_DATASETS_PREFIX}${userId}`, JSON.stringify(remaining));

  if (remaining.length === 0) {
    localStorage.removeItem(`${USER_DATA_PREFIX}${userId}`);
    return [];
  }

  // If there are other datasets, we return what remains
  return getUserOrders(userId);
}

export function clearUserOrders(userId: string): void {
  if (!userId) return;
  localStorage.removeItem(`${USER_DATA_PREFIX}${userId}`);
  localStorage.removeItem(`${USER_DATASETS_PREFIX}${userId}`);
}

export function addManualOrder(userId: string, order: Order): Order[] {
  if (!userId) return [];
  const existing = getUserOrders(userId);
  const updated = [order, ...existing];
  saveUserOrders(userId, updated, 'Manual Spreadsheet Entry', 'manual');
  return updated;
}

export function deleteManualOrder(userId: string, orderId: string): Order[] {
  if (!userId) return [];
  const existing = getUserOrders(userId);
  const updated = existing.filter(o => o.id !== orderId);
  saveUserOrders(userId, updated, 'Updated Sales Records', 'manual');
  return updated;
}
