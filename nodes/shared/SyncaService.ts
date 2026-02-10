import {
    IExecuteFunctions,
    IHookFunctions,
    IHttpRequestOptions,
    ILoadOptionsFunctions,
} from 'n8n-workflow';
import { createHmac } from 'crypto'

export interface SyncaCreds {
    apiToken: string;
    baseUrl: string;
    secretKey: string;
}

export class SyncaService {
    constructor(
        private context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions
    ) { }

    async getCredentials(credName: string = 'customSyncaApiCredentials'): Promise<SyncaCreds> {
        return await this.context.getCredentials<SyncaCreds>(credName);
    }

    async request(options: IHttpRequestOptions): Promise<any> {
        return await this.context.helpers.httpRequest(options);
    }

    async authenticatedRequest(path: string, method: string = 'GET', body: any | undefined = undefined, additionalOptions: Partial<IHttpRequestOptions> = {}): Promise<any> {
        const { apiToken, baseUrl, secretKey } = await this.getCredentials();
        const url = `${baseUrl}${path}`;

        const timestamp = Math.floor(Date.now() / 1000).toString();

        let bodyForSignature = body;
        if (typeof body === 'object') {
            bodyForSignature = JSON.stringify(body);
        } else if (body === undefined || body === null) {
            bodyForSignature = '';
        } else {
            bodyForSignature = String(body);
        }

        // const signatureAsync = await this.generateSignatureAsync(timestamp, method, path, bodyForSignature, secretKey);
        const signature = this.generateSignature(timestamp, method, path, bodyForSignature, secretKey);

        const options: IHttpRequestOptions = {
            ...additionalOptions,
            method: method as any,
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

    async invoke(credentialsId: string, operation: string, body: any = {}, method: string = 'POST', additionalOptions: Partial<IHttpRequestOptions> = {}): Promise<any> {
        const path = `/v1/invoke/${credentialsId}/${operation}`;
        return await this.authenticatedRequest(path, method, body, additionalOptions);
    }

    async getProviderCredentials(provider: string = ''): Promise<{ name: string, value: string }[]> {
        try {
            const { apiToken, baseUrl } = await this.getCredentials();
            const options: IHttpRequestOptions = {
                method: 'GET',
                url: `${baseUrl}/v1/invoke/get-credentials`,
                headers: { 'x-api-token': apiToken },
                qs: provider ? { provider } : {},
                json: true,
            };

            const res = await this.authenticatedRequest(`/v1/invoke/get-credentials`, 'GET', undefined, options);
            return Array.isArray(res)
                ? res.map((c: any) => ({ name: c.name || c.id, value: c.id }))
                : [];
        } catch (error) {
            return [{ name: 'Default', value: 'default' }];
        }
    }

    generateSignature(
        timestamp: string,
        method: string,
        path: string,
        body: string,
        secretKey: string
    ): string {
        const dataToSign = `${timestamp}${method.toUpperCase()}${path}${body}`;

        return createHmac('sha256', secretKey)
            .update(dataToSign)
            .digest('hex');
    }
    async generateSignatureAsync(
        timestamp: string,
        method: string,
        path: string,
        body: string,
        secretKey: string
    ): Promise<string> {
        const dataToSign = `${timestamp}${method.toUpperCase()}${path}${body}`;

        // Old Approach using crypto.subtle
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(dataToSign);

        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', key, messageData);

        // Convert to hex string
        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}
