
import React from 'react';
import { Users, LayoutGrid, MapPin } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  type: 'users' | 'union' | 'village';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'users': return <Users className="text-emerald-600" size={24} />;
      case 'union': return <LayoutGrid className="text-blue-600" size={24} />;
      case 'village': return <MapPin className="text-orange-600" size={24} />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'users': return 'bg-emerald-50 border-emerald-100';
      case 'union': return 'bg-blue-50 border-blue-100';
      case 'village': return 'bg-orange-50 border-orange-100';
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${getBg()} flex items-center gap-4 transition-transform hover:scale-105`}>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        {getIcon()}
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
