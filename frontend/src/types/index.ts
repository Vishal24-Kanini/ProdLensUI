export interface AnalysisResult {
  appName: string;
  timestamp: string;
  overallScore: number;
  categories: {
    scalability: CategoryScore;
    security: CategoryScore;
    testability: CategoryScore;
    maintainability: CategoryScore;
    performance: CategoryScore;
  };
  risks: Risk[];
  insights: Insight[];
  testSuggestions: TestSuggestion[];
  scaleAnalysis: ScaleAnalysis;
  recommendations: Recommendation[];
}

export interface CategoryScore {
  score: number;
  level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Excellent';
  issues: string[];
  suggestions: string[];
}

export interface Risk {
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  impact: string;
  mitigation: string;
}

export interface Insight {
  category: string;
  title: string;
  description: string;
  actionable: boolean;
}

export interface TestSuggestion {
  type: 'API' | 'UI' | 'Automation' | 'Load' | 'Security';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedDuration: string;
}

export interface ScaleAnalysis {
  title: string;
  breakingPoints: string[];
  recommendations: string[];
  readinessLevel: 'Ready' | 'Partially Ready' | 'Not Ready';
}

export interface Recommendation {
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  action: string;
  rationale: string;
  estimatedEffort: string;
}

export interface AppConfig {
  name: string;
  description?: string;
  blocks?: Record<string, unknown>;
  dependencies?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface AnalysisRequest {
  appConfig: AppConfig;
  appName: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
