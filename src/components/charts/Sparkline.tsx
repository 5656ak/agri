import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  isPositive?: boolean;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  isPositive = true,
  width = 96,
  height = 28
}) => {
  if (!data || data.length < 2) {
    data = [10, 15, 14, 18, 22, 20, 26, 30];
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const strokeColor = color || (isPositive ? '#10B981' : '#EF4444');
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';

  const padding = 2;
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * effectiveWidth;
    const y = height - padding - ((val - min) / range) * effectiveHeight;
    return { x, y };
  });

  // Create smooth SVG cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    pathD += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <path d={areaD} fill={fillColor} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="2.5"
        fill={strokeColor}
      />
    </svg>
  );
};
