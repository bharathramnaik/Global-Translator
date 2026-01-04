import { Environment } from './environment';

// Test environment configuration
export const environment: Environment = {
    production: false,
    envName: 'test',
    apiBaseUrl: 'http://localhost:8180/api/v1',
    wsBaseUrl: 'ws://localhost:8180/ws',
    minioEndpoint: 'http://localhost:9100',
    features: {
        enableAnalytics: false,
        enableDebugMode: true,
        enableMockApi: false
    }
};
