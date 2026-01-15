import { INodeProperties } from 'n8n-workflow';

export const RunErpGetTracking = {
    declare: [
        {
            displayName: 'Lookup Method',
            name: 'lookup_method',
            type: 'options',
            required: true,
            default: 'shipment_id',
            options: [
                {
                    name: 'By Shipment ID',
                    value: 'shipment_id',
                    description: 'Look up using the shipment number from Run ERP',
                },
                {
                    name: 'By Reference Number',
                    value: 'reference',
                    description: 'Look up using your identification letters + reference number',
                },
            ],
            description: 'How to identify the shipment for tracking',
            displayOptions: { show: { resource: ['tracking'], operation: ['get_tracking'] } },
        },
        {
            displayName: 'Shipment ID',
            name: 'shipment_id',
            type: 'number',
            required: true,
            default: '',
            description: 'The shipment number (ship_create_num) returned from create shipment',
            displayOptions: {
                show: {
                    resource: ['tracking'],
                    operation: ['get_tracking'],
                    lookup_method: ['shipment_id'],
                }
            },
        },
        {
            displayName: 'Reference with Prefix',
            name: 'reference_with_prefix',
            type: 'string',
            required: true,
            default: '',
            placeholder: 'AB987654321',
            description: 'Your identification letters at the shipping company + your reference number (e.g., AB987654321)',
            displayOptions: {
                show: {
                    resource: ['tracking'],
                    operation: ['get_tracking'],
                    lookup_method: ['reference'],
                }
            },
        },
        {
            displayName: 'Tracking Info',
            name: 'trackingNotice',
            type: 'notice',
            default: '',
            displayOptions: { show: { resource: ['tracking'], operation: ['get_tracking'] } },
            // @ts-ignore - notice type supports this
            typeOptions: {
                noticeType: 'info',
            },
        },
    ] as INodeProperties[],

    process: (
        params: Record<string, any>,
        i: number,
        getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => any
    ): Record<string, any> => {
        const lookupMethod = getNodeParameter('lookup_method', i) as string;

        if (lookupMethod === 'shipment_id') {
            params.shipment_id = getNodeParameter('shipment_id', i) as number;
        } else {
            params.reference_with_prefix = getNodeParameter('reference_with_prefix', i) as string;
        }

        return params;
    },
};