"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaWoltTrigger = void 0;
const SyncaService_1 = require("../shared/SyncaService");
class SyncaWoltTrigger {
    constructor() {
        this.description = {
            displayName: 'Synca Wolt Trigger',
            name: 'customSyncaWoltTrigger',
            icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["eventFilter"].length == 0 ? "All events" : $parameter["eventFilter"].map(e => e.replace("order.notification.", "")).join(", ")}}',
            description: 'Starts the workflow when a Synca event occurs',
            defaults: {
                name: 'Synca Wolt Trigger',
            },
            inputs: [],
            outputs: ["main"],
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
                    displayName: 'Event Filter',
                    name: 'eventFilter',
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
                    ],
                    default: [],
                    description: 'The events to listen for. Leave empty for all events.',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getCredentials() {
                    const service = new SyncaService_1.SyncaService(this);
                    return await service.getProviderCredentials();
                },
            },
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    return false;
                },
                async create() {
                    const credentialId = this.getNodeParameter('credentials');
                    const events = this.getNodeParameter('eventFilter');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const service = new SyncaService_1.SyncaService(this);
                    const path = '/v1/n8n/triggers/register';
                    const body = {
                        credentialId,
                        events: events.length > 0 ? events : ['*'],
                        targetUrl: webhookUrl,
                    };
                    try {
                        const response = await service.authenticatedRequest(path, 'POST', body);
                        if (response && response.id) {
                            const webhookData = this.getWorkflowStaticData('node');
                            webhookData.webhookId = response.id;
                            return true;
                        }
                        return false;
                    }
                    catch (error) {
                        throw new Error(`Failed to register webhook: ${error.message}`);
                    }
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (!webhookData.webhookId) {
                        return true;
                    }
                    const service = new SyncaService_1.SyncaService(this);
                    const path = `/v1/n8n/triggers/${webhookData.webhookId}`;
                    try {
                        await service.authenticatedRequest(path, 'DELETE', undefined);
                        delete webhookData.webhookId;
                        return true;
                    }
                    catch (error) {
                        return false;
                    }
                },
            },
        };
    }
    async webhook() {
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
exports.SyncaWoltTrigger = SyncaWoltTrigger;
//# sourceMappingURL=SyncaWoltTrigger.node.js.map