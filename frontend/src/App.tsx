import React, { useState } from 'react';
import { UploadPage } from './pages/UploadPage';
import { ResultsPage } from './pages/ResultsPage';
import { AnalysisResult } from './types';
import './index.css';

type PageType = 'upload' | 'results';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('upload');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    if (page === 'upload') {
      setAnalysisResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'upload' && (
        <UploadPage onAnalysisComplete={handleAnalysisComplete} onNavigate={handleNavigate} />
      )}
      {currentPage === 'results' && analysisResult && (
        <ResultsPage result={analysisResult} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
