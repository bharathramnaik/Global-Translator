import { Environment } from './environment';

// Development environment configuration
export const environment: Environment = {
    production: false,
    envName: 'development',
    apiBaseUrl: 'http://localhost:8080/api/v1',
    wsBaseUrl: 'ws://localhost:8080/ws',
    minioEndpoint: 'http://localhost:9000',
    features: {
        enableAnalytics: false,
        enableDebugMode: true,
        enableMockApi: false
    }
};
