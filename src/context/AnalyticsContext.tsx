import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Order, 
  DateRangePreset, 
  Workspace, 
  AnalyticsKpis 
} from '../types';
import { calculateKpis } from '../services/analyticsEngine';
import { useAuth } from './AuthContext';
import { 
  getUserOrders, 
  saveUserOrders, 
  clearUserOrders,
  addManualOrder as addManualOrderStore
} from '../services/userDataStore';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface AnalyticsContextType {
  orders: Order[];
  datePreset: DateRangePreset;
  setDatePreset: (preset: DateRangePreset) => void;
  compareWithPrevious: boolean;
  setCompareWithPrevious: (val: boolean) => void;
  workspace: Workspace;
  setWorkspace: (ws: Workspace) => void;
  workspaces: Workspace[];
  kpis: AnalyticsKpis;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  removeToast: (id: string) => void;
  importOrders: (newOrders: Order[], sourceName?: string) => void;
  addSingleOrder: (order: Partial<Order>) => void;
  clearWorkspaceData: () => void;
  refreshOrders: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, businessProfile } = useAuth();
  
  // Scoped user orders: initialized empty, loaded per authenticated user
  const [orders, setOrders] = useState<Order[]>([]);
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d');
  const [compareWithPrevious, setCompareWithPrevious] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Workspace configuration based on active user and business profile
  const businessName = businessProfile?.businessName || user?.businessName || 'My Business Workspace';
  const currency = businessProfile?.currency || 'INR';
  const plan = user?.plan || 'Growth Pro';

  const [workspace, setWorkspaceState] = useState<Workspace>({
    id: user ? `ws-${user.id}` : 'ws-default',
    name: businessName,
    plan,
    currency,
    membersCount: 1,
    isCurrent: true
  });

  // Sync workspace when businessProfile or user updates
  useEffect(() => {
    setWorkspaceState({
      id: user ? `ws-${user.id}` : 'ws-default',
      name: businessProfile?.businessName || user?.businessName || 'My Business Workspace',
      plan: user?.plan || 'Growth Pro',
      currency: businessProfile?.currency || 'INR',
      membersCount: 1,
      isCurrent: true
    });
  }, [user, businessProfile]);

  const workspaces: Workspace[] = useMemo(() => [
    workspace
  ], [workspace]);

  // Load user data strictly scoped to active user ID
  const loadUserOrders = useCallback(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    const stored = getUserOrders(user.id);
    setOrders(stored);
  }, [user]);

  useEffect(() => {
    loadUserOrders();
  }, [loadUserOrders]);

  // Dynamic KPI computation based solely on user's current orders
  const kpis = useMemo(() => {
    return calculateKpis(orders, compareWithPrevious, datePreset);
  }, [orders, compareWithPrevious, datePreset]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setWorkspace = (ws: Workspace) => {
    setWorkspaceState(ws);
    addToast(`Active workspace: ${ws.name}`, 'info');
  };

  const importOrders = (newOrders: Order[], sourceName: string = 'CSV Import') => {
    if (!user) return;
    saveUserOrders(user.id, newOrders, sourceName);
    setOrders(newOrders);
    addToast(`Successfully imported ${newOrders.length} records from ${sourceName}`, 'success');
  };

  const addSingleOrder = (orderData: Partial<Order>) => {
    if (!user) return;
    const revenue = orderData.revenue || 0;
    const cost = orderData.cost || 0;
    const profit = revenue - cost;
    const quantity = orderData.quantity || 1;
    const unitPrice = quantity > 0 ? Math.round(revenue / quantity) : revenue;
    const marginPct = revenue > 0 ? Number(((profit / revenue) * 100).toFixed(1)) : 0;

    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderNumber: orderData.orderNumber || `ORD-${Date.now().toString().slice(-5)}`,
      customerId: orderData.customerId || `cust-${Date.now().toString().slice(-4)}`,
      customerName: orderData.customerName || 'Direct Customer',
      customerEmail: orderData.customerEmail || 'customer@example.com',
      date: orderData.date || new Date().toISOString().split('T')[0],
      productId: orderData.productId || `sku-${Date.now().toString().slice(-4)}`,
      productName: orderData.productName || 'General Product',
      category: orderData.category || 'General',
      quantity,
      unitPrice,
      revenue,
      cost,
      profit,
      marginPct,
      region: orderData.region || 'North',
      channel: orderData.channel || 'Direct',
      status: (orderData.status as any) || 'Delivered'
    };
    addManualOrderStore(user.id, newOrder);
    setOrders(prev => [newOrder, ...prev]);
    addToast(`Saved order ${newOrder.orderNumber}`, 'success');
  };

  const clearWorkspaceData = () => {
    if (!user) return;
    clearUserOrders(user.id);
    setOrders([]);
    addToast('Workspace transaction data cleared. Dashboard is now in zero state.', 'info');
  };

  return (
    <AnalyticsContext.Provider
      value={{
        orders,
        datePreset,
        setDatePreset,
        compareWithPrevious,
        setCompareWithPrevious,
        workspace,
        setWorkspace,
        workspaces,
        kpis,
        activeTab,
        setActiveTab,
        showLanding,
        setShowLanding,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isHelpOpen,
        setIsHelpOpen,
        toasts,
        addToast,
        removeToast,
        importOrders,
        addSingleOrder,
        clearWorkspaceData,
        refreshOrders: loadUserOrders
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return ctx;
};
