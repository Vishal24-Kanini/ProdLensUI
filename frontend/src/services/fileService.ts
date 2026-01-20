import { AppConfig } from '../types';

/**
 * Parse uploaded zip file
 */
export const parseZipFile = async (file: File): Promise<AppConfig> => {
  try {
    // Handle JSON files directly
    if (file.name.endsWith('.json')) {
      const text = await file.text();
      const config = JSON.parse(text);
      return config;
    }

    // Handle ZIP files
    if (file.name.endsWith('.zip')) {
      // Dynamically import JSZip only when needed
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      // Try to extract metadata.json, blocks.json, and dependencies.json
      const files: Record<string, any> = {};

      const jsonFiles = ['metadata.json', 'blocks.json', 'dependencies.json', 'config.json'];
      for (const jsonFile of jsonFiles) {
        if (loadedZip.file(jsonFile)) {
          const content = await loadedZip.file(jsonFile)?.async('text');
          if (content) {
            files[jsonFile.replace('.json', '')] = JSON.parse(content);
          }
        }
      }

      // Combine extracted files into AppConfig
      const config: AppConfig = {
        name: files.metadata?.name || files.config?.name || file.name.replace('.zip', ''),
        description: files.metadata?.description || files.config?.description || '',
        blocks: files.blocks || files.config?.blocks || {},
        dependencies: files.dependencies || files.config?.dependencies || {},
        metadata: {
          ...files.metadata,
          createdAt: files.metadata?.createdAt || new Date().toISOString(),
          version: files.metadata?.version || '1.0.0',
        },
      };

      return config;
    }

    throw new Error('Unsupported file format. Please upload a .json or .zip file.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse app configuration: ${error.message}`);
    }
    throw new Error('Failed to parse app configuration file');
  }
};

/**
 * Validate app configuration structure
 */
export const validateAppConfig = (config: unknown): boolean => {
  if (!config || typeof config !== 'object') return false;

  const appConfig = config as Record<string, unknown>;

  // Check for required fields - only name is mandatory
  return (
    typeof appConfig.name === 'string' &&
    appConfig.name.trim().length > 0
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
