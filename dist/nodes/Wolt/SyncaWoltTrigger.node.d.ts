import { IHookFunctions, IWebhookFunctions, INodeType, INodeTypeDescription, IWebhookResponseData, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
export declare class SyncaWoltTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
