import React from 'react';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';
import { TestSuggestion, ScaleAnalysis } from '../types';

interface TestSuggestionsProps {
  suggestions: TestSuggestion[];
}

export const TestSuggestions: React.FC<TestSuggestionsProps> = ({ suggestions }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'API':
        return 'bg-blue-100 text-blue-800';
      case 'UI':
        return 'bg-purple-100 text-purple-800';
      case 'Automation':
        return 'bg-green-100 text-green-800';
      case 'Load':
        return 'bg-orange-100 text-orange-800';
      case 'Security':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-l-4 border-danger';
      case 'Medium':
        return 'border-l-4 border-warning';
      case 'Low':
        return 'border-l-4 border-success';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, idx) => (
        <div key={idx} className={`bg-white p-4 rounded-lg border-l-4 ${getPriorityColor(suggestion.priority)}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getTypeColor(suggestion.type)}`}>
                  {suggestion.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Priority: {suggestion.priority}</span>
                <span>Est. Duration: {suggestion.estimatedDuration}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ScaleAnalysisProps {
  analysis: ScaleAnalysis;
}

export const ScaleAnalysisComponent: React.FC<ScaleAnalysisProps> = ({ analysis }) => {
  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'Ready':
        return 'bg-success/10 border-success/30 text-success';
      case 'Partially Ready':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'Not Ready':
        return 'bg-danger/10 border-danger/30 text-danger';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${getReadinessColor(analysis.readinessLevel)}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-3">{analysis.title}</h3>

          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Breaking Points at Scale:</h4>
            <ul className="space-y-1">
              {analysis.breakingPoints.map((point, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Readiness for Scale:</h4>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
