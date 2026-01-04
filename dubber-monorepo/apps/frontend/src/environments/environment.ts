// Environment configuration interface
export interface Environment {
    production: boolean;
    envName: string;
    apiBaseUrl: string;
    wsBaseUrl: string;
    minioEndpoint: string;
    features: {
        enableAnalytics: boolean;
        enableDebugMode: boolean;
        enableMockApi: boolean;
    };
}

// Default/Development environment
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
