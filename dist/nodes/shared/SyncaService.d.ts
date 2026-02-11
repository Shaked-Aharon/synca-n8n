import { IExecuteFunctions, IHookFunctions, IHttpRequestOptions, ILoadOptionsFunctions } from 'n8n-workflow';
export interface SyncaCreds {
    apiToken: string;
    baseUrl: string;
    secretKey: string;
}
export declare class SyncaService {
    private context;
    constructor(context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions);
    getCredentials(credName?: string): Promise<SyncaCreds>;
    request(options: IHttpRequestOptions): Promise<any>;
    authenticatedRequest(path: string, method?: string, body?: any | undefined, additionalOptions?: Partial<IHttpRequestOptions>): Promise<any>;
    invoke(credentialsId: string, operation: string, body?: any, method?: string, additionalOptions?: Partial<IHttpRequestOptions>): Promise<any>;
    invokeMetadata(operation: string, method?: string, body?: any): Promise<any>;
    getProviderCredentials(provider?: string): Promise<{
        name: string;
        value: string;
    }[]>;
    generateSignature(timestamp: string, method: string, path: string, body: string, secretKey: string): string;
    generateSignatureAsync(timestamp: string, method: string, path: string, body: string, secretKey: string): Promise<string>;
}
