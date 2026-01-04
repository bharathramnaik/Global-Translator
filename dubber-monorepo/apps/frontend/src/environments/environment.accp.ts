import { Environment } from './environment';

// Acceptance environment configuration
export const environment: Environment = {
    production: false,
    envName: 'acceptance',
    apiBaseUrl: 'http://localhost:8280/api/v1',
    wsBaseUrl: 'ws://localhost:8280/ws',
    minioEndpoint: 'http://localhost:9200',
    features: {
        enableAnalytics: true,
        enableDebugMode: false,
        enableMockApi: false
    }
};
