import axios from 'axios';
import { AnalysisRequest, AnalysisResult, APIResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const analysisService = {
  /**
   * Analyze an app configuration
   */
  async analyzeApp(request: AnalysisRequest): Promise<APIResponse<AnalysisResult>> {
    try {
      const response = await apiClient.post<APIResponse<AnalysisResult>, APIResponse<AnalysisResult>>( 
        '/analyze',
        request
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get analysis status
   */
  async getStatus(analysisId: string): Promise<APIResponse<{ status: string; progress: number }>> {
    try {
      const response = await apiClient.get<
        APIResponse<{ status: string; progress: number }>,
        APIResponse<{ status: string; progress: number }>
      >(
        `/status/${analysisId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get sample analysis for demo
   */
  async getSampleAnalysis(): Promise<APIResponse<AnalysisResult>> {
    try {
      const response = await apiClient.get<APIResponse<AnalysisResult>, APIResponse<AnalysisResult>>(
        '/sample-analysis'
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
