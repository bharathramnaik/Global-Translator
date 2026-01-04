import { Environment } from './environment';

// Production environment configuration
export const environment: Environment = {
    production: true,
    envName: 'production',
    apiBaseUrl: '/api/v1',  // Relative URL for same-origin deployment
    wsBaseUrl: '/ws',
    minioEndpoint: '',      // Served through API gateway in production
    features: {
        enableAnalytics: true,
        enableDebugMode: false,
        enableMockApi: false
    }
};
