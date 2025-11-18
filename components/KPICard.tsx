import React from 'react';
import { KPICardProps } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, trend }) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-slate-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="mr-1" />;
    if (trend === 'down') return <TrendingDown size={16} className="mr-1" />;
    return <Minus size={16} className="mr-1" />;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
      </div>
      <div className={`flex items-center text-sm ${getTrendColor()}`}>
        {getTrendIcon()}
        <span className="font-medium">{change}</span>
        <span className="text-slate-400 ml-2">vs last month</span>
      </div>
    </div>
  );
};
