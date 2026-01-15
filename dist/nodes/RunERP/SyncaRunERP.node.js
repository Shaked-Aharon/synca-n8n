"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaRunERP = void 0;
const run_erp_create_shipment_constant_1 = require("./constants/run-erp-create-shipment.constant");
const run_erp_cancel_shipment_constant_1 = require("./constants/run-erp-cancel-shipment.constant");
const run_erp_print_label_constant_1 = require("./constants/run-erp-print-label.constant");
const run_erp_get_tracking_constant_1 = require("./constants/run-erp-get-tracking.constant");
const run_erp_get_pickup_points_constant_1 = require("./constants/run-erp-get-pickup-points.constant");
class SyncaRunERP {
    constructor() {
        this.description = {
            usableAsTool: true,
            displayName: 'Synca Delivery Run ERP',
            name: 'customSyncaRunErp',
            icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
            group: ['transform'],
            documentationUrl: 'https://n8n.synca.co.il/docs',
            version: 1,
            description: 'Invoke Run ERP shipping actions via the Synca backend',
            defaults: { name: 'Synca Run ERP' },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [{ name: 'customSyncaApiCredentials', required: true }],
            properties: [
                {
                    displayName: 'Credentials',
                    name: 'credentials',
                    type: 'options',
                    typeOptions: { loadOptionsMethod: 'getCredentials' },
                    default: '',
                    required: true,
                    description: 'Select the Run ERP credentials to use',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Shipment', value: 'shipment' },
                        { name: 'Label', value: 'label' },
                        { name: 'Tracking', value: 'tracking' },
                        { name: 'Pickup Points', value: 'pickup_points' },
                    ],
                    default: 'shipment',
                    description: 'The resource to operate on',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['shipment'] } },
                    options: [
                        {
                            name: 'Create',
                            value: 'create_shipment',
                            description: 'Create a new shipment in Run ERP system',
                            action: 'Create a shipment',
                        },
                        {
                            name: 'Cancel',
                            value: 'cancel_shipment',
                            description: 'Cancel an existing shipment (before pickup)',
                            action: 'Cancel a shipment',
                        },
                    ],
                    default: 'create_shipment',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['label'] } },
                    options: [
                        {
                            name: 'Print',
                            value: 'print_label',
                            description: 'Generate a shipping label PDF (10x10 cm)',
                            action: 'Print a shipping label',
                        },
                    ],
                    default: 'print_label',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['tracking'] } },
                    options: [
                        {
                            name: 'Get Status',
                            value: 'get_tracking',
                            description: 'Get tracking information for a shipment',
                            action: 'Get tracking status',
                        },
                    ],
                    default: 'get_tracking',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['pickup_points'] } },
                    options: [
                        {
                            name: 'List',
                            value: 'get_pickup_points',
                            description: 'Get list of available pickup points',
                            action: 'List pickup points',
                        },
                    ],
                    default: 'get_pickup_points',
                },
                ...run_erp_create_shipment_constant_1.RunErpCreateShipment.declare,
                ...run_erp_cancel_shipment_constant_1.RunErpCancelShipment.declare,
                ...run_erp_print_label_constant_1.RunErpPrintLabel.declare,
                ...run_erp_get_tracking_constant_1.RunErpGetTracking.declare,
                ...run_erp_get_pickup_points_constant_1.RunErpGetPickupPoints.declare,
            ],
        };
        this.methods = {
            loadOptions: {
                async getCredentials() {
                    try {
                        const { apiToken, baseUrl } = await this.getCredentials('customSyncaApiCredentials');
                        const res = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/v1/invoke/get-credentials`,
                            headers: { 'x-api-token': apiToken },
                            qs: { provider: 'run_erp' },
                        });
                        return Array.isArray(res)
                            ? res.map((c) => ({ name: c.name || c.id, value: c.id }))
                            : [];
                    }
                    catch {
                        return [{ name: 'Default', value: 'default' }];
                    }
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const out = [];
        const { apiToken, baseUrl } = await this.getCredentials('customSyncaApiCredentials');
        for (let i = 0; i < items.length; i++) {
            try {
                const credentialId = this.getNodeParameter('credentials', i);
                const operation = this.getNodeParameter('operation', i);
                let params = {};
                switch (operation) {
                    case 'create_shipment':
                        params = run_erp_create_shipment_constant_1.RunErpCreateShipment.process(params, i, this.getNodeParameter.bind(this));
                        break;
                    case 'cancel_shipment':
                        params = run_erp_cancel_shipment_constant_1.RunErpCancelShipment.process(params, i, this.getNodeParameter.bind(this));
                        break;
                    case 'print_label':
                        params = run_erp_print_label_constant_1.RunErpPrintLabel.process(params, i, this.getNodeParameter.bind(this));
                        break;
                    case 'get_tracking':
                        params = run_erp_get_tracking_constant_1.RunErpGetTracking.process(params, i, this.getNodeParameter.bind(this));
                        break;
                    case 'get_pickup_points':
                        params = run_erp_get_pickup_points_constant_1.RunErpGetPickupPoints.process(params, i, this.getNodeParameter.bind(this));
                        break;
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }
                const req = {
                    method: 'POST',
                    url: `${baseUrl}/v1/invoke/${credentialId}/${operation}`,
                    headers: { 'x-api-token': apiToken, 'Content-Type': 'application/json' },
                    body: params,
                    json: true,
                };
                const response = await this.helpers.httpRequest(req);
                if (operation === 'print_label' && response.success && response.pdf_data) {
                    out.push({
                        json: {
                            ...response,
                            message: 'Label PDF generated successfully. Use pdf_data (base64) to save or send the file.',
                        },
                        pairedItem: { item: i }
                    });
                }
                else {
                    out.push({ json: response, pairedItem: { item: i } });
                }
            }
            catch (err) {
                if (this.continueOnFail()) {
                    out.push({ json: { error: err.message }, pairedItem: { item: i } });
                    continue;
                }
                throw err;
            }
        }
        return [out];
    }
}
exports.SyncaRunERP = SyncaRunERP;
//# sourceMappingURL=SyncaRunERP.node.js.map