import React, { useState, useRef } from 'react';
import { FileUpload } from '../components/FileUpload';
import { MainLayout } from '../components/MainLayout';
import { analysisService } from '../services/api';
import { generateMockAppConfig, validateAppConfig } from '../services/fileService';
import { AlertCircle, Zap } from 'lucide-react';

interface UploadPageProps {
  onAnalysisComplete: (result: any) => void;
  onNavigate: (page: string) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onAnalysisComplete, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(undefined);
    setFileName(file.name);
    setLoading(true);

    try {
      // Parse the file
      const text = await file.text();
      const appConfig = JSON.parse(text);

      // Validate configuration
      if (!validateAppConfig(appConfig)) {
        throw new Error('Invalid app configuration. Missing required fields.');
      }

      // Send to backend for analysis
      const response = await analysisService.analyzeApp({
        appConfig,
        appName: appConfig.name || 'Untitled App',
      });

      if (!response.success) {
        throw new Error(response.error || 'Analysis failed');
      }

      // Navigate to results page
      if (response.data) {
        onAnalysisComplete(response.data);
        onNavigate('results');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze the app. Please check the file format.');
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError(undefined);
    setLoading(true);

    try {
      const response = await analysisService.getSampleAnalysis();

      if (!response.success) {
        throw new Error(response.error || 'Demo failed');
      }

      if (response.data) {
        onAnalysisComplete(response.data);
        onNavigate('results');
      }
    } catch (err: any) {
      setError(err.message || 'Demo analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Upload App">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Analyze Your App's Production Readiness
            </h1>
            <p className="text-lg text-gray-600">
              Upload your app configuration and get AI-powered insights on scalability, security, testability, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🔍', title: 'Deep Analysis', desc: 'AI inspects your app structure and logic' },
              { icon: '⚡', title: 'Fast Scoring', desc: 'Get readiness scores in seconds' },
              { icon: '💡', title: 'Actionable', desc: 'Clear recommendations for improvement' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            loading={loading}
            error={error}
          />

          {fileName && !error && (
            <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success">
                File selected: <span className="font-semibold">{fileName}</span>
              </span>
            </div>
          )}
        </div>

        {/* Demo Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900">Try Demo Analysis</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                See how ProdLens AI works with a sample e-commerce dashboard application. Get instant insights without uploading a file.
              </p>
              <button
                onClick={handleDemo}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'View Demo Analysis'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Supported File Formats
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>JSON</strong> - App configuration in JSON format</li>
              <li>• <strong>ZIP</strong> - Archive with metadata.json, blocks.json, dependencies.json</li>
              <li>• <strong>SMSS</strong> - Studio Mobile Smart Structure files</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              What Gets Analyzed
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Architecture & scalability patterns</li>
              <li>• Security configurations & auth flows</li>
              <li>• Testability & code coverage potential</li>
              <li>• Performance optimization opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
