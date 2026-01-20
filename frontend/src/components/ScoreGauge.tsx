import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryScore } from '../types';

interface ScoreGaugeProps {
  category: string;
  score: CategoryScore;
  icon?: React.ReactNode;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ category, score, icon }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Excellent':
        return '#10b981';
      case 'Low':
        return '#6ee7b7';
      case 'Medium':
        return '#f59e0b';
      case 'High':
        return '#ef4444';
      case 'Critical':
        return '#991b1b';
      default:
        return '#6366f1';
    }
  };

  const getLevelTextColor = (level: string) => {
    switch (level) {
      case 'Excellent':
        return 'text-success';
      case 'Low':
        return 'text-success';
      case 'Medium':
        return 'text-warning';
      case 'High':
        return 'text-danger';
      case 'Critical':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  };

  const data = [
    { name: 'Score', value: score.score },
    { name: 'Remaining', value: 100 - score.score },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-900 capitalize">{category}</h3>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gray-100 ${getLevelTextColor(score.level)}`}>
          {score.level}
        </span>
      </div>

      <div className="flex items-center justify-center h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={getLevelColor(score.level)} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center">
          <div className="text-3xl font-bold text-gray-900">{score.score}</div>
          <div className="text-xs text-gray-600">/100</div>
        </div>
      </div>

      {score.issues.length > 0 && (
        <div className="mb-4 pb-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Issues Found:</h4>
          <ul className="space-y-1">
            {score.issues.slice(0, 2).map((issue, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-danger mt-1">•</span>
                <span>{issue}</span>
              </li>
            ))}
            {score.issues.length > 2 && (
              <li className="text-xs text-primary font-medium">
                +{score.issues.length - 2} more issues
              </li>
            )}
          </ul>
        </div>
      )}

      {score.suggestions.length > 0 && (
        <div className="bg-primary/5 p-3 rounded">
          <h4 className="text-xs font-semibold text-primary mb-2">Top Suggestion:</h4>
          <p className="text-xs text-gray-700">{score.suggestions[0]}</p>
        </div>
      )}
    </div>
  );
};
