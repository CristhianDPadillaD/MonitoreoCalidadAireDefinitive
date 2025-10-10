import React from "react";

function clamp(v, a=0,b=1){ return Math.max(a, Math.min(b, v)); }

export default function Thermometer({ label, value, unit, min=0, max=100, thresholds=[] }) {
  const pct = clamp((value - min) / (max - min), 0, 1);
  // find threshold color
  const th = thresholds.find(t => value <= t.max) || thresholds[thresholds.length-1];
  const fillColor = th?.color || "#34d399"; // tailwind or hex
  return (
    <div className="w-40 p-4 bg-white rounded-lg shadow-sm">
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex items-end gap-4">
        <svg width="36" height="160" viewBox="0 0 36 160">
          <rect x="12" y="8" width="12" height="120" rx="6" fill="#eee" stroke="#ccc" />
          <rect x="12" y={8 + (120*(1-pct))} width="12" height={120*pct} rx="6" fill={fillColor} style={{ transition: "all 600ms ease" }} />
          <circle cx="18" cy="140" r="16" fill={fillColor} stroke="#ddd" />
        </svg>
        <div>
          <div className="text-2xl font-bold">{value}{unit}</div>
          <div className="text-sm text-gray-500">{th?.label}</div>
        </div>
      </div>
    </div>
  );
}