import {
    IHookFunctions,
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    IHttpRequestOptions,
    ILoadOptionsFunctions,
    INodePropertyOptions,
    NodeConnectionType,
} from 'n8n-workflow';

interface SyncaCreds {
    apiToken: string;
    baseUrl: string;
}

export class SyncaWoltTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Synca Wolt Trigger',
        name: 'customSyncaWoltTrigger',
        icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["events"].length == 0 ? "All events" : $parameter["events"].map(e => e.replace("order.notification.", "")).join(", ")}}',
        description: 'Starts the workflow when a Synca event occurs',
        defaults: {
            name: 'Synca Wolt Trigger',
        },
        inputs: [],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'customSyncaApiCredentials',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            /* ------------------------------------------------------------ */
            /* Credential picker                                            */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Credentials',
                name: 'credentials',
                type: 'options',
                typeOptions: { loadOptionsMethod: 'getCredentials' },
                default: '',
                required: true,
                description: 'Select the Wolt credentials to listen to',
            },
            {
                displayName: 'Events',
                name: 'events',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Order Created',
                        description: 'Sent for all new orders which the merchant is receiving on the Wolt marketplace. ',
                        value: 'order.notification.CREATED',
                    },
                    {
                        name: 'Order has been accepted or confirmed',
                        description: 'Sent once the order has been accepted or confirmed* by the venue staff, either automatically or manually. *pre-orders should be confirmed upon creation, Wolt will move them automatically in "PRODUCTION" status when it\'s time to start the food preparation or order collection.',
                        value: 'order.notification.PRODUCTION',
                    },
                    {
                        name: 'Order ready for pick-up',
                        description: 'Sent once the merchant has completed the preparation or collection of the order.',
                        value: 'order.notification.READY',
                    },
                    {
                        name: 'Order has been canceled',
                        description: 'Sent once the order has been “rejected”, either by the merchant, the customer or Wolt Support.',
                        value: 'order.notification.CANCELED',
                    },
                    {
                        name: 'Order has been courier arrival',
                        description: 'Sent X* min before the courier\'s arrival at the merchant\'s location. *X is configurable per location.',
                        value: 'order.notification.COURIER-ARRIVAL',
                    },
                    {
                        name: 'Order has been picked up',
                        description: 'Sent once the courier has completed the pick-up at the merchant\'s location.',
                        value: 'order.notification.PICK-UP-COMPLETED',
                    },
                    {
                        name: 'Order has been delivered',
                        description: 'Sent once the order is delivered to the customer.',
                        value: 'order.notification.DELIVERED',
                    },
                    {
                        name: 'Order has been reviewed',
                        description: 'Sent once a consumer has provided a review or rating of their order.',
                        value: 'order.notification.REVIEW',
                    },
                    // Add more events as needed
                ],
                default: [],
                description: 'The events to listen for. Leave empty for all events.',
            },
        ],
    };

    methods = {
        loadOptions: {
            async getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                try {
                    const { apiToken, baseUrl } = await this.getCredentials<SyncaCreds>('customSyncaApiCredentials');
                    const res = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${baseUrl}/v1/invoke/get-credentials`,
                        headers: { 'x-api-token': apiToken },
                        json: true,
                    });
                    return Array.isArray(res)
                        ? res.map((c: any) => ({ name: c.name || c.id, value: c.id }))
                        : [];
                } catch {
                    return [{ name: 'Default', value: 'default' }];
                }
            },
        },
    };

    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                return false;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                const credentialId = this.getNodeParameter('credentials') as string;
                const events = this.getNodeParameter('events') as string[];
                const webhookUrl = this.getNodeWebhookUrl('default');

                const { apiToken, baseUrl } = await this.getCredentials<SyncaCreds>('customSyncaApiCredentials');
                const endpoint = `${baseUrl}/v1/n8n/triggers/register`;

                const body = {
                    credentialId,
                    events: events.length > 0 ? events : ['*'],
                    targetUrl: webhookUrl,
                };

                const options: IHttpRequestOptions = {
                    method: 'POST',
                    url: endpoint,
                    headers: {
                        'x-api-token': apiToken,
                        'Content-Type': 'application/json',
                    },
                    body,
                    json: true,
                };

                try {
                    const response = await this.helpers.httpRequest(options);

                    if (response && response.id) {
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = response.id;
                        return true;
                    }
                    return false;
                } catch (error) {
                    throw new Error(`Failed to register webhook: ${(error as any).message}`);
                }
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');

                if (!webhookData.webhookId) {
                    return true;
                }

                const { apiToken, baseUrl } = await this.getCredentials<SyncaCreds>('customSyncaApiCredentials');
                const endpoint = `${baseUrl}/v1/n8n/triggers/${webhookData.webhookId}`;

                const options: IHttpRequestOptions = {
                    method: 'DELETE',
                    url: endpoint,
                    headers: {
                        'x-api-token': apiToken,
                    },
                    json: true,
                };

                try {
                    await this.helpers.httpRequest(options);
                    delete webhookData.webhookId;
                    return true;
                } catch (error) {
                    return false;
                }
            },
        },
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData();
        const headerData = this.getHeaderData();
        const req = this.getRequestObject();
        return {
            workflowData: [
                [
                    {
                        json: {
                            body: bodyData,
                            headers: headerData,
                            query: req.query,
                        },
                    },
                ],
            ],
        };
    }
}
