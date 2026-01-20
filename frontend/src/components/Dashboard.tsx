import React from 'react';
import { Zap, Shield, CheckSquare, Code, Gauge } from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';
import { AnalysisResult } from '../types';

interface DashboardGridProps {
  result: AnalysisResult;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ result }) => {
  const categoryIcons = {
    scalability: <Gauge className="w-6 h-6" />,
    security: <Shield className="w-6 h-6" />,
    testability: <CheckSquare className="w-6 h-6" />,
    maintainability: <Code className="w-6 h-6" />,
    performance: <Zap className="w-6 h-6" />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {Object.entries(result.categories).map(([key, score]) => (
        <ScoreGauge
          key={key}
          category={key}
          score={score}
          icon={categoryIcons[key as keyof typeof categoryIcons]}
        />
      ))}
    </div>
  );
};

interface OverallScoreProps {
  score: number;
  timestamp: string;
}

export const OverallScore: React.FC<OverallScoreProps> = ({ score, timestamp }) => {
  const getScoreLevel = (score: number): { level: string; color: string } => {
    if (score >= 85) return { level: 'Production Ready', color: 'text-success' };
    if (score >= 70) return { level: 'Mostly Ready', color: 'text-warning' };
    if (score >= 50) return { level: 'Needs Work', color: 'text-danger' };
    return { level: 'Critical Issues', color: 'text-red-900' };
  };

  const { level, color } = getScoreLevel(score);

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white shadow-lg">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-2">Production Readiness Score</h2>
        <p className="text-white/90 mb-6">Overall assessment of your application</p>

        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center bg-white/20 rounded-full">
              <div className="text-center">
                <div className="text-5xl font-bold">{score}</div>
                <div className="text-sm mt-1">/100</div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className={`text-3xl font-bold ${color} mb-4`}>{level}</div>
            <p className="text-white/80 mb-4">
              Analysis completed on {new Date(timestamp).toLocaleDateString()} at{' '}
              {new Date(timestamp).toLocaleTimeString()}
            </p>

            {score < 85 && (
              <div className="bg-white/10 border border-white/20 rounded p-3 text-sm">
                <p className="font-semibold mb-1">Next Steps:</p>
                <p className="text-white/90">
                  Review the identified risks and recommendations below to improve your application's production readiness.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
