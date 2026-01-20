import React from 'react';
import { Recommendation } from '../types';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-800' };
      case 'High':
        return { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' };
      case 'Medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' };
      case 'Low':
        return { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const styles = getPriorityStyles(recommendation.priority);

  return (
    <div className={`border rounded-lg p-4 ${styles.bg} ${styles.border}`}>
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{recommendation.action}</h4>
              <p className="text-xs text-gray-600 mt-1">{recommendation.category}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${styles.badge}`}>
              {recommendation.priority}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{recommendation.rationale}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Effort: {recommendation.estimatedEffort}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecommendationsListProps {
  recommendations: Recommendation[];
  maxItems?: number;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations, maxItems = 10 }) => {
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) - 
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 4);
  });

  const displayed = sortedRecommendations.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayed.map((rec, idx) => (
        <RecommendationCard key={idx} recommendation={rec} />
      ))}
      {recommendations.length > maxItems && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">
            +{recommendations.length - maxItems} more recommendations
          </p>
        </div>
      )}
    </div>
  );
};
