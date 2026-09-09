import React from 'react';
import { Button } from './Button';
import { Database, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No business data yet',
  description = 'Upload your first dataset or connect an e-commerce source to unlock intelligent analytics and automated forecasts.',
  actionLabel = 'Upload Data',
  onAction,
  icon
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-medium)',
        margin: '24px 0'
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-full)',
          background: 'var(--brand-primary-light)',
          color: 'var(--brand-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16
        }}
      >
        {icon || <Database size={26} />}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: 13.5,
          color: 'var(--text-secondary)',
          maxWidth: 440,
          marginBottom: 20,
          lineHeight: 1.5
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" icon={<Plus size={15} />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
