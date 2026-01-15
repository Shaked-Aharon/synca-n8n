import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestOptions,
    ILoadOptionsFunctions,
    INodePropertyOptions,
    NodeConnectionType,
} from 'n8n-workflow';
import { RunErpCreateShipment } from './constants/run-erp-create-shipment.constant';
import { RunErpCancelShipment } from './constants/run-erp-cancel-shipment.constant';
import { RunErpPrintLabel } from './constants/run-erp-print-label.constant';
import { RunErpGetTracking } from './constants/run-erp-get-tracking.constant';
import { RunErpGetPickupPoints } from './constants/run-erp-get-pickup-points.constant';

interface SyncaCreds {
    apiToken: string; // Synca dashboard token
    baseUrl: string;  // e.g. https://synca.example.com
}

export class SyncaRunERP implements INodeType {
    description: INodeTypeDescription = {
        usableAsTool: true,
        displayName: 'Synca Delivery Run ERP',
        name: 'customSyncaRunErp',
        icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
        group: ['transform'],
        documentationUrl: 'https://n8n.synca.co.il/docs',
        version: 1,
        description: 'Invoke Run ERP shipping actions via the Synca backend',
        defaults: { name: 'Synca Run ERP' },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [{ name: 'customSyncaApiCredentials', required: true }],
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
                description: 'Select the Run ERP credentials to use',
            },

            /* ------------------------------------------------------------ */
            /* Resource                                                     */
            /* ------------------------------------------------------------ */
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

            /* ------------------------------------------------------------ */
            /* Operations by Resource                                       */
            /* ------------------------------------------------------------ */

            /* Shipment Operations */
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

            /* Label Operations */
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

            /* Tracking Operations */
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

            /* Pickup Points Operations */
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

            /* ------------------------------------------------------------ */
            /* Operation-specific parameters                                */
            /* ------------------------------------------------------------ */

            /* Shipment → Create */
            ...RunErpCreateShipment.declare,

            /* Shipment → Cancel */
            ...RunErpCancelShipment.declare,

            /* Label → Print */
            ...RunErpPrintLabel.declare,

            /* Tracking → Get Status */
            ...RunErpGetTracking.declare,

            /* Pickup Points → List */
            ...RunErpGetPickupPoints.declare,
        ],
    };

    /* -------------------------------------------------------------- */
    /* Dynamic credential list                                        */
    /* -------------------------------------------------------------- */
    methods = {
        loadOptions: {
            async getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                try {
                    const { apiToken, baseUrl } = await this.getCredentials<SyncaCreds>('customSyncaApiCredentials');
                    const res = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${baseUrl}/v1/invoke/get-credentials`,
                        headers: { 'x-api-token': apiToken },
                        qs: { provider: 'run_erp' }, // Filter for Run ERP credentials
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

    /* -------------------------------------------------------------- */
    /* Main execution                                                 */
    /* -------------------------------------------------------------- */
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const out: INodeExecutionData[] = [];

        const { apiToken, baseUrl } = await this.getCredentials<SyncaCreds>('customSyncaApiCredentials');

        for (let i = 0; i < items.length; i++) {
            try {
                const credentialId = this.getNodeParameter('credentials', i) as string;
                const operation = this.getNodeParameter('operation', i) as string;

                /* Gather all user-supplied params based on operation */
                let params: Record<string, any> = {};

                switch (operation) {
                    case 'create_shipment':
                        params = RunErpCreateShipment.process(params, i, this.getNodeParameter.bind(this));
                        break;

                    case 'cancel_shipment':
                        params = RunErpCancelShipment.process(params, i, this.getNodeParameter.bind(this));
                        break;

                    case 'print_label':
                        params = RunErpPrintLabel.process(params, i, this.getNodeParameter.bind(this));
                        break;

                    case 'get_tracking':
                        params = RunErpGetTracking.process(params, i, this.getNodeParameter.bind(this));
                        break;

                    case 'get_pickup_points':
                        params = RunErpGetPickupPoints.process(params, i, this.getNodeParameter.bind(this));
                        break;

                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }

                const req: IHttpRequestOptions = {
                    method: 'POST',
                    url: `${baseUrl}/v1/invoke/${credentialId}/${operation}`,
                    headers: { 'x-api-token': apiToken, 'Content-Type': 'application/json' },
                    body: params,
                    json: true,
                };

                const response = await this.helpers.httpRequest(req);

                // Special handling for print_label - include binary data info
                if (operation === 'print_label' && response.success && response.pdf_data) {
                    out.push({
                        json: {
                            ...response,
                            message: 'Label PDF generated successfully. Use pdf_data (base64) to save or send the file.',
                        },
                        pairedItem: { item: i }
                    });
                } else {
                    out.push({ json: response, pairedItem: { item: i } });
                }
            } catch (err) {
                if (this.continueOnFail()) {
                    out.push({ json: { error: (err as any).message }, pairedItem: { item: i } });
                    continue;
                }
                throw err;
            }
        }
        return [out];
    }
}