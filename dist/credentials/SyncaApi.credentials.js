"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaApi = void 0;
class SyncaApi {
    constructor() {
        this.name = 'customSyncaApiCredentials';
        this.displayName = 'Custom API Credentials';
        this.documentationUrl = 'https://your-api-docs.com';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The API token for authentication',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'http://87.71.191.82',
                description: 'Base URL of your Synca instance',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-API-Token': '={{$credentials.apiToken}}',
                },
            },
        };
        this.test = {
            request: {
                skipSslCertificateValidation: true,
                headers: {
                    'X-API-Token': '={{$credentials.apiToken}}',
                },
                baseURL: '={{$credentials.baseUrl}}',
                url: '/v1/invoke/health-check',
                method: 'GET',
            },
        };
    }
}
exports.SyncaApi = SyncaApi;
//# sourceMappingURL=SyncaApi.credentials.js.map