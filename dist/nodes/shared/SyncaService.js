"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaService = void 0;
const crypto_1 = require("crypto");
class SyncaService {
    constructor(context) {
        this.context = context;
    }
    async getCredentials(credName = 'customSyncaApiCredentials') {
        return await this.context.getCredentials(credName);
    }
    async request(options) {
        return await this.context.helpers.httpRequest(options);
    }
    async authenticatedRequest(path, method = 'GET', body = undefined, additionalOptions = {}) {
        const { apiToken, baseUrl, secretKey } = await this.getCredentials();
        const url = `${baseUrl}${path}`;
        const timestamp = Math.floor(Date.now() / 1000).toString();
        let bodyForSignature = body;
        if (typeof body === 'object') {
            bodyForSignature = JSON.stringify(body);
        }
        else if (body === undefined || body === null) {
            bodyForSignature = '';
        }
        else {
            bodyForSignature = String(body);
        }
        const signature = this.generateSignature(timestamp, method, path, bodyForSignature, secretKey);
        const options = {
            ...additionalOptions,
            method: method,
            url,
            headers: {
                ...additionalOptions.headers,
                'x-api-token': apiToken,
                'Content-Type': 'application/json',
                'x-timestamp': timestamp,
                'x-signature': signature,
            },
            body,
            json: true,
        };
        return await this.request(options);
    }
    async invoke(credentialsId, operation, body = {}, method = 'POST', additionalOptions = {}) {
        const path = `/v1/invoke/${credentialsId}/${operation}`;
        return await this.authenticatedRequest(path, method, body, additionalOptions);
    }
    async getProviderCredentials(provider = '') {
        try {
            const { apiToken, baseUrl } = await this.getCredentials();
            const options = {
                method: 'GET',
                url: `${baseUrl}/v1/invoke/get-credentials`,
                headers: { 'x-api-token': apiToken },
                qs: provider ? { provider } : {},
                json: true,
            };
            const res = await this.authenticatedRequest(`/v1/invoke/get-credentials`, 'GET', undefined, options);
            return Array.isArray(res)
                ? res.map((c) => ({ name: c.name || c.id, value: c.id }))
                : [];
        }
        catch (error) {
            return [{ name: 'Default', value: 'default' }];
        }
    }
    generateSignature(timestamp, method, path, body, secretKey) {
        const dataToSign = `${timestamp}${method.toUpperCase()}${path}${body}`;
        return (0, crypto_1.createHmac)('sha256', secretKey)
            .update(dataToSign)
            .digest('hex');
    }
    async generateSignatureAsync(timestamp, method, path, body, secretKey) {
        const dataToSign = `${timestamp}${method.toUpperCase()}${path}${body}`;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(dataToSign);
        const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signature = await crypto.subtle.sign('HMAC', key, messageData);
        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}
exports.SyncaService = SyncaService;
//# sourceMappingURL=SyncaService.js.map