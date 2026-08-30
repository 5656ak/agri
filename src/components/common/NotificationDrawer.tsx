import React from 'react';
import { Bell, X, Check, CloudRain, Bug, TrendingUp, Landmark, Calendar, Droplets } from 'lucide-react';
import { Language, NavigationTab } from '../../types';
import { dataStore } from '../../services/dataStore';
import { getTranslation } from '../../i18n/translations';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  language
}) => {
  const notifications = dataStore.getNotifications();
  const t = getTranslation(language);

  if (!isOpen) return null;

  const handleItemClick = (tab?: NavigationTab, id?: string) => {
    if (id) dataStore.markNotificationRead(id);
    if (tab) onSelectTab(tab);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WEATHER': return <CloudRain size={18} color="#2563EB" />;
      case 'PEST': return <Bug size={18} color="#DC2626" />;
      case 'MANDI': return <TrendingUp size={18} color="#15803D" />;
      case 'SCHEME': return <Landmark size={18} color="#D97706" />;
      case 'IRRIGATION': return <Droplets size={18} color="#2563EB" />;
      default: return <Calendar size={18} color="#1E5631" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '1.25rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bell size={20} color="#1E5631" />
            <h2 style={{ fontSize: '1.15rem' }}>{t.notification}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => dataStore.markAllNotificationsRead()}
              style={{ border: 'none', background: 'none', color: '#1E5631', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
            >
              सभी पढ़े चिह्नित करें
            </button>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={18} color="#6B7280" />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280' }}>
              कोई नई सूचना नहीं है।
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n.targetTab, n.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: n.read ? '#F9FAFB' : '#F0FDF4',
                  border: n.read ? '1px solid #E5E7EB' : '1.5px solid #BBF7D0',
                  cursor: 'pointer'
                }}
              >
                <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                      {language === 'hi' ? n.titleHi : n.titleEn}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{n.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '0.2rem', lineHeight: 1.4 }}>
                    {language === 'hi' ? n.messageHi : n.messageEn}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
