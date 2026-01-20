import React from 'react';
import { Brain, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ProdLens AI</h1>
              <p className="text-xs text-gray-600">Production Readiness Analyzer</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg border border-primary/20">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">AI-Powered Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-sm text-gray-600">
              ProdLens AI bridges the gap between rapid app creation and enterprise-quality delivery through intelligent analysis.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Analysis Covers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Scalability & Performance</li>
              <li>• Security & Compliance</li>
              <li>• Testing & QA Readiness</li>
              <li>• Maintainability & Code Quality</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Tech Stack</h3>
            <p className="text-sm text-gray-600 space-y-1">
              <div>Frontend: React + TypeScript</div>
              <div>Backend: Python FastAPI</div>
              <div>AI: OpenAI GPT Models</div>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} ProdLens AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
