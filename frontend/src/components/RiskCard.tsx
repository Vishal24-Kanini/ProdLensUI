import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Risk } from '../types';

interface RiskCardProps {
  risk: Risk;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return { color: 'bg-red-50 border-red-200', icon: <AlertTriangle className="w-5 h-5 text-red-600" />, badge: 'bg-red-100 text-red-800' };
      case 'High':
        return { color: 'bg-orange-50 border-orange-200', icon: <AlertCircle className="w-5 h-5 text-orange-600" />, badge: 'bg-orange-100 text-orange-800' };
      case 'Medium':
        return { color: 'bg-yellow-50 border-yellow-200', icon: <Info className="w-5 h-5 text-yellow-600" />, badge: 'bg-yellow-100 text-yellow-800' };
      case 'Low':
        return { color: 'bg-green-50 border-green-200', icon: <CheckCircle className="w-5 h-5 text-green-600" />, badge: 'bg-green-100 text-green-800' };
      default:
        return { color: 'bg-gray-50 border-gray-200', icon: <Info className="w-5 h-5 text-gray-600" />, badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getSeverityConfig(risk.severity);

  return (
    <div className={`border rounded-lg p-4 ${config.color}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">{risk.title}</h4>
            <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${config.badge}`}>
              {risk.severity}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{risk.description}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-semibold text-gray-700">Impact: </span>
              <span className="text-gray-600">{risk.impact}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Mitigation: </span>
              <span className="text-gray-600">{risk.mitigation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RisksGridProps {
  risks: Risk[];
  category?: string;
}

export const RisksGrid: React.FC<RisksGridProps> = ({ risks, category }) => {
  const filteredRisks = category ? risks.filter(r => r.category === category) : risks;

  return (
    <div className="space-y-3">
      {filteredRisks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-gray-600">No risks identified</p>
        </div>
      ) : (
        filteredRisks.map((risk, idx) => <RiskCard key={idx} risk={risk} />)
      )}
    </div>
  );
};
