"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaApi = void 0;
class SyncaApi {
    constructor() {
        this.name = 'customSyncaApiCredentials';
        this.displayName = 'Synca API Credentials';
        this.icon = { dark: 'file:icon.svg', light: 'file:icon.svg' };
        this.documentationUrl = 'https://n8n.synca.co.il/docs';
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
                displayName: 'Secret Key',
                name: 'secretKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The Secret Key for authentication',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://n8n-api.synca.co.il',
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