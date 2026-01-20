import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { DashboardGrid, OverallScore } from '../components/Dashboard';
import { RisksGrid } from '../components/RiskCard';
import { TestSuggestions, ScaleAnalysisComponent } from '../components/Insights';
import { RecommendationsList } from '../components/Recommendations';
import { Tabs } from '../components/UI';
import { AnalysisResult } from '../types';
import { Download, Share2 } from 'lucide-react';

interface ResultsPageProps {
  result: AnalysisResult;
  onNavigate: (page: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ result, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Risks', value: 'risks' },
    { label: 'Test Plan', value: 'testing' },
    { label: 'Scale Analysis', value: 'scale' },
    { label: 'Recommendations', value: 'recommendations' },
  ];

  const handleExport = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prodlens-analysis-${result.appName}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout title={`Analysis - ${result.appName}`}>
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{result.appName}</h1>
            <p className="text-gray-600">
              Analysis completed on {new Date(result.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Overall Score */}
        <OverallScore score={result.overallScore} timestamp={result.timestamp} />

        {/* Category Scores */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Scores</h2>
          <DashboardGrid result={result} />
        </div>

        {/* Tabs Content */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.insights.map((insight, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                    <div className="text-xs text-primary font-medium">
                      {insight.actionable ? '✓ Actionable' : 'ℹ Informational'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Found <strong>{result.risks.length}</strong> potential risks
                </p>
              </div>
              <RisksGrid risks={result.risks} />
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Recommended test scenarios: <strong>{result.testSuggestions.length}</strong>
                </p>
              </div>
              <TestSuggestions suggestions={result.testSuggestions} />
            </div>
          )}

          {activeTab === 'scale' && (
            <div>
              <ScaleAnalysisComponent analysis={result.scaleAnalysis} />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div>
              <RecommendationsList recommendations={result.recommendations} />
            </div>
          )}
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{result.risks.length}</div>
            <div className="text-sm text-gray-600">Risks Identified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{result.testSuggestions.length}</div>
            <div className="text-sm text-gray-600">Test Scenarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{result.recommendations.length}</div>
            <div className="text-sm text-gray-600">Recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{result.insights.length}</div>
            <div className="text-sm text-gray-600">Key Insights</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
