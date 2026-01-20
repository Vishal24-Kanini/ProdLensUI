import { AppConfig } from '../types';

/**
 * Parse uploaded zip file (mock implementation for now)
 */
export const parseZipFile = async (file: File): Promise<AppConfig> => {
  // Mock implementation - in production, you'd use JSZip or similar
  try {
    const text = await file.text();
    const config = JSON.parse(text);
    return config;
  } catch {
    throw new Error('Failed to parse app configuration file');
  }
};

/**
 * Validate app configuration structure
 */
export const validateAppConfig = (config: unknown): boolean => {
  if (!config || typeof config !== 'object') return false;

  const appConfig = config as Record<string, unknown>;

  // Check for required fields
  return (
    typeof appConfig.name === 'string' &&
    appConfig.name.length > 0
  );
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate mock app config for testing
 */
export const generateMockAppConfig = (): AppConfig => {
  return {
    name: 'E-Commerce Dashboard',
    description: 'AI-generated e-commerce dashboard app',
    blocks: {
      layout: {
        type: 'grid',
        columns: 12,
      },
      components: [
        { id: 'header', type: 'header' },
        { id: 'sidebar', type: 'sidebar' },
        { id: 'main', type: 'container' },
      ],
    },
    dependencies: {
      'react': '^18.2.0',
      'react-query': '^3.39.0',
      'lodash': '^4.17.21',
      'moment': '^2.29.4',
    },
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0.0',
      author: 'AI',
      tags: ['dashboard', 'ecommerce'],
      complexity: 'medium',
      estimatedUsers: 1000,
    },
  };
};
