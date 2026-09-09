import React, { useState, useRef, useEffect } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { DateRangePreset } from '../../types';
import { Calendar, ChevronDown, Check } from 'lucide-react';

export const DateRangePicker: React.FC = () => {
  const { datePreset, setDatePreset, compareWithPrevious, setCompareWithPrevious } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const presets: { id: DateRangePreset; label: string; rangeText: string }[] = [
    { id: '7d', label: 'Last 7 Days', rangeText: '02 Sep - 09 Sep 2026' },
    { id: '30d', label: 'Last 30 Days', rangeText: '10 Aug - 09 Sep 2026' },
    { id: '90d', label: 'Last 90 Days', rangeText: '10 Jun - 09 Sep 2026' },
    { id: '12m', label: 'Last 12 Months', rangeText: 'Oct 2025 - Sep 2026' },
    { id: 'ytd', label: 'Year to Date (2026)', rangeText: '01 Jan - 09 Sep 2026' },
  ];

  const currentPreset = presets.find(p => p.id === datePreset) || presets[1];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '7px 12px',
          fontSize: 13,
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <Calendar size={15} style={{ color: 'var(--brand-primary)' }} />
        <span style={{ fontWeight: 500 }}>{currentPreset.label}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            right: 0,
            width: 280,
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          <div style={{ padding: '4px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Select Date Range
          </div>

          {presets.map(p => {
            const isSelected = p.id === datePreset;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setDatePreset(p.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--brand-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  textAlign: 'left',
                  transition: 'background 0.1s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: isSelected ? 600 : 400 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{p.rangeText}</div>
                </div>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}

          <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '6px 0' }} />

          {/* Compare with previous period switch */}
          <div
            onClick={() => setCompareWithPrevious(!compareWithPrevious)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>
                Compare Previous Period
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Benchmark against prior period
              </div>
            </div>

            {/* Toggle switch UI */}
            <div
              style={{
                width: 34,
                height: 18,
                borderRadius: 999,
                background: compareWithPrevious ? 'var(--brand-primary)' : 'var(--border-medium)',
                position: 'relative',
                transition: 'background 0.2s ease',
                flexShrink: 0
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  position: 'absolute',
                  top: 2,
                  left: compareWithPrevious ? 18 : 2,
                  transition: 'left 0.2s ease'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
