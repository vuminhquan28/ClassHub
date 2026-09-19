'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, color }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl flex items-center gap-5">
      <div 
        className="w-13 h-13 rounded-xl flex items-center justify-center"
        style={{ 
          backgroundColor: `rgba(${color}, 0.12)`, 
          border: `1px solid rgba(${color}, 0.25)`
        }}
      >
        <Icon className="w-6 h-6" style={{ color: `rgb(${color})` }} />
      </div>
      <div>
        <span className="text-xs font-medium text-gray-400">{title}</span>
        <h3 className="text-2xl font-extrabold text-white my-0.5">{value}</h3>
        {subtext && <span className="text-[11px] text-gray-400">{subtext}</span>}
      </div>
    </div>
  );
};
