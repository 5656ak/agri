import React from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAnalytics();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = 'var(--color-info)';
        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'var(--color-success)';
        } else if (toast.type === 'danger') {
          Icon = AlertCircle;
          iconColor = 'var(--color-danger)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'var(--color-warning)';
        }

        return (
          <div key={toast.id} className="toast-item">
            <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
