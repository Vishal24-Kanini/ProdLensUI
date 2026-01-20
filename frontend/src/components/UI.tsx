import React from 'react';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Analyzing your app...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-2">
        Running AI analysis across scalability, security, and performance...
      </p>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="p-4 bg-danger/10 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Failed</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

interface SuccessStateProps {
  message?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ message = 'Analysis completed successfully!' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="p-4 bg-success/10 rounded-full mb-4">
        <CheckCircle className="w-8 h-8 text-success" />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

interface TabsProps {
  tabs: { label: string; value: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps & { children: React.ReactNode }> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children }) => {
  const styles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};
